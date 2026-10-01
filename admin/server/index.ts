import http,{type IncomingMessage,type ServerResponse} from 'node:http';
import { createHash,randomBytes,randomUUID } from 'node:crypto';
import { readFile,stat,writeFile,unlink } from 'node:fs/promises';
import path from 'node:path';
import { z,ZodError } from 'zod';
import { port,publicPort,publicUiPort,uiPort,publicOrigins,projectRoot,allowedOrigins,sessionCookie,sessionLifetime } from './config.js';
import { hashPassword,verifyPassword,dummyPasswordHash } from './passwords.js';
import * as store from './store.js';
import { kindSchema,settingsSchema,categoryKinds,categoryNameSchema,validateRecord as modelValidateRecord,type Kind,type CategoryLists } from '../src/admin-model.js';
import {stream,closeStreams,changed} from './live.js';
import {mailConfigured,queueMail,flushMail,mailSummary,recordMail,retryMail} from './mailer.js';
import {issueCode,consumeCode} from './verification.js';
import {initializeAdminAccount} from './initial-admin.js';
class HttpError extends Error{constructor(public status:number,message:string){super(message);}}
function validateRecord(kind:Kind,input:unknown,categories?:CategoryLists){try{return modelValidateRecord(kind,input,categories);}catch(error){if(error instanceof ZodError)throw error;throw new HttpError(400,(error as Error).message);}}
const usernameSchema=z.string().trim().min(1,'Enter a username.').max(120);
const accountSchema=z.object({username:usernameSchema,password:z.string().min(8,'Use a password with at least 8 characters.').max(128)}).strict();
const revisions=z.object({revision:z.number().int().nonnegative()}).strict();
const failures=new Map<string,{count:number;until:number}>();
function json(response:ServerResponse,status:number,data:unknown){response.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});response.end(JSON.stringify(data));}
function sessionHash(request:IncomingMessage){const cookie=request.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length+1);if(!cookie||! /^[a-f0-9]{64}$/.test(cookie))return null;return createHash('sha256').update(cookie).digest('hex');}
function currentUser(request:IncomingMessage){const hash=sessionHash(request);return hash?store.userForSession(hash):undefined;}
function requireUser(request:IncomingMessage){const user=currentUser(request);if(!user)throw new HttpError(401,'Your session has expired. Please log in.');return user;}
function requireOrigin(request:IncomingMessage,origins=allowedOrigins){if(!request.headers.origin||!origins.has(request.headers.origin)||request.headers['sec-fetch-site']==='cross-site')throw new HttpError(403,'Please reload this page and try again.');}
async function body(request:IncomingMessage,max:number){if(Number(request.headers['content-length']??0)>max)throw new HttpError(413,'The submitted file or record is too large.');let total=0;const chunks:Buffer[]=[];for await(const chunk of request){const part=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);total+=part.length;if(total>max)throw new HttpError(413,'The submitted file or record is too large.');chunks.push(part);}return Buffer.concat(chunks,total);}
async function readJson(request:IncomingMessage){if(!request.headers['content-type']?.includes('application/json'))throw new HttpError(415,'Use a JSON request.');try{return JSON.parse((await body(request,70000)).toString('utf8')) as unknown;}catch(error){if(error instanceof HttpError)throw error;throw new HttpError(400,'Could not read the submitted form.');}}
function newSession(response:ServerResponse,user:store.User){const token=randomBytes(32).toString('hex');store.saveSession(createHash('sha256').update(token).digest('hex'),user.id,Date.now()+sessionLifetime);response.setHeader('Set-Cookie',`${sessionCookie}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionLifetime/1000}`);return {authenticated:true,account:{username:user.username,name:null}};}
function assetBelongsToUser(owner:string,imagePath?:string){if(imagePath?.startsWith('/api/media/')&&!store.findAsset(owner,imagePath.split('/').pop()!))throw new HttpError(400,'Photo not found. Upload it again.');}
function checkAttempts(request:IncomingMessage){const key=request.socket.remoteAddress??'local',attempts=failures.get(key);if(attempts&&attempts.until>Date.now()&&attempts.count>=8)throw new HttpError(429,'Too many login attempts. Please wait 10 minutes.');return key;}
function failedAttempt(key:string){const existing=failures.get(key);failures.set(key,{count:existing&&existing.until>Date.now()?existing.count+1:1,until:Date.now()+10*60*1000});}
async function api(request:IncomingMessage,response:ServerResponse,url:URL){
 const method=request.method??'GET',route=url.pathname;
 if(method!=='GET'&&method!=='HEAD')requireOrigin(request);
 if(route==='/api/auth/session'&&method==='GET'){const user=currentUser(request);return json(response,200,{authenticated:!!user,...(user?{account:{username:user.username,name:null}}:{})});}
 if(route==='/api/auth/setup')throw new HttpError(404,'This action was not found.');
 if(route==='/api/auth/login'&&method==='POST'){
  const key=checkAttempts(request),input=accountSchema.parse(await readJson(request)),user=store.findUser(input.username);
  const valid=await verifyPassword(input.password,user?.password_hash??dummyPasswordHash);
  if(!user||!valid){failedAttempt(key);throw new HttpError(401,'Username or password is incorrect.');}
  failures.delete(key);return json(response,200,newSession(response,user));
 }
 if(route==='/api/auth/logout'&&method==='POST'){const hash=sessionHash(request);if(hash)store.removeSession(hash);response.setHeader('Set-Cookie',`${sessionCookie}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);return json(response,200,{signedOut:true});}
 if(route==='/api/auth/reset/request'&&method==='POST'){
  rate(request,'reset',5,60*60*1000);
  if(!mailConfigured)throw new HttpError(503,'Email verification is unavailable. Please contact the administrator.');
  const input=z.object({username:usernameSchema}).strict().parse(await readJson(request)),user=store.findUser(input.username);
  if(user){try{await issueCode(user,'reset','reset');}catch{ /* Keep account existence private. */ }}
  return json(response,200,{message:'If this account has a recovery email configured, a code has been sent. Check your inbox and spam folder.'});
 }
 if(route==='/api/auth/reset/confirm'&&method==='POST'){
  rate(request,'reset-confirm',10,60*60*1000);
  const input=z.object({username:usernameSchema,code:z.string().regex(/^\d{6}$/),newPassword:z.string().min(8).max(128)}).strict().parse(await readJson(request)),user=store.findUser(input.username);
  if(!user||!consumeCode(user,'reset','reset',input.code))throw new HttpError(400,'This verification code is invalid, expired, or already used.');
  store.changePassword(user.id,await hashPassword(input.newPassword));changed(user.id);return json(response,200,{passwordChanged:true});
 }
 const user=requireUser(request);
 if(route==='/api/admin/stream'&&method==='GET')return stream(response,user.id,()=>!!currentUser(request));
 if(route==='/api/auth/password/code'&&method==='POST'){
  rate(request,'change-code',5,60*60*1000);
  const input=z.object({currentPassword:z.string().min(1).max(128)}).strict().parse(await readJson(request));
  if(!await verifyPassword(input.currentPassword,user.password_hash))throw new HttpError(400,'Your current password is incorrect.');
  try{await issueCode(user,'change',sessionHash(request)!);}catch(error){throw new HttpError(400,(error as Error).message);}
  return json(response,200,{message:'A six-digit verification code was emailed to your admin recovery address.'});
 }
 if(route==='/api/auth/password'&&method==='PATCH'){
  const input=z.object({currentPassword:z.string().min(1).max(128),newPassword:z.string().min(8,'Use at least 8 characters.').max(128),code:z.string().regex(/^\d{6}$/,'Enter the six-digit verification code.')}).strict().parse(await readJson(request));
  if(!await verifyPassword(input.currentPassword,user.password_hash))throw new HttpError(400,'Your current password is incorrect.');
  if(!consumeCode(user,'change',sessionHash(request)!,input.code))throw new HttpError(400,'This verification code is invalid, expired, or already used.');
  store.changePassword(user.id,await hashPassword(input.newPassword),sessionHash(request)!);changed(user.id);return json(response,200,{passwordChanged:true});
 }
 if(route==='/api/admin'&&method==='GET')return json(response,200,{...store.getPortal(user.id),mail:mailSummary(user.id),recoveryEmail:user.recovery_email||process.env.ADMIN_RECOVERY_EMAIL||''});
 const categoryRoute=route.match(/^\/api\/categories\/([^/]+)$/);
 if(categoryRoute&&method==='POST'){
  const kind=z.enum(categoryKinds).parse(categoryRoute[1]),input=z.object({name:categoryNameSchema}).strict().parse(await readJson(request));
  const saved=store.createCategory(user.id,kind,input.name);
  return json(response,saved.created?201:200,{...saved,categories:store.getCategories(user.id)});
 }
 if(route==='/api/mail/retry'&&method==='POST'){retryMail(user.id);return json(response,200,{queued:true});}
 const messageRoute=route.match(/^\/api\/messages\/([a-f0-9-]+)\/(delivery|reply|retry)$/);
 if(messageRoute){const record=store.findRecord(user.id,messageRoute[1]);if(!record||record.kind!=='messages')throw new HttpError(404,'Message not found.');
  if(method==='GET'&&messageRoute[2]==='delivery')return json(response,200,{configured:mailConfigured,deliveries:recordMail(user.id,record.id)});
  if(method==='POST'&&messageRoute[2]==='retry'){retryMail(user.id,record.id);return json(response,200,{queued:true});}
  if(method==='POST'&&messageRoute[2]==='reply'){
   const input=z.object({text:z.string().trim().min(1).max(4000),requestId:z.string().uuid()}).strict().parse(await readJson(request));
   if(!z.string().email().safeParse(record.data.email).success)throw new HttpError(400,'This message has no valid reply address.');
   if(!mailConfigured)throw new HttpError(503,'Email delivery is unavailable.');
   const school=store.getPortal(user.id).settings;
   queueMail(user.id,record.id,`reply:${input.requestId}`,{to:record.data.email,replyTo:school.email,subject:`Re: ${record.data.subject}`,text:`${input.text}\n\n${school.schoolName}\n${school.email}\n${school.phone}`});
   changed(user.id);void flushMail();return json(response,202,{queued:true});
  }
 }
 if(route==='/api/settings'&&method==='PATCH'){
  const input=z.object({settings:settingsSchema,revision:z.number().int().nonnegative()}).strict().parse(await readJson(request));
  if(!store.updateSettings(user.id,input.settings,input.revision))throw new HttpError(409,'Settings changed in another session. Reload before saving.');
  return json(response,200,{settings:input.settings,settingsRevision:input.revision+1});
 }
 const recordRoute=route.match(/^\/api\/records\/([^/]+)(?:\/([^/]+))?$/);
 if(recordRoute){
  const kind=kindSchema.parse(recordRoute[1]),id=recordRoute[2];
  if(method==='POST'&&!id){
   if(kind==='reviews')throw new HttpError(403,'Reviews are submitted by parents on the website. Admins can approve, hide, or remove them.');
   const input=validateRecord(kind,await readJson(request),store.getCategories(user.id));
   if(input.id||input.revision!==undefined)throw new HttpError(400,'New records cannot include an existing ID.');
   assetBelongsToUser(user.id,input.data.imagePath);return json(response,201,store.createRecord(user.id,kind,input));
  }
  const existing=id?store.findRecord(user.id,id):null;if(!existing||existing.kind!==kind)throw new HttpError(404,'Record not found.');
  if(method==='PATCH'){
   if(kind==='reviews'){const candidate=await readJson(request);const input=validateRecord(kind,candidate);if(input.name!==existing.name||['rating','body','date'].some(key=>input.data[key]!==existing.data[key]))throw new HttpError(400,'Parent reviews can only be approved or hidden.');if(input.revision===undefined)throw new HttpError(400,'Reload this review.');const saved=store.updateRecord(user.id,id,kind,{name:existing.name,status:input.status,data:existing.data,revision:input.revision});if(!saved)throw new HttpError(409,'This review changed. Refresh before saving.');return json(response,200,saved);}
   const input=validateRecord(kind,await readJson(request),store.getCategories(user.id));if(input.revision===undefined)throw new HttpError(400,'Reload this record before editing.');assetBelongsToUser(user.id,input.data.imagePath);
   const changed=store.updateRecord(user.id,id,kind,{...input,revision:input.revision});if(!changed)throw new HttpError(409,'This record changed in another session. Reload before saving.');
   if(existing.data.imagePath!==input.data.imagePath)await cleanupPhoto(user.id,existing.data.imagePath);return json(response,200,changed);
  }
  if(method==='DELETE'){
   const input=revisions.parse(await readJson(request));if(!store.removeRecord(user.id,id,kind,input.revision))throw new HttpError(409,'This record has changed. Reload before removing it.');
   await cleanupPhoto(user.id,existing.data.imagePath);return json(response,200,{removed:id});
  }
 }
 if(route==='/api/uploads'&&method==='POST'){
  const bytes=await body(request,8*1024*1024);if(bytes.length<12)throw new HttpError(400,'Choose a valid JPEG, PNG, or WebP photo.');
  const signature=bytes.subarray(0,12);let mime='';
  if(signature[0]===255&&signature[1]===216&&signature[2]===255)mime='image/jpeg';
  else if(signature.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))mime='image/png';
  else if(signature.toString('ascii',0,4)==='RIFF'&&signature.toString('ascii',8,12)==='WEBP')mime='image/webp';
  if(!mime||mime!==request.headers['content-type'])throw new HttpError(400,'Choose a valid JPEG, PNG, or WebP photo smaller than 8 MB.');
  let filename='photo';try{filename=decodeURIComponent(String(request.headers['x-file-name']??'photo')).slice(0,200);}catch{throw new HttpError(400,'The photo filename is invalid.');}
  const id=randomUUID(),storage_key=`${id}.${mime==='image/jpeg'?'jpg':mime==='image/png'?'png':'webp'}`,destination=path.join(store.uploadsDirectory,storage_key);
  await writeFile(destination,bytes,{flag:'wx',mode:0o600});try{store.saveAsset({id,owner_id:user.id,storage_key,mime,filename,size:bytes.length});}catch(error){await unlink(destination);throw error;}
  return json(response,201,{imagePath:`/api/media/${id}`});
 }
 const media=route.match(/^\/api\/media\/([a-f0-9-]+)$/);
 if(media&&method==='GET'){const asset=store.findAsset(user.id,media[1]);if(!asset)throw new HttpError(404,'Photo not found.');const bytes=await readFile(path.join(store.uploadsDirectory,asset.storage_key));response.writeHead(200,{'Content-Type':asset.mime,'Content-Length':bytes.length,'Cache-Control':'private, no-store'});return response.end(bytes);}
 throw new HttpError(404,'This action was not found.');
}
async function cleanupPhoto(owner:string,imagePath?:string){if(!imagePath?.startsWith('/api/media/'))return;try{const asset=store.unusedAsset(owner,imagePath);if(asset)await unlink(path.join(store.uploadsDirectory,asset.storage_key));}catch(error){console.error('Photo cleanup failed:',error instanceof Error?error.message:'Unknown error');}}
const rateLimits=new Map<string,{count:number;until:number}>();
function rate(request:IncomingMessage,purpose:string,limit:number,window:number){const now=Date.now(),key=`${request.socket.remoteAddress}:${purpose}`;if(rateLimits.size>5000)for(const[k,v]of rateLimits)if(v.until<now)rateLimits.delete(k);const row=rateLimits.get(key);if(row&&row.until>now){if(row.count>=limit)throw new HttpError(429,'Too many requests. Please wait before trying again.');row.count++;}else rateLimits.set(key,{count:1,until:now+window});}
const publicBase={requestId:z.string().uuid(),website:z.string().max(0).optional()};
const text=(max:number)=>z.string().trim().min(2).max(max);
const mobile=z.string().regex(/^[0-9]{10}$/,'Phone must contain exactly 10 digits after +977.');
const email=z.string().trim().email().max(200);
async function publicApi(request:IncomingMessage,response:ServerResponse,url:URL){
 const route=url.pathname,method=request.method??'GET';
 if(method!=='GET'&&method!=='HEAD')requireOrigin(request,publicOrigins);
 if(route==='/api/public/content'&&method==='GET')return json(response,200,store.publicContent());
 if(route==='/api/public/stream'&&method==='GET')return stream(response);
 const media=route.match(/^\/api\/media\/([a-f0-9-]+)$/);
 if(media&&method==='GET'){const asset=store.publicAsset(media[1]);if(!asset)throw new HttpError(404,'Photo not found.');const bytes=await readFile(path.join(store.uploadsDirectory,asset.storage_key));response.writeHead(200,{'Content-Type':asset.mime,'Content-Length':bytes.length,'Cache-Control':'no-store'});return response.end(bytes);}
 const match=route.match(/^\/api\/public\/(messages|admissions|reviews)$/);
 if(!match||method!=='POST')throw new HttpError(404,'This public action was not found.');
 rate(request,'website-submissions',30,60*60*1000);
 const kind=match[1] as 'messages'|'admissions'|'reviews',owner=store.schoolOwner(),settings=store.getPortal(owner).settings,raw=await readJson(request);
 let name:string,data:Record<string,string>,requestId:string;
 if(kind==='messages'){
  const input=z.object({...publicBase,name:text(120),phone:mobile,email,subject:text(160),body:text(4000)}).strict().parse(raw);
  name=input.name;requestId=input.requestId;data={phone:input.phone,email:input.email,subject:input.subject,body:input.body,date:schoolToday(),source:'Website'};
 }else if(kind==='admissions'){
  const input=z.object({...publicBase,childName:text(120),birthDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),gender:z.enum(['Female','Male','Other','Prefer not to say']),program:text(160),guardianName:text(120),phone:mobile,email,address:text(250),previousSchool:z.string().trim().max(160),medicalConditions:z.string().trim().max(400),referral:z.string().trim().max(160)}).strict().parse(raw);
  if(input.birthDate>schoolToday()||!Number.isFinite(new Date(input.birthDate).getTime())||new Date(input.birthDate).toISOString().slice(0,10)!==input.birthDate)throw new HttpError(400,'Enter a valid date of birth that is not in the future.');
  if(!store.getPortal(owner).records.some(r=>r.kind==='programs'&&r.status==='Published'&&r.name===input.program))throw new HttpError(400,'This program is unavailable. Choose a current program.');
  name=input.childName;requestId=input.requestId;data={program:input.program,birthDate:input.birthDate,gender:input.gender,guardian:input.guardianName,phone:input.phone,email:input.email,address:input.address,previousSchool:input.previousSchool,medicalConditions:input.medicalConditions,referral:input.referral,date:schoolToday(),source:'Website'};
 }else{
  const input=z.object({...publicBase,name:text(120),rating:z.enum(['1','2','3','4','5']),body:text(2000)}).strict().parse(raw);
  name=input.name;requestId=input.requestId;data={rating:input.rating,body:input.body,date:schoolToday(),source:'Website'};
 }
 const input=validateRecord(kind,{name,status:kind==='messages'?'Unread':'Pending',data});input.data.source='Website';
 const record=store.submitPublic(owner,requestId,kind,input,record=>{
  if(kind!=='reviews')queueMail(owner,record.id,`submission:${requestId}`,{to:settings.email,replyTo:data.email,subject:kind==='messages'?`Website enquiry: ${data.subject}`:`Enrollment application: ${name}`,text:[settings.schoolName,kind==='messages'?'New website enquiry':'New enrollment application',`Name: ${name}`,...Object.entries(data).map(([key,value])=>`${key}: ${key==='phone'?'+977 ':''}${value}`),'',kind==='messages'?'Reply to this email to contact the sender.':'View this application in the admin panel.'].join('\n')});
 });
 changed(owner);void flushMail();
 return json(response,201,{received:true,reference:record.id,message:kind==='reviews'?'Thank you. Your review will appear after the school approves it.':'Thank you. Your submission has been received by the school.'});
}
function schoolToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Katmandu',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
const mimeTypes:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
async function serveStatic(request:IncomingMessage,response:ServerResponse,url:URL,publicSite=false){
 if(request.method!=='GET'&&request.method!=='HEAD')throw new HttpError(405,'This method is not allowed.');
 let pathname:string;try{pathname=decodeURIComponent(url.pathname);}catch{throw new HttpError(400,'Invalid path.');}
 if(pathname.includes('\0')||pathname.split('/').some(part=>part==='..'||part.startsWith('.'))||pathname.includes('\\'))throw new HttpError(404,'File not found.');
 const directory=publicSite?path.resolve(projectRoot,'../website/dist'):path.join(projectRoot,'dist');
 const directories=[directory];
 // Imported gallery/blog records keep the website's /assets/ photo paths.
 // Share only public images; uploaded/private photos still use the guarded media API.
 if(!publicSite&&/^\/assets\/.+\.(?:jpe?g|png|webp|svg)$/i.test(pathname)){
  directories.push(path.join(projectRoot,'public'),path.resolve(projectRoot,'../website/dist'),path.resolve(projectRoot,'../website/public'));
 }
 let file:string|undefined;
 for(const root of directories){
  const candidate=path.join(root,pathname);
  try{if((await stat(candidate)).isFile()){file=candidate;break;}}catch(error){if(!['ENOENT','ENOTDIR'].includes((error as NodeJS.ErrnoException).code??''))throw error;}
 }
 if(!file){
  if((publicSite&&['/','/about','/programs','/admissions','/enroll','/team','/gallery','/events','/blog','/contact','/reviews'].includes(pathname.replace(/\/$/, '')||'/'))||(!publicSite&&(pathname==='/'||pathname==='/login'||pathname==='/admin'||pathname.startsWith('/admin/'))))file=path.join(directory,'index.html');
  else throw new HttpError(404,'File not found.');
 }
 let bytes:Buffer;try{bytes=await readFile(file);}catch{throw new HttpError(503,'The website is temporarily unavailable. Please try again.');}
 response.writeHead(200,{'Content-Type':mimeTypes[path.extname(file)]??'application/octet-stream','Content-Length':bytes.length,'Cache-Control':file.endsWith('index.html')?'no-store':'public, max-age=3600'});response.end(request.method==='HEAD'?undefined:bytes);
}
function makeServer(publicSite:boolean){const server=http.createServer(async(request,response)=>{
 response.setHeader('X-Content-Type-Options','nosniff');response.setHeader('X-Frame-Options','DENY');response.setHeader('Referrer-Policy','same-origin');
 try{
  const host=request.headers.host,apiPort=publicSite?publicPort:port,webPort=publicSite?publicUiPort:uiPort;if(!host||!new Set([`localhost:${apiPort}`,`127.0.0.1:${apiPort}`,`localhost:${webPort}`,`127.0.0.1:${webPort}`]).has(host))throw new HttpError(403,'This address is unavailable.');
  const url=new URL(request.url??'/',`http://${host}`);
  if(url.pathname.startsWith('/api/')){
   if(publicSite||url.pathname.startsWith('/api/public/'))await publicApi(request,response,url);else await api(request,response,url);
  }else await serveStatic(request,response,url,publicSite);
 }catch(error){
  if(response.headersSent){response.end();return;}
  if(error instanceof HttpError)json(response,error.status,{error:error.message});
  else if(error instanceof ZodError)json(response,400,{error:error.issues[0]?.message??'Check the form fields.'});
  else if(error instanceof Error&&(/required|valid|Choose|characters|too long|Add a photo/.test(error.message)))json(response,400,{error:error.message});
  else {console.error('Admin request failed:',error instanceof Error?error.message:'Unknown error');json(response,503,{error:'Could not complete the action. Please try again.'});}
 }
});
server.requestTimeout=30000;server.headersTimeout=15000;
server.on('error',(error:NodeJS.ErrnoException)=>{console.error(error.code==='EADDRINUSE'?`Port ${publicSite?publicPort:port} is already in use. Stop the other server, or change the port in admin/.env.`:error.message);process.exit(1);});
return server;}
await initializeAdminAccount();
store.schoolOwner();
const adminServer=makeServer(false),websiteServer=makeServer(true);
adminServer.listen(port,'127.0.0.1',()=>console.log(`Admin: http://localhost:${port}`));
websiteServer.listen(publicPort,'127.0.0.1',()=>console.log(`Website: http://localhost:${publicPort}`));
const mailTimer=setInterval(()=>void flushMail(),30000);mailTimer.unref();void flushMail();
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>{closeStreams();clearInterval(mailTimer);let closed=0;for(const server of [adminServer,websiteServer])server.close(()=>{if(++closed===2){store.db.close();process.exit(0);}});});

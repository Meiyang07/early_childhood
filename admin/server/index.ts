import http,{type IncomingMessage,type ServerResponse} from 'node:http';
import { createHash,randomBytes,randomUUID } from 'node:crypto';
import { readFile,stat,writeFile,unlink } from 'node:fs/promises';
import path from 'node:path';
import { z,ZodError } from 'zod';
import { port,projectRoot,allowedOrigins,sessionCookie,sessionLifetime } from './config.js';
import { hashPassword,verifyPassword,dummyPasswordHash } from './passwords.js';
import * as store from './store.js';
import { kindSchema,settingsSchema,validateRecord } from '../src/admin-model.js';


class HttpError extends Error{constructor(public status:number,message:string){super(message);}}
const accountSchema=z.object({username:z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9_.-]+$/,'Use letters, numbers, dots, underscores, or hyphens.'),password:z.string().min(8,'Use a password with at least 8 characters.').max(128)}).strict();
const revisions=z.object({revision:z.number().int().nonnegative()}).strict();
const failures=new Map<string,{count:number;until:number}>();
function json(response:ServerResponse,status:number,data:unknown){response.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});response.end(JSON.stringify(data));}
function sessionHash(request:IncomingMessage){const cookie=request.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length+1);if(!cookie||! /^[a-f0-9]{64}$/.test(cookie))return null;return createHash('sha256').update(cookie).digest('hex');}
function currentUser(request:IncomingMessage){const hash=sessionHash(request);return hash?store.userForSession(hash):undefined;}
function requireUser(request:IncomingMessage){const user=currentUser(request);if(!user)throw new HttpError(401,'Your session has expired. Please log in.');return user;}
function requireOrigin(request:IncomingMessage){if(!request.headers.origin||!allowedOrigins.has(request.headers.origin)||request.headers['sec-fetch-site']==='cross-site')throw new HttpError(403,'Open this form from your local admin panel.');}
async function body(request:IncomingMessage,max:number){if(Number(request.headers['content-length']??0)>max)throw new HttpError(413,'The submitted file or record is too large.');let total=0;const chunks:Buffer[]=[];for await(const chunk of request){const part=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);total+=part.length;if(total>max)throw new HttpError(413,'The submitted file or record is too large.');chunks.push(part);}return Buffer.concat(chunks,total);}
async function readJson(request:IncomingMessage){if(!request.headers['content-type']?.includes('application/json'))throw new HttpError(415,'Use a JSON request.');try{return JSON.parse((await body(request,70000)).toString('utf8')) as unknown;}catch(error){if(error instanceof HttpError)throw error;throw new HttpError(400,'Could not read the submitted form.');}}
function newSession(response:ServerResponse,user:store.User){const token=randomBytes(32).toString('hex');store.saveSession(createHash('sha256').update(token).digest('hex'),user.id,Date.now()+sessionLifetime);response.setHeader('Set-Cookie',`${sessionCookie}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionLifetime/1000}`);return {authenticated:true,setupNeeded:false,account:{username:user.username,name:null}};}
function assetBelongsToUser(owner:string,imagePath?:string){if(imagePath?.startsWith('/api/media/')&&!store.findAsset(owner,imagePath.split('/').pop()!))throw new HttpError(400,'Photo not found. Upload it again.');}
function checkAttempts(request:IncomingMessage){const key=request.socket.remoteAddress??'local',attempts=failures.get(key);if(attempts&&attempts.until>Date.now()&&attempts.count>=8)throw new HttpError(429,'Too many login attempts. Please wait 10 minutes.');return key;}
function failedAttempt(key:string){const existing=failures.get(key);failures.set(key,{count:existing&&existing.until>Date.now()?existing.count+1:1,until:Date.now()+10*60*1000});}
async function api(request:IncomingMessage,response:ServerResponse,url:URL){
 const method=request.method??'GET',route=url.pathname;
 if(method!=='GET'&&method!=='HEAD')requireOrigin(request);
 if(route==='/api/auth/session'&&method==='GET'){const user=currentUser(request);return json(response,200,{authenticated:!!user,setupNeeded:store.setupNeeded(),...(user?{account:{username:user.username,name:null}}:{})});}
 if(route==='/api/auth/setup'&&method==='POST'){
  if(!store.setupNeeded())throw new HttpError(409,'Your admin account is already configured. Please log in.');
  const input=accountSchema.parse(await readJson(request)),hash=await hashPassword(input.password);
  let user;try{user=store.createUser(input.username,hash);}catch(error){throw new HttpError(409,error instanceof Error?error.message:'An admin account already exists.');}
  store.getPortal(user.id);return json(response,201,newSession(response,user));
 }
 if(route==='/api/auth/login'&&method==='POST'){
  const key=checkAttempts(request),input=accountSchema.parse(await readJson(request)),user=store.findUser(input.username);
  const valid=await verifyPassword(input.password,user?.password_hash??dummyPasswordHash);
  if(!user||!valid){failedAttempt(key);throw new HttpError(401,'Username or password is incorrect.');}
  failures.delete(key);return json(response,200,newSession(response,user));
 }
 if(route==='/api/auth/logout'&&method==='POST'){const hash=sessionHash(request);if(hash)store.removeSession(hash);response.setHeader('Set-Cookie',`${sessionCookie}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);return json(response,200,{signedOut:true});}
 const user=requireUser(request);
 if(route==='/api/auth/password'&&method==='PATCH'){
  const input=z.object({currentPassword:z.string().min(1).max(128),newPassword:z.string().min(8,'Use at least 8 characters.').max(128)}).strict().parse(await readJson(request));
  if(!await verifyPassword(input.currentPassword,user.password_hash))throw new HttpError(400,'Your current password is incorrect.');
  store.changePassword(user.id,await hashPassword(input.newPassword),sessionHash(request)!);return json(response,200,{passwordChanged:true});
 }
 if(route==='/api/admin'&&method==='GET')return json(response,200,store.getPortal(user.id));
 if(route==='/api/settings'&&method==='PATCH'){
  const input=z.object({settings:settingsSchema,revision:z.number().int().nonnegative()}).strict().parse(await readJson(request));
  if(!store.updateSettings(user.id,input.settings,input.revision))throw new HttpError(409,'Settings changed in another session. Reload before saving.');
  return json(response,200,{settings:input.settings,settingsRevision:input.revision+1});
 }
 const recordRoute=route.match(/^\/api\/records\/([^/]+)(?:\/([^/]+))?$/);
 if(recordRoute){
  const kind=kindSchema.parse(recordRoute[1]),id=recordRoute[2];
  if(method==='POST'&&!id){
   const input=validateRecord(kind,await readJson(request));
   if(input.id||input.revision!==undefined)throw new HttpError(400,'New records cannot include an existing ID.');
   assetBelongsToUser(user.id,input.data.imagePath);return json(response,201,store.createRecord(user.id,kind,input));
  }
  const existing=id?store.findRecord(user.id,id):null;if(!existing||existing.kind!==kind)throw new HttpError(404,'Record not found.');
  if(method==='PATCH'){
   const input=validateRecord(kind,await readJson(request));if(input.revision===undefined)throw new HttpError(400,'Reload this record before editing.');assetBelongsToUser(user.id,input.data.imagePath);
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
const mimeTypes:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
async function serveStatic(request:IncomingMessage,response:ServerResponse,url:URL){
 if(request.method!=='GET'&&request.method!=='HEAD')throw new HttpError(405,'This method is not allowed.');
 let pathname:string;try{pathname=decodeURIComponent(url.pathname);}catch{throw new HttpError(400,'Invalid path.');}
 if(pathname.includes('\0')||pathname.split('/').some(part=>part==='..'||part.startsWith('.'))||pathname.includes('\\'))throw new HttpError(404,'File not found.');
 const directory=path.join(projectRoot,'dist');let file=path.join(directory,pathname);
 try{if(!(await stat(file)).isFile())throw new Error('Not a file');}catch{if(pathname==='/'||pathname==='/login'||pathname==='/admin'||pathname.startsWith('/admin/'))file=path.join(directory,'index.html');else throw new HttpError(404,'File not found.');}
 let bytes:Buffer;try{bytes=await readFile(file);}catch{throw new HttpError(503,'Build the project first with pnpm build, then run pnpm start.');}
 response.writeHead(200,{'Content-Type':mimeTypes[path.extname(file)]??'application/octet-stream','Content-Length':bytes.length,'Cache-Control':file.endsWith('index.html')?'no-store':'public, max-age=3600'});response.end(request.method==='HEAD'?undefined:bytes);
}
const server=http.createServer(async(request,response)=>{
 response.setHeader('X-Content-Type-Options','nosniff');response.setHeader('X-Frame-Options','DENY');response.setHeader('Referrer-Policy','same-origin');
 try{
  const host=request.headers.host;if(!host||!new Set([`localhost:${port}`,`127.0.0.1:${port}`,`localhost:${process.env.ADMIN_UI_PORT??5175}`,`127.0.0.1:${process.env.ADMIN_UI_PORT??5175}`]).has(host))throw new HttpError(403,'Use the local admin address.');
  const url=new URL(request.url??'/',`http://${host}`);if(url.pathname.startsWith('/api/'))await api(request,response,url);else await serveStatic(request,response,url);
 }catch(error){
  if(response.headersSent){response.end();return;}
  if(error instanceof HttpError)json(response,error.status,{error:error.message});
  else if(error instanceof ZodError)json(response,400,{error:error.issues[0]?.message??'Check the form fields.'});
  else if(error instanceof Error&&(/required|valid|Choose|characters|too long|Add a photo/.test(error.message)))json(response,400,{error:error.message});
  else {console.error('Admin request failed:',error instanceof Error?error.message:'Unknown error');json(response,503,{error:'Could not complete the action. Please try again.'});}
 }
});
server.requestTimeout=30000;server.headersTimeout=15000;
server.on('error',(error:NodeJS.ErrnoException)=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use. Stop the other admin server, or change ADMIN_PORT in .env.`:error.message);store.db.close();process.exit(1);});
server.listen(port,'127.0.0.1',()=>console.log(`Early Childhood Admin: http://localhost:${port}\nData: ${path.join(store.uploadsDirectory,'..')}`));
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>server.close(()=>{store.db.close();process.exit(0);}));

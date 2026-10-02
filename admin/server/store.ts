import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { dataDirectory } from './config.js';
import { seeds } from './connected-seeds.js';
import { siteSeeds } from './site-seed.js';
import { changed } from './live.js';
import { defaultSettings,defaultCategories,categoryKinds,recordCategories,normalizeCategory,categoryNameSchema,type CategoryKind,type CategoryLists,type AdminRecord,type Kind,type PortalData,type Settings } from '../src/admin-model.js';
export type User={id:string;username:string;password_hash:string;recovery_email:string};
type Row={id:string;kind:Kind;name:string;status:string;data:string;revision:number;created_at:string;updated_at:string};
export type Asset={id:string;owner_id:string;storage_key:string;mime:string;filename:string;size:number};
mkdirSync(dataDirectory,{recursive:true,mode:0o700});
export const uploadsDirectory=path.join(dataDirectory,'uploads');
mkdirSync(uploadsDirectory,{recursive:true,mode:0o700});
export const db=new DatabaseSync(path.join(dataDirectory,'admin.sqlite'));
db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
const version=(db.prepare('PRAGMA user_version').get() as {user_version:number}).user_version;
if(version===0){db.exec(`BEGIN IMMEDIATE;
CREATE TABLE admin_users(id TEXT PRIMARY KEY,username TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL);
CREATE TABLE admin_sessions(token_hash TEXT PRIMARY KEY,owner_id TEXT NOT NULL REFERENCES admin_users(id),expires_at INTEGER NOT NULL);
CREATE TABLE admin_records(owner_id TEXT NOT NULL REFERENCES admin_users(id),id TEXT NOT NULL,kind TEXT NOT NULL,name TEXT NOT NULL,status TEXT NOT NULL,data TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,PRIMARY KEY(owner_id,id));
CREATE TABLE admin_settings(owner_id TEXT PRIMARY KEY REFERENCES admin_users(id),data TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 0);
CREATE TABLE admin_assets(id TEXT PRIMARY KEY,owner_id TEXT NOT NULL REFERENCES admin_users(id),storage_key TEXT NOT NULL,mime TEXT NOT NULL,filename TEXT NOT NULL,size INTEGER NOT NULL);
PRAGMA user_version=1; COMMIT;`);}
if(version<2){db.exec(`BEGIN IMMEDIATE;
ALTER TABLE admin_users ADD COLUMN recovery_email TEXT NOT NULL DEFAULT '';
CREATE TABLE content_imports(owner_id TEXT PRIMARY KEY REFERENCES admin_users(id));
CREATE TABLE public_submissions(request_id TEXT PRIMARY KEY,kind TEXT NOT NULL,record_id TEXT NOT NULL);
CREATE TABLE mail_outbox(id INTEGER PRIMARY KEY AUTOINCREMENT,owner_id TEXT NOT NULL REFERENCES admin_users(id),record_id TEXT NOT NULL,dedup_key TEXT UNIQUE NOT NULL,payload TEXT NOT NULL,status TEXT NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,next_attempt INTEGER NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,sent_at TEXT);
CREATE TABLE password_codes(owner_id TEXT NOT NULL REFERENCES admin_users(id),purpose TEXT NOT NULL,code_hash TEXT NOT NULL,binding TEXT NOT NULL,expires_at INTEGER NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,created_at INTEGER NOT NULL,PRIMARY KEY(owner_id,purpose));
PRAGMA user_version=2; COMMIT;`);}
if(version<3){db.exec(`BEGIN IMMEDIATE;
CREATE TABLE admin_categories(owner_id TEXT NOT NULL REFERENCES admin_users(id),kind TEXT NOT NULL,name TEXT NOT NULL,normalized_name TEXT NOT NULL,PRIMARY KEY(owner_id,kind,normalized_name));
PRAGMA user_version=3; COMMIT;`);}
if(version<4){db.exec(`BEGIN IMMEDIATE;
CREATE TABLE auth_sessions(id TEXT PRIMARY KEY,owner_id TEXT NOT NULL REFERENCES admin_users(id),expires_at INTEGER NOT NULL,revoked_at INTEGER);
CREATE TABLE auth_tokens(token_hash TEXT PRIMARY KEY,session_id TEXT NOT NULL REFERENCES auth_sessions(id) ON DELETE CASCADE,kind TEXT NOT NULL CHECK(kind IN ('access','refresh')),expires_at INTEGER NOT NULL,used_at INTEGER);
CREATE INDEX auth_tokens_session ON auth_tokens(session_id);
CREATE INDEX auth_sessions_owner ON auth_sessions(owner_id);
DELETE FROM admin_sessions;
PRAGMA user_version=4; COMMIT;`);}
if(version>4)throw new Error('This data folder was created by a newer version of the admin project.');
db.prepare('DELETE FROM admin_sessions WHERE expires_at<?').run(Date.now());
function transaction<T>(action:()=>T):T{db.exec('BEGIN IMMEDIATE');try{const result=action();db.exec('COMMIT');return result;}catch(error){db.exec('ROLLBACK');throw error;}}
export function setupNeeded(){return Number((db.prepare("SELECT COUNT(*) AS count FROM admin_users WHERE username<>''").get() as {count:number}).count)===0;}
export const normalizeUsername=(username:string)=>username.trim().normalize('NFKC').toLowerCase();
export function findUser(username:string){const normalized=normalizeUsername(username);if(!normalized)return undefined;return db.prepare('SELECT id,username,password_hash,recovery_email FROM admin_users WHERE username=?').get(normalized) as User|undefined;}
export function schoolOwner(){let row=db.prepare('SELECT id FROM admin_users LIMIT 1').get() as {id:string}|undefined;if(!row){const id=randomUUID();db.prepare("INSERT INTO admin_users(id,username,password_hash) VALUES (?,'',?)").run(id,randomUUID());row={id};}getPortal(row.id);return row.id;}
export function createUser(username:string,passwordHash:string,email:string){return transaction(()=>{if(!setupNeeded())throw new Error('The admin account is already configured. Please log in.');const existing=db.prepare("SELECT id FROM admin_users WHERE username=''").get() as {id:string}|undefined;const id=existing?.id??randomUUID(),normalized=normalizeUsername(username);if(existing)db.prepare('UPDATE admin_users SET username=?,password_hash=?,recovery_email=? WHERE id=?').run(normalized,passwordHash,email,id);else db.prepare('INSERT INTO admin_users(id,username,password_hash,recovery_email) VALUES (?,?,?,?)').run(id,normalized,passwordHash,email);return {id,username:normalized,password_hash:passwordHash,recovery_email:email};});}
export function changePassword(owner:string,hash:string){transaction(()=>{
 db.prepare('UPDATE admin_users SET password_hash=? WHERE id=?').run(hash,owner);
 db.prepare('UPDATE auth_sessions SET revoked_at=? WHERE owner_id=? AND revoked_at IS NULL').run(Date.now(),owner);
 db.prepare('DELETE FROM admin_sessions WHERE owner_id=?').run(owner);
 db.prepare('DELETE FROM password_codes WHERE owner_id=?').run(owner);
});}
export type AuthSession={id:string;user:User;expiresAt:number;accessExpiresAt:number};
type AuthRow=User&{session_id:string;session_expires:number;token_expires:number;used_at:number|null;revoked_at:number|null};
function authRow(hash:string,kind:'access'|'refresh'){
 return db.prepare('SELECT u.id,u.username,u.password_hash,u.recovery_email,s.id session_id,s.expires_at session_expires,s.revoked_at,t.expires_at token_expires,t.used_at FROM auth_tokens t JOIN auth_sessions s ON s.id=t.session_id JOIN admin_users u ON u.id=s.owner_id WHERE t.token_hash=? AND t.kind=?').get(hash,kind) as AuthRow|undefined;
}
function sessionFrom(row:AuthRow,accessExpiresAt=row.token_expires):AuthSession{return {id:row.session_id,user:{id:row.id,username:row.username,password_hash:row.password_hash,recovery_email:row.recovery_email},expiresAt:row.session_expires,accessExpiresAt};}
export function authSession(hash:string){const row=authRow(hash,'access'),now=Date.now();return row&&row.revoked_at===null&&row.used_at===null&&row.token_expires>now&&row.session_expires>now?sessionFrom(row):undefined;}
function saveToken(hash:string,session:string,kind:'access'|'refresh',expires:number){db.prepare('INSERT INTO auth_tokens(token_hash,session_id,kind,expires_at) VALUES (?,?,?,?)').run(hash,session,kind,expires);}
export function createAuthSession(user:User,accessHash:string,refreshHash:string,accessExpiresAt:number,expiresAt:number):AuthSession{return transaction(()=>{
 db.prepare('DELETE FROM auth_sessions WHERE expires_at<=?').run(Date.now());
 const id=randomUUID();db.prepare('INSERT INTO auth_sessions(id,owner_id,expires_at) VALUES (?,?,?)').run(id,user.id,expiresAt);
 saveToken(accessHash,id,'access',accessExpiresAt);saveToken(refreshHash,id,'refresh',expiresAt);
 return {id,user,expiresAt,accessExpiresAt};
});}
export function rotateAuthSession(refreshHash:string,accessHash:string,nextRefreshHash:string,accessLifetime:number):AuthSession|undefined{return transaction(()=>{
 const row=authRow(refreshHash,'refresh'),now=Date.now();
 if(!row||row.revoked_at!==null||row.session_expires<=now||row.token_expires<=now)return undefined;
 if(row.used_at!==null){db.prepare('UPDATE auth_sessions SET revoked_at=? WHERE id=?').run(now,row.session_id);return undefined;}
 db.prepare('UPDATE auth_tokens SET used_at=? WHERE token_hash=?').run(now,refreshHash);
 db.prepare("DELETE FROM auth_tokens WHERE session_id=? AND kind='access' AND expires_at<=?").run(row.session_id,now);
 const accessExpiresAt=Math.min(now+accessLifetime,row.session_expires);
 saveToken(accessHash,row.session_id,'access',accessExpiresAt);saveToken(nextRefreshHash,row.session_id,'refresh',row.session_expires);
 return sessionFrom(row,accessExpiresAt);
});}
export function revokeAuthTokens(hashes:string[]){transaction(()=>{for(const hash of hashes)db.prepare('UPDATE auth_sessions SET revoked_at=? WHERE id IN (SELECT session_id FROM auth_tokens WHERE token_hash=?) AND revoked_at IS NULL').run(Date.now(),hash);});}
function asRecord(row:Row):AdminRecord{return {id:row.id,kind:row.kind,name:row.name,status:row.status,data:JSON.parse(row.data),revision:row.revision,createdAt:row.created_at,updatedAt:row.updated_at};}
export function getPortal(owner:string):PortalData{
 let settings=db.prepare('SELECT data,revision FROM admin_settings WHERE owner_id=?').get(owner) as {data:string;revision:number}|undefined;
 if(!settings){transaction(()=>{if(db.prepare('SELECT owner_id FROM admin_settings WHERE owner_id=?').get(owner))return;const now=new Date().toISOString();const insert=db.prepare('INSERT INTO admin_records(owner_id,id,kind,name,status,data,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)');for(const seed of seeds)insert.run(owner,seed.id,seed.kind,seed.name,seed.status,JSON.stringify(seed.data),seed.date?`${seed.date}T09:00:00Z`:now,now);db.prepare('INSERT INTO admin_settings(owner_id,data) VALUES (?,?)').run(owner,JSON.stringify(defaultSettings));});settings=db.prepare('SELECT data,revision FROM admin_settings WHERE owner_id=?').get(owner) as {data:string;revision:number};}
 importWebsiteContent(owner);
 settings=db.prepare('SELECT data,revision FROM admin_settings WHERE owner_id=?').get(owner) as {data:string;revision:number};
 const rows=db.prepare('SELECT id,kind,name,status,data,revision,created_at,updated_at FROM admin_records WHERE owner_id=? ORDER BY created_at DESC,id').all(owner) as Row[];
 const records=rows.map(asRecord);
 return {records,categories:getCategories(owner,records),settings:JSON.parse(settings!.data),settingsRevision:settings!.revision};
}
export function getCategories(owner:string,records?:AdminRecord[]):CategoryLists{
 if(!db.prepare('SELECT 1 FROM admin_categories WHERE owner_id=? LIMIT 1').get(owner)){
  const existing=records??(db.prepare('SELECT id,kind,name,status,data,revision,created_at,updated_at FROM admin_records WHERE owner_id=?').all(owner) as Row[]).map(asRecord);
  transaction(()=>{
   const insert=db.prepare('INSERT OR IGNORE INTO admin_categories(owner_id,kind,name,normalized_name) VALUES (?,?,?,?)');
   for(const kind of categoryKinds)for(const name of [...defaultCategories[kind],...existing.filter(record=>record.kind===kind).flatMap(recordCategories)])if(name&&normalizeCategory(name)!=='all')insert.run(owner,kind,name,normalizeCategory(name));
  });
 }
 const lists:CategoryLists={gallery:[],events:[],blog:[]};
 const rows=db.prepare('SELECT kind,name FROM admin_categories WHERE owner_id=? ORDER BY rowid').all(owner) as {kind:CategoryKind;name:string}[];
 for(const row of rows)lists[row.kind].push(row.name);
 return lists;
}
export function createCategory(owner:string,kind:CategoryKind,input:string){
 getCategories(owner);
 const name=categoryNameSchema.parse(input),normalized=normalizeCategory(name);
 const result=db.prepare('INSERT OR IGNORE INTO admin_categories(owner_id,kind,name,normalized_name) VALUES (?,?,?,?)').run(owner,kind,name,normalized);
 const saved=db.prepare('SELECT name FROM admin_categories WHERE owner_id=? AND kind=? AND normalized_name=?').get(owner,kind,normalized) as {name:string};
 const created=Number(result.changes)>0;if(created)changed(owner);
 return {name:saved.name,created};
}
export function findRecord(owner:string,id:string){const row=db.prepare('SELECT id,kind,name,status,data,revision,created_at,updated_at FROM admin_records WHERE owner_id=? AND id=?').get(owner,id) as Row|undefined;return row?asRecord(row):null;}
export function createRecord(owner:string,kind:Kind,input:{name:string;status:string;data:Record<string,string>}){const id=randomUUID(),now=new Date().toISOString();db.prepare('INSERT INTO admin_records(owner_id,id,kind,name,status,data,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)').run(owner,id,kind,input.name,input.status,JSON.stringify(input.data),now,now);changed(owner);return findRecord(owner,id)!;}
export function updateRecord(owner:string,id:string,kind:Kind,input:{name:string;status:string;data:Record<string,string>;revision:number}){const result=db.prepare('UPDATE admin_records SET name=?,status=?,data=?,revision=revision+1,updated_at=? WHERE owner_id=? AND id=? AND kind=? AND revision=?').run(input.name,input.status,JSON.stringify(input.data),new Date().toISOString(),owner,id,kind,input.revision);if(Number(result.changes))changed(owner);return Number(result.changes)?findRecord(owner,id):null;}
export function removeRecord(owner:string,id:string,kind:Kind,revision:number){const removed=Number(db.prepare('DELETE FROM admin_records WHERE owner_id=? AND id=? AND kind=? AND revision=?').run(owner,id,kind,revision).changes)>0;if(removed)changed(owner);return removed;}
export function updateSettings(owner:string,settings:Settings,revision:number){const saved=Number(db.prepare('UPDATE admin_settings SET data=?,revision=revision+1 WHERE owner_id=? AND revision=?').run(JSON.stringify(settings),owner,revision).changes)>0;if(saved)changed(owner);return saved;}
export function saveAsset(asset:Asset){db.prepare('INSERT INTO admin_assets(id,owner_id,storage_key,mime,filename,size) VALUES (?,?,?,?,?,?)').run(asset.id,asset.owner_id,asset.storage_key,asset.mime,asset.filename,asset.size);}
export function findAsset(owner:string,id:string){return db.prepare('SELECT id,owner_id,storage_key,mime,filename,size FROM admin_assets WHERE id=? AND owner_id=?').get(id,owner) as Asset|undefined;}
export function unusedAsset(owner:string,imagePath:string){const id=imagePath.split('/').pop()??'',asset=findAsset(owner,id);if(!asset)return undefined;const used=db.prepare('SELECT id FROM admin_records WHERE owner_id=? AND json_extract(data,\'$.imagePath\')=? LIMIT 1').get(owner,imagePath);if(used)return undefined;db.prepare('DELETE FROM admin_assets WHERE owner_id=? AND id=?').run(owner,id);return asset;}
function importWebsiteContent(owner:string){
 if(db.prepare('SELECT owner_id FROM content_imports WHERE owner_id=?').get(owner))return;
 transaction(()=>{
 const existing=db.prepare('SELECT id,kind,name,status,data,revision,created_at,updated_at FROM admin_records WHERE owner_id=?').all(owner) as Row[];
 const insert=db.prepare('INSERT INTO admin_records(owner_id,id,kind,name,status,data,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)'),now=new Date().toISOString();
 for(const seed of siteSeeds){
  const match=existing.find(row=>row.id===seed.id||(row.kind===seed.kind&&(row.name===seed.name||(seed.kind==='gallery'&&JSON.parse(row.data).imagePath===seed.data.imagePath))));
  if(match){const current=JSON.parse(match.data) as Record<string,string>;for(const key of ['duration','teachers','capacity','order','categories','portrait'])if(!current[key]&&seed.data[key])current[key]=seed.data[key];db.prepare('UPDATE admin_records SET data=? WHERE owner_id=? AND id=?').run(JSON.stringify(current),owner,match.id);}
  else insert.run(owner,seed.id,seed.kind,seed.name,seed.status,JSON.stringify(seed.data),seed.data.date?`${seed.data.date}T09:00:00Z`:now,now);
 }
 const settings=db.prepare('SELECT data FROM admin_settings WHERE owner_id=?').get(owner) as {data:string};
 const value=JSON.parse(settings.data);value.phone='061-552290';
 db.prepare('UPDATE admin_settings SET data=?,revision=revision+1 WHERE owner_id=?').run(JSON.stringify(value),owner);
 db.prepare('INSERT INTO content_imports(owner_id) VALUES (?)').run(owner);
 });
}
const publicFields:Record<string,string[]>={
 staff:['group','role','bio','imagePath','order'],programs:['age','fee','description','duration','teachers','capacity','order'],
 gallery:['category','categories','alt','imagePath','portrait','order'],events:['date','time','category','location','description','order'],
 blog:['date','author','category','excerpt','body','imagePath','order'],reviews:['rating','body','date'],
};
export function isPublic(record:AdminRecord){return record.data.example!=='true'&&(record.kind==='staff'?record.status==='Active':record.kind==='reviews'?record.status==='Approved':['programs','gallery','events','blog'].includes(record.kind)&&record.status==='Published');}
export function publicContent(){const portal=getPortal(schoolOwner()),{adminName,...settings}=portal.settings;return {settings,records:portal.records.filter(isPublic).map(record=>({id:record.id,kind:record.kind,name:record.name,data:Object.fromEntries((publicFields[record.kind]??[]).filter(key=>record.data[key]!==undefined).map(key=>[key,record.data[key]]))})).sort((a,b)=>Number(a.data.order??10000)-Number(b.data.order??10000))};}
export function publicAsset(id:string){const owner=schoolOwner(),asset=findAsset(owner,id);if(!asset)return undefined;return getPortal(owner).records.some(record=>isPublic(record)&&record.data.imagePath===`/api/media/${id}`)?asset:undefined;}
export function submission(requestId:string,kind:Kind){return db.prepare('SELECT record_id FROM public_submissions WHERE request_id=? AND kind=?').get(requestId,kind) as {record_id:string}|undefined;}
export function submitPublic(owner:string,requestId:string,kind:Kind,input:{name:string;status:string;data:Record<string,string>},queue:(record:AdminRecord)=>void){return transaction(()=>{const prior=submission(requestId,kind);if(prior)return findRecord(owner,prior.record_id)!;const record=createRecord(owner,kind,input);db.prepare('INSERT INTO public_submissions(request_id,kind,record_id) VALUES (?,?,?)').run(requestId,kind,record.id);queue(record);return record;});}

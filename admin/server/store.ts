import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { dataDirectory } from './config.js';
import { seeds } from './seeds.js';
import { defaultSettings,type AdminRecord,type Kind,type PortalData,type Settings } from '../src/admin-model.js';
export type User={id:string;username:string;password_hash:string};
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
if(version>1)throw new Error('This data folder was created by a newer version of the admin project.');
db.prepare('DELETE FROM admin_sessions WHERE expires_at<?').run(Date.now());
function transaction<T>(action:()=>T):T{db.exec('BEGIN IMMEDIATE');try{const result=action();db.exec('COMMIT');return result;}catch(error){db.exec('ROLLBACK');throw error;}}
export function setupNeeded(){return Number((db.prepare('SELECT COUNT(*) AS count FROM admin_users').get() as {count:number}).count)===0;}
export function findUser(username:string){return db.prepare('SELECT id,username,password_hash FROM admin_users WHERE username=?').get(username.toLowerCase()) as User|undefined;}
export function createUser(username:string,passwordHash:string){return transaction(()=>{if(!setupNeeded())throw new Error('The admin account is already configured. Please log in.');const id=randomUUID();db.prepare('INSERT INTO admin_users(id,username,password_hash) VALUES (?,?,?)').run(id,username.toLowerCase(),passwordHash);return {id,username:username.toLowerCase(),password_hash:passwordHash};});}
export function changePassword(owner:string,hash:string,currentTokenHash?:string){transaction(()=>{db.prepare('UPDATE admin_users SET password_hash=? WHERE id=?').run(hash,owner);if(currentTokenHash)db.prepare('DELETE FROM admin_sessions WHERE owner_id=? AND token_hash<>?').run(owner,currentTokenHash);else db.prepare('DELETE FROM admin_sessions WHERE owner_id=?').run(owner);});}
export function saveSession(tokenHash:string,owner:string,expires:number){db.prepare('DELETE FROM admin_sessions WHERE expires_at<?').run(Date.now());db.prepare('INSERT INTO admin_sessions(token_hash,owner_id,expires_at) VALUES (?,?,?)').run(tokenHash,owner,expires);}
export function userForSession(tokenHash:string){return db.prepare('SELECT u.id,u.username,u.password_hash FROM admin_sessions s JOIN admin_users u ON u.id=s.owner_id WHERE s.token_hash=? AND s.expires_at>?').get(tokenHash,Date.now()) as User|undefined;}
export function removeSession(tokenHash:string){db.prepare('DELETE FROM admin_sessions WHERE token_hash=?').run(tokenHash);}
function asRecord(row:Row):AdminRecord{return {id:row.id,kind:row.kind,name:row.name,status:row.status,data:JSON.parse(row.data),revision:row.revision,createdAt:row.created_at,updatedAt:row.updated_at};}
export function getPortal(owner:string):PortalData{
 let settings=db.prepare('SELECT data,revision FROM admin_settings WHERE owner_id=?').get(owner) as {data:string;revision:number}|undefined;
 if(!settings){transaction(()=>{if(db.prepare('SELECT owner_id FROM admin_settings WHERE owner_id=?').get(owner))return;const now=new Date().toISOString();const insert=db.prepare('INSERT INTO admin_records(owner_id,id,kind,name,status,data,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)');for(const seed of seeds)insert.run(owner,seed.id,seed.kind,seed.name,seed.status,JSON.stringify(seed.data),seed.date?`${seed.date}T09:00:00Z`:now,now);db.prepare('INSERT INTO admin_settings(owner_id,data) VALUES (?,?)').run(owner,JSON.stringify(defaultSettings));});settings=db.prepare('SELECT data,revision FROM admin_settings WHERE owner_id=?').get(owner) as {data:string;revision:number};}
 const rows=db.prepare('SELECT id,kind,name,status,data,revision,created_at,updated_at FROM admin_records WHERE owner_id=? ORDER BY created_at DESC,id').all(owner) as Row[];
 return {records:rows.map(asRecord),settings:JSON.parse(settings!.data),settingsRevision:settings!.revision};
}
export function findRecord(owner:string,id:string){const row=db.prepare('SELECT id,kind,name,status,data,revision,created_at,updated_at FROM admin_records WHERE owner_id=? AND id=?').get(owner,id) as Row|undefined;return row?asRecord(row):null;}
export function createRecord(owner:string,kind:Kind,input:{name:string;status:string;data:Record<string,string>}){const id=randomUUID(),now=new Date().toISOString();db.prepare('INSERT INTO admin_records(owner_id,id,kind,name,status,data,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)').run(owner,id,kind,input.name,input.status,JSON.stringify(input.data),now,now);return findRecord(owner,id)!;}
export function updateRecord(owner:string,id:string,kind:Kind,input:{name:string;status:string;data:Record<string,string>;revision:number}){const result=db.prepare('UPDATE admin_records SET name=?,status=?,data=?,revision=revision+1,updated_at=? WHERE owner_id=? AND id=? AND kind=? AND revision=?').run(input.name,input.status,JSON.stringify(input.data),new Date().toISOString(),owner,id,kind,input.revision);return Number(result.changes)?findRecord(owner,id):null;}
export function removeRecord(owner:string,id:string,kind:Kind,revision:number){return Number(db.prepare('DELETE FROM admin_records WHERE owner_id=? AND id=? AND kind=? AND revision=?').run(owner,id,kind,revision).changes)>0;}
export function updateSettings(owner:string,settings:Settings,revision:number){return Number(db.prepare('UPDATE admin_settings SET data=?,revision=revision+1 WHERE owner_id=? AND revision=?').run(JSON.stringify(settings),owner,revision).changes)>0;}
export function saveAsset(asset:Asset){db.prepare('INSERT INTO admin_assets(id,owner_id,storage_key,mime,filename,size) VALUES (?,?,?,?,?,?)').run(asset.id,asset.owner_id,asset.storage_key,asset.mime,asset.filename,asset.size);}
export function findAsset(owner:string,id:string){return db.prepare('SELECT id,owner_id,storage_key,mime,filename,size FROM admin_assets WHERE id=? AND owner_id=?').get(id,owner) as Asset|undefined;}
export function unusedAsset(owner:string,imagePath:string){const id=imagePath.split('/').pop()??'',asset=findAsset(owner,id);if(!asset)return undefined;const used=db.prepare('SELECT id FROM admin_records WHERE owner_id=? AND json_extract(data,\'$.imagePath\')=? LIMIT 1').get(owner,imagePath);if(used)return undefined;db.prepare('DELETE FROM admin_assets WHERE owner_id=? AND id=?').run(owner,id);return asset;}

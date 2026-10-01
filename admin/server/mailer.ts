import nodemailer from 'nodemailer';
import {db} from './store.js';
import {changed} from './live.js';
const env=process.env;
export const mailConfigured=Boolean(env.SMTP_HOST&&env.SMTP_FROM);
const transporter=mailConfigured?nodemailer.createTransport({
 host:env.SMTP_HOST,port:Number(env.SMTP_PORT??587),secure:env.SMTP_SECURE==='true',
 requireTLS:env.SMTP_SECURE!=='true'&&env.SMTP_ALLOW_PLAIN_LOCALHOST!=='true',
 ...(env.SMTP_USER?{auth:{user:env.SMTP_USER,pass:env.SMTP_PASS??''}}:{}),
 connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,
 disableFileAccess:true,disableUrlAccess:true,
}):null;
if(env.SMTP_ALLOW_PLAIN_LOCALHOST==='true'&&!['localhost','127.0.0.1','::1'].includes(env.SMTP_HOST??''))throw new Error('Plain SMTP is permitted only for a localhost test mailbox.');
export type Mail={to:string;subject:string;text:string;replyTo?:string};
export async function sendMail(message:Mail){
 if(!transporter)throw new Error('Email delivery is unavailable.');
 const result=await transporter.sendMail({from:env.SMTP_FROM,...message});
 if(!result.accepted.length)throw new Error('The email server did not accept the recipient.');
}
export function queueMail(owner:string,record:string,key:string,message:Mail){
 db.prepare('INSERT OR IGNORE INTO mail_outbox(owner_id,record_id,dedup_key,payload,status,next_attempt) VALUES (?,?,?,?,?,?)').run(owner,record,key,JSON.stringify(message),'Pending',Date.now());
}
export function mailSummary(owner:string){const rows=db.prepare('SELECT status,COUNT(*) count FROM mail_outbox WHERE owner_id=? GROUP BY status').all(owner) as {status:string;count:number}[];return {configured:mailConfigured,sent:rows.find(x=>x.status==='Sent')?.count??0,pending:rows.find(x=>x.status==='Pending')?.count??0,failed:rows.find(x=>x.status==='Failed')?.count??0};}
export function recordMail(owner:string,record:string){return db.prepare('SELECT id,status,attempts,created_at,sent_at FROM mail_outbox WHERE owner_id=? AND record_id=? ORDER BY id DESC').all(owner,record);}
export function retryMail(owner:string,record?:string){db.prepare(`UPDATE mail_outbox SET status='Pending',attempts=0,next_attempt=? WHERE owner_id=? AND status IN ('Failed','Pending')${record?' AND record_id=?':''}`).run(Date.now(),owner,...(record?[record]:[]));void flushMail();}
let sending=false;
export async function flushMail(){
 if(sending||!mailConfigured)return;sending=true;
 try{
 const rows=db.prepare("SELECT id,owner_id,payload,attempts FROM mail_outbox WHERE status='Pending' AND next_attempt<=? ORDER BY id LIMIT 20").all(Date.now()) as {id:number;owner_id:string;payload:string;attempts:number}[];
 for(const row of rows){try{await sendMail(JSON.parse(row.payload));db.prepare("UPDATE mail_outbox SET status='Sent',sent_at=? WHERE id=?").run(new Date().toISOString(),row.id);}catch{const attempts=row.attempts+1;db.prepare('UPDATE mail_outbox SET attempts=?,status=?,next_attempt=? WHERE id=?').run(attempts,attempts>=5?'Failed':'Pending',Date.now()+Math.min(60*60*1000,30000*2**attempts),row.id);}changed(row.owner_id);}
 }finally{sending=false;}
}

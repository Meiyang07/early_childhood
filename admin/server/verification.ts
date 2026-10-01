import {createHash,randomBytes,randomInt,timingSafeEqual} from 'node:crypto';
import {db,type User} from './store.js';
import {sendMail,mailConfigured} from './mailer.js';
const secret=randomBytes(32);
const digest=(owner:string,purpose:string,code:string)=>createHash('sha256').update(secret).update(owner).update(purpose).update(code).digest('hex');
export async function issueCode(user:User,purpose:'change'|'reset',binding:string){
 if(!mailConfigured)throw new Error('Email verification is unavailable. Please contact the administrator.');
 const email=user.recovery_email||process.env.ADMIN_RECOVERY_EMAIL;
 if(!email)throw new Error('No recovery email is available for this account. Please contact the administrator.');
 const recent=db.prepare('SELECT created_at FROM password_codes WHERE owner_id=? AND purpose=?').get(user.id,purpose) as {created_at:number}|undefined;
 if(recent&&Date.now()-recent.created_at<60000)throw new Error('Wait one minute before requesting another verification code.');
 const code=String(randomInt(100000,1000000)),now=Date.now();
 db.prepare('INSERT OR REPLACE INTO password_codes(owner_id,purpose,code_hash,binding,expires_at,attempts,created_at) VALUES (?,?,?,?,?,0,?)').run(user.id,purpose,digest(user.id,purpose,code),binding,now+10*60*1000,now);
 try{await sendMail({to:email,subject:'Early Childhood admin password verification',text:`Your verification code is ${code}. It expires in 10 minutes and can be used once. If you did not request this, ignore this email.`});}catch(error){db.prepare('DELETE FROM password_codes WHERE owner_id=? AND purpose=?').run(user.id,purpose);throw error;}
}
export function consumeCode(user:User,purpose:'change'|'reset',binding:string,code:string){
 const row=db.prepare('SELECT code_hash,binding,expires_at,attempts FROM password_codes WHERE owner_id=? AND purpose=?').get(user.id,purpose) as {code_hash:string;binding:string;expires_at:number;attempts:number}|undefined;
 if(!row||row.expires_at<Date.now()||row.attempts>=5||row.binding!==binding)return false;
 db.prepare('UPDATE password_codes SET attempts=attempts+1 WHERE owner_id=? AND purpose=?').run(user.id,purpose);
 if(!timingSafeEqual(Buffer.from(row.code_hash,'hex'),Buffer.from(digest(user.id,purpose,code),'hex')))return false;
 db.prepare('DELETE FROM password_codes WHERE owner_id=?').run(user.id);return true;
}

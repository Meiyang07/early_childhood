import { createInterface } from 'node:readline/promises';
import { stdin,stdout } from 'node:process';
import { db,findUser,changePassword } from './store.js';
import { hashPassword } from './passwords.js';
async function hidden(prompt:string){
 if(!stdin.isTTY)throw new Error('Run this command in Terminal so the password can be entered privately.');
 stdout.write(prompt);stdin.setEncoding('utf8');stdin.setRawMode(true);stdin.resume();
 return new Promise<string>((resolve,reject)=>{
  let value='';const finish=(error?:Error)=>{stdin.setRawMode(false);stdin.pause();stdin.off('data',data);stdout.write('\n');if(error)reject(error);else resolve(value);};
  const data=(chunk:string)=>{for(const char of chunk){if(char==='\u0003'){finish(new Error('Password reset cancelled.'));return;}if(char==='\r'||char==='\n'){finish();return;}if(char==='\u007f'||char==='\b')value=Array.from(value).slice(0,-1).join('');else if(char>=' ')value+=char;}};
  stdin.on('data',data);
 });
}
try{
 const reader=createInterface({input:stdin,output:stdout});const username=(await reader.question('Admin username: ')).trim().toLowerCase();reader.close();
 const user=findUser(username);if(!user)throw new Error('That admin account was not found.');
 const password=await hidden('New password (8+ characters): '),confirm=await hidden('Confirm new password: ');
 if(password.length<8||password.length>128)throw new Error('Use a password between 8 and 128 characters.');if(password!==confirm)throw new Error('Passwords do not match.');
 changePassword(user.id,await hashPassword(password));console.log('Password updated. All old sessions were logged out. Your school records are unchanged.');
}catch(error){console.error(error instanceof Error?error.message:'Password reset failed.');process.exitCode=1;}finally{db.close();}

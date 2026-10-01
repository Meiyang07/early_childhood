import {z} from 'zod';
import {createUser,setupNeeded} from './store.js';
import {hashPassword} from './passwords.js';

// Starter credentials are used once, only when no admin account exists.
// Set private ADMIN_INITIAL_* values in .env to override them on a new installation.
export const initialAdmin={username:'Admin',password:'Admin@123'} as const;

export async function initializeAdminAccount(){
  if(!setupNeeded())return;
  const username=(process.env.ADMIN_INITIAL_USERNAME||initialAdmin.username).trim();
  const password=process.env.ADMIN_INITIAL_PASSWORD||initialAdmin.password;
  const recoveryEmail=(process.env.ADMIN_RECOVERY_EMAIL||'').trim();
  if(!username||username.length>120)throw new Error('ADMIN_INITIAL_USERNAME must contain 1 to 120 characters.');
  if(password.length<8||password.length>128)throw new Error('ADMIN_INITIAL_PASSWORD must contain 8 to 128 characters.');
  if(recoveryEmail&&!z.string().email().max(200).safeParse(recoveryEmail).success)throw new Error('ADMIN_RECOVERY_EMAIL must be a valid email address.');
  const passwordHash=await hashPassword(password);
  // Another startup may have created the account while the password was being hashed.
  if(setupNeeded())createUser(username,passwordHash,recoveryEmail);
}

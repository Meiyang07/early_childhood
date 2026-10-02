// Cookies hold the opaque tokens. Only account and expiry metadata reaches JavaScript.
const authLock='early-childhood-admin-auth';
const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel(authLock):null;
let pendingRefresh:Promise<boolean>|null=null;
let queue:Promise<unknown>=Promise.resolve();
const publicAuth=new Set(['/api/auth/login','/api/auth/logout','/api/auth/reset/request','/api/auth/reset/confirm','/api/auth/refresh']);
const serializedAuth=new Set(['/api/auth/login','/api/auth/logout','/api/auth/reset/confirm','/api/auth/password']);

function event(type:string){window.dispatchEvent(new Event(type));}
function announce(type:string){event(type);channel?.postMessage({type});}
channel?.addEventListener('message',message=>{
 const type=message.data?.type;
 if(['admin-session-expired','admin-auth-changed','admin-tokens-renewed'].includes(type))event(type);
});
async function locked<T>(action:()=>Promise<T>):Promise<T>{
 if(navigator.locks)return await navigator.locks.request(authLock,action);
 const result=queue.then(action,action);queue=result.catch(()=>{});return result;
}
function request(url:string,init:RequestInit={}){
 const target=new URL(url,window.location.origin);
 if(target.origin!==window.location.origin||!target.pathname.startsWith('/api/'))throw new Error('Use an admin API address on this origin.');
 return new Request(target,{...init,credentials:'same-origin',cache:'no-store'});
}
async function renewUnlocked():Promise<boolean>{
 // A queued tab checks the cookie again after another tab may have renewed it.
 const session=await fetch(request('/api/auth/session'));
 if(session.ok&&(await session.json()).authenticated)return true;
 if(!session.ok&&session.status!==401)throw new Error('Could not check your admin session. Please try again.');
 const response=await fetch(request('/api/auth/refresh',{method:'POST'}));
 if(response.ok){announce('admin-tokens-renewed');return true;}
 if(response.status===401){announce('admin-session-expired');return false;}
 throw new Error('Could not renew your admin session. Please try again.');
}
export function refreshAccess():Promise<boolean>{
 if(!pendingRefresh){
  pendingRefresh=locked(renewUnlocked).finally(()=>{pendingRefresh=null;});
 }
 return pendingRefresh;
}
export async function authFetch(url:string,init:RequestInit={}):Promise<Response>{
 const original=request(url,init),path=new URL(original.url).pathname;
 const canRenew=!publicAuth.has(path);
 const run=async(holdingLock:boolean)=>{
  let response=await fetch(original.clone());
  if(response.status===401&&canRenew){
   const renewed=await (holdingLock?renewUnlocked():refreshAccess());
   if(renewed)response=await fetch(original.clone());
   if(response.status===401)announce('admin-session-expired');
  }
  if(response.ok&&serializedAuth.has(path)){
   if(path==='/api/auth/logout'||path==='/api/auth/reset/confirm')announce('admin-session-expired');
   else {announce('admin-tokens-renewed');announce('admin-auth-changed');}
  }
  return response;
 };
 return serializedAuth.has(path)?locked(()=>run(true)):run(false);
}

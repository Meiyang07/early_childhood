import {createHash,randomBytes} from 'node:crypto';
import type {IncomingMessage,ServerResponse} from 'node:http';
import {sessionCookie,refreshCookie,accessTokenLifetime,sessionLifetime,secureCookies} from './config.js';
import {authSession,createAuthSession,rotateAuthSession,revokeAuthTokens,type AuthSession,type User} from './store.js';

const token=()=>randomBytes(32).toString('hex');
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
function readToken(request:IncomingMessage,name:string){
 const values=request.headers.cookie?.split(';').map(value=>value.trim()).filter(value=>value.startsWith(`${name}=`))??[];
 if(values.length!==1)return undefined;
 const value=values[0].slice(name.length+1);
 return /^[a-f0-9]{64}$/.test(value)?value:undefined;
}
function cookie(name:string,value:string,path:string,expiresAt:number){
 return `${name}=${value}; HttpOnly; SameSite=Strict; Path=${path}; Max-Age=${Math.max(0,Math.floor((expiresAt-Date.now())/1000))}${secureCookies?'; Secure':''}`;
}
const legacyCookie=()=>cookie('ecec_local_admin','','/',0);
export function clearAuthCookies(response:ServerResponse){response.setHeader('Set-Cookie',[cookie(sessionCookie,'','/',0),cookie(refreshCookie,'','/api/auth',0),legacyCookie()]);}
function setAuthCookies(response:ServerResponse,session:AuthSession,access:string,refresh:string){response.setHeader('Set-Cookie',[cookie(sessionCookie,access,'/',session.accessExpiresAt),cookie(refreshCookie,refresh,'/api/auth',session.expiresAt),legacyCookie()]);}
export function currentSession(request:IncomingMessage){const access=readToken(request,sessionCookie);return access?authSession(hash(access)):undefined;}
export function hasRefreshToken(request:IncomingMessage){return !!readToken(request,refreshCookie);}
export function sessionPayload(session:AuthSession){return {authenticated:true,account:{username:session.user.username,name:null},accessExpiresAt:session.accessExpiresAt,sessionExpiresAt:session.expiresAt};}
export function revokeRequest(request:IncomingMessage){revokeAuthTokens([readToken(request,sessionCookie),readToken(request,refreshCookie)].filter((value):value is string=>!!value).map(hash));}
export function signIn(request:IncomingMessage,response:ServerResponse,user:User){
 revokeRequest(request);
 const access=token(),refresh=token(),now=Date.now();
 const session=createAuthSession(user,hash(access),hash(refresh),now+accessTokenLifetime,now+sessionLifetime);
 setAuthCookies(response,session,access,refresh);return sessionPayload(session);
}
export function refreshSession(request:IncomingMessage,response:ServerResponse){
 const previous=readToken(request,refreshCookie),access=token(),refresh=token();
 const session=previous?rotateAuthSession(hash(previous),hash(access),hash(refresh),accessTokenLifetime):undefined;
 if(!session){clearAuthCookies(response);return undefined;}
 setAuthCookies(response,session,access,refresh);return sessionPayload(session);
}

import {useCallback,useEffect,useState,type FormEvent} from 'react';
import {Eye,EyeOff} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Skeleton} from '@/components/ui/skeleton';
import AdminPortal from './admin-portal';
import {ForgotPasswordForm} from './AccountForms';
import {adminKinds,type PortalData,type Section} from './admin-model';
import {navigate,usePath,Link} from './navigation';
import {authFetch} from './auth';

type Account={username:string;name:string|null};
type Session={authenticated:boolean;account?:Account;accessExpiresAt?:number;sessionExpiresAt?:number};

async function sessionRequest(){
  const response=await authFetch('/api/auth/session');
  if(response.status===401)return {authenticated:false};
  if(!response.ok)throw new Error('Unable to connect. Please try again.');
  return response.json() as Promise<Session>;
}

export default function App(){
  const path=usePath();
  const [session,setSession]=useState<Session|null>(null);
  const [data,setData]=useState<PortalData|null>(null);
  const [error,setError]=useState('');
  const load=useCallback(async()=>{
    try{
      const result=await sessionRequest();
      setSession(result);setError('');
      if(result.authenticated){
        const response=await authFetch('/api/admin');
        if(response.status===401){setSession({authenticated:false});setData(null);return;}
        const payload=await response.json();
        if(!response.ok)throw new Error(payload.error??'Could not load school records.');
        setData(payload);
      }else setData(null);
    }catch(e){setError((e as Error).message);}
  },[]);
  useEffect(()=>{
    void load();
    const expired=()=>{setSession({authenticated:false});setData(null);};
    const changed=()=>{void load();};
    window.addEventListener('admin-session-expired',expired);
    window.addEventListener('admin-auth-changed',changed);
    return()=>{window.removeEventListener('admin-session-expired',expired);window.removeEventListener('admin-auth-changed',changed);};
  },[load]);
  async function signedIn(){await load();navigate('/admin');}
  async function logout(){
    const response=await authFetch('/api/auth/logout',{method:'POST'});
    if(!response.ok){setError('Could not log out. Please try again.');return;}
    setSession({authenticated:false});setData(null);navigate('/');
  }
  if(error)return <main className="unavailable"><img src="/assets/school-logo.jpg" width="90" height="90" alt="School logo"/><h1>Unable to open the admin panel</h1><p role="alert">{error}</p><button className="primary-button" onClick={load}>Try again</button></main>;
  if(!session)return <main className="unavailable"><img src="/assets/school-logo.jpg" width="90" height="90" alt="School logo"/><p>Loading…</p><Skeleton className="h-3 w-48"/></main>;
  if(!session.authenticated||path==='/'||path==='/login')return <LoginPage session={session} onSignedIn={signedIn} onLogout={logout}/>;
  const part=path.replace(/^\/admin\/?/,'')||'overview';
  if(!path.startsWith('/admin')||!['overview','settings',...adminKinds].includes(part))return <main className="unavailable"><h1>Page not found</h1><Link className="primary-button" href="/admin">Open dashboard</Link></main>;
  if(!data)return <main className="unavailable"><p>Loading school records…</p></main>;
  return <AdminPortal section={part as Section} initial={data} account={session.account!} onLogout={logout}/>;
}

function LoginPage({session,onSignedIn,onLogout}:{session:Session;onSignedIn:()=>Promise<void>;onLogout:()=>Promise<void>}){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [visible,setVisible]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [help,setHelp]=useState(false);
  async function signOut(){
    setError('');setSaving(true);
    try{await onLogout();setUsername('');setPassword('');}
    catch(e){setError((e as Error).message);}
    finally{setSaving(false);}
  }
  async function submit(event:FormEvent){
    event.preventDefault();setError('');setSaving(true);
    try{
      const response=await authFetch('/api/auth/login',{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password}),
      });
      const result=await response.json();
      if(!response.ok)throw new Error(result.error??'Unable to sign in.');
      await onSignedIn();
    }catch(e){setError((e as Error).message);}finally{setSaving(false);}
  }
  return <main className="login-page">
    <div className="login-orb peach" aria-hidden="true"/><div className="login-orb blue" aria-hidden="true"/>
    <div className="login-orb lilac" aria-hidden="true"/><div className="login-orb mint" aria-hidden="true"/>
    <div className="login-confetti" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
    <div className="login-layout">
      <section className="login-brand" aria-label="Early Childhood Montessori">
        <img src="/assets/school-logo.jpg" alt="Early Childhood Education Centre, Pokhara" width="390" height="390"/>
        <h1>Early Childhood</h1><p>Montessori</p>
      </section>
      <div className="login-divider" aria-hidden="true"/>
      <section className="login-card">
        <h2>Admin Portal</h2>
        {session.authenticated?<>
          <p className="login-welcome">Signed in as {session.account?.username}.</p>
          <Link className="login-button" href="/admin">Open admin panel</Link>
          <button className="login-logout" type="button" onClick={signOut} disabled={saving}>{saving?'Logging out…':'Log out'}</button>
          {error&&<p className="login-error" role="alert">{error}</p>}
        </>:<>
          <p className="login-welcome">Log in.</p>
          <form onSubmit={submit}>
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" autoComplete="username" placeholder="Enter your username" value={username} onChange={event=>setUsername(event.target.value)} required minLength={1} maxLength={120} autoFocus/>
            </div>
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input id="password" name="password" autoComplete="current-password" type={visible?'text':'password'} placeholder="Enter your password" value={password} onChange={event=>setPassword(event.target.value)} required minLength={8} maxLength={128}/>
                <button type="button" aria-label={visible?'Hide password':'Show password'} onClick={()=>setVisible(v=>!v)}>{visible?<EyeOff size={19}/>:<Eye size={19}/>}</button>
              </div>
            </div>
            <button className="forgot-password" type="button" onClick={()=>setHelp(true)}>Forgot Password?</button>
            {error&&<p className="login-error" role="alert">{error}</p>}
            <button className="login-button" type="submit" disabled={saving}>{saving?'Please wait…':'Log in'}</button>
          </form>
        </>}
      </section>
    </div>
    <Dialog open={help} onOpenChange={setHelp}>
      <DialogContent className="message-dialog">
        <DialogHeader><DialogTitle>Reset your admin password</DialogTitle><DialogDescription>Enter the code sent to your recovery email.</DialogDescription></DialogHeader>
        <ForgotPasswordForm initialUsername={username} onDone={()=>{setHelp(false);setError('');}}/>
      </DialogContent>
    </Dialog>
  </main>;
}

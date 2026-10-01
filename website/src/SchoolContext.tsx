import {subscribeLive} from '../../shared/live';
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
export type PublicRecord={id:string;kind:string;name:string;data:Record<string,string>};
type PublicSettings={schoolName:string;email:string;phone:string;address:string;workingDays:string;openTime:string;closeTime:string};
type Content={settings:PublicSettings;records:PublicRecord[]};
const SchoolContext=createContext<Content|null>(null);
export function SchoolProvider({children}:{children:ReactNode}){
 const [content,setContent]=useState<Content|null>(null),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 useEffect(()=>{
  let stopped=false,inFlight=false,queued=false;const controller=new AbortController();
  async function refresh(){if(inFlight){queued=true;return;}inFlight=true;try{const response=await fetch('/api/public/content',{cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error('The website is temporarily unavailable. Please try again.');const result=await response.json() as Content;if(!stopped){setContent(result);setError('');}}catch(e){if(!stopped)setError((e as Error).message);}finally{inFlight=false;if(queued&&!stopped){queued=false;void refresh();}}}
  void refresh();const stopLive=subscribeLive('/api/public/stream',refresh);
  const timer=setInterval(refresh,30000);window.addEventListener('focus',refresh);
  return()=>{stopped=true;controller.abort();stopLive();clearInterval(timer);window.removeEventListener('focus',refresh);};
 },[retry]);
 if(!content)return <main className="connection-page"><img src="/assets/school-logo.jpg" alt="School logo" width="90"/><h1>Early Childhood Montessori</h1><p role={error?'alert':'status'}>{error||'Loading…'}</p>{error&&<button onClick={()=>setRetry(v=>v+1)}>Try again</button>}</main>;
 return <SchoolContext.Provider value={content}>{error&&<div className="connection-notice" role="status">Connection interrupted. <button onClick={()=>setRetry(v=>v+1)}>Reconnect</button></div>}{children}</SchoolContext.Provider>;
}
export function useSchool(){
 const content=useContext(SchoolContext);if(!content)throw new Error('SchoolProvider is required.');
 return useMemo(()=>{
 const s=content.settings,clock=(value:string)=>new Intl.DateTimeFormat('en',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'UTC'}).format(new Date(`2000-01-01T${value}:00Z`));
 const workingHours=`${clock(s.openTime)} – ${clock(s.closeTime)}`,digits=s.phone.replace(/\D/g,'');
 return {...content,schoolDetails:{...s,workingHours,compactHours:`${s.workingDays} ${workingHours}`,phoneLink:`tel:+977${digits.startsWith('0')?digits.slice(1):digits}`},tuitionFees:content.records.filter(r=>r.kind==='programs'&&r.data.fee!=='').filter(r=>r.data.fee!==undefined).map(r=>({program:r.name,monthly:`Rs ${Number(r.data.fee).toLocaleString('en-NP')}`}))};
 },[content]);
}
export async function submitForm(path:string,values:unknown){const response=await fetch(`/api/public/${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});let result:{error?:string;message?:string;reference?:string};try{result=await response.json();}catch{throw new Error('Unable to submit. Please try again.');}if(!response.ok)throw new Error(result.error??'Please check your form and try again.');return result;}

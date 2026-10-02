// One event stream per origin keeps connections available for forms and photos.
export function subscribeLive(
 url:string,
 onChanged:()=>void,
 onConnection:(connected:boolean)=>void=()=>{},
 onExpired:()=>void=()=>{},
 recover?:()=>Promise<boolean>,
){
 if(!('BroadcastChannel' in window)||!navigator.locks){
  const timer=window.setInterval(onChanged,3000);onConnection(true);
  return()=>window.clearInterval(timer);
 }
 const name=`early-childhood-live:${url}`,channel=new BroadcastChannel(name),controller=new AbortController();
 let stopped=false,leader=false,connected=false,recovering=false;
 let events:EventSource|null=null,release:(()=>void)|undefined,retry:number|undefined;
 const publish=(type:string)=>{if(!stopped)channel.postMessage({type});};
 channel.onmessage=event=>{
  if(stopped)return;const type=event.data?.type;
  if(type==='hello'&&leader&&connected)publish('ready');
  if(type==='ready'){onConnection(true);onChanged();}
  if(type==='changed')onChanged();
  if(type==='disconnected')onConnection(false);
  if(type==='expired')onExpired();
 };
 function connect(){
  if(stopped||!leader)return;
  const source=new EventSource(url);events=source;
  source.addEventListener('ready',()=>{if(stopped||events!==source)return;connected=true;onConnection(true);onChanged();publish('ready');});
  source.addEventListener('changed',()=>{if(stopped||events!==source)return;onChanged();publish('changed');});
  source.addEventListener('expired',()=>{void renew(source);});
  source.onerror=()=>{
   if(stopped||events!==source)return;
   connected=false;onConnection(false);publish('disconnected');
   if(recover)void renew(source);
  };
 }
 async function renew(source:EventSource){
  if(stopped||events!==source||recovering)return;
  recovering=true;source.close();events=null;connected=false;onConnection(false);
  try{
   if(recover&&await recover()){if(!stopped)connect();}
   else if(!stopped){onExpired();publish('expired');}
  }catch{
   // A temporary network failure reconnects instead of logging the account out.
   if(!stopped)retry=window.setTimeout(connect,2000);
  }finally{recovering=false;}
 }
 const renewed=()=>{
  if(!recover||stopped||!leader||recovering)return;
  if(retry!==undefined)window.clearTimeout(retry);
  events?.close();connect();
 };
 if(recover)window.addEventListener('admin-tokens-renewed',renewed);
 void navigator.locks.request(name,{signal:controller.signal},async()=>{
  if(stopped)return;leader=true;connect();
  await new Promise<void>(resolve=>{release=resolve;});
  events?.close();leader=false;
 }).catch(error=>{if(!stopped&&error.name!=='AbortError')onConnection(false);});
 publish('hello');
 return()=>{
  stopped=true;controller.abort();events?.close();release?.();channel.close();
  if(retry!==undefined)window.clearTimeout(retry);
  if(recover)window.removeEventListener('admin-tokens-renewed',renewed);
 };
}

// One event stream per origin keeps browser HTTP connections available for forms and photos.
export function subscribeLive(url:string,onChanged:()=>void,onConnection:(connected:boolean)=>void=()=>{},onExpired:()=>void=()=>{}){
 if(!('BroadcastChannel' in window)||!navigator.locks){const timer=window.setInterval(onChanged,3000);onConnection(true);return()=>window.clearInterval(timer);}
 const name=`early-childhood-live:${url}`,channel=new BroadcastChannel(name),controller=new AbortController();
 let stopped=false,leader=false,connected=false,events:EventSource|null=null,release:(()=>void)|undefined;
 const publish=(type:string)=>{if(!stopped)channel.postMessage({type});};
 channel.onmessage=event=>{
  if(stopped)return;const type=event.data?.type;
  if(type==='hello'&&leader&&connected)publish('ready');
  if(type==='ready'){onConnection(true);onChanged();}
  if(type==='changed')onChanged();
  if(type==='disconnected')onConnection(false);
  if(type==='expired')onExpired();
 };
 void navigator.locks.request(name,{signal:controller.signal},async()=>{
  if(stopped)return;leader=true;events=new EventSource(url);
  events.addEventListener('ready',()=>{connected=true;onConnection(true);onChanged();publish('ready');});
  events.addEventListener('changed',()=>{onChanged();publish('changed');});
  events.addEventListener('expired',()=>{onExpired();publish('expired');});
  events.onerror=()=>{connected=false;onConnection(false);publish('disconnected');};
  await new Promise<void>(resolve=>{release=resolve;});
  events.close();leader=false;
 }).catch(error=>{if(!stopped&&error.name!=='AbortError'){onConnection(false);}});
 publish('hello');
 return()=>{stopped=true;controller.abort();events?.close();release?.();channel.close();};
}

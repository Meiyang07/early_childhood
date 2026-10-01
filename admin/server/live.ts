import type {ServerResponse} from 'node:http';
const subscribers=new Set<{response:ServerResponse;owner?:string;valid?:()=>boolean}>();
export function stream(response:ServerResponse,owner?:string,valid?:()=>boolean){
 response.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-store','Connection':'keep-alive','X-Accel-Buffering':'no'});
 response.write('retry: 2000\n\nevent: ready\ndata: {}\n\n');
 const client={response,owner,valid};subscribers.add(client);
 const timer=setInterval(()=>{if(valid&&!valid()){response.write('event: expired\ndata: {}\n\n');response.end();return;}response.write(': heartbeat\n\n');},15000);
 response.on('close',()=>{clearInterval(timer);subscribers.delete(client);});
}
export function changed(owner:string){for(const client of subscribers){if(!client.owner||client.owner===owner){if(client.valid&&!client.valid()){client.response.write('event: expired\ndata: {}\n\n');client.response.end();continue;}client.response.write('event: changed\ndata: {}\n\n');}}}
export function closeStreams(){for(const client of subscribers)client.response.end();subscribers.clear();}

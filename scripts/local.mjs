import {spawn} from 'node:child_process';
import {build,admin} from './common.mjs';
build();
const server=spawn(process.execPath,['--env-file-if-exists=.env','dist-server/server/index.js'],{cwd:admin,stdio:'inherit'});
let stopping=false;for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{stopping=true;server.kill('SIGTERM');});
server.on('error',error=>{console.error(error.message);process.exit(1);});server.on('exit',code=>process.exit(stopping?0:code??0));
if(process.platform==='darwin'&&process.env.ADMIN_OPEN_BROWSER!=='false'){
 const timer=setInterval(async()=>{try{const response=await fetch(`http://127.0.0.1:${process.env.WEBSITE_PORT??4174}/api/public/content`);if(response.ok){clearInterval(timer);for(const port of [process.env.WEBSITE_PORT??4174,process.env.ADMIN_PORT??4175])spawn('open',[`http://localhost:${port}`],{stdio:'ignore'}).unref();}}catch{}},350);timer.unref();setTimeout(()=>clearInterval(timer),10000).unref();
}

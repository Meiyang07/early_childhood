import { spawn,spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.chdir(root);
const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22||(major===22&&minor<13)){console.error('Install Node.js 24 LTS (or Node.js 22.13+) before starting this project.');process.exit(1);}
try{process.loadEnvFile('.env');}catch(error){if(error.code!=='ENOENT')throw error;}
function run(command,args){const result=spawnSync(command,args,{stdio:'inherit',shell:process.platform==='win32'});if(result.status!==0)process.exit(result.status??1);}
if(!existsSync('node_modules/typescript/bin/tsc')){
 const hasPnpm=spawnSync('pnpm',['--version'],{stdio:'ignore',shell:process.platform==='win32'}).status===0;
 run(hasPnpm?'pnpm':'npm',['install']);
}
console.log('Preparing your local admin panel…');
run(process.execPath,['node_modules/typescript/bin/tsc','--noEmit']);
run(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.server.json']);
run(process.execPath,['node_modules/vite/bin/vite.js','build']);
const server=spawn(process.execPath,['--env-file-if-exists=.env','dist-server/server/index.js'],{stdio:'inherit'});
const port=process.env.ADMIN_PORT??4175,url=`http://localhost:${port}`;
let stopping=false;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{stopping=true;server.kill('SIGTERM');});
server.on('error',error=>{console.error(error.message);process.exit(1);});server.on('exit',code=>process.exit(stopping?0:code??0));
if(process.platform==='darwin'&&process.env.ADMIN_OPEN_BROWSER!=='false'){
 const timer=setInterval(async()=>{try{const response=await fetch(`http://127.0.0.1:${port}/api/auth/session`);if(response.ok){clearInterval(timer);spawn('open',[url],{stdio:'ignore'}).unref();}}catch{}},350);timer.unref();setTimeout(()=>clearInterval(timer),10000).unref();
}

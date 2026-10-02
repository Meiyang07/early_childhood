import {spawnSync} from 'node:child_process';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const admin=path.join(root,'admin'),website=path.join(root,'website');
const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22||(major===22&&minor<13)){console.error('Install Node.js 24 or newer (minimum 22.13), then run npm run local again.');process.exit(1);}
const {version}=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8'));
console.log(`Early Childhood ${version} — website and admin with access and refresh tokens.`);
const configuration=path.join(admin,'.env');
if(!existsSync(configuration)){
 try{
  writeFileSync(configuration,readFileSync(path.join(admin,'.env.example')),{flag:'wx',mode:0o600});
  console.log('Created admin/.env. Edit it for token durations and email settings.');
 }catch(error){if(error.code!=='EEXIST')throw error;}
}
try{process.loadEnvFile(configuration);}catch(error){if(error.code!=='ENOENT')throw error;}
export function run(command,args,cwd=root){const result=spawnSync(command,args,{cwd,stdio:'inherit',shell:process.platform==='win32'});if(result.status!==0)process.exit(result.status??1);}
export function install(){for(const directory of [admin,website]){
 const digest=createHash('sha256').update(readFileSync(path.join(directory,'package-lock.json'))).digest('hex'),marker=path.join(directory,'node_modules/.early-childhood-lock');
 if(!existsSync(path.join(directory,'node_modules/typescript/bin/tsc'))||!existsSync(marker)||readFileSync(marker,'utf8')!==digest){run('npm',['ci'],directory);writeFileSync(marker,digest);}
}}
export function build(){install();for(const directory of [website,admin])run('npm',['run','build'],directory);}

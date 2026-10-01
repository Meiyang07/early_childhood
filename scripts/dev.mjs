import {spawn} from 'node:child_process';
import {admin,website,install,run} from './common.mjs';
install();run(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.server.json'],admin);
const children=[spawn(process.execPath,['--env-file-if-exists=.env','dist-server/server/index.js'],{cwd:admin,stdio:'inherit'}),...[admin,website].map(cwd=>spawn(process.execPath,['node_modules/vite/bin/vite.js'],{cwd,stdio:'inherit'}))];
let closing=false;function close(code=0){if(closing)return;closing=true;for(const child of children)child.kill('SIGTERM');setTimeout(()=>process.exit(code),500).unref();}
for(const child of children){child.on('error',error=>{console.error(error.message);close(1);});child.on('exit',code=>{if(!closing)close(code??1);});}
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>close());

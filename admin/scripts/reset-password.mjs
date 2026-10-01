import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const compile=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.server.json'],{stdio:'inherit'});if(compile.status!==0)process.exit(compile.status??1);
const result=spawnSync(process.execPath,['--env-file-if-exists=.env','dist-server/server/reset-password.js'],{stdio:'inherit'});process.exit(result.status??1);

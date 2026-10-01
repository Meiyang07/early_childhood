import { defineConfig,loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath,URL } from 'node:url';
import path from 'node:path';
export default defineConfig(({mode})=>{
 const env={...loadEnv(mode,process.cwd(),''),...process.env};
 const backend={target:`http://127.0.0.1:${env.ADMIN_PORT??4175}`,changeOrigin:false};
 return {plugins:[react()],resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url))}},server:{host:'127.0.0.1',port:Number(env.ADMIN_UI_PORT??5175),strictPort:true,fs:{allow:[fileURLToPath(new URL('./',import.meta.url)),fileURLToPath(new URL('../shared',import.meta.url))],deny:['**/.env*','**/*.sqlite*','**/.git/**','**/*.pem','**/*.crt',path.resolve(process.cwd(),env.ADMIN_DATA_DIR??'data').replaceAll('\\','/')+'/**']},proxy:{'/api':backend,'^/assets/.+\\.(?:jpe?g|png|webp|svg)$':backend}},preview:{host:'127.0.0.1',port:5175,strictPort:true}};
});

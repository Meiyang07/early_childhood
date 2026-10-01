import {defineConfig,loadEnv} from 'vite';
import {fileURLToPath,URL} from 'node:url';
export default defineConfig(({mode})=>{
 const env={...loadEnv(mode,fileURLToPath(new URL('../admin',import.meta.url)),''),...process.env};
 return {base:'/',server:{host:'127.0.0.1',port:Number(env.WEBSITE_UI_PORT??5174),strictPort:true,fs:{allow:[fileURLToPath(new URL('./',import.meta.url)),fileURLToPath(new URL('../shared',import.meta.url))],deny:['**/.env*','**/*.sqlite*','**/.git/**','**/*.pem','**/*.crt']},proxy:{'/api':{target:`http://127.0.0.1:${env.WEBSITE_PORT??4174}`,changeOrigin:false}}}};
});

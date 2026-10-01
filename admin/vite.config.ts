import { defineConfig,loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath,URL } from 'node:url';
export default defineConfig(({mode})=>{
 const env={...loadEnv(mode,process.cwd(),''),...process.env};
 return {plugins:[react()],resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url))}},server:{host:'127.0.0.1',port:Number(env.ADMIN_UI_PORT??5175),strictPort:true,proxy:{'/api':{target:`http://127.0.0.1:${env.ADMIN_PORT??4175}`,changeOrigin:false}}},preview:{host:'127.0.0.1',port:5175,strictPort:true}};
});

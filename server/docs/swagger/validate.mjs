import { readFile } from "node:fs/promises";

function validateSpecAndRoutes(spec,sources){
 const assert=(condition,message)=>{if(!condition)throw new Error(message);};
 assert(spec.openapi==="3.0.3","Unexpected OpenAPI version");
 const resolve=ref=>{assert(ref.startsWith("#/"),"Only local $refs are supported: "+ref);let node=spec;for(const key of ref.slice(2).split("/").map(x=>x.replace(/~1/g,"/").replace(/~0/g,"~")))node=node?.[key];assert(node!==undefined,"Unresolved ref: "+ref);};
 function walk(value){
  if(!value||typeof value!=="object")return;
  if(value.$ref)resolve(value.$ref);
  if(value.enum&&Object.prototype.hasOwnProperty.call(value,"default"))assert(value.enum.includes(value.default),"Default not in enum");
  if(value.required&&value.properties)for(const key of value.required)assert(key in value.properties,"Required property missing: "+key);
  if(value.items)assert(value.type==="array"||value.type===undefined,"items on non-array schema");
  for(const child of Object.values(value))walk(child);
 }
 walk(spec);
 const app=sources["app.ts"];assert(app,"Missing app.ts source");
 const imports={};
 for(const m of app.matchAll(/\bimport\s+(\w+|\{\s*(\w+)\s*\})\s+from\s+["'](\.\/routes\/[^"']+)\.js["']/g))imports[m[2]??m[1]]=m[3].slice(2)+".ts";
 const inventory=[];
 for(const m of app.matchAll(/\bapp\.(get|post|patch|delete|put|head|options)\s*\(\s*["']([^"']+)["']/g))inventory.push({method:m[1],path:m[2],auth:false,admin:false});
 for(const m of app.matchAll(/\bapp\.use\s*\(\s*["']([^"']+)["']\s*,\s*(\w+)\s*\)/g)){
  if(!imports[m[2]])continue;
  const source=sources[imports[m[2]]];assert(source,"Missing router source: "+imports[m[2]]);
  const routes=[...source.matchAll(/\b\w+\.(get|post|patch|delete|put|head|options)\s*\(\s*["']([^"']+)["']/g)];
  for(let i=0;i<routes.length;i++){
   const route=routes[i],block=source.slice(route.index,routes[i+1]?.index??source.length);
   const path=(m[1]+route[2]).replace(/:([A-Za-z_]\w*)/g,"{$1}");
   inventory.push({method:route[1],path,auth:/\brequireAuth\b|\brefreshSession\b/.test(block),admin:/requireRole\(\s*["']ADMIN["']\s*\)/.test(block),refresh:/\brefreshSession\b/.test(block)});
  }
 }
 const documented=[];
 const operationIds=new Set();
 for(const [path,methods] of Object.entries(spec.paths)){
  assert(path.startsWith("/"),"Invalid path: "+path);
  for(const [method,op] of Object.entries(methods)){
   if(!["get","post","patch","delete","put","head","options"].includes(method))continue;
   documented.push(method+" "+path);
   assert(op.operationId&&!operationIds.has(op.operationId),"Missing or duplicate operationId");operationIds.add(op.operationId);
   assert(op.summary&&op.responses&&Object.keys(op.responses).length,"Incomplete operation "+path);
   for(const response of Object.values(op.responses))assert(response.description||response.$ref,"Response missing description");
   for(const name of [...path.matchAll(/\{([^}]+)\}/g)].map(m=>m[1]))assert(op.parameters?.some(p=>p.in==="path"&&p.name===name&&p.required===true),"Missing required path parameter: "+path+" "+name);
   for(const security of op.security??[])for(const key of Object.keys(security))assert(spec.components.securitySchemes[key],"Unknown security scheme");
  }
 }
 const expected=inventory.map(r=>r.method+" "+r.path).sort();documented.sort();
 assert(JSON.stringify(expected)===JSON.stringify(documented),"Route coverage mismatch.\nExpected: "+expected.join("\n")+"\nDocumented: "+documented.join("\n"));
 for(const route of inventory){
  const op=spec.paths[route.path][route.method];
  const secure=!!op.security?.length;
  assert(secure===route.auth,"Authentication differs for "+route.path);
  assert((op["x-required-role"]==="ADMIN")===route.admin,"Role requirement differs for "+route.path);
  if(route.refresh)assert(op.security[0].refreshCookie,"Refresh operation must use refreshCookie");
 }
 return {operations:documented.length,schemas:Object.keys(spec.components.schemas).length,routeCoverage:"complete",authentication:"matches source"};
}

const spec = JSON.parse(await readFile(new URL("openapi.json", import.meta.url), "utf8"));
const paths = ["app.ts", ...["auth", "staff", "admission", "testimonial", "program", "photo", "event", "blog"].map(name => "routes/" + name + ".route.ts")];
const sources = {};
for (const path of paths) sources[path] = await readFile(new URL("../../src/" + path, import.meta.url), "utf8");
const report = validateSpecAndRoutes(spec, sources);
console.log("Swagger contract checks passed:", report);
console.log("Checks cover JSON structure, local refs, operation IDs, path parameters, route coverage, and route authentication. They do not start the API or replace a full OpenAPI validator.");

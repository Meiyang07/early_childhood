import type { Kind } from '../src/admin-model.js';
import { teamMembers } from './team-seed.js';
import { siteSeeds } from './site-seed.js';
export type Seed={id:string;kind:Kind;name:string;status:string;data:Record<string,string>;date?:string};
export const seeds:Seed[]=[
 ...Object.entries(teamMembers).flatMap(([group,members])=>members.map((m,i)=>({id:`staff-${group}-${i}`,kind:'staff' as const,name:m.name,status:'Active',data:{group:group==='admins'?'Admins':group==='teachers'?'Teachers':'Operators',role:m.role,imagePath:m.image?`/assets/team/${m.image}`:'',order:String(i)}}))),
 ...siteSeeds,
];

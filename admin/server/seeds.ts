import type { Kind } from '../src/admin-model.js';
import { teamMembers } from './team-seed.js';
type Seed = {id:string;kind:Kind;name:string;status:string;data:Record<string,string>;date?:string};
export const seeds:Seed[]=[
  ...[
    ['Aarav Shrestha','Preschool','2026-09-29','Review'],['Aayusha Gurung','Nursery','2026-09-28','Approved'],['Rijan Thapa','Play Group','2026-09-27','Review'],['Prakriti Karki','Preschool','2026-09-26','Approved'],['Sujal Rai','Nursery','2026-09-25','Pending'],
  ].map((v,i)=>({id:`example-admission-${i}`,kind:'admissions' as const,name:v[0],status:v[3],date:v[2],data:{program:v[1],date:v[2],example:'true',notes:'Example admission from the supplied dashboard reference.'}})),
  ...Object.entries(teamMembers).flatMap(([group,members])=>members.map((m,i)=>({id:`staff-${group}-${i}`,kind:'staff' as const,name:m.name,status:'Active',data:{group:group==='admins'?'Admins':group==='teachers'?'Teachers':'Operators',role:m.role,imagePath:m.image?`/assets/team/${m.image}`:''}}))),
  ...[
    ['Play Group','18 months–2.5 years','2900','Learning through sensory exploration and guided play.'],['Pre-Nursery','2.5–3 years','','Building language, independence, and early social skills.'],['Nursery','3–4 years','3200','Montessori materials, creative activities, and language development.'],['Preschool','4–5 years','3400','Early literacy, numeracy, and practical life activities.'],['Upper Kindergarten','5–6 years','','School readiness, confidence, and responsibility.'],['Primary','6–10 years','','Independent thinking and a strong academic foundation.'],
  ].map((v,i)=>({id:`program-${i}`,kind:'programs' as const,name:v[0],status:'Published',data:{age:v[1],fee:v[2],description:v[3]}})),
  ...[
    ['Montessori materials','Classroom','classroom-03.jpg','A child learning with pink Montessori blocks.'],['Learning together','Classroom','classroom-02.jpg','Children learning in a circle with a teacher.'],['Our classroom library','Classroom','classroom-01.jpg','Books and learning resources in the classroom.'],['Creative little artists','Activities','activities-32.webp','Children drawing and coloring together.'],
  ].map((v,i)=>({id:`gallery-${i}`,kind:'gallery' as const,name:v[0],status:'Published',data:{category:v[1],imagePath:`/assets/gallery/${v[2]}`,alt:v[3]}})),
  ...[
    ['School visit','Could we arrange a visit to see the Nursery classroom?','2026-09-29'],['Program information','Please share more details about the Play Group program.','2026-09-28'],['Working hours','What are the school’s opening days and times?','2026-09-27'],
  ].map((v,i)=>({id:`example-message-${i}`,kind:'messages' as const,name:'Example parent',status:'Unread',date:v[2],data:{subject:v[0],body:v[1],date:v[2],example:'true'}})),
  {id:'example-review-1',kind:'reviews',name:'Example parent',status:'Pending',data:{rating:'5',body:'The classroom feels welcoming, and the activities encourage independence.',date:'2026-09-29',example:'true'}},
  {id:'example-review-2',kind:'reviews',name:'Example parent',status:'Approved',data:{rating:'5',body:'Our child looks forward to learning and spending time with friends.',date:'2026-09-28',example:'true'}},
];

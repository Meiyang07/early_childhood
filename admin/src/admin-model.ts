import { z } from 'zod';
export const kinds = ['admissions','staff','reviews','messages','programs','gallery','events','blog'] as const;
export type Kind = typeof kinds[number];
export const adminKinds=kinds.filter((kind):kind is Exclude<Kind,'messages'>=>kind!=='messages');
export const categoryKinds=['gallery','events','blog'] as const;
export type CategoryKind=typeof categoryKinds[number];
export type CategoryLists=Record<CategoryKind,string[]>;
export const defaultCategories:CategoryLists={gallery:['Classroom','Activities','Outdoor','Graduation','Cultural','Events'],events:['School Event'],blog:['School News']};
export function isCategoryKind(kind:string|null):kind is CategoryKind{return categoryKinds.includes(kind as CategoryKind);}
export const normalizeCategory=(name:string)=>name.trim().normalize('NFKC').replace(/\s+/g,' ').toLowerCase();
export const categoryNameSchema=z.string().transform(name=>name.trim().normalize('NFKC').replace(/\s+/g,' ')).pipe(z.string().min(1,'Enter a category name.').max(80,'Use 80 characters or fewer.').refine(name=>!/[\u0000-\u001f\u007f,]/.test(name),'Category names cannot contain commas or control characters.').refine(name=>normalizeCategory(name)!=='all','“All” is reserved for the filter. Choose another name.'));
export type Section = 'overview' | typeof adminKinds[number] | 'settings';
export type AdminRecord = { id:string; kind:Kind; name:string; status:string; data:Record<string,string>; revision:number; createdAt:string; updatedAt:string };
export type Settings = { schoolName:string; email:string; phone:string; address:string; workingDays:string; openTime:string; closeTime:string; adminName:string };
export type PortalData = { records:AdminRecord[]; categories:CategoryLists; settings:Settings; settingsRevision:number; mail?:{configured:boolean;pending:number;failed:number;sent:number}; recoveryEmail?:string };
export type Field = { key:string; label:string; type?:'text'|'email'|'date'|'number'|'textarea'|'select'|'category'; options?:string[]; required?:boolean; max?:number; min?:number };
export const config: Record<Kind,{ title:string; singular:string; nameLabel:string; description:string; statuses:string[]; fields:Field[] }> = {
  admissions:{ title:'Admissions',singular:'admission',nameLabel:'Child’s name',description:'Review applications and update admission decisions.',statuses:['Pending','Review','Approved','Declined'],fields:[
    {key:'program',label:'Program',required:true},
    {key:'date',label:'Application date',type:'date',required:true},{key:'birthDate',label:'Date of birth',type:'date'},
    {key:'guardian',label:'Parent / guardian'},{key:'email',label:'Email',type:'email'},{key:'phone',label:'Phone'},
    {key:'gender',label:'Gender'},{key:'address',label:'Home address'},{key:'previousSchool',label:'Previous school'},{key:'medicalConditions',label:'Medical conditions',type:'textarea'},{key:'referral',label:'How they heard about us'},{key:'notes',label:'Application notes',type:'textarea'}]},
  staff:{title:'Staff & Teachers',singular:'team member',nameLabel:'Full name',description:'Manage admins, teachers, and operators.',statuses:['Active','Inactive'],fields:[
    {key:'group',label:'Team',type:'select',options:['Admins','Teachers','Operators'],required:true},{key:'role',label:'Role',required:true},{key:'bio',label:'About this member',type:'textarea'}]},
  reviews:{title:'Reviews',singular:'review',nameLabel:'Parent’s name',description:'Review parent feedback and approve testimonials.',statuses:['Pending','Approved','Hidden'],fields:[
    {key:'rating',label:'Rating',type:'select',options:['5','4','3','2','1'],required:true},{key:'body',label:'Review',type:'textarea',required:true},{key:'date',label:'Date',type:'date',required:true}]},
  messages:{title:'Messages',singular:'message',nameLabel:'Sender’s name',description:'Read enquiries and keep track of follow-up.',statuses:['Unread','Read','Resolved'],fields:[
    {key:'subject',label:'Subject',required:true},{key:'email',label:'Email',type:'email'},{key:'phone',label:'Phone'},{key:'body',label:'Message',type:'textarea',required:true},{key:'date',label:'Date',type:'date',required:true}]},
  programs:{title:'Programs',singular:'program',nameLabel:'Program name',description:'Edit program details and monthly tuition.',statuses:['Published','Draft'],fields:[
    {key:'age',label:'Age group',required:true},{key:'fee',label:'Monthly fee (NPR)',type:'number',min:0,max:100000},{key:'description',label:'Description',type:'textarea',required:true},{key:'duration',label:'Class duration'},{key:'teachers',label:'Number of teachers',type:'number',min:0,max:100},{key:'capacity',label:'Number of children',type:'number',min:0,max:1000},{key:'order',label:'Display order',type:'number',min:0,max:10000}]},
  gallery:{title:'Gallery',singular:'photo',nameLabel:'Photo title',description:'Add school photos and organize gallery categories.',statuses:['Published','Draft'],fields:[
    {key:'category',label:'Category',type:'category',required:true},{key:'alt',label:'Image description',required:true}]},
  events:{title:'Events',singular:'event',nameLabel:'Event title',description:'Plan upcoming school activities and events.',statuses:['Published','Draft','Cancelled'],fields:[
    {key:'date',label:'Event date',type:'date',required:true},{key:'time',label:'Time'},{key:'category',label:'Category',type:'category'},{key:'location',label:'Location',required:true},{key:'description',label:'Event details',type:'textarea',required:true}]},
  blog:{title:'Blog',singular:'blog post',nameLabel:'Post title',description:'Write and manage school news and articles.',statuses:['Published','Draft'],fields:[
    {key:'date',label:'Post date',type:'date',required:true},{key:'author',label:'Author',required:true},{key:'category',label:'Category',type:'category'},{key:'excerpt',label:'Short introduction',required:true},{key:'body',label:'Article',type:'textarea',required:true}]},
};
export const defaultSettings: Settings={schoolName:'Early Childhood Montessori',email:'mail@earlychildhood.edu.np',phone:'061-552290',address:'Ranipauwa, Pokhara-11, Nepal',workingDays:'Monday – Friday',openTime:'09:00',closeTime:'16:00',adminName:'Admin'};
export const settingsSchema = z.object({schoolName:z.string().trim().min(2).max(120),email:z.string().email().max(200),phone:z.literal('061-552290'),address:z.string().trim().min(3).max(300),workingDays:z.string().trim().min(3).max(60),openTime:z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),closeTime:z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),adminName:z.string().trim().min(1).max(60)}).strict().refine(v=>v.openTime<v.closeTime,{message:'Closing time must be after opening time.',path:['closeTime']});
export const kindSchema=z.enum(kinds);
export function recordCategories(record:Pick<AdminRecord,'kind'|'data'>){return [...new Set([record.data.category,...(record.kind==='gallery'?(record.data.categories??'').split(','):[])].map(value=>value?.trim()).filter((value):value is string=>!!value))];}
export function validateRecord(kind:Kind,input:unknown,categories?:CategoryLists){
  const item=z.object({name:z.string().trim().min(2,'Enter at least 2 characters.').max(160),status:z.string(),data:z.record(z.string().max(12000)),revision:z.number().int().min(0).optional(),id:z.string().max(80).optional()}).strict().parse(input);
  if(!config[kind].statuses.includes(item.status))throw new Error('Choose a valid status.');
  const data:Record<string,string>={};
  for(const field of config[kind].fields){
    let value=(item.data[field.key]??'').trim();
    if(field.required&&!value)throw new Error(`${field.label} is required.`);
    if(field.type!=='textarea'&&value.length>300)throw new Error(`${field.label} is too long.`);
    if(value&&field.type==='email'&&!z.string().email().safeParse(value).success)throw new Error('Enter a valid email address.');
    if(field.key==='phone'&&value&&!/^[0-9]{10}$/.test(value))throw new Error('Phone must contain exactly 10 digits after +977.');
    if(value&&field.type==='select'&&!field.options?.includes(value))throw new Error(`Choose a valid ${field.label.toLowerCase()}.`);
    if(value&&field.type==='category'&&isCategoryKind(kind)){
      const match=categories?.[kind].find(name=>normalizeCategory(name)===normalizeCategory(value));
      if(categories&&!match)throw new Error('Create this category first, then select it.');
      value=match??categoryNameSchema.parse(value);
    }
    if(value&&field.type==='number'&&(!Number.isFinite(Number(value))||Number(value)<(field.min??0)||Number(value)>(field.max??100000)))throw new Error(`Enter a valid ${field.label.toLowerCase()}.`);
    if(value&&field.type==='date'&&(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(new Date(value).getTime())||new Date(value).toISOString().slice(0,10)!==value))throw new Error('Enter a valid date.');
    data[field.key]=value;
  }
  if(kind==='staff'||kind==='gallery'||kind==='blog'){
    const path=item.data.imagePath??'';
    if(path&&!/^\/(?:assets\/[a-zA-Z0-9\/_-]+\.(?:jpg|jpeg|png|webp)|api\/media\/[a-zA-Z0-9-]+)$/.test(path))throw new Error('Choose a valid photo.');
    if(kind==='gallery'&&!path)throw new Error('Add a photo for the gallery.');
    data.imagePath=path;
  }
  if(item.data.example==='true')data.example='true';
  for(const key of ['order','categories','portrait'])if(item.data[key]!==undefined&&data[key]===undefined)data[key]=item.data[key].slice(0,300);
  if(kind==='gallery'&&categories&&data.categories){
    data.categories=data.categories.split(',').map(value=>{
      const match=categories.gallery.find(name=>normalizeCategory(name)===normalizeCategory(value));
      if(!match)throw new Error('Choose existing gallery categories.');
      return match;
    }).join(',');
  }
  return {...item,data};
}
export function dateLabel(date:string){return date ? new Intl.DateTimeFormat('en',{month:'short',day:'numeric',timeZone:'Asia/Katmandu'}).format(new Date(date+'T00:00:00Z')) : '—';}

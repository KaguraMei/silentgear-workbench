import source from './data.js';
export interface Material { id:string; name:string; english:string; color:string; stats:Record<string,Record<string,unknown>>; model:Record<string,{texture:string;color?:string}[]>; availability:{tier:number;categories:string[]}; harvest_tier?:string }
export interface TraitDefinition { name:string;english:string;description:string;localizedDescription?:string;localizedDescriptionLong?:string;translationKey?:string;translationSource?:string;type:string;max_level:number }
export const data=source as unknown as {version:string;date:string;materials:Record<string,Material>;traits:Record<string,TraitDefinition>;stats:Record<string,[string,string]>;textures:string[]};
export const format=(n:number)=>Number.isFinite(n)?new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2}).format(n):'—';
export const roman=(n:number)=>['','I','II','III','IV','V'][n]||String(n);

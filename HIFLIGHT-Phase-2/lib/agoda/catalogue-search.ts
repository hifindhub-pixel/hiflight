import { readFile } from 'node:fs/promises';
import { agodaBindings } from './server-config';
import { join } from 'node:path';
export type Destination = { id:number; name:string; country:string; countryId:number; countryCode:string; region?:string; label:string; aliases?:string[]; hotelCount:number };
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
let cached: { ids:Set<number>; entries:{city:Destination;name:string;text:string}[] } | undefined;
let pending: Promise<NonNullable<typeof cached>> | undefined;
async function loadCatalogue(){
 if(!cached){
  let cities: Destination[];
  if (process.env.NODE_ENV === 'development') {
   cities = JSON.parse(await readFile(join(process.cwd(),'lib/agoda/destinations-full.json'),'utf8'));
  } else {
   const object = await agodaBindings().AGODA_CATALOGUE?.get('destinations-v1.json');
   if (!object) throw new Error('Missing Agoda catalogue');
   cities = await object.json<Destination[]>();
  }
  cached={ids:new Set(cities.map(c=>c.id)),entries:cities.map(city=>({city,name:normalize(city.name),text:normalize([city.name,city.country,...(city.aliases||[])].join(' '))}))};
 }
 return cached;
}
async function catalogue(){
 if (!pending) pending = loadCatalogue().catch(error => { pending = undefined; throw error; });
 return pending;
}
export async function isAgodaCity(id:unknown){return typeof id==='number'&&Number.isSafeInteger(id)&&(await catalogue()).ids.has(id);}
export async function searchDestinations(query:string){
 const normalized=normalize(query),tokens=normalized.split(' ').filter(Boolean);
 if(normalized.length<2)return {results:[],matches:0};
 const matches=(await catalogue()).entries.filter(entry=>tokens.every(token=>entry.text.includes(token)));
 const rank=(name:string)=>name===normalized?0:name.startsWith(normalized)?1:tokens.every(token=>name.includes(token))?2:3;
 matches.sort((a,b)=>rank(a.name)-rank(b.name)||b.city.hotelCount-a.city.hotelCount||a.city.label.localeCompare(b.city.label,'fr'));
 return {results:matches.slice(0,20).map(({city})=>({id:city.id,name:city.name,country:city.country,region:city.region,label:city.label})),matches:matches.length};
}

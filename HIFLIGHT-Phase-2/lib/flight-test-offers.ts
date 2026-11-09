export const testDestinations = [{code:'RAK',name:'Marrakech',country:'Maroc'},{code:'ALG',name:'Alger',country:'Algérie'},{code:'BCN',name:'Barcelone',country:'Espagne'},{code:'LIS',name:'Lisbonne',country:'Portugal'},{code:'ROM',name:'Rome',country:'Italie'},{code:'IST',name:'Istanbul',country:'Turquie'}];
export type FlightTestOffer = {id:string;origin:string;destination:string;departure:string;returnDate:string;price:number;changes:number;foundAt:string};
export function flightOfferLink(o:FlightTestOffer){
 const short=(date:string)=>date.slice(8,10)+date.slice(5,7);
 const url=new URL('https://vols.hiflight.fr/');
 url.searchParams.set('flightSearch',`${o.origin}${short(o.departure)}${o.destination}${o.returnDate?short(o.returnDate):''}1`);
 if(o.changes===0)url.searchParams.set('direct','true');
 url.searchParams.set('utm_source','hiflight');url.searchParams.set('utm_medium','hub');url.searchParams.set('utm_campaign','flight_offers_test');
 return url.toString();
}
export function normalizeOffers(rows:unknown,origin:string,destination:string,month:string):FlightTestOffer[]{
 if(!Array.isArray(rows))return [];
 const today=new Date().toISOString().slice(0,10);
 const date=(v:unknown):v is string=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
 const offers:FlightTestOffer[]=[];const ids=new Set<string>();
 for(const r of rows){
 if(!r||r.origin!==origin||r.destination!==destination||r.trip_class!==0||r.actual===false||!date(r.depart_date)||!r.depart_date.startsWith(month)||r.depart_date<today||typeof r.value!=='number'||!Number.isFinite(r.value)||r.value<=0||!Number.isInteger(r.number_of_changes)||r.number_of_changes<0||typeof r.found_at!=='string'||!Number.isFinite(Date.parse(r.found_at)))continue;
 if(r.return_date&&(!date(r.return_date)||r.return_date<r.depart_date))continue;
 const id=[origin,destination,r.depart_date,r.return_date||'',r.number_of_changes,r.value].join(':');if(ids.has(id))continue;ids.add(id);
 offers.push({id,origin,destination,departure:r.depart_date,returnDate:r.return_date||'',price:r.value,changes:r.number_of_changes,foundAt:r.found_at});
 }return offers.sort((a,b)=>a.price-b.price).slice(0,24);
}

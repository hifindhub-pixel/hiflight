import {NextRequest,NextResponse} from 'next/server';
import {getCloudflareContext} from '@opennextjs/cloudflare';
import {normalizeOffers,testDestinations} from '@/lib/flight-test-offers';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const destination=req.nextUrl.searchParams.get('destination')||'',month=req.nextUrl.searchParams.get('month')||'';
 if(!testDestinations.some(d=>d.code===destination)||!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))return NextResponse.json({error:'Destination ou mois invalide.'},{status:400});
 const first=new Date(month+'-01T00:00:00Z'),now=new Date();const delta=(first.getUTCFullYear()-now.getUTCFullYear())*12+first.getUTCMonth()-now.getUTCMonth();
 if(delta<0||delta>11)return NextResponse.json({error:'Choisissez un mois dans les douze prochains mois.'},{status:400});
 let bindings:{TP_TOKEN?:string;TRAVELPAYOUTS_TOKEN?:string;AGODA_RATE_LIMITER?:{limit:(o:{key:string})=>Promise<{success:boolean}>}}={};
 try{bindings=getCloudflareContext().env as typeof bindings;}catch{}
 const token=bindings.TP_TOKEN||bindings.TRAVELPAYOUTS_TOKEN||process.env.TP_TOKEN||process.env.TRAVELPAYOUTS_TOKEN;
 if(!token)return NextResponse.json({error:'Les tarifs Travelpayouts ne sont pas activés sur ce site de test. Le mode Démonstration reste disponible.'},{status:503});
 try{
 if(process.env.NODE_ENV==='production'){
 const ip=req.headers.get('cf-connecting-ip');if(!bindings.AGODA_RATE_LIMITER||!ip)return NextResponse.json({error:'Recherche temporairement indisponible.'},{status:503});
 if(!(await bindings.AGODA_RATE_LIMITER.limit({key:`flight-test:${ip}`})).success)return NextResponse.json({error:'Patientez une minute avant de relancer la recherche.'},{status:429});
 }
 const url=new URL('https://api.travelpayouts.com/v2/prices/month-matrix');
 for(const [k,v] of Object.entries({origin:'PAR',destination,month:month+'-01',currency:'eur',show_to_affiliates:'true'}))url.searchParams.set(k,v);
 const res=await fetch(url,{headers:{'X-Access-Token':token,Accept:'application/json'},signal:AbortSignal.timeout(15000),next:{revalidate:1800}});
 if(!res.ok)throw new Error('upstream');const data=await res.json();if(data.success===false)throw new Error('upstream');
 return NextResponse.json({offers:normalizeOffers(data.data,'PAR',destination,month),cached:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Les tarifs ne sont pas disponibles pour le moment. Réessayez plus tard.'},{status:502});}
}

import { agodaEnabled } from '@/lib/agoda/server-config';
import { NextResponse } from 'next/server';
import { searchDestinations } from '@/lib/agoda/catalogue-search';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request:Request){
 if(!agodaEnabled())return NextResponse.json({error:'Prototype local uniquement.'},{status:404});
 const query=new URL(request.url).searchParams.get('q')?.trim()||'';
 if(query.length>120)return NextResponse.json({error:'Recherche trop longue.'},{status:400});
 try{return NextResponse.json(await searchDestinations(query),{headers:{'Cache-Control':'private, max-age=300'}});}
 catch{return NextResponse.json({error:'Le catalogue des destinations est indisponible. Relancez le serveur local.'},{status:503});}
}

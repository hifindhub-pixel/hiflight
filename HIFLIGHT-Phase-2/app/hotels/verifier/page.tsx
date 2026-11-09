import { agodaEnabled, agodaBindings } from '@/lib/agoda/server-config';
import { notFound, redirect } from 'next/navigation';
import { buildHotelLink } from '@/lib/agoda/hotel-link';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Vérifier votre offre hôtel — HiFlight', robots: { index: false, follow: false } };
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
 if (!agodaEnabled()) notFound();
 const p=await searchParams;
 const text=(k:string)=>typeof p[k]==='string'?p[k] as string:'';
 const validDate=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
 if(!validDate(text('checkin'))||!validDate(text('checkout'))||text('checkout')<=text('checkin')||(Date.parse(text('checkout'))-Date.parse(text('checkin')))/86400000>30) notFound();
 const cityId=Number(text('cityId')),hotelId=Number(text('hotelId')),adults=Number(text('adults'));
 if(!Number.isSafeInteger(cityId)||cityId<=0||!Number.isSafeInteger(hotelId)||hotelId<=0||!Number.isInteger(adults)||adults<1||adults>6) notFound();
 const cid=agodaBindings().AGODA_AUTH?.split(':')[0];
 if(!cid||!/^\d+$/.test(cid)) notFound();
 redirect(buildHotelLink(hotelId,cid,text('checkin'),text('checkout'),adults));
}

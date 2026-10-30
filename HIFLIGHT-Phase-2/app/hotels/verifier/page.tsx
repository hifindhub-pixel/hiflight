import { agodaEnabled } from '@/lib/agoda/server-config';
import { notFound } from 'next/navigation';
import OfferCheck from './OfferCheck';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Vérifier votre offre hôtel — HiFlight', robots: { index: false, follow: false } };
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
 if (!agodaEnabled()) notFound();
 const p=await searchParams;
 const text=(k:string)=>typeof p[k]==='string'?p[k] as string:'';
 const validDate=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
 if(!validDate(text('checkin'))||!validDate(text('checkout'))||text('checkout')<=text('checkin')||(Date.parse(text('checkout'))-Date.parse(text('checkin')))/86400000>30) notFound();
 const cityId=Number(text('cityId')),hotelId=Number(text('hotelId')),adults=Number(text('adults')),previous=Number(text('price'));
 if(!Number.isSafeInteger(cityId)||cityId<=0||!Number.isSafeInteger(hotelId)||hotelId<=0||!Number.isInteger(adults)||adults<1||adults>6) notFound();
 return <OfferCheck criteria={{cityId,hotelId,adults,checkin:text('checkin'),checkout:text('checkout')}} previous={Number.isFinite(previous)&&previous>0?previous:null}/>;
}

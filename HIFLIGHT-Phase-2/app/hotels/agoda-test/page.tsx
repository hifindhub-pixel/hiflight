import { agodaEnabled } from '@/lib/agoda/server-config';
export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import HotelSearchExperience from '@/components/HotelSearchExperience';
import ServiceFaq from '@/components/ServiceFaq';
export const metadata = { title:'Hôtels Agoda — aperçu local', robots:{index:false,follow:false} };
export default function Page() {
 if(!agodaEnabled()) notFound();
 return <main className="market-page"><HotelSearchExperience provider="agoda"/><ServiceFaq service="hotels"/></main>;
}

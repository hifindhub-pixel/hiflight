import type {Metadata} from 'next';
import Offers from './Offers';
export const metadata:Metadata={title:'Offres de vols — test',robots:{index:false,follow:false},alternates:{canonical:null}};
export default function Page(){return <Offers/>;}

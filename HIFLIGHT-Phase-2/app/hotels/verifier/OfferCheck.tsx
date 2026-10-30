'use client';
import {useEffect,useState} from 'react';
import styles from './offer.module.css';
type Criteria={cityId:number;hotelId:number;adults:number;checkin:string;checkout:string};
type Offer={hotelId:number;hotelName:string;dailyRate:number;propertyURL:string};
const money=(n:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n);
export default function OfferCheck({criteria,previous}:{criteria:Criteria;previous:number|null}) {
 const [offer,setOffer]=useState<Offer|null>(null),[state,setState]=useState<'loading'|'found'|'missing'|'error'>('loading'),[error,setError]=useState(''),[attempt,setAttempt]=useState(0),[time,setTime]=useState('');
 useEffect(()=>{
  const controller=new AbortController();setState('loading');setOffer(null);setError('');
  (async()=>{try {
   const response=await fetch('/api/agoda-test/',{method:'POST',cache:'no-store',signal:controller.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify(criteria)});
   const data=await response.json();if(!response.ok)throw new Error(data.error||'Vérification momentanément indisponible.');
   if(!Array.isArray(data.results))throw new Error('Réponse de vérification invalide.');
   const h=data.results.find((item:Offer)=>item.hotelId===criteria.hotelId);
   if(controller.signal.aborted)return;
   if(h){const u=new URL(h.propertyURL);if(u.protocol!=='https:'||u.hostname!=='www.agoda.com')throw new Error('Lien de réservation invalide.');}
   setOffer(h||null);setState(h?'found':'missing');setTime(new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date(data.checkedAt)));
  }catch(e){if(!controller.signal.aborted){setState('error');setError(e instanceof Error?e.message:'Vérification indisponible.');}}})();
  return ()=>controller.abort();
 },[criteria,attempt]);
 const nights=(Date.parse(criteria.checkout)-Date.parse(criteria.checkin))/86400000;
 const fallback=new URL('https://www.agoda.com/partners/partnersearch.aspx');
 Object.entries({cid:'1964270',hid:String(criteria.hotelId),checkin:criteria.checkin,checkout:criteria.checkout,NumberofAdults:String(criteria.adults),NumberofChildren:'0',Rooms:'1',currency:'EUR',hl:'fr-fr',pcs:'6'}).forEach(([k,v])=>fallback.searchParams.set(k,v));
 return <main className={styles.page}><section className={styles.panel} aria-busy={state==='loading'}>
  <a href="/hotels/" className={styles.back}>← Rechercher un hôtel</a><p className={styles.eyebrow}>HIFLIGHT · VOTRE OFFRE</p>
  <h1>{state==='loading'?'Un dernier regard sur votre offre…':state==='found'?'Votre tarif vient d’être actualisé':'Offre à confirmer sur Agoda'}</h1>
  <p>{criteria.checkin} → {criteria.checkout} · {criteria.adults} adulte{criteria.adults>1?'s':''} · 1 chambre</p>
  <div role="status" aria-live="polite">
   {state==='loading'&&<p>Nous interrogeons à nouveau Agoda pour vos dates et vos voyageurs.</p>}
   {state==='found'&&offer&&<><h2>{offer.hotelName}</h2><p className={styles.price}>{money(offer.dailyRate)} <span>/ nuit</span></p><strong>Hors taxes et frais</strong><p>{money(offer.dailyRate*nights)} pour {nights} nuit{nights>1?'s':''} · total indicatif hors taxes et frais</p>{previous!==null&&Math.round(previous*100)!==Math.round(offer.dailyRate*100)&&<p className={styles.notice}>Le prix a changé depuis votre recherche : {money(previous)} → {money(offer.dailyRate)} par nuit, hors taxes et frais.</p>}<p>Offre reçue d’Agoda à {time}. Le prix final, les frais obligatoires et la disponibilité seront confirmés sur Agoda.</p></>}
   {state==='missing'&&<p>Cette offre n’apparaît plus parmi les résultats renvoyés. Cela ne signifie pas forcément que l’hôtel est complet : notre recherche reçoit jusqu’à 30 hôtels. Nous ne pouvons pas reconfirmer l’ancien tarif.</p>}
   {state==='error'&&<p role="alert">{error} L’ancien tarif n’a pas été reconfirmé.</p>}
  </div>
  {state!=='loading'&&<><a className={styles.cta} href={offer?.propertyURL||fallback.toString()} rel="sponsored noopener noreferrer">{offer?'Voir le prix final sur Agoda ↗':'Consulter directement Agoda ↗'}</a><button className={styles.retry} type="button" onClick={()=>setAttempt(n=>n+1)}>Actualiser la vérification</button></>}
 </section></main>;
}

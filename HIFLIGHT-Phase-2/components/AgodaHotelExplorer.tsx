"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import HotelComparison from "./HotelComparison";
import { HotelSearch, bookingSearch } from "./HotelExplorer";
import { resolveAgodaDestination } from "@/lib/agoda/resolve-destination";
import styles from "./AgodaHotelExplorer.module.css";
const HotelMap=dynamic(()=>import("@/app/hotels/agoda-test/HotelMap"),{ssr:false,loading:()=> <p role="status">Chargement de la carte…</p>});
type Hotel={hotelId:number;hotelName:string;dailyRate:number;reviewScore:number;reviewCount:number;starRating:number;latitude:number;longitude:number;includeBreakfast:boolean;freeWifi:boolean;landingURL:string;imageURL:string};
const money=(amount:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(amount);
const dateLabel=(value:string)=>new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short'}).format(new Date(value+'T12:00:00'));
const validDate=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
function Photo({hotel}:{hotel:Hotel}){const [failed,setFailed]=useState(false);return hotel.imageURL&&!failed?<img src={hotel.imageURL} alt={hotel.hotelName} loading="lazy" onError={()=>setFailed(true)}/>:<div className={styles.noPhoto}>Photo indisponible</div>;}
export default function AgodaHotelExplorer({search}:{search:HotelSearch}){
 const [hotels,setHotels]=useState<Hotel[]>([]),[loading,setLoading]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false),[reload,setReload]=useState(0),[selected,setSelected]=useState<number|null>(null);
 const [view,setView]=useState<'split'|'list'|'map'>('split');
 const [checkedAt,setCheckedAt]=useState('');
 const [favorites,setFavorites]=useState<number[]>([]),[favoritesOnly,setFavoritesOnly]=useState(false);
 const [compareIds,setCompareIds]=useState<number[]>([]),[choiceMessage,setChoiceMessage]=useState('');
 useEffect(()=>{try{const ids=JSON.parse(localStorage.getItem('hiflight-hotel-favorites')||'[]');if(Array.isArray(ids))setFavorites([...new Set(ids.filter(id=>Number.isSafeInteger(id)&&id>0))].slice(0,1000));}catch{}},[]);
 function favorite(id:number){
  const next=favorites.includes(id)?favorites.filter(n=>n!==id):[...favorites,id].slice(-1000);
  setFavorites(next);try{localStorage.setItem('hiflight-hotel-favorites',JSON.stringify(next));setChoiceMessage('Favoris mis à jour sur cet appareil.');}catch{setChoiceMessage('Favoris conservés pour cette visite uniquement : stockage du navigateur indisponible.');}
 }
 function compare(id:number){
  if(compareIds.includes(id)){setCompareIds(ids=>ids.filter(n=>n!==id));setChoiceMessage('Hôtel retiré de la comparaison.');}
  else if(compareIds.length<3){setCompareIds(ids=>[...ids,id]);setChoiceMessage('Hôtel ajouté à la comparaison.');}
  else setChoiceMessage('Vous pouvez comparer trois hôtels. Retirez-en un pour changer votre sélection.');
 }
 function choiceButtons(h:Hotel){return <div className={styles.choiceButtons}><button type="button" aria-pressed={favorites.includes(h.hotelId)} aria-label={`${favorites.includes(h.hotelId)?'Retirer des':'Ajouter aux'} favoris : ${h.hotelName}`} onClick={()=>favorite(h.hotelId)}>{favorites.includes(h.hotelId)?'♥ Enregistré':'♡ Favori'}</button><button type="button" aria-pressed={compareIds.includes(h.hotelId)} aria-label={`${compareIds.includes(h.hotelId)?'Retirer de':'Ajouter à'} la comparaison : ${h.hotelName}`} onClick={()=>compare(h.hotelId)}>{compareIds.includes(h.hotelId)?'✓ Sélectionné':'+ Comparer'}</button></div>;}

 const [sort,setSort]=useState('price'),[budget,setBudget]=useState(''),[breakfast,setBreakfast]=useState(false),[score,setScore]=useState('0');
 const hasDates=validDate(search.checkin)&&validDate(search.checkout)&&search.checkout>search.checkin;
 const stayNights=hasDates?(Date.parse(search.checkout)-Date.parse(search.checkin))/86400000:0;
 useEffect(()=>{
  const controller=new AbortController();
  setHotels([]);setCompareIds([]);setChoiceMessage('');setError('');setDone(false);setSelected(null);setLoading(false);
  if(!search.checkin&&!search.checkout)return ()=>controller.abort();
  if(!hasDates){setError('Choisissez une date d’arrivée et une date de départ valides.');return ()=>controller.abort();}
  setLoading(true);
  async function load(){
   try{
    const cityId=search.agodaCityId||await resolveAgodaDestination(search.destination,controller.signal);
    const response=await fetch('/api/agoda-test/',{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({cityId,checkin:search.checkin,checkout:search.checkout,adults:Number(search.guests)})});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||'Recherche Agoda indisponible.');
    if(!controller.signal.aborted){setHotels(data.results);setCheckedAt(new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit'}).format(new Date(data.checkedAt)));setDone(true);}
   }catch(reason){if(!controller.signal.aborted)setError(reason instanceof Error?reason.message:'Recherche Agoda indisponible.');}
   finally{if(!controller.signal.aborted)setLoading(false);}
  }
  void load();return ()=>controller.abort();
 },[search.destination,search.agodaCityId,search.checkin,search.checkout,search.guests,reload,hasDates]);
 const filtered=useMemo(()=>hotels.filter(h=>(!favoritesOnly||favorites.includes(h.hotelId))&&(!budget||h.dailyRate<=Number(budget))&&h.reviewScore>=Number(score)&&(!breakfast||h.includeBreakfast)).sort((a,b)=>sort==='price'?a.dailyRate-b.dailyRate:b.reviewScore-a.reviewScore),[hotels,budget,score,breakfast,sort,favoritesOnly,favorites]);
 const active=filtered.find(h=>h.hotelId===selected);
 const compared=hotels.filter(h=>compareIds.includes(h.hotelId));
 function reset(){setBudget('');setScore('0');setBreakfast(false);setFavoritesOnly(false);}
 return <section className={`results-shell hotel-live-shell ${styles.shell}`} id="hotel-offers" aria-label="Recherche d’hôtels Agoda" aria-busy={loading}>
  <div className="results-toolbar hotel-live-toolbar"><div><strong>Rechercher un hébergement à {search.destination}</strong><span>{hasDates?`Séjour du ${dateLabel(search.checkin)} au ${dateLabel(search.checkout)} · ${search.guests} adulte${search.guests==='1'?'':'s'} · 1 chambre`:'Sélectionnez vos dates pour explorer les offres proposées.'}</span></div></div>
  <div className={styles.content}>
   <p className={styles.intro}>Explorez les hôtels proposés par Agoda sur la carte. La réservation s’effectue directement sur Agoda.</p>
   {!hasDates&&!error&&<div className={styles.empty}><strong>Où poserez-vous vos valises ?</strong><p>Choisissez vos dates dans le formulaire ci-dessus pour découvrir les hôtels et leurs disponibilités.</p></div>}
   {loading&&<div className={styles.empty} role="status"><span className={styles.spinner}/><strong>Recherche des offres Agoda…</strong><p>Nous consultons Agoda pour vos dates et vos voyageurs.</p></div>}
   {error&&<div className={styles.error} role="alert"><p>{error}</p><button type="button" onClick={()=>setReload(n=>n+1)}>Réessayer</button></div>}
   {done&&!loading&&<>
    <div className={styles.notice}><strong>Prix hors taxes et frais.</strong> Le montant à payer sera plus élevé. Les tarifs et disponibilités peuvent évoluer. Une nouvelle consultation est effectuée au clic sur « Vérifier l’offre ». Le prix final et la disponibilité restent à confirmer sur Agoda.</div>
    <details className={styles.filterPanel}><summary>Affiner la recherche <span>Budget · Note · Petit-déjeuner</span></summary><div className={styles.filters}><label>Trier par<select value={sort} onChange={e=>setSort(e.target.value)}><option value="price">Prix croissant</option><option value="rating">Meilleures notes</option></select></label><label>Budget / nuit hors taxes (€)<input type="number" min="0" value={budget} placeholder="Sans limite" onChange={e=>setBudget(e.target.value)}/></label><label>Note minimum<select value={score} onChange={e=>setScore(e.target.value)}><option value="0">Toutes les notes</option><option value="8">8 / 10</option><option value="9">9 / 10</option></select></label><label className={styles.checkbox}><input type="checkbox" checked={breakfast} onChange={e=>setBreakfast(e.target.checked)}/> Petit-déjeuner inclus</label></div></details>
    <div className={styles.favoritesBar}><button type="button" aria-pressed={favoritesOnly} onClick={()=>setFavoritesOnly(v=>!v)}>♥ Mes favoris dans ces résultats ({hotels.filter(h=>favorites.includes(h.hotelId)).length})</button><span>Enregistrés sur cet appareil · tarifs actualisés à chaque recherche</span></div>
    <p className={styles.choiceStatus} role="status">{choiceMessage}</p>
    <div className={styles.resultHeader}><p className={styles.count} role="status">{filtered.length} hôtel{filtered.length>1?'s':''} affiché{filtered.length>1?'s':''} sur {hotels.length} reçus · jusqu’à 30 résultats.<br/>Offres consultées à {checkedAt} · <button className={styles.refresh} type="button" onClick={()=>setReload(n=>n+1)}>Actualiser</button></p><div className={styles.viewSwitch} aria-label="Affichage des résultats">{(['list','split','map'] as const).map(mode=><button type="button" key={mode} aria-pressed={view===mode} onClick={()=>setView(mode)} className={mode==='split'?styles.splitOption:undefined}>{mode==='list'?'Liste':mode==='map'?'Carte':'Liste + carte'}</button>)}</div></div>
    {!filtered.length?<div className={styles.empty}><strong>{hotels.length?'Aucun hôtel avec ces filtres':'Aucune disponibilité reçue pour ces critères'}</strong><p>{hotels.length?'Retirez un filtre pour retrouver les hôtels.':'Essayez une autre destination ou d’autres dates.'}</p>{hotels.length>0&&<button type="button" onClick={reset}>Effacer les filtres</button>}</div>:<div className={`${styles.grid} ${view==='map'?styles.mapOnly:view==='list'?styles.listOnly:styles.splitView}`}>
     <div className={styles.list}>{filtered.map(h=><article key={h.hotelId} id={`agoda-hotel-${h.hotelId}`} className={`${styles.card} ${active?.hotelId===h.hotelId?styles.selected:''}`}><div className={styles.photo}><Photo hotel={h}/></div><div className={styles.details}><small>{h.starRating>0?`${h.starRating} étoiles`:''}</small><h2>{h.hotelName}</h2>{h.reviewScore>0&&<p><b className={styles.rating}>{h.reviewScore.toLocaleString('fr-FR')}/10</b> · {h.reviewCount} avis</p>}<p>{h.includeBreakfast?'Petit-déjeuner inclus':''}{h.includeBreakfast&&h.freeWifi?' · ':''}{h.freeWifi?'Wi-Fi gratuit':''}</p><button className={styles.locate} type="button" onClick={()=>{setSelected(h.hotelId);if(window.innerWidth<=800||view==='list')setView('map');requestAnimationFrame(()=>document.getElementById('agoda-map')?.scrollIntoView({behavior:'smooth',block:'center'}));}}>Situer sur la carte</button>{choiceButtons(h)}</div><div className={styles.price}><strong>{money(h.dailyRate)}</strong><small>par nuit · hors taxes et frais</small><span>{money(h.dailyRate*stayNights)} pour {stayNights} nuits<small>Total indicatif hors taxes et frais</small></span><a href={h.landingURL} target="_blank" rel="noopener noreferrer sponsored">Vérifier l’offre ↗</a></div></article>)}</div>
     <aside className={styles.map}><div className={styles.mapHeader}><div><strong>Votre séjour, sur la carte</strong><span>{filtered.length} hôtels à explorer</span></div><span className={styles.mapBadge}>HiFlight</span></div><HotelMap hotels={filtered} selectedId={active?.hotelId} onSelect={id=>{setSelected(id);if(view==='split'&&window.innerWidth>800)document.getElementById(`agoda-hotel-${id}`)?.scrollIntoView({behavior:'smooth',block:'nearest'});}} selectionCard={active&&<div className={styles.mobileHotelSheet} aria-label={`Hôtel sélectionné : ${active.hotelName}`}><button type="button" className={styles.closeSheet} onClick={()=>setSelected(null)} aria-label="Fermer la fiche hôtel">✕</button><div className={styles.sheetPhoto}><Photo key={active.hotelId} hotel={active}/></div><div className={styles.sheetInfo}><h3>{active.hotelName}</h3><p>{active.reviewScore>0?`${active.reviewScore.toLocaleString('fr-FR')}/10 · `:''}{money(active.dailyRate)} / nuit</p><small>Hors taxes et frais · disponibilité à confirmer</small>{choiceButtons(active)}<a href={active.landingURL} target="_blank" rel="noopener noreferrer sponsored">Vérifier l’offre ↗</a></div></div>}/>
     </aside>
    </div>}
   </>}
  </div>
  {done&&!loading&&<HotelComparison hotels={compared} nights={stayNights} stay={`${dateLabel(search.checkin)} – ${dateLabel(search.checkout)} · ${search.guests} adultes`} onRemove={id=>setCompareIds(ids=>ids.filter(n=>n!==id))} onClear={()=>setCompareIds([])}/>}
  <div className={styles.fallback}><h2>Poursuivre sur Booking.com</h2><p>Retrouvez votre destination, vos dates et vos voyageurs sur Booking.com, également accessible si la recherche Agoda est indisponible.</p><article><div><strong>Booking.com</strong><p>Consulter les hébergements et tarifs sur Booking.com</p></div><a href={bookingSearch(search)} target="_blank" rel="noopener noreferrer sponsored">Voir les offres ↗</a></article></div>
 </section>;
}

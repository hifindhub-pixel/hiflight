"use client";

import { useRef } from 'react';
import styles from './AgodaHotelExplorer.module.css';

export type ComparisonHotel = {
  hotelId:number; hotelName:string; imageURL:string; dailyRate:number;
  reviewScore:number; reviewCount:number; starRating:number;
  includeBreakfast:boolean; freeWifi:boolean; landingURL:string;
};
const money=(n:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n);

export default function HotelComparison({hotels,nights,stay,onRemove,onClear}:{
  hotels:ComparisonHotel[];nights:number;stay:string;
  onRemove:(id:number)=>void;onClear:()=>void;
}){
  const dialog=useRef<HTMLDialogElement>(null);
  if(!hotels.length)return null;
  return <>
    <div className={styles.compareTray} aria-label="Votre sélection à comparer">
      <div><strong>{hotels.length}/3 hôtels sélectionnés</strong><span>{hotels.length<2?'Ajoutez un deuxième hôtel pour comparer.':'Comparez les offres de cette recherche.'}</span></div>
      <div className={styles.trayActions}>
        <button type="button" onClick={onClear}>Effacer</button>
        <button type="button" disabled={hotels.length<2} onClick={()=>dialog.current?.showModal()}>Comparer ({hotels.length})</button>
      </div>
    </div>
    <dialog ref={dialog} className={styles.compareDialog} aria-labelledby="compare-hotels-title">
      <header><div><h2 id="compare-hotels-title">Quel hôtel vous correspond ?</h2><p>{stay} · 1 chambre</p></div><button type="button" autoFocus onClick={()=>dialog.current?.close()} aria-label="Fermer la comparaison">✕</button></header>
      <p className={styles.compareNotice}>Prix hors taxes et frais. Disponibilités et montant final à confirmer sur Agoda.</p>
      <div className={styles.comparisonScroll} tabIndex={0} role="region" aria-label="Tableau comparatif, défilement horizontal sur mobile">
        <table className={styles.compareTable}>
          <caption>Offres de la recherche en cours</caption>
          <thead><tr><th scope="col">Votre sélection</th>{hotels.map(h=><th scope="col" key={h.hotelId}><div className={styles.compareImage}>{h.imageURL&&<img src={h.imageURL} alt="" onError={e=>{e.currentTarget.style.display='none';}}/>}</div><strong>{h.hotelName}</strong><button type="button" onClick={()=>onRemove(h.hotelId)} aria-label={`Retirer ${h.hotelName} de la comparaison`}>Retirer</button></th>)}</tr></thead>
          <tbody>
            <tr><th scope="row">Prix / nuit HT</th>{hotels.map(h=><td key={h.hotelId}><strong>{money(h.dailyRate)}</strong></td>)}</tr>
            <tr><th scope="row">Total indicatif HT · {nights} nuits</th>{hotels.map(h=><td key={h.hotelId}>{money(h.dailyRate*nights)}</td>)}</tr>
            <tr><th scope="row">Avis voyageurs</th>{hotels.map(h=><td key={h.hotelId}>{h.reviewScore>0?`${h.reviewScore.toLocaleString('fr-FR')}/10 · ${h.reviewCount} avis`:'Non renseigné'}</td>)}</tr>
            <tr><th scope="row">Étoiles</th>{hotels.map(h=><td key={h.hotelId}>{h.starRating>0?`${h.starRating} étoiles`:'Non renseigné'}</td>)}</tr>
            <tr><th scope="row">Petit-déjeuner inclus</th>{hotels.map(h=><td key={h.hotelId}>{h.includeBreakfast?'Oui':'Non indiqué dans cette offre'}</td>)}</tr>
            <tr><th scope="row">Wi-Fi gratuit</th>{hotels.map(h=><td key={h.hotelId}>{h.freeWifi?'Oui':'Non indiqué'}</td>)}</tr>
            <tr><th scope="row">Réserver</th>{hotels.map(h=><td key={h.hotelId}><a href={h.landingURL} target="_blank" rel="noopener noreferrer sponsored">Vérifier sur Agoda ↗</a></td>)}</tr>
          </tbody>
        </table>
      </div>
      <p className={styles.compareHint}>Sur mobile, faites glisser le tableau horizontalement pour voir tous les hôtels.</p>
    </dialog>
  </>;
}

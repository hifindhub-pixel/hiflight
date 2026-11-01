'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { frenchMapStyle } from '@/lib/agoda/map-language';
type MapHotel = { hotelId:number; hotelName:string; latitude:number; longitude:number; dailyRate:number; imageURL?:string; landingURL?:string; reviewScore?:number };
export default function HotelMap({hotels,selectedId,onSelect,selectionCard}:{hotels:MapHotel[];selectedId?:number;onSelect:(id:number)=>void;selectionCard?:ReactNode}) {
 const container=useRef<HTMLDivElement>(null), map=useRef<Leaflet.Map|null>(null), lib=useRef<typeof Leaflet|null>(null), markers=useRef(new Map<number,Leaflet.Marker>()), callback=useRef(onSelect);
 const [ready,setReady]=useState(false),[error,setError]=useState(''); callback.current=onSelect;
 useEffect(()=>{let cancelled=false;let observer:ResizeObserver|undefined;const controller=new AbortController();
 import('leaflet').then(L=>{if(cancelled||!container.current)return;lib.current=L;const m=L.map(container.current,{scrollWheelZoom:true,zoomControl:false}).setView([48.86,2.35],11);map.current=m;L.control.zoom({position:"topright",zoomInTitle:"Zoomer",zoomOutTitle:"Dézoomer"}).addTo(m);m.attributionControl.setPrefix(false);
 // Vector labels can be localized, unlike names baked into raster tiles.
 void (async()=>{
  try{
   const [gl,bridge,response]=await Promise.all([import('maplibre-gl'),import('@maplibre/maplibre-gl-leaflet'),fetch('https://tiles.openfreemap.org/styles/liberty',{signal:controller.signal})]);
   if(!response.ok)throw new Error('style');
   const style=frenchMapStyle(await response.json());
   if(cancelled)return;
   gl.setWorkerUrl('/vendor/hiflight-map-worker.mjs');
   const layer=bridge.maplibreGL({style,attributionControl:false}).addTo(m);
   m.attributionControl.addAttribution('<a href="https://openfreemap.org/">OpenFreeMap</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>');
   layer.getMaplibreMap().on('error',()=>{if(!cancelled)setError('Une partie du fond de carte n’a pas pu être chargée. La liste reste disponible.');});
  }catch{if(!cancelled)setError('Fond de carte indisponible. La liste des hôtels reste utilisable.');}
 })();
 let previousWidth=0;observer=new ResizeObserver(()=>{m.invalidateSize();const width=container.current?.clientWidth||0;if(width>0&&previousWidth===0){const points=[...markers.current.values()].map(marker=>marker.getLatLng());if(points.length)m.fitBounds(L.latLngBounds(points),{padding:[45,45],maxZoom:14});}previousWidth=width;});observer.observe(container.current);setReady(true);
 }).catch(()=>setError('La carte ne peut pas être chargée. La liste reste disponible.'));
 return()=>{cancelled=true;controller.abort();observer?.disconnect();map.current?.remove();map.current=null;};},[]);
 useEffect(()=>{const m=map.current,L=lib.current;if(!ready||!m||!L)return;markers.current.forEach(marker=>marker.remove());markers.current.clear();const points:Leaflet.LatLngTuple[]=[];
 hotels.forEach(h=>{if(!Number.isFinite(h.latitude)||!Number.isFinite(h.longitude)||Math.abs(h.latitude)>90||Math.abs(h.longitude)>180)return;
 const label=document.createElement('span');label.textContent=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(h.dailyRate)+' HT*';
 const popup=document.createElement('div');popup.className='hotel-map-preview';
 if(h.imageURL){const img=document.createElement('img');img.src=h.imageURL;img.alt='';img.loading='lazy';img.onerror=()=>img.remove();popup.append(img);}
 const title=document.createElement('strong');title.textContent=h.hotelName;popup.append(title);
 const detail=document.createElement('p');detail.textContent=`${h.reviewScore ? h.reviewScore.toLocaleString('fr-FR')+'/10 · ' : ''}${new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(h.dailyRate)} / nuit`;popup.append(detail);
 const note=document.createElement('small');note.textContent='Hors taxes et frais · disponibilité à confirmer';popup.append(note);
 if(h.landingURL){try{const url=new URL(h.landingURL,window.location.origin);if(url.origin===window.location.origin&&url.pathname==='/hotels/verifier/'){const link=document.createElement('a');link.href=url.toString();link.target='_blank';link.rel='noopener noreferrer sponsored';link.textContent='Vérifier l’offre ↗';popup.append(link);}}catch{}}
 const marker=L.marker([h.latitude,h.longitude],{icon:L.divIcon({className:'hotel-price-pin',html:label,iconSize:[90,30],iconAnchor:[45,15]}),title:h.hotelName,keyboard:true}).addTo(m).bindPopup(popup,{maxWidth:270,minWidth:230});
 marker.on('click',()=>callback.current(h.hotelId));markers.current.set(h.hotelId,marker);points.push([h.latitude,h.longitude]);});
 if(points.length)m.fitBounds(L.latLngBounds(points),{padding:[45,45],maxZoom:14});
 },[hotels,ready]);
 useEffect(()=>{if(!ready)return;markers.current.forEach((marker,id)=>{marker.getElement()?.classList.toggle('is-selected',id===selectedId);marker.setZIndexOffset(id===selectedId?1000:0);});const selected=selectedId?markers.current.get(selectedId):null;if(selected){selected.openPopup();map.current?.panTo(selected.getLatLng());}else{map.current?.closePopup();}},[selectedId,hotels,ready]);
 // Keep price labels apart in screen space; crowded hotels remain clickable dots.
 useEffect(()=>{
  const m=map.current;if(!ready||!m)return;
  function arrange(){
   if(!m)return;
   const occupied:{x:number;y:number}[]=[];
   const entries=[...markers.current.entries()].sort(([a],[b])=>a===selectedId?-1:b===selectedId?1:a-b);
   const size=m.getSize();
   for(const [id,marker] of entries){
    const element=marker.getElement();if(!element)continue;
    const point=m.latLngToContainerPoint(marker.getLatLng());
    const visible=point.x>=-45&&point.y>=-15&&point.x<=size.x+45&&point.y<=size.y+15;
    const compact=id!==selectedId&&(!visible||occupied.some(p=>Math.abs(p.x-point.x)<104&&Math.abs(p.y-point.y)<42));
    element.classList.toggle('is-compact',compact);
    element.setAttribute('aria-label',marker.options.title||'Hôtel');
    if(!compact&&visible)occupied.push(point);
   }
  }
  arrange();m.on('zoomend moveend resize',arrange);
  return()=>{m.off('zoomend moveend resize',arrange);};
 },[ready,hotels,selectedId]);
 return <><div className="agoda-map-stage"><div id="agoda-map" className="agoda-leaflet-map" ref={container} role="region" aria-label="Carte interactive des hôtels, zoom avec la roulette"/>{hotels.length>0&&<button type="button" className="agoda-map-recenter" onClick={()=>{const L=lib.current,m=map.current,points=[...markers.current.values()].map(x=>x.getLatLng());if(L&&m&&points.length)m.fitBounds(L.latLngBounds(points),{padding:[45,45],maxZoom:14});}}>⌖ Recentrer</button>}{selectionCard}</div>{error&&<p role="status">{error}</p>}<div className="agoda-map-caption"><span>{hotels.length>0?'Prix par nuit · hors taxes et frais':'Explorez librement la carte'}</span><details><summary>À propos de la carte</summary><p>Noms en français lorsqu’ils sont disponibles, sinon en caractères latins. Zoomez avec la roulette. Les petits points représentent aussi des hôtels : cliquez pour voir leur offre.</p></details></div></>;
}

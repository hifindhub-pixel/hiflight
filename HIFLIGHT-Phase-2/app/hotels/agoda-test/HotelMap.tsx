'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LocateFixed, Maximize2, Minimize2, Minus, Plus, MapPin, Mouse } from 'lucide-react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { frenchMapStyle } from '@/lib/agoda/map-language';

type MapHotel = { hotelId:number; hotelName:string; latitude:number; longitude:number; dailyRate:number; imageURL?:string; landingURL?:string; reviewScore?:number };
const money = new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR', maximumFractionDigits:0 });
export default function HotelMap({hotels,selectedId,onSelect,selectionCard}:{hotels:MapHotel[];selectedId?:number;onSelect:(id:number)=>void;selectionCard?:ReactNode}) {
 const container=useRef<HTMLDivElement>(null), stage=useRef<HTMLDivElement>(null), expandButton=useRef<HTMLButtonElement>(null);
 const map=useRef<Leaflet.Map|null>(null), lib=useRef<typeof Leaflet|null>(null), markers=useRef(new Map<number,Leaflet.Marker>()), callback=useRef(onSelect);
 const [ready,setReady]=useState(false),[loaded,setLoaded]=useState(false),[error,setError]=useState(''),[expanded,setExpanded]=useState(false),[visibleCount,setVisibleCount]=useState(0);
 callback.current=onSelect;
 const fit=()=>{const L=lib.current,m=map.current,points=[...markers.current.values()].map(x=>x.getLatLng());if(L&&m){if(points.length)m.fitBounds(L.latLngBounds(points),{paddingTopLeft:[60,90],paddingBottomRight:[60,65],maxZoom:14});else m.setView([48.86,2.35],12);}};
 useEffect(()=>{let cancelled=false;let observer:ResizeObserver|undefined;const controller=new AbortController();
 import('leaflet').then(L=>{if(cancelled||!container.current)return;lib.current=L;
 const m=L.map(container.current,{scrollWheelZoom:true,zoomControl:false,zoomSnap:.5}).setView([48.86,2.35],12);map.current=m;m.attributionControl.setPrefix(false);
 void (async()=>{try{
  const [gl,bridge,response]=await Promise.all([import('maplibre-gl'),import('@maplibre/maplibre-gl-leaflet'),fetch('https://tiles.openfreemap.org/styles/liberty',{signal:controller.signal})]);
  if(!response.ok)throw new Error('style');const style=frenchMapStyle(await response.json());if(cancelled)return;
  gl.setWorkerUrl('/vendor/hiflight-map-worker.mjs');
  const layer=bridge.maplibreGL({style,attributionControl:false}).addTo(m);
  m.attributionControl.addAttribution('<a href="https://openfreemap.org/">OpenFreeMap</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>');
  layer.getMaplibreMap().on('load',()=>{if(!cancelled)setLoaded(true);});
  layer.getMaplibreMap().on('error',()=>{if(!cancelled){setLoaded(true);setError('Le fond de carte est partiellement indisponible. Retrouvez les hôtels dans la liste.');}});
 }catch{if(!cancelled){setLoaded(true);setError('Le fond de carte ne peut pas être affiché dans ce navigateur. La liste reste disponible.');}}})();
 observer=new ResizeObserver(()=>m.invalidateSize({pan:false}));observer.observe(container.current);setReady(true);
 }).catch(()=>{setLoaded(true);setError('La carte ne peut pas être chargée. La liste reste disponible.');});
 return()=>{cancelled=true;controller.abort();observer?.disconnect();map.current?.remove();map.current=null;};},[]);
 useEffect(()=>{const m=map.current,L=lib.current;if(!ready||!m||!L)return;
 markers.current.forEach(marker=>marker.remove());markers.current.clear();
 hotels.forEach(h=>{if(!Number.isFinite(h.latitude)||!Number.isFinite(h.longitude)||Math.abs(h.latitude)>90||Math.abs(h.longitude)>180)return;
 const label=document.createElement('span');label.textContent=money.format(h.dailyRate)+' HT*';
 const popup=document.createElement('div');popup.className='hotel-map-preview';
 if(h.imageURL){const img=document.createElement('img');img.src=h.imageURL;img.alt=h.hotelName;img.loading='lazy';img.onerror=()=>img.remove();popup.append(img);}
 const body=document.createElement('div');body.className='hotel-map-preview-body';popup.append(body);
 if(h.reviewScore){const rating=document.createElement('span');rating.className='hotel-map-rating';rating.textContent=h.reviewScore.toLocaleString('fr-FR')+' / 10';body.append(rating);}
 const title=document.createElement('strong');title.textContent=h.hotelName;body.append(title);
 const detail=document.createElement('p');detail.className='hotel-map-price';const price=document.createElement('b');price.textContent=money.format(h.dailyRate);detail.append(price,document.createTextNode(' / nuit'));body.append(detail);
 const note=document.createElement('small');note.textContent='Hors taxes et frais · disponibilité à confirmer';body.append(note);
 if(h.landingURL){try{const url=new URL(h.landingURL,window.location.origin);if(url.protocol==='https:'&&(url.hostname==='agoda.com'||url.hostname.endsWith('.agoda.com'))){const link=document.createElement('a');link.href=url.toString();link.target='_blank';link.rel='noopener noreferrer sponsored';link.textContent='Voir sur Agoda ↗';body.append(link);}}catch{}}
 const marker=L.marker([h.latitude,h.longitude],{icon:L.divIcon({className:'hotel-price-pin',html:label,iconSize:[88,34],iconAnchor:[44,17]}),title:h.hotelName,keyboard:true}).addTo(m).bindPopup(popup,{maxWidth:288,minWidth:250,autoPanPaddingTopLeft:L.point(20,85),autoPanPaddingBottomRight:L.point(20,50)});
 marker.on('click',()=>callback.current(h.hotelId));markers.current.set(h.hotelId,marker);
 });fit();
 },[hotels,ready]);
 useEffect(()=>{if(!ready)return;markers.current.forEach((marker,id)=>{marker.getElement()?.classList.toggle('is-selected',id===selectedId);marker.setZIndexOffset(id===selectedId?1000:0);});const selected=selectedId?markers.current.get(selectedId):null;if(selected){if(window.matchMedia('(max-width: 800px)').matches)map.current?.panTo(selected.getLatLng());selected.openPopup();}else map.current?.closePopup();},[selectedId,hotels,ready]);
 useEffect(()=>{const m=map.current;if(!ready||!m)return;
 function arrange(){if(!m)return;const occupied:{x:number;y:number}[]=[];let visible=0;
 const entries=[...markers.current.entries()].sort(([a],[b])=>a===selectedId?-1:b===selectedId?1:0),size=m.getSize();
 const limit=Math.max(4,Math.min(16,Math.floor(size.x*size.y/29000)));
 for(const [id,marker] of entries){const element=marker.getElement();if(!element)continue;const point=m.latLngToContainerPoint(marker.getLatLng());const inView=point.x>=0&&point.y>=0&&point.x<=size.x&&point.y<=size.y;if(inView)visible++;
 const compact=id!==selectedId&&(!inView||occupied.length>=limit||occupied.some(p=>Math.abs(p.x-point.x)<112&&Math.abs(p.y-point.y)<54));element.classList.toggle('is-compact',compact);element.setAttribute('aria-label',`${marker.options.title||'Hôtel'} · ${element.textContent||''} par nuit`);if(!compact&&inView)occupied.push(point);}
 setVisibleCount(visible);
 }arrange();m.on('zoomend moveend resize',arrange);return()=>{m.off('zoomend moveend resize',arrange);};},[ready,hotels,selectedId]);
 useEffect(()=>{if(!expanded)return;const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';const oldFocus=document.activeElement as HTMLElement|null;expandButton.current?.focus();
 const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setExpanded(false);if(e.key==='Tab'){const nodes=Array.from(stage.current?.querySelectorAll<HTMLElement>('button,a[href],[tabindex="0"]')||[]).filter(el=>el.getClientRects().length);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};document.addEventListener('keydown',key);return()=>{document.body.style.overflow=oldOverflow;document.removeEventListener('keydown',key);oldFocus?.focus();};},[expanded]);
 return <><div ref={stage} className={`agoda-map-stage${expanded?' is-expanded':''}`} role={expanded?'dialog':undefined} aria-modal={expanded||undefined} aria-label={expanded?'Carte des hôtels agrandie':undefined}>
 <div id="agoda-map" className="agoda-leaflet-map" ref={container} role="region" aria-label="Carte interactive des hôtels, zoom avec la roulette"/>
 <div className="hotel-map-location"><span className="hotel-map-location-icon"><MapPin size={17}/></span><div><strong>{hotels.length?'Hôtels sur la carte':'Carte des hôtels'}</strong><span>{hotels.length?`${visibleCount} hôtel${visibleCount>1?'s':''} dans cette zone`:'Paris · vue de la ville'}</span></div></div>
 <div className="hotel-map-controls"><button ref={expandButton} type="button" onClick={()=>setExpanded(v=>!v)} title={expanded?'Réduire la carte':'Agrandir la carte'} aria-label={expanded?'Réduire la carte':'Agrandir la carte'}>{expanded?<Minimize2 size={18}/>:<Maximize2 size={18}/>}</button><div className="hotel-map-zoom"><button type="button" aria-label="Zoomer" onClick={()=>map.current?.zoomIn()}><Plus size={20}/></button><button type="button" aria-label="Dézoomer" onClick={()=>map.current?.zoomOut()}><Minus size={20}/></button></div><button type="button" aria-label="Recentrer la carte" title="Recentrer la carte" onClick={fit}><LocateFixed size={19}/></button></div>
 {!loaded&&!error&&<div className="hotel-map-loading" role="status">Chargement de la carte…</div>}
 {error&&<div className="hotel-map-error" role="status">{error}</div>}
 <div className="hotel-map-hint"><Mouse size={14}/><span>Zoom à la roulette</span></div>{selectionCard}
 </div><div className="agoda-map-caption"><span>{hotels.length>0?'Prix par nuit · hors taxes et frais':'Noms en français ou en caractères latins'}</span><details><summary>Lire la carte</summary><p>Les points représentent les autres hôtels. Zoomez ou sélectionnez un point pour afficher sa fiche. Noms en français lorsqu’ils sont disponibles, sinon en caractères latins.</p></details></div></>;
}

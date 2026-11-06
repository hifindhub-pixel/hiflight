"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import type { GlobeMode, GlobeStateMap } from "./HiflightGlobe";
import { GLOBE_COUNTRIES } from "@/lib/world-map/globeCountries";
import { MOROCCO_UNIFIED_GLOBE_RING, thinRing } from "@/lib/world-map/geometry";
import { VECTOR_FLAGS } from "@/lib/world-map/vectorFlags";
import { MISSING_VECTOR_FLAGS } from "@/lib/world-map/missingVectorFlags";
import styles from "./HiflightFlatMap.module.css";

// Unwrap each island before projecting: Fiji and Russia must not cross the whole map.
// Some source features share an ISO code (islands and mainland).
const groupedCountries = [...GLOBE_COUNTRIES.reduce((groups, country) => {
  const existing = groups.get(country.code);
  groups.set(country.code, existing ? { ...existing, rings: [...existing.rings, ...country.rings] } : country);
  return groups;
}, new Map<string, (typeof GLOBE_COUNTRIES)[number]>()).values()];
const shapes = groupedCountries.filter(c => c.code !== "ESH").map(country => ({
  ...country,
  paths: (country.code === "MAR" ? [MOROCCO_UNIFIED_GLOBE_RING] : country.rings).map(ring => {
    let previous = ring[0][0];
    const points = thinRing(ring, 1).map(([lon, lat]) => {
      while (lon - previous > 180) lon -= 360;
      while (lon - previous < -180) lon += 360;
      previous = lon;
      return [(lon + 180) / 360 * 1000, (90 - lat) / 180 * 500];
    });
    const xs = points.map(p => p[0]);
    const min = Math.min(...xs), max = Math.max(...xs);
    const shifts = [0, ...(min < 0 ? [1000] : []), ...(max > 1000 ? [-1000] : [])];
    return shifts.map(shift => points.map(([x,y], i) => `${i ? "L" : "M"}${(x + shift).toFixed(2)},${y.toFixed(2)}`).join(" ") + "Z");
  }).flat(),
}));

type Country = { code: string; name: string; code2: string | null };
type Props = { states: GlobeStateMap; mode: GlobeMode; onCountryPress: (code: string) => void; countries: Country[] };
type Camera = { x: number; y: number; zoom: number };
const initial: Camera = { x: 0, y: 0, zoom: 1 };
const clamp = (v: number, low: number, high: number) => Math.max(low, Math.min(high, v));

export default function HiflightFlatMap({ states, mode, onCountryPress, countries }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const layerRef = useRef<SVGGElement>(null);
  const camera = useRef<Camera>({ ...initial });
  const controls = useRef<(factor?: number) => void>(() => undefined);
  const moved = useRef(false);
  const [zoom, setZoom] = useState(1);
  const prefix = useId().replace(/:/g, "");
  const allowed = new Set(countries.map(c => c.code));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let frame = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let previous: { x: number; y: number; distance: number } | null = null;
    let origin = { x: 0, y: 0 };
    const point = (event: PointerEvent | WheelEvent) => {
      const p = svg.createSVGPoint(); p.x = event.clientX; p.y = event.clientY;
      const matrix = svg.getScreenCTM();
      return matrix ? p.matrixTransform(matrix.inverse()) : p;
    };
    function paint() {
      const c = camera.current;
      c.x = clamp(c.x, 1000 * (1 - c.zoom), 0);
      c.y = clamp(c.y, 500 * (1 - c.zoom), 0);
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = camera.current;
        layerRef.current?.setAttribute("transform", `translate(${next.x} ${next.y}) scale(${next.zoom})`);
        setZoom(next.zoom);
      });
    }
    function zoomAt(factor: number, x: number, y: number) {
      const c = camera.current, next = clamp(c.zoom * factor, 1, 24), ratio = next / c.zoom;
      camera.current = { x: x - (x - c.x) * ratio, y: y - (y - c.y) * ratio, zoom: next };
      paint();
    }
    controls.current = factor => {
      if (factor === undefined) { camera.current = { ...initial }; paint(); }
      else zoomAt(factor, 500, 250);
    };
    const center = () => {
      const p = [...pointers.values()];
      return p.length > 1 ? { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2, distance: Math.max(1, Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y)) } : p.length ? { ...p[0], distance: 0 } : null;
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const p = point(event);
      if (!pointers.size) { moved.current = false; origin = { x: event.clientX, y: event.clientY }; }
      pointers.set(event.pointerId, p); previous = center();
      if (pointers.size > 1) moved.current = true;
      // Capture on the country itself so a stationary tap still activates that country.
      (event.target as Element).setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      if (Math.hypot(event.clientX-origin.x, event.clientY-origin.y) > 5) moved.current = true;
      pointers.set(event.pointerId, point(event));
      const next = center();
      if (previous && next) {
        if (previous.distance && next.distance) zoomAt(next.distance / previous.distance, previous.x, previous.y);
        camera.current.x += next.x - previous.x; camera.current.y += next.y - previous.y;
        paint();
      }
      previous = next;
    };
    const up = (event: PointerEvent) => {
      if (event.type !== "pointerup") moved.current = true;
      pointers.delete(event.pointerId); previous = center();
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault(); const p = point(event);
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 500 : 1);
      zoomAt(Math.exp(-clamp(delta, -200, 200) * .002), p.x, p.y);
    };
    svg.addEventListener("pointerdown", down); svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
    const lost = (event: PointerEvent) => { pointers.delete(event.pointerId); previous = center(); };
    svg.addEventListener("lostpointercapture", lost);
    svg.addEventListener("wheel", wheel, { passive: false });
    return () => {
      cancelAnimationFrame(frame); controls.current = () => undefined;
      svg.removeEventListener("pointerdown", down); svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerup", up); svg.removeEventListener("pointercancel", up); svg.removeEventListener("lostpointercapture", lost); svg.removeEventListener("wheel", wheel);
    };
  }, []);

  return <div className={styles.panel}>
    <div className={styles.toolbar}>
      <label>Choisir un pays<select value="" onChange={e => { if (e.target.value) onCountryPress(e.target.value); }}><option value="">Rechercher dans la liste…</option>{[...countries].sort((a,b) => a.name.localeCompare(b.name, "fr")).map(c => <option value={c.code} key={c.code}>{c.name}</option>)}</select></label>
      <div className={styles.controls} aria-label="Zoom de la carte">
        <button type="button" aria-label="Dézoomer" disabled={zoom <= 1} onClick={() => controls.current(1/1.5)}><Minus size={18}/></button>
        <span>{Math.round(zoom * 100)} %</span>
        <button type="button" aria-label="Zoomer" disabled={zoom >= 24} onClick={() => controls.current(1.5)}><Plus size={18}/></button>
        <button type="button" aria-label="Recentrer la carte du monde" onClick={() => controls.current()}><RotateCcw size={17}/></button>
      </div>
    </div>
    <svg ref={svgRef} className={styles.map} viewBox="0 0 1000 500" role="group" aria-label="Carte du monde interactive" aria-describedby={`${prefix}-help`}>
      <defs>{shapes.filter(c => states[c.code]?.[mode]).map(c => {
        const key = c.code2?.toLowerCase() || "";
        const flag = VECTOR_FLAGS[key] || MISSING_VECTOR_FLAGS[key];
        return flag ? <pattern id={`${prefix}-${c.code}`} key={c.code} width="1" height="1" patternContentUnits="objectBoundingBox"><image href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(flag)}`} width="1" height="1" preserveAspectRatio="none"/></pattern> : null;
      })}</defs>
      <g ref={layerRef}>
        <path d="M0 250H1000 M500 0V500 M0 125H1000 M0 375H1000 M250 0V500 M750 0V500" stroke="#22435c" strokeWidth=".5" fill="none"/>
        {shapes.map(c => {
          const active = !!states[c.code]?.[mode], interactive = allowed.has(c.code);
          const key = c.code2?.toLowerCase() || "";
          const flag = VECTOR_FLAGS[key] || MISSING_VECTOR_FLAGS[key];
          return <g key={c.code} className={interactive ? styles.country : styles.territory} role={interactive ? "button" : undefined} tabIndex={interactive ? 0 : undefined} aria-label={interactive ? `${c.name}${active ? mode === "visited" ? ", visité" : ", à visiter" : ""}` : undefined} onClick={e => { if (interactive && (e.detail === 0 || !moved.current)) onCountryPress(c.code); }} onKeyDown={e => { if (interactive && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onCountryPress(c.code); } }} fill={active ? flag ? `url(#${prefix}-${c.code})` : "#ff7772" : "#667f91"}>
            <title>{c.name}</title>{c.paths.map((d,i) => <path key={i} d={d} stroke="#10283b" strokeWidth=".65" vectorEffect="non-scaling-stroke"/>)}
          </g>;
        })}
      </g>
    </svg>
    <div className={styles.caption} id={`${prefix}-help`}><span>Roulette pour zoomer · Glisser pour déplacer · Toucher un pays pour le modifier</span><span>Sur mobile : pincer pour zoomer</span></div>
  </div>;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Countdown } from "./Countdown";
import { deals, dealsCheckedOn, travelTuesday } from "@/lib/deals";

/** Rubrique « Bons plans du moment » : bannière Travel Tuesday + offres relevées, qui s’éteignent à leur date de fin. */
export default function Deals() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); }, []);
  const ttOver = now !== null && now > new Date(travelTuesday.date).getTime() + 86400000;
  const live = deals.filter((d) => now === null || now < new Date(d.end).getTime());

  return (
    <section className="section home-block" id="bons-plans">
      <div className="home-head"><h2>Bons plans du moment</h2><span className="deals-checked">Relevés le {dealsCheckedOn}</span></div>
      {!ttOver ? (
        <div className="tt-banner" style={{ backgroundImage: `linear-gradient(90deg,rgba(3,12,29,.9),rgba(3,12,29,.55) 55%,rgba(3,12,29,.15)),url(${travelTuesday.image})` }}>
          <div className="tt-banner-copy">
            <span className="tt-badge">Travel Tuesday · mardi 1er décembre</span>
            <Countdown to={travelTuesday.date} className="art-count" />
            <h3>Les vraies bonnes affaires, sans se faire avoir.</h3>
            <p>Notre guide, et les prix de référence HiFlight sur 12 trajets au départ de Paris pour savoir si une promo en est une.</p>
            <div className="tt-banner-actions">
              <Link href={travelTuesday.href} className="wm-btn wm-btn-main">Lire le guide</Link>
              <Link href={travelTuesday.search} className="wm-btn">Comparer les vols</Link>
            </div>
          </div>
        </div>
      ) : null}
      <div className="deal-grid">
        {live.map((d) => (
          <article className="deal-card" key={d.title}>
            <span className="deal-tag">{d.tag}</span>
            <h3>{d.title}</h3>
            <strong className="deal-figure">{d.figure}</strong>
            <p>{d.detail}</p>
            <em className="deal-dates">{d.dates}</em>
            <a href={d.href} target="_blank" rel="noopener nofollow" className="deal-link">Voir l’offre →</a>
            <small>Source : {d.source}</small>
          </article>
        ))}
      </div>
      <p className="deals-note">Offres des compagnies et sites partenaires, relevées par HiFlight : HiFlight ne les vend pas. Prix et places sous réserve de disponibilité, conditions sur le site de l’offre.</p>
    </section>
  );
}

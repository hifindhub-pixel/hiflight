"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deals, dealsCheckedOn } from "@/lib/deals";

/** « Bons plans du moment » : mêmes carrés que « Où partir en ce moment », une carte par offre, qui s’éteint à sa date de fin. */
export default function Deals() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); }, []);
  const live = deals.filter((d) => now === null || now < new Date(d.end).getTime());
  if (!live.length) return null;

  return (
    <section className="section home-block" id="bons-plans">
      <div className="home-head"><h2>Bons plans du moment</h2><span className="deals-checked">Relevés le {dealsCheckedOn}</span></div>
      <div className="dest-grid">
        {live.map((d) => {
          const body = (
            <>
              <img src={d.image} alt={d.alt} loading="lazy" width="400" height="300" />
              <div>
                <strong>{d.title}</strong>
                <span>{d.sub}</span>
                <em>{d.figure ? <>{d.before} <b>{d.figure}</b> {d.after}</> : d.cta}</em>
              </div>
            </>
          );
          return d.external
            ? <a key={d.title} href={d.href} target="_blank" rel="noopener nofollow" className="dest-card">{body}</a>
            : <Link key={d.title} href={d.href} className="dest-card">{body}</Link>;
        })}
      </div>
      <p className="deals-note">Offres des compagnies et sites partenaires, relevées par HiFlight : HiFlight ne les vend pas. Prix et places sous réserve de disponibilité, conditions sur le site de l’offre.</p>
    </section>
  );
}

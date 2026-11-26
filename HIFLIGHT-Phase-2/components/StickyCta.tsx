"use client";

import { useEffect, useState } from "react";
import { track } from "./Analytics";

/** Barre de réservation fixe : visible dès que le formulaire de comparaison n’est plus à l’écran. */
export default function StickyCta({ label, price, route }: { label: string; price?: number; route: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("comparer");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`sticky-cta${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <div>
        <strong>{label}</strong>
        {price ? <span>dès {price} € aller-retour</span> : <span>Comparez les prix</span>}
      </div>
      <a href="#comparer" tabIndex={visible ? 0 : -1} onClick={() => track("sticky_cta_click", { route })}>Comparer ce vol</a>
    </div>
  );
}

"use client";

import { FormEvent } from "react";
import { flixBusLink, partnerHref } from "@/lib/travel-marketplace";
import { track } from "./Analytics";

export default function GroundSearch() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    track("partner_click", { provider: "FlixBus", category: "ground", origin: String(data.get("origin") || ""), destination: String(data.get("destination") || "") });
    window.open(partnerHref(flixBusLink, { clickref: "hiflight_ground" }), "_blank", "noopener,noreferrer");
  }

  return <form className="market-search" onSubmit={submit}><label>Départ<input name="origin" placeholder="Ville ou gare" required /></label><label>Destination<input name="destination" placeholder="Ville ou gare" required /></label><label>Aller<input type="date" name="departure" required /></label><label>Voyageurs<select name="travelers"><option>1 voyageur</option><option>2 voyageurs</option><option>3 voyageurs</option></select></label><button type="submit">Voir sur FlixBus</button></form>;
}

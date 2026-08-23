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

  return <form className="ground-search-premium" onSubmit={submit}><div className="ground-search-route"><label><small>Départ</small><div><i aria-hidden="true" /><input name="origin" placeholder="Ville ou gare" required /></div></label><span className="ground-route-line" aria-hidden="true">→</span><label><small>Destination</small><div><i aria-hidden="true" /><input name="destination" placeholder="Ville ou gare" required /></div></label></div><label className="ground-date-field"><small>Date de départ</small><input type="date" name="departure" required /></label><label className="ground-travelers-field"><small>Voyageurs</small><select name="travelers"><option>1 voyageur</option><option>2 voyageurs</option><option>3 voyageurs</option></select></label><button className="ground-search-submit" type="submit"><span>Voir les trajets</span><b>→</b></button></form>;
}

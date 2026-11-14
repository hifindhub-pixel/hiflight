"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function daysLeft(to: string) {
  return Math.ceil((new Date(to).getTime() - Date.now()) / 86400000);
}

function label(days: number) {
  if (days > 1) return `Plus que ${days} jours`;
  if (days === 1) return "C’est demain !";
  return "C’est aujourd’hui !";
}

/** Compte à rebours en jours ; disparaît 24 h après la date. */
export function Countdown({ to, className }: { to: string; className?: string }) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setDays(daysLeft(to));
    update();
    const id = setInterval(update, 3_600_000);
    return () => clearInterval(id);
  }, [to]);
  if (days === null || days < 0) return null;
  return <span className={className}>{label(days)}</span>;
}

/** Bandeau d’accueil vers l’article Travel Tuesday ; masqué après l’événement. */
export function PromoStrip({ to, href, title }: { to: string; href: string; title: string }) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => { setDays(daysLeft(to)); }, [to]);
  if (days !== null && days < 0) return null;
  return (
    <Link href={href} className="promo-strip">
      <span className="promo-title">{title}</span>
      {days !== null ? <span className="promo-count">{label(days)}</span> : null}
      <em>Préparer mes vols →</em>
    </Link>
  );
}

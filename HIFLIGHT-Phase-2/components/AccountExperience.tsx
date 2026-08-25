"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import styles from "./AccountExperience.module.css";

export default function AccountExperience() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [fullName, setFullName] = useState("");
  const [language, setLanguage] = useState("fr");
  const [currency, setCurrency] = useState("EUR");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) { router.replace("/connexion"); return; }
    if (!user) return;
    fetch("/api/user/profile", { cache: "no-store" }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Profil indisponible.");
      setFullName(payload.profile.full_name || "");
      setLanguage(payload.profile.preferred_language || "fr");
      setCurrency(payload.profile.preferred_currency || "EUR");
    }).catch((reason) => setError(reason.message));
  }, [user, loading, router]);

  async function save(event: FormEvent) {
    event.preventDefault(); setError(""); setMessage("");
    const response = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, language, currency }) });
    const payload = await response.json();
    if (!response.ok) { setError(payload.error || "Enregistrement impossible."); return; }
    setMessage("Vos préférences sont enregistrées.");
  }

  if (loading || !user) return <main className={styles.loading}>Ouverture de votre espace…</main>;
  const initial = (fullName || user.email || "H").trim().charAt(0).toUpperCase();

  return <main className={styles.page}><section className={styles.header}><div className={styles.avatar}>{initial}</div><div><span>Compte HiFlight</span><h1>{fullName || "Mon espace"}</h1><p>{user.email}</p></div></section><section className={styles.grid}><div className={styles.shortcuts}><Link href="/world-map"><span>World Map</span><strong>Retrouver ma carte →</strong></Link><Link href="/world-map?view=passport"><span>Passeport</span><strong>Voir mes tampons →</strong></Link></div><form className={styles.form} onSubmit={save}><h2>Mon profil</h2><label>Nom complet<input value={fullName} onChange={(event) => setFullName(event.target.value)} /></label><div><label>Langue<select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="fr">Français</option><option value="en">English</option></select></label><label>Devise<select value={currency} onChange={(event) => setCurrency(event.target.value)}><option>EUR</option><option>USD</option><option>GBP</option></select></label></div>{error && <p className={styles.error}>{error}</p>}{message && <p className={styles.success}>{message}</p>}<button>Enregistrer</button></form><aside className={styles.security}><h2>Sécurité</h2><p>Votre carte et votre passeport sont privés. Chaque compte ne peut lire et modifier que ses propres données.</p><button onClick={async () => { await signOut(); router.push("/"); }}>Se déconnecter</button></aside></section></main>;
}

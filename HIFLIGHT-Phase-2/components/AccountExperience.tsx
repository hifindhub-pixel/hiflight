"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, FileText, Globe2, Languages, LogOut, Mail, Save, Settings2, ShieldCheck, UserRound } from "lucide-react";
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
  const [saving, setSaving] = useState(false);

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
    event.preventDefault();
    setError(""); setMessage(""); setSaving(true);
    try {
      const response = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, language, currency }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Enregistrement impossible.");
      setMessage("Vos informations sont à jour.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enregistrement impossible.");
    } finally { setSaving(false); }
  }

  async function logout() { await signOut(); router.push("/"); }

  if (loading || !user) return <main className={styles.loading}><span />Ouverture de votre espace…</main>;
  const displayName = fullName || user.user_metadata?.full_name || "Mon espace";
  const initial = (displayName || user.email || "H").trim().charAt(0).toUpperCase();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.heading}><p>VOTRE ESPACE PERSONNEL</p><h1>Profil</h1><span>Votre voyage, simplement organisé.</span></header>

        <section className={styles.topGrid} aria-label="Aperçu de votre compte">
          <article className={styles.welcomeCard}>
            <img src="/hiflight-hero.jpg" alt="Vue depuis un avion au-dessus des nuages" />
            <div className={styles.imageShade} />
            <div className={styles.welcomeCopy}><span>ESPACE HIFLIGHT</span><h2>Tout votre voyage,<br />au même endroit.</h2><p>Retrouvez votre World Map, votre passeport et vos préférences sur tous vos appareils.</p><Link href="/world-map">Ouvrir mes voyages <ArrowRight size={18} /></Link></div>
          </article>

          <aside className={styles.identityCard}>
            <div className={styles.identityTop}><div className={styles.avatar}>{initial}</div><div><small>COMPTE HIFLIGHT</small><h2>{displayName}</h2><p>{user.email}</p></div></div>
            <div className={styles.sessionBadge}><ShieldCheck size={17} /><span><strong>Espace privé</strong>Vos données de voyage restent liées à votre compte.</span></div>
            <div className={styles.identityLinks}>
              <Link href="/world-map"><Globe2 size={20} /><span><strong>World Map</strong><small>Mes pays et destinations</small></span><ChevronRight size={19} /></Link>
              <Link href="/world-map?view=passport"><BookOpen size={20} /><span><strong>Mon passeport</strong><small>Retrouver mes pages</small></span><ChevronRight size={19} /></Link>
            </div>
          </aside>
        </section>

        <section className={styles.passportFeature}>
          <div className={styles.passportCopy}><span>MON ESPACE</span><h2>Votre passeport<br />HiFlight</h2><p>Coloriez les pays visités, gardez vos souvenirs et préparez les prochaines escales.</p><Link href="/world-map?view=passport">Ouvrir mon passeport <ArrowRight size={18} /></Link></div>
          <div className={styles.passportVisual} aria-hidden="true"><div className={styles.mapSheet}><Globe2 /><i /><i /><i /><b>WORLD<br />MAP</b></div><div className={styles.passportBook}><Globe2 /><span>HIFLIGHT</span><strong>PASSEPORT</strong></div><div className={styles.ticket}><small>BOARDING PASS</small><strong>HIFLIGHT</strong><span>READY TO EXPLORE</span></div></div>
        </section>

        <section className={styles.accountArea}>
          <div className={styles.sectionLead}><div><p>COMPTE ET PRÉFÉRENCES</p><h2>Un espace qui vous ressemble.</h2></div></div>
          <div className={styles.accountGrid}>
            <form id="informations" className={styles.profileForm} onSubmit={save}>
              <div className={styles.panelTitle}><UserRound size={23} /><div><h3>Vos informations</h3><p>Ces informations sont utilisées dans votre espace HiFlight.</p></div></div>
              <label>Nom complet<input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Votre nom" /></label>
              <label>Adresse e-mail<input value={user.email || ""} disabled /></label>
              <div className={styles.preferences}>
                <label><span><Languages size={16} />Langue</span><select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="fr">Français</option><option value="en">English</option></select></label>
                <label><span><Settings2 size={16} />Devise</span><select value={currency} onChange={(event) => setCurrency(event.target.value)}><option>EUR</option><option>USD</option><option>GBP</option></select></label>
              </div>
              {error ? <p className={styles.error} role="alert">{error}</p> : null}
              {message ? <p className={styles.success}><Check size={16} />{message}</p> : null}
              <button className={styles.saveButton} disabled={saving}><Save size={18} />{saving ? "Enregistrement…" : "Enregistrer mes modifications"}</button>
            </form>

            <div className={styles.sidePanels}>
              <section className={styles.menuGroup}><p>ASSISTANCE</p><div><a href="mailto:contact@hiflight.fr"><CircleHelp size={21} /><span><strong>Obtenir de l’aide</strong><small>Écrire à l’équipe HiFlight</small></span><ChevronRight size={19} /></a><a href="mailto:contact@hiflight.fr?subject=Retour%20sur%20HiFlight"><Mail size={21} /><span><strong>Donner votre avis</strong><small>Une idée ou une amélioration ?</small></span><ChevronRight size={19} /></a></div></section>
              <section className={styles.menuGroup}><p>À PROPOS</p><div><Link href="/confidentialite"><ShieldCheck size={21} /><span><strong>Politique de confidentialité</strong><small>Vos données et vos droits</small></span><ChevronRight size={19} /></Link><Link href="/mentions-legales"><FileText size={21} /><span><strong>Mentions légales</strong><small>Informations sur HiFlight</small></span><ChevronRight size={19} /></Link></div></section>
            </div>
          </div>
        </section>

        <section className={styles.inspirationCard}><img src="/hero-trains.webp" alt="Train traversant un paysage au coucher du soleil" /><div><span>VOYAGER AUTREMENT</span><h2>De belles découvertes,<br />avec plus de sens.</h2><p>Conseils, inspirations et nouvelles façons d’imaginer vos prochains départs.</p></div></section>
        <div className={styles.accountFooter}><button onClick={logout}><LogOut size={18} />Se déconnecter</button><p>Votre compte synchronise votre profil, votre World Map et votre passeport.</p></div>
      </div>
    </main>
  );
}

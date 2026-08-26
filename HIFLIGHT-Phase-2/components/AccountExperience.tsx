"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, FileText, Globe2, History, LogOut, Mail, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { useAuth } from "./AuthProvider";
import styles from "./AccountExperience.module.css";

export default function AccountExperience() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) { router.replace("/connexion"); return; }
    if (!user) return;
    fetch("/api/user/profile", { cache: "no-store" }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Profil indisponible.");
      setFullName(payload.profile.full_name || user.user_metadata?.full_name || "");
    }).catch((reason) => setError(reason instanceof Error ? reason.message : "Profil indisponible."));
  }, [user, loading, router]);

  async function logout() { await signOut(); router.push("/"); }

  function clearSearchHistory() {
    window.localStorage.removeItem("hiflight-search-history");
    window.sessionStorage.removeItem("hiflight-search-history");
    setError("");
    setNotice("Votre historique de recherche a été effacé.");
  }

  async function deleteAccount() {
    setDeleting(true); setError("");
    try {
      const response = await fetch("/api/user/account", { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Suppression impossible.");
      router.push("/");
      router.refresh();
    } catch (reason) {
      setDeleteOpen(false);
      setError(reason instanceof Error ? reason.message : "Suppression impossible.");
    } finally { setDeleting(false); }
  }

  if (loading || !user) return <main className={styles.loading}><span />Ouverture de votre espace…</main>;
  const displayName = fullName || user.user_metadata?.full_name || "Voyageur HiFlight";
  const initial = (displayName || user.email || "H").trim().charAt(0).toUpperCase();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.heading}><h1>Profil</h1><p>Votre voyage, simplement organisé.</p></header>

        <section className={styles.accountHero}>
          <img src="/hiflight-hero.jpg" alt="Vue aérienne depuis un avion" />
          <div className={styles.heroShade} />
          <div className={styles.heroContent}>
            <div className={styles.person}><span>{initial}</span><div><small>COMPTE HIFLIGHT</small><strong>{displayName}</strong><p>{user.email}</p></div></div>
            <div className={styles.heroCopy}><h2>Tout votre voyage,<br />au même endroit.</h2><p>Retrouvez vos préférences et votre espace personnel sur tous vos appareils.</p></div>
          </div>
        </section>

        <section className={styles.manageCard}>
          <div className={styles.manageLead}><span><UserRound size={20} /></span><div><p>GÉRER MON COMPTE</p><h2>Votre compte, en toute simplicité.</h2></div></div>
          <div className={styles.manageRows}>
            <div className={styles.manageRow}><span className={styles.rowIcon}><Mail size={20} /></span><div><small>INFORMATIONS DE CONNEXION</small><strong>{user.email}</strong><p>Adresse utilisée pour accéder à votre compte HiFlight.</p></div><ShieldCheck size={20} className={styles.safeIcon} /></div>
            <div className={styles.manageRow}><span className={styles.rowIcon}><History size={20} /></span><div><small>GESTION DU COMPTE</small><strong>Historique de recherche</strong><p>Supprimez les recherches enregistrées sur cet appareil.</p></div><button className={styles.secondaryAction} onClick={clearSearchHistory}>Effacer</button></div>
            <div className={styles.manageRow}><span className={`${styles.rowIcon} ${styles.dangerIcon}`}><Trash2 size={20} /></span><div><small>GESTION DU COMPTE</small><strong>Supprimer mon compte</strong><p>Efface définitivement le profil, la World Map et le passeport.</p></div><button className={styles.dangerAction} onClick={() => setDeleteOpen(true)}>Supprimer</button></div>
          </div>
          {notice ? <p className={styles.notice}><Check size={16} />{notice}</p> : null}
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <button className={styles.logoutButton} onClick={logout}><LogOut size={18} />Se déconnecter</button>
        </section>

        <section className={styles.journeyCard}>
          <div className={styles.journeyIntro}><p>VOTRE CARNET DE VOYAGE</p><h2>Le monde que vous avez vu.<br />Celui qui vous attend.</h2><span>Votre carte et votre passeport se complètent automatiquement, sur tous vos appareils.</span></div>
          <div className={styles.journeyLinks}>
            <Link href="/world-map"><span><Globe2 size={27} /></span><div><small>WORLD MAP</small><strong>Explorer ma carte</strong><p>Mes pays visités et mes prochaines destinations.</p></div><ArrowRight size={21} /></Link>
            <Link href="/world-map?view=passport"><span><BookOpen size={27} /></span><div><small>PASSEPORT</small><strong>Ouvrir mon passeport</strong><p>Feuilleter les pages de tous mes voyages.</p></div><ArrowRight size={21} /></Link>
          </div>
        </section>

        <nav className={styles.resourceGrid} aria-label="Aide et informations">
          <a href="mailto:contact@hiflight.fr"><CircleHelp size={22} /><span><strong>Obtenir de l’aide</strong><small>Contacter HiFlight</small></span><ChevronRight size={18} /></a>
          <a href="mailto:contact@hiflight.fr?subject=Mon%20avis%20sur%20HiFlight"><Mail size={22} /><span><strong>Donner mon avis</strong><small>Partager une idée</small></span><ChevronRight size={18} /></a>
          <Link href="/confidentialite"><ShieldCheck size={22} /><span><strong>Confidentialité</strong><small>Données et droits</small></span><ChevronRight size={18} /></Link>
          <Link href="/mentions-legales"><FileText size={22} /><span><strong>Mentions légales</strong><small>À propos de HiFlight</small></span><ChevronRight size={18} /></Link>
        </nav>

        <section className={styles.inspirationCard}><img src="/account-landscape.webp" alt="Lac de montagne lumineux" /><div><span>VOYAGER AUTREMENT</span><h2>De belles découvertes,<br />avec plus de sens.</h2><p>Conseils, inspirations et nouvelles façons d’imaginer vos prochains départs.</p></div></section>
      </div>

      {deleteOpen ? <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteOpen(false); }}><section className={styles.deleteModal} role="dialog" aria-modal="true" aria-labelledby="delete-account-title"><button className={styles.modalClose} aria-label="Fermer" onClick={() => setDeleteOpen(false)}><X size={20} /></button><span><Trash2 size={24} /></span><h2 id="delete-account-title">Supprimer définitivement votre compte ?</h2><p>Votre profil, vos pays visités, vos destinations et votre passeport seront effacés. Cette action est irréversible.</p><div><button onClick={() => setDeleteOpen(false)}>Annuler</button><button disabled={deleting} onClick={deleteAccount}>{deleting ? "Suppression…" : "Supprimer mon compte"}</button></div></section></div> : null}
    </main>
  );
}

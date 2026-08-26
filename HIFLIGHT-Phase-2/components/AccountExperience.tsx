"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ChevronDown, ChevronRight, CircleHelp, FileText, History, LogOut, Mail, MessageSquareText, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { useAuth } from "./AuthProvider";
import styles from "./AccountExperience.module.css";

type SettingPanel = "login" | "history" | "account";

export default function AccountExperience() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [openSetting, setOpenSetting] = useState<SettingPanel | null>(null);
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
      router.push("/"); router.refresh();
    } catch (reason) {
      setDeleteOpen(false);
      setError(reason instanceof Error ? reason.message : "Suppression impossible.");
    } finally { setDeleting(false); }
  }

  function toggleSetting(panel: SettingPanel) {
    setOpenSetting((current) => current === panel ? null : panel);
    setNotice("");
  }

  if (loading || !user) return <main className={styles.loading}><span />Ouverture de votre espace…</main>;
  const displayName = fullName || user.user_metadata?.full_name || "Voyageur HiFlight";
  const initial = (displayName || user.email || "H").trim().charAt(0).toUpperCase();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.accountHero}>
          <img src="/account-airport.webp" alt="Avion devant les baies vitrées d’un aéroport" />
          <div className={styles.heroShade} />
          <div className={styles.heroContent}>
            <div className={styles.heroIdentity}><h1>Profil</h1><div className={styles.person}><span>{initial}</span><div><strong>{displayName}</strong><p>{user.email}</p></div></div></div>
            <div className={styles.heroCopy}><h2>Tout votre voyage,<br />au même endroit.</h2><p>Retrouvez vos préférences et votre espace personnel sur tous vos appareils.</p></div>
          </div>
        </section>

        <section className={styles.settings}>
          <div className={styles.settingsHeading}><h2>Gérer mon compte</h2></div>
          <div className={styles.settingsColumns}>
            <div className={styles.settingsGroup}>
              <h3>Accès et activité</h3>
              <div className={styles.settingsList}>
                <article className={styles.settingItem}>
                  <button className={styles.settingButton} onClick={() => toggleSetting("login")} aria-expanded={openSetting === "login"}><Mail size={21} /><span><strong>Informations de connexion</strong><small>Adresse e-mail et méthode de connexion</small></span><ChevronDown size={19} /></button>
                  {openSetting === "login" ? <div className={styles.settingPanel}><span>Adresse e-mail</span><strong>{user.email}</strong><p>Cette adresse est utilisée pour vous connecter et sécuriser votre compte.</p></div> : null}
                </article>
                <article className={styles.settingItem}>
                  <button className={styles.settingButton} onClick={() => toggleSetting("history")} aria-expanded={openSetting === "history"}><History size={21} /><span><strong>Historique de recherche</strong><small>Recherches enregistrées sur cet appareil</small></span><ChevronDown size={19} /></button>
                  {openSetting === "history" ? <div className={styles.settingPanel}><p>Efface les recherches mémorisées sur cet appareil sans modifier votre World Map ni votre passeport.</p><button className={styles.neutralAction} onClick={clearSearchHistory}>Effacer l’historique</button></div> : null}
                </article>
              </div>
            </div>
            <div className={styles.settingsGroup}>
              <h3>Compte</h3>
              <div className={styles.settingsList}>
                <article className={styles.settingItem}>
                  <button className={styles.settingButton} onClick={() => toggleSetting("account")} aria-expanded={openSetting === "account"}><UserRound size={21} /><span><strong>Gestion du compte</strong><small>Déconnexion et suppression du compte</small></span><ChevronDown size={19} /></button>
                  {openSetting === "account" ? <div className={`${styles.settingPanel} ${styles.accountActions}`}><button onClick={logout}><LogOut size={17} />Se déconnecter</button><button onClick={() => setDeleteOpen(true)}><Trash2 size={17} />Supprimer mon compte</button></div> : null}
                </article>
              </div>
            </div>
          </div>
          {notice ? <p className={styles.notice}><Check size={16} />{notice}</p> : null}
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
        </section>

        <section className={styles.journeyCard}>
          <div className={styles.journeyIntro}><h2>Le monde que vous avez vu.<br />Celui qui vous attend.</h2></div>
          <div className={styles.journeyLinks}>
            <Link href="/world-map" className={styles.worldLink}><img src="/account-earth.webp" alt="Planète Terre" /><div><span>World Map</span><strong>Explorer ma carte</strong><p>Retrouvez vos pays visités et vos prochaines destinations.</p></div><ArrowRight size={20} /></Link>
            <Link href="/world-map?view=passport" className={styles.passportLink}><img src="/world-map/hiflight-passport-cover.png" alt="Passeport HiFlight" /><div><span>Passeport</span><strong>Ouvrir mon passeport</strong><p>Feuilletez les pages de vos voyages.</p></div><ArrowRight size={20} /></Link>
          </div>
        </section>

        <section className={styles.resources} aria-label="Aide et informations">
          <div className={styles.resourceGroup}><h2>Assistance</h2><div><a href="mailto:contact@hiflight.fr"><CircleHelp size={20} /><span><strong>Obtenir de l’aide</strong><small>Écrire à l’équipe HiFlight</small></span><ChevronRight size={18} /></a><a href="mailto:contact@hiflight.fr?subject=Mon%20avis%20sur%20HiFlight"><MessageSquareText size={20} /><span><strong>Donner mon avis</strong><small>Une suggestion ou un retour</small></span><ChevronRight size={18} /></a></div></div>
          <div className={styles.resourceGroup}><h2>Informations</h2><div><Link href="/confidentialite"><ShieldCheck size={20} /><span><strong>Politique de confidentialité</strong><small>Protection de vos données</small></span><ChevronRight size={18} /></Link><Link href="/mentions-legales"><FileText size={20} /><span><strong>Mentions légales</strong><small>Informations sur HiFlight</small></span><ChevronRight size={18} /></Link></div></div>
        </section>

        <section className={styles.inspirationCard}><img src="/account-landscape-v2.webp" alt="Lac et montagnes baignés de lumière" /><div><span>VOYAGER AUTREMENT</span><h2>De belles découvertes,<br />avec plus de sens.</h2><p>Conseils, inspirations et nouvelles façons d’imaginer vos prochains départs.</p></div></section>
      </div>

      {deleteOpen ? <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteOpen(false); }}><section className={styles.deleteModal} role="dialog" aria-modal="true" aria-labelledby="delete-account-title"><button className={styles.modalClose} aria-label="Fermer" onClick={() => setDeleteOpen(false)}><X size={20} /></button><span><Trash2 size={24} /></span><h2 id="delete-account-title">Supprimer définitivement votre compte ?</h2><p>Votre profil, vos pays visités, vos destinations et votre passeport seront effacés. Cette action est irréversible.</p><div><button onClick={() => setDeleteOpen(false)}>Annuler</button><button disabled={deleting} onClick={deleteAccount}>{deleting ? "Suppression…" : "Supprimer mon compte"}</button></div></section></div> : null}
    </main>
  );
}

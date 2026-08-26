"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import styles from "./AuthExperience.module.css";

type Mode = "signin" | "signup" | "forgot" | "reset";

function GoogleLogo() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.35Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.42l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.39 13.9A6.02 6.02 0 0 1 6.08 12c0-.66.11-1.3.31-1.9V7.51H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.49l3.35-2.59Z"/><path fill="#EA4335" d="M12 5.97c1.47 0 2.78.5 3.82 1.49l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.51l3.35 2.59C7.18 7.73 9.39 5.97 12 5.97Z"/></svg>;
}

function AppleLogo() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.05 12.54c-.03-3.02 2.46-4.49 2.57-4.56a5.5 5.5 0 0 0-4.32-2.34c-1.82-.19-3.58 1.09-4.5 1.09-.94 0-2.36-1.07-3.9-1.04a5.72 5.72 0 0 0-4.82 2.94c-2.1 3.63-.53 8.96 1.48 11.9 1 1.44 2.17 3.05 3.71 3 1.51-.06 2.08-.96 3.9-.96 1.8 0 2.34.96 3.91.92 1.62-.03 2.64-1.44 3.6-2.9a11.9 11.9 0 0 0 1.65-3.36 5.21 5.21 0 0 1-3.28-4.69ZM14.11 3.71A5.3 5.3 0 0 0 15.33 0a5.42 5.42 0 0 0-3.5 1.77 5.03 5.03 0 0 0-1.25 3.57 4.47 4.47 0 0 0 3.53-1.63Z"/></svg>;
}

export default function AuthExperience() {
  const router = useRouter();
  const { user, loading: authLoading, refresh } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const type = hash.get("type");
    if (!accessToken || !refreshToken) return;
    setLoading(true);
    fetch("/api/auth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
    }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Lien invalide.");
      window.history.replaceState({}, "", window.location.pathname + window.location.search);
      if (type === "recovery" || new URLSearchParams(window.location.search).get("recovery")) {
        setMode("reset");
        setMessage("Choisissez maintenant votre nouveau mot de passe.");
        await refresh();
      } else {
        await refresh();
        router.replace("/");
      }
    }).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  }, [refresh, router]);

  useEffect(() => {
    if (user && !authLoading && mode !== "reset") router.replace("/");
  }, [user, authLoading, mode, router]);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if ((mode === "signup" || mode === "reset") && password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const endpoint = mode === "signin" ? "/api/auth/login" : mode === "signup" ? "/api/auth/signup" : mode === "forgot" ? "/api/auth/recover" : "/api/auth/update-password";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Une erreur est survenue.");
      if (mode === "forgot") {
        setMessage("Un lien de récupération vient de vous être envoyé.");
        return;
      }
      if (mode === "signup" && payload.confirmationRequired) {
        setMessage("Votre compte est créé. Confirmez votre adresse depuis l’e-mail reçu, puis connectez-vous.");
        return;
      }
      if (mode === "reset") {
        setMessage("Votre mot de passe a été modifié.");
      }
      await refresh();
      router.push("/");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const title = mode === "signin" ? "Bon retour parmi nous." : mode === "signup" ? "Votre voyage commence ici." : mode === "forgot" ? "Retrouvez votre compte." : "Nouveau mot de passe.";
  const subtitle = mode === "signin" ? "Connectez-vous pour retrouver votre carte et votre passeport." : mode === "signup" ? "Un seul compte pour le site et l’application HiFlight." : mode === "forgot" ? "Nous vous enverrons un lien sécurisé par e-mail." : "Choisissez un mot de passe que vous n’utilisez pas ailleurs.";

  return (
    <main className={styles.page}>
      <section className={styles.visual}>
        <Link className={styles.back} href="/" aria-label="Retour à l’accueil HiFlight">
          <span aria-hidden="true">←</span> Retour à l’accueil
        </Link>
        <img className={styles.plant} src="/auth-plant.webp" alt="" aria-hidden="true" />
        <div className={styles.visualCopy}>
          <span>Votre espace voyage</span>
          <h1>Le monde que vous avez vu.<br />Celui qu’il vous reste à découvrir.</h1>
          <div className={styles.preview}>
            <div className={styles.globe} aria-hidden="true"><span /><i /><b /></div>
            <div><strong>World Map & Passeport</strong><p>Vos pays et vos souvenirs, sur tous vos appareils.</p></div>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.formWrap}>
          <div className={styles.brand}>Hi<span>Flight</span></div>
          <h2>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>

          {(mode === "signin" || mode === "signup") && <div className={styles.tabs}><button type="button" className={mode === "signin" ? styles.active : ""} onClick={() => switchMode("signin")}>Connexion</button><button type="button" className={mode === "signup" ? styles.active : ""} onClick={() => switchMode("signup")}>Créer un compte</button></div>}

          {(mode === "signin" || mode === "signup") && <><div className={styles.socialButtons}><a href="/api/auth/oauth?provider=google"><GoogleLogo /><span>Continuer avec Google</span></a><a href="/api/auth/oauth?provider=apple"><AppleLogo /><span>Continuer avec Apple</span></a></div><div className={styles.divider}><span>ou avec votre e-mail</span></div></>}

          <form onSubmit={submit}>
            {mode === "signup" && <label>Nom complet<input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Votre nom" required /></label>}
            {mode !== "reset" && <label>Adresse e-mail<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.fr" required /></label>}
            {(mode === "signin" || mode === "signup" || mode === "reset") && <label>Mot de passe<input type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8 caractères minimum" minLength={8} required /></label>}
            {(mode === "signup" || mode === "reset") && <label>Confirmer le mot de passe<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Saisissez-le à nouveau" minLength={8} required /></label>}
            {error && <p className={styles.error} role="alert">{error}</p>}
            {message && <p className={styles.success} role="status">{message}</p>}
            <button className={styles.submit} disabled={loading || authLoading}>{loading ? "Un instant…" : mode === "signin" ? "Se connecter" : mode === "signup" ? "Créer mon compte" : mode === "forgot" ? "Recevoir le lien" : "Enregistrer le mot de passe"}</button>
          </form>

          {mode === "signin" && <button className={styles.textButton} type="button" onClick={() => switchMode("forgot")}>Mot de passe oublié ?</button>}
          {(mode === "forgot" || mode === "reset") && <button className={styles.textButton} type="button" onClick={() => switchMode("signin")}>Revenir à la connexion</button>}
          <p className={styles.privacy}>Vos données de voyage restent privées et ne sont jamais visibles par les autres utilisateurs.</p>
        </div>
      </section>
    </main>
  );
}

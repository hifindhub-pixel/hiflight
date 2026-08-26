"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import styles from "./AuthExperience.module.css";

type Mode = "signin" | "signup" | "forgot" | "reset";

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

"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, MouseEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenCheck, MapPinned, ShieldCheck, X } from "lucide-react";
import { useAuth } from "./AuthProvider";
import styles from "./AuthExperience.module.css";

type Mode = "signin" | "signup" | "forgot" | "reset";

type AuthExperienceProps = {
  onClose?: () => void;
};

export default function AuthExperience({ onClose }: AuthExperienceProps) {
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
  const titleId = useId();
  const subtitleId = useId();
  const emailInput = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    if (onClose) onClose();
    else router.push("/");
  }, [onClose, router]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input:not([disabled])");
      const first = controls.item(0);
      const last = controls.item(controls.length - 1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => emailInput.current?.focus(), 80);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const oauthError = hash.get("error_description") || hash.get("error") || query.get("oauth_error");
    if (oauthError) {
      setError(oauthError);
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }
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
        router.replace("/world-map");
      }
    }).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  }, [refresh, router]);

  useEffect(() => {
    if (user && !authLoading && mode !== "reset") router.replace("/world-map");
  }, [user, authLoading, mode, router]);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    window.setTimeout(() => emailInput.current?.focus(), 0);
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) close();
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
      if (mode === "reset") setMessage("Votre mot de passe a été modifié.");
      await refresh();
      router.push("/world-map");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const title = mode === "signin" ? "Votre prochain voyage commence ici." : mode === "signup" ? "Créez votre espace voyage." : mode === "forgot" ? "Retrouvez votre compte." : "Choisissez un nouveau mot de passe.";
  const subtitle = mode === "signin" ? "Connectez-vous pour retrouver votre World Map, votre passeport et vos projets de voyage." : mode === "signup" ? "Un seul compte pour HiFlight sur le web et dans l’application." : mode === "forgot" ? "Nous vous enverrons un lien sécurisé par e-mail." : "Utilisez un mot de passe que vous n’employez pas ailleurs.";

  return (
    <div className={styles.backdrop} onMouseDown={closeFromBackdrop}>
      <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={subtitleId}>
        <button className={styles.close} type="button" onClick={close} aria-label="Fermer la fenêtre de connexion"><X aria-hidden="true" /></button>

        <div className={styles.content}>
          <Image className={styles.logo} src="/hiflight-logo.svg" alt="HiFlight" width={330} height={110} priority />
          <h1 id={titleId}>{title}</h1>
          <p className={styles.subtitle} id={subtitleId}>{subtitle}</p>

          {(mode === "signin" || mode === "signup") ? (
            <div className={styles.tabs} aria-label="Choisir le type d’accès">
              <button type="button" className={mode === "signin" ? styles.active : ""} onClick={() => switchMode("signin")}>Connexion</button>
              <button type="button" className={mode === "signup" ? styles.active : ""} onClick={() => switchMode("signup")}>Créer un compte</button>
            </div>
          ) : null}

          {(mode === "signin" || mode === "signup") ? (
            <>
              <div className={styles.oauthButtons}>
                <a href="/api/auth/oauth?provider=google">Continuer avec Google</a>
                <a href="/api/auth/oauth?provider=apple">Continuer avec Apple</a>
              </div>
              <div className={styles.divider}><span>ou avec votre adresse e-mail</span></div>
            </>
          ) : null}

          <form onSubmit={submit}>
            {mode === "signup" ? <label>Nom complet<input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Votre nom" required /></label> : null}
            {mode !== "reset" ? <label>Adresse e-mail<input ref={emailInput} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.fr" required /></label> : null}
            {(mode === "signin" || mode === "signup" || mode === "reset") ? <label>Mot de passe<input type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8 caractères minimum" minLength={8} required /></label> : null}
            {(mode === "signup" || mode === "reset") ? <label>Confirmer le mot de passe<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Saisissez-le à nouveau" minLength={8} required /></label> : null}
            {error ? <p className={styles.error} role="alert">{error}</p> : null}
            {message ? <p className={styles.success} role="status">{message}</p> : null}
            <button className={styles.submit} disabled={loading || authLoading}>{loading ? "Un instant…" : mode === "signin" ? "Se connecter" : mode === "signup" ? "Créer mon compte" : mode === "forgot" ? "Recevoir le lien" : "Enregistrer le mot de passe"}</button>
          </form>

          {mode === "signin" ? <button className={styles.textButton} type="button" onClick={() => switchMode("forgot")}>Mot de passe oublié ?</button> : null}
          {(mode === "forgot" || mode === "reset") ? <button className={styles.textButton} type="button" onClick={() => switchMode("signin")}>Revenir à la connexion</button> : null}

          <p className={styles.legal}>En continuant, vous acceptez nos <Link href="/mentions-legales">conditions d’utilisation</Link> et notre <Link href="/confidentialite">politique de confidentialité</Link>.</p>
        </div>

        <aside className={styles.visual} aria-label="L’espace voyage HiFlight">
          <Image src="/hiflight-hero.jpg" alt="Aile d’avion au-dessus des nuages au coucher du soleil" fill sizes="(max-width: 900px) 0px, 44vw" priority />
          <div className={styles.visualShade} />
          <div className={styles.visualCopy}>
            <span className={styles.visualEyebrow}>Votre espace voyage</span>
            <h2>Gardez le monde que vous explorez à portée de main.</h2>
            <div className={styles.benefits}>
              <div><MapPinned aria-hidden="true" /><span><strong>World Map</strong><small>Vos pays visités et ceux à découvrir</small></span></div>
              <div><BookOpenCheck aria-hidden="true" /><span><strong>Passeport</strong><small>Vos tampons et souvenirs réunis</small></span></div>
            </div>
            <p className={styles.private}><ShieldCheck aria-hidden="true" /> Vos données de voyage restent privées.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

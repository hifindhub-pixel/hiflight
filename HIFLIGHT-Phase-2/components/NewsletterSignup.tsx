"use client";

import { useState } from "react";

export default function NewsletterSignup({ source = "accueil" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: trap, source }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Inscription impossible.");
      setState("done");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Inscription impossible.");
      setState("error");
    }
  }

  return (
    <section className="section home-block newsletter-block" aria-labelledby="newsletter-title">
      <div className="newsletter-card">
        <h2 id="newsletter-title">Les bons plans vols, sans spam</h2>
        <p>Un e-mail de temps en temps, avec les baisses de prix repérées sur nos itinéraires. Désinscription à tout moment.</p>
        {state === "done" ? (
          <p className="newsletter-ok" role="status">C’est noté, merci. Vous recevrez les prochains bons plans.</p>
        ) : (
          <form onSubmit={submit} className="newsletter-form">
            <label htmlFor="newsletter-email" className="sr-only">Votre adresse e-mail</label>
            <input id="newsletter-email" type="email" required autoComplete="email" placeholder="vous@exemple.fr" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
            <button type="submit" disabled={state === "loading"}>{state === "loading" ? "Envoi…" : "Je m’inscris"}</button>
          </form>
        )}
        {state === "error" && <p className="newsletter-err" role="alert">{message}</p>}
        <small>En vous inscrivant, vous acceptez de recevoir nos e-mails. Voir la <a href="/politique-de-confidentialite/">politique de confidentialité</a>.</small>
      </div>
    </section>
  );
}

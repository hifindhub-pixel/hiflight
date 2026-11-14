"use client";

import Link from "next/link";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { track } from "./Analytics";

const STORAGE_KEY = "hiflight-favorites";
const MAX_FAVORITES = 100;

type Notice = { text: string; guest: boolean; error?: boolean };

type FavoritesValue = {
  /** Trajets favoris, le plus récent en premier. */
  slugs: string[];
  ready: boolean;
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

function readLocal(): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((slug): slug is string => typeof slug === "string").slice(0, MAX_FAVORITES) : [];
  } catch {
    return [];
  }
}

function writeLocal(slugs: string[]) {
  try {
    if (slugs.length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* stockage indisponible (navigation privée, par exemple) : les favoris restent en mémoire pour la session */
  }
}

/**
 * Favoris de trajets. Sans compte, ils sont gardés sur l’appareil ; dès que la personne se connecte,
 * ils sont fusionnés dans son compte et la liste suit sur tous ses appareils.
 */
export default function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slugsRef = useRef<string[]>([]);
  slugsRef.current = slugs;

  const showNotice = useCallback((next: Notice) => {
    setNotice(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), 6000);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const userId = user?.id ?? null;
  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    async function load() {
      if (!userId) {
        const local = readLocal();
        if (!cancelled) { setSlugs(local); setReady(true); }
        return;
      }
      try {
        const local = readLocal();
        if (local.length) {
          const merged = await fetch("/api/user/favorites/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slugs: local }) });
          if (merged.ok) writeLocal([]);
        }
        const response = await fetch("/api/user/favorites/", { cache: "no-store" });
        const payload = await response.json() as { slugs?: string[] };
        if (!cancelled && response.ok) setSlugs(payload.slugs ?? []);
      } catch {
        if (!cancelled) setSlugs(readLocal());
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [userId, loading]);

  const toggle = useCallback(async (slug: string) => {
    const before = slugsRef.current;
    const adding = !before.includes(slug);
    if (adding && before.length >= MAX_FAVORITES) {
      showNotice({ text: `Vous avez atteint la limite de ${MAX_FAVORITES} favoris. Retirez-en un pour en ajouter un autre.`, guest: false, error: true });
      return;
    }
    const next = adding ? [slug, ...before] : before.filter((item) => item !== slug);
    setSlugs(next);
    track(adding ? "favorite_add" : "favorite_remove", { route: slug });
    if (adding) showNotice({ text: "Trajet ajouté à vos favoris.", guest: !userId });
    else setNotice(null);

    if (!userId) { writeLocal(next); return; }
    try {
      const response = await fetch("/api/user/favorites/", { method: adding ? "POST" : "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
      if (!response.ok) throw new Error("save failed");
    } catch {
      setSlugs(before);
      showNotice({ text: "Impossible d’enregistrer ce favori pour le moment. Réessayez dans un instant.", guest: false, error: true });
    }
  }, [showNotice, userId]);

  const value = useMemo<FavoritesValue>(() => ({ slugs, ready, isFavorite: (slug) => slugs.includes(slug), toggle }), [slugs, ready, toggle]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      {notice ? (
        <div className={`fav-toast${notice.error ? " is-error" : ""}`} role="status" aria-live="polite">
          <p>{notice.text}</p>
          {!notice.error ? (
            <div>
              <Link href="/favoris" onClick={() => setNotice(null)}>Voir mes favoris</Link>
              {notice.guest ? <Link href="/connexion" onClick={() => setNotice(null)}>Se connecter pour les garder partout</Link> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites doit être utilisé dans FavoritesProvider");
  return context;
}

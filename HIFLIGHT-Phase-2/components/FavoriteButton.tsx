"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "./FavoritesProvider";

type Props = {
  slug: string;
  /** Nom du trajet pour les lecteurs d’écran, par exemple « Paris – Marrakech ». */
  label: string;
  /** « overlay » : pastille ronde posée sur une carte ; « inline » : bouton avec texte. */
  variant?: "overlay" | "inline" | "field";
};

export default function FavoriteButton({ slug, label, variant = "overlay" }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const known = slug !== "";
  const active = known && isFavorite(slug);
  const action = !known ? "Choisissez un trajet pour l’ajouter aux favoris" : active ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`;
  return (
    <button
      type="button"
      className={`fav-btn fav-btn-${variant}${active ? " is-active" : ""}`}
      aria-pressed={active}
      aria-label={action}
      disabled={!known}
      title={action}
      onClick={(event) => { event.preventDefault(); event.stopPropagation(); void toggle(slug); }}
    >
      <Heart aria-hidden="true" size={variant === "overlay" ? 20 : 18} strokeWidth={2} fill={active ? "currentColor" : "none"} />
      {variant !== "overlay" ? <span>{active ? "Dans vos favoris" : "Ajouter ce trajet aux favoris"}</span> : null}
    </button>
  );
}

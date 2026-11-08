"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "./FavoritesProvider";

type Props = {
  slug: string;
  /** Nom du trajet pour les lecteurs d’écran, par exemple « Paris – Marrakech ». */
  label: string;
  /** « overlay » : pastille ronde posée sur une carte ; « inline » : bouton avec texte. */
  variant?: "overlay" | "inline";
};

export default function FavoriteButton({ slug, label, variant = "overlay" }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(slug);
  const action = active ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`;
  return (
    <button
      type="button"
      className={`fav-btn fav-btn-${variant}${active ? " is-active" : ""}`}
      aria-pressed={active}
      aria-label={action}
      title={action}
      onClick={(event) => { event.preventDefault(); event.stopPropagation(); void toggle(slug); }}
    >
      <Heart aria-hidden="true" size={variant === "inline" ? 18 : 20} strokeWidth={2} fill={active ? "currentColor" : "none"} />
      {variant === "inline" ? <span>{active ? "Dans vos favoris" : "Ajouter aux favoris"}</span> : null}
    </button>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { fr } from "@/lib/typo";

export type IndexPost = { slug: string; title: string; description: string; heroImage?: string; category: string; date: string; minutes: number };

const filters = ["Tous", "Bons plans", "Destinations", "Conseils"] as const;

function Card({ post, priority }: { post: IndexPost; priority: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="idx-card">
      <span className="idx-photo">{post.heroImage ? <img src={post.heroImage} alt="" loading={priority ? "eager" : "lazy"} width="800" height="520" /> : null}<em>{post.category}</em></span>
      <span className="idx-text">
        <small>{post.date} · {post.minutes} min de lecture</small>
        <strong>{fr(post.title)}</strong>
        <span>{post.description}</span>
      </span>
    </Link>
  );
}

/** Page « Conseils voyage » : à la une + filtres par rubrique. */
export default function BlogIndex({ posts }: { posts: IndexPost[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tous");
  const shown = filter === "Tous" ? posts : posts.filter((post) => post.category === filter);
  const [lead, ...rest] = shown;
  const counts = (name: string) => (name === "Tous" ? posts.length : posts.filter((post) => post.category === name).length);
  return (
    <>
      <div className="idx-filters" role="tablist" aria-label="Rubriques">
        {filters.map((name) => (
          <button key={name} type="button" role="tab" aria-selected={filter === name} className={filter === name ? "on" : undefined} onClick={() => setFilter(name)}>
            {name}<span>{counts(name)}</span>
          </button>
        ))}
      </div>
      {lead ? (
        <Link href={`/blog/${lead.slug}`} className="idx-lead">
          {lead.heroImage ? <img src={lead.heroImage} alt="" width="1400" height="700" fetchPriority="high" /> : null}
          <span className="idx-lead-text">
            <em>{lead.category}</em>
            <strong>{fr(lead.title)}</strong>
            <span>{lead.description}</span>
            <small>{lead.date} · {lead.minutes} min de lecture · Lire l’article →</small>
          </span>
        </Link>
      ) : null}
      <div className="idx-grid">
        {rest.map((post, index) => <Card key={post.slug} post={post} priority={index < 3} />)}
      </div>
    </>
  );
}

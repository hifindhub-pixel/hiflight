"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

/** Sommaire collant : la rubrique en cours de lecture est mise en avant. */
export default function ArticleToc({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    const targets = items.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => node !== null);
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);
  return (
    <nav className="mag-toc" aria-label="Sommaire">
      <strong>Dans cet article</strong>
      <ol>
        {items.map((item, index) => (
          <li key={item.id} className={item.id === active ? "on" : undefined}>
            <a href={`#${item.id}`}><i>{String(index + 1).padStart(2, "0")}</i><span>{item.label}</span></a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

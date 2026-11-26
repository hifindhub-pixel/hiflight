"use client";

import { useEffect, useState } from "react";

/** Barre fine en haut de l’écran : où en est la lecture de l’article. */
export default function ArticleProgress() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const body = document.querySelector<HTMLElement>("[data-article-body]");
    if (!body) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = body.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.2, 0), total);
      setValue(total > 0 ? done / total : 0);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <div className="mag-progress" aria-hidden="true"><span style={{ transform: `scaleX(${value})` }} /></div>;
}

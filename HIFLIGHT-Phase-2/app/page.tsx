// Accueil : photos Unsplash (licence libre), relance de déploiement
import type { Metadata } from "next";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import ServiceTabs from "@/components/ServiceTabs";
import ServiceFaq from "@/components/ServiceFaq";
import { defaultOgImage, flightRoutes, siteUrl } from "@/lib/content";
import { departureCities } from "@/lib/cities";
import { getRouteStats } from "@/lib/route-data";

const homeDescription = "Comparez les vols de centaines de compagnies et agences, repérez les dates les moins chères et réservez chez le partenaire de votre choix. Gratuit.";

export const metadata: Metadata = {
  title: { absolute: "Comparateur de vols pas chers | HiFlight" },
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: `${siteUrl}/`, images: [defaultOgImage], title: "Comparateur de vols pas chers | HiFlight", description: homeDescription },
};

const destinations = [
  ["paris-marrakech", "Marrakech", "Maroc", "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=640&q=70"],
  ["paris-barcelone", "Barcelone", "Espagne", "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=640&q=70"],
  ["paris-lisbonne", "Lisbonne", "Portugal", "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=640&q=70"],
  ["paris-bangkok", "Bangkok", "Thaïlande", "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?auto=format&fit=crop&w=640&q=70"],
  ["paris-pointe-a-pitre", "Pointe-à-Pitre", "Guadeloupe", "https://images.unsplash.com/photo-1661381082632-87fd1727bf58?auto=format&fit=crop&w=640&q=70"],
  ["paris-rome", "Rome", "Italie", "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=640&q=70"],
  ["paris-londres", "Londres", "Royaume-Uni", "https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=640&q=70"],
  ["paris-istanbul", "Istanbul", "Turquie", "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=640&q=70"],
] as const;

const services = [
  { href: "/hotels", title: "Hôtels", text: "Comparez les prix sur la carte", img: "/hero-hotels.webp" },
  { href: "/voitures", title: "Voitures", text: "Loueurs et points de retrait", img: "/hero-cars.webp" },
  { href: "/esim", title: "eSIM", text: "Internet à l’étranger, sans roaming", img: "/account-earth.webp" },
];

const reasons = [
  ["Prix comparés", "Centaines de compagnies et d’agences, une seule recherche."],
  ["Prix total clair", "Bagages, escales, aéroport : on vous aide à vérifier."],
  ["Gratuit, sans compte", "Vous réservez directement chez le partenaire choisi."],
];

export default async function Home() {
  const cards = await Promise.all(
    destinations.map(async ([slug, city, country, img]) => {
      const route = flightRoutes.find((r) => r.slug === slug);
      const stats = route ? await getRouteStats(route) : null;
      return route ? { slug, city, country, img, price: stats?.lowest.price ?? null } : null;
    }),
  );
  const deals = cards.filter((c) => c !== null);

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <ServiceTabs active="flights" />
          <div className="hero-copy"><h1>Des millions de vols,<br /><span>un seul endroit.</span></h1></div>
          <SearchForm />
          <div className="trust-line"><span>Gratuit</span><span>Sans inscription</span></div>
        </div>
      </section>

      <section className="section home-block" id="destinations">
        <div className="home-head"><h2>Où partir ? Nos destinations du moment</h2><Link className="text-link" href="/vols">Tous les itinéraires →</Link></div>
        <div className="dest-grid">
          {deals.map((d) => (
            <Link key={d.slug} href={`/vols/${d.slug}`} className="dest-card">
              <img src={d.img} alt={`Vol Paris ${d.city}`} loading="lazy" width="400" height="300" />
              <div><strong>{d.city}</strong><span>{d.country}</span><em>{d.price ? <>dès <b>{d.price} €</b> A/R</> : "Voir les prix"}</em></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section home-block home-tight">
        <div className="home-head"><h2>Partez de votre ville</h2></div>
        <ul className="chips city-chips">
          {departureCities.map((c) => <li key={c.slug}><Link href={`/vols/depuis/${c.slug}`}>Vols {c.from}</Link></li>)}
        </ul>
      </section>

      <section className="section home-block home-tight">
        <div className="home-head"><h2>Et pour le reste du voyage</h2></div>
        <div className="svc-grid">
          {services.map((s) => (
            <Link key={s.href} href={s.href} className="svc-card" style={{ backgroundImage: `linear-gradient(0deg,rgba(7,22,47,.78),rgba(7,22,47,.1) 65%),url(${s.img})` }}>
              <strong>{s.title}</strong><span>{s.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section home-block">
        <Link href="/blog" className="blog-banner" style={{ backgroundImage: "linear-gradient(90deg,rgba(7,22,47,.72),rgba(7,22,47,.05) 70%),url(/account-landscape-v2.webp)" }}>
          <span>Voyager autrement</span>
          <strong>Conseils et inspirations pour votre prochain départ</strong>
          <em>Découvrir le blog →</em>
        </Link>
      </section>

      <section className="section home-block home-tight">
        <div className="reasons">
          {reasons.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}
        </div>
      </section>
      <ServiceFaq service="flights" />
    </main>
  );
}

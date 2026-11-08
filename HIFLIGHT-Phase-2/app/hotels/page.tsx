import type { Metadata } from "next";
import { defaultOgImage, siteUrl } from "@/lib/content";
import HotelSearchExperience from "@/components/HotelSearchExperience";
import ServiceFaq from "@/components/ServiceFaq";
import Link from "next/link";
import { getPost } from "@/lib/blog";

const destinationGuides = [
  "vol-paris-marrakech-guide", "vol-istanbul-guide-aeroports", "vol-barcelone-guide-conseils", "vol-lisbonne-guide-conseils", "vol-londres-quel-aeroport",
  "vol-rome-guide-aeroports", "vol-madrid-guide-conseils", "vol-new-york-conseils-formalites", "vol-dubai-quand-partir-conseils", "vol-tunis-guide-conseils",
].map((slug) => getPost(slug)).filter((post) => post !== undefined);

const checklist = [
  { title: "Comparer le prix total, pas le prix de la nuit", text: "Selon le pays et la ville, une taxe de séjour, des frais de service ou une résidence-taxe peuvent s’ajouter, parfois à régler sur place. Le montant à retenir est celui affiché au moment du paiement." },
  { title: "Regarder la politique d’annulation", text: "Une chambre non remboursable coûte souvent moins cher, mais elle ne se modifie pas si le vol change. Si vos dates ne sont pas certaines, une annulation gratuite jusqu’à une date limite protège mieux." },
  { title: "Choisir le quartier avant l’établissement", text: "Un hôtel moins cher mais loin du centre ou des transports coûte du temps et de l’argent en trajets. Vérifiez la distance réelle avec la gare, l’aéroport ou les lieux que vous visiterez, avec la carte." },
  { title: "Vérifier l’heure d’arrivée et de départ", text: "Si votre vol atterrit tard ou repart tôt, confirmez avec l’hôtel l’accueil de nuit et la possibilité de déposer les bagages avant ou après le séjour." },
  { title: "Lire les avis récents", text: "Les remarques sur la propreté, le bruit et l’accueil comptent plus que la note moyenne. Privilégiez les avis récents, qui reflètent l’état actuel de l’établissement." },
  { title: "Garder la réservation chez le partenaire", text: "HiFlight compare, mais la réservation, le paiement et les modifications se font chez le partenaire choisi. Conservez sa confirmation et son numéro de réservation." },
];


export const metadata: Metadata = {
  title: "Comparer les hôtels : prix, carte et vendeurs",
  description: "Comparez les hôtels par destination et dates : liste, carte et vendeurs partenaires pour choisir l’établissement au meilleur prix. Gratuit, sans inscription.",
  alternates: { canonical: "/hotels" },
  openGraph: { type: "website", url: `${siteUrl}/hotels/`, images: [defaultOgImage], title: "Comparer les hôtels : prix, carte et vendeurs | HiFlight", description: "Comparez les hôtels par destination et dates : liste, carte et vendeurs partenaires pour choisir l’établissement au meilleur prix. Gratuit, sans inscription." },
};

export default function HotelsPage() {
  return (
    <main className="market-page">
      <HotelSearchExperience />
      <section className="faq-section">
        <div className="faq-shell">
          <h2>Bien choisir son hôtel : 6 points à vérifier</h2>
          <p>HiFlight compare les hôtels par destination et par dates, avec la liste, la carte et les vendeurs partenaires. Avant de réserver, ces points évitent les mauvaises surprises.</p>
          <div className="faq-grid">
            {checklist.map((item) => (
              <div className="faq-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {destinationGuides.length > 0 ? (
        <section className="faq-section faq-section-compact">
          <div className="faq-shell">
            <h2>Préparer votre séjour : nos guides par destination</h2>
            <p>Comment rejoindre le centre depuis l’aéroport, quel quartier viser, formalités d’entrée : les guides HiFlight aident à choisir où loger.</p>
            <ul>
              {destinationGuides.map((post) => (
                <li key={post.slug}><Link href={`/blog/${post.slug}`}>{post.metaTitle}</Link></li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      <ServiceFaq service="hotels" />
    </main>
  );
}

"use client";

export type HotelSearch = {
  destination: string;
  checkin: string;
  checkout: string;
  guests: string;
  latitude?: number;
  longitude?: number;
};

type Partner = { name: string; description: string; href: string };

function bookingSearch(search: HotelSearch) {
  const url = new URL("https://www.booking.com/searchresults.fr.html");
  url.searchParams.set("ss", search.destination);
  if (search.checkin) url.searchParams.set("checkin", search.checkin);
  if (search.checkout) url.searchParams.set("checkout", search.checkout);
  url.searchParams.set("group_adults", search.guests);
  url.searchParams.set("no_rooms", "1");
  return url.toString();
}

function partners(search: HotelSearch): Partner[] {
  const results: Partner[] = [{
    name: "Booking.com",
    description: "Consulter les hébergements et tarifs sur Booking.com",
    href: bookingSearch(search),
  }];
  // Afficher uniquement les autres marchands dont la destination a été configurée.
  // Ne pas attribuer de prix à un partenaire sans accès à son inventaire en direct.
  return results;
}

export default function HotelExplorer({ search }: { search: HotelSearch }) {
  const results = partners(search);
  const hasDates = Boolean(search.checkin && search.checkout);
  return (
    <section className="results-shell hotel-live-shell" id="hotel-offers" aria-label="Recherche d'hôtels">
      <div className="results-toolbar hotel-live-toolbar">
        <div>
          <strong>Rechercher un hébergement à {search.destination}</strong>
          <span>{hasDates
            ? `Séjour du ${formatDate(search.checkin)} au ${formatDate(search.checkout)} · ${search.guests} voyageur${search.guests === "1" ? "" : "s"}`
            : "Sélectionnez vos dates pour affiner la recherche."}</span>
        </div>
      </div>
      <div style={{ padding: "24px", display: "grid", gap: "16px" }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Voir les disponibilités chez nos partenaires</h2>
        <p style={{ margin: 0, opacity: .78 }}>Les tarifs et disponibilités sont vérifiés directement chez le partenaire. HiFlight n'affiche pas de prix non vérifiés.</p>
        {results.map((partner) => (
          <article key={partner.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
            <div><strong>{partner.name}</strong><p style={{ margin: "6px 0 0", opacity: .75 }}>{partner.description}</p></div>
            <a href={partner.href} target="_blank" rel="noopener noreferrer sponsored" style={{ display: "inline-block", background: "#0F172A", color: "#fff", borderRadius: 12, padding: "12px 18px", fontWeight: 600, textDecoration: "none" }}>Voir les offres ↗</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(year, month - 1, day));
}

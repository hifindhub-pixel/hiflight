import Link from "next/link";

type Props = { active: "flights" | "hotels" | "cars" | "ground" };

const services = [
  { id: "flights", label: "Vols", href: "/#recherche" },
  { id: "hotels", label: "Hôtels", href: "/hotels" },
  { id: "cars", label: "Voitures", href: "/voitures" },
  { id: "ground", label: "Trains & bus", href: "/trains-bus" },
] as const;

function ServiceIcon({ id }: { id: Props["active"] }) {
  if (id === "flights") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 20h18" className="service-icon-detail" />
        <path d="m3.7 14.7 2.9.8 3.2-1.6-3.4-7.6 1.8-.9 5.4 6.4 4.6-2.3c1.4-.7 2.7-.3 3.2.7.5 1-.1 2.2-1.5 2.9L8.7 18.7a3 3 0 0 1-2.2.2l-2.1-.6-1.7-2.8 1-.8Z" />
      </svg>
    );
  }

  if (id === "hotels") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 20V8.5A2.5 2.5 0 0 1 5.5 6h13A2.5 2.5 0 0 1 21 8.5V20" />
        <path d="M3 11h18M3 17h18" />
        <path d="M7 11V9h3v2m4 0V9h3v2" className="service-icon-detail" />
      </svg>
    );
  }

  if (id === "cars") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5.2 10 1.5-4h10.6l1.5 4" />
        <path d="M4.5 10h15A1.5 1.5 0 0 1 21 11.5v5A1.5 1.5 0 0 1 19.5 18h-15A1.5 1.5 0 0 1 3 16.5v-5A1.5 1.5 0 0 1 4.5 10Z" />
        <path d="M6 18v2m12-2v2M7 14h.01M17 14h.01" className="service-icon-detail" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 17V6.5C6 4.6 8.7 3 12 3s6 1.6 6 3.5V17a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z" />
      <path d="M6 10h12M9 19l-2 3m8-3 2 3M9 15h.01M15 15h.01" className="service-icon-detail" />
    </svg>
  );
}

export default function ServiceTabs({ active }: Props) {
  return (
    <div className="service-tabs" aria-label="Services de voyage">
      {services.map((service) => (
        <Link
          key={service.id}
          className={active === service.id ? "active" : ""}
          href={service.href}
          aria-current={active === service.id ? "page" : undefined}
        >
          <span className="service-tab-icon"><ServiceIcon id={service.id} /></span>
          <span>{service.label}</span>
        </Link>
      ))}
    </div>
  );
}

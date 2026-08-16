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
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 14.5 10 12l-4-7 2-1 6 6 5.5-2c1.4-.5 2.5.1 2.8.9.3.9-.2 2-1.6 2.7L15 14l-2 8-2 .5v-7l-5.5 2.2-2-3.2Z" /></svg>;
  }

  if (id === "hotels") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19v-9m18 9v-7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3m-4 0h18M7 10V7.8C7 6.8 6.2 6 5.2 6h-.4C3.8 6 3 6.8 3 7.8V10" /></svg>;
  }

  if (id === "cars") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 16-1.5-1.5V11l2-5h13l2 5v3.5L19 16M3.5 11h17M7 14h.01M17 14h.01M6 16v2m12-2v2" /></svg>;
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17V6.5C6 4.6 8.7 3 12 3s6 1.6 6 3.5V17m-12 0h12M8 20l2-3m6 3-2-3M8.5 7h7M9 13h.01M15 13h.01" /></svg>;
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

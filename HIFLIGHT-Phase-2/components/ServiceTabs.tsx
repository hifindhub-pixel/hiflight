import Link from "next/link";

type Props = { active: "flights" | "hotels" | "cars" | "ground" };

const services = [
  { id: "flights", label: "Vols", href: "/#recherche" },
  { id: "hotels", label: "Hôtels", href: "/hotels" },
  { id: "cars", label: "Voitures", href: "/voitures" },
  { id: "ground", label: "Trains & bus", href: "/trains-bus" },
] as const;

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
          {service.label}
        </Link>
      ))}
    </div>
  );
}

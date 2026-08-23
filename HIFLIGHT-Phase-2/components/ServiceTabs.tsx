import Link from "next/link";

type Props = { active: "flights" | "hotels" | "cars" | "ground" };

const services = [
  { id: "flights", label: "Vols", href: "/", icon: "/icons/service-flight.png" },
  { id: "hotels", label: "Hôtels", href: "/hotels", icon: "/icons/service-hotel.svg" },
  { id: "cars", label: "Voitures", href: "/voitures", icon: "/icons/service-car.png" },
  { id: "ground", label: "Trains & bus", href: "/trains-bus", icon: "/icons/service-train.svg" },
] as const;

export default function ServiceTabs({ active }: Props) {
  return (
    <div className="service-tabs" aria-label="Services de voyage">
      {services.map((service) => {
        return (
          <Link
            key={service.id}
            className={active === service.id ? "active" : ""}
            href={service.href}
            aria-current={active === service.id ? "page" : undefined}
          >
            <span
              className={`service-tab-icon service-tab-icon-${service.id}`}
              style={{ "--service-icon": `url(${service.icon})` } as React.CSSProperties}
              aria-hidden="true"
            />
            <span>{service.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

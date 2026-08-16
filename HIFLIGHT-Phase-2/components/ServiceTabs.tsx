import Link from "next/link";
import { BedDouble, CarFront, Plane, TrainFront } from "lucide-react";

type Props = { active: "flights" | "hotels" | "cars" | "ground" };

const services = [
  { id: "flights", label: "Vols", href: "/#recherche", icon: Plane },
  { id: "hotels", label: "Hôtels", href: "/hotels", icon: BedDouble },
  { id: "cars", label: "Voitures", href: "/voitures", icon: CarFront },
  { id: "ground", label: "Trains & bus", href: "/trains-bus", icon: TrainFront },
] as const;

export default function ServiceTabs({ active }: Props) {
  return (
    <div className="service-tabs" aria-label="Services de voyage">
      {services.map((service) => {
        const Icon = service.icon;

        return (
          <Link
            key={service.id}
            className={active === service.id ? "active" : ""}
            href={service.href}
            aria-current={active === service.id ? "page" : undefined}
          >
            <Icon className="service-tab-icon" aria-hidden="true" strokeWidth={2} />
            <span>{service.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

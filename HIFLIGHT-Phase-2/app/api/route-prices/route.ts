import { NextResponse } from "next/server";
import { flightRoutes } from "@/lib/content";
import { getRouteStats } from "@/lib/route-data";

// Instantané des prix « dès X € » de tous les trajets, figé au build (le site est reconstruit chaque nuit).
// Sert à la page Favoris, qui affiche le prix et la ville de chaque trajet enregistré.
export const dynamic = "force-static";

export type RoutePriceEntry = {
  origin: string;
  destination: string;
  destinationCode: string;
  duration: string;
  direct: boolean;
  price: number | null;
  month: string | null;
  directPrice: number | null;
};

export async function GET() {
  const routes: Record<string, RoutePriceEntry> = {};
  let updatedAt: string | null = null;
  for (let i = 0; i < flightRoutes.length; i += 8) {
    await Promise.all(flightRoutes.slice(i, i + 8).map(async (route) => {
      const stats = await getRouteStats(route);
      if (stats && (!updatedAt || stats.updatedAt > updatedAt)) updatedAt = stats.updatedAt;
      routes[route.slug] = {
        origin: route.origin,
        destination: route.destination,
        destinationCode: route.destinationCode,
        duration: route.duration,
        direct: route.direct,
        price: stats?.lowest.price ?? null,
        month: stats?.lowest.monthLabel ?? null,
        directPrice: stats?.directLowest ?? null,
      };
    }));
  }
  return NextResponse.json({ updatedAt, routes });
}

import { NextRequest, NextResponse } from "next/server";
import { CarAffiliateGroup, carAffiliateLinks, selectCarAffiliate } from "@/lib/affiliate-links";

const allowedGroups = new Set<CarAffiliateGroup>(["global", "local", "bike"]);
const economyBookingsTrackingUrl = carAffiliateLinks.global.find((link) => link.id === "economybookings-tp")?.url
  || "https://economybookings.tpk.lu/6lja1RKL";

function safeValue(request: NextRequest, name: string, maxLength = 100) {
  return request.nextUrl.searchParams.get(name)?.trim().slice(0, maxLength) || "";
}

function addDate(destination: URL, prefix: "p" | "d", value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return;
  destination.searchParams.set(`${prefix}y`, match[1]);
  destination.searchParams.set(`${prefix}m`, match[2]);
  destination.searchParams.set(`${prefix}d`, match[3]);
}

function addTime(destination: URL, name: "pt" | "dt", value: string) {
  if (/^\d{2}:\d{2}$/.test(value)) destination.searchParams.set(name, value.replace(":", ""));
}

async function resolveEconomyBookingsTracking() {
  let current = new URL(economyBookingsTrackingUrl);

  try {
    for (let hop = 0; hop < 4; hop += 1) {
      const response = await fetch(current, {
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
        headers: { Accept: "text/html", "User-Agent": "HiFlight/1.0" },
      });
      const location = response.headers.get("location");
      if (!location) break;

      const next = new URL(location, current);
      const allowed = next.hostname.endsWith("tpk.lu") || next.hostname.endsWith("economybookings.com");
      if (!allowed) break;
      current = next;

      if (current.hostname.endsWith("economybookings.com") && current.searchParams.get("tpo_uid")) {
        return current;
      }
    }
  } catch {
    return null;
  }

  return null;
}

async function economyBookingsDestination(request: NextRequest) {
  const tracked = await resolveEconomyBookingsTracking();
  if (!tracked) return new URL(economyBookingsTrackingUrl);

  const destination = new URL("https://www.economybookings.com/fr/cars/results");
  for (const [key, value] of tracked.searchParams) destination.searchParams.set(key, value);

  destination.searchParams.set("crcy", "EUR");
  destination.searchParams.set("lang", "fr");
  destination.searchParams.set("reload", "1");

  const pickup = safeValue(request, "pickup");
  const pickupCode = safeValue(request, "pickupCode", 8).toUpperCase();
  const pickupType = safeValue(request, "pickupType", 20);
  if (pickupType === "airport" && /^[A-Z]{3}$/.test(pickupCode)) {
    destination.searchParams.set("idpickval", pickupCode);
  } else if (pickup) {
    destination.searchParams.set("idpick", pickup.split(",")[0]);
  }

  addDate(destination, "p", safeValue(request, "pickupDate", 10));
  addDate(destination, "d", safeValue(request, "returnDate", 10));
  addTime(destination, "pt", safeValue(request, "pickupTime", 5));
  addTime(destination, "dt", safeValue(request, "returnTime", 5));

  const driverAge = Number.parseInt(safeValue(request, "driverAge", 3), 10);
  if (driverAge >= 18 && driverAge <= 99) destination.searchParams.set("age", String(driverAge));

  return destination;
}

export async function GET(request: NextRequest) {
  const requestedGroup = request.nextUrl.searchParams.get("offre") as CarAffiliateGroup | null;
  const group = requestedGroup && allowedGroups.has(requestedGroup) ? requestedGroup : "global";

  let destination: URL;
  if (group === "global") {
    destination = await economyBookingsDestination(request);
  } else {
    const seed = safeValue(request, "pickup") || `${Date.now()}`;
    const partner = selectCarAffiliate(group, seed);
    try {
      destination = new URL(partner.url);
    } catch {
      return NextResponse.redirect(new URL("/voitures", request.url));
    }
  }

  if (destination.hostname.endsWith("awin1.com")) destination.searchParams.set("clickref", `hf-${group}`);
  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

import { NextRequest, NextResponse } from "next/server";
import { CarAffiliateGroup, selectCarAffiliate } from "@/lib/affiliate-links";

const allowedGroups = new Set<CarAffiliateGroup>(["global", "local", "bike"]);
const expediaAffiliateId = "fr.network.cj.101723457.13854905.";
const expediaTrackingUrl = "https://www.kqzyfj.com/click-101723457-13854905";

function safeValue(request: NextRequest, name: string, maxLength = 120) {
  return request.nextUrl.searchParams.get(name)?.trim().slice(0, maxLength) || "";
}

function addExpediaDate(destination: URL, compactName: "d1" | "d2", displayName: "date1" | "date2", value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return;
  destination.searchParams.set(compactName, match[1] + "-" + Number(match[2]) + "-" + Number(match[3]));
  destination.searchParams.set(displayName, match[3] + "/" + match[2] + "/" + match[1]);
}

function expediaTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return "";
  const hours = Number(match[1]);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return String(displayHours).padStart(2, "0") + match[2] + period;
}

async function expediaDestination(request: NextRequest) {
  const destination = new URL("https://www.expedia.fr/carsearch");
  destination.searchParams.set("affcid", expediaAffiliateId);

  const pickup = safeValue(request, "pickup");
  if (pickup) destination.searchParams.set("locn", pickup);

  addExpediaDate(destination, "d1", "date1", safeValue(request, "pickupDate", 10));
  addExpediaDate(destination, "d2", "date2", safeValue(request, "returnDate", 10));

  const pickupTime = expediaTime(safeValue(request, "pickupTime", 5));
  const returnTime = expediaTime(safeValue(request, "returnTime", 5));
  if (pickupTime) destination.searchParams.set("time1", pickupTime);
  if (returnTime) destination.searchParams.set("time2", returnTime);

  return destination;
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("tracking") === "1") {
    const response = NextResponse.redirect(new URL(expediaTrackingUrl), 307);
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const requestedGroup = request.nextUrl.searchParams.get("offre") as CarAffiliateGroup | null;
  const group = requestedGroup && allowedGroups.has(requestedGroup) ? requestedGroup : "global";

  let destination: URL;
  if (group === "global") {
    destination = await expediaDestination(request);
  } else {
    const seed = safeValue(request, "pickup") || String(Date.now());
    const partner = selectCarAffiliate(group, seed);
    try {
      destination = new URL(partner.url);
    } catch {
      return NextResponse.redirect(new URL("/voitures", request.url));
    }
  }

  if (destination.hostname.endsWith("awin1.com")) destination.searchParams.set("clickref", "hf-" + group);
  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

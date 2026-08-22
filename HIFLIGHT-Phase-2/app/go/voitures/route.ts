import { NextRequest, NextResponse } from "next/server";
import { CarAffiliateGroup, selectCarAffiliate } from "@/lib/affiliate-links";

const allowedGroups = new Set<CarAffiliateGroup>(["global", "local", "bike"]);

export function GET(request: NextRequest) {
  const requestedGroup = request.nextUrl.searchParams.get("offre") as CarAffiliateGroup | null;
  const group = requestedGroup && allowedGroups.has(requestedGroup) ? requestedGroup : "global";
  const seed = request.nextUrl.searchParams.get("recherche")?.slice(0, 180) || `${Date.now()}`;
  const partner = selectCarAffiliate(group, seed);

  let destination: URL;
  try {
    destination = new URL(partner.url);
  } catch {
    return NextResponse.redirect(new URL("/voitures", request.url));
  }

  if (destination.hostname.endsWith("awin1.com")) destination.searchParams.set("clickref", `hf-${group}`);
  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

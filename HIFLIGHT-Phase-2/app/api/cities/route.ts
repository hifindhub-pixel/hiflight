import { NextRequest, NextResponse } from "next/server";

type TravelpayoutsPlace = {
  id?: string;
  type?: string;
  code?: string;
  name?: string;
  country_code?: string;
  country_name?: string;
  state_code?: string | null;
  coordinates?: { lat?: number; lon?: number };
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";
  if (query.length < 2 || query.length > 80) return NextResponse.json({ cities: [] });

  const params = new URLSearchParams({ term: query, locale: "fr" });
  params.append("types[]", "city");

  try {
    const response = await fetch(`https://autocomplete.travelpayouts.com/places2?${params}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Travelpayouts autocomplete ${response.status}`);

    const places = (await response.json()) as TravelpayoutsPlace[];
    const seen = new Set<string>();
    const cities = places
      .filter((place) => place.type === "city" && place.name && place.country_name)
      .filter((place) => {
        const key = `${place.name}-${place.country_code}-${place.state_code || ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 10)
      .map((place) => ({
        id: place.id || `${place.name}-${place.country_code}`,
        name: place.name!,
        countryName: place.country_name!,
        countryCode: place.country_code || "",
        stateCode: place.state_code || "",
        code: place.code || "",
        latitude: place.coordinates?.lat,
        longitude: place.coordinates?.lon,
      }));

    return NextResponse.json({ cities }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return NextResponse.json({ cities: [], unavailable: true }, { status: 502 });
  }
}

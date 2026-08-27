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

type TravelpayoutsAirport = {
  code?: string;
  name?: string;
  name_translations?: { fr?: string; en?: string };
  city_code?: string;
  country_code?: string;
  iata_type?: string;
  flightable?: boolean;
  coordinates?: { lat?: number; lon?: number };
};

type TravelpayoutsCity = {
  code?: string;
  name?: string;
  name_translations?: { fr?: string; en?: string };
};

function normalize(value = "") {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr-FR").trim();
}

function relevance(place: TravelpayoutsPlace, query: string) {
  const needle = normalize(query);
  const name = normalize(place.name);
  const code = normalize(place.code);
  if (name === needle || code === needle) return 0;
  if (name.startsWith(needle)) return 1;
  if (name.split(/[\s'’-]+/).some((word) => word.startsWith(needle))) return 2;
  if (name.includes(needle)) return 3;
  return 99;
}

function distanceKm(latA: number, lonA: number, latB: number, lonB: number) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const deltaLat = radians(latB - latA);
  const deltaLon = radians(lonB - lonA);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(latA)) * Math.cos(radians(latB)) * Math.sin(deltaLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";
  const mode = request.nextUrl.searchParams.get("mode");
  const includeAirports = mode === "car" || mode === "flight";
  if (query.length < 2 || query.length > 80) return NextResponse.json({ cities: [] });

  const params = new URLSearchParams({ term: query, locale: "fr" });
  params.append("types[]", "city");
  if (includeAirports) params.append("types[]", "airport");

  try {
    const locationDataPromise: Promise<{ airports: TravelpayoutsAirport[]; cityNames: Map<string, string> }> = mode === "flight"
      ? Promise.all([
        fetch("https://api.travelpayouts.com/data/fr/airports.json", {
          next: { revalidate: 604800 }, signal: AbortSignal.timeout(8000), headers: { Accept: "application/json" },
        }).then((airportResponse) => airportResponse.ok ? airportResponse.json() as Promise<TravelpayoutsAirport[]> : []).catch(() => []),
        fetch("https://api.travelpayouts.com/data/fr/cities.json", {
          next: { revalidate: 604800 }, signal: AbortSignal.timeout(8000), headers: { Accept: "application/json" },
        }).then((cityResponse) => cityResponse.ok ? cityResponse.json() as Promise<TravelpayoutsCity[]> : []).catch(() => []),
      ]).then(([airports, cities]) => ({
        airports,
        cityNames: new Map(cities.filter((city) => city.code && city.name).map((city) => [city.code!, city.name_translations?.fr || city.name || city.name_translations?.en || city.code!])),
      }))
      : Promise.resolve({ airports: [], cityNames: new Map<string, string>() });
    const response = await fetch(`https://autocomplete.travelpayouts.com/places2?${params}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Travelpayouts autocomplete ${response.status}`);

    const places = (await response.json()) as TravelpayoutsPlace[];
    const relevantPlaces = places
      .filter((place) => relevance(place, query) < 99)
      .sort((left, right) => relevance(left, query) - relevance(right, query));

    if (mode === "flight") {
      const primaryCity = relevantPlaces.find((place) => place.type === "city" && place.name && place.country_name && place.code);
      if (primaryCity) {
        const latitude = primaryCity.coordinates?.lat;
        const longitude = primaryCity.coordinates?.lon;
        let nearbyAirports: Array<Record<string, unknown>> = [];

        if (typeof latitude === "number" && typeof longitude === "number") {
          const { airports, cityNames } = await locationDataPromise;
          if (airports.length) {
            nearbyAirports = airports
              .filter((airport) => airport.iata_type === "airport" && airport.flightable && airport.code && typeof airport.coordinates?.lat === "number" && typeof airport.coordinates?.lon === "number")
              .map((airport) => ({
                airport,
                distance: distanceKm(latitude, longitude, airport.coordinates!.lat!, airport.coordinates!.lon!),
              }))
              .filter(({ distance }) => distance <= 120)
              .sort((left, right) => left.distance - right.distance)
              .slice(0, 6)
              .map(({ airport, distance }) => {
                const cityName = cityNames.get(airport.city_code || "");
                const airportName = airport.name_translations?.fr || airport.name || airport.name_translations?.en || airport.code;
                const displayName = cityName && !normalize(airportName).includes(normalize(cityName)) ? `${cityName} — ${airportName}` : airportName;
                return {
                  id: `airport-${airport.code}`,
                  type: "airport",
                  name: displayName,
                  countryName: airport.country_code === primaryCity.country_code ? primaryCity.country_name : airport.country_code,
                  countryCode: airport.country_code || "",
                  stateCode: "",
                  code: airport.code,
                  latitude: airport.coordinates?.lat,
                  longitude: airport.coordinates?.lon,
                  distanceKm: Math.round(distance),
                  referenceCity: primaryCity.name,
                };
              });
          }
        }

        return NextResponse.json({
          cities: [{
            id: primaryCity.id || `${primaryCity.name}-${primaryCity.country_code}`,
            type: "city",
            name: primaryCity.name,
            countryName: primaryCity.country_name,
            countryCode: primaryCity.country_code || "",
            stateCode: primaryCity.state_code || "",
            code: primaryCity.code,
            latitude,
            longitude,
          }, ...nearbyAirports],
        }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
      }
    }

    const seen = new Set<string>();
    const cities = relevantPlaces
      .filter((place) => (place.type === "city" || (includeAirports && place.type === "airport")) && place.name && place.country_name)
      .filter((place) => {
        const key = `${place.name}-${place.country_code}-${place.state_code || ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 10)
      .map((place) => ({
        id: place.id || `${place.name}-${place.country_code}`,
        type: place.type || "city",
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

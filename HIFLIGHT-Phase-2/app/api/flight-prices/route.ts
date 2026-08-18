import { NextRequest, NextResponse } from "next/server";

type TravelpayoutsPrice = { depart_date?: string; value?: number };

export async function GET(request: NextRequest) {
  // TP_TOKEN is the name already configured on Vercel. Keep the former name
  // as a fallback so existing local environments continue to work.
  const token = (process.env.TP_TOKEN || process.env.TRAVELPAYOUTS_TOKEN || "").trim();
  if (!token) return NextResponse.json({ prices: {}, available: false, message: "Le calendrier tarifaire doit être activé." }, { status: 503 });

  const params = request.nextUrl.searchParams;
  const origin = (params.get("origin") || "").toUpperCase();
  const destination = (params.get("destination") || "").toUpperCase();
  const month = params.get("month") || "";
  const oneWay = params.get("oneWay") === "true";
  if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination) || !/^\d{4}-\d{2}$/.test(month)) return NextResponse.json({ prices: {}, available: false, message: "Paramètres invalides." }, { status: 400 });

  const url = new URL("https://api.travelpayouts.com/v2/prices/month-matrix");
  url.searchParams.set("currency", "eur");
  url.searchParams.set("origin", origin);
  url.searchParams.set("destination", destination);
  url.searchParams.set("month", `${month}-01`);
  url.searchParams.set("market", "fr");
  url.searchParams.set("one_way", String(oneWay));
  url.searchParams.set("show_to_affiliates", "true");
  url.searchParams.set("limit", "31");
  // Travelpayouts accepts the token either in the header or as a query
  // parameter. Sending both keeps the Vercel server request compatible with
  // both documented authentication paths.
  url.searchParams.set("token", token);

  try {
    const response = await fetch(url, { headers: { "X-Access-Token": token, Accept: "application/json" }, next: { revalidate: 3600 } });
    if (!response.ok) {
      const upstream = (await response.json().catch(() => null)) as { error?: string } | null;
      return NextResponse.json({ prices: {}, available: false, message: "Tarifs momentanément indisponibles.", upstreamStatus: response.status, upstreamError: upstream?.error || undefined }, { status: 502 });
    }
    const payload = (await response.json()) as { data?: TravelpayoutsPrice[] };
    const prices: Record<string, number> = {};
    for (const offer of payload.data || []) {
      if (!offer.depart_date || typeof offer.value !== "number") continue;
      prices[offer.depart_date] = prices[offer.depart_date] ? Math.min(prices[offer.depart_date], offer.value) : offer.value;
    }
    return NextResponse.json({ prices, available: true, currency: "EUR", cached: true }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ prices: {}, available: false, message: "Tarifs momentanément indisponibles." }, { status: 502 });
  }
}

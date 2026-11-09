import { buildHotelLink } from '@/lib/agoda/hotel-link';
import { agodaEnabled, agodaBindings, allowAgodaSearch } from '@/lib/agoda/server-config';
import { NextResponse } from 'next/server';
import { isAgodaCity } from '@/lib/agoda/catalogue-search';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (!agodaEnabled()) return NextResponse.json({ error: 'Prototype local uniquement.' }, { status: 404 });
  const auth = agodaBindings().AGODA_AUTH;
  if (!auth) return NextResponse.json({ error: 'Clé Agoda absente du serveur local.' }, { status: 503 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  const { cityId, checkin, checkout, adults } = body;
  let knownCity;
  try { knownCity = await isAgodaCity(cityId); }
  catch { return NextResponse.json({ error: "Le catalogue des destinations est indisponible. Réessayez plus tard." }, { status: 503 }); }
  const validDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v;
  if (!knownCity || !validDate(checkin) || !validDate(checkout) || checkin < new Date().toISOString().slice(0,10) || checkout <= checkin || (Date.parse(checkout)-Date.parse(checkin))/86400000 > 30 || !Number.isInteger(adults) || adults < 1 || adults > 6) return NextResponse.json({ error: 'Vérifiez la destination, les dates (30 nuits maximum) et les adultes.' }, { status: 400 });
  try {
    if (!await allowAgodaSearch(request)) return NextResponse.json({ error: 'Trop de recherches. Patientez une minute avant de réessayer.' }, { status: 429, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } });
    const start = Date.now();
    const response = await fetch('https://affiliateapi7643.agoda.com/affiliateservice/lt_v1', { method:'POST', headers:{ Authorization:auth, 'Content-Type':'application/json','Accept-Encoding':'gzip,deflate' }, body:JSON.stringify({criteria:{cityId,checkInDate:checkin,checkOutDate:checkout,additional:{currency:'EUR',language:'fr-fr',maxResult:30,occupancy:{numberOfAdult:adults,numberOfChildren:0}}}}), signal:AbortSignal.timeout(25000), cache:'no-store' });
    if (!response.ok) throw new Error('upstream');
    const data = await response.json();
    if (data.error && data.error.id !== 911) throw new Error('upstream');
    const results = (Array.isArray(data.results) ? data.results : []).filter((h: Record<string, unknown>) => {
      try { const u = new URL(String(h.landingURL)); return u.protocol === 'https:' && (u.hostname === 'agoda.com' || u.hostname.endsWith('.agoda.com')) && Number.isSafeInteger(h.hotelId) && Number(h.hotelId) > 0 && u.searchParams.get('hid') === String(h.hotelId) && u.searchParams.get('cid') === auth.split(':')[0] && u.searchParams.get('checkin') === checkin && u.searchParams.get('checkout') === checkout && u.searchParams.get('NumberofAdults') === String(adults) && typeof h.dailyRate === 'number' && Number.isFinite(h.dailyRate) && h.dailyRate > 0; } catch { return false; }
    }).map((h: Record<string, unknown>) => ({ hotelId:h.hotelId,hotelName:h.hotelName,dailyRate:h.dailyRate,reviewScore:h.reviewScore,reviewCount:h.reviewCount,starRating:h.starRating,latitude:h.latitude,longitude:h.longitude,includeBreakfast:h.includeBreakfast,freeWifi:h.freeWifi,landingURL:buildHotelLink(Number(h.hotelId), auth.split(':')[0], checkin, checkout, adults), propertyURL:buildHotelLink(Number(h.hotelId), auth.split(':')[0], checkin, checkout, adults), originalLandingURL:h.landingURL, priceBasis:'exclusive',imageURL:String(h.imageURL || '').replace(/^http:/,'https:') }));
    return NextResponse.json({ results, checkedAt: new Date().toISOString(), seconds: Math.round((Date.now()-start)/100)/10 }, { headers:{'Cache-Control':'no-store'} });
  } catch { return NextResponse.json({ error:'Agoda ne répond pas pour le moment. Réessayez ou consultez la recherche habituelle.' }, { status:502 }); }
}

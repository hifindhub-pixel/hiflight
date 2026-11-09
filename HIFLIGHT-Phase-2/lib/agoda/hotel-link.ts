// Direct-property format observed in the user's Agoda hotel page.
// Do not carry session-specific ds/searchrequestid from a previous visit.
export function buildHotelLink(hotelId: number, cid: string, checkin: string, checkout: string, adults: number) {
  const url = new URL('https://www.agoda.com/fr-fr/accom/property');
  const params = { propertyId: String(hotelId), cid, adults: String(adults), children: '0', rooms: '1', checkIn: checkin, los: String((Date.parse(checkout) - Date.parse(checkin)) / 86400000), currencyCode: 'EUR' };
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.toString();
}

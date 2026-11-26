// Module volontairement pur (aucun import) : il se teste hors Next.js avec
// `node --experimental-strip-types scripts/test-route-stats.mjs`.

export type Offer = { depart_date?: string; value?: number; number_of_changes?: number };

export type MonthStat = { key: string; label: string; min: number; directMin: number | null };
export type WeekdayStat = { label: string; avg: number };

export type RouteStats = {
  months: MonthStat[];
  lowest: { price: number; monthLabel: string };
  directLowest: number | null;
  /** Part (0-100) des offres relevées qui sont des vols directs ; null si l’info est absente. */
  directShare: number | null;
  weekdays: WeekdayStat[];
  cheapestWeekday: WeekdayStat | null;
  /** Nombre de dates de départ analysées. */
  sample: number;
  /** Date de calcul (ISO, jour). */
  updatedAt: string;
};

const WEEKDAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MIN_MONTHS = 2;
const MIN_DATES_FOR_WEEKDAYS = 21;
const MIN_DATES_PER_WEEKDAY = 3;

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function weekdayOf(date: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))).getUTCDay();
}

const valid = (offer: Offer): offer is Offer & { value: number } => typeof offer.value === "number" && Number.isFinite(offer.value) && offer.value > 0;

/**
 * Agrège les offres « month-matrix » (une liste par mois) en indicateurs lisibles.
 * Retourne null quand les données sont trop maigres pour être affichées honnêtement.
 */
export function buildStats(byMonth: { key: string; offers: Offer[] }[], now: Date = new Date()): RouteStats | null {
  const months: MonthStat[] = [];
  const dailyMin = new Map<string, number>();
  let directOffers = 0;
  let knownOffers = 0;
  let directLowest: number | null = null;

  for (const { key, offers } of byMonth) {
    const usable = offers.filter(valid);
    if (!usable.length) continue;
    const min = Math.min(...usable.map((offer) => offer.value));
    const directs = usable.filter((offer) => offer.number_of_changes === 0);
    const directMin = directs.length ? Math.min(...directs.map((offer) => offer.value)) : null;
    months.push({ key, label: monthLabel(key), min, directMin });
    if (directMin !== null) directLowest = directLowest === null ? directMin : Math.min(directLowest, directMin);

    for (const offer of usable) {
      if (typeof offer.number_of_changes === "number") {
        knownOffers += 1;
        if (offer.number_of_changes === 0) directOffers += 1;
      }
      if (offer.depart_date) {
        const previous = dailyMin.get(offer.depart_date);
        dailyMin.set(offer.depart_date, previous === undefined ? offer.value : Math.min(previous, offer.value));
      }
    }
  }

  if (months.length < MIN_MONTHS) return null;

  const lowestMonth = months.reduce((best, month) => (month.min < best.min ? month : best));

  const perWeekday: number[][] = [[], [], [], [], [], [], []];
  for (const [date, price] of dailyMin) {
    const day = weekdayOf(date);
    if (day !== null) perWeekday[day].push(price);
  }
  let weekdays: WeekdayStat[] = [];
  if (dailyMin.size >= MIN_DATES_FOR_WEEKDAYS && perWeekday.every((prices) => prices.length >= MIN_DATES_PER_WEEKDAY)) {
    weekdays = [1, 2, 3, 4, 5, 6, 0].map((day) => ({ label: WEEKDAYS[day], avg: Math.round(perWeekday[day].reduce((sum, price) => sum + price, 0) / perWeekday[day].length) }));
  }
  const cheapestWeekday = weekdays.length ? weekdays.reduce((best, day) => (day.avg < best.avg ? day : best)) : null;

  return {
    months,
    lowest: { price: Math.round(lowestMonth.min), monthLabel: lowestMonth.label },
    directLowest: directLowest === null ? null : Math.round(directLowest),
    directShare: knownOffers ? Math.round((directOffers / knownOffers) * 100) : null,
    weekdays,
    cheapestWeekday,
    sample: dailyMin.size,
    updatedAt: now.toISOString().slice(0, 10),
  };
}

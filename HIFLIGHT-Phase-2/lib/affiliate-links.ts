export type CarAffiliateGroup = "global" | "local" | "bike";

type AffiliateLink = {
  id: string;
  url: string;
};

const globalCars: AffiliateLink[] = [
  { id: "economybookings-tp", url: "https://economybookings.tpk.lu/6lja1RKL" },
  { id: "qeeq-tp", url: "https://qeeq.tpk.lu/NAlm12ah" },
  { id: "getrentacar-tp", url: "https://getrentacar.tpk.lu/PuXwHlsf" },
  { id: "klook-tp", url: "https://klook.tpk.lu/NRxVj1a6" },
  { id: "economybookings-cj", url: "https://www.jdoqocy.com/click-101723457-17126435" },
  { id: "vipcars-cj", url: "https://www.kqzyfj.com/click-101723457-17236371" },
  { id: "expedia-cj", url: "https://www.kqzyfj.com/click-101723457-13854905" },
  { id: "hertz-cj", url: "https://www.kqzyfj.com/click-101723457-17263150" },
  { id: "vipcars-awin", url: process.env.NEXT_PUBLIC_VIPCARS_AFFILIATE_URL || "https://www.awin1.com/cread.php?awinmid=58019&awinaffid=2855063" },
];

const localCars: AffiliateLink[] = [
  { id: "localrent-tp", url: "https://localrent.tpk.lu/ssjXcpRX" },
  { id: "getrentacar-tp", url: "https://getrentacar.tpk.lu/PuXwHlsf" },
];

const bikes: AffiliateLink[] = [
  { id: "bikesbooking-tp", url: "https://bikesbooking.tpk.lu/seCExQ7k" },
];

export const carAffiliateLinks: Record<CarAffiliateGroup, AffiliateLink[]> = {
  global: globalCars,
  local: localCars,
  bike: bikes,
};

export const savedHotelAffiliateLinks = {
  trivagoCj: "https://www.dpbolvw.net/click-101723457-17237058",
};

export const pendingCarWidgets = {
  holidayAutos: "https://www.holidayautos.com/fr/minimal?clientID=641225&curr=EUR&PID=101723457&SID=&AID=12341343",
};

export function selectCarAffiliate(group: CarAffiliateGroup, seed: string) {
  const links = carAffiliateLinks[group];
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return links[Math.abs(hash) % links.length];
}

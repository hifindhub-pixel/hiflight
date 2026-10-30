// Test sans dépendance : node --experimental-strip-types scripts/test-route-stats.mjs
import assert from "node:assert/strict";
import { buildStats } from "../lib/route-stats.ts";

// Jeu de données synthétique : 3 mois, un prix par jour, un vol direct un jour sur deux.
const month = (key, base) => {
  const offers = [];
  for (let day = 1; day <= 28; day += 1) {
    const date = `${key}-${String(day).padStart(2, "0")}`;
    offers.push({ depart_date: date, value: base + (day % 7) * 10, number_of_changes: day % 2 });
  }
  return { key, offers };
};

const stats = buildStats([month("2026-11", 120), month("2026-12", 90), month("2027-01", 150)], new Date("2026-10-30T10:00:00Z"));
assert.ok(stats, "stats attendues");
assert.equal(stats.months.length, 3);
assert.equal(stats.lowest.price, 90, "le prix le plus bas est celui de décembre");
assert.match(stats.lowest.monthLabel, /décembre 2026/);
assert.equal(stats.directLowest, 90 + 0, "le vol direct le moins cher est pris parmi number_of_changes === 0");
assert.equal(stats.directShare, 50);
assert.equal(stats.weekdays.length, 7);
assert.ok(stats.cheapestWeekday, "un jour le moins cher est calculé");
assert.equal(stats.updatedAt, "2026-10-30");

// Données trop maigres : on n’affiche rien plutôt que d’inventer.
assert.equal(buildStats([month("2026-11", 100)]), null, "un seul mois = pas de statistiques");
assert.equal(buildStats([{ key: "2026-11", offers: [] }, { key: "2026-12", offers: [{ value: -4 }] }]), null, "offres invalides ignorées");

// Jours de semaine : pas de classement si l’échantillon est trop petit.
const small = buildStats([
  { key: "2026-11", offers: [{ depart_date: "2026-11-03", value: 100 }, { depart_date: "2026-11-04", value: 110 }] },
  { key: "2026-12", offers: [{ depart_date: "2026-12-03", value: 95 }] },
]);
assert.ok(small);
assert.equal(small.weekdays.length, 0);
assert.equal(small.cheapestWeekday, null);
assert.equal(small.directShare, null, "number_of_changes absent = part de directs inconnue");

console.log("OK : route-stats");

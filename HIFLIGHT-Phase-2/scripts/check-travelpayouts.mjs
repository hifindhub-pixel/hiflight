// Contrôle de la réponse réelle de l'API Travelpayouts (month-matrix), sans jamais afficher le jeton.
//
// Windows (CMD) :   set TP_TOKEN=votre_jeton   puis   node scripts\check-travelpayouts.mjs
// macOS / Linux :   TP_TOKEN=votre_jeton node scripts/check-travelpayouts.mjs
//
// Collez ensuite le résultat affiché (il ne contient aucun secret) dans la conversation.

const token = (process.env.TP_TOKEN || process.env.TRAVELPAYOUTS_TOKEN || "").trim();
if (!token) {
  console.error("TP_TOKEN absent : définissez la variable d'environnement avant de lancer ce script.");
  process.exit(1);
}

const origin = (process.argv[2] || "PAR").toUpperCase();
const destination = (process.argv[3] || "ALG").toUpperCase();
const next = new Date();
next.setDate(1);
next.setMonth(next.getMonth() + 1);
const month = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-01`;

const url = new URL("https://api.travelpayouts.com/v2/prices/month-matrix");
url.searchParams.set("currency", "eur");
url.searchParams.set("origin", origin);
url.searchParams.set("destination", destination);
url.searchParams.set("month", month);
url.searchParams.set("market", "fr");
url.searchParams.set("one_way", "false");
url.searchParams.set("show_to_affiliates", "true");
url.searchParams.set("limit", "31");

try {
  const response = await fetch(url, { headers: { "X-Access-Token": token, Accept: "application/json" } });
  const text = await response.text();
  console.log(`Trajet ${origin} -> ${destination}, mois ${month}`);
  console.log(`HTTP ${response.status}`);
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    console.log("Réponse non JSON (début) :", text.slice(0, 200));
    process.exit(0);
  }
  console.log("Clés de premier niveau :", Object.keys(payload).join(", "));
  const data = Array.isArray(payload.data) ? payload.data : [];
  console.log(`Nombre d'offres : ${data.length}`);
  if (data.length) {
    console.log("Champs d'une offre :", Object.keys(data[0]).join(", "));
    const withChanges = data.filter((offer) => typeof offer.number_of_changes === "number").length;
    const direct = data.filter((offer) => offer.number_of_changes === 0).length;
    console.log(`Offres avec number_of_changes numérique : ${withChanges}/${data.length} (dont directes : ${direct})`);
    console.log("Exemples :", JSON.stringify(data.slice(0, 3).map(({ depart_date, return_date, value, number_of_changes }) => ({ depart_date, return_date, value, number_of_changes }))));
  } else if (payload.error || payload.message) {
    console.log("Message de l'API :", payload.error || payload.message);
  }
} catch (error) {
  console.error("Échec de la requête :", error instanceof Error ? error.message : error);
  process.exit(1);
}

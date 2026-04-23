require('dotenv').config();

console.log('🧪 Test de configuration HiFlight Backend\n');

// Vérification des variables d'environnement
const checks = [
  { name: 'AMADEUS_CLIENT_ID', value: process.env.AMADEUS_CLIENT_ID },
  { name: 'AMADEUS_CLIENT_SECRET', value: process.env.AMADEUS_CLIENT_SECRET },
  { name: 'DUFFEL_ACCESS_TOKEN', value: process.env.DUFFEL_ACCESS_TOKEN },
];

let allOk = true;
for (const check of checks) {
  const ok = !!check.value && check.value !== `your_${check.name.toLowerCase()}`;
  console.log(`${ok ? '✅' : '❌'} ${check.name}: ${ok ? 'configuré' : 'MANQUANT'}`);
  if (!ok) allOk = false;
}

if (!allOk) {
  console.log('\n⚠️  Copie .env.example vers .env et remplis tes clés API\n');
  process.exit(1);
}

// Test Amadeus
async function testAmadeus() {
  try {
    const { searchLocations } = require('./services/amadeus');
    const results = await searchLocations('Paris');
    console.log(`\n✅ Amadeus OK — ${results.length} résultats pour "Paris"`);
    if (results[0]) console.log(`   Ex: ${results[0].name} (${results[0].iataCode})`);
  } catch (err) {
    console.log(`\n❌ Amadeus ERREUR: ${err.message}`);
  }
}

// Test Duffel
async function testDuffel() {
  try {
    const { searchLocations } = require('./services/duffel');
    const results = await searchLocations('Barcelona');
    console.log(`✅ Duffel OK — ${results.length} résultats pour "Barcelona"`);
    if (results[0]) console.log(`   Ex: ${results[0].name} (${results[0].iataCode})`);
  } catch (err) {
    console.log(`❌ Duffel ERREUR: ${err.message}`);
  }
}

// Test recherche complète
async function testSearch() {
  try {
    const { searchFlights } = require('./services/aggregator');
    console.log('\n🔍 Test recherche PAR→BCN pour demain...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 30);
    const date = tomorrow.toISOString().split('T')[0];

    const results = await searchFlights({
      originCode: 'PAR',
      destinationCode: 'BCN',
      departureDate: date,
      adults: 1,
      max: 5,
    });

    console.log(`✅ Agrégateur OK:`);
    console.log(`   ${results.meta.fromAmadeus} vols Amadeus`);
    console.log(`   ${results.meta.fromDuffel} vols Duffel`);
    console.log(`   ${results.meta.total} vols total après déduplication`);
    if (results.offers[0]) {
      console.log(`   Meilleur prix: ${results.offers[0].price.total}€ (${results.offers[0].source})`);
    }
  } catch (err) {
    console.log(`❌ Agrégateur ERREUR: ${err.message}`);
  }
}

(async () => {
  await testAmadeus();
  await testDuffel();
  await testSearch();
  console.log('\n✨ Tests terminés\n');
})();

# HiFlight Backend

API backend Node.js qui agrège les résultats de vols Amadeus et Duffel en parallèle.

## Stack
- **Express.js** — serveur HTTP
- **Amadeus SDK** — 700+ compagnies GDS
- **Duffel API** — compagnies NDC, paiement Stripe intégré
- **Déduplication** — garde le moins cher si même vol dans les deux sources

## Installation

```bash
git clone <repo>
cd hiflight-backend
npm install
cp .env.example .env
# Remplis tes clés dans .env
npm run dev
```

## Variables d'environnement

| Variable | Description | Où trouver |
|---|---|---|
| `AMADEUS_CLIENT_ID` | Client ID Amadeus | developers.amadeus.com |
| `AMADEUS_CLIENT_SECRET` | Client Secret Amadeus | developers.amadeus.com |
| `AMADEUS_ENV` | `test` ou `production` | — |
| `DUFFEL_ACCESS_TOKEN` | Token Duffel | app.duffel.com |
| `PORT` | Port du serveur (défaut: 3001) | — |
| `FRONTEND_URL` | URL du frontend (CORS) | — |

## Endpoints

### `GET /health`
Vérifie que le serveur tourne.

### `GET /api/locations?q=Paris`
Autocomplete aéroports/villes (Amadeus + Duffel fusionnés).

### `POST /api/flights/search`
Recherche de vols en parallèle sur les deux sources.

```json
{
  "originCode": "PAR",
  "destinationCode": "BCN",
  "departureDate": "2025-06-15",
  "returnDate": "2025-06-22",
  "adults": 1,
  "children": 0,
  "travelClass": "ECONOMY",
  "currencyCode": "EUR",
  "sortBy": "price",
  "max": 20
}
```

**Réponse :**
```json
{
  "offers": [...],
  "meta": {
    "total": 18,
    "fromAmadeus": 12,
    "fromDuffel": 8,
    "errors": []
  }
}
```

### `POST /api/flights/book`
Réservation directe (Duffel uniquement).

```json
{
  "offerId": "duffel_xxx",
  "passengers": [{ "type": "adult", "firstName": "Jean", "lastName": "Dupont", "email": "jean@example.com" }],
  "payment": { "amount": "150.00", "currency": "EUR" }
}
```

## Déploiement sur Railway

1. Push le code sur GitHub
2. Crée un projet sur [railway.app](https://railway.app)
3. Connecte le repo GitHub
4. Ajoute les variables d'environnement dans Railway
5. Le déploiement est automatique (~2 min)
6. Coût : ~5$/mois

## Prochaines étapes

- [ ] Intégrer Stripe pour les paiements
- [ ] Ajouter Redis pour le cache des résultats
- [ ] Implémenter la gestion des erreurs Amadeus (quota, timeout)
- [ ] Ajouter les alertes prix (cron job)
- [ ] Rate limiting par IP

# HiFlight Frontend

Interface React — Comparateur de vols (Amadeus + Duffel) et hôtels (Stay22).

## Installation

```bash
cd hiflight-frontend
npm install
cp .env.example .env
npm start
```

Ouvre http://localhost:3000

## Variables d'environnement

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | URL du backend (défaut: http://localhost:3001) |

## Structure

```
src/
├── components/
│   ├── Navbar.jsx        ← Navigation + dark mode
│   ├── LocationInput.jsx ← Autocomplete aéroports
│   └── FlightCard.jsx    ← Carte résultat de vol
├── pages/
│   ├── Flights.jsx       ← Page vols (recherche + résultats)
│   └── Hotels.jsx        ← Page hôtels (Stay22 MAP)
├── services/
│   └── api.js            ← Appels API backend
└── styles/
    └── global.css        ← Design system HiFlight
```

## Déploiement (Netlify)

1. Push sur GitHub
2. Connecte Netlify au repo
3. Build command: `npm run build`
4. Publish directory: `build`
5. Ajoute `REACT_APP_API_URL=https://ton-backend.railway.app` dans les variables Netlify

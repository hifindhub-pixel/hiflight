# HiFlight — Comparateur de Vols et Hôtels

## Structure
```
hiflight/
├── backend/    ← API Node.js (Duffel + Travelpayouts + Amadeus)
└── frontend/   ← React (interface utilisateur)
```

## Lancer en local
```bash
# Terminal 1 — Backend
cd backend
npm install
node index.js

# Terminal 2 — Frontend  
cd frontend
npm install
npm start
```

## Déploiement Vercel
- Backend : projet Vercel pointant sur /backend
- Frontend : projet Vercel pointant sur /frontend

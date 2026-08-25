# Activation Supabase HiFlight

1. Ouvrir le projet HiFlight dans Supabase.
2. Aller dans **SQL Editor** puis **New query**.
3. Coller tout le contenu de `migrations/20260825_hiflight_accounts.sql`.
4. Cliquer sur **Run** une seule fois.
5. Dans **Authentication > URL Configuration** :
   - Site URL : `https://www.hiflight.fr`
   - Redirect URLs : ajouter `https://www.hiflight.fr/connexion` et l’URL Vercel de prévisualisation suivie de `/connexion`.
6. Dans Vercel, ajouter `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` aux environnements Preview et Production.

La clé `service_role` ne doit jamais être placée dans Vercel sous un nom `NEXT_PUBLIC_*`, dans Snack ou dans le dépôt GitHub.

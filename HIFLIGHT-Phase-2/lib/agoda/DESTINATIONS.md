# Catalogue des destinations Agoda — prototype local

Extraction complète du fichier hôtelier français fourni par le propriétaire, le 22 octobre 2026. Le ZIP est lu jusqu'à la fin, avec validation CRC par Python. 2 879 445 lignes hôtelières lues, aucune ligne rejetée pour coordonnées de destination manquantes.

Résultat : **73 909 identifiants de destination, 221 pays et territoires**. Il s'agit des localités présentes dans ce catalogue, pas de toutes les villes du monde. La présence d'une destination ne garantit pas des chambres disponibles aux dates demandées.

- Les hôtels sont regroupés par `city_id` ; variantes de noms conservées comme alias, pays et régions utilisés pour distinguer les homonymes.
- Trois identifiants aux pays contradictoires sont exclus : 12565, 106084, 513464.
- Bangkok (9395) est conservée en Thaïlande, à partir de l'association déjà vérifiée dans le prototype. Les variantes contradictoires sont exclues.
- Le champ `state` de la source contient certaines incohérences ; il n'est pas utilisé pour rechercher des destinations. La région ne sert que dans les libellés homonymes ; les identifiants restent la référence.
- `destinations.json` reste une courte sélection pour l'accueil ; **elle ne limite plus la recherche ni l'API hôtelière**.
- `destinations-full.json` est chargé uniquement côté serveur Node, à la demande. La compilation TypeScript et le navigateur n'importent pas ces 10,8 Mo.
- `/api/agoda-destinations/?q=...` renvoie au maximum 20 propositions dès 2 caractères. Les correspondances exactes sont prioritaires ; puis les préfixes et le volume de fiches du catalogue. Ce classement n'est pas une recommandation hôtelière.
- Le client attend 200 ms après la saisie, annule les requêtes dépassées et ne sélectionne jamais une réponse d'une ancienne recherche.
- L'identifiant sélectionné est transmis à la recherche Agoda ; il n'est pas reconstitué à partir du nom.
- Les offres et tarifs proviennent toujours de l'API en direct, jamais de ce catalogue statique. Ils restent hors taxes et frais.

## Actualisation

Depuis HIFLIGHT-Phase-2 :

```sh
python scripts/import-agoda-destinations.py /chemin/vers/catalogue-FR.zip
```

Puis relancer le serveur local (index conservé en mémoire). Le script conserve les fichiers existants si la lecture ZIP/CSV échoue ou si le catalogue est anormalement petit.

Ces routes restent réservées au mode développement. Le chargement par fichier utilise le runtime Node local ; prévoir une stratégie d'hébergement/indexation adaptée avant tout déploiement Cloudflare.

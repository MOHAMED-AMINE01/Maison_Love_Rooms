# Synchronisation des calendriers Airbnb / Booking (iCal)

Ce document explique comment fonctionne la synchro anti-doublon et comment la
configurer en production.

## Principe

Airbnb et Booking ne « poussent » pas leurs réservations. Ils publient un fichier
calendrier `.ics` que notre serveur va **lire** régulièrement (pull). De notre côté
on publie aussi un `.ics` par chambre, à coller chez Airbnb/Booking, qui expose
**toute** l'occupation (réservations du site + blocages manuels + blocs importés).

Deux sens :

- **Entrant** (Airbnb/Booking → site) : `GET /api/admin/suites/:id/sync-ical` (bouton
  « Synchroniser maintenant ») ou la synchro automatique. Les périodes réservées
  deviennent des blocages `source: booking|airbnb`, visibles dans l'onglet
  Réservations (badge) et pris en compte par la disponibilité.
- **Sortant** (site → Airbnb/Booking) : `GET /api/ical/:id` — URL à coller dans
  l'extranet de chaque plateforme.

## Ce qui déclenche la synchro entrante

1. **Cron externe** (le vrai planificateur en production) → `GET /api/cron/sync-ical`.
2. **Lazy-sync à l'ouverture du back-office** → `POST /api/admin/ical/refresh`, appelé
   automatiquement quand l'admin ouvre l'onglet Réservations. Throttlé par
   `ICAL_LAZY_THROTTLE_MINUTES` (défaut 5 min) pour ne pas marteler les plateformes.
3. **Bouton manuel** « Synchroniser maintenant » dans Admin → Disponibilités.
4. **`setInterval`** : uniquement en développement local. **Ne fonctionne pas** en
   serverless (Vercel), car le process est gelé entre deux requêtes — d'où le cron.

## Configuration du cron en production

L'endpoint est protégé par `CRON_SECRET`. Deux façons de fournir le secret :

- En-tête : `Authorization: Bearer <CRON_SECRET>`
- Query : `?key=<CRON_SECRET>`

### Option A — cron-job.org (gratuit, recommandé, toutes les 5 min)

1. Créer un compte sur https://cron-job.org
2. Nouveau cronjob :
   - URL : `https://<votre-backend>/api/cron/sync-ical?key=VOTRE_CRON_SECRET`
   - Intervalle : toutes les 5 minutes
3. Sauvegarder. Vérifier que l'historique renvoie `200`.

### Option B — Vercel Cron (si backend hébergé sur Vercel)

> Attention : sur le plan **Hobby**, Vercel Cron n'autorise qu'**une exécution par
> jour**. Pour un intervalle court, préférez l'option A ou un plan Vercel Pro.

Ajouter dans `backend/vercel.json` :

```json
{
  "crons": [
    { "path": "/api/cron/sync-ical", "schedule": "*/5 * * * *" }
  ]
}
```

Définir `CRON_SECRET` dans les variables d'environnement Vercel : quand il est présent,
Vercel envoie automatiquement l'en-tête `Authorization: Bearer <CRON_SECRET>`.

## Rappel des limites (à transmettre au client)

- Le `.ics` ne contient **que les dates + la source**, jamais le nom / email /
  téléphone / montant du client. Une résa importée apparaît donc dans le BO en
  **lecture seule** (badge Booking/Airbnb), sans fiche client — c'est normal, ces
  infos restent dans l'extranet de la plateforme.
- Le délai résiduel dépend d'Airbnb/Booking eux-mêmes : Airbnb ne rafraîchit son
  `.ics` que toutes les quelques heures. On ne peut pas descendre sous ce délai
  sans la *Connectivity API* de Booking (réservée aux channel managers).

## Variables d'environnement liées

| Variable | Rôle | Défaut |
|---|---|---|
| `CRON_SECRET` | Protège `/api/cron/sync-ical` (obligatoire en prod) | — (sinon 401) |
| `ICAL_LAZY_THROTTLE_MINUTES` | Anti-martèlement du lazy-sync à l'ouverture du BO | `5` |
| `ICAL_SYNC_INTERVAL_MINUTES` | Intervalle de la synchro auto **en dev local** | `15` |

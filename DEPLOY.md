# Déploiement sur Render (gratuit) + PostgreSQL

Ce guide décrit le déploiement du site sur Render avec une base PostgreSQL. Render propose une offre gratuite au démarrage (le web service s'endort après 15 min d'inactivité ; la base PostgreSQL gratuite dure 90 jours, puis est supprimée — passer à un plan payant pour la conserver).

## Prérequis

- Un compte [Render](https://render.com) (gratuit).
- Ce dépôt GitHub connecté à Render.

## Étape 1 — Déploiement en 1 clic (Blueprint)

1. Sur Render, va dans **Dashboard → New → Blueprint**.
2. Sélectionne ce dépôt (`stevenblasi34400-web/site-Internet-Nouvel-lan-R-publicain-`).
3. Render détecte automatiquement le fichier `render.yaml` et propose de créer :
   - une base **PostgreSQL** (`stevenblasi-db`)
   - un **Web Service** Node (`stevenblasi-site`)
4. Clique sur **Apply**. Render crée les deux services et lance le build.

> La variable `DATABASE_URL` est injectée automatiquement (lien entre le web service et la base).

## Étape 2 — Migrer la base de données

Le build crée le serveur, mais la table `app_state` doit être initialisée.

**Option A (automatique) :** Ajoute une commande de migration au build.
Dans les réglages du web service sur Render, modifie le **Build Command** :

```
npm install && npm run build && npm run db:migrate
```

**Option B (manuelle, une seule fois) :** Utilise le shell de Render.

1. Render Dashboard → ton web service → **Shell**.
2. Lance :
   ```sh
   npm run db:migrate
   ```
   Tu dois voir : `✅ Base de données prête. 3 article(s), 0 livre(s).`

## Étape 3 — Vérifier

- Le web service obtient une URL publique du type `https://stevenblasi-site.onrender.com`.
- Le site public s'affiche (accueil, livres, blog, contact…).
- La console admin est accessible sur `/admin` :
  - E-mail : `stevenblasi34400@gmail.com`
  - Code : `@987654321`
- Toutes les modifications faites dans la console admin sont **persistées en base PostgreSQL** (plus de fichier JSON).

## Déploiement automatique

Render redéploie automatiquement à chaque `git push` sur `main`. La migration est idempotente (`ON CONFLICT DO NOTHING`), donc la relancer à chaque build est sans risque.

## Variables d'environnement

| Variable       | Description                 | Valeur                                    |
| -------------- | --------------------------- | ----------------------------------------- |
| `DATABASE_URL` | URL de connexion PostgreSQL | Injectée par Render (lien base → service) |
| `NODE_ENV`     | Environnement d'exécution   | `production`                              |
| `PORT`         | Port d'écoute du serveur    | Injecté par Render automatiquement        |

## Migrer vers un autre hébergeur plus tard

Le code est compatible avec n'importe quel hébergeur Node + PostgreSQL (Railway, Fly.io, Koyeb, un VPS OVH/Infomaniak…). Il suffit de :

1. Positionner `DATABASE_URL` avec l'URL de ta base PostgreSQL.
2. Lancer `npm run db:migrate` une fois.
3. Builder (`npm run build`) et démarrer (`npm start`).

Aucune modification de code n'est nécessaire.

# Steven Blasi — Site officiel

Site de l'auteur Steven Blasi : livres, actualités, engagement politique et contact. Projet construit avec TanStack Start (SSR), TanStack Router, React Query et Tailwind CSS.

## Console administrateur

Une console d'administration (`/admin`) permet de gérer l'intégralité du site sans modifier le code : articles du blog, livres, pages (accueil, à propos, parti politique, programme, contact) et réglages globaux.

Connexion réservée au super administrateur.

## Développement

Vous avez besoin de Node.js et npm — [installez-les avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

## Build et hébergement

Le serveur de production est généré par Nitro. Par défaut, le build cible un serveur Node standard (`node-server`), compatible avec n'importe quel hébergeur supportant Node.js (OVH, Infomaniak, etc.).

```sh
npm run build      # génère .output/server/index.mjs
node .output/server/index.mjs   # démarre le serveur de production
```

Le port s'adapte automatiquement à la variable d'environnement `PORT` de l'hébergeur.

Pour cibler un autre runtime, surchargez le preset Nitro via la variable d'environnement `NITRO_PRESET` (par ex. `NITRO_PRESET=bun`, `NITRO_PRESET=vercel`, etc.).

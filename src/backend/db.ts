import { Pool } from "pg";
import type {
  BlogPost,
  ManagedBook,
  PageContent,
  HomePageContent,
  PageSettings,
  AdminConfig,
} from "@/lib/content-types";

export type { BlogPost, ManagedBook, PageContent, HomePageContent, PageSettings, AdminConfig };

export interface DatabaseShape {
  posts: BlogPost[];
  books: ManagedBook[];
  aboutPage: PageContent;
  partiPage: PageContent;
  programmePage: PageContent;
  contactPage: PageContent;
  homePage: HomePageContent;
  settings: PageSettings;
  admin: AdminConfig;
}

// Super administrateur — identifiants hachés côté serveur (jamais de mot de passe en clair).
const SEED_ADMIN: AdminConfig = {
  email: "stevenblasi34400@gmail.com",
  passwordSalt: "be31501c226c25fb6bd96ccc6a5bd7c0",
  passwordHash:
    "37df1c284fc49cc69335bdcf408a6a4916a776708acb0436c42c4aebcb62e1a76ea6d0adc18dc42e9cfc1c0e3b7aad87f8d7b00e786635bbef9b1dc5ed9d3166",
};

export const SEED: DatabaseShape = {
  posts: [
    {
      slug: "bienvenue-sur-le-site",
      title: "Bienvenue sur mon nouveau site",
      date: "2026-09-01",
      category: "Annonce",
      excerpt:
        "Un espace pour réunir mes livres, mes actualités et mes engagements. Voici ce que vous y trouverez.",
      content: [
        "Ce site est né d'une envie simple : réunir au même endroit tout ce que je fais. Mes livres, bien sûr, mais aussi mes réflexions, mes événements et mon engagement politique.",
        "Vous pourrez y acheter mes ouvrages directement, en version papier ou numérique, suivre mon actualité et me contacter facilement.",
        "Merci de votre fidélité de lecteurs — c'est elle qui rend tout cela possible.",
      ],
    },
    {
      slug: "ecrire-et-s-engager",
      title: "Écrire et s'engager : pourquoi les deux vont ensemble",
      date: "2026-09-05",
      category: "Réflexion",
      excerpt:
        "L'écriture et l'engagement politique partagent la même racine : la conviction que les idées peuvent changer les choses.",
      content: [
        "On me demande souvent pourquoi un écrivain se lance en politique. Pour moi, la réponse tient en une phrase : écrire, c'est déjà s'engager.",
        "Un livre propose une vision du monde. Un mouvement politique cherche à la mettre en œuvre. Les deux démarches se nourrissent l'une de l'autre.",
        "C'est cette continuité que j'ai voulu rendre visible sur ce site, avec une section entièrement dédiée au mouvement.",
      ],
    },
    {
      slug: "rencontres-et-dedicaces",
      title: "Rencontres et dédicaces : à vos agendas",
      date: "2026-09-10",
      category: "Événements",
      excerpt:
        "Librairies, salons du livre, débats publics — retrouvez ici les prochaines occasions de se rencontrer.",
      content: [
        "Rien ne remplace la rencontre directe avec les lecteurs. Les prochains mois seront riches en événements : salons du livre, séances de dédicaces et débats publics.",
        "Les dates précises seront annoncées ici et dans la newsletter — pensez à vous inscrire pour ne rien manquer.",
        "Vous organisez un événement et souhaitez m'inviter ? La page contact est à vous.",
      ],
    },
  ],
  books: [],
  aboutPage: {
    id: "a-propos",
    title: "Steven Blasi",
    intro:
      "Écrivain, essayiste et homme engagé. Depuis mes premiers textes, je poursuis une même conviction : les mots peuvent déplacer les lignes. Mes livres explorent la société telle qu'elle est — et telle qu'elle pourrait être.",
    body: [
      "Cette page raconte bientôt mon histoire complète : mes débuts, mes rencontres, mes livres et ce qui m'a conduit à fonder un mouvement politique.",
      "En attendant, explorez ma bibliographie et mes actualités — et n'hésitez pas à m'écrire.",
    ],
  },
  partiPage: {
    id: "parti-politique",
    title: "Pourquoi ce mouvement ?",
    intro:
      "Parce que l'écriture pose des questions, mais que seule l'action collective y répond. Ce mouvement est né d'une conviction simple : la politique redevient utile quand elle part du terrain, des commerces, des écoles, des villages.",
    body: [
      "Le nom officiel du parti, son histoire et ses textes fondateurs seront publiés ici prochainement — cette section est en cours de rédaction avec l'équipe.",
    ],
  },
  programmePage: {
    id: "parti-politique/programme",
    title: "Le programme",
    intro:
      "Six grandes orientations guident notre action. Le programme détaillé, mesure par mesure, sera publié ici — voici déjà les fondations.",
    body: [
      "Éducation & jeunesse : remettre l'école au centre.",
      "Santé & solidarité : un accès aux soins garanti partout.",
      "Économie locale : soutenir commerces, artisans et territoires ruraux.",
      "Transition écologique : une écologie pragmatique qui crée de l'emploi local.",
      "Sécurité & justice : restaurer l'autorité de l'État avec une justice équitable.",
      "Démocratie & transparence : des élus redevables et des citoyens consultés.",
    ],
  },
  contactPage: {
    id: "contact",
    title: "Écrivons-nous",
    intro:
      "Une invitation en librairie, une demande d'interview, un salon du livre, une question sur le mouvement politique ou simplement un mot de lecteur ? Ce formulaire est le meilleur moyen de me joindre.",
    body: [],
  },
  homePage: {
    heroKicker: "Écrivain · Essayiste · Homme engagé",
    heroTitle: "Des livres qui dérangent, des idées qui rassemblent.",
    heroText:
      "Bienvenue sur mon site officiel. Retrouvez tous mes ouvrages — en version papier ou numérique —, suivez mon actualité, et découvrez le mouvement politique que je porte.",
    heroCtaPrimaryLabel: "Découvrir mes livres",
    heroCtaPrimaryTo: "/livres",
    heroCtaSecondaryLabel: "Mon engagement politique",
    heroCtaSecondaryTo: "/parti-politique",
    movementKicker: "Engagement",
    movementTitle: "Au-delà des livres : un mouvement",
    movementText:
      "Écrire ne suffit pas. J'ai fondé un mouvement politique pour porter les idées qui me tiennent à cœur et agir concrètement, avec celles et ceux qui veulent changer les choses.",
    newsletterKicker: "Restons en contact",
    newsletterTitle: "Recevez mes nouveautés avant tout le monde",
    newsletterText: "Nouveaux livres, extraits exclusifs, dédicaces et actualités du mouvement.",
  },
  settings: {
    siteTitle: "Steven Blasi",
    siteTagline: "Écrivain & homme engagé",
    contactEmail: "stevenblasi34400@gmail.com",
    footerText:
      "Écrivain et homme engagé. Romans, essais et actualités — ainsi qu'un mouvement politique pour porter les idées plus loin.",
  },
  admin: SEED_ADMIN,
};

// Connexion PostgreSQL — réutilisée (pool) pour toute la durée de vie du serveur.
// La variable DATABASE_URL est fournie par l'hébergeur (Render, Railway, etc.).
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL n'est pas défini. Configurez la variable d'environnement DATABASE_URL (URL PostgreSQL).",
      );
    }
    pool = new Pool({
      connectionString,
      // Render / Neon / Supabase utilisent ssl ; on l'active par défaut en production.
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
      max: 5,
    });
  }
  return pool;
}

const STATE_KEY = "main";

export async function loadDb(): Promise<DatabaseShape> {
  const client = await getPool().connect();
  try {
    const res = await client.query("SELECT data FROM app_state WHERE key = $1", [STATE_KEY]);
    if (res.rows.length > 0) {
      const stored = res.rows[0].data as Partial<DatabaseShape>;
      // Fusionne avec le seed pour backfill les champs ajoutés ultérieurement,
      // et force l'admin seed (identifiants gérés côté code, jamais éditables via la console).
      return { ...SEED, ...stored, admin: SEED_ADMIN };
    }
    // Première exécution : on persiste le seed.
    await client.query(
      "INSERT INTO app_state (key, data) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
      [STATE_KEY, SEED],
    );
    return SEED;
  } finally {
    client.release();
  }
}

export async function writeDb(next: DatabaseShape): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query(
      `INSERT INTO app_state (key, data) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [STATE_KEY, { ...next, admin: SEED_ADMIN }],
    );
  } finally {
    client.release();
  }
}

export async function updateDb(
  mutator: (db: DatabaseShape) => DatabaseShape | Promise<DatabaseShape>,
): Promise<DatabaseShape> {
  const current = await loadDb();
  const next = await mutator(structuredClone(current));
  await writeDb(next);
  return next;
}

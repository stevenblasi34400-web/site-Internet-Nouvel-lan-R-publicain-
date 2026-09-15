export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string[];
}

// Articles d'exemple — dites-moi vos vraies actualités et je remplace.
export const BLOG_POSTS: BlogPost[] = [
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
];

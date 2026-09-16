export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string[];
}

export interface ManagedBook {
  id: string;
  title: string;
  author: string;
  handle: string;
  price: string;
  currency: string;
  description: string;
  coverUrl: string;
  buyUrl: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export interface PageContent {
  id: string;
  title: string;
  intro: string;
  body: string[];
}

export interface HomePageContent {
  heroKicker: string;
  heroTitle: string;
  heroText: string;
  heroCtaPrimaryLabel: string;
  heroCtaPrimaryTo: string;
  heroCtaSecondaryLabel: string;
  heroCtaSecondaryTo: string;
  movementKicker: string;
  movementTitle: string;
  movementText: string;
  newsletterKicker: string;
  newsletterTitle: string;
  newsletterText: string;
}

export interface PageSettings {
  siteTitle: string;
  siteTagline: string;
  contactEmail: string;
  footerText: string;
}

export interface AdminConfig {
  email: string;
  passwordSalt: string;
  passwordHash: string;
}

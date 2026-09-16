import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { issueSession, clearSessionCookie, verifyCredentials, getSession } from "./session";
import { authMiddleware } from "./auth-middleware";
import { loadDb, updateDb } from "./db";
import type {
  BlogPost,
  ManagedBook,
  PageContent,
  HomePageContent,
  PageSettings,
} from "@/lib/content-types";

/* ----------------------------- Auth (public) ----------------------------- */

export const login = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
      code: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const ok = await verifyCredentials(data.email, data.code);
    if (!ok) {
      throw new Error("Identifiants incorrects. Vérifiez votre e-mail et votre code.");
    }
    await issueSession();
    return { ok: true };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  clearSessionCookie();
  return { ok: true };
});

export const me = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSession();
  return { isAuthenticated: session.isAuthenticated };
});

/* --------------------------- Public read helpers --------------------------- */
// Ces fonctions sont en lecture seule et non protégées : elles alimentent le
// site public. Les contenus reviennent depuis le store (avec fallback géré côté db).

export const getPublicPosts = createServerFn({ method: "GET" }).handler(async () => {
  const db = await loadDb();
  return db.posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
});

export const getPublicPost = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const db = await loadDb();
    return db.posts.find((p) => p.slug === data.slug) ?? null;
  });

export const getPublicBooks = createServerFn({ method: "GET" }).handler(async () => {
  const db = await loadDb();
  return db.books.filter((b) => b.published);
});

export const getPublicBook = createServerFn({ method: "GET" })
  .validator(z.object({ handle: z.string() }))
  .handler(async ({ data }) => {
    const db = await loadDb();
    return db.books.find((b) => b.handle === data.handle && b.published) ?? null;
  });

export const getPublicPage = createServerFn({ method: "GET" })
  .validator(z.object({ key: z.string() }))
  .handler(async ({ data }) => {
    const db = await loadDb();
    switch (data.key) {
      case "a-propos":
        return db.aboutPage;
      case "parti-politique":
        return db.partiPage;
      case "parti-politique/programme":
        return db.programmePage;
      case "contact":
        return db.contactPage;
      case "home":
        return db.homePage;
      default:
        return null;
    }
  });

export const getPublicSettings = createServerFn({ method: "GET" }).handler(async () => {
  const db = await loadDb();
  return db.settings;
});

/* ----------------------------- Admin (protected) ----------------------------- */

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const ensureUniqueSlug = (posts: BlogPost[], base: string, ignore?: string): string => {
  let slug = base || "article";
  let i = 1;
  while (posts.some((p) => p.slug === slug && p.slug !== ignore)) {
    slug = `${base}-${i++}`;
  }
  return slug;
};

const ensureUniqueHandle = (books: ManagedBook[], base: string, ignore?: string): string => {
  let handle = base || "livre";
  let i = 1;
  while (books.some((b) => b.handle === handle && b.handle !== ignore)) {
    handle = `${base}-${i++}`;
  }
  return handle;
};

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/* ---- Posts ---- */

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const db = await loadDb();
    return db.posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  });

export const adminGetPost = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const db = await loadDb();
    return db.posts.find((p) => p.slug === data.slug) ?? null;
  });

const postSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1),
  date: z.string().min(1),
  category: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.array(z.string()).min(1),
});

export const adminSavePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(postSchema)
  .handler(async ({ data }) => {
    const updated = await updateDb((db) => {
      const existingSlug = data.slug;
      const idx = db.posts.findIndex((p) => p.slug === existingSlug);
      if (idx === -1) {
        const slug = ensureUniqueSlug(db.posts, slugify(data.title));
        db.posts.push({ ...data, slug });
      } else {
        db.posts[idx] = { ...data, slug: existingSlug! };
      }
      return db;
    });
    return { ok: true, posts: updated.posts };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const updated = await updateDb((db) => {
      db.posts = db.posts.filter((p) => p.slug !== data.slug);
      return db;
    });
    return { ok: true, posts: updated.posts };
  });

/* ---- Books ---- */

export const adminListBooks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const db = await loadDb();
    return db.books;
  });

export const adminGetBook = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const db = await loadDb();
    return db.books.find((b) => b.id === data.id) ?? null;
  });

const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  author: z.string().default("Steven Blasi"),
  handle: z.string().optional(),
  price: z.string().default("0"),
  currency: z.string().default("EUR"),
  description: z.string().default(""),
  coverUrl: z.string().default(""),
  buyUrl: z.string().default(""),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const adminSaveBook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(bookSchema)
  .handler(async ({ data }) => {
    const updated = await updateDb((db) => {
      if (data.id) {
        const idx = db.books.findIndex((b) => b.id === data.id);
        if (idx !== -1) {
          const existing = db.books[idx]!;
          db.books[idx] = {
            ...existing,
            ...data,
            id: data.id,
            handle: existing.handle,
          };
          return db;
        }
      }
      const handle = ensureUniqueHandle(db.books, slugify(data.title));
      db.books.push({
        id: newId(),
        ...data,
        handle,
        createdAt: new Date().toISOString(),
      });
      return db;
    });
    return { ok: true, books: updated.books };
  });

export const adminDeleteBook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const updated = await updateDb((db) => {
      db.books = db.books.filter((b) => b.id !== data.id);
      return db;
    });
    return { ok: true, books: updated.books };
  });

/* ---- Pages (editable) ---- */

const pageSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  intro: z.string().default(""),
  body: z.array(z.string()).default([]),
});

export const adminSavePage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(pageSchema)
  .handler(async ({ data }) => {
    const updated = await updateDb((db) => {
      const page: PageContent = {
        id: data.id,
        title: data.title,
        intro: data.intro,
        body: data.body,
      };
      switch (data.id) {
        case "a-propos":
          db.aboutPage = page;
          break;
        case "parti-politique":
          db.partiPage = page;
          break;
        case "parti-politique/programme":
          db.programmePage = page;
          break;
        case "contact":
          db.contactPage = page;
          break;
      }
      return db;
    });
    return { ok: true };
  });

const homeSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroText: z.string(),
  heroCtaPrimaryLabel: z.string(),
  heroCtaPrimaryTo: z.string(),
  heroCtaSecondaryLabel: z.string(),
  heroCtaSecondaryTo: z.string(),
  movementKicker: z.string(),
  movementTitle: z.string(),
  movementText: z.string(),
  newsletterKicker: z.string(),
  newsletterTitle: z.string(),
  newsletterText: z.string(),
});

export const adminSaveHomePage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(homeSchema)
  .handler(async ({ data }) => {
    await updateDb((db) => {
      db.homePage = data as HomePageContent;
      return db;
    });
    return { ok: true };
  });

/* ---- Settings ---- */

const settingsSchema = z.object({
  siteTitle: z.string(),
  siteTagline: z.string(),
  contactEmail: z.string().email(),
  footerText: z.string(),
});

export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(settingsSchema)
  .handler(async ({ data }) => {
    await updateDb((db) => {
      db.settings = data as PageSettings;
      return db;
    });
    return { ok: true };
  });

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const db = await loadDb();
    return db.settings;
  });

export const adminGetHomePage = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const db = await loadDb();
    return db.homePage;
  });

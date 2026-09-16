import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Landmark, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { fetchProducts } from "@/lib/shopify";
import { BLOG_POSTS } from "@/data/posts";
import { useHomePage } from "@/hooks/useContent";
import authorImg from "@/assets/author.jpg";
import partiImg from "@/assets/parti.jpg";

const FALLBACK_HOME = {
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
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Steven Blasi — Écrivain : livres, actualités et engagement" },
      {
        name: "description",
        content:
          "Découvrez les livres de Steven Blasi, ses actualités, et son mouvement politique. Achetez ses ouvrages en ligne, papier ou numérique.",
      },
      {
        property: "og:title",
        content: "Steven Blasi — Écrivain : livres, actualités et engagement",
      },
      {
        property: "og:description",
        content:
          "Découvrez les livres de Steven Blasi, ses actualités, et son mouvement politique.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: products } = useQuery({
    queryKey: ["shopify-products"],
    queryFn: () => fetchProducts(20),
    staleTime: 60_000,
  });
  const home = useHomePage(FALLBACK_HOME).data ?? FALLBACK_HOME;
  const featured = products?.slice(0, 3) ?? [];
  const posts = BLOG_POSTS.slice(0, 2);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 80% 20%, oklch(0.79 0.14 75 / 14%) 0%, transparent 70%)",
          }}
        />
        <div className="container-site grid items-center gap-12 py-20 md:grid-cols-[1.2fr_1fr] md:py-28">
          <div>
            <p className="kicker animate-rise">{home.heroKicker}</p>
            <h1 className="heading-hero animate-rise-1 mt-5 text-5xl md:text-7xl">
              {home.heroTitle}
            </h1>
            <p className="animate-rise-2 mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {home.heroText}
            </p>
            <div className="animate-rise-3 mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={home.heroCtaPrimaryTo}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  {home.heroCtaPrimaryLabel}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={home.heroCtaSecondaryTo}>
                  <Landmark className="mr-2 h-4 w-4" />
                  {home.heroCtaSecondaryLabel}
                </Link>
              </Button>
            </div>
          </div>
          <div className="animate-rise-2 relative">
            <div className="overflow-hidden rounded-2xl border shadow-2xl">
              <img
                src={authorImg}
                alt="Steven Blasi à son bureau d'écriture"
                width={896}
                height={1152}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-xl border bg-card px-5 py-4 shadow-xl">
              <p className="font-display text-2xl font-bold text-primary">Steven Blasi</p>
              <p className="text-xs text-muted-foreground">Auteur &amp; fondateur de mouvement</p>
            </div>
          </div>
        </div>
      </section>

      {/* LIVRES */}
      <section className="border-t bg-card/30">
        <div className="container-site py-16 md:py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="kicker">Bibliographie</p>
              <h2 className="heading-hero mt-3 text-3xl md:text-4xl">Mes livres</h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/livres" className="link-underline">
                Tout voir <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                La bibliothèque est en cours de remplissage — les livres arrivent très bientôt.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PARTI POLITIQUE */}
      <section className="relative overflow-hidden border-t">
        <img
          src={partiImg}
          alt="Réunion publique du mouvement sur une place de village"
          loading="lazy"
          width={1536}
          height={768}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, var(--color-background) 20%, transparent 80%)",
          }}
        />
        <div className="container-site relative py-20 md:py-28">
          <div className="max-w-xl">
            <p className="kicker">{home.movementKicker}</p>
            <h2 className="heading-hero mt-3 text-3xl md:text-5xl">{home.movementTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {home.movementText}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/parti-politique">Découvrir le mouvement</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/parti-politique/rejoindre">Nous rejoindre</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      <section className="border-t bg-card/30">
        <div className="container-site py-16 md:py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="kicker">Journal</p>
              <h2 className="heading-hero mt-3 text-3xl md:text-4xl">Dernières actualités</h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/blog" className="link-underline">
                Toutes les actualités <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="card-hover group rounded-xl border bg-card p-6"
              >
                <p className="kicker">{post.category}</p>
                <h3 className="font-display mt-3 text-2xl leading-snug transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                  <PenLine className="h-4 w-4" /> Lire l'article
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-t">
        <div className="container-site py-16 text-center md:py-20">
          <p className="kicker">{home.newsletterKicker}</p>
          <h2 className="heading-hero mx-auto mt-3 max-w-2xl text-3xl md:text-4xl">
            {home.newsletterTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">{home.newsletterText}</p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}

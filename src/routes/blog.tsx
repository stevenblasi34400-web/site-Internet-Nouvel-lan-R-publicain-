import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, PenLine } from "lucide-react";
import { BLOG_POSTS } from "@/data/posts";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Actualités & blog — Steven Blasi" },
      { name: "description", content: "Toute l'actualité de Steven Blasi : sorties de livres, événements, dédicaces et réflexions." },
      { property: "og:title", content: "Actualités & blog — Steven Blasi" },
      { property: "og:description", content: "Sorties de livres, événements, dédicaces et réflexions de Steven Blasi." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BlogPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function BlogPage() {
  return (
    <div className="container-site py-14 md:py-20">
      <p className="kicker">Journal</p>
      <h1 className="heading-hero mt-3 text-4xl md:text-6xl">Actualités &amp; blog</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Sorties de livres, événements, coulisses d'écriture et réflexions.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="card-hover group flex flex-col rounded-xl border bg-card p-6"
          >
            <p className="kicker">{post.category}</p>
            <h2 className="font-display mt-3 text-2xl leading-snug transition-colors group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-primary">
                <PenLine className="h-4 w-4" /> Lire
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

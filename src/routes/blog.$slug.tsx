import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { BLOG_POSTS } from "@/data/posts";
import { NewsletterForm } from "@/components/NewsletterForm";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Steven Blasi` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: `${loaderData.post.title} — Steven Blasi` },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Article introuvable — Steven Blasi" }, { name: "robots", content: "noindex" }],
  }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  return (
    <div className="container-site max-w-3xl py-14 md:py-20">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Toutes les actualités
      </Link>

      <article className="mt-8">
        <p className="kicker">{post.category}</p>
        <h1 className="heading-hero mt-3 text-4xl text-balance md:text-5xl">{post.title}</h1>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {new Date(post.date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="mt-10 space-y-6">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-lg leading-relaxed text-muted-foreground first:text-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <div className="mt-16 rounded-2xl border bg-card p-8 text-center">
        <h2 className="font-display text-2xl font-bold">Ne manquez rien</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Recevez les prochains articles et les sorties de livres par e-mail.
        </p>
        <div className="mt-6">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Home, Newspaper, Plus, Settings } from "lucide-react";
import { adminListPosts, adminListBooks, adminGetSettings } from "@/backend/admin.functions";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/admin-utils";

export const Route = createFileRoute("/_admin/admin/")({
  component: DashboardPage,
});

export function DashboardPage() {
  const posts = useQuery({ queryKey: ["admin-posts"], queryFn: () => adminListPosts() });
  const books = useQuery({ queryKey: ["admin-books"], queryFn: () => adminListBooks() });
  const settings = useQuery({ queryKey: ["admin-settings"], queryFn: () => adminGetSettings() });

  const stats = [
    {
      label: "Articles",
      value: posts.data?.length ?? "…",
      icon: Newspaper,
      to: "/admin/articles",
    },
    {
      label: "Livres",
      value: books.data?.length ?? "…",
      icon: BookOpen,
      to: "/admin/livres",
    },
    {
      label: "Pages",
      value: "5",
      icon: FileText,
      to: "/admin/pages",
    },
  ];

  const recentPosts = (posts.data ?? []).slice(0, 4);

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Console</p>
          <h1 className="heading-hero mt-2 text-3xl md:text-4xl">Tableau de bord</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gérez l'intégralité de votre site sans toucher au code.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/articles/nouveau">
            <Plus className="mr-2 h-4 w-4" /> Nouvel article
          </Link>
        </Button>
      </header>

      <section className="grid gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card-hover rounded-xl border bg-card p-6">
            <s.icon className="h-6 w-6 text-primary" />
            <p className="font-display mt-4 text-4xl font-bold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Derniers articles</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/articles">Tout voir</Link>
            </Button>
          </div>
          {posts.isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun article pour le moment.</p>
          ) : (
            <ul className="divide-y">
              {recentPosts.map((p) => (
                <li key={p.slug} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(p.date)} · {p.category}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/admin/articles/$slug/edit" params={{ slug: p.slug }}>
                      Modifier
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 font-display text-xl font-bold">Accès rapides</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickLink to="/admin/livres" icon={BookOpen} label="Gérer les livres" />
            <QuickLink to="/admin/pages" icon={FileText} label="Modifier les pages" />
            <QuickLink to="/admin/accueil" icon={Home} label="Page d'accueil" />
            <QuickLink to="/admin/reglages" icon={Settings} label="Réglages du site" />
          </div>
          {settings.data && (
            <div className="mt-6 rounded-lg border bg-background/40 p-4">
              <p className="text-xs text-muted-foreground">Site</p>
              <p className="font-display text-lg font-bold">{settings.data.siteTitle}</p>
              <p className="text-sm text-muted-foreground">{settings.data.siteTagline}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: typeof BookOpen;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="card-hover flex items-center gap-3 rounded-lg border bg-background/40 p-4"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

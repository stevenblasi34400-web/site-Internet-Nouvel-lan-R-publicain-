import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminListPosts, adminDeletePost } from "@/backend/admin.functions";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/admin-utils";

export const Route = createFileRoute("/_admin/admin/articles/")({
  component: PostsPage,
});

export function PostsPage() {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => adminListPosts(),
  });

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Supprimer l'article « ${title} » ? Cette action est irréversible.`)) return;
    try {
      await adminDeletePost({ data: { slug } });
      await queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      await queryClient.invalidateQueries({ queryKey: ["public-posts"] });
      toast.success("Article supprimé.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de la suppression.");
    }
  };

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Contenu</p>
          <h1 className="heading-hero mt-2 text-3xl md:text-4xl">Articles</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Les actualités affichées sur la page « Actualités & blog ».
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/articles/nouveau">
            <Plus className="mr-2 h-4 w-4" /> Nouvel article
          </Link>
        </Button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-16 text-center">
          <Newspaper className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="font-display text-2xl">Aucun article</h2>
          <p className="mt-3 text-muted-foreground">Commencez par créer votre premier article.</p>
          <Button asChild className="mt-6">
            <Link to="/admin/articles/nouveau">
              <Plus className="mr-2 h-4 w-4" /> Créer un article
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead className="bg-card/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Titre</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Catégorie</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Date</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((p) => (
                <tr key={p.slug} className="bg-card/20 transition-colors hover:bg-card/40">
                  <td className="px-5 py-4">
                    <p className="font-medium">{p.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{p.excerpt}</p>
                  </td>
                  <td className="hidden px-5 py-4 text-sm sm:table-cell">{p.category}</td>
                  <td className="hidden px-5 py-4 text-sm md:table-cell">{formatDate(p.date)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon">
                        <Link
                          to="/admin/articles/$slug/edit"
                          params={{ slug: p.slug }}
                          aria-label="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(p.slug, p.title)}
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

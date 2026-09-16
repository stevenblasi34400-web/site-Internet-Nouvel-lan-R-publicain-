import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminListBooks, adminDeleteBook } from "@/backend/admin.functions";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/admin-utils";

export const Route = createFileRoute("/_admin/admin/livres/")({
  component: BooksPage,
});

export function BooksPage() {
  const queryClient = useQueryClient();
  const { data: books, isLoading } = useQuery({
    queryKey: ["admin-books"],
    queryFn: () => adminListBooks(),
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer le livre « ${title} » ? Cette action est irréversible.`)) return;
    try {
      await adminDeleteBook({ data: { id } });
      await queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      await queryClient.invalidateQueries({ queryKey: ["public-books"] });
      toast.success("Livre supprimé.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de la suppression.");
    }
  };

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Bibliographie</p>
          <h1 className="heading-hero mt-2 text-3xl md:text-4xl">Livres</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Les ouvrages affichés dans « Mes livres ». Ajoutez, modifiez ou supprimez vos livres
            ici.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/livres/nouveau">
            <Plus className="mr-2 h-4 w-4" /> Nouveau livre
          </Link>
        </Button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !books || books.length === 0 ? (
        <div className="rounded-xl border border-dashed p-16 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="font-display text-2xl">Aucun livre</h2>
          <p className="mt-3 text-muted-foreground">
            Ajoutez votre premier livre pour qu'il apparaisse sur le site.
          </p>
          <Button asChild className="mt-6">
            <Link to="/admin/livres/nouveau">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un livre
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((b) => (
            <article key={b.id} className="flex flex-col overflow-hidden rounded-xl border bg-card">
              <div className="aspect-[3/4] w-full overflow-hidden bg-secondary/30">
                {b.coverUrl ? (
                  <img
                    src={b.coverUrl}
                    alt={b.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center">
                    <span className="font-display text-lg text-muted-foreground">{b.title}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg leading-snug">{b.title}</h3>
                  {b.featured && (
                    <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      À la une
                    </span>
                  )}
                </div>
                {b.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
                )}
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span className="font-display font-semibold text-primary">
                    {formatPrice(b.price, b.currency)}
                  </span>
                  {!b.published && (
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Brouillon
                    </span>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-end gap-1 pt-3">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/admin/livres/$id/edit" params={{ id: b.id }}>
                      <Pencil className="mr-2 h-4 w-4" /> Modifier
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(b.id, b.title)}
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

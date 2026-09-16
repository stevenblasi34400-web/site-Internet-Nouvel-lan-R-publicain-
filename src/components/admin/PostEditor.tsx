import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminGetPost, adminSavePost } from "@/backend/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { today } from "@/lib/admin-utils";

export function PostEditor({ slug }: { slug?: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(slug);

  const existing = useQuery({
    queryKey: ["admin-post", slug],
    queryFn: () => adminGetPost({ data: { slug: slug! } }),
    enabled: isEdit,
  });

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today());
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing.data) {
      setTitle(existing.data.title);
      setDate(existing.data.date);
      setCategory(existing.data.category);
      setExcerpt(existing.data.excerpt);
      setContent(existing.data.content.length ? existing.data.content : [""]);
    }
  }, [existing.data]);

  const setParagraph = (i: number, value: string) => {
    setContent((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  };
  const addParagraph = () => setContent((prev) => [...prev, ""]);
  const removeParagraph = (i: number) =>
    setContent((prev) => (prev.length === 1 ? [""] : prev.filter((_, idx) => idx !== i)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !excerpt.trim()) {
      toast.error("Le titre, la catégorie et l'extrait sont obligatoires.");
      return;
    }
    const cleanContent = content.map((p) => p.trim()).filter(Boolean);
    if (cleanContent.length === 0) {
      toast.error("Ajoutez au moins un paragraphe.");
      return;
    }
    setSaving(true);
    try {
      await adminSavePost({
        data: {
          slug,
          title: title.trim(),
          date,
          category: category.trim(),
          excerpt: excerpt.trim(),
          content: cleanContent,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      await queryClient.invalidateQueries({ queryKey: ["public-posts"] });
      toast.success(isEdit ? "Article mis à jour." : "Article créé.");
      void navigate({ to: "/admin/articles" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => void navigate({ to: "/admin/articles" })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux articles
      </Button>

      <header className="mb-8">
        <p className="kicker">{isEdit ? "Modifier" : "Nouveau"}</p>
        <h1 className="heading-hero mt-2 text-3xl md:text-4xl">
          {isEdit ? "Modifier l'article" : "Nouvel article"}
        </h1>
      </header>

      <div className="space-y-6 rounded-xl border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Input
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Annonce, Réflexion, Événement…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Extrait *</Label>
          <Textarea
            id="excerpt"
            required
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Court résumé affiché dans la liste des articles."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Contenu (un paragraphe par bloc)</Label>
            <Button type="button" variant="outline" size="sm" onClick={addParagraph}>
              <Plus className="mr-2 h-4 w-4" /> Paragraphe
            </Button>
          </div>
          {content.map((para, i) => (
            <div key={i} className="flex gap-2">
              <Textarea
                rows={3}
                value={para}
                onChange={(e) => setParagraph(i, e.target.value)}
                placeholder={`Paragraphe ${i + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 self-start text-muted-foreground hover:text-destructive"
                onClick={() => removeParagraph(i)}
                aria-label="Supprimer le paragraphe"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => void navigate({ to: "/admin/articles" })}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement…
            </>
          ) : isEdit ? (
            "Enregistrer"
          ) : (
            "Publier"
          )}
        </Button>
      </div>
    </form>
  );
}

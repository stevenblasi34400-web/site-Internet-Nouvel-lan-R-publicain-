import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getPublicPage, adminSavePage } from "@/backend/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PAGE_META: Record<string, { label: string; description: string }> = {
  "a-propos": {
    label: "À propos",
    description: "Page de présentation de l'auteur.",
  },
  "parti-politique": {
    label: "Le mouvement",
    description: "Page d'introduction du mouvement politique.",
  },
  "parti-politique/programme": {
    label: "Programme",
    description: "Le programme politique du mouvement.",
  },
  contact: {
    label: "Contact",
    description: "Page de contact (texte d'introduction).",
  },
};

export function PageEditor({ pageId }: { pageId: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const meta = PAGE_META[pageId]!;

  const page = useQuery({
    queryKey: ["public-page", pageId],
    queryFn: () => getPublicPage({ data: { key: pageId } }),
  });

  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [body, setBody] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (page.data && !loaded) {
    setTitle(page.data.title);
    setIntro(page.data.intro);
    setBody(page.data.body.length ? page.data.body : [""]);
    setLoaded(true);
  }

  const setLine = (i: number, value: string) =>
    setBody((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  const addLine = () => setBody((prev) => [...prev, ""]);
  const removeLine = (i: number) =>
    setBody((prev) => (prev.length === 1 ? [""] : prev.filter((_, idx) => idx !== i)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le titre est obligatoire.");
      return;
    }
    setSaving(true);
    try {
      await adminSavePage({
        data: {
          id: pageId,
          title: title.trim(),
          intro: intro.trim(),
          body: body.map((p) => p.trim()).filter(Boolean),
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["public-page", pageId] });
      toast.success("Page enregistrée.");
      void navigate({ to: "/admin/pages" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (page.isLoading) {
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
        onClick={() => void navigate({ to: "/admin/pages" })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux pages
      </Button>

      <header className="mb-8">
        <p className="kicker">Page</p>
        <h1 className="heading-hero mt-2 text-3xl md:text-4xl">{meta.label}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{meta.description}</p>
      </header>

      <div className="space-y-6 rounded-xl border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="intro">Introduction</Label>
          <Textarea
            id="intro"
            rows={4}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="Texte d'introduction de la page."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Paragraphes</Label>
            <Button type="button" variant="outline" size="sm" onClick={addLine}>
              <Plus className="mr-2 h-4 w-4" /> Paragraphe
            </Button>
          </div>
          {body.map((line, i) => (
            <div key={i} className="flex gap-2">
              <Textarea
                rows={3}
                value={line}
                onChange={(e) => setLine(i, e.target.value)}
                placeholder={`Paragraphe ${i + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 self-start text-muted-foreground hover:text-destructive"
                onClick={() => removeLine(i)}
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
          onClick={() => void navigate({ to: "/admin/pages" })}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement…
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </div>
    </form>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminGetBook, adminSaveBook } from "@/backend/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function BookEditor({ id }: { id?: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const existing = useQuery({
    queryKey: ["admin-book", id],
    queryFn: () => adminGetBook({ data: { id: id! } }),
    enabled: isEdit,
  });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Steven Blasi");
  const [price, setPrice] = useState("0");
  const [currency, setCurrency] = useState("EUR");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [buyUrl, setBuyUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing.data) {
      setTitle(existing.data.title);
      setAuthor(existing.data.author);
      setPrice(existing.data.price);
      setCurrency(existing.data.currency);
      setDescription(existing.data.description);
      setCoverUrl(existing.data.coverUrl);
      setBuyUrl(existing.data.buyUrl);
      setFeatured(existing.data.featured);
      setPublished(existing.data.published);
    }
  }, [existing.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le titre est obligatoire.");
      return;
    }
    setSaving(true);
    try {
      await adminSaveBook({
        data: {
          id,
          title: title.trim(),
          author: author.trim() || "Steven Blasi",
          handle: undefined,
          price: price.trim() || "0",
          currency: currency.trim() || "EUR",
          description: description.trim(),
          coverUrl: coverUrl.trim(),
          buyUrl: buyUrl.trim(),
          featured,
          published,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      await queryClient.invalidateQueries({ queryKey: ["public-books"] });
      toast.success(isEdit ? "Livre mis à jour." : "Livre créé.");
      void navigate({ to: "/admin/livres" });
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
        onClick={() => void navigate({ to: "/admin/livres" })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux livres
      </Button>

      <header className="mb-8">
        <p className="kicker">{isEdit ? "Modifier" : "Nouveau"}</p>
        <h1 className="heading-hero mt-2 text-3xl md:text-4xl">
          {isEdit ? "Modifier le livre" : "Nouveau livre"}
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
            placeholder="Titre de l'ouvrage"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="author">Auteur</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Steven Blasi"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverUrl">URL de la couverture</Label>
            <Input
              id="coverUrl"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://…/couverture.jpg"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Prix</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="19.90"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Devise</Label>
            <Input
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="EUR"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Résumé ou présentation de l'ouvrage."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buyUrl">Lien d'achat externe (optionnel)</Label>
          <Input
            id="buyUrl"
            type="url"
            value={buyUrl}
            onChange={(e) => setBuyUrl(e.target.value)}
            placeholder="https://… (libraire, Shopify, etc.)"
          />
          <p className="text-xs text-muted-foreground">
            Si renseigné, le bouton « Acheter » pointera vers ce lien. Sinon, un bouton « Ajouter au
            panier » est affiché (panier local de démonstration).
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border bg-background/40 p-4">
            <div>
              <Label htmlFor="featured" className="cursor-pointer">
                À la une
              </Label>
              <p className="text-xs text-muted-foreground">Mise en avant sur la page d'accueil.</p>
            </div>
            <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background/40 p-4">
            <div>
              <Label htmlFor="published" className="cursor-pointer">
                Publié
              </Label>
              <p className="text-xs text-muted-foreground">Visible sur le site public.</p>
            </div>
            <Switch id="published" checked={published} onCheckedChange={setPublished} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => void navigate({ to: "/admin/livres" })}
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

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminGetHomePage, adminSaveHomePage } from "@/backend/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_admin/admin/accueil")({
  component: HomePageEditor,
});

export function HomePageEditor() {
  const queryClient = useQueryClient();
  const home = useQuery({ queryKey: ["admin-home"], queryFn: () => adminGetHomePage() });

  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (home.data && !loaded) {
    setForm({
      heroKicker: home.data.heroKicker,
      heroTitle: home.data.heroTitle,
      heroText: home.data.heroText,
      heroCtaPrimaryLabel: home.data.heroCtaPrimaryLabel,
      heroCtaPrimaryTo: home.data.heroCtaPrimaryTo,
      heroCtaSecondaryLabel: home.data.heroCtaSecondaryLabel,
      heroCtaSecondaryTo: home.data.heroCtaSecondaryTo,
      movementKicker: home.data.movementKicker,
      movementTitle: home.data.movementTitle,
      movementText: home.data.movementText,
      newsletterKicker: home.data.newsletterKicker,
      newsletterTitle: home.data.newsletterTitle,
      newsletterText: home.data.newsletterText,
    });
    setLoaded(true);
  }

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminSaveHomePage({ data: form as never });
      await queryClient.invalidateQueries({ queryKey: ["public-page", "home"] });
      toast.success("Page d'accueil enregistrée.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (home.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <header className="mb-8">
        <p className="kicker">Page d'accueil</p>
        <h1 className="heading-hero mt-2 text-3xl md:text-4xl">Page d'accueil</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Modifiez les textes mis en avant sur la page d'accueil.
        </p>
      </header>

      <section className="space-y-5 rounded-xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Section hero</h2>
        <Field label="Sur-titre" value={form.heroKicker} onChange={(v) => set("heroKicker", v)} />
        <Field
          label="Titre"
          value={form.heroTitle}
          onChange={(v) => set("heroTitle", v)}
          textarea
        />
        <Field label="Texte" value={form.heroText} onChange={(v) => set("heroText", v)} textarea />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Bouton principal — libellé"
            value={form.heroCtaPrimaryLabel}
            onChange={(v) => set("heroCtaPrimaryLabel", v)}
          />
          <Field
            label="Bouton principal — lien"
            value={form.heroCtaPrimaryTo}
            onChange={(v) => set("heroCtaPrimaryTo", v)}
          />
          <Field
            label="Bouton secondaire — libellé"
            value={form.heroCtaSecondaryLabel}
            onChange={(v) => set("heroCtaSecondaryLabel", v)}
          />
          <Field
            label="Bouton secondaire — lien"
            value={form.heroCtaSecondaryTo}
            onChange={(v) => set("heroCtaSecondaryTo", v)}
          />
        </div>
      </section>

      <section className="mt-6 space-y-5 rounded-xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Section mouvement</h2>
        <Field
          label="Sur-titre"
          value={form.movementKicker}
          onChange={(v) => set("movementKicker", v)}
        />
        <Field label="Titre" value={form.movementTitle} onChange={(v) => set("movementTitle", v)} />
        <Field
          label="Texte"
          value={form.movementText}
          onChange={(v) => set("movementText", v)}
          textarea
        />
      </section>

      <section className="mt-6 space-y-5 rounded-xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Section newsletter</h2>
        <Field
          label="Sur-titre"
          value={form.newsletterKicker}
          onChange={(v) => set("newsletterKicker", v)}
        />
        <Field
          label="Titre"
          value={form.newsletterTitle}
          onChange={(v) => set("newsletterTitle", v)}
        />
        <Field
          label="Texte"
          value={form.newsletterText}
          onChange={(v) => set("newsletterText", v)}
          textarea
        />
      </section>

      <div className="mt-6 flex justify-end">
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

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {textarea ? (
        <Textarea rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

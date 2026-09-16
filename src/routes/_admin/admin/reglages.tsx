import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminGetSettings, adminSaveSettings } from "@/backend/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_admin/admin/reglages")({
  component: SettingsPage,
});

export function SettingsPage() {
  const queryClient = useQueryClient();
  const settings = useQuery({ queryKey: ["admin-settings"], queryFn: () => adminGetSettings() });

  const [siteTitle, setSiteTitle] = useState("");
  const [siteTagline, setSiteTagline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [footerText, setFooterText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (settings.data && !loaded) {
    setSiteTitle(settings.data.siteTitle);
    setSiteTagline(settings.data.siteTagline);
    setContactEmail(settings.data.contactEmail);
    setFooterText(settings.data.footerText);
    setLoaded(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminSaveSettings({
        data: { siteTitle, siteTagline, contactEmail, footerText },
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      await queryClient.invalidateQueries({ queryKey: ["public-settings"] });
      toast.success("Réglages enregistrés.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (settings.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <header className="mb-8">
        <p className="kicker">Configuration</p>
        <h1 className="heading-hero mt-2 text-3xl md:text-4xl">Réglages du site</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Informations globales affichées dans l'en-tête et le pied de page.
        </p>
      </header>

      <div className="space-y-6 rounded-xl border bg-card p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="siteTitle">Nom du site</Label>
            <Input
              id="siteTitle"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteTagline">Slogan</Label>
            <Input
              id="siteTagline"
              value={siteTagline}
              onChange={(e) => setSiteTagline(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">E-mail de contact</Label>
          <Input
            id="contactEmail"
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="footerText">Texte du pied de page</Label>
          <Textarea
            id="footerText"
            rows={3}
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
          />
        </div>
      </div>

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

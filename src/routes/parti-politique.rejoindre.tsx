import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/parti-politique/rejoindre")({
  head: () => ({
    meta: [
      { title: "Rejoindre le mouvement — Steven Blasi" },
      {
        name: "description",
        content:
          "Adhérez au mouvement politique de Steven Blasi : participez aux réunions, aux débats et à la construction du programme.",
      },
      { property: "og:title", content: "Rejoindre le mouvement — Steven Blasi" },
      {
        property: "og:description",
        content: "Adhérez au mouvement et participez à la construction du programme.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RejoindrePage,
});

function RejoindrePage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: connecter le stockage des adhésions
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    (e.target as HTMLFormElement).reset();
    toast.success("Merci pour votre adhésion ! Nous revenons vers vous très vite.");
  };

  return (
    <div className="container-site py-14 md:py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="heading-hero text-3xl md:text-4xl">Nous rejoindre</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Un mouvement n'est rien sans celles et ceux qui le font vivre. En adhérant, vous
            participez aux réunions, aux débats et à l'écriture du programme.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Participer aux réunions publiques près de chez vous",
              "Contribuer aux groupes de travail thématiques",
              "Recevoir la lettre interne du mouvement",
              "Être consulté sur les grandes orientations",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-6 md:p-8">
          <h3 className="font-display text-xl font-semibold">Formulaire d'adhésion</h3>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" name="firstName" required className="bg-background/60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" name="lastName" required className="bg-background/60" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required className="bg-background/60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville / commune</Label>
              <Input id="city" name="city" required className="bg-background/60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivation">Votre motivation (facultatif)</Label>
              <Textarea id="motivation" name="motivation" rows={4} className="bg-background/60" />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Envoyer ma demande d'adhésion
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

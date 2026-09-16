import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FileText, Home, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_admin/admin/pages/")({
  component: PagesPage,
});

const PAGES = [
  {
    id: "a-propos",
    label: "À propos",
    description: "Présentation de l'auteur, parcours et style.",
    editTo: "/admin/pages/a-propos",
    viewTo: "/a-propos",
    icon: FileText,
  },
  {
    id: "parti-politique",
    label: "Le mouvement",
    description: "Introduction du mouvement politique.",
    editTo: "/admin/pages/parti-politique",
    viewTo: "/parti-politique",
    icon: BookOpen,
  },
  {
    id: "parti-politique/programme",
    label: "Programme",
    description: "Le programme politique détaillé.",
    editTo: "/admin/pages/parti-politique/programme",
    viewTo: "/parti-politique/programme",
    icon: FileText,
  },
  {
    id: "contact",
    label: "Contact",
    description: "Texte d'introduction de la page contact.",
    editTo: "/admin/pages/contact",
    viewTo: "/contact",
    icon: FileText,
  },
  {
    id: "home",
    label: "Page d'accueil",
    description: "Le hero, la section mouvement et la newsletter.",
    editTo: "/admin/accueil",
    viewTo: "/",
    icon: Home,
  },
] as const;

export function PagesPage() {
  return (
    <div>
      <header className="mb-8">
        <p className="kicker">Contenu</p>
        <h1 className="heading-hero mt-2 text-3xl md:text-4xl">Pages</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Modifiez le texte des pages fixes de votre site sans toucher au code.
        </p>
      </header>

      <div className="grid gap-5">
        {PAGES.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-6"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                <p.icon className="h-5 w-5 text-primary" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold">{p.label}</h2>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to={p.viewTo}>Voir</Link>
              </Button>
              <Button asChild size="sm">
                <Link to={p.editTo}>
                  <Pencil className="mr-2 h-4 w-4" /> Modifier
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Users, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentPage } from "@/hooks/useContent";

const FALLBACK = {
  id: "parti-politique",
  title: "Pourquoi ce mouvement ?",
  intro:
    "Parce que l'écriture pose des questions, mais que seule l'action collective y répond. Ce mouvement est né d'une conviction simple : la politique redevient utile quand elle part du terrain, des commerces, des écoles, des villages.",
  body: [
    "Le nom officiel du parti, son histoire et ses textes fondateurs seront publiés ici prochainement — cette section est en cours de rédaction avec l'équipe.",
  ],
};

export const Route = createFileRoute("/parti-politique/")({
  head: () => ({
    meta: [
      { title: "Le mouvement politique — Steven Blasi" },
      {
        name: "description",
        content:
          "Découvrez le mouvement politique fondé par Steven Blasi : valeurs, programme et comment nous rejoindre.",
      },
      { property: "og:title", content: "Le mouvement politique — Steven Blasi" },
      {
        property: "og:description",
        content: "Valeurs, programme et engagement du mouvement fondé par Steven Blasi.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PartiHomePage,
});

function PartiHomePage() {
  const page = useContentPage("parti-politique", FALLBACK).data ?? FALLBACK;

  return (
    <div className="container-site py-14 md:py-20">
      <div className="max-w-3xl">
        <h2 className="heading-hero text-3xl md:text-4xl">{page.title}</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{page.intro}</p>
        {page.body.length > 0 && (
          <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
            {page.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card-hover rounded-xl border bg-card p-6">
          <Compass className="h-7 w-7 text-primary" />
          <h3 className="font-display mt-4 text-xl font-semibold">Nos valeurs</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Proximité, honnêteté, travail et responsabilité. Des principes avant des slogans.
          </p>
        </div>
        <div className="card-hover rounded-xl border bg-card p-6">
          <Megaphone className="h-7 w-7 text-primary" />
          <h3 className="font-display mt-4 text-xl font-semibold">Notre méthode</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Écouter d'abord, proposer ensuite. Des réunions publiques régulières sur tout le
            territoire.
          </p>
        </div>
        <div className="card-hover rounded-xl border bg-card p-6">
          <Users className="h-7 w-7 text-primary" />
          <h3 className="font-display mt-4 text-xl font-semibold">Notre force</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Des adhérents et des sympathisants engagés, issus de tous les horizons.
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/parti-politique/programme">
            Lire le programme <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/parti-politique/rejoindre">Rejoindre le mouvement</Link>
        </Button>
      </div>
    </div>
  );
}

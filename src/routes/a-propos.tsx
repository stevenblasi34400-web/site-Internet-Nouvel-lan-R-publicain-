import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Feather, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import authorImg from "@/assets/author.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos de Steven Blasi — Écrivain" },
      { name: "description", content: "Qui est Steven Blasi ? Parcours, bibliographie et engagement de l'écrivain." },
      { property: "og:title", content: "À propos de Steven Blasi — Écrivain" },
      { property: "og:description", content: "Parcours, bibliographie et engagement de l'écrivain Steven Blasi." },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container-site py-14 md:py-20">
      <div className="grid items-start gap-12 md:grid-cols-[1fr_1.4fr]">
        <div className="overflow-hidden rounded-2xl border shadow-2xl md:sticky md:top-24">
          <img
            src={authorImg}
            alt="Portrait de Steven Blasi dans sa bibliothèque"
            width={896}
            height={1152}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="kicker">À propos</p>
          <h1 className="heading-hero mt-3 text-4xl md:text-6xl">Steven Blasi</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Écrivain, essayiste et homme engagé. Depuis mes premiers textes, je poursuis
            une même conviction : les mots peuvent déplacer les lignes. Mes livres explorent
            la société telle qu'elle est — et telle qu'elle pourrait être.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <div className="card-hover rounded-xl border bg-card p-5">
              <BookOpen className="h-6 w-6 text-primary" />
              <p className="font-display mt-3 text-lg font-semibold">L'écriture</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Romans et essais, entre récit et réflexion.
              </p>
            </div>
            <div className="card-hover rounded-xl border bg-card p-5">
              <Feather className="h-6 w-6 text-primary" />
              <p className="font-display mt-3 text-lg font-semibold">Le style</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Une écriture directe, exigeante et accessible.
              </p>
            </div>
            <div className="card-hover rounded-xl border bg-card p-5">
              <Landmark className="h-6 w-6 text-primary" />
              <p className="font-display mt-3 text-lg font-semibold">L'engagement</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Un mouvement politique pour passer des idées à l'action.
              </p>
            </div>
          </div>

          <h2 className="font-display mt-12 text-2xl font-bold">Le parcours</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Cette page raconte bientôt mon histoire complète : mes débuts, mes rencontres,
            mes livres et ce qui m'a conduit à fonder un mouvement politique. En attendant,
            explorez ma bibliographie et mes actualités — et n'hésitez pas à m'écrire.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/livres">
                Voir mes livres <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Me contacter</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, HeartHandshake, Leaf, ShieldCheck, Store, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/parti-politique/programme")({
  head: () => ({
    meta: [
      { title: "Programme du mouvement — Steven Blasi" },
      { name: "description", content: "Le programme du mouvement politique de Steven Blasi : éducation, santé, économie locale, transition écologique et démocratie." },
      { property: "og:title", content: "Programme du mouvement — Steven Blasi" },
      { property: "og:description", content: "Éducation, santé, économie locale, écologie et démocratie : les grandes orientations du mouvement." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ProgrammePage,
});

const AXES = [
  {
    icon: GraduationCap,
    title: "Éducation & jeunesse",
    text: "Remettre l'école au centre : plus de moyens, plus de transmission, plus d'ambition pour chaque jeune.",
  },
  {
    icon: HeartHandshake,
    title: "Santé & solidarité",
    text: "Un accès aux soins garanti partout, et une solidarité concrète avec les plus fragiles.",
  },
  {
    icon: Store,
    title: "Économie locale",
    text: "Soutenir les commerces, les artisans et les territoires ruraux plutôt que les seules métropoles.",
  },
  {
    icon: Leaf,
    title: "Transition écologique",
    text: "Une écologie pragmatique, qui protège sans punir, et qui crée de l'emploi local.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité & justice",
    text: "Restaurer l'autorité de l'État tout en garantissant une justice équitable et rapide.",
  },
  {
    icon: Landmark,
    title: "Démocratie & transparence",
    text: "Des élus redevables, des finances publiques lisibles, et des citoyens réellement consultés.",
  },
];

function ProgrammePage() {
  return (
    <div className="container-site py-14 md:py-20">
      <div className="max-w-3xl">
        <h2 className="heading-hero text-3xl md:text-4xl">Le programme</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Six grandes orientations guident notre action. Le programme détaillé, mesure par
          mesure, sera publié ici — voici déjà les fondations.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AXES.map((axe) => (
          <div key={axe.title} className="card-hover rounded-xl border bg-card p-6">
            <axe.icon className="h-7 w-7 text-primary" />
            <h3 className="font-display mt-4 text-xl font-semibold">{axe.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{axe.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border bg-card p-8 text-center">
        <h3 className="font-display text-2xl font-bold">Ce programme vous parle ?</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Il s'enrichit avec celles et ceux qui nous rejoignent. Votre voix compte.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/parti-politique/rejoindre">Rejoindre le mouvement</Link>
        </Button>
      </div>
    </div>
  );
}

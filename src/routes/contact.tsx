import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, CalendarDays } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Steven Blasi" },
      { name: "description", content: "Contactez Steven Blasi : dédicaces, interviews, invitations en librairie, presse et mouvement politique." },
      { property: "og:title", content: "Contact — Steven Blasi" },
      { property: "og:description", content: "Contactez Steven Blasi : dédicaces, interviews, presse et mouvement politique." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="container-site py-14 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="kicker">Contact</p>
          <h1 className="heading-hero mt-3 text-4xl md:text-5xl">Écrivons-nous</h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Une invitation en librairie, une demande d'interview, un salon du livre,
            une question sur le mouvement politique ou simplement un mot de lecteur ?
            Ce formulaire est le meilleur moyen de me joindre.
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border bg-card">
                <Mail className="h-5 w-5 text-primary" />
              </span>
              <div>
                <p className="font-medium">Presse &amp; interviews</p>
                <p className="text-sm text-muted-foreground">Réponse sous 48 h en général.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border bg-card">
                <CalendarDays className="h-5 w-5 text-primary" />
              </span>
              <div>
                <p className="font-medium">Événements &amp; dédicaces</p>
                <p className="text-sm text-muted-foreground">Salons, librairies, débats publics.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border bg-card">
                <MapPin className="h-5 w-5 text-primary" />
              </span>
              <div>
                <p className="font-medium">Basé en France</p>
                <p className="text-sm text-muted-foreground">Déplacements possibles partout en francophonie.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

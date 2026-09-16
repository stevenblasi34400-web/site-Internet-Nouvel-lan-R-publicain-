import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getPublicSettings } from "@/backend/admin.functions";
import type { PageSettings } from "@/lib/content-types";

const FALLBACK_SETTINGS: PageSettings = {
  siteTitle: "Steven Blasi",
  siteTagline: "Écrivain & homme engagé",
  contactEmail: "stevenblasi34400@gmail.com",
  footerText:
    "Écrivain et homme engagé. Romans, essais et actualités — ainsi qu'un mouvement politique pour porter les idées plus loin.",
};

export function Footer() {
  const settings =
    useQuery<PageSettings>({
      queryKey: ["public-settings"],
      queryFn: () => getPublicSettings(),
      staleTime: 60_000,
      initialData: FALLBACK_SETTINGS,
    }).data ?? FALLBACK_SETTINGS;

  // Keep the stylized split (first name + last name) if the title is two words.
  const parts = settings.siteTitle.split(" ");
  const first = parts[0] ?? "Steven";
  const rest = parts.slice(1).join(" ") || "Blasi";

  return (
    <footer className="border-t bg-card/40">
      <div className="container-site grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">
            {first} <span className="text-primary">{rest}</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {settings.footerText}
          </p>
        </div>

        <nav aria-label="Liens de pied de page">
          <p className="kicker mb-4">Explorer</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/livres"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Tous les livres
              </Link>
            </li>
            <li>
              <Link
                to="/a-propos"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                À propos de l'auteur
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Actualités &amp; blog
              </Link>
            </li>
            <li>
              <Link
                to="/parti-politique"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Le mouvement politique
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="kicker mb-4">Newsletter</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Nouveautés, extraits et événements — directement dans votre boîte mail.
          </p>
          <NewsletterForm compact />
        </div>
      </div>
      <div className="border-t">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.siteTitle}. Tous droits réservés.
          </p>
          <p>Paiements sécurisés via Shopify.</p>
        </div>
      </div>
    </footer>
  );
}

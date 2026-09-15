import { Link } from "@tanstack/react-router";
import { NewsletterForm } from "@/components/NewsletterForm";

export function Footer() {
  return (
    <footer className="border-t bg-card/40">
      <div className="container-site grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">
            Steven <span className="text-primary">Blasi</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Écrivain et homme engagé. Romans, essais et actualités — ainsi qu'un
            mouvement politique pour porter les idées plus loin.
          </p>
        </div>

        <nav aria-label="Liens de pied de page">
          <p className="kicker mb-4">Explorer</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/livres" className="text-muted-foreground transition-colors hover:text-primary">Tous les livres</Link></li>
            <li><Link to="/a-propos" className="text-muted-foreground transition-colors hover:text-primary">À propos de l'auteur</Link></li>
            <li><Link to="/blog" className="text-muted-foreground transition-colors hover:text-primary">Actualités &amp; blog</Link></li>
            <li><Link to="/parti-politique" className="text-muted-foreground transition-colors hover:text-primary">Le mouvement politique</Link></li>
            <li><Link to="/contact" className="text-muted-foreground transition-colors hover:text-primary">Contact</Link></li>
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
          <p>© {new Date().getFullYear()} Steven Blasi. Tous droits réservés.</p>
          <p>Paiements sécurisés via Shopify.</p>
        </div>
      </div>
    </footer>
  );
}

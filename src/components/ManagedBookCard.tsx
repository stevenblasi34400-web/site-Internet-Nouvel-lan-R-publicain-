import { Link } from "@tanstack/react-router";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/admin-utils";
import type { ManagedBook } from "@/lib/content-types";

export function ManagedBookCard({ book }: { book: ManagedBook }) {
  return (
    <article className="card-hover group flex flex-col overflow-hidden rounded-xl border bg-card">
      <Link to="/livre/$handle" params={{ handle: book.handle }} className="block overflow-hidden">
        <div className="aspect-[3/4] w-full overflow-hidden bg-secondary/30">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <span className="font-display text-lg text-muted-foreground">{book.title}</span>
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Link to="/livre/$handle" params={{ handle: book.handle }}>
          <h3 className="font-display text-lg leading-snug transition-colors group-hover:text-primary">
            {book.title}
          </h3>
        </Link>
        {book.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{book.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-semibold text-primary">
            {Number(book.price) > 0 ? formatPrice(book.price, book.currency) : "—"}
          </span>
          {book.buyUrl ? (
            <Button asChild size="sm" variant="outline">
              <a href={book.buyUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Acheter
              </a>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/livre/$handle" params={{ handle: book.handle }}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Voir
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

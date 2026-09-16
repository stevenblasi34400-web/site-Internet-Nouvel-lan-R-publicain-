import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ManagedBookCard } from "@/components/ManagedBookCard";
import { fetchProducts } from "@/lib/shopify";
import { getPublicBooks } from "@/backend/admin.functions";
import type { ManagedBook } from "@/lib/content-types";

export const Route = createFileRoute("/livres")({
  head: () => ({
    meta: [
      { title: "Tous les livres — Steven Blasi" },
      {
        name: "description",
        content:
          "La bibliographie complète de Steven Blasi : romans et essais disponibles en version papier et numérique, à commander en ligne.",
      },
      { property: "og:title", content: "Tous les livres — Steven Blasi" },
      {
        property: "og:description",
        content: "La bibliographie complète de Steven Blasi, à commander en ligne.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LivresPage,
});

function LivresPage() {
  const managed = useQuery<ManagedBook[]>({
    queryKey: ["public-books"],
    queryFn: () => getPublicBooks(),
    staleTime: 60_000,
  });
  const shopify = useQuery({
    queryKey: ["shopify-products"],
    queryFn: () => fetchProducts(50),
    staleTime: 60_000,
    // Only fetch Shopify if no managed books yet (kept as legacy fallback).
    enabled: !managed.data || managed.data.length === 0,
  });

  const managedBooks = managed.data ?? [];
  const showShopifyFallback = managedBooks.length === 0;

  return (
    <div className="container-site py-14 md:py-20">
      <p className="kicker">Bibliographie</p>
      <h1 className="heading-hero mt-3 text-4xl md:text-6xl">Tous mes livres</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Chaque ouvrage est disponible à la commande directement ici, en version papier ou numérique.
      </p>

      <div className="mt-12">
        {managed.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : managedBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {managedBooks.map((b) => (
              <ManagedBookCard key={b.id} book={b} />
            ))}
          </div>
        ) : showShopifyFallback && shopify.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : showShopifyFallback && shopify.data && shopify.data.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shopify.data.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-16 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="font-display text-2xl">Aucun livre pour le moment</h2>
            <p className="mt-3 text-muted-foreground">
              La bibliothèque est en préparation — les ouvrages seront disponibles très bientôt.
              Inscrivez-vous à la newsletter pour être prévenu des sorties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

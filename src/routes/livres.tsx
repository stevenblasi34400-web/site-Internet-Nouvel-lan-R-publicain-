import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/shopify";

export const Route = createFileRoute("/livres")({
  head: () => ({
    meta: [
      { title: "Tous les livres — Steven Blasi" },
      { name: "description", content: "La bibliographie complète de Steven Blasi : romans et essais disponibles en version papier et numérique, à commander en ligne." },
      { property: "og:title", content: "Tous les livres — Steven Blasi" },
      { property: "og:description", content: "La bibliographie complète de Steven Blasi, à commander en ligne." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LivresPage,
});

function LivresPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["shopify-products"],
    queryFn: () => fetchProducts(50),
    staleTime: 60_000,
  });

  return (
    <div className="container-site py-14 md:py-20">
      <p className="kicker">Bibliographie</p>
      <h1 className="heading-hero mt-3 text-4xl md:text-6xl">Tous mes livres</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Chaque ouvrage est disponible à la commande directement ici, en version papier
        ou numérique. Paiement sécurisé via Shopify.
      </p>

      <div className="mt-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-16 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="font-display text-2xl">Aucun livre pour le moment</h2>
            <p className="mt-3 text-muted-foreground">
              La boutique est en préparation — les ouvrages seront disponibles très bientôt.
              Inscrivez-vous à la newsletter pour être prévenu des sorties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

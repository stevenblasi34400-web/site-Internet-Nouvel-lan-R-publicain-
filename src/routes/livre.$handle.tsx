import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ExternalLink, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle, formatPrice } from "@/lib/shopify";
import { getPublicBook } from "@/backend/admin.functions";
import { useCartStore } from "@/stores/cartStore";
import type { ManagedBook } from "@/lib/content-types";

export const Route = createFileRoute("/livre/$handle")({
  loader: async ({ params }) => {
    // Try the managed store first.
    try {
      const managed = await getPublicBook({ data: { handle: params.handle } });
      if (managed) return { managed };
    } catch {
      // ignore and fall through to Shopify
    }
    return { managed: null };
  },
  head: ({ params, loaderData }) => {
    const title = loaderData?.managed?.title ?? "Livre";
    return {
      meta: [
        { title: `${title} — Steven Blasi` },
        {
          name: "description",
          content: `Découvrez « ${title} » de Steven Blasi et commandez-le en ligne.`,
        },
        { property: "og:title", content: `${title} — Steven Blasi` },
        {
          property: "og:description",
          content: "Découvrez cet ouvrage de Steven Blasi et commandez-le en ligne.",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: LivreDetailPage,
});

function LivreDetailPage() {
  const { handle } = Route.useParams();
  const { managed } = Route.useLoaderData();

  if (managed) {
    return <ManagedBookDetail book={managed} />;
  }
  return <ShopifyBookDetail handle={handle} />;
}

/* ----------------------------- Managed book ----------------------------- */

function ManagedBookDetail({ book }: { book: ManagedBook }) {
  return (
    <div className="container-site py-12 md:py-16">
      <Link
        to="/livres"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux livres
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-card">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center p-10 text-center">
              <span className="font-display text-3xl">{book.title}</span>
            </div>
          )}
        </div>

        <div>
          <p className="kicker">Ouvrage</p>
          <h1 className="heading-hero mt-3 text-4xl md:text-5xl">{book.title}</h1>
          {Number(book.price) > 0 && (
            <p className="mt-4 font-display text-3xl font-semibold text-primary">
              {formatPrice(book.price, book.currency)}
            </p>
          )}

          {book.description && (
            <p className="mt-6 leading-relaxed text-muted-foreground">{book.description}</p>
          )}

          {book.buyUrl && (
            <Button asChild size="lg" className="mt-8 w-full sm:w-auto">
              <a href={book.buyUrl} target="_blank" rel="noreferrer">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Acheter cet ouvrage
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Ouvrage géré depuis la console administrateur.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Shopify book ------------------------------ */

function ShopifyBookDetail({ handle }: { handle: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartLoading = useCartStore((s) => s.isLoading);
  const [variantId, setVariantId] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    throw notFound();
  }

  const images = product.images.edges;
  const variants = product.variants.edges.map((e) => e.node);
  const selected = variants.find((v) => v.id === variantId) ?? variants[0];

  const handleAdd = async () => {
    if (!selected) return;
    await addItem({
      product: { node: product },
      variantId: selected.id,
      variantTitle: selected.title,
      price: selected.price,
      quantity: 1,
      selectedOptions: selected.selectedOptions || [],
    });
    toast.success(`« ${product.title} » ajouté au panier`);
  };

  return (
    <div className="container-site py-12 md:py-16">
      <Link
        to="/livres"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux livres
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-card">
          {images[0]?.node ? (
            <img
              src={images[0].node.url}
              alt={images[0].node.altText || product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center p-10 text-center">
              <span className="font-display text-3xl">{product.title}</span>
            </div>
          )}
        </div>

        <div>
          <p className="kicker">Ouvrage</p>
          <h1 className="heading-hero mt-3 text-4xl md:text-5xl">{product.title}</h1>
          <p className="mt-4 font-display text-3xl font-semibold text-primary">
            {selected && formatPrice(selected.price.amount, selected.price.currencyCode)}
          </p>

          {product.description && (
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          {variants.length > 1 && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium">Format</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <Button
                    key={v.id}
                    variant={selected?.id === v.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVariantId(v.id)}
                  >
                    {v.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="mt-8 w-full sm:w-auto"
            onClick={handleAdd}
            disabled={cartLoading || !selected?.availableForSale}
          >
            {cartLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            {selected?.availableForSale ? "Ajouter au panier" : "Indisponible"}
          </Button>

          <p className="mt-4 text-xs text-muted-foreground">
            Paiement sécurisé via Shopify. Livraison pour les formats papier, téléchargement
            immédiat pour les formats numériques.
          </p>
        </div>
      </div>
    </div>
  );
}

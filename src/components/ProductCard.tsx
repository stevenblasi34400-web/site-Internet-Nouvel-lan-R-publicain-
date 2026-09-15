import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const image = product.node.images.edges[0]?.node;
  const selectedVariant = product.node.variants.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    const item: Omit<CartItem, "lineId"> = {
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    };
    await addItem(item);
    toast.success(`« ${product.node.title} » ajouté au panier`);
  };

  return (
    <article className="card-hover group flex flex-col overflow-hidden rounded-xl border bg-card">
      <Link
        to="/livre/$handle"
        params={{ handle: product.node.handle }}
        className="block overflow-hidden"
      >
        <div className="aspect-[3/4] w-full overflow-hidden bg-secondary/30">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.node.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <span className="font-display text-lg text-muted-foreground">
                {product.node.title}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Link to="/livre/$handle" params={{ handle: product.node.handle }}>
          <h3 className="font-display text-lg leading-snug transition-colors group-hover:text-primary">
            {product.node.title}
          </h3>
        </Link>
        {product.node.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.node.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-semibold text-primary">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isLoading || !selectedVariant?.availableForSale}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : selectedVariant?.availableForSale ? (
              "Ajouter"
            ) : (
              "Épuisé"
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}

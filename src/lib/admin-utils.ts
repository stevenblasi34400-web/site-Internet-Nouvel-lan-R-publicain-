export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatPrice(amount: string, currencyCode: string): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return amount;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode || "EUR",
  }).format(value);
}

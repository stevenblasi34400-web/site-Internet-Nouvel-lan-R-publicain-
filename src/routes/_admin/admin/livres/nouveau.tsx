import { createFileRoute } from "@tanstack/react-router";
import { BookEditor } from "@/components/admin/BookEditor";

export const Route = createFileRoute("/_admin/admin/livres/nouveau")({
  component: NewBookPage,
});

export function NewBookPage() {
  return <BookEditor />;
}

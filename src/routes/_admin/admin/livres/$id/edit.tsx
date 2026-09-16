import { createFileRoute } from "@tanstack/react-router";
import { BookEditor } from "@/components/admin/BookEditor";

export const Route = createFileRoute("/_admin/admin/livres/$id/edit")({
  component: EditBookPage,
});

export function EditBookPage() {
  const { id } = Route.useParams();
  return <BookEditor id={id} />;
}

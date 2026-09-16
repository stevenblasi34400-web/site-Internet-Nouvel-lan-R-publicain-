import { createFileRoute } from "@tanstack/react-router";
import { PageEditor } from "@/components/admin/PageEditor";

export const Route = createFileRoute("/_admin/admin/pages/$pageId")({
  component: EditPage,
  validateSearch: () => ({}),
});

export function EditPage() {
  const { pageId } = Route.useParams();
  return <PageEditor pageId={pageId} />;
}

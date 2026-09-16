import { createFileRoute } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/PostEditor";

export const Route = createFileRoute("/_admin/admin/articles/$slug/edit")({
  component: EditPostPage,
});

export function EditPostPage() {
  const { slug } = Route.useParams();
  return <PostEditor slug={slug} />;
}

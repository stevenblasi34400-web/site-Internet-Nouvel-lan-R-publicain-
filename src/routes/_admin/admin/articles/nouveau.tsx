import { createFileRoute } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/PostEditor";

export const Route = createFileRoute("/_admin/admin/articles/nouveau")({
  component: NewPostPage,
});

export function NewPostPage() {
  return <PostEditor />;
}

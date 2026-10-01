import { createFileRoute } from "@tanstack/react-router";
import AdminProjectEditor from "@/pages/admin/AdminProjectEditor";

export const Route = createFileRoute("/admin/projects/$id/edit")({
  component: AdminProjectEditor,
});

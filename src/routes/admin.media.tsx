import { createFileRoute } from "@tanstack/react-router";
import AdminMedia from "@/pages/admin/AdminMedia";

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
});

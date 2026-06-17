import { createFileRoute } from "@tanstack/react-router";
import AdminContent from "@/pages/admin/AdminContent";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

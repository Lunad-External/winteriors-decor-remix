import { createFileRoute } from "@tanstack/react-router";
import AdminPages from "@/pages/admin/AdminPages";

export const Route = createFileRoute("/admin/pages")({
  component: AdminPages,
});

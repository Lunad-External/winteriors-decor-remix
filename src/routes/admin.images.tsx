import { createFileRoute } from "@tanstack/react-router";
import AdminImages from "@/pages/admin/AdminImages";

export const Route = createFileRoute("/admin/images")({
  component: AdminImages,
});

import { createFileRoute } from "@tanstack/react-router";
import AdminDocuments from "@/pages/admin/AdminDocuments";

export const Route = createFileRoute("/admin/documents")({
  component: AdminDocuments,
});

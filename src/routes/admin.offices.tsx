import { createFileRoute } from "@tanstack/react-router";
import AdminOffices from "@/pages/admin/AdminOffices";

export const Route = createFileRoute("/admin/offices")({
  component: AdminOffices,
});

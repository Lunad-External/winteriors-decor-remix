import { createFileRoute } from "@tanstack/react-router";
import AdminTeam from "@/pages/admin/AdminTeam";

export const Route = createFileRoute("/admin/team")({
  component: AdminTeam,
});

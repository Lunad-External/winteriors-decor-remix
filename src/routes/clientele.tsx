import { createFileRoute } from "@tanstack/react-router";
import Clientele from "@/pages/Clientele";

export const Route = createFileRoute("/clientele")({
  component: Clientele,
});

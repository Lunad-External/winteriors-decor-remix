import { createFileRoute } from "@tanstack/react-router";
import ServiceCategory from "@/pages/ServiceCategory";

export const Route = createFileRoute("/services/$categorySlug")({
  component: ServiceCategory,
});

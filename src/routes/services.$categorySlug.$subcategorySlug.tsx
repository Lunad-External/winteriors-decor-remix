import { createFileRoute } from "@tanstack/react-router";
import ServiceSubcategory from "@/pages/ServiceSubcategory";

export const Route = createFileRoute("/services/$categorySlug/$subcategorySlug")({
  component: ServiceSubcategory,
});

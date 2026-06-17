import { createFileRoute } from "@tanstack/react-router";
import Enquiry from "@/pages/Enquiry";

export const Route = createFileRoute("/enquiry")({
  component: Enquiry,
});

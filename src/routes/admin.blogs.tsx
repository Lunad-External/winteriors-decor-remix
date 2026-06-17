import { createFileRoute } from "@tanstack/react-router";
import AdminBlogs from "@/pages/admin/AdminBlogs";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogs,
});

import { AdminLayout } from "@/components/admin/AdminLayout";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export default function AdminBlogs() {
  return (
    <AdminLayout>
      <SimpleCrud
        table="blogs"
        title="Blog Posts"
        description="Manage the blog articles shown at /blogs."
        titleField="title"
        orderBy={{ column: "display_order", ascending: true }}
        columns={[
          {
            key: "image_url",
            label: "",
            className: "w-16",
            render: (r) =>
              r.image_url ? <img src={r.image_url} alt="" className="w-12 h-9 object-cover rounded" /> : null,
          },
          { key: "title", label: "Title" },
          { key: "published_date", label: "Date", className: "w-32" },
          {
            key: "is_published",
            label: "Live",
            className: "w-20",
            render: (r) => (r.is_published ? "✓" : "—"),
          },
        ]}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true, helpText: "URL fragment, e.g. my-post-title" },
          { name: "excerpt", label: "Excerpt", type: "textarea" },
          { name: "content", label: "Content (Markdown)", type: "richtext" },
          { name: "image_url", label: "Cover image URL", type: "image", helpText: "Used as thumbnail on /blogs. If empty, first slider image is used." },
          { name: "slider_images", label: "Slider images", type: "images", helpText: "Shown as a slider at the top of the blog page." },
          { name: "keywords", label: "Keywords", type: "tags", helpText: "Comma-separated. Shown as pills below the slider." },
          { name: "external_url", label: "External URL", type: "text" },
          { name: "published_date", label: "Published date", type: "text", placeholder: "YYYY-MM-DD" },
          { name: "display_order", label: "Display order", type: "number" },
          { name: "is_published", label: "Published", type: "boolean" },
        ]}
      />
    </AdminLayout>
  );
}

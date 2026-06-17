import { AdminLayout } from "@/components/admin/AdminLayout";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export default function AdminTestimonials() {
  return (
    <AdminLayout>
      <SimpleCrud
        table="testimonials"
        title="Testimonials"
        description="Client quotes shown on the home page."
        titleField="author"
        columns={[
          {
            key: "quote",
            label: "Quote",
            render: (r) => <span className="line-clamp-2 text-sm">{r.quote}</span>,
          },
          { key: "author", label: "Author", className: "w-40" },
          { key: "company", label: "Company", className: "w-40" },
        ]}
        fields={[
          { name: "quote", label: "Quote", type: "textarea", required: true },
          { name: "author", label: "Author", type: "text", required: true },
          { name: "position", label: "Position", type: "text" },
          { name: "company", label: "Company", type: "text" },
          { name: "display_order", label: "Display order", type: "number" },
          { name: "is_active", label: "Visible", type: "boolean" },
        ]}
      />
    </AdminLayout>
  );
}

import { AdminLayout } from "@/components/admin/AdminLayout";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export default function AdminClients() {
  return (
    <AdminLayout>
      <SimpleCrud
        table="clients"
        title="Clients"
        description="Logos shown on the home & clientele pages."
        columns={[
          {
            key: "logo_url",
            label: "",
            className: "w-16",
            render: (r) => (r.logo_url ? <img src={r.logo_url} alt={r.name} className="h-8 object-contain" /> : null),
          },
          { key: "name", label: "Name" },
          {
            key: "is_featured",
            label: "Featured",
            className: "w-24",
            render: (r) => (r.is_featured ? "✓" : "—"),
          },
          { key: "display_order", label: "Order", className: "w-20" },
        ]}
        fields={[
          { name: "name", label: "Client name", type: "text", required: true },
          { name: "logo_url", label: "Logo URL", type: "image" },
          { name: "display_order", label: "Display order", type: "number" },
          { name: "is_featured", label: "Show on home page", type: "boolean" },
          { name: "is_active", label: "Visible", type: "boolean" },
        ]}
      />
    </AdminLayout>
  );
}

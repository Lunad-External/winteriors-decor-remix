import { AdminLayout } from "@/components/admin/AdminLayout";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export default function AdminOffices() {
  return (
    <AdminLayout>
      <SimpleCrud
        table="offices"
        title="Office Locations"
        description="Contact details shown across the site and on /contact."
        titleField="city"
        columns={[
          { key: "city", label: "City" },
          { key: "address", label: "Address" },
          { key: "tel", label: "Telephone", className: "w-40" },
          { key: "email", label: "Email", className: "w-56" },
        ]}
        fields={[
          { name: "city", label: "City", type: "text", required: true },
          { name: "address", label: "Address", type: "textarea", required: true },
          { name: "po_box", label: "P.O. Box", type: "text" },
          { name: "mobile", label: "Mobile", type: "text" },
          { name: "tel", label: "Telephone", type: "text" },
          { name: "fax", label: "Fax", type: "text" },
          { name: "email", label: "Email", type: "text" },
          { name: "display_order", label: "Display order", type: "number" },
          { name: "is_active", label: "Visible", type: "boolean" },
        ]}
      />
    </AdminLayout>
  );
}

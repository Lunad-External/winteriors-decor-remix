import { AdminLayout } from "@/components/admin/AdminLayout";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export default function AdminTeam() {
  return (
    <AdminLayout>
      <SimpleCrud
        table="team_members"
        title="Team Members"
        description="Manage the team grid shown on /about."
        columns={[
          {
            key: "image_url",
            label: "",
            className: "w-16",
            render: (r) =>
              r.image_url ? (
                <img src={r.image_url} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
              ) : null,
          },
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "display_order", label: "Order", className: "w-20" },
        ]}
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          { name: "role", label: "Role / Designation", type: "text", required: true },
          { name: "image_url", label: "Photo URL", type: "image" },
          { name: "object_position", label: "Image focus", type: "text", placeholder: "center 15%" },
          { name: "scale", label: "Image zoom (1.0 = normal)", type: "number" },
          { name: "display_order", label: "Display order", type: "number" },
          { name: "is_active", label: "Visible", type: "boolean" },
        ]}
      />
    </AdminLayout>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function AdminServices() {
  const [activeCat, setActiveCat] = useState<{ id: string; name: string } | null>(null);

  const { data: cats = [] } = useQuery({
    queryKey: ["service_categories_select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_categories").select("id, name").order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  if (activeCat) {
    return (
      <AdminLayout>
        <Button variant="ghost" size="sm" onClick={() => setActiveCat(null)} className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to categories
        </Button>
        <SimpleCrud
          table="service_subcategories"
          title={`${activeCat.name} — Subcategories`}
          description="Subcategories appear as detail pages under the parent category."
          defaults={{ category_id: activeCat.id }}
          columns={[
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
            { key: "display_order", label: "Order", className: "w-20" },
          ]}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "slug", label: "Slug", type: "text", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "meta_title", label: "SEO Title", type: "text" },
            { name: "meta_description", label: "SEO Description", type: "textarea" },
            { name: "display_order", label: "Display order", type: "number" },
            { name: "is_active", label: "Visible", type: "boolean" },
            {
              name: "category_id", label: "Parent category", type: "select",
              options: cats.map((c) => ({ value: c.id, label: c.name })),
            },
          ]}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SimpleCrud
        table="service_categories"
        title="Services"
        description="6 top-level categories with subcategories. Click 'Manage' to edit subcategories."
        columns={[
          { key: "name", label: "Category" },
          { key: "slug", label: "Slug" },
          {
            key: "_actions",
            label: "Subcategories",
            className: "w-40",
            render: (r) => (
              <Button size="sm" variant="outline" onClick={() => setActiveCat({ id: r.id, name: r.name })}>
                Manage
              </Button>
            ),
          },
        ]}
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "meta_title", label: "SEO Title", type: "text" },
          { name: "meta_description", label: "SEO Description", type: "textarea" },
          { name: "display_order", label: "Display order", type: "number" },
          { name: "is_active", label: "Visible", type: "boolean" },
        ]}
      />
    </AdminLayout>
  );
}

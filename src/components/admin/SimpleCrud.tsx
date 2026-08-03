import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export type FieldType = "text" | "textarea" | "richtext" | "number" | "boolean" | "image" | "images" | "tags" | "select";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
}

export interface ColumnDef {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  className?: string;
}

export interface SimpleCrudProps {
  table: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  orderBy?: { column: string; ascending: boolean };
  defaults?: Record<string, any>;
  titleField?: string;
}

export function SimpleCrud({
  table,
  title,
  description,
  fields,
  columns,
  orderBy = { column: "display_order", ascending: true },
  defaults = {},
  titleField = "name",
}: SimpleCrudProps) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-crud", table],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(table)
        .select("*")
        .order(orderBy.column, { ascending: orderBy.ascending });
      if (error) throw error;
      return data || [];
    },
  });

  const upsert = useMutation({
    mutationFn: async (row: any) => {
      const payload = { ...row };
      delete payload.created_at;
      delete payload.updated_at;
      if (row.id) {
        const { error } = await (supabase as any).from(table).update(payload).eq("id", row.id);
        if (error) throw error;
      } else {
        delete payload.id;
        const { error } = await (supabase as any).from(table).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-crud", table] });
      toast({ title: "Saved" });
      setOpen(false);
      setEditing(null);
    },
    onError: (err: any) => toast({ title: "Save failed", description: err.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-crud", table] });
      toast({ title: "Deleted" });
    },
    onError: (err: any) => toast({ title: "Delete failed", description: err.message, variant: "destructive" }),
  });

  const handleNew = () => {
    const booleanDefaults = Object.fromEntries(
      fields.filter((f) => f.type === "boolean").map((f) => [f.name, true])
    );
    setEditing({ ...defaults, ...booleanDefaults, display_order: rows.length });
    setOpen(true);
  };

  const handleEdit = (row: any) => {
    setEditing({ ...row });
    setOpen(true);
  };

  const handleDelete = (row: any) => {
    if (!confirm(`Delete "${row[titleField] || "this item"}"? This cannot be undone.`)) return;
    del.mutate(row.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <Button onClick={handleNew}>
          <Plus className="w-4 h-4 mr-1.5" /> Add
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key} className={c.className}>{c.label}</TableHead>
              ))}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-10"><Loader2 className="w-4 h-4 animate-spin inline" /></TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-10 text-muted-foreground">No entries yet</TableCell></TableRow>
            ) : (
              rows.map((row: any) => (
                <TableRow key={row.id}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
                      {c.render ? c.render(row) : String(row[c.key] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(row)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(row)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit" : "Add new"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-2">
              {fields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <Label>{f.label}{f.required && <span className="text-destructive ml-0.5">*</span>}</Label>
                  {f.type === "textarea" || f.type === "richtext" ? (
                    <Textarea
                      rows={f.type === "richtext" ? 10 : 3}
                      value={editing[f.name] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                    />
                  ) : f.type === "boolean" ? (
                    <Switch
                      checked={!!editing[f.name]}
                      onCheckedChange={(v) => setEditing({ ...editing, [f.name]: v })}
                    />
                  ) : f.type === "number" ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editing[f.name] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value === "" ? null : parseFloat(e.target.value) })}
                    />
                  ) : f.type === "select" ? (
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={editing[f.name] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                    >
                      <option value="">—</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : f.type === "tags" ? (
                    <Input
                      type="text"
                      value={Array.isArray(editing[f.name]) ? editing[f.name].join(", ") : (editing[f.name] ?? "")}
                      onChange={(e) => {
                        const arr = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setEditing({ ...editing, [f.name]: arr });
                      }}
                      placeholder={f.placeholder || "Comma separated"}
                    />
                  ) : f.type === "images" ? (
                    <div className="space-y-2">
                      {(editing[f.name] || []).map((url: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img src={url} alt="" className="h-12 w-16 object-cover rounded border" />
                          <Input
                            type="text"
                            value={url}
                            onChange={(e) => {
                              const arr = [...(editing[f.name] || [])];
                              arr[idx] = e.target.value;
                              setEditing({ ...editing, [f.name]: arr });
                            }}
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              const arr = [...(editing[f.name] || [])];
                              arr.splice(idx, 1);
                              setEditing({ ...editing, [f.name]: arr });
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            [f.name]: [...(editing[f.name] || []), ""],
                          })
                        }
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add image URL
                      </Button>
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={editing[f.name] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                    />
                  )}
                  {f.helpText && <p className="text-[11px] text-muted-foreground">{f.helpText}</p>}
                  {f.type === "image" && editing[f.name] && (
                    <img src={editing[f.name]} alt="" className="h-16 w-16 object-cover rounded border" />
                  )}
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => upsert.mutate(editing)} disabled={upsert.isPending}>
              {upsert.isPending && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

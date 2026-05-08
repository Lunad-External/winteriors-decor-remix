import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Eye, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  message: string;
  status: string;
  created_at: string;
}

const STATUSES = ["new", "in-progress", "responded", "closed"] as const;

export default function AdminEnquiries() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState<Enquiry | null>(null);

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Enquiry[];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("enquiries").update({ status } as any).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
    toast({ title: "Status updated" });
  };

  const handleDelete = async (enquiry: Enquiry) => {
    if (!confirm(`Delete enquiry from "${enquiry.name}"?`)) return;
    await supabase.from("enquiries").delete().eq("id", enquiry.id);
    queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
    toast({ title: "Deleted" });
  };

  const statusColor = (s: string) => {
    if (s === "new") return "default" as const;
    if (s === "in-progress") return "secondary" as const;
    if (s === "responded") return "outline" as const;
    return "outline" as const;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-poppins">Enquiries</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {enquiries.filter(e => e.status === "new").length} new · {enquiries.length} total
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : enquiries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No enquiries yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell>{e.email}</TableCell>
                      <TableCell>{e.phone}</TableCell>
                      <TableCell>
                        <Badge variant={statusColor(e.status)} className="capitalize text-xs">{e.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(e.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" onClick={() => setViewing(e)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`mailto:${e.email}`}><Mail className="w-4 h-4" /></a>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(e)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Enquiry from {viewing?.name}</DialogTitle>
            </DialogHeader>
            {viewing && (
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Email:</span> <a href={`mailto:${viewing.email}`} className="text-primary hover:underline">{viewing.email}</a></div>
                  <div><span className="text-muted-foreground">Phone:</span> <a href={`tel:${viewing.phone}`} className="text-primary hover:underline">{viewing.phone}</a></div>
                  {viewing.company && <div><span className="text-muted-foreground">Company:</span> {viewing.company}</div>}
                  <div><span className="text-muted-foreground">Date:</span> {new Date(viewing.created_at).toLocaleString()}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Message</p>
                  <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">{viewing.message}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Select value={viewing.status} onValueChange={(val) => { updateStatus(viewing.id, val); setViewing({ ...viewing, status: val }); }}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

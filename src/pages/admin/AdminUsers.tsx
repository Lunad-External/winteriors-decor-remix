import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shield, UserPlus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UserWithRole {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string | null;
  role: string | null;
  role_row_id: string | null;
}

const ROLES = ["admin", "moderator", "user"] as const;

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Get profiles
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .order("created_at", { ascending: false });

      if (pErr) throw pErr;

      // Get roles
      const { data: roles } = await supabase.from("user_roles").select("id, user_id, role");

      return (profiles || []).map(p => {
        const userRole = (roles || []).find(r => r.user_id === p.id);
        return {
          id: p.id,
          email: p.email,
          full_name: p.full_name,
          created_at: p.created_at,
          role: userRole?.role || null,
          role_row_id: userRole?.id || null,
        } as UserWithRole;
      });
    },
  });

  const handleRoleChange = async () => {
    if (!editingUser || !newRole) return;

    if (editingUser.role_row_id) {
      // Update existing role
      await supabase.from("user_roles").update({ role: newRole as any }).eq("id", editingUser.role_row_id);
    } else {
      // Insert new role
      await supabase.from("user_roles").insert({ user_id: editingUser.id, role: newRole as any } as any);
    }

    toast({ title: "Role updated", description: `${editingUser.email} is now ${newRole}` });
    setEditingUser(null);
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const handleRemoveRole = async (user: UserWithRole) => {
    if (!user.role_row_id) return;
    if (!confirm(`Remove ${user.role} role from ${user.email}?`)) return;

    await supabase.from("user_roles").delete().eq("id", user.role_row_id);
    toast({ title: "Role removed", description: `${user.email} role has been removed` });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const roleBadgeVariant = (role: string | null) => {
    if (role === "admin") return "default" as const;
    if (role === "moderator") return "secondary" as const;
    return "outline" as const;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-poppins">Users</h1>
          <p className="text-muted-foreground mt-1">{users.length} registered users</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name || "—"}</TableCell>
                      <TableCell>{user.email || "—"}</TableCell>
                      <TableCell>
                        {user.role ? (
                          <Badge variant={roleBadgeVariant(user.role)} className="capitalize">{user.role}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">No role</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setNewRole(user.role || "user"); }}>
                            <Shield className="w-4 h-4" />
                          </Button>
                          {user.role && (
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveRole(user)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Role Edit Dialog */}
        <Dialog open={!!editingUser} onOpenChange={open => !open && setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">{editingUser?.email}</p>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => (
                      <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button onClick={handleRoleChange}>Save Role</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

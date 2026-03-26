import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Search, Shield, User, UserCheck, UserX } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
  role: string;
}

const UsersPanel = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: roles } = await supabase.from("user_roles").select("*");
    const roleMap = new Map((roles || []).map(r => [r.user_id, r.role]));
    setUsers((profiles || []).map(p => ({
      ...p,
      role: roleMap.get(p.user_id) || "user",
    })));
    setLoading(false);
  };

  const updateRole = async (userId: string, newRole: string) => {
    // Delete existing role then insert new
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: newRole as "admin" | "user" | "editor",
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: `Role updated to ${newRole}` });
    fetchUsers();
  };

  const filtered = users.filter(u =>
    !search || (u.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const roleIcon = (role: string) => {
    if (role === "admin") return <Shield className="w-3 h-3" />;
    if (role === "editor") return <UserCheck className="w-3 h-3" />;
    return <User className="w-3 h-3" />;
  };

  const roleColor = (role: string) =>
    role === "admin" ? "text-primary bg-primary/10" :
    role === "editor" ? "text-blue-400 bg-blue-500/10" :
    "text-muted-foreground bg-secondary/40";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">User Management</h2>
        <span className="text-xs text-muted-foreground">{users.length} users</span>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl overflow-hidden"
      >
        {loading ? (
          <div className="p-12 text-center text-muted-foreground text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Joined</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filtered.map(u => (
                  <motion.tr key={u.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary text-xs font-bold">
                            {(u.display_name || "U").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-foreground">{u.display_name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${roleColor(u.role)}`}>
                        {roleIcon(u.role)} {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={e => updateRole(u.user_id, e.target.value)}
                        className="px-2 py-1 rounded-lg bg-secondary/40 border border-border/30 text-foreground text-xs focus:outline-none focus:border-primary/50"
                      >
                        <option value="user">User</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-12 text-center text-muted-foreground text-sm">
                {search ? "No matching users" : "No users yet"}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UsersPanel;

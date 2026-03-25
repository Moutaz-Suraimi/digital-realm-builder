import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut, Trash2, Eye, Search, Loader2, Users, FileText,
  ShieldCheck, Download, ArrowLeft
} from "lucide-react";

interface AdminSubmission {
  id: string;
  name: string;
  message: string;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  user_id: string;
  profiles: { display_name: string | null } | null;
}

const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/auth");
  }, [user, isAdmin, authLoading, navigate]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("submissions")
      .select("*, profiles!submissions_user_id_fkey(display_name)")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      // Transform the data to handle the profiles relationship
      const transformed = data.map((item: any) => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] || null : item.profiles,
      }));
      setSubmissions(transformed);
    }
    setLoading(false);
  };

  useEffect(() => { if (user && isAdmin) fetchSubmissions(); }, [user, isAdmin]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Deleted!" });
      fetchSubmissions();
    }
  };

  const filtered = submissions.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.message.toLowerCase().includes(search.toLowerCase()) ||
    (s.profiles?.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">{filtered.length} submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30 transition-all flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Home
            </button>
            <button onClick={signOut} className="p-2 rounded-xl text-muted-foreground hover:text-destructive border border-border/50 hover:border-destructive/30 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2.5 rounded-xl bg-secondary/40 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: FileText, label: "Total Submissions", value: submissions.length },
            { icon: Users, label: "With Files", value: submissions.filter(s => s.file_url).length },
            { icon: Download, label: "Today", value: submissions.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).length },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card/60 p-4">
              <stat.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Message</th>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map(s => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-foreground text-xs">{s.profiles?.display_name || "Unknown"}</td>
                    <td className="px-4 py-3 text-foreground font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate hidden md:table-cell">{s.message}</td>
                    <td className="px-4 py-3">
                      {s.file_url ? (
                        <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-xs hover:underline">
                          <Eye className="w-3 h-3" /> {formatSize(s.file_size)}
                        </a>
                      ) : <span className="text-muted-foreground/40 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {search ? "No results found" : "No submissions yet"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, LogOut, FileText, Trash2, Edit3, Upload, X, Send,
  Eye, Download, Loader2, Search
} from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

interface Submission {
  id: string;
  name: string;
  message: string;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const fetchSubmissions = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => { if (user) fetchSubmissions(); }, [user]);

  const validateFile = (f: File): string | null => {
    if (!ALLOWED_TYPES.includes(f.type)) return "File type not allowed. Use JPG, PNG, PDF, or DOC.";
    if (f.size > MAX_SIZE) return "File too large. Max 10MB.";
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      toast({ title: "Invalid file", description: err, variant: "destructive" });
      return;
    }
    setFile(f);
  };

  const uploadFile = async (f: File): Promise<{ url: string; name: string; type: string; size: number } | null> => {
    if (!user) return null;
    const ext = f.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(path, f, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(path);
    return { url: publicUrl, name: f.name, type: f.type, size: f.size };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formName.trim() || !formMessage.trim()) return;
    setUploading(true);

    let fileData: { url: string; name: string; type: string; size: number } | null = null;
    if (file) {
      fileData = await uploadFile(file);
      if (!fileData) { setUploading(false); return; }
    }

    if (editingId) {
      const updateData: Record<string, unknown> = { name: formName, message: formMessage };
      if (fileData) {
        updateData.file_url = fileData.url;
        updateData.file_name = fileData.name;
        updateData.file_type = fileData.type;
        updateData.file_size = fileData.size;
      }
      const { error } = await supabase.from("submissions").update(updateData).eq("id", editingId);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Submission updated!" });
    } else {
      const { error } = await supabase.from("submissions").insert({
        user_id: user.id,
        name: formName,
        message: formMessage,
        file_url: fileData?.url || null,
        file_name: fileData?.name || null,
        file_type: fileData?.type || null,
        file_size: fileData?.size || null,
      });
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Submission created!" });
    }

    resetForm();
    fetchSubmissions();
    setUploading(false);
  };

  const handleEdit = (s: Submission) => {
    setEditingId(s.id);
    setFormName(s.name);
    setFormMessage(s.message);
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Deleted!" });
      fetchSubmissions();
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName("");
    setFormMessage("");
    setFile(null);
  };

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
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditingId(null); setFormName(""); setFormMessage(""); setFile(null); setShowForm(true); }}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2"
              style={{ boxShadow: "0 0 15px hsl(var(--primary) / 0.3)" }}
            >
              <Plus className="w-4 h-4" /> New
            </motion.button>
            <button onClick={() => navigate("/")} className="px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30 transition-all">
              Home
            </button>
            <button onClick={signOut} className="p-2 rounded-xl text-muted-foreground hover:text-destructive border border-border/50 hover:border-destructive/30 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* New/Edit Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={resetForm}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl border border-border/50 bg-card p-6 shadow-2xl"
                style={{ boxShadow: "0 0 40px hsl(var(--primary) / 0.1)" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">
                    {editingId ? "Edit Submission" : "New Submission"}
                  </h2>
                  <button onClick={resetForm} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                  <textarea
                    placeholder="Your Message"
                    value={formMessage}
                    onChange={e => setFormMessage(e.target.value)}
                    required
                    maxLength={1000}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none"
                  />

                  <div
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 bg-secondary/20 cursor-pointer transition-all"
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {file ? file.name : "Upload File (optional)"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file ? formatSize(file.size) : "JPG, PNG, PDF, DOC — Max 10MB"}
                      </p>
                    </div>
                    {file && (
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setFile(null); }}
                        className="p-1 rounded-full bg-destructive/20 hover:bg-destructive/40 transition-colors"
                      >
                        <X className="w-3 h-3 text-destructive" />
                      </button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />

                  <motion.button
                    type="submit"
                    disabled={uploading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" }}
                  >
                    {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Send className="w-4 h-4" /> {editingId ? "Update" : "Submit"}</>}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No submissions yet</h3>
            <p className="text-muted-foreground text-sm">Click "New" to create your first submission</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map(s => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.message}</p>
                    {s.file_url && (
                      <a
                        href={s.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs text-primary hover:underline"
                      >
                        <Eye className="w-3 h-3" />
                        {s.file_name || "View File"} {s.file_size ? `(${formatSize(s.file_size)})` : ""}
                      </a>
                    )}
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      {new Date(s.created_at).toLocaleDateString()} · {new Date(s.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEdit(s)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

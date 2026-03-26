import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Eye, Send, Clock, FileText, X, Save, Tag
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  featured_image: string | null;
  category: string;
  tags: string[];
  status: string;
  publish_date: string | null;
  views: number;
  likes: number;
  author_id: string;
  created_at: string;
}

const defaultPost = {
  title: "", subtitle: "", content: "", featured_image: "",
  category: "general", tags: [] as string[], status: "draft", publish_date: null as string | null,
};

const BlogPanel = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  const save = async () => {
    if (!editing?.title) { toast({ title: "Title required", variant: "destructive" }); return; }
    const payload = {
      title: editing.title,
      subtitle: editing.subtitle || "",
      content: editing.content || "",
      featured_image: editing.featured_image || null,
      category: editing.category || "general",
      tags: editing.tags || [],
      status: editing.status || "draft",
      publish_date: editing.status === "published" ? new Date().toISOString() : editing.publish_date,
    };
    if (isNew) {
      const { error } = await supabase.from("blog_posts").insert({ ...payload, author_id: user!.id });
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Post created!" });
    } else {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id!);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Post updated!" });
    }
    setEditing(null);
    setIsNew(false);
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Post deleted" });
    fetchPosts();
  };

  const addTag = () => {
    if (tagInput.trim() && editing) {
      setEditing({ ...editing, tags: [...(editing.tags || []), tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (idx: number) => {
    if (editing) {
      setEditing({ ...editing, tags: (editing.tags || []).filter((_, i) => i !== idx) });
    }
  };

  const statusColor = (s: string) =>
    s === "published" ? "text-emerald-400 bg-emerald-500/10" :
    s === "scheduled" ? "text-blue-400 bg-blue-500/10" :
    "text-amber-400 bg-amber-500/10";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Blog / News</h2>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => { setEditing(defaultPost); setIsNew(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </motion.button>
      </div>

      {/* Editor */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-border/30 bg-card/80 backdrop-blur-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">{isNew ? "New Post" : "Edit Post"}</h3>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <input
              placeholder="Title"
              value={editing.title || ""}
              onChange={e => setEditing({ ...editing, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <input
              placeholder="Subtitle"
              value={editing.subtitle || ""}
              onChange={e => setEditing({ ...editing, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <textarea
              placeholder="Content (Markdown supported)"
              value={editing.content || ""}
              onChange={e => setEditing({ ...editing, content: e.target.value })}
              rows={8}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none font-mono"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Featured Image URL"
                value={editing.featured_image || ""}
                onChange={e => setEditing({ ...editing, featured_image: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                placeholder="Category"
                value={editing.category || ""}
                onChange={e => setEditing({ ...editing, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editing.tags || []).map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs">
                    {t}
                    <button onClick={() => removeTag(i)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 rounded-lg bg-secondary/40 border border-border/30 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
                <button onClick={addTag} className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium">Add</button>
              </div>
            </div>
            {/* Status & Save */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {["draft", "published", "scheduled"].map(s => (
                  <button
                    key={s}
                    onClick={() => setEditing({ ...editing, status: s })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      editing.status === s ? statusColor(s) + " border border-current/20" : "text-muted-foreground border border-border/30"
                    }`}
                  >
                    {s === "published" ? <Send className="w-3 h-3 inline mr-1" /> :
                     s === "scheduled" ? <Clock className="w-3 h-3 inline mr-1" /> :
                     <FileText className="w-3 h-3 inline mr-1" />}
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={save}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
              >
                <Save className="w-4 h-4" /> Save
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-muted-foreground text-sm py-12">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-12">No posts yet</div>
        ) : posts.map(post => (
          <motion.div
            key={post.id}
            whileHover={{ x: 2 }}
            className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-4 flex items-center justify-between gap-4 group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-foreground font-medium truncate">{post.title}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(post.status)}`}>
                  {post.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{post.category} • {post.views} views • {post.likes} likes</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => { setEditing(post); setIsNew(false); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => deletePost(post.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogPanel;

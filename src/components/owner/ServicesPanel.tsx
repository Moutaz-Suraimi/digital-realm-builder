import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_visible: boolean;
  image_url: string | null;
  created_at: string;
}

const defaultService = { name: "", description: "", price: 0, category: "general", is_visible: true, image_url: "" };

const ServicesPanel = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false });
    setServices((data as Service[]) || []);
    setLoading(false);
  };

  const save = async () => {
    if (!editing?.name) { toast({ title: "Name required", variant: "destructive" }); return; }
    if (isNew) {
      const { error } = await supabase.from("services").insert({
        name: editing.name,
        description: editing.description || "",
        price: Number(editing.price) || 0,
        category: editing.category || "general",
        is_visible: editing.is_visible !== false,
        image_url: editing.image_url || null,
      });
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Service created!" });
    } else {
      const { error } = await supabase.from("services").update({
        name: editing.name,
        description: editing.description,
        price: Number(editing.price),
        category: editing.category,
        is_visible: editing.is_visible,
        image_url: editing.image_url || null,
      }).eq("id", editing.id!);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Service updated!" });
    }
    setEditing(null);
    setIsNew(false);
    fetchServices();
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from("services").update({ is_visible: !current }).eq("id", id);
    fetchServices();
  };

  const deleteService = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchServices();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Services</h2>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => { setEditing(defaultService); setIsNew(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Service
        </motion.button>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-border/30 bg-card/80 backdrop-blur-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">{isNew ? "New Service" : "Edit Service"}</h3>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Service Name"
                value={editing.name || ""}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                type="number"
                placeholder="Price"
                value={editing.price || ""}
                onChange={e => setEditing({ ...editing, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                placeholder="Category"
                value={editing.category || ""}
                onChange={e => setEditing({ ...editing, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                placeholder="Image URL"
                value={editing.image_url || ""}
                onChange={e => setEditing({ ...editing, image_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <textarea
              placeholder="Description"
              value={editing.description || ""}
              onChange={e => setEditing({ ...editing, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={editing.is_visible !== false}
                  onChange={e => setEditing({ ...editing, is_visible: e.target.checked })}
                  className="rounded"
                />
                Visible to customers
              </label>
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center text-muted-foreground text-sm py-12">Loading...</div>
        ) : services.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground text-sm py-12">No services yet</div>
        ) : services.map(s => (
          <motion.div
            key={s.id}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5 group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,hsl(265_90%_60%/0.06),transparent_70%)]" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-foreground font-medium">{s.name}</h4>
                  <p className="text-xs text-muted-foreground">{s.category}</p>
                </div>
                <span className="text-primary font-bold text-lg">${Number(s.price).toFixed(0)}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{s.description}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(s); setIsNew(false); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => toggleVisibility(s.id, s.is_visible)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                  {s.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => deleteService(s.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPanel;

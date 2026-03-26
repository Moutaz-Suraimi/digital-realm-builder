import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Search, Filter, ArrowUpDown, Check, Clock, Trash2 } from "lucide-react";

interface Order {
  id: string;
  user_id: string;
  service_id: string | null;
  status: string;
  total: number;
  notes: string;
  created_at: string;
  services?: { name: string; category: string } | null;
  profiles?: { display_name: string | null } | null;
}

const OrdersPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "total">("date");
  const { toast } = useToast();

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, services(name, category)")
      .order("created_at", { ascending: false });
    if (!error && data) {
      // Fetch user profiles for each order
      const userIds = [...new Set(data.map(o => o.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
      
      setOrders(data.map((o: any) => ({
        ...o,
        services: Array.isArray(o.services) ? o.services[0] : o.services,
        profiles: profileMap.get(o.user_id) || null,
      })));
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Order ${status}` }); fetchOrders(); }
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Order deleted" }); fetchOrders(); }
  };

  const filtered = orders
    .filter(o => statusFilter === "all" || o.status === statusFilter)
    .filter(o =>
      !search ||
      (o.profiles?.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.services?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      o.notes.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortBy === "total" ? Number(b.total) - Number(a.total) : 0);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "pending", "completed", "cancelled"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground border border-border/30 hover:border-border/50"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortBy(sortBy === "date" ? "total" : "date")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-border/30 hover:border-border/50 transition-all"
        >
          <ArrowUpDown className="w-3 h-3" /> Sort: {sortBy}
        </button>
      </div>

      {/* Table */}
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
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filtered.map(order => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-foreground">{order.profiles?.display_name || "Unknown"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.services?.name || "—"}</td>
                    <td className="px-4 py-3 text-foreground font-medium">${Number(order.total).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                        order.status === "cancelled" ? "bg-red-500/10 text-red-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>
                        {order.status === "completed" ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {order.status === "pending" && (
                          <button
                            onClick={() => updateStatus(order.id, "completed")}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Complete"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-12 text-center text-muted-foreground text-sm">
                {search || statusFilter !== "all" ? "No matching orders" : "No orders yet"}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrdersPanel;

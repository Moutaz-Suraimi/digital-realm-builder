import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, Info, ShoppingCart, FileText } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => {
        fetchNotifications();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50);
    setNotifications((data as Notification[]) || []);
    setLoading(false);
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    fetchNotifications();
  };

  const markAllRead = async () => {
    await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
    fetchNotifications();
  };

  const typeIcon = (type: string) => {
    if (type === "order") return <ShoppingCart className="w-4 h-4 text-primary" />;
    if (type === "blog") return <FileText className="w-4 h-4 text-blue-400" />;
    return <Info className="w-4 h-4 text-amber-400" />;
  };

  const unread = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          {unread > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">{unread}</span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            <CheckCheck className="w-3 h-3" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center text-muted-foreground text-sm py-12">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-12 flex flex-col items-center gap-2">
            <Bell className="w-8 h-8 text-muted-foreground/30" />
            No notifications yet
          </div>
        ) : notifications.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-xl border p-4 flex items-start gap-3 transition-all ${
              n.is_read
                ? "border-border/20 bg-card/40"
                : "border-primary/20 bg-primary/5 shadow-[0_0_10px_hsl(265_90%_60%/0.05)]"
            }`}
          >
            <div className="mt-0.5">{typeIcon(n.type)}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${n.is_read ? "text-muted-foreground" : "text-foreground"}`}>{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
            {!n.is_read && (
              <button onClick={() => markRead(n.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0">
                <Check className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ShoppingCart, DollarSign, Users, Clock, FileText, Eye,
  Plus, PenLine, Megaphone
} from "lucide-react";
import StatsCard from "./StatsCard";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from "recharts";

interface OverviewPanelProps {
  onNavigate: (tab: string) => void;
}

const OverviewPanel = ({ onNavigate }: OverviewPanelProps) => {
  const [stats, setStats] = useState({
    totalOrders: 0, revenue: 0, activeUsers: 0,
    pendingOrders: 0, blogPosts: 0, totalVisitors: 0,
    dailyVisitors: 0, weeklyVisitors: 0,
  });
  const [visitorChart, setVisitorChart] = useState<{ day: string; count: number }[]>([]);
  const [orderChart, setOrderChart] = useState<{ name: string; orders: number }[]>([]);

  useEffect(() => {
    fetchStats();
    const channel = supabase
      .channel("visitors-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "visitors" }, () => {
        fetchStats();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchStats = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [ordersRes, pendingRes, postsRes, visitorsRes, dailyRes, weeklyRes, profilesRes] = await Promise.all([
      supabase.from("orders").select("id, total", { count: "exact" }),
      supabase.from("orders").select("id", { count: "exact" }).eq("status", "pending"),
      supabase.from("blog_posts").select("id", { count: "exact" }),
      supabase.from("visitors").select("id", { count: "exact" }),
      supabase.from("visitors").select("id", { count: "exact" }).gte("visited_at", todayStart),
      supabase.from("visitors").select("id", { count: "exact" }).gte("visited_at", weekStart),
      supabase.from("profiles").select("id", { count: "exact" }),
    ]);

    const revenue = (ordersRes.data || []).reduce((sum, o) => sum + Number(o.total || 0), 0);

    setStats({
      totalOrders: ordersRes.count || 0,
      revenue,
      activeUsers: profilesRes.count || 0,
      pendingOrders: pendingRes.count || 0,
      blogPosts: postsRes.count || 0,
      totalVisitors: visitorsRes.count || 0,
      dailyVisitors: dailyRes.count || 0,
      weeklyVisitors: weeklyRes.count || 0,
    });

    // Build visitor chart (last 7 days)
    const days: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dayStr = d.toLocaleDateString("en", { weekday: "short" });
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
      const { count } = await supabase
        .from("visitors")
        .select("id", { count: "exact", head: true })
        .gte("visited_at", dayStart)
        .lt("visited_at", dayEnd);
      days.push({ day: dayStr, count: count || 0 });
    }
    setVisitorChart(days);

    // Orders by service category
    const { data: ordersData } = await supabase
      .from("orders")
      .select("service_id, services(category)")
      .not("service_id", "is", null);
    const catMap: Record<string, number> = {};
    (ordersData || []).forEach((o: any) => {
      const cat = o.services?.category || "Other";
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    setOrderChart(Object.entries(catMap).map(([name, orders]) => ({ name, orders })));
  };

  const quickActions = [
    { label: "Add Service", icon: Plus, tab: "services" },
    { label: "Publish Blog", icon: PenLine, tab: "blog" },
    { label: "Create Promo", icon: Megaphone, tab: "services" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} delay={0} />
        <StatsCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} trend="+12% this month" trendUp delay={0.05} />
        <StatsCard title="Active Users" value={stats.activeUsers} icon={Users} delay={0.1} />
        <StatsCard title="Pending Requests" value={stats.pendingOrders} icon={Clock} delay={0.15} />
        <StatsCard title="Blog Posts" value={stats.blogPosts} icon={FileText} delay={0.2} />
        <StatsCard title="Total Visitors" value={stats.totalVisitors} icon={Eye} delay={0.25} />
        <StatsCard title="Today's Visitors" value={stats.dailyVisitors} icon={Eye} trend="Today" trendUp delay={0.3} />
        <StatsCard title="Weekly Visitors" value={stats.weeklyVisitors} icon={Eye} trend="This week" trendUp delay={0.35} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visitor Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5"
        >
          <h3 className="text-sm font-medium text-foreground mb-4">Visitor Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={visitorChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 20% 15%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(260 10% 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(260 10% 55%)" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(260 20% 8%)",
                  border: "1px solid hsl(260 30% 20%)",
                  borderRadius: "12px",
                  color: "hsl(0 0% 95%)",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="count" stroke="hsl(265 90% 60%)" strokeWidth={2} dot={{ fill: "hsl(265 90% 60%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5"
        >
          <h3 className="text-sm font-medium text-foreground mb-4">Orders by Service</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={orderChart.length ? orderChart : [{ name: "No data", orders: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 20% 15%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(260 10% 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(260 10% 55%)" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(260 20% 8%)",
                  border: "1px solid hsl(260 30% 20%)",
                  borderRadius: "12px",
                  color: "hsl(0 0% 95%)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="orders" fill="hsl(265 90% 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate(action.tab)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 border border-primary/20 hover:border-primary/40 transition-all shadow-[0_0_10px_hsl(265_90%_60%/0.05)]"
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default OverviewPanel;

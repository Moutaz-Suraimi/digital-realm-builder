import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["hsl(265,90%,60%)", "hsl(275,85%,55%)", "hsl(230,85%,55%)", "hsl(200,80%,50%)"];

const AnalyticsPanel = () => {
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  const [serviceData, setServiceData] = useState<{ name: string; value: number }[]>([]);
  const [blogData, setBlogData] = useState<{ title: string; views: number; likes: number }[]>([]);
  const [trafficData, setTrafficData] = useState<{ day: string; visitors: number }[]>([]);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    // Revenue by month (last 6 months)
    const { data: orders } = await supabase.from("orders").select("total, created_at");
    const monthMap: Record<string, number> = {};
    (orders || []).forEach(o => {
      const m = new Date(o.created_at).toLocaleDateString("en", { month: "short", year: "2-digit" });
      monthMap[m] = (monthMap[m] || 0) + Number(o.total);
    });
    setRevenueData(Object.entries(monthMap).slice(-6).map(([month, revenue]) => ({ month, revenue })));

    // Service performance
    const { data: services } = await supabase.from("services").select("name, id");
    const serviceOrders: Record<string, number> = {};
    (orders || []).forEach((o: any) => {
      serviceOrders[o.service_id || "other"] = (serviceOrders[o.service_id || "other"] || 0) + 1;
    });
    const sMap = new Map((services || []).map(s => [s.id, s.name]));
    setServiceData(
      Object.entries(serviceOrders).map(([id, value]) => ({ name: sMap.get(id) || "Other", value }))
    );

    // Blog engagement
    const { data: posts } = await supabase.from("blog_posts").select("title, views, likes").order("views", { ascending: false }).limit(5);
    setBlogData((posts || []) as any);

    // Traffic (last 7 days)
    const days: { day: string; visitors: number }[] = [];
    const now = new Date();
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
      days.push({ day: dayStr, visitors: count || 0 });
    }
    setTrafficData(days);
  };

  const chartStyle = {
    background: "hsl(260 20% 8%)",
    border: "1px solid hsl(260 30% 20%)",
    borderRadius: "12px",
    color: "hsl(0 0% 95%)",
    fontSize: "12px",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData.length ? revenueData : [{ month: "—", revenue: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 20% 15%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(260 10% 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(260 10% 55%)" }} />
              <Tooltip contentStyle={chartStyle} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(265 90% 60%)" strokeWidth={2} dot={{ fill: "hsl(265 90% 60%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Service Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Service Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={serviceData.length ? serviceData : [{ name: "No data", value: 1 }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                {(serviceData.length ? serviceData : [{ name: "No data", value: 1 }]).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartStyle} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Blog Engagement */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Blog Engagement (Top 5)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={blogData.length ? blogData : [{ title: "No posts", views: 0, likes: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 20% 15%)" />
              <XAxis dataKey="title" tick={{ fontSize: 9, fill: "hsl(260 10% 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(260 10% 55%)" }} />
              <Tooltip contentStyle={chartStyle} />
              <Bar dataKey="views" fill="hsl(265 90% 60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="likes" fill="hsl(275 85% 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Traffic */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Traffic Overview (7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 20% 15%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(260 10% 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(260 10% 55%)" }} />
              <Tooltip contentStyle={chartStyle} />
              <Line type="monotone" dataKey="visitors" stroke="hsl(230 85% 55%)" strokeWidth={2} dot={{ fill: "hsl(230 85% 55%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

const StatsCard = ({ title, value, icon: Icon, trend, trendUp, delay = 0 }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -4, scale: 1.01 }}
    className="relative group rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5 overflow-hidden cursor-default"
    style={{ perspective: "800px" }}
  >
    {/* Glow */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,hsl(265_90%_60%/0.08),transparent_70%)]" />
    
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-xs text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? "text-emerald-400" : "text-red-400"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
  </motion.div>
);

export default StatsCard;

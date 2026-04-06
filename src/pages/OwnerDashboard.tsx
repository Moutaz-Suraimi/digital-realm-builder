import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import OverviewPanel from "@/components/owner/OverviewPanel";
import OrdersPanel from "@/components/owner/OrdersPanel";
import ServicesPanel from "@/components/owner/ServicesPanel";
import BlogPanel from "@/components/owner/BlogPanel";
import UsersPanel from "@/components/owner/UsersPanel";
import AnalyticsPanel from "@/components/owner/AnalyticsPanel";
import NotificationsPanel from "@/components/owner/NotificationsPanel";
import SettingsPanel from "@/components/owner/SettingsPanel";
import PageBuilderPanel from "@/components/owner/PageBuilderPanel";
import MediaLibraryPanel from "@/components/owner/MediaLibraryPanel";
import { motion, AnimatePresence } from "framer-motion";

const panels: Record<string, React.FC<any>> = {
  overview: OverviewPanel,
  "page-builder": PageBuilderPanel,
  media: MediaLibraryPanel,
  orders: OrdersPanel,
  services: ServicesPanel,
  blog: BlogPanel,
  users: UsersPanel,
  analytics: AnalyticsPanel,
  notifications: NotificationsPanel,
  settings: SettingsPanel,
};

const tabTitles: Record<string, string> = {
  overview: "Dashboard Overview",
  "page-builder": "Page Builder",
  media: "Media Library",
  orders: "Orders Management",
  services: "Services Management",
  blog: "Blog / News",
  users: "User Management",
  analytics: "Analytics",
  notifications: "Notifications",
  settings: "Settings",
};

const tabDescriptions: Record<string, string> = {
  overview: "Monitor your site's performance at a glance",
  "page-builder": "Drag, reorder, and customize website sections",
  media: "Upload and manage images, videos, and documents",
  orders: "Track and manage customer orders",
  services: "Add, edit, and organize your service offerings",
  blog: "Create and publish articles and news",
  users: "Manage user accounts and roles",
  analytics: "Deep dive into visitor and revenue analytics",
  notifications: "View alerts and system notifications",
  settings: "Configure your dashboard preferences",
};

const OwnerDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/auth");
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const ActivePanel = panels[activeTab] || OverviewPanel;

  return (
    <div className="min-h-screen bg-background flex">
      <OwnerSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-40 border-b border-border/20 bg-background/80 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">{tabTitles[activeTab]}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{tabDescriptions[activeTab]}</p>
            </div>
          </div>
        </header>
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ActivePanel onNavigate={setActiveTab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;

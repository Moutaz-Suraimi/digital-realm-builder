import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingCart, Briefcase, FileText, Users,
  BarChart3, Bell, Settings, ChevronLeft, ChevronRight, LogOut, Home,
  Layers, Image, Search, Moon, Sun
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface OwnerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuSections = [
  {
    label: "Main",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "page-builder", label: "Page Builder", icon: Layers },
      { id: "media", label: "Media Library", icon: Image },
    ],
  },
  {
    label: "Manage",
    items: [
      { id: "orders", label: "Orders", icon: ShoppingCart },
      { id: "services", label: "Services", icon: Briefcase },
      { id: "blog", label: "Blog / News", icon: FileText },
      { id: "users", label: "Users", icon: Users },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

const OwnerSidebar = ({ activeTab, onTabChange }: OwnerSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(!document.documentElement.classList.contains("light"));
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const toggleTheme = () => {
    document.documentElement.classList.toggle("light");
    setIsDark(!isDark);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen sticky top-0 flex flex-col z-50 bg-sidebar border-r border-sidebar-border"
    >
      {/* Logo Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <p className="text-sidebar-foreground font-semibold text-sm leading-tight">Surimi</p>
                <p className="text-muted-foreground text-[10px]">Admin Dashboard</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center shadow-lg shadow-primary/20 mx-auto">
            <span className="text-white font-bold text-sm">S</span>
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-sidebar-accent/50 border border-sidebar-border text-sidebar-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-sidebar-primary/50 focus:ring-1 focus:ring-sidebar-primary/20"
            />
          </div>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-5">
        {menuSections.map((section) => (
          <div key={section.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    whileHover={{ x: collapsed ? 0 : 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-sidebar-primary/15 text-sidebar-primary font-medium"
                        : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-sidebar-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-sidebar-primary" : ""}`} />
                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden text-[13px]"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-all"
        >
          {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          {!collapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-all"
        >
          {collapsed ? <ChevronRight className="w-[18px] h-[18px]" /> : <ChevronLeft className="w-[18px] h-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-all"
        >
          <Home className="w-[18px] h-[18px]" />
          {!collapsed && <span>Back to Site</span>}
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-[18px] h-[18px]" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default OwnerSidebar;

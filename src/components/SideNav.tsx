import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Users, Layers, Package, Lightbulb,
  HelpCircle, MessageSquare, Menu, X, Globe, Briefcase, Star, BookOpen,
  LayoutDashboard, Shield
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

const sectionItems = [
  { key: "nav.home", icon: Home, href: "#home" },
  { key: "nav.about", icon: Users, href: "#about" },
  { key: "nav.mirror", icon: Layers, href: "#mirror" },
  { key: "nav.solutions", icon: Lightbulb, href: "#solutions" },
  { key: "nav.packages", icon: Package, href: "#packages" },
  { key: "nav.portfolio", icon: Briefcase, href: "#portfolio" },
  { key: "nav.testimonials", icon: Star, href: "#testimonials" },
  { key: "nav.faq", icon: HelpCircle, href: "#faq" },
  { key: "nav.blog", icon: BookOpen, href: "#blog" },
  { key: "nav.contact", icon: MessageSquare, href: "#contact" },
];

const pageItems = [
  { key: "nav.dashboard", icon: LayoutDashboard, route: "/dashboard" },
  { key: "nav.admin", icon: Shield, route: "/admin" },
];

const SideNav = () => {
  const { t, lang, setLang, langLabels, langOrder } = useLanguage();
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleClick = (href: string) => {
    setActive(href);
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const isRtl = lang === "ar";

  const cycleLang = () => {
    setLangMenuOpen(!langMenuOpen);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 z-50 p-3 glass rounded-lg neon-border md:hidden"
        style={{ [isRtl ? "right" : "left"]: "1rem" }}
      >
        {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
      </button>

      {/* Language switcher - top corner */}
      <div className="fixed top-4 z-50 flex items-center gap-2" style={{ [isRtl ? "left" : "right"]: "1rem" }}>
        <ThemeToggle />
        <button
          onClick={cycleLang}
          className="p-3 glass rounded-lg neon-border flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <Globe className="w-4 h-4" />
          {langLabels[lang]}
        </button>
        <AnimatePresence>
          {langMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-14 end-0 glass-strong rounded-xl neon-border overflow-hidden min-w-[120px]"
            >
              {langOrder.map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setLangMenuOpen(false); }}
                  className={`w-full px-4 py-2.5 text-sm text-start transition-colors ${
                    lang === l ? "text-primary bg-primary/10" : "text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {langLabels[l]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop sidebar */}
      <nav
        className="fixed top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2 p-2 glass-strong rounded-2xl neon-border"
        style={{ [isRtl ? "right" : "left"]: "1rem" }}
      >
        {navItems.map((item) => (
          <div
            key={item.key}
            className="relative"
            onMouseEnter={() => setHovered(item.key)}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              onClick={() => handleClick(item.href)}
              className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                active === item.href
                  ? "bg-primary/20 text-primary neon-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {hovered === item.key && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {t(item.key)}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        ))}
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 100 : -100 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-4 md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleClick(item.href)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-lg transition-all ${
                  active === item.href
                    ? "text-primary neon-glow bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {t(item.key)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideNav;

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Globe, Key, Save } from "lucide-react";

const SettingsPanel = () => {
  const [darkMode, setDarkMode] = useState(!document.documentElement.classList.contains("light"));

  const toggleTheme = () => {
    document.documentElement.classList.toggle("light");
    setDarkMode(!darkMode);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-semibold text-foreground">Settings</h2>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5 space-y-4"
      >
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-400" />}
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Dark Mode</span>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-secondary"}`}
          >
            <motion.div
              animate={{ x: darkMode ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white"
            />
          </button>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5 space-y-4"
      >
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          Language
        </h3>
        <p className="text-xs text-muted-foreground">
          Language settings are managed from the main site's language switcher. The dashboard interface follows the site language.
        </p>
      </motion.div>

      {/* API Keys placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-5 space-y-4"
      >
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" />
          API & Integrations
        </h3>
        <p className="text-xs text-muted-foreground">
          API keys and payment gateway settings are managed securely through Lovable Cloud's secrets manager. Contact support to configure integrations.
        </p>
      </motion.div>
    </div>
  );
};

export default SettingsPanel;

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  const sections = [
    { title: t("privacy.section1.title"), content: t("privacy.section1.content") },
    { title: t("privacy.section2.title"), content: t("privacy.section2.content") },
    { title: t("privacy.section3.title"), content: t("privacy.section3.content") },
    { title: t("privacy.section4.title"), content: t("privacy.section4.content") },
    { title: t("privacy.section5.title"), content: t("privacy.section5.content") },
  ];

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("privacy.back")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl neon-border p-8 md:p-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              {t("privacy.title")}
            </h1>
          </div>

          <p className="text-muted-foreground text-sm mb-10">
            {t("privacy.lastUpdated")}: 2026-02-16
          </p>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 neon-border"
              >
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  {i + 1}. {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

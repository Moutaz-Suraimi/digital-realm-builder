import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "967780930635";

const ContactSection = () => {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleWhatsApp = () => {
    const msg = lang === "ar"
      ? `مرحباً، أنا ${form.name || "عميل جديد"}. ${form.message || "أرغب في التواصل معكم."}`
      : `Hello, I'm ${form.name || "a new client"}. ${form.message || "I'd like to get in touch."}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center gradient-text mb-12"
        >
          {t("contact.title")}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl p-8 neon-border"
        >
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder={t("contact.name")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
            <input
              type="email"
              placeholder={t("contact.email")}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
            <textarea
              placeholder={t("contact.message")}
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 py-3 rounded-xl gradient-purple text-primary-foreground font-medium flex items-center justify-center gap-2 neon-glow hover:shadow-[0_0_30px_hsl(265_90%_60%/0.3)] transition-shadow">
              <Send className="w-4 h-4" />
              {t("contact.send")}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 py-3 rounded-xl glass neon-border text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {t("contact.whatsapp")}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;

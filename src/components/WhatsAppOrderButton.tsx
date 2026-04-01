import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WHATSAPP_NUMBER = "967780930635";

interface WhatsAppOrderButtonProps {
  serviceName?: string;
  details?: string;
  userName?: string;
  className?: string;
  variant?: "default" | "small" | "icon";
}

const WhatsAppOrderButton = ({
  serviceName,
  details,
  userName,
  className = "",
  variant = "default",
}: WhatsAppOrderButtonProps) => {
  const { t } = useLanguage();

  const handleClick = () => {
    let msg: string;
    if (serviceName || details) {
      const parts = [
        "Hello, I want to request a service:",
        userName ? `\nName: ${userName}` : "",
        serviceName ? `\nService: ${serviceName}` : "",
        details ? `\nDetails: ${details}` : "",
        "\n\nPlease contact me.",
      ];
      msg = parts.filter(Boolean).join("");
    } else {
      msg = "Hello, I'm interested in your services.";
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (variant === "icon") {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`p-3 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors hover:shadow-emerald-500/30 hover:shadow-xl ${className}`}
        title={t("wa.order") || "Order via WhatsApp"}
      >
        <MessageCircle className="w-5 h-5" />
      </motion.button>
    );
  }

  if (variant === "small") {
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-500/20 ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(37, 211, 102, 0.3)" }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold text-base hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      {t("wa.order") || "Order via WhatsApp"}
    </motion.button>
  );
};

export default WhatsAppOrderButton;

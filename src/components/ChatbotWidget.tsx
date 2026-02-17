import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";

const WHATSAPP_NUMBER = "967780930635";

interface Message {
  role: "bot" | "user";
  text: string;
}

const ChatbotWidget = () => {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasOpened, setHasOpened] = useState(false);

  const quickReplies = [
    { key: "chatbot.quick.pricing", section: "packages" },
    { key: "chatbot.quick.portfolio", section: "portfolio" },
    { key: "chatbot.quick.contact", section: "contact" },
    { key: "chatbot.quick.services", section: "solutions" },
  ];

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      setMessages([{ role: "bot", text: t("chatbot.welcome") }]);
    }
  };

  const handleQuickReply = (key: string, section: string) => {
    const userText = t(key);
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    // Bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: t(`chatbot.reply.${section}`) },
      ]);
    }, 600);

    // Scroll to section
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    // Direct to WhatsApp for custom queries
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: t("chatbot.redirect") },
      ]);
      setTimeout(() => {
        const msg =
          lang === "ar"
            ? `مرحباً، ${userText}`
            : lang === "zh"
            ? `您好，${userText}`
            : `Hello, ${userText}`;
        window.open(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
          "_blank"
        );
      }, 1200);
    }, 800);
  };

  const isRtl = lang === "ar";

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpen}
            className="fixed bottom-6 z-50 w-14 h-14 rounded-full gradient-purple text-primary-foreground flex items-center justify-center neon-glow-strong cursor-pointer"
            style={{ [isRtl ? "left" : "right"]: "1.5rem" }}
          >
            <MessageCircle className="w-6 h-6" />
            {/* Pulse indicator */}
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent animate-ping" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 z-50 w-[340px] max-h-[480px] flex flex-col glass-strong rounded-2xl neon-border overflow-hidden"
            style={{ [isRtl ? "left" : "right"]: "1.5rem" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 gradient-purple">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">
                    {t("chatbot.title")}
                  </p>
                  <p className="text-[10px] text-primary-foreground/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    {t("chatbot.online")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors text-primary-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[280px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "gradient-purple text-primary-foreground rounded-br-sm"
                        : "glass neon-border text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "bot" && (
                      <Sparkles className="w-3 h-3 text-primary inline mr-1 mb-0.5" />
                    )}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map((qr) => (
                <button
                  key={qr.key}
                  onClick={() => handleQuickReply(qr.key, qr.section)}
                  className="px-3 py-1.5 rounded-full text-xs glass neon-border text-primary hover:bg-primary/10 transition-colors"
                >
                  {t(qr.key)}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-1">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("chatbot.placeholder")}
                  className="flex-1 px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={handleSend}
                  className="p-2 rounded-xl gradient-purple text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;

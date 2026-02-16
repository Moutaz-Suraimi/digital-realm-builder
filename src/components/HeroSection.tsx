import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const WHATSAPP = "https://wa.me/967780930635";

const HeroSection = () => {
  const { t, lang } = useLanguage();
  const [typedText, setTypedText] = useState("");
  const [showCTAs, setShowCTAs] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState("");

  const fullText = t("hero.ai.message");

  // Typewriter effect
  useEffect(() => {
    setTypedText("");
    setShowCTAs(false);
    setAiResponse("");
    setActiveButton(null);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowCTAs(true), 400);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [fullText]);

  const buttons = [
    { key: "build", section: "solutions", color: "from-primary to-accent" },
    { key: "sell", section: "packages", color: "from-accent to-[hsl(var(--neon-blue))]" },
    { key: "grow", section: "portfolio", color: "from-[hsl(var(--neon-blue))] to-primary" },
  ];

  const handleButtonClick = useCallback((key: string, section: string) => {
    setActiveButton(key);
    setAiResponse(t(`hero.ai.${key}`));
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 1800);
  }, [t]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-6 py-20">
        {/* AI Orb Entity */}
        <motion.div
          className="relative mb-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            style={{ width: 180, height: 180, top: -15, left: -15 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          {/* Second ring */}
          <motion.div
            className="absolute rounded-full border border-accent/20"
            style={{ width: 220, height: 220, top: -35, left: -35 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          {/* Core orb */}
          <motion.div
            className="relative w-[150px] h-[150px] rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 40% 35%, 
                hsl(var(--neon-purple) / 0.8), 
                hsl(var(--neon-violet) / 0.5), 
                hsl(var(--neon-blue) / 0.3), 
                transparent 70%)`,
            }}
            animate={{
              boxShadow: [
                "0 0 40px hsl(265 90% 60% / 0.4), 0 0 80px hsl(265 90% 60% / 0.2), 0 0 120px hsl(275 85% 55% / 0.1)",
                "0 0 60px hsl(265 90% 60% / 0.6), 0 0 100px hsl(265 90% 60% / 0.3), 0 0 160px hsl(275 85% 55% / 0.15)",
                "0 0 40px hsl(265 90% 60% / 0.4), 0 0 80px hsl(265 90% 60% / 0.2), 0 0 120px hsl(275 85% 55% / 0.1)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Inner glow core */}
            <motion.div
              className="w-16 h-16 rounded-full bg-primary/60 blur-sm"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            {/* Animated particles around orb */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI * 2) / 6) * 90, 0],
                  y: [0, Math.sin((i * Math.PI * 2) / 6) * 90, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
          {/* Active state reaction */}
          <AnimatePresence>
            {activeButton && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ width: 150, height: 150 }}
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 2.5, opacity: [0.6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="w-full h-full rounded-full gradient-purple opacity-40" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Brand tag */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6"
        >
          الصُرَيْمي ميديا — Surimi Media
        </motion.p>

        {/* AI typewriter message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-2xl px-6 py-5 md:px-8 md:py-6 mb-8 max-w-2xl w-full text-center neon-border"
        >
          <p className="text-base md:text-lg text-foreground leading-relaxed min-h-[3.5rem]">
            {typedText}
            <motion.span
              className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </p>
        </motion.div>

        {/* AI response after button click */}
        <AnimatePresence>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="glass rounded-xl px-5 py-3 mb-6 max-w-lg text-center"
            >
              <p className="text-sm text-primary font-medium">{aiResponse}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D CTA Buttons */}
        <AnimatePresence>
          {showCTAs && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
            >
              {buttons.map((btn, i) => (
                <motion.button
                  key={btn.key}
                  initial={{ opacity: 0, y: 30, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  whileHover={{
                    scale: 1.08,
                    rotateY: -5,
                    rotateX: 5,
                    boxShadow: "0 20px 50px hsl(265 90% 60% / 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleButtonClick(btn.key, btn.section)}
                  className={`relative px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-lg md:text-xl
                    text-primary-foreground bg-gradient-to-r ${btn.color}
                    neon-glow transition-all duration-300 cursor-pointer
                    ${activeButton === btn.key ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                  style={{ transformStyle: "preserve-3d", perspective: "600px" }}
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 rounded-2xl overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </span>
                  <span className="relative z-10">{t(`hero.${btn.key}`)}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secondary CTA */}
        <motion.a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: showCTAs ? 1 : 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          {t("hero.cta")}
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;

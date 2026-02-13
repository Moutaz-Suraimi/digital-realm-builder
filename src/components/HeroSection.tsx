import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const WHATSAPP = "https://wa.me/967780930635";

const HeroSection = () => {
  const { t } = useLanguage();

  const words = [
    { text: t("hero.build"), delay: 0 },
    { text: "→", delay: 0.3 },
    { text: t("hero.sell"), delay: 0.6 },
    { text: "→", delay: 0.9 },
    { text: t("hero.grow"), delay: 1.2 },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      {/* Floating geometry */}
      <motion.div
        className="absolute top-20 right-20 w-20 h-20 border border-primary/20 rounded-lg"
        animate={{ rotate: 360, y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-32 left-32 w-16 h-16 border border-accent/20 rounded-full"
        animate={{ rotate: -360, y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-12 h-12 border border-neon-blue/20"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        animate={{ rotate: 180, scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Brand name */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-8"
        >
          الصُرَيْمي ميديا — Surimi Media
        </motion.p>

        {/* Main headline */}
        <div className="flex items-center justify-center gap-3 md:gap-6 mb-8">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: word.delay, duration: 0.5 }}
              className={`text-4xl md:text-7xl lg:text-8xl font-bold ${
                word.text === "→" ? "text-muted-foreground text-3xl md:text-5xl" : "gradient-text neon-text"
              }`}
            >
              {word.text}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTA */}
        <motion.a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block px-8 py-4 rounded-2xl gradient-purple text-primary-foreground font-semibold text-lg neon-glow-strong hover:shadow-[0_0_40px_hsl(265_90%_60%/0.4)] transition-shadow duration-300"
        >
          {t("hero.cta")}
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;

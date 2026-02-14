import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Volume2, VolumeX, SkipForward } from "lucide-react";

const PARTICLE_COUNT = 60;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const generateParticles = (): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 3,
  }));

const introText: Record<string, { line1: string; line2: string }> = {
  ar: {
    line1: "مرحباً بك…",
    line2: "لقد دخلت الآن عالم الصُرَيْمي الرقمي",
  },
  en: {
    line1: "Welcome…",
    line2: "You have entered the digital world of Surimi Media",
  },
};

const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const { lang } = useLanguage();
  const [phase, setPhase] = useState<"particles" | "logo" | "text" | "fadeout">("particles");
  const [muted, setMuted] = useState(true);
  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");
  const [particles] = useState(generateParticles);
  const timerRef = useRef<number>();

  const text = introText[lang] || introText.en;

  const skip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("fadeout");
    setTimeout(onComplete, 600);
  }, [onComplete]);

  // Phase progression
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 2000);
    const t2 = setTimeout(() => setPhase("text"), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (phase !== "text") return;

    let i = 0;
    const line1 = text.line1;
    const line2 = text.line2;

    const typeLine1 = () => {
      if (i <= line1.length) {
        setTypedLine1(line1.slice(0, i));
        i++;
        timerRef.current = window.setTimeout(typeLine1, 80);
      } else {
        i = 0;
        timerRef.current = window.setTimeout(typeLine2, 400);
      }
    };

    const typeLine2 = () => {
      if (i <= line2.length) {
        setTypedLine2(line2.slice(0, i));
        i++;
        timerRef.current = window.setTimeout(typeLine2, 50);
      } else {
        timerRef.current = window.setTimeout(() => {
          setPhase("fadeout");
          setTimeout(onComplete, 800);
        }, 2000);
      }
    };

    typeLine1();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, text, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "fadeout" ? (
        <motion.div
          key="intro"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* Floating particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: `hsl(var(--neon-purple) / ${0.3 + Math.random() * 0.5})`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0.3, 0.8, 0],
                scale: [0, 1.5, 1, 1.5, 0],
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Convergence glow */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.3), transparent 70%)",
            }}
            animate={{
              scale: phase === "logo" || phase === "text" ? [1, 1.4, 1.1] : [0.5, 0.8, 0.5],
              opacity: phase === "logo" || phase === "text" ? 0.8 : 0.3,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo */}
          <div className="relative z-10 text-center px-6">
            <AnimatePresence mode="wait">
              {(phase === "logo" || phase === "text") && (
                <motion.div
                  key="logo-text"
                  initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold gradient-text neon-text mb-2">
                    الصُرَيْمي ميديا
                  </h1>
                  <p className="text-sm md:text-base tracking-[0.3em] text-muted-foreground uppercase">
                    Surimi Media
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Typewriter text */}
            {phase === "text" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 space-y-2"
              >
                <p className="text-xl md:text-2xl text-foreground font-medium min-h-[2rem]">
                  {typedLine1}
                  {typedLine1.length < text.line1.length && (
                    <span className="inline-block w-0.5 h-6 bg-primary animate-pulse ml-0.5" />
                  )}
                </p>
                <p className="text-lg md:text-xl text-muted-foreground min-h-[1.75rem]">
                  {typedLine2}
                  {typedLine1.length >= text.line1.length && typedLine2.length < text.line2.length && (
                    <span className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-0.5" />
                  )}
                </p>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 right-8 flex items-center gap-3 z-20">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 glass rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={skip}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default CinematicIntro;

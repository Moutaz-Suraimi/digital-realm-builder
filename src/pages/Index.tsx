import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import SideNav from "@/components/SideNav";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DigitalMirror from "@/components/DigitalMirror";
import SolutionsSection from "@/components/SolutionsSection";
import PackagesSection from "@/components/PackagesSection";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import CinematicIntro from "@/components/CinematicIntro";
import ChatbotWidget from "@/components/ChatbotWidget";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { useLanguage } from "@/contexts/LanguageContext";

const INTRO_KEY = "surimi_intro_seen";
const WHATSAPP_NUMBER = "967780930635";

// Cinematic section wrapper with fade + slide-up on scroll entry
const SectionReveal = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const Index = () => {
  const { lang } = useLanguage();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(INTRO_KEY)) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem(INTRO_KEY, "1");
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ScrollProgressBar />
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      <SideNav />
      <main className={lang === "ar" ? "md:mr-16" : "md:ml-16"}>
        <HeroSection />
        <SectionReveal><AboutSection /></SectionReveal>
        <SectionReveal><DigitalMirror /></SectionReveal>
        <SectionReveal><SolutionsSection /></SectionReveal>
        <SectionReveal><PackagesSection /></SectionReveal>
        <SectionReveal><PortfolioSection /></SectionReveal>
        <SectionReveal><TestimonialsSection /></SectionReveal>
        <SectionReveal><FAQSection /></SectionReveal>
        <SectionReveal><BlogSection /></SectionReveal>
        <SectionReveal><ContactSection /></SectionReveal>
        <FooterSection />
      </main>
      <ChatbotWidget />

      {/* Floating WhatsApp Button */}
      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello, I'm interested in your services.")}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", bounce: 0.4 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-emerald-500/50 transition-all"
        style={{ animation: "pulse 2s infinite" }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    </div>
  );
};

export default Index;

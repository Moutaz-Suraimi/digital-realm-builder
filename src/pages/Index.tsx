import { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DigitalMirror from "@/components/DigitalMirror";
import SolutionsSection from "@/components/SolutionsSection";
import PackagesSection from "@/components/PackagesSection";
import PortfolioSection from "@/components/PortfolioSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import CinematicIntro from "@/components/CinematicIntro";
import { useLanguage } from "@/contexts/LanguageContext";

const INTRO_KEY = "surimi_intro_seen";

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
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      <SideNav />
      <main className={lang === "ar" ? "md:mr-16" : "md:ml-16"}>
        <HeroSection />
        <AboutSection />
        <DigitalMirror />
        <SolutionsSection />
        <PackagesSection />
        <PortfolioSection />
        <FAQSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Index;

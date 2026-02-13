import SideNav from "@/components/SideNav";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DigitalMirror from "@/components/DigitalMirror";
import SolutionsSection from "@/components/SolutionsSection";
import PackagesSection from "@/components/PackagesSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SideNav />
      <main className={lang === "ar" ? "md:mr-16" : "md:ml-16"}>
        <HeroSection />
        <AboutSection />
        <DigitalMirror />
        <SolutionsSection />
        <PackagesSection />
        <FAQSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Index;

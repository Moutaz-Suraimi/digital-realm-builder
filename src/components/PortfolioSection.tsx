import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ExternalLink, MessageCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const WHATSAPP_NUMBER = "967780930635";

interface Project {
  title: { ar: string; en: string; zh: string };
  category: { ar: string; en: string; zh: string };
  description: { ar: string; en: string; zh: string };
  tech: string[];
  gradient: string;
}

const projects: Project[] = [
  {
    title: { ar: "متجر أزياء إلكتروني", en: "Fashion E-Commerce Store", zh: "时尚电商平台" },
    category: { ar: "تجارة إلكترونية", en: "E-Commerce", zh: "电子商务" },
    description: {
      ar: "متجر إلكتروني متكامل مع نظام دفع وإدارة مخزون وتطبيق جوال",
      en: "Full-featured online store with payment system, inventory management, and mobile app",
      zh: "功能齐全的在线商店，配有支付系统、库存管理和移动应用",
    },
    tech: ["React", "Node.js", "Stripe"],
    gradient: "from-neon-purple to-neon-violet",
  },
  {
    title: { ar: "منصة تعليمية", en: "Learning Platform", zh: "学习平台" },
    category: { ar: "منصة رقمية", en: "Digital Platform", zh: "数字平台" },
    description: {
      ar: "منصة تعليمية تفاعلية مع بث مباشر وشهادات رقمية",
      en: "Interactive learning platform with live streaming and digital certificates",
      zh: "互动学习平台，配有直播和数字证书",
    },
    tech: ["Next.js", "WebRTC", "PostgreSQL"],
    gradient: "from-neon-violet to-neon-blue",
  },
  {
    title: { ar: "تطبيق توصيل طعام", en: "Food Delivery App", zh: "外卖配送应用" },
    category: { ar: "تطبيق جوال", en: "Mobile App", zh: "移动应用" },
    description: {
      ar: "تطبيق توصيل مع تتبع مباشر وإشعارات فورية",
      en: "Delivery app with real-time tracking and push notifications",
      zh: "配送应用，实时跟踪和推送通知",
    },
    tech: ["React Native", "Firebase", "Maps API"],
    gradient: "from-neon-blue to-neon-purple",
  },
  {
    title: { ar: "موقع شركة عقارية", en: "Real Estate Website", zh: "房地产网站" },
    category: { ar: "موقع ويب", en: "Website", zh: "网站" },
    description: {
      ar: "موقع عقاري احترافي مع جولات افتراضية ثلاثية الأبعاد",
      en: "Professional real estate website with 3D virtual tours",
      zh: "专业房地产网站，配有3D虚拟游览",
    },
    tech: ["Three.js", "WordPress", "SEO"],
    gradient: "from-neon-purple to-neon-blue",
  },
  {
    title: { ar: "نظام إدارة مطاعم", en: "Restaurant Management", zh: "餐厅管理系统" },
    category: { ar: "نظام مخصص", en: "Custom System", zh: "定制系统" },
    description: {
      ar: "نظام شامل لإدارة الطلبات والمخزون والموظفين",
      en: "Comprehensive system for order, inventory, and staff management",
      zh: "综合订单、库存和员工管理系统",
    },
    tech: ["Vue.js", "Laravel", "MySQL"],
    gradient: "from-neon-violet to-neon-purple",
  },
  {
    title: { ar: "هوية بصرية كاملة", en: "Full Brand Identity", zh: "完整品牌形象" },
    category: { ar: "هوية علامة", en: "Branding", zh: "品牌设计" },
    description: {
      ar: "تصميم هوية بصرية شاملة من الشعار إلى المواد التسويقية",
      en: "Complete visual identity from logo to marketing materials",
      zh: "从标志到营销材料的完整视觉形象设计",
    },
    tech: ["Figma", "Illustrator", "Motion"],
    gradient: "from-neon-blue to-neon-violet",
  },
];

const PortfolioSection = () => {
  const { t, lang } = useLanguage();
  const l = lang as "ar" | "en" | "zh";

  const inquire = (projectName: string) => {
    const msg =
      lang === "ar"
        ? `مرحباً، أرغب في مشروع مشابه لـ: ${projectName}`
        : lang === "zh"
        ? `您好，我想要一个类似的项目：${projectName}`
        : `Hello, I'd like a project similar to: ${projectName}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <section id="portfolio" className="section-padding relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold text-center gradient-text mb-4">
            {t("portfolio.title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
            {t("portfolio.subtitle")}
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, rotateY: -3, rotateX: 2 }}
                className="glass rounded-2xl overflow-hidden neon-border card-3d group h-full"
              >
                {/* Gradient header */}
                <div
                  className={`h-40 bg-gradient-to-br ${project.gradient} relative flex items-center justify-center`}
                >
                  <div className="absolute inset-0 bg-background/20" />
                  <ExternalLink className="w-10 h-10 text-primary-foreground/60 group-hover:text-primary-foreground transition-colors relative z-10" />
                  <span className="absolute top-3 start-3 px-3 py-1 rounded-full text-xs font-medium glass text-foreground">
                    {project.category[l]}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {project.title[l]}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {project.description[l]}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((techName) => (
                      <span
                        key={techName}
                        className="px-2 py-0.5 rounded-md text-xs bg-secondary/60 text-secondary-foreground"
                      >
                        {techName}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => inquire(project.title[l])}
                    className="w-full py-2.5 rounded-xl glass neon-border text-primary font-medium hover:bg-primary/10 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t("portfolio.cta")}
                  </button>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;

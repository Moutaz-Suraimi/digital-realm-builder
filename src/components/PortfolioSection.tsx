import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, MessageCircle, Globe, ShoppingBag, Palette, Megaphone, LayoutGrid } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const WHATSAPP_NUMBER = "967780930635";
type LangKey = "ar" | "en" | "zh";

// ─── CATEGORY FILTERS ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all",        icon: LayoutGrid,    label: { ar: "الكل",             en: "All",        zh: "全部" } },
  { key: "website",    icon: Globe,         label: { ar: "المواقع",           en: "Websites",   zh: "网站" } },
  { key: "ecommerce",  icon: ShoppingBag,   label: { ar: "التجارة الإلكترونية", en: "E-Commerce", zh: "电子商务" } },
  { key: "branding",   icon: Palette,       label: { ar: "الهوية البصرية",    en: "Branding",   zh: "品牌设计" } },
  { key: "ads",        icon: Megaphone,     label: { ar: "الإعلانات",         en: "Ads",        zh: "广告" } },
] as const;

// ─── PROJECT DATA ──────────────────────────────────────────────────────────────
interface Project {
  id: number;
  category: "website" | "ecommerce" | "branding" | "ads";
  title:       { ar: string; en: string; zh: string };
  subtitle:    { ar: string; en: string; zh: string };
  description: { ar: string; en: string; zh: string };
  results:     { ar: string; en: string; zh: string }[];
  tech: string[];
  gradient: string;
  emoji: string;
}

const projects: Project[] = [
  {
    id: 1,
    category: "ecommerce",
    emoji: "🛍️",
    gradient: "from-[hsl(265,90%,35%)] to-[hsl(275,85%,25%)]",
    title:       { ar: "متجر أزياء إلكتروني", en: "Fashion E-Commerce Store", zh: "时尚电商平台" },
    subtitle:    { ar: "تجارة إلكترونية", en: "E-Commerce", zh: "电子商务" },
    description: { ar: "متجر إلكتروني متكامل مع نظام دفع وإدارة مخزون وتطبيق جوال", en: "Full-featured online store with payment system, inventory management, and mobile app", zh: "功能齐全的在线商店，配有支付系统、库存管理和移动应用" },
    results: [
      { ar: "زيادة 340% في المبيعات الشهرية", en: "340% increase in monthly sales", zh: "月销售额增长340%" },
      { ar: "متوسط وقت تحميل 1.2 ثانية", en: "1.2s average load time", zh: "平均加载时间1.2秒" },
      { ar: "تقييم 4.9/5 من العملاء", en: "4.9/5 customer rating", zh: "客户评分4.9/5" },
    ],
    tech: ["React", "Node.js", "Stripe", "PostgreSQL"],
  },
  {
    id: 2,
    category: "website",
    emoji: "🎓",
    gradient: "from-[hsl(230,85%,35%)] to-[hsl(265,90%,30%)]",
    title:       { ar: "منصة تعليمية تفاعلية", en: "Interactive Learning Platform", zh: "互动学习平台" },
    subtitle:    { ar: "منصة رقمية", en: "Digital Platform", zh: "数字平台" },
    description: { ar: "منصة تعليمية تفاعلية مع بث مباشر وشهادات رقمية ولوحة تحكم", en: "Interactive learning platform with live streaming, digital certificates, and dashboard", zh: "互动学习平台，配有直播、数字证书和控制台" },
    results: [
      { ar: "10,000+ طالب مسجّل", en: "10,000+ enrolled students", zh: "10,000+名注册学生" },
      { ar: "معدل إتمام 78%", en: "78% course completion rate", zh: "课程完成率78%" },
      { ar: "تشغيل 24/7 بدون انقطاع", en: "24/7 uptime with no downtime", zh: "全天候运行无中断" },
    ],
    tech: ["Next.js", "WebRTC", "PostgreSQL", "Redis"],
  },
  {
    id: 3,
    category: "website",
    emoji: "🏠",
    gradient: "from-[hsl(275,85%,30%)] to-[hsl(230,85%,30%)]",
    title:       { ar: "موقع شركة عقارية", en: "Real Estate Website", zh: "房地产网站" },
    subtitle:    { ar: "موقع ويب", en: "Website", zh: "网站" },
    description: { ar: "موقع عقاري احترافي مع جولات افتراضية ثلاثية الأبعاد وخرائط تفاعلية", en: "Professional real estate website with 3D virtual tours and interactive maps", zh: "专业房地产网站，配有3D虚拟游览和交互地图" },
    results: [
      { ar: "زيادة 200% في العملاء المحتملين", en: "200% increase in leads", zh: "线索增长200%" },
      { ar: "متوسط وقت على الموقع 6 دقائق", en: "6 min average session time", zh: "平均会话时间6分钟" },
      { ar: "أول صفحة جوجل محلياً", en: "First page Google local", zh: "谷歌本地首页排名" },
    ],
    tech: ["Three.js", "WordPress", "Google Maps", "SEO"],
  },
  {
    id: 4,
    category: "ecommerce",
    emoji: "🍕",
    gradient: "from-[hsl(265,90%,30%)] to-[hsl(230,85%,25%)]",
    title:       { ar: "نظام إدارة مطاعم", en: "Restaurant Management System", zh: "餐厅管理系统" },
    subtitle:    { ar: "نظام مخصص", en: "Custom System", zh: "定制系统" },
    description: { ar: "نظام شامل لإدارة الطلبات والمخزون والموظفين مع تطبيق توصيل", en: "Comprehensive system for order, inventory, staff management with delivery app", zh: "综合订单、库存、员工管理系统，含配送应用" },
    results: [
      { ar: "تقليل وقت الطلب بنسبة 60%", en: "60% reduction in order time", zh: "订单时间减少60%" },
      { ar: "إدارة 500+ طلب يومياً", en: "500+ daily orders managed", zh: "每日管理500+订单" },
      { ar: "ROI 280% في 6 أشهر", en: "280% ROI in 6 months", zh: "6个月内ROI达280%" },
    ],
    tech: ["Vue.js", "Laravel", "MySQL", "Firebase"],
  },
  {
    id: 5,
    category: "branding",
    emoji: "💎",
    gradient: "from-[hsl(230,85%,30%)] to-[hsl(275,85%,25%)]",
    title:       { ar: "هوية بصرية كاملة", en: "Full Brand Identity", zh: "完整品牌形象" },
    subtitle:    { ar: "هوية العلامة", en: "Branding", zh: "品牌设计" },
    description: { ar: "تصميم هوية بصرية شاملة من الشعار إلى المواد التسويقية والمطبوعات", en: "Complete visual identity from logo to marketing materials and print", zh: "从标志到营销材料和印刷品的完整视觉形象设计" },
    results: [
      { ar: "زيادة 150% في التعرف على العلامة", en: "150% increase in brand recognition", zh: "品牌认知度提升150%" },
      { ar: "15+ عنصر هوية بصرية", en: "15+ brand identity elements", zh: "15+个品牌视觉元素" },
      { ar: "تسليم خلال 14 يوم عمل", en: "Delivered in 14 business days", zh: "14个工作日内交付" },
    ],
    tech: ["Figma", "Illustrator", "Photoshop", "After Effects"],
  },
  {
    id: 6,
    category: "ads",
    emoji: "📈",
    gradient: "from-[hsl(275,85%,25%)] to-[hsl(265,90%,35%)]",
    title:       { ar: "حملة إعلانية متكاملة", en: "Full Ads Campaign", zh: "整合广告活动" },
    subtitle:    { ar: "إعلانات مدفوعة", en: "Paid Ads", zh: "付费广告" },
    description: { ar: "حملات إعلانية على Meta وGoogle مع اختبار A/B وتحليلات متقدمة", en: "Meta and Google ad campaigns with A/B testing and advanced analytics", zh: "Meta和Google广告活动，含A/B测试和高级分析" },
    results: [
      { ar: "تخفيض تكلفة النقرة بنسبة 45%", en: "45% reduction in CPC", zh: "每次点击费用降低45%" },
      { ar: "عائد إعلاني 8x (ROAS)", en: "8x return on ad spend (ROAS)", zh: "广告支出回报8倍（ROAS）" },
      { ar: "2M+ مشاهدة شهرياً", en: "2M+ monthly impressions", zh: "每月2M+展示量" },
    ],
    tech: ["Meta Ads", "Google Ads", "Analytics", "A/B Testing"],
  },
];

// ─── LIGHTBOX MODAL ────────────────────────────────────────────────────────────
const LightboxModal = ({
  project,
  lang,
  onClose,
}: {
  project: Project;
  lang: LangKey;
  onClose: () => void;
}) => {
  const { t } = useLanguage();
  const isRtl = lang === "ar";

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const openWhatsApp = () => {
    const msgs: Record<LangKey, string> = {
      ar: `مرحباً، أريد مشروعاً مشابهاً لـ: ${project.title.ar}. أرجو التواصل لبدء مشروعي.`,
      en: `Hello, I'd like a project similar to: ${project.title.en}. Please contact me to start my project.`,
      zh: `您好，我想要一个类似"${project.title.zh}"的项目，请联系我开始项目。`,
    };
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msgs[lang])}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={e => e.stopPropagation()}
        dir={isRtl ? "rtl" : "ltr"}
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-border/40 shadow-[0_0_80px_hsl(var(--neon-purple)/0.25)] bg-card"
      >
        {/* Header gradient banner */}
        <div className={`h-52 bg-gradient-to-br ${project.gradient} relative flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 bg-background/10" />
          {/* Animated glow orb */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute w-48 h-48 rounded-full bg-primary/30 blur-3xl"
          />
          <span className="text-8xl relative z-10">{project.emoji}</span>
          <span className="absolute top-4 start-4 px-3 py-1.5 rounded-full text-xs font-semibold glass text-foreground border border-white/10">
            {project.subtitle[lang]}
          </span>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full bg-background/60 backdrop-blur flex items-center justify-center border border-white/10 hover:bg-primary/20 transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-5">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{project.title[lang]}</h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">{project.description[lang]}</p>
          </div>

          {/* Results */}
          <div>
            <h4 className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              {lang === "ar" ? "النتائج المحققة" : lang === "zh" ? "项目成果" : "Key Results"}
            </h4>
            <div className="grid gap-2">
              {project.results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-foreground font-medium">{r[lang]}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map(t => (
              <span key={t} className="px-3 py-1 rounded-lg text-xs bg-secondary/60 text-secondary-foreground border border-border/30">
                {t}
              </span>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={openWhatsApp}
            className="w-full py-3.5 rounded-2xl gradient-purple text-primary-foreground font-semibold flex items-center justify-center gap-2 neon-glow text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            {t("portfolio.cta")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── PROJECT CARD ──────────────────────────────────────────────────────────────
const ProjectCard = ({
  project,
  lang,
  onClick,
}: {
  project: Project;
  lang: LangKey;
  onClick: () => void;
}) => {
  const { t } = useLanguage();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      onClick={onClick}
      className="group relative glass rounded-2xl overflow-hidden neon-border cursor-pointer h-full flex flex-col"
    >
      {/* Gradient header */}
      <div className={`h-44 bg-gradient-to-br ${project.gradient} relative flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-background/10" />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
        {/* Glow effect */}
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
          {project.emoji}
        </span>
        {/* External link icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center mt-16 border border-white/20">
            <ExternalLink className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
        {/* Category badge */}
        <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full text-xs font-medium glass text-foreground border border-white/10">
          {project.subtitle[lang]}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
          {project.title[lang]}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
          {project.description[lang]}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 3).map(techName => (
            <span key={techName} className="px-2 py-0.5 rounded-md text-[10px] bg-secondary/60 text-secondary-foreground border border-border/20">
              {techName}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] bg-primary/10 text-primary border border-primary/20">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        <button
          onClick={e => { e.stopPropagation(); onClick(); }}
          className="w-full py-2.5 rounded-xl glass neon-border text-primary font-medium hover:bg-primary/10 transition-colors text-xs flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {t("portfolio.cta")}
        </button>
      </div>
    </motion.div>
  );
};

// ─── MAIN SECTION ──────────────────────────────────────────────────────────────
const PortfolioSection = () => {
  const { t, lang } = useLanguage();
  const l = lang as LangKey;
  const isRtl = lang === "ar";

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = activeFilter === "all"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="portfolio" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/3 end-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 start-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border text-xs font-semibold text-primary mb-4"
            >
              <ExternalLink className="w-3 h-3" />
              {lang === "ar" ? "أعمالنا المميزة" : lang === "zh" ? "精选作品集" : "Featured Work"}
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black gradient-text mb-4">
              {t("portfolio.title")}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
              {t("portfolio.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal delay={0.1}>
          <div className={`flex flex-wrap justify-center gap-2 md:gap-3 mb-12 ${isRtl ? "flex-row-reverse" : ""}`}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeFilter === cat.key;
              return (
                <motion.button
                  key={cat.key}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(cat.key)}
                  className={`relative px-4 py-2 md:px-5 md:py-2.5 rounded-2xl font-semibold text-xs md:text-sm transition-all duration-300 flex items-center gap-2
                    ${isActive
                      ? "gradient-purple text-primary-foreground neon-glow shadow-lg"
                      : "glass neon-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {cat.label[l]}
                  {isActive && (
                    <motion.div
                      layoutId="portfolioActiveTab"
                      className="absolute inset-0 rounded-2xl ring-1 ring-primary/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {/* Project count badge */}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors
                    ${isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                    {cat.key === "all" ? projects.length : projects.filter(p => p.category === cat.key).length}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.07}>
                <ProjectCard
                  project={project}
                  lang={l}
                  onClick={() => setSelectedProject(project)}
                />
              </ScrollReveal>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state (shouldn't happen but safe) */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground"
          >
            <span className="text-4xl mb-4 block">🔍</span>
            <p>{lang === "ar" ? "لا توجد مشاريع في هذا القسم" : lang === "zh" ? "此类别暂无项目" : "No projects in this category"}</p>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <LightboxModal
            project={selectedProject}
            lang={l}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;

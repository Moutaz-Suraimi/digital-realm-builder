import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Star, ChevronDown, MessageCircle,
  Palette, Megaphone, Globe, ShoppingBag, Layers,
  X, BarChart3,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const WHATSAPP_NUMBER = "967780930635";
type LangKey = "ar" | "en" | "zh";

interface PkgCard {
  nameKey: string;
  priceUSD: number;
  priceYER: number;
  features: { ar: string; en: string; zh: string }[];
  badge?: "requested";
  waKey: string;
}

interface PathData {
  key: string;
  icon: React.ElementType;
  labelKey: string;
  packages: PkgCard[];
}

// ─── DATA ──────────────────────────────────────────────────────────────────────

const paths: PathData[] = [
  {
    key: "content",
    icon: Palette,
    labelKey: "packages.tab.content",
    packages: [
      {
        nameKey: "packages.content.basic.name",
        priceUSD: 50,
        priceYER: 26600,
        features: [
          { ar: "منشورات وسائل التواصل الاجتماعي", en: "Social media posts", zh: "社交媒体帖子" },
          { ar: "تنسيق ألوان الهوية التجارية", en: "Branding colors coordination", zh: "品牌配色协调" },
          { ar: "مثالي للمبتدئين", en: "Ideal for beginners", zh: "适合初学者" },
        ],
        waKey: "packages.wa.content.basic",
      },
      {
        nameKey: "packages.content.standard.name",
        priceUSD: 75,
        priceYER: 39900,
        badge: "requested",
        features: [
          { ar: "جميع خدمات الباقة الأساسية", en: "All Basic services", zh: "包含基础套餐所有服务" },
          { ar: "تخطيط تقويم المحتوى", en: "Content calendar planning", zh: "内容日历规划" },
          { ar: "رسومات محسّنة للحملات", en: "Optimized graphics for campaigns", zh: "优化活动图形" },
        ],
        waKey: "packages.wa.content.standard",
      },
      {
        nameKey: "packages.content.premium.name",
        priceUSD: 100,
        priceYER: 53200,
        features: [
          { ar: "جميع خدمات الباقة القياسية", en: "All Standard services", zh: "包含标准套餐所有服务" },
          { ar: "محتوى متحرك ومنشورات فيديو", en: "Animated content, video posts", zh: "动态内容和视频帖子" },
          { ar: "قوالب حملات موسّعة", en: "Extended campaign templates", zh: "扩展活动模板" },
        ],
        waKey: "packages.wa.content.premium",
      },
    ],
  },
  {
    key: "ads",
    icon: Megaphone,
    labelKey: "packages.tab.ads",
    packages: [
      {
        nameKey: "packages.ads.starter.name",
        priceUSD: 75,
        priceYER: 39900,
        features: [
          { ar: "إعداد Meta/Google الأساسي", en: "Meta/Google basic setup", zh: "Meta/Google基础配置" },
          { ar: "استهداف بسيط", en: "Simple targeting", zh: "简单定向" },
        ],
        waKey: "packages.wa.ads.starter",
      },
      {
        nameKey: "packages.ads.growth.name",
        priceUSD: 150,
        priceYER: 79800,
        badge: "requested",
        features: [
          { ar: "إدارة الحملات الكاملة", en: "Full campaign management", zh: "全面活动管理" },
          { ar: "اختبار A/B والتحسين", en: "A/B testing & optimization", zh: "A/B测试与优化" },
          { ar: "تقرير أداء شهري", en: "Monthly performance report", zh: "月度绩效报告" },
        ],
        waKey: "packages.wa.ads.growth",
      },
      {
        nameKey: "packages.ads.pro.name",
        priceUSD: 225,
        priceYER: 119700,
        features: [
          { ar: "حملات متعددة المنصات", en: "Multi-platform campaigns", zh: "多平台活动" },
          { ar: "تحليلات متقدمة وتحسين", en: "Advanced analytics & optimization", zh: "高级分析与优化" },
          { ar: "تعديل استراتيجي مستمر", en: "Continuous strategy adjustment", zh: "持续策略调整" },
        ],
        waKey: "packages.wa.ads.pro",
      },
    ],
  },
  {
    key: "website",
    icon: Globe,
    labelKey: "packages.tab.website",
    packages: [
      {
        nameKey: "packages.web.basic.name",
        priceUSD: 100,
        priceYER: 53200,
        features: [
          { ar: "موقع بسيط بصفحات أساسية", en: "Simple website with basic pages", zh: "包含基础页面的简单网站" },
        ],
        waKey: "packages.wa.web.basic",
      },
      {
        nameKey: "packages.web.dynamic.name",
        priceUSD: 150,
        priceYER: 79800,
        badge: "requested",
        features: [
          { ar: "موقع تفاعلي مع نظام إدارة المحتوى", en: "Interactive website with CMS", zh: "带CMS的交互式网站" },
          { ar: "محسّن للجوال ومحركات البحث", en: "Optimized for mobile & SEO", zh: "移动端与SEO优化" },
        ],
        waKey: "packages.wa.web.dynamic",
      },
      {
        nameKey: "packages.web.custom.name",
        priceUSD: 225,
        priceYER: 119700,
        features: [
          { ar: "تصميم ومميزات مخصصة بالكامل", en: "Fully custom design and features", zh: "完全定制设计和功能" },
        ],
        waKey: "packages.wa.web.custom",
      },
    ],
  },
  {
    key: "ecommerce",
    icon: ShoppingBag,
    labelKey: "packages.tab.ecommerce",
    packages: [
      {
        nameKey: "packages.eco.basic.name",
        priceUSD: 150,
        priceYER: 79800,
        features: [
          { ar: "إعداد متجر إلكتروني بسيط", en: "Simple online store setup", zh: "简单网店设置" },
        ],
        waKey: "packages.wa.eco.basic",
      },
      {
        nameKey: "packages.eco.standard.name",
        priceUSD: 225,
        priceYER: 119700,
        badge: "requested",
        features: [
          { ar: "متجر + تكامل الدفع + نظام إدارة", en: "Store + Payment integration + CMS", zh: "商店+支付集成+CMS" },
        ],
        waKey: "packages.wa.eco.standard",
      },
      {
        nameKey: "packages.eco.full.name",
        priceUSD: 300,
        priceYER: 159600,
        features: [
          { ar: "متجر مخصص + تطبيقات + ميزات متقدمة", en: "Custom store + apps + advanced features", zh: "定制商店+应用+高级功能" },
        ],
        waKey: "packages.wa.eco.full",
      },
    ],
  },
  {
    key: "mixed",
    icon: Layers,
    labelKey: "packages.tab.mixed",
    packages: [
      {
        nameKey: "packages.mix.starter.name",
        priceUSD: 100,
        priceYER: 53200,
        features: [
          { ar: "محتوى أساسي + إعلانات بداية", en: "Basic content + Starter Ads", zh: "基础内容+入门广告" },
        ],
        waKey: "packages.wa.mix.starter",
      },
      {
        nameKey: "packages.mix.growth.name",
        priceUSD: 200,
        priceYER: 106400,
        badge: "requested",
        features: [
          { ar: "محتوى قياسي + إعلانات نمو", en: "Standard Content + Growth Ads", zh: "标准内容+成长广告" },
        ],
        waKey: "packages.wa.mix.growth",
      },
      {
        nameKey: "packages.mix.pro.name",
        priceUSD: 300,
        priceYER: 159600,
        features: [
          { ar: "محتوى مميز + إعلانات احترافية", en: "Premium Content + Pro Ads", zh: "高级内容+专业广告" },
        ],
        waKey: "packages.wa.mix.pro",
      },
    ],
  },
];

// ─── PACKAGE CARD ─────────────────────────────────────────────────────────────

const PackageCard = ({
  pkg,
  lang,
  isExpanded,
  onToggle,
}: {
  pkg: PkgCard;
  lang: LangKey;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const { t } = useLanguage();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: (cy / rect.height) * 10, y: -(cx / rect.width) * 10 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const sendWhatsApp = () => {
    const msg = t(pkg.waKey);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const isRequested = pkg.badge === "requested";

  return (
    <motion.div
      layout
      style={{ rotateX: tilt.x, rotateY: tilt.y, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl p-6 glass neon-border flex flex-col overflow-hidden cursor-default ${
        isRequested
          ? "ring-2 ring-primary/60 shadow-[0_0_30px_hsl(var(--neon-purple)/0.25)]"
          : ""
      }`}
    >
      {/* Ambient gradient top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Most Requested badge */}
      {isRequested && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 end-4 z-10"
        >
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold gradient-purple text-primary-foreground neon-glow shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            {t("packages.requested")}
          </span>
        </motion.div>
      )}

      {/* Package name */}
      <h4 className={`text-lg font-bold text-foreground mb-3 ${isRequested ? "pe-24" : ""}`}>
        {t(pkg.nameKey)}
      </h4>

      {/* Pricing */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">{t("packages.from")}</span>
          <span className="text-3xl font-black gradient-text">${pkg.priceUSD}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {pkg.priceYER.toLocaleString()} {t("packages.yer")}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-4 flex-1">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-secondary-foreground">
            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{f[lang]}</span>
          </li>
        ))}
      </ul>

      {/* Expand toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-3"
      >
        {t(isExpanded ? "packages.less" : "packages.more")}
        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-3 h-3" />
        </motion.span>
      </button>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mb-4"
          >
            <div className="pt-3 border-t border-border/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(`${pkg.nameKey}.desc`)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={sendWhatsApp}
        className="w-full py-3 rounded-xl gradient-purple text-primary-foreground font-semibold flex items-center justify-center gap-2 neon-glow hover:shadow-[0_0_40px_hsl(var(--neon-purple)/0.4)] transition-shadow text-sm"
      >
        <MessageCircle className="w-4 h-4" />
        {t("packages.cta")}
      </motion.button>
    </motion.div>
  );
};

// ─── COMPARE TABLE ────────────────────────────────────────────────────────────

const COMPARE_ROWS: Record<string, { ar: string; en: string; zh: string }[]> = {
  content: [
    { ar: "منشورات السوشيال ميديا", en: "Social media posts", zh: "社交媒体帖子" },
    { ar: "تنسيق ألوان الهوية", en: "Branding colors coordination", zh: "品牌配色协调" },
    { ar: "تخطيط تقويم المحتوى", en: "Content calendar planning", zh: "内容日历规划" },
    { ar: "رسومات محسّنة للحملات", en: "Optimized campaign graphics", zh: "优化活动图形" },
    { ar: "محتوى متحرك وفيديو", en: "Animated content & videos", zh: "动态内容和视频" },
    { ar: "قوالب حملات موسّعة", en: "Extended campaign templates", zh: "扩展活动模板" },
  ],
  ads: [
    { ar: "إعداد Meta/Google الأساسي", en: "Meta/Google basic setup", zh: "Meta/Google基础配置" },
    { ar: "استهداف بسيط", en: "Simple targeting", zh: "简单定向" },
    { ar: "إدارة الحملات الكاملة", en: "Full campaign management", zh: "全面活动管理" },
    { ar: "اختبار A/B", en: "A/B testing", zh: "A/B测试" },
    { ar: "تقرير أداء شهري", en: "Monthly performance report", zh: "月度绩效报告" },
    { ar: "حملات متعددة المنصات", en: "Multi-platform campaigns", zh: "多平台活动" },
    { ar: "تحليلات متقدمة", en: "Advanced analytics", zh: "高级分析" },
  ],
  website: [
    { ar: "صفحات أساسية", en: "Basic pages", zh: "基础页面" },
    { ar: "نموذج اتصال", en: "Contact form", zh: "联系表单" },
    { ar: "نظام إدارة المحتوى (CMS)", en: "Content Management System", zh: "内容管理系统" },
    { ar: "تحسين للجوال (Mobile)", en: "Mobile optimization", zh: "移动端优化" },
    { ar: "تحسين محركات البحث (SEO)", en: "SEO optimization", zh: "SEO优化" },
    { ar: "تصميم مخصص بالكامل", en: "Fully custom design", zh: "完全定制设计" },
  ],
  ecommerce: [
    { ar: "إعداد المتجر الإلكتروني", en: "Online store setup", zh: "网店设置" },
    { ar: "إدارة المنتجات", en: "Product management", zh: "产品管理" },
    { ar: "تكامل بوابة الدفع", en: "Payment gateway integration", zh: "支付网关集成" },
    { ar: "نظام إدارة المحتوى (CMS)", en: "Content Management System", zh: "内容管理系统" },
    { ar: "تطبيقات وإضافات متقدمة", en: "Advanced apps & plugins", zh: "高级应用和插件" },
    { ar: "تصميم مخصص بالكامل", en: "Fully custom design", zh: "完全定制设计" },
  ],
  mixed: [
    { ar: "تصميم محتوى أساسي", en: "Basic content design", zh: "基础内容设计" },
    { ar: "إعلانات بداية", en: "Starter ads", zh: "入门广告" },
    { ar: "تصميم محتوى قياسي", en: "Standard content design", zh: "标准内容设计" },
    { ar: "إعلانات نمو متقدمة", en: "Growth ads", zh: "成长广告" },
    { ar: "تصميم محتوى متكامل", en: "Premium content design", zh: "高级内容设计" },
    { ar: "إعلانات احترافية متعددة المنصات", en: "Pro multi-platform ads", zh: "专业多平台广告" },
  ],
};

// Which rows are included per tier (0=basic, 1=standard, 2=premium)
const COMPARE_TIER_ROWS: Record<string, number[][]> = {
  content:   [[0,1],    [0,1,2,3], [0,1,2,3,4,5]],
  ads:       [[0,1],    [0,1,2,3,4], [0,1,2,3,4,5,6]],
  website:   [[0,1],    [0,1,2,3,4], [0,1,2,3,4,5]],
  ecommerce: [[0,1],    [0,1,2,3],   [0,1,2,3,4,5]],
  mixed:     [[0,1],    [0,1,2,3],   [0,1,2,3,4,5]],
};

const CompareTable = ({ pathData, lang }: { pathData: PathData; lang: LangKey }) => {
  const { t } = useLanguage();
  const rows = COMPARE_ROWS[pathData.key] ?? [];
  const tierRows = COMPARE_TIER_ROWS[pathData.key] ?? [[], [], []];

  const tierLabels = pathData.packages.map(p => t(p.nameKey));

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/30 glass">
      <table className="w-full min-w-[520px] text-sm" dir={lang === "ar" ? "rtl" : "ltr"}>
        <thead>
          <tr className="border-b border-border/30">
            <th className="py-4 px-5 text-start text-xs font-semibold text-muted-foreground w-2/5">
              {lang === "ar" ? "الميزة" : lang === "zh" ? "功能" : "Feature"}
            </th>
            {tierLabels.map((label, i) => (
              <th key={i} className={`py-4 px-4 text-center text-xs font-bold ${i === 1 ? "text-primary" : "text-foreground"}`}>
                <span className={`inline-flex flex-col items-center gap-1`}>
                  {label}
                  {i === 1 && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full gradient-purple text-primary-foreground text-[9px] font-bold">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {t("packages.requested")}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className={`border-b border-border/20 ${rowIdx % 2 === 0 ? "bg-secondary/10" : ""}`}>
              <td className="py-3 px-5 text-xs text-muted-foreground">{row[lang]}</td>
              {tierRows.map((included, tierIdx) => (
                <td key={tierIdx} className="py-3 px-4 text-center">
                  {included.includes(rowIdx) ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                        tierIdx === 1
                          ? "gradient-purple text-primary-foreground"
                          : "bg-primary/15 text-primary"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </motion.span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-5 h-5">
                      <X className="w-3 h-3 text-border/60" />
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
          {/* Pricing row */}
          <tr className="bg-primary/5 border-t border-primary/20">
            <td className="py-4 px-5 text-xs font-bold text-foreground">
              {lang === "ar" ? "السعر" : lang === "zh" ? "价格" : "Price"}
            </td>
            {pathData.packages.map((pkg, i) => (
              <td key={i} className="py-4 px-4 text-center">
                <span className={`text-base font-black ${i === 1 ? "gradient-text" : "text-foreground"}`}>
                  ${pkg.priceUSD}
                </span>
                <p className="text-[9px] text-muted-foreground mt-0.5">{pkg.priceYER.toLocaleString()} {t("packages.yer")}</p>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────

const PackagesSection = () => {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";
  const [activeTab, setActiveTab] = useState("content");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  const currentPath = paths.find((p) => p.key === activeTab)!;

  return (
    <section id="packages" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/3 start-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 end-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border text-xs font-semibold text-primary mb-4"
            >
              <Star className="w-3 h-3 fill-current" />
              {t("packages.hub.label")}
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black gradient-text mb-4">
              {t("packages.title")}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
              {t("packages.hub.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Tab selector */}
        <ScrollReveal delay={0.1}>
          <div className={`flex flex-wrap justify-center gap-2 md:gap-3 mb-14 ${isRTL ? "flex-row-reverse" : ""}`}>
            {paths.map((path) => {
              const Icon = path.icon;
              const isActive = activeTab === path.key;
              return (
                <motion.button
                  key={path.key}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(path.key);
                    setExpandedCard(null);
                    setShowCompare(false);
                  }}
                  className={`relative px-4 py-2.5 md:px-6 md:py-3 rounded-2xl font-semibold text-xs md:text-sm transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "gradient-purple text-primary-foreground neon-glow shadow-lg"
                      : "glass neon-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {t(path.labelKey)}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-2xl ring-1 ring-primary/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {currentPath.packages.map((pkg, i) => (
              <ScrollReveal key={`${activeTab}-${i}`} delay={i * 0.1}>
                <PackageCard
                  pkg={pkg}
                  lang={lang as LangKey}
                  isExpanded={expandedCard === `${activeTab}-${i}`}
                  onToggle={() =>
                    setExpandedCard(
                      expandedCard === `${activeTab}-${i}` ? null : `${activeTab}-${i}`
                    )
                  }
                />
              </ScrollReveal>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Compare toggle button */}
        <ScrollReveal delay={0.25}>
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCompare(v => !v)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 border ${
                showCompare
                  ? "gradient-purple text-primary-foreground neon-glow border-transparent"
                  : "glass neon-border text-primary hover:bg-primary/10"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              {showCompare
                ? (lang === "ar" ? "إخفاء المقارنة" : lang === "zh" ? "隐藏比较" : "Hide Comparison")
                : (lang === "ar" ? "قارن بين الباقات" : lang === "zh" ? "比较套餐" : "Compare Packages")}
              <motion.span animate={{ rotate: showCompare ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </div>
        </ScrollReveal>

        {/* Compare Table */}
        <AnimatePresence>
          {showCompare && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ScrollReveal>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/30" />
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
                    <BarChart3 className="w-3.5 h-3.5" />
                    {lang === "ar" ? "مقارنة الباقات جنبًا إلى جنب" : lang === "zh" ? "套餐对比一览" : "Side-by-side package comparison"}
                  </span>
                  <div className="h-px flex-1 bg-border/30" />
                </div>
                <CompareTable pathData={currentPath} lang={lang as LangKey} />
              </ScrollReveal>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom note */}
        <ScrollReveal delay={0.3}>
          <p className="text-center text-xs text-muted-foreground mt-12">
            {t("packages.note")}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PackagesSection;

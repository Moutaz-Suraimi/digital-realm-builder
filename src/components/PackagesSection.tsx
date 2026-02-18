import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Star, ChevronDown, MessageCircle,
  Palette, Megaphone, Globe, ShoppingBag, Layers,
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

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────

const PackagesSection = () => {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";
  const [activeTab, setActiveTab] = useState("content");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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
          <div
            className={`flex flex-wrap justify-center gap-2 md:gap-3 mb-14 ${isRTL ? "flex-row-reverse" : ""}`}
          >
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

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Zap, Hammer, ShoppingCart, TrendingUp, ChevronDown, MessageCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const WHATSAPP_NUMBER = "967780930635";

type LangKey = "ar" | "en" | "zh";

interface PkgCard {
  name: { ar: string; en: string; zh: string };
  price: number;
  features: { ar: string; en: string; zh: string }[];
  details: { ar: string; en: string; zh: string }[];
  delivery: number;
  badge?: "popular" | "value";
}

const paths = [
  {
    key: "build",
    icon: Hammer,
    color: "from-primary to-accent",
    packages: [
      {
        name: { ar: "موقع ووردبريس", en: "WordPress Website", zh: "WordPress网站" },
        price: 300, delivery: 7,
        features: [
          { ar: "تصميم احترافي", en: "Professional design", zh: "专业设计" },
          { ar: "متجاوب مع الجوال", en: "Mobile responsive", zh: "移动端适配" },
          { ar: "SEO أساسي", en: "Basic SEO", zh: "基础SEO" },
        ],
        details: [
          { ar: "5 صفحات مخصصة", en: "5 custom pages", zh: "5个自定义页面" },
          { ar: "نموذج اتصال", en: "Contact form", zh: "联系表单" },
          { ar: "تدريب على الإدارة", en: "Admin training", zh: "后台管理培训" },
        ],
      },
      {
        name: { ar: "موقع ديناميكي", en: "Dynamic Website", zh: "动态网站" },
        price: 400, delivery: 10, badge: "popular" as const,
        features: [
          { ar: "تصميم مخصص", en: "Custom design", zh: "定制设计" },
          { ar: "لوحة تحكم", en: "Admin panel", zh: "管理面板" },
          { ar: "تحسين SEO", en: "SEO optimization", zh: "SEO优化" },
        ],
        details: [
          { ar: "10 صفحات", en: "10 pages", zh: "10个页面" },
          { ar: "مدونة متكاملة", en: "Integrated blog", zh: "集成博客" },
          { ar: "تحليلات مفصلة", en: "Detailed analytics", zh: "详细分析" },
        ],
      },
      {
        name: { ar: "موقع شبه مخصص", en: "Semi-Custom Website", zh: "半定制网站" },
        price: 500, delivery: 15,
        features: [
          { ar: "تصميم فريد", en: "Unique design", zh: "独特设计" },
          { ar: "تكاملات API", en: "API integrations", zh: "API集成" },
          { ar: "أداء محسن", en: "Optimized performance", zh: "性能优化" },
        ],
        details: [
          { ar: "رسوم متحركة مخصصة", en: "Custom animations", zh: "自定义动画" },
          { ar: "تكامل CRM", en: "CRM integration", zh: "CRM集成" },
          { ar: "اختبار A/B", en: "A/B testing", zh: "A/B测试" },
        ],
      },
      {
        name: { ar: "موقع مخصص بالكامل", en: "Custom Website", zh: "全定制网站" },
        price: 800, delivery: 25, badge: "value" as const,
        features: [
          { ar: "تطوير كامل", en: "Full development", zh: "全栈开发" },
          { ar: "ميزات متقدمة", en: "Advanced features", zh: "高级功能" },
          { ar: "دعم مستمر", en: "Ongoing support", zh: "持续支持" },
        ],
        details: [
          { ar: "بنية قابلة للتوسع", en: "Scalable architecture", zh: "可扩展架构" },
          { ar: "أمان متقدم", en: "Advanced security", zh: "高级安全" },
          { ar: "دعم 6 أشهر", en: "6 months support", zh: "6个月支持" },
        ],
      },
    ],
  },
  {
    key: "sell",
    icon: ShoppingCart,
    color: "from-accent to-[hsl(var(--neon-blue))]",
    packages: [
      {
        name: { ar: "متجر إلكتروني", en: "Web Store", zh: "网上商店" },
        price: 1000, delivery: 15,
        features: [
          { ar: "إدارة المنتجات", en: "Product management", zh: "产品管理" },
          { ar: "بوابة دفع", en: "Payment gateway", zh: "支付网关" },
          { ar: "تتبع الطلبات", en: "Order tracking", zh: "订单跟踪" },
        ],
        details: [
          { ar: "حتى 100 منتج", en: "Up to 100 products", zh: "最多100个产品" },
          { ar: "كوبونات خصم", en: "Discount coupons", zh: "折扣券" },
          { ar: "تقارير المبيعات", en: "Sales reports", zh: "销售报告" },
        ],
      },
      {
        name: { ar: "متجر + تطبيق أندرويد", en: "Store + Android App", zh: "商店+安卓应用" },
        price: 1500, delivery: 20, badge: "popular" as const,
        features: [
          { ar: "تطبيق أندرويد", en: "Android app", zh: "安卓应用" },
          { ar: "إشعارات فورية", en: "Push notifications", zh: "推送通知" },
          { ar: "لوحة تحكم شاملة", en: "Full dashboard", zh: "完整仪表盘" },
        ],
        details: [
          { ar: "منتجات غير محدودة", en: "Unlimited products", zh: "无限产品" },
          { ar: "نشر على Play Store", en: "Play Store publish", zh: "发布到Play Store" },
          { ar: "إدارة المخزون", en: "Inventory management", zh: "库存管理" },
        ],
      },
      {
        name: { ar: "متجر + أندرويد وiOS", en: "Store + Android & iOS", zh: "商店+安卓和iOS" },
        price: 2000, delivery: 30, badge: "value" as const,
        features: [
          { ar: "تطبيق أندرويد وiOS", en: "Android & iOS apps", zh: "安卓和iOS应用" },
          { ar: "نظام كامل", en: "Complete system", zh: "完整系统" },
          { ar: "تقارير متقدمة", en: "Advanced reports", zh: "高级报告" },
        ],
        details: [
          { ar: "نشر على كلا المتجرين", en: "Published on both stores", zh: "发布到两个商店" },
          { ar: "برنامج ولاء", en: "Loyalty program", zh: "忠诚度计划" },
          { ar: "تكامل شحن", en: "Shipping integration", zh: "物流集成" },
        ],
      },
    ],
  },
  {
    key: "grow",
    icon: TrendingUp,
    color: "from-[hsl(var(--neon-blue))] to-primary",
    packages: [
      {
        name: { ar: "باقة الانطلاق", en: "Starter Growth", zh: "入门成长" },
        price: 200, delivery: 7,
        features: [
          { ar: "تحسين SEO", en: "SEO optimization", zh: "SEO优化" },
          { ar: "تقارير شهرية", en: "Monthly reports", zh: "月度报告" },
          { ar: "استشارة مجانية", en: "Free consultation", zh: "免费咨询" },
        ],
        details: [
          { ar: "تحليل المنافسين", en: "Competitor analysis", zh: "竞争对手分析" },
          { ar: "خطة كلمات مفتاحية", en: "Keyword strategy", zh: "关键词策略" },
          { ar: "تحسين Google My Business", en: "Google My Business optimization", zh: "Google My Business优化" },
        ],
      },
      {
        name: { ar: "باقة النمو", en: "Growth Pro", zh: "专业成长" },
        price: 500, delivery: 14, badge: "popular" as const,
        features: [
          { ar: "إدارة حملات إعلانية", en: "Ad campaign management", zh: "广告活动管理" },
          { ar: "محتوى اجتماعي", en: "Social content", zh: "社交内容" },
          { ar: "تحسين التحويلات", en: "Conversion optimization", zh: "转化优化" },
        ],
        details: [
          { ar: "8 منشورات شهرية", en: "8 monthly posts", zh: "每月8篇帖子" },
          { ar: "إعلانات Google & Meta", en: "Google & Meta ads", zh: "Google和Meta广告" },
          { ar: "تحليلات متقدمة", en: "Advanced analytics", zh: "高级分析" },
        ],
      },
      {
        name: { ar: "باقة الهيمنة", en: "Market Domination", zh: "市场主导" },
        price: 1000, delivery: 30, badge: "value" as const,
        features: [
          { ar: "استراتيجية شاملة", en: "Full strategy", zh: "全面策略" },
          { ar: "فريق مخصص", en: "Dedicated team", zh: "专属团队" },
          { ar: "نتائج مضمونة", en: "Guaranteed results", zh: "保证结果" },
        ],
        details: [
          { ar: "مدير حساب مخصص", en: "Dedicated account manager", zh: "专属客户经理" },
          { ar: "حملات متعددة القنوات", en: "Multi-channel campaigns", zh: "多渠道营销" },
          { ar: "تقارير أسبوعية", en: "Weekly reports", zh: "周报告" },
        ],
      },
    ],
  },
];

const PackageCard = ({
  pkg,
  lang,
  isExpanded,
  onToggle,
}: {
  pkg: PkgCard;
  lang: string;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const { t } = useLanguage();
  const l = lang as LangKey;

  const sendWhatsApp = () => {
    const name = pkg.name[l];
    const msg =
      lang === "ar"
        ? `مرحباً، أرغب في الاستفسار عن باقة: ${name} ($${pkg.price})`
        : lang === "zh"
        ? `您好，我想了解套餐：${name} ($${pkg.price})`
        : `Hello, I'd like to inquire about: ${name} ($${pkg.price})`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      className={`glass rounded-2xl p-6 neon-border card-3d relative overflow-hidden ${
        pkg.badge === "popular" ? "ring-2 ring-primary/50" : ""
      }`}
    >
      {pkg.badge && (
        <div className="absolute top-4 end-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold gradient-purple text-primary-foreground">
            {pkg.badge === "popular" ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
            {t(pkg.badge === "popular" ? "packages.popular" : "packages.bestValue")}
          </span>
        </div>
      )}

      <h4 className="text-lg font-bold text-foreground mb-2">{pkg.name[l]}</h4>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-bold gradient-text">${pkg.price}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {t("packages.from")} · {pkg.delivery} {t("packages.delivery")}
      </p>

      <ul className="space-y-2 mb-4">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-secondary-foreground">
            <Check className="w-4 h-4 text-primary shrink-0" />
            {f[l]}
          </li>
        ))}
      </ul>

      {/* Expand toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-3"
      >
        {t(isExpanded ? "packages.less" : "packages.more")}
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-4"
          >
            <div className="pt-3 border-t border-border/30 space-y-2">
              {pkg.details.map((d, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-secondary-foreground list-none"
                >
                  <Zap className="w-3 h-3 text-accent shrink-0" />
                  {d[l]}
                </motion.li>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={sendWhatsApp}
        className="w-full py-3 rounded-xl gradient-purple text-primary-foreground font-medium flex items-center justify-center gap-2 neon-glow hover:shadow-[0_0_30px_hsl(265_90%_60%/0.3)] transition-shadow text-sm"
      >
        <MessageCircle className="w-4 h-4" />
        {t("packages.cta")}
      </button>
    </motion.div>
  );
};

const PackagesSection = () => {
  const { t, lang } = useLanguage();
  const [activePath, setActivePath] = useState("build");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const currentPath = paths.find((p) => p.key === activePath)!;

  return (
    <section id="packages" className="section-padding relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold text-center gradient-text mb-4">
            {t("packages.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-sm md:text-base">
            {t("packages.hub.subtitle")}
          </p>
        </ScrollReveal>

        {/* Path selector */}
        <ScrollReveal delay={0.1}>
          <div className="flex justify-center gap-3 md:gap-4 mb-12">
            {paths.map((path) => {
              const Icon = path.icon;
              const isActive = activePath === path.key;
              return (
                <motion.button
                  key={path.key}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActivePath(path.key); setExpandedCard(null); }}
                  className={`relative px-5 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-sm md:text-lg transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? `bg-gradient-to-r ${path.color} text-primary-foreground neon-glow`
                      : "glass neon-border text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ transformStyle: "preserve-3d", perspective: "600px" }}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  {t(`hero.${path.key}`)}
                  {isActive && (
                    <motion.div
                      layoutId="activePathIndicator"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePath}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={`grid gap-4 ${
              currentPath.packages.length === 4
                ? "sm:grid-cols-2 lg:grid-cols-4"
                : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {currentPath.packages.map((pkg, i) => (
              <ScrollReveal key={`${activePath}-${i}`} delay={i * 0.08}>
                <PackageCard
                  pkg={pkg}
                  lang={lang}
                  isExpanded={expandedCard === `${activePath}-${i}`}
                  onToggle={() =>
                    setExpandedCard(
                      expandedCard === `${activePath}-${i}` ? null : `${activePath}-${i}`
                    )
                  }
                />
              </ScrollReveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PackagesSection;

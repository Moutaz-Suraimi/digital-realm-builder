import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const WHATSAPP_NUMBER = "967780930635";

interface PkgCard {
  name: { ar: string; en: string; zh: string };
  price: number;
  features: { ar: string; en: string; zh: string }[];
  delivery: number;
  badge?: "popular" | "value";
}

const websitePackages: PkgCard[] = [
  {
    name: { ar: "موقع ووردبريس", en: "WordPress Website", zh: "WordPress网站" },
    price: 300,
    delivery: 7,
    features: [
      { ar: "تصميم احترافي", en: "Professional design", zh: "专业设计" },
      { ar: "متجاوب مع الجوال", en: "Mobile responsive", zh: "移动端适配" },
      { ar: "SEO أساسي", en: "Basic SEO", zh: "基础SEO" },
    ],
  },
  {
    name: { ar: "موقع ديناميكي", en: "Dynamic Website", zh: "动态网站" },
    price: 400,
    delivery: 10,
    badge: "popular",
    features: [
      { ar: "تصميم مخصص", en: "Custom design", zh: "定制设计" },
      { ar: "لوحة تحكم", en: "Admin panel", zh: "管理面板" },
      { ar: "تحسين SEO", en: "SEO optimization", zh: "SEO优化" },
    ],
  },
  {
    name: { ar: "موقع شبه مخصص", en: "Semi-Custom Website", zh: "半定制网站" },
    price: 500,
    delivery: 15,
    features: [
      { ar: "تصميم فريد", en: "Unique design", zh: "独特设计" },
      { ar: "تكاملات API", en: "API integrations", zh: "API集成" },
      { ar: "أداء محسن", en: "Optimized performance", zh: "性能优化" },
    ],
  },
  {
    name: { ar: "موقع مخصص بالكامل", en: "Custom Website", zh: "全定制网站" },
    price: 800,
    delivery: 25,
    badge: "value",
    features: [
      { ar: "تطوير كامل", en: "Full development", zh: "全栈开发" },
      { ar: "ميزات متقدمة", en: "Advanced features", zh: "高级功能" },
      { ar: "دعم مستمر", en: "Ongoing support", zh: "持续支持" },
    ],
  },
];

const ecommercePackages: PkgCard[] = [
  {
    name: { ar: "متجر إلكتروني", en: "Web Store", zh: "网上商店" },
    price: 1000,
    delivery: 15,
    features: [
      { ar: "إدارة المنتجات", en: "Product management", zh: "产品管理" },
      { ar: "بوابة دفع", en: "Payment gateway", zh: "支付网关" },
      { ar: "تتبع الطلبات", en: "Order tracking", zh: "订单跟踪" },
    ],
  },
  {
    name: { ar: "متجر + تطبيق أندرويد", en: "Store + Android App", zh: "商店+安卓应用" },
    price: 1500,
    delivery: 20,
    badge: "popular",
    features: [
      { ar: "تطبيق أندرويد", en: "Android app", zh: "安卓应用" },
      { ar: "إشعارات فورية", en: "Push notifications", zh: "推送通知" },
      { ar: "لوحة تحكم شاملة", en: "Full dashboard", zh: "完整仪表盘" },
    ],
  },
  {
    name: { ar: "متجر + أندرويد وiOS", en: "Store + Android & iOS", zh: "商店+安卓和iOS" },
    price: 2000,
    delivery: 30,
    badge: "value",
    features: [
      { ar: "تطبيق أندرويد وiOS", en: "Android & iOS apps", zh: "安卓和iOS应用" },
      { ar: "نظام كامل", en: "Complete system", zh: "完整系统" },
      { ar: "تقارير متقدمة", en: "Advanced reports", zh: "高级报告" },
    ],
  },
  {
    name: { ar: "نظام تجارة مخصص", en: "Custom E-Commerce", zh: "定制电商系统" },
    price: 2000,
    delivery: 30,
    features: [
      { ar: "حل مخصص بالكامل", en: "Fully custom solution", zh: "全定制解决方案" },
      { ar: "تكاملات خاصة", en: "Custom integrations", zh: "定制集成" },
      { ar: "قابلية توسع", en: "Scalability", zh: "可扩展性" },
    ],
  },
];

type LangKey = "ar" | "en" | "zh";

const PackageCard = ({ pkg, lang }: { pkg: PkgCard; lang: string }) => {
  const { t } = useLanguage();
  const l = lang as LangKey;

  const sendWhatsApp = () => {
    const name = pkg.name[l];
    const msg = lang === "ar"
      ? `مرحباً، أرغب في الاستفسار عن باقة: ${name}`
      : lang === "zh"
      ? `您好，我想了解套餐：${name}`
      : `Hello, I'd like to inquire about: ${name}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <motion.div
      whileHover={{ y: -8, rotateY: -2, rotateX: 2 }}
      className="glass rounded-2xl p-6 neon-border card-3d relative overflow-hidden h-full"
    >
      {pkg.badge && (
        <div className="absolute top-4 end-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold gradient-purple text-primary-foreground">
            {pkg.badge === "popular" ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
            {t(pkg.badge === "popular" ? "packages.popular" : "packages.bestValue")}
          </span>
        </div>
      )}
      <h3 className="text-lg font-bold text-foreground mb-2">{pkg.name[l]}</h3>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-bold gradient-text">${pkg.price}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {t("packages.from")} · {pkg.delivery} {t("packages.delivery")}
      </p>
      <ul className="space-y-2 mb-6">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-secondary-foreground">
            <Check className="w-4 h-4 text-primary shrink-0" />
            {f[l]}
          </li>
        ))}
      </ul>
      <button
        onClick={sendWhatsApp}
        className="w-full py-3 rounded-xl glass neon-border text-primary font-medium hover:bg-primary/10 transition-colors text-sm"
      >
        {t("packages.cta")}
      </button>
    </motion.div>
  );
};

const PackagesSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section id="packages" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold text-center gradient-text mb-16">
            {t("packages.title")}
          </h2>
        </ScrollReveal>

        {/* Website packages */}
        <ScrollReveal delay={0.1}>
          <h3 className="text-xl font-semibold text-foreground mb-6">{t("packages.websites")}</h3>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {websitePackages.map((pkg, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <PackageCard pkg={pkg} lang={lang} />
            </ScrollReveal>
          ))}
        </div>

        {/* E-Commerce packages */}
        <ScrollReveal delay={0.1}>
          <h3 className="text-xl font-semibold text-foreground mb-6">{t("packages.ecommerce")}</h3>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ecommercePackages.map((pkg, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <PackageCard pkg={pkg} lang={lang} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";

const WHATSAPP_NUMBER = "967780930635";

interface PkgCard {
  name: { ar: string; en: string };
  price: number;
  features: { ar: string; en: string }[];
  delivery: number;
  badge?: "popular" | "value";
}

const websitePackages: PkgCard[] = [
  {
    name: { ar: "موقع ووردبريس", en: "WordPress Website" },
    price: 300,
    delivery: 7,
    features: [
      { ar: "تصميم احترافي", en: "Professional design" },
      { ar: "متجاوب مع الجوال", en: "Mobile responsive" },
      { ar: "SEO أساسي", en: "Basic SEO" },
    ],
  },
  {
    name: { ar: "موقع ديناميكي", en: "Dynamic Website" },
    price: 400,
    delivery: 10,
    badge: "popular",
    features: [
      { ar: "تصميم مخصص", en: "Custom design" },
      { ar: "لوحة تحكم", en: "Admin panel" },
      { ar: "تحسين SEO", en: "SEO optimization" },
    ],
  },
  {
    name: { ar: "موقع شبه مخصص", en: "Semi-Custom Website" },
    price: 500,
    delivery: 15,
    features: [
      { ar: "تصميم فريد", en: "Unique design" },
      { ar: "تكاملات API", en: "API integrations" },
      { ar: "أداء محسن", en: "Optimized performance" },
    ],
  },
  {
    name: { ar: "موقع مخصص بالكامل", en: "Custom Website" },
    price: 800,
    delivery: 25,
    badge: "value",
    features: [
      { ar: "تطوير كامل", en: "Full development" },
      { ar: "ميزات متقدمة", en: "Advanced features" },
      { ar: "دعم مستمر", en: "Ongoing support" },
    ],
  },
];

const ecommercePackages: PkgCard[] = [
  {
    name: { ar: "متجر إلكتروني", en: "Web Store" },
    price: 1000,
    delivery: 15,
    features: [
      { ar: "إدارة المنتجات", en: "Product management" },
      { ar: "بوابة دفع", en: "Payment gateway" },
      { ar: "تتبع الطلبات", en: "Order tracking" },
    ],
  },
  {
    name: { ar: "متجر + تطبيق أندرويد", en: "Store + Android App" },
    price: 1500,
    delivery: 20,
    badge: "popular",
    features: [
      { ar: "تطبيق أندرويد", en: "Android app" },
      { ar: "إشعارات فورية", en: "Push notifications" },
      { ar: "لوحة تحكم شاملة", en: "Full dashboard" },
    ],
  },
  {
    name: { ar: "متجر + أندرويد وiOS", en: "Store + Android & iOS" },
    price: 2000,
    delivery: 30,
    badge: "value",
    features: [
      { ar: "تطبيق أندرويد وiOS", en: "Android & iOS apps" },
      { ar: "نظام كامل", en: "Complete system" },
      { ar: "تقارير متقدمة", en: "Advanced reports" },
    ],
  },
  {
    name: { ar: "نظام تجارة مخصص", en: "Custom E-Commerce" },
    price: 2000,
    delivery: 30,
    features: [
      { ar: "حل مخصص بالكامل", en: "Fully custom solution" },
      { ar: "تكاملات خاصة", en: "Custom integrations" },
      { ar: "قابلية توسع", en: "Scalability" },
    ],
  },
];

const PackageCard = ({ pkg, lang }: { pkg: PkgCard; lang: string }) => {
  const { t } = useLanguage();

  const sendWhatsApp = () => {
    const name = pkg.name[lang as "ar" | "en"];
    const msg = lang === "ar"
      ? `مرحباً، أرغب في الاستفسار عن باقة: ${name}`
      : `Hello, I'd like to inquire about: ${name}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, rotateY: -2, rotateX: 2 }}
      className="glass rounded-2xl p-6 neon-border card-3d relative overflow-hidden"
    >
      {pkg.badge && (
        <div className="absolute top-4 end-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold gradient-purple text-primary-foreground">
            {pkg.badge === "popular" ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
            {t(pkg.badge === "popular" ? "packages.popular" : "packages.bestValue")}
          </span>
        </div>
      )}
      <h3 className="text-lg font-bold text-foreground mb-2">{pkg.name[lang as "ar" | "en"]}</h3>
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
            {f[lang as "ar" | "en"]}
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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center gradient-text mb-16"
        >
          {t("packages.title")}
        </motion.h2>

        {/* Website packages */}
        <h3 className="text-xl font-semibold text-foreground mb-6">{t("packages.websites")}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {websitePackages.map((pkg, i) => (
            <PackageCard key={i} pkg={pkg} lang={lang} />
          ))}
        </div>

        {/* E-Commerce packages */}
        <h3 className="text-xl font-semibold text-foreground mb-6">{t("packages.ecommerce")}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ecommercePackages.map((pkg, i) => (
            <PackageCard key={i} pkg={pkg} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;

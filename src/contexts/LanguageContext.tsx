import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en" | "zh";

interface Translations {
  [key: string]: { ar: string; en: string; zh: string };
}

const translations: Translations = {
  // Nav
  "nav.home": { ar: "الرئيسية", en: "Home", zh: "首页" },
  "nav.about": { ar: "من نحن", en: "About", zh: "关于我们" },
  "nav.mirror": { ar: "المرآة الرقمية", en: "Digital Mirror", zh: "数字镜像" },
  "nav.solutions": { ar: "الحلول", en: "Solutions", zh: "解决方案" },
  "nav.packages": { ar: "الباقات", en: "Packages", zh: "套餐" },
  "nav.portfolio": { ar: "أعمالنا", en: "Portfolio", zh: "作品集" },
  "nav.testimonials": { ar: "آراء العملاء", en: "Testimonials", zh: "客户评价" },
  "nav.faq": { ar: "الأسئلة", en: "FAQ", zh: "常见问题" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact", zh: "联系我们" },

  // Hero
  "hero.build": { ar: "ابنِ", en: "Build", zh: "建立" },
  "hero.sell": { ar: "بِع", en: "Sell", zh: "销售" },
  "hero.grow": { ar: "نمُو", en: "Grow", zh: "成长" },
  "hero.subtitle": {
    ar: "نحن لا نبيع خدمات — نحن نبني ونبيع وننمي الأعمال الرقمية",
    en: "We don't sell services — We build, sell & grow digital businesses",
    zh: "我们不只是卖服务——我们建立、销售并发展数字业务",
  },
  "hero.cta": { ar: "ابدأ مشروعك الآن", en: "Start Your Project", zh: "立即开始您的项目" },

  // About
  "about.title": { ar: "من نحن", en: "About Us", zh: "关于我们" },
  "about.vision.title": { ar: "رؤيتنا", en: "Our Vision", zh: "我们的愿景" },
  "about.vision.desc": {
    ar: "نسعى لتحويل المنطقة العربية إلى مركز رقمي عالمي من خلال حلول مبتكرة",
    en: "We aim to transform the Arab region into a global digital hub through innovative solutions",
    zh: "我们致力于通过创新解决方案将阿拉伯地区打造为全球数字中心",
  },
  "about.mission.title": { ar: "مهمتنا", en: "Our Mission", zh: "我们的使命" },
  "about.mission.desc": {
    ar: "تمكين الشركات من بناء حضور رقمي قوي يحقق نتائج ملموسة",
    en: "Empowering businesses to build a powerful digital presence that delivers real results",
    zh: "赋能企业建立强大的数字化存在，实现实际成果",
  },
  "about.values.title": { ar: "قيمنا", en: "Our Values", zh: "我们的价值观" },
  "about.values.desc": {
    ar: "الابتكار، الجودة، الشفافية، والالتزام بنجاح عملائنا",
    en: "Innovation, Quality, Transparency, and commitment to our clients' success",
    zh: "创新、品质、透明以及对客户成功的承诺",
  },
  "about.cta": { ar: "تواصل معنا عبر واتساب", en: "Contact Us on WhatsApp", zh: "通过WhatsApp联系我们" },

  // Digital Mirror
  "mirror.title": { ar: "المرآة الرقمية", en: "Digital Mirror", zh: "数字镜像" },
  "mirror.question": {
    ar: "كيف يظهر مشروعك رقمياً اليوم؟",
    en: "How does your project appear digitally today?",
    zh: "您的项目在数字世界中的表现如何？",
  },
  "mirror.option1": { ar: "غير مرئي", en: "Invisible", zh: "不可见" },
  "mirror.option1.desc": {
    ar: "لا أحد يجدني على الإنترنت",
    en: "Nobody can find me online",
    zh: "没有人能在网上找到我",
  },
  "mirror.option2": { ar: "عادي", en: "Average", zh: "一般" },
  "mirror.option2.desc": {
    ar: "موجود لكن بدون تميز",
    en: "Present but nothing special",
    zh: "存在但毫无特色",
  },
  "mirror.option3": { ar: "احترافي لكنه بطيء", en: "Professional but slow", zh: "专业但缓慢" },
  "mirror.option3.desc": {
    ar: "جيد المظهر لكن الأداء ضعيف",
    en: "Looks good but poor performance",
    zh: "外观不错但性能差",
  },
  "mirror.option4": { ar: "قوي لكنه لا يبيع", en: "Strong but doesn't sell", zh: "强大但不卖货" },
  "mirror.option4.desc": {
    ar: "حضور قوي لكن بدون مبيعات",
    en: "Strong presence but no sales",
    zh: "存在感强但没有销售额",
  },
  "mirror.cta": {
    ar: "أرسل انعكاس مشروعي إلى واتساب",
    en: "Send my project reflection to WhatsApp",
    zh: "将我的项目分析发送到WhatsApp",
  },

  // Packages
  "packages.title": { ar: "الباقات والأسعار", en: "Packages & Pricing", zh: "套餐与定价" },
  "packages.websites": { ar: "باقات المواقع", en: "Website Packages", zh: "网站套餐" },
  "packages.ecommerce": { ar: "باقات المتاجر", en: "E-Commerce Packages", zh: "电商套餐" },
  "packages.from": { ar: "تبدأ من", en: "Starting from", zh: "起价" },
  "packages.cta": { ar: "ابدأ هذه الباقة عبر واتساب", en: "Start this package via WhatsApp", zh: "通过WhatsApp开始此套餐" },
  "packages.popular": { ar: "الأكثر طلباً", en: "Most Popular", zh: "最受欢迎" },
  "packages.bestValue": { ar: "أفضل قيمة", en: "Best Value", zh: "最佳价值" },
  "packages.delivery": { ar: "أيام عمل", en: "business days", zh: "个工作日" },

  // Solutions
  "solutions.title": { ar: "حلولنا", en: "Our Solutions", zh: "我们的解决方案" },
  "sol.digital": { ar: "الحضور الرقمي", en: "Digital Presence", zh: "数字存在" },
  "sol.local": { ar: "الحضور المحلي", en: "Local Presence", zh: "本地存在" },
  "sol.ecommerce": { ar: "التجارة الإلكترونية", en: "E-Commerce", zh: "电子商务" },
  "sol.brand": { ar: "هوية العلامة", en: "Brand Identity", zh: "品牌形象" },
  "sol.trust": { ar: "بناء الثقة", en: "Trust Building", zh: "信任建设" },
  "sol.video": { ar: "محتوى الفيديو", en: "Video Content", zh: "视频内容" },
  "sol.ai": { ar: "أتمتة الذكاء الاصطناعي", en: "AI Automation", zh: "AI自动化" },

  // Portfolio
  "portfolio.title": { ar: "أعمالنا", en: "Portfolio", zh: "作品集" },
  "portfolio.subtitle": {
    ar: "مشاريع حقيقية بنيناها لعملائنا",
    en: "Real projects we've built for our clients",
    zh: "我们为客户打造的真实项目",
  },
  "portfolio.cta": { ar: "أريد مشروع مشابه", en: "I want something similar", zh: "我想要类似的项目" },

  // Testimonials
  "testimonials.title": { ar: "آراء العملاء", en: "Testimonials", zh: "客户评价" },
  "testimonials.subtitle": {
    ar: "ماذا يقول عملاؤنا عن تجربتهم معنا",
    en: "What our clients say about their experience with us",
    zh: "客户对我们的评价",
  },

  // FAQ
  "faq.title": { ar: "الأسئلة الشائعة", en: "FAQ", zh: "常见问题" },
  "faq.q1": { ar: "ما هي المدة المطلوبة لإنشاء موقع؟", en: "How long does it take to build a website?", zh: "建立一个网站需要多长时间？" },
  "faq.a1": { ar: "تعتمد على نوع المشروع، عادة من 5 إلى 30 يوم عمل", en: "Depends on the project type, usually 5 to 30 business days", zh: "取决于项目类型，通常需要5到30个工作日" },
  "faq.q2": { ar: "هل تقدمون دعم ما بعد التسليم؟", en: "Do you offer post-delivery support?", zh: "你们提供交付后的支持吗？" },
  "faq.a2": { ar: "نعم، نوفر دعم فني مستمر وصيانة دورية", en: "Yes, we provide ongoing technical support and regular maintenance", zh: "是的，我们提供持续的技术支持和定期维护" },
  "faq.q3": { ar: "هل يمكنني تخصيص الباقة؟", en: "Can I customize a package?", zh: "我可以定制套餐吗？" },
  "faq.a3": { ar: "بالتأكيد! تواصل معنا وسنصمم باقة مخصصة لاحتياجاتك", en: "Absolutely! Contact us and we'll design a custom package for your needs", zh: "当然可以！联系我们，我们将为您的需求设计定制套餐" },

  // Contact
  "contact.title": { ar: "تواصل معنا", en: "Contact Us", zh: "联系我们" },
  "contact.name": { ar: "الاسم", en: "Name", zh: "姓名" },
  "contact.email": { ar: "البريد الإلكتروني", en: "Email", zh: "电子邮件" },
  "contact.message": { ar: "الرسالة", en: "Message", zh: "消息" },
  "contact.send": { ar: "إرسال", en: "Send", zh: "发送" },
  "contact.whatsapp": { ar: "أو تواصل عبر واتساب", en: "Or contact via WhatsApp", zh: "或通过WhatsApp联系" },

  // Footer
  "footer.services": { ar: "الخدمات", en: "Services", zh: "服务" },
  "footer.company": { ar: "الشركة", en: "Company", zh: "公司" },
  "footer.packages": { ar: "الباقات", en: "Packages", zh: "套餐" },
  "footer.resources": { ar: "المصادر", en: "Resources", zh: "资源" },
  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All rights reserved", zh: "版权所有" },

  // Language
  "lang.switch": { ar: "EN", en: "عربي", zh: "EN" },
};

const langLabels: Record<Language, string> = {
  ar: "عربي",
  en: "English",
  zh: "中文",
};

const langOrder: Language[] = ["en", "ar", "zh"];

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
  langLabels: Record<Language, string>;
  langOrder: Language[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const browserLang = navigator.language;
    if (browserLang.startsWith("ar")) return "ar";
    if (browserLang.startsWith("zh")) return "zh";
    return "en";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const t = (key: string): string => {
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, langLabels, langOrder }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

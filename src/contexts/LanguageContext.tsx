import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface Translations {
  [key: string]: { ar: string; en: string };
}

const translations: Translations = {
  // Nav
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.about": { ar: "من نحن", en: "About" },
  "nav.mirror": { ar: "المرآة الرقمية", en: "Digital Mirror" },
  "nav.solutions": { ar: "الحلول", en: "Solutions" },
  "nav.packages": { ar: "الباقات", en: "Packages" },
  "nav.faq": { ar: "الأسئلة", en: "FAQ" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact" },

  // Hero
  "hero.build": { ar: "ابنِ", en: "Build" },
  "hero.sell": { ar: "بِع", en: "Sell" },
  "hero.grow": { ar: "نمُو", en: "Grow" },
  "hero.subtitle": {
    ar: "نحن لا نبيع خدمات — نحن نبني ونبيع وننمي الأعمال الرقمية",
    en: "We don't sell services — We build, sell & grow digital businesses",
  },
  "hero.cta": { ar: "ابدأ مشروعك الآن", en: "Start Your Project" },

  // About
  "about.title": { ar: "من نحن", en: "About Us" },
  "about.vision.title": { ar: "رؤيتنا", en: "Our Vision" },
  "about.vision.desc": {
    ar: "نسعى لتحويل المنطقة العربية إلى مركز رقمي عالمي من خلال حلول مبتكرة",
    en: "We aim to transform the Arab region into a global digital hub through innovative solutions",
  },
  "about.mission.title": { ar: "مهمتنا", en: "Our Mission" },
  "about.mission.desc": {
    ar: "تمكين الشركات من بناء حضور رقمي قوي يحقق نتائج ملموسة",
    en: "Empowering businesses to build a powerful digital presence that delivers real results",
  },
  "about.values.title": { ar: "قيمنا", en: "Our Values" },
  "about.values.desc": {
    ar: "الابتكار، الجودة، الشفافية، والالتزام بنجاح عملائنا",
    en: "Innovation, Quality, Transparency, and commitment to our clients' success",
  },
  "about.cta": { ar: "تواصل معنا عبر واتساب", en: "Contact Us on WhatsApp" },

  // Digital Mirror
  "mirror.title": { ar: "المرآة الرقمية", en: "Digital Mirror" },
  "mirror.question": {
    ar: "كيف يظهر مشروعك رقمياً اليوم؟",
    en: "How does your project appear digitally today?",
  },
  "mirror.option1": { ar: "غير مرئي", en: "Invisible" },
  "mirror.option1.desc": {
    ar: "لا أحد يجدني على الإنترنت",
    en: "Nobody can find me online",
  },
  "mirror.option2": { ar: "عادي", en: "Average" },
  "mirror.option2.desc": {
    ar: "موجود لكن بدون تميز",
    en: "Present but nothing special",
  },
  "mirror.option3": { ar: "احترافي لكنه بطيء", en: "Professional but slow" },
  "mirror.option3.desc": {
    ar: "جيد المظهر لكن الأداء ضعيف",
    en: "Looks good but poor performance",
  },
  "mirror.option4": { ar: "قوي لكنه لا يبيع", en: "Strong but doesn't sell" },
  "mirror.option4.desc": {
    ar: "حضور قوي لكن بدون مبيعات",
    en: "Strong presence but no sales",
  },
  "mirror.cta": {
    ar: "أرسل انعكاس مشروعي إلى واتساب",
    en: "Send my project reflection to WhatsApp",
  },

  // Packages
  "packages.title": { ar: "الباقات والأسعار", en: "Packages & Pricing" },
  "packages.websites": { ar: "باقات المواقع", en: "Website Packages" },
  "packages.ecommerce": { ar: "باقات المتاجر", en: "E-Commerce Packages" },
  "packages.from": { ar: "تبدأ من", en: "Starting from" },
  "packages.cta": { ar: "ابدأ هذه الباقة عبر واتساب", en: "Start this package via WhatsApp" },
  "packages.popular": { ar: "الأكثر طلباً", en: "Most Popular" },
  "packages.bestValue": { ar: "أفضل قيمة", en: "Best Value" },
  "packages.delivery": { ar: "أيام عمل", en: "business days" },

  // Solutions
  "solutions.title": { ar: "حلولنا", en: "Our Solutions" },
  "sol.digital": { ar: "الحضور الرقمي", en: "Digital Presence" },
  "sol.local": { ar: "الحضور المحلي", en: "Local Presence" },
  "sol.ecommerce": { ar: "التجارة الإلكترونية", en: "E-Commerce" },
  "sol.brand": { ar: "هوية العلامة", en: "Brand Identity" },
  "sol.trust": { ar: "بناء الثقة", en: "Trust Building" },
  "sol.video": { ar: "محتوى الفيديو", en: "Video Content" },
  "sol.ai": { ar: "أتمتة الذكاء الاصطناعي", en: "AI Automation" },

  // FAQ
  "faq.title": { ar: "الأسئلة الشائعة", en: "FAQ" },
  "faq.q1": { ar: "ما هي المدة المطلوبة لإنشاء موقع؟", en: "How long does it take to build a website?" },
  "faq.a1": { ar: "تعتمد على نوع المشروع، عادة من 5 إلى 30 يوم عمل", en: "Depends on the project type, usually 5 to 30 business days" },
  "faq.q2": { ar: "هل تقدمون دعم ما بعد التسليم؟", en: "Do you offer post-delivery support?" },
  "faq.a2": { ar: "نعم، نوفر دعم فني مستمر وصيانة دورية", en: "Yes, we provide ongoing technical support and regular maintenance" },
  "faq.q3": { ar: "هل يمكنني تخصيص الباقة؟", en: "Can I customize a package?" },
  "faq.a3": { ar: "بالتأكيد! تواصل معنا وسنصمم باقة مخصصة لاحتياجاتك", en: "Absolutely! Contact us and we'll design a custom package for your needs" },

  // Contact
  "contact.title": { ar: "تواصل معنا", en: "Contact Us" },
  "contact.name": { ar: "الاسم", en: "Name" },
  "contact.email": { ar: "البريد الإلكتروني", en: "Email" },
  "contact.message": { ar: "الرسالة", en: "Message" },
  "contact.send": { ar: "إرسال", en: "Send" },
  "contact.whatsapp": { ar: "أو تواصل عبر واتساب", en: "Or contact via WhatsApp" },

  // Footer
  "footer.services": { ar: "الخدمات", en: "Services" },
  "footer.company": { ar: "الشركة", en: "Company" },
  "footer.packages": { ar: "الباقات", en: "Packages" },
  "footer.resources": { ar: "المصادر", en: "Resources" },
  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },

  // Language
  "lang.switch": { ar: "EN", en: "عربي" },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const browserLang = navigator.language;
    return browserLang.startsWith("ar") ? "ar" : "en";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

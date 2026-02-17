import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, User, Mail, FileText, CheckCircle2, Bot, ArrowRight, ArrowLeft } from "lucide-react";

const WHATSAPP_NUMBER = "967780930635";

const steps = ["name", "email", "project", "budget", "message"] as const;
type Step = typeof steps[number];

const budgetOptions = [
  { key: "$300-$500", ar: "٣٠٠-٥٠٠ دولار", en: "$300-$500", zh: "$300-$500" },
  { key: "$500-$1000", ar: "٥٠٠-١٠٠٠ دولار", en: "$500-$1,000", zh: "$500-$1,000" },
  { key: "$1000-$2000", ar: "١٠٠٠-٢٠٠٠ دولار", en: "$1,000-$2,000", zh: "$1,000-$2,000" },
  { key: "$2000+", ar: "+٢٠٠٠ دولار", en: "$2,000+", zh: "$2,000+" },
];

const projectTypes = [
  { key: "website", ar: "موقع إلكتروني", en: "Website", zh: "网站" },
  { key: "ecommerce", ar: "متجر إلكتروني", en: "E-Commerce", zh: "电商" },
  { key: "app", ar: "تطبيق موبايل", en: "Mobile App", zh: "移动应用" },
  { key: "branding", ar: "هوية بصرية", en: "Branding", zh: "品牌设计" },
];

const ContactSection = () => {
  const { t, lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    project: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const l = lang as "ar" | "en" | "zh";
  const isRtl = lang === "ar";
  const step = steps[currentStep];

  const aiMessages: Record<Step, { ar: string; en: string; zh: string }> = {
    name: {
      ar: "مرحباً! أنا المساعد الرقمي لصُرَيمي. ما اسمك؟",
      en: "Hello! I'm Surimi's digital assistant. What's your name?",
      zh: "你好！我是Surimi的数字助手。你叫什么名字？",
    },
    email: {
      ar: `سعيد بلقائك يا ${form.name || ""}! ما بريدك الإلكتروني؟`,
      en: `Nice to meet you, ${form.name || ""}! What's your email?`,
      zh: `很高兴认识你，${form.name || ""}！你的邮箱是？`,
    },
    project: {
      ar: "ممتاز! ما نوع المشروع الذي تريد بناءه؟",
      en: "Excellent! What type of project do you want to build?",
      zh: "太好了！你想建立什么类型的项目？",
    },
    budget: {
      ar: "رائع! ما ميزانيتك التقريبية؟",
      en: "Great! What's your approximate budget?",
      zh: "好的！你的大概预算是多少？",
    },
    message: {
      ar: "أخيراً، أخبرنا المزيد عن رؤيتك للمشروع",
      en: "Finally, tell us more about your project vision",
      zh: "最后，告诉我们更多关于你的项目愿景",
    },
  };

  const canProceed = () => {
    switch (step) {
      case "name": return form.name.trim().length > 0;
      case "email": return form.email.trim().length > 0;
      case "project": return form.project.length > 0;
      case "budget": return form.budget.length > 0;
      case "message": return form.message.trim().length > 0;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Send to WhatsApp
    const projectLabel = projectTypes.find(p => p.key === form.project)?.[l] || form.project;
    const lines = lang === "ar"
      ? [
          `📋 طلب جديد من الموقع`,
          `👤 الاسم: ${form.name}`,
          `📧 البريد: ${form.email}`,
          `🏗️ المشروع: ${projectLabel}`,
          `💰 الميزانية: ${form.budget}`,
          `💬 الرسالة: ${form.message}`,
        ]
      : lang === "zh"
      ? [
          `📋 网站新咨询`,
          `👤 姓名: ${form.name}`,
          `📧 邮箱: ${form.email}`,
          `🏗️ 项目: ${projectLabel}`,
          `💰 预算: ${form.budget}`,
          `💬 信息: ${form.message}`,
        ]
      : [
          `📋 New Website Inquiry`,
          `👤 Name: ${form.name}`,
          `📧 Email: ${form.email}`,
          `🏗️ Project: ${projectLabel}`,
          `💰 Budget: ${form.budget}`,
          `💬 Message: ${form.message}`,
        ];

    setTimeout(() => {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`,
        "_blank"
      );
    }, 2000);
  };

  const stepIcons = [User, Mail, FileText, FileText, MessageCircle];
  const StepIcon = stepIcons[currentStep];

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-primary/8 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/8 blur-[80px]" />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center gradient-text mb-3">
            {t("contact.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-10 text-sm">
            {t("contact.briefing.subtitle")}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-2xl p-8 neon-border"
            >
              {/* Progress bar */}
              <div className="flex gap-1 mb-8">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                      i <= currentStep ? "gradient-purple" : "bg-border/50"
                    }`}
                  />
                ))}
              </div>

              {/* AI message bubble */}
              <motion.div
                key={`ai-${currentStep}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 mb-6"
              >
                <div className="w-9 h-9 rounded-full gradient-purple flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="glass rounded-xl rounded-tl-sm px-4 py-3 text-sm text-foreground">
                  {aiMessages[step][l]}
                </div>
              </motion.div>

              {/* Input area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  {step === "name" && (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && canProceed() && handleNext()}
                      placeholder={t("contact.name")}
                      autoFocus
                      className="w-full px-4 py-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                    />
                  )}
                  {step === "email" && (
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && canProceed() && handleNext()}
                      placeholder={t("contact.email")}
                      autoFocus
                      className="w-full px-4 py-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                    />
                  )}
                  {step === "project" && (
                    <div className="grid grid-cols-2 gap-3">
                      {projectTypes.map((pt) => (
                        <motion.button
                          key={pt.key}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setForm({ ...form, project: pt.key })}
                          className={`px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                            form.project === pt.key
                              ? "gradient-purple text-primary-foreground neon-glow"
                              : "glass neon-border text-foreground hover:bg-primary/10"
                          }`}
                        >
                          {pt[l]}
                        </motion.button>
                      ))}
                    </div>
                  )}
                  {step === "budget" && (
                    <div className="grid grid-cols-2 gap-3">
                      {budgetOptions.map((bo) => (
                        <motion.button
                          key={bo.key}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setForm({ ...form, budget: bo.key })}
                          className={`px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                            form.budget === bo.key
                              ? "gradient-purple text-primary-foreground neon-glow"
                              : "glass neon-border text-foreground hover:bg-primary/10"
                          }`}
                        >
                          {bo[l]}
                        </motion.button>
                      ))}
                    </div>
                  )}
                  {step === "message" && (
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t("contact.message")}
                      rows={4}
                      autoFocus
                      className="w-full px-4 py-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm transition-colors ${
                    currentStep === 0
                      ? "text-muted-foreground/30 cursor-not-allowed"
                      : "text-muted-foreground hover:text-foreground glass"
                  }`}
                >
                  {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  {t("contact.back")}
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                    canProceed()
                      ? "gradient-purple text-primary-foreground neon-glow hover:shadow-[0_0_30px_hsl(265_90%_60%/0.3)]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Send className="w-4 h-4" />
                      {t("contact.submit")}
                    </>
                  ) : (
                    <>
                      {t("contact.next")}
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-2xl p-12 neon-border text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-20 h-20 rounded-full gradient-purple flex items-center justify-center mx-auto mb-6 neon-glow-strong"
              >
                <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold gradient-text mb-3"
              >
                {t("contact.success.title")}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground text-sm"
              >
                {t("contact.success.message")}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ContactSection;

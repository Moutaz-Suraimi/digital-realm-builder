import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, User, Globe, Briefcase, DollarSign, Shield,
  Paperclip, CheckCircle2, ArrowRight, ArrowLeft, X, Check,
  ChevronDown, ChevronUp
} from "lucide-react";

const WHATSAPP_NUMBER = "967780930635";

// ─── Steps ───────────────────────────────────────────────────────────────────
const STEPS = ["name", "country", "services", "budget", "privacy"] as const;
type StepId = typeof STEPS[number];

// ─── Services list ────────────────────────────────────────────────────────────
const SERVICES = [
  { key: "web",      icon: "🌐" },
  { key: "dynamic",  icon: "⚡" },
  { key: "ecommerce",icon: "🛒" },
  { key: "ads",      icon: "📢" },
  { key: "content",  icon: "🎨" },
  { key: "branding", icon: "💎" },
  { key: "social",   icon: "📱" },
  { key: "seo",      icon: "🔍" },
  { key: "video",    icon: "🎬" },
  { key: "mixed",    icon: "🚀" },
] as const;

// ─── Budget options ────────────────────────────────────────────────────────────
const BUDGETS = [
  { key: "under100",  usd: "Under $100" },
  { key: "100_300",   usd: "$100 – $300" },
  { key: "300_500",   usd: "$300 – $500" },
  { key: "500_1000",  usd: "$500 – $1,000" },
  { key: "1000plus",  usd: "$1,000+" },
] as const;

// ─── Step icons map ────────────────────────────────────────────────────────────
const STEP_ICONS: Record<StepId, React.ReactNode> = {
  name:     <User className="w-4 h-4" />,
  country:  <Globe className="w-4 h-4" />,
  services: <Briefcase className="w-4 h-4" />,
  budget:   <DollarSign className="w-4 h-4" />,
  privacy:  <Shield className="w-4 h-4" />,
};

// ─── Floating label input ──────────────────────────────────────────────────────
interface FloatInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoFocus?: boolean;
  isRtl?: boolean;
}
const FloatInput = ({ label, value, onChange, type = "text", autoFocus, isRtl }: FloatInputProps) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div className="relative w-full">
      <motion.label
        animate={{ y: lifted ? -24 : 0, scale: lifted ? 0.8 : 1, color: lifted ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} origin-${isRtl ? "right" : "left"} text-sm font-medium pointer-events-none`}
      >
        {label}
      </motion.label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        dir={isRtl ? "rtl" : "ltr"}
        className={`w-full pt-6 pb-3 ${isRtl ? "pr-4 pl-4" : "px-4"} rounded-xl bg-secondary/40 border transition-all duration-300 text-foreground text-base
          ${focused
            ? "border-primary/70 ring-2 ring-primary/20 shadow-[0_0_20px_hsl(var(--neon-purple)/0.15)]"
            : "border-border/50 hover:border-primary/30"
          } focus:outline-none`}
      />
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const ContactSection = () => {
  const { t, lang } = useLanguage();
  const l = lang as "ar" | "en" | "zh";
  const isRtl = lang === "ar";

  // Form state
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-detect country
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => { if (d?.country_name) setCountry(d.country_name); })
      .catch(() => {});
  }, []);

  const currentStepId = STEPS[step];

  // Validation per step
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (currentStepId === "name" && !name.trim()) errs.name = t("contact.name");
    if (currentStepId === "services" && services.length === 0) errs.services = t("contact.required.services");
    if (currentStepId === "budget" && !budget) errs.budget = t("contact.budget");
    if (currentStepId === "privacy" && !privacy) errs.privacy = t("contact.privacy.required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else handleSubmit();
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const toggleService = (key: string) => {
    setServices(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
    setErrors(e => ({ ...e, services: "" }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const serviceLabels = services.map(k => t(`contact.service.${k}`)).join(", ");
    const budgetLabel = t(`contact.budget.${budget}`);
    const parts = [
      `${t("contact.wa.hello")} ${name} ${t("contact.wa.from")} ${country}.`,
      `${t("contact.wa.interested")} ${serviceLabels}.`,
      `${t("contact.wa.budget")} ${budgetLabel}.`,
      fileName ? `${t("contact.wa.file")} ${fileName}.` : "",
      t("contact.wa.start"),
    ].filter(Boolean);

    setTimeout(() => {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join("\n"))}`,
        "_blank"
      );
    }, 1800);
  };

  // ─── Step content renderers ──────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStepId) {
      case "name":
        return (
          <div className="space-y-4">
            <FloatInput
              label={t("contact.name")}
              value={name}
              onChange={v => { setName(v); setErrors(e => ({ ...e, name: "" })); }}
              autoFocus
              isRtl={isRtl}
            />
            {errors.name && <p className="text-destructive text-xs px-1">{errors.name}</p>}
          </div>
        );

      case "country":
        return (
          <FloatInput
            label={t("contact.country")}
            value={country}
            onChange={setCountry}
            autoFocus
            isRtl={isRtl}
          />
        );

      case "services":
        return (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground mb-2">{t("contact.select.services")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {SERVICES.map(s => {
                const selected = services.includes(s.key);
                return (
                  <motion.button
                    key={s.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleService(s.key)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-start transition-all duration-200
                      ${selected
                        ? "gradient-purple text-primary-foreground neon-glow shadow-md"
                        : "glass border border-border/40 text-foreground hover:border-primary/40 hover:bg-primary/5"
                      }`}
                  >
                    <span className="text-base shrink-0">{s.icon}</span>
                    <span className="flex-1 leading-tight">{t(`contact.service.${s.key}`)}</span>
                    {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
            {errors.services && <p className="text-destructive text-xs px-1">{errors.services}</p>}
          </div>
        );

      case "budget":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BUDGETS.map(b => {
              const selected = budget === b.key;
              return (
                <motion.button
                  key={b.key}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setBudget(b.key); setErrors(e => ({ ...e, budget: "" })); }}
                  className={`px-5 py-4 rounded-xl text-sm font-semibold transition-all duration-200
                    ${selected
                      ? "gradient-purple text-primary-foreground neon-glow"
                      : "glass border border-border/40 text-foreground hover:border-primary/40 hover:bg-primary/5"
                    }`}
                >
                  {t(`contact.budget.${b.key}`)}
                </motion.button>
              );
            })}
            {errors.budget && <p className="text-destructive text-xs px-1 col-span-2">{errors.budget}</p>}
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-5">
            {/* File upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="group flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 bg-secondary/20 cursor-pointer transition-all hover:bg-primary/5"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t("contact.file")}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {fileName || t("contact.file.hint")}
                </p>
              </div>
              {fileName && (
                <button
                  onClick={e => { e.stopPropagation(); setFileName(""); }}
                  className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center hover:bg-destructive/40 transition-colors"
                >
                  <X className="w-3 h-3 text-destructive" />
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              className="hidden"
              onChange={e => setFileName(e.target.files?.[0]?.name || "")}
            />

            {/* Privacy checkbox */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => { setPrivacy(!privacy); setErrors(e => ({ ...e, privacy: "" })); }}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border transition-all duration-200
                ${privacy
                  ? "border-primary/50 bg-primary/10 neon-glow"
                  : "border-border/50 bg-secondary/20 hover:border-primary/30"
                }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                ${privacy ? "gradient-purple border-primary" : "border-border/60"}`}>
                {privacy && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
              <span className="text-sm text-foreground text-start flex-1">
                {t("contact.privacy")}{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-primary underline underline-offset-2 hover:text-accent transition-colors"
                >
                  {t("footer.privacy")}
                </a>
              </span>
            </motion.button>
            {errors.privacy && <p className="text-destructive text-xs px-1">{errors.privacy}</p>}
          </div>
        );
    }
  };

  // ─── Step labels ─────────────────────────────────────────────────────────────
  const stepLabels: Record<StepId, { ar: string; en: string; zh: string }> = {
    name:     { ar: "الاسم", en: "Name", zh: "姓名" },
    country:  { ar: "الدولة", en: "Country", zh: "国家" },
    services: { ar: "الخدمات", en: "Services", zh: "服务" },
    budget:   { ar: "الميزانية", en: "Budget", zh: "预算" },
    privacy:  { ar: "الموافقة", en: "Confirm", zh: "确认" },
  };

  // ─── Ambient description per step ────────────────────────────────────────────
  const stepPrompts: Record<StepId, { ar: string; en: string; zh: string }> = {
    name:     { ar: "كيف يمكنني مناداتك؟", en: "What's your name?", zh: "您叫什么名字？" },
    country:  { ar: "من أي دولة تتواصل معنا؟", en: "Which country are you from?", zh: "您来自哪个国家？" },
    services: { ar: "ما الخدمات التي تحتاجها؟", en: "Which services do you need?", zh: "您需要哪些服务？" },
    budget:   { ar: "ما ميزانيتك التقريبية؟", en: "What's your estimated budget?", zh: "您的预算大概是多少？" },
    privacy:  { ar: "آخر خطوة — قبل الإرسال", en: "Final step — before sending", zh: "最后一步 — 发送前" },
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/6 blur-[100px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold border border-primary/30 bg-primary/10 text-primary mb-4 uppercase tracking-widest">
            {t("contact.briefing.subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text leading-tight">
            {t("contact.title")}
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
            >
              {/* Glass panel */}
              <div className="glass-strong rounded-3xl p-6 md:p-10 neon-border relative overflow-hidden">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(var(--neon-purple)/0.07) 0%, transparent 70%)" }} />

                {/* Step progress */}
                <div className="flex items-center gap-1.5 mb-8">
                  {STEPS.map((sid, i) => {
                    const isActive = i === step;
                    const isDone = i < step;
                    return (
                      <div key={sid} className="flex items-center gap-1.5 flex-1">
                        <motion.div
                          animate={{
                            backgroundColor: isDone || isActive
                              ? "hsl(var(--primary))"
                              : "hsl(var(--border))",
                            scale: isActive ? 1.15 : 1,
                          }}
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-primary-foreground"
                        >
                          {isDone
                            ? <Check className="w-3.5 h-3.5" />
                            : <span className="text-[10px] font-bold">{i + 1}</span>
                          }
                        </motion.div>
                        {i < STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${isDone ? "gradient-purple" : "bg-border/40"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Step icon + label */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`header-${step}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-center gap-3 mb-6 ${isRtl ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center shrink-0 neon-glow">
                      {STEP_ICONS[currentStepId]}
                    </div>
                    <div className={isRtl ? "text-right" : ""}>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {stepLabels[currentStepId][l]}
                      </p>
                      <h3 className="text-lg font-bold text-foreground">
                        {stepPrompts[currentStepId][l]}
                      </h3>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Step content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${step}`}
                    initial={{ opacity: 0, x: isRtl ? -28 : 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? 28 : -28 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-8"
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className={`flex items-center justify-between gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBack}
                    disabled={step === 0}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all
                      ${step === 0
                        ? "opacity-30 cursor-not-allowed text-muted-foreground"
                        : "glass border border-border/40 text-foreground hover:border-primary/40"
                      }`}
                  >
                    {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    {t("contact.back")}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 0 30px hsl(var(--neon-purple)/0.4)" }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm gradient-purple text-primary-foreground neon-glow transition-all"
                  >
                    {step === STEPS.length - 1 ? (
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
                  </motion.button>
                </div>
              </div>

              {/* Summary preview (visible when data entered) */}
              {(name || services.length > 0 || budget) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 glass rounded-2xl p-4 border border-primary/10"
                >
                  <div className="flex flex-wrap gap-2">
                    {name && (
                      <span className="px-3 py-1 rounded-full text-xs bg-primary/15 text-primary border border-primary/20 font-medium">
                        👤 {name}
                      </span>
                    )}
                    {country && (
                      <span className="px-3 py-1 rounded-full text-xs bg-primary/15 text-primary border border-primary/20 font-medium">
                        🌍 {country}
                      </span>
                    )}
                    {services.map(k => (
                      <span key={k} className="px-3 py-1 rounded-full text-xs bg-accent/15 text-accent border border-accent/20 font-medium">
                        {SERVICES.find(s => s.key === k)?.icon} {t(`contact.service.${k}`)}
                      </span>
                    ))}
                    {budget && (
                      <span className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground border border-border/40 font-medium">
                        💰 {t(`contact.budget.${budget}`)}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* ── Success State ─────────────────────────────────────────────── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.35 }}
              className="glass-strong rounded-3xl p-12 neon-border text-center"
            >
              {/* Animated ring */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.15 }}
                  className="absolute inset-0 rounded-full gradient-purple neon-glow-strong flex items-center justify-center"
                >
                  <CheckCircle2 className="w-11 h-11 text-primary-foreground" />
                </motion.div>
                <motion.div
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border-2 border-primary/60"
                />
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold gradient-text mb-3"
              >
                {t("contact.success.title")}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="text-muted-foreground text-sm max-w-sm mx-auto"
              >
                {t("contact.success.message")}
              </motion.p>

              {/* Summary chips */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6 flex flex-wrap justify-center gap-2"
              >
                <span className="px-3 py-1 rounded-full text-xs bg-primary/15 text-primary border border-primary/20">👤 {name}</span>
                {country && <span className="px-3 py-1 rounded-full text-xs bg-primary/15 text-primary border border-primary/20">🌍 {country}</span>}
                {services.slice(0, 3).map(k => (
                  <span key={k} className="px-3 py-1 rounded-full text-xs bg-accent/15 text-accent border border-accent/20">
                    {SERVICES.find(s => s.key === k)?.icon} {t(`contact.service.${k}`)}
                  </span>
                ))}
                {services.length > 3 && (
                  <span className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground border border-border/40">
                    +{services.length - 3}
                  </span>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ContactSection;

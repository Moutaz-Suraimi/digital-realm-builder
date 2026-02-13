import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Eye, Target, Heart } from "lucide-react";

const WHATSAPP = "https://wa.me/967780930635";

const AboutSection = () => {
  const { t } = useLanguage();

  const cards = [
    { icon: Eye, title: t("about.vision.title"), desc: t("about.vision.desc") },
    { icon: Target, title: t("about.mission.title"), desc: t("about.mission.desc") },
    { icon: Heart, title: t("about.values.title"), desc: t("about.values.desc") },
  ];

  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center gradient-text mb-16"
        >
          {t("about.title")}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8, rotateY: -3, rotateX: 3 }}
              className="glass rounded-2xl p-8 neon-border card-3d"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="w-14 h-14 rounded-xl gradient-purple flex items-center justify-center mb-6 neon-glow">
                <card.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 glass rounded-xl neon-border text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {t("about.cta")}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

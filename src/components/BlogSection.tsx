import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight, X, BookOpen } from "lucide-react";

const WHATSAPP = "https://wa.me/967780930635";

const blogPosts = [
  {
    titleKey: "blog.post1.title",
    excerptKey: "blog.post1.excerpt",
    contentKey: "blog.post1.content",
    category: "blog.cat.strategy",
    date: "2026-02-10",
    readTime: 5,
    gradient: "from-primary to-accent",
  },
  {
    titleKey: "blog.post2.title",
    excerptKey: "blog.post2.excerpt",
    contentKey: "blog.post2.content",
    category: "blog.cat.design",
    date: "2026-01-28",
    readTime: 7,
    gradient: "from-accent to-neon-blue",
  },
  {
    titleKey: "blog.post3.title",
    excerptKey: "blog.post3.excerpt",
    contentKey: "blog.post3.content",
    category: "blog.cat.tech",
    date: "2026-01-15",
    readTime: 6,
    gradient: "from-neon-blue to-primary",
  },
  {
    titleKey: "blog.post4.title",
    excerptKey: "blog.post4.excerpt",
    contentKey: "blog.post4.content",
    category: "blog.cat.marketing",
    date: "2026-01-05",
    readTime: 4,
    gradient: "from-primary to-neon-blue",
  },
];

const BlogSection = () => {
  const { t } = useLanguage();
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  return (
    <section id="blog" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-4">
              {t("blog.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("blog.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {blogPosts.map((post, i) => (
            <ScrollReveal key={i} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
              <motion.div
                className="card-3d glass rounded-2xl neon-border overflow-hidden cursor-pointer group"
                whileHover={{ y: -5 }}
                onClick={() => setExpandedPost(i)}
              >
                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${post.gradient}`} />
                
                <div className="p-6">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {t(post.category)}
                  </span>

                  <h3 className="text-xl font-bold text-foreground mt-4 mb-2 group-hover:text-primary transition-colors">
                    {t(post.titleKey)}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {t(post.excerptKey)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime} min
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Expanded reading mode */}
      <AnimatePresence>
        {expandedPost !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setExpandedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="glass-strong rounded-2xl neon-border max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpandedPost(null)}
                className="absolute top-4 end-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`h-1 w-20 rounded-full bg-gradient-to-r ${blogPosts[expandedPost].gradient} mb-6`} />
              
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {t(blogPosts[expandedPost].category)}
              </span>

              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-4 mb-2">
                {t(blogPosts[expandedPost].titleKey)}
              </h2>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {blogPosts[expandedPost].date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {blogPosts[expandedPost].readTime} min
                </span>
              </div>

              <div className="text-muted-foreground leading-relaxed whitespace-pre-line mb-8">
                {t(blogPosts[expandedPost].contentKey)}
              </div>

              <a
                href={`${WHATSAPP}?text=${encodeURIComponent(t("blog.cta.message"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-purple text-primary-foreground font-medium neon-glow-strong hover:shadow-[0_0_40px_hsl(265_90%_60%/0.4)] transition-shadow"
              >
                <BookOpen className="w-4 h-4" />
                {t("blog.cta")}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BlogSection;

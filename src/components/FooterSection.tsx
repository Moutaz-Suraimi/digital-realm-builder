import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const FooterSection = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.services")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">{t("sol.digital")}</li>
              <li className="hover:text-primary transition-colors cursor-pointer">{t("sol.ecommerce")}</li>
              <li className="hover:text-primary transition-colors cursor-pointer">{t("sol.brand")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">{t("nav.about")}</li>
              <li className="hover:text-primary transition-colors cursor-pointer">{t("nav.contact")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.packages")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">{t("packages.websites")}</li>
              <li className="hover:text-primary transition-colors cursor-pointer">{t("packages.ecommerce")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.resources")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">{t("nav.faq")}</li>
              <li className="hover:text-primary transition-colors cursor-pointer">{t("nav.blog")}</li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="gradient-text font-bold text-lg">الصُرَيْمي ميديا</p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Surimi Media. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

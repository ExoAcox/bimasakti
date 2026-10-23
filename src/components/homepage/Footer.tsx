
import { FaGithub } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-1 text-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 gap-y-2 text-xs">
                    <span className="text-center">
                        &copy; {currentYear} Bimasakti. {t("ui.footer_dedication")}
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <span>{t("ui.built_with")}</span>
                        <span>•</span>
                        <a
                            href="https://github.com/ExoAcox/bimasakti"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                            <span>{t("ui.open_source_notice")}</span>
                            <FaGithub className="text-sm" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

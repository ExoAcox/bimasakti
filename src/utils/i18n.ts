import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/translation.json";
import id from "../locales/id/translation.json";
import de from "../locales/de/translation.json";

i18n
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        },
        resources: {
            en: { translation: en },
            id: { translation: id },
            de: { translation: de },
        },
    });
export default i18n;
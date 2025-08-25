import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import eo from "./eo.json"

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        eo: { translation: eo }
    },
    lng: "en",            // default language
    fallbackLng: "en",    // fallback if translation is missing
    interpolation: {
        escapeValue: false
    }
});

export default i18n;

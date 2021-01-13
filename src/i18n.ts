import i18n from "i18next";
import en_translation from "./assets/locales/en/translation.json";
import { initReactI18next } from "react-i18next";

export const resources = {
    en: {
        translation: en_translation,
    },
} as const;

i18n.use(initReactI18next).init({
    lng: "en",
    resources,
});

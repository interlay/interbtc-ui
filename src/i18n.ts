import i18n from 'i18next';
import enTranslation from './assets/locales/en/translation.json';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: enTranslation
  }
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  resources
});

export { resources };

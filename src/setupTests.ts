// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './assets/locales/en/translation.json';

const resources = {
    en: {
        translation: enTranslation
    }
} as const;

i18n.use(initReactI18next).init({
    lng: 'en',
    resources
});
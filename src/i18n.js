import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationID from './locales/id/translation.json';
import translationEN from './locales/en/translation.json';
import translationJA from './locales/ja/translation.json';

const resources = {
    id: { translation: translationID },
    en: { translation: translationEN },
    ja: { translation: translationJA },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'id', // default ke Bahasa Indonesia
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'], // urutan deteksi bahasa
            caches: ['localStorage'],
        },
    });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from '../messages/es.json';
import en from '../messages/en.json';
import pt from '../messages/pt.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt }
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

// Load saved language after hydration
if (typeof window !== 'undefined') {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && ['es', 'en', 'pt'].includes(savedLanguage)) {
    i18n.changeLanguage(savedLanguage);
  }
}

export default i18n;

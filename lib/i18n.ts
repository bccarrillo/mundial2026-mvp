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
    lng: typeof window !== 'undefined' ? localStorage.getItem('language') || 'es' : 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

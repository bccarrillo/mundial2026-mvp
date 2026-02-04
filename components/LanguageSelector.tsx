'use client'

import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'

export default function LanguageSelector() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  return (
    <div className="flex gap-1">
      <Button
        variant={i18n.language === 'es' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => changeLanguage('es')}
      >
        ES
      </Button>
      <Button
        variant={i18n.language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => changeLanguage('en')}
      >
        EN
      </Button>
      <Button
        variant={i18n.language === 'pt' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => changeLanguage('pt')}
      >
        PT
      </Button>
    </div>
  )
}

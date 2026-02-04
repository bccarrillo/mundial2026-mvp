'use client'

import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'

export default function LanguageSelector() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  const flags: Record<string, string> = {
    es: '🇪🇸',
    en: '🇺🇸',
    pt: '🇧🇷'
  }

  return (
    <div className="flex gap-1">
      {(['es', 'en', 'pt'] as const).map((lng) => (
        <Button
          key={lng}
          variant={i18n.language === lng ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => changeLanguage(lng)}
          className="px-2"
        >
          {flags[lng]}
        </Button>
      ))}
    </div>
  )
}

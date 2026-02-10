'use client'

import { useState, useEffect } from 'react'
import es from '../messages/es.json'
import en from '../messages/en.json'
import pt from '../messages/pt.json'

type TranslationKey = string

const translations = { es, en, pt }

export function useV2Translation() {
  const [language, setLanguage] = useState('es')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem('language') || 'es'
    if (['es', 'en', 'pt'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const t = (key: TranslationKey): string => {
    if (!mounted) {
      // Return fallback text during SSR
      const fallbacks: Record<string, string> = {
        'v2.dashboard.welcome': '¡Bienvenido!',
        'v2.dashboard.createMemory': 'Crear Nuevo Recuerdo',
        'v2.dashboard.viewNFTs': 'Ver Mis NFTs',
        'v2.dashboard.exploreEvents': 'Explorar Eventos',
        'v2.dashboard.inviteFriends': 'Invitar Amigos',
        'v2.dashboard.viewGallery': 'Ver Galería Pública'
      }
      return fallbacks[key] || key
    }
    
    const keys = key.split('.')
    let value: any = translations[language as keyof typeof translations]
    
    for (const k of keys) {
      value = value?.[k]
      if (!value) break
    }
    
    return typeof value === 'string' ? value : key
  }

  const changeLanguage = (lng: string) => {
    if (['es', 'en', 'pt'].includes(lng)) {
      setLanguage(lng)
      localStorage.setItem('language', lng)
    }
  }

  return { t, language, changeLanguage, mounted }
}
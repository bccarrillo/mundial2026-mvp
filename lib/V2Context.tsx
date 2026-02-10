'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const translations = {
  es: {
    dashboard: {
      welcome: '¡Bienvenido!',
      createMemory: 'Crear Nuevo Recuerdo',
      viewNFTs: 'Ver Mis NFTs',
      exploreEvents: 'Explorar Eventos',
      inviteFriends: 'Invitar Amigos',
      viewGallery: 'Ver Galería Pública'
    },
    nav: {
      feed: 'Recuerdos',
      dashboard: 'Dashboard',
      create: 'Crear',
      rankings: 'Rankings',
      menu: 'Menú',
      language: 'Idioma',
      logout: 'Cerrar Sesión'
    }
  },
  en: {
    dashboard: {
      welcome: 'Welcome!',
      createMemory: 'Create New Memory',
      viewNFTs: 'View My NFTs',
      exploreEvents: 'Explore Events',
      inviteFriends: 'Invite Friends',
      viewGallery: 'View Public Gallery'
    },
    nav: {
      feed: 'Memories',
      dashboard: 'Dashboard',
      create: 'Create',
      rankings: 'Rankings',
      menu: 'Menu',
      language: 'Language',
      logout: 'Logout'
    }
  },
  pt: {
    dashboard: {
      welcome: 'Bem-vindo!',
      createMemory: 'Criar Nova Memória',
      viewNFTs: 'Ver Meus NFTs',
      exploreEvents: 'Explorar Eventos',
      inviteFriends: 'Convidar Amigos',
      viewGallery: 'Ver Galeria Pública'
    },
    nav: {
      feed: 'Memórias',
      dashboard: 'Dashboard',
      create: 'Criar',
      rankings: 'Rankings',
      menu: 'Menu',
      language: 'Idioma',
      logout: 'Sair'
    }
  }
}

interface V2ContextType {
  language: string
  t: (key: string) => string
  changeLanguage: (lang: string) => void
}

const V2Context = createContext<V2ContextType | null>(null)

export function V2Provider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    const saved = localStorage.getItem('language') || 'es'
    if (['es', 'en', 'pt'].includes(saved)) {
      setLanguage(saved)
    }
  }, [])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language as keyof typeof translations]
    
    for (const k of keys) {
      value = value?.[k]
      if (!value) break
    }
    
    return typeof value === 'string' ? value : key
  }

  const changeLanguage = (lang: string) => {
    if (['es', 'en', 'pt'].includes(lang)) {
      setLanguage(lang)
      localStorage.setItem('language', lang)
    }
  }

  return (
    <V2Context.Provider value={{ language, t, changeLanguage }}>
      {children}
    </V2Context.Provider>
  )
}

export function useV2() {
  const context = useContext(V2Context)
  if (!context) {
    throw new Error('useV2 must be used within V2Provider')
  }
  return context
}
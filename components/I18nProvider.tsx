'use client'

import { useState, useEffect } from 'react'

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Initialize i18n after mount
    import('../lib/i18n')
  }, [])

  // Render children immediately to avoid hydration mismatch
  return <>{children}</>
}

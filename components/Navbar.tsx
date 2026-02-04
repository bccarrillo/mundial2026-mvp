'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageSelector'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()
  const { t } = useTranslation()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          ⚽ Mundial 2026
        </Link>
        
        <div className="flex gap-2 items-center">
          <LanguageSelector />
          
          <Link href="/feed">
            <Button variant="ghost">{t('nav.feed')}</Button>
          </Link>
          
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">{t('nav.dashboard')}</Button>
              </Link>
              <Link href="/crear">
                <Button>+ {t('nav.create')}</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{t('nav.login')}</Button>
              </Link>
              <Link href="/register">
                <Button>{t('nav.register')}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageSelector'
import VIPBadge from './VIPBadge'
import VIPPurchaseModal from './VIPPurchaseModalDemo'
import { getUserPoints, getLevelInfo } from '@/lib/points'
import { isUserVIPClient } from '@/lib/vip-client'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [userPoints, setUserPoints] = useState<any>(null)
  const [isVIP, setIsVIP] = useState(false)
  const [showVIPModal, setShowVIPModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { t } = useTranslation()

  // Función para recargar puntos y estado VIP
  const refreshUserData = async (userId: string) => {
    try {
      const [points, vipStatus] = await Promise.all([
        getUserPoints(userId),
        isUserVIPClient(userId)
      ])
      setUserPoints(points)
      setIsVIP(vipStatus)
    } catch (err) {
      console.error('Error refreshing user data:', err)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Cargar puntos y estado VIP de forma asíncrona sin bloquear
      if (user) {
        refreshUserData(user.id)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        refreshUserData(session.user.id)
      } else {
        setUserPoints(null)
        setIsVIP(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, refreshTrigger])

  // Recargar puntos cada 30 segundos
  useEffect(() => {
    if (!user) return
    
    const interval = setInterval(() => {
      refreshUserData(user.id)
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [user])

  // Recargar datos cuando cambia la ruta (navegación)
  useEffect(() => {
    if (user) {
      refreshUserData(user.id)
    }
  }, [pathname, user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-bold">
            ⚽ Mundial 2026
          </Link>
          
          <div className="flex gap-1.5 md:gap-2 items-center flex-wrap gap-y-2">
            <LanguageSelector />
            
            <Link href="/feed">
              <Button 
                variant={isActive('/feed') ? 'default' : 'ghost'} 
                size="default"
                className="text-sm h-9 px-3"
              >
                {t('nav.feed')}
              </Button>
            </Link>
            
            {user ? (
              <>
                {userPoints && (
                  <div className="flex items-center gap-2">
                    <Link href="/puntos">
                      <Button 
                        variant={isActive('/puntos') ? 'default' : 'outline'} 
                        size="default"
                        className="text-sm h-9 px-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
                        onClick={() => {
                          // Forzar refresh de datos al hacer clic
                          if (user) {
                            refreshUserData(user.id)
                          }
                        }}
                      >
                        {getLevelInfo(userPoints.level).emoji} {userPoints.points}
                      </Button>
                    </Link>
                    {isVIP && (
                      <Link href="/vip">
                        <VIPBadge isVIP={true} size="sm" />
                      </Link>
                    )}
                    {!isVIP && <VIPBadge isVIP={false} size="sm" />}
                  </div>
                )}
                
                {/* Botón VIP si no es VIP */}
                {user && !isVIP && (
                  <Button 
                    onClick={() => setShowVIPModal(true)}
                    size="default"
                    className="text-sm h-9 px-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold"
                  >
                    ⭐ Hazte VIP
                  </Button>
                )}
                <Link href="/dashboard">
                  <Button 
                    variant={isActive('/dashboard') ? 'default' : 'ghost'} 
                    size="default"
                    className="text-sm h-9 px-3"
                  >
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                <Link href="/crear">
                  <Button size="default" className="text-sm h-9 px-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">+ {t('nav.create')}</Button>
                </Link>
                <Link href="/rankings">
                  <Button 
                    variant={isActive('/rankings') ? 'default' : 'outline'} 
                    size="default" 
                    className="text-sm h-9 px-3"
                  >
                    🏆 Rankings
                  </Button>
                </Link>
                <Link href="/apoyar">
                  <Button variant="outline" size="default" className="text-sm h-9 px-3">
                    💝 {t('nav.support')}
                  </Button>
                </Link>
                <Button variant="outline" size="default" onClick={handleLogout} className="text-sm h-9 px-3">
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="default" className="text-sm h-9 px-3">{t('nav.login')}</Button>
                </Link>
                <Link href="/register">
                  <Button size="default" className="text-sm h-9 px-3">{t('nav.register')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de compra VIP */}
      <VIPPurchaseModal 
        isOpen={showVIPModal}
        onClose={() => setShowVIPModal(false)}
        onSuccess={() => {
          setShowVIPModal(false)
          if (user) {
            refreshUserData(user.id)
          }
        }}
      />
    </nav>
  )
}

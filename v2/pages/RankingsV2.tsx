'use client'

import { useEffect, useState } from 'react'
import { useV2 } from '@/lib/V2Context'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import MobileHeader from '../components/MobileHeader'
import BottomNavigation from '../components/BottomNavigation'
import Icon from '../components/Icon'
import '../globals.css'

interface UserRanking {
  user_id: string
  points: number
  level: number
  position: number
  profiles: {
    display_name: string
  }
}

interface UserPosition {
  position: number
  points: number
  level: number
  total_users: number
}

const getLevelName = (level: number): string => {
  const levels = {
    1: 'Novato',
    2: 'Aficionado', 
    3: 'Seguidor',
    4: 'Fanático',
    5: 'Experto'
  }
  return levels[level as keyof typeof levels] || 'Novato'
}

const getLevelColor = (level: number): string => {
  const colors = {
    1: 'text-gray-400',
    2: 'text-blue-500',
    3: 'text-green-500', 
    4: 'text-purple-500',
    5: 'text-orange-500'
  }
  return colors[level as keyof typeof colors] || 'text-gray-400'
}

const getRankIcon = (position: number): string => {
  if (position === 1) return '🥇'
  if (position === 2) return '🥈'
  if (position === 3) return '🥉'
  return position.toString()
}

export default function RankingsV2() {
  const { t } = useV2();
  const [userRankings, setUserRankings] = useState<UserRanking[]>([])
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user?.id || null)
      await loadRankings()
    }
    init()
  }, [])

  const loadRankings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: 'users',
        country: 'global',
        ...(currentUser && { userId: currentUser })
      })

      const response = await fetch(`/api/rankings?${params}`)
      const data = await response.json()

      if (data.success) {
        setUserRankings(data.data)
        setUserPosition(data.userPosition)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error loading rankings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadRankings()
  }

  const handleCreateMemory = () => {
    router.push('/v2/crear')
  }

  if (loading) {
    return (
      <div className="font-display bg-white min-h-screen max-w-md mx-auto">
        <MobileHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">{t('rankings.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="font-display bg-white min-h-screen max-w-md mx-auto">
      <MobileHeader />
      
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        <div className="px-4 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <span>🏆</span> {t('rankings.title')}
              </h2>
              <button 
                onClick={handleCreateMemory}
                className="bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <span className="font-bold text-xl text-white">+</span>
                <span className="font-bold text-sm tracking-wide">{t('buttons.create')}</span>
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('rankings.subtitle')}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400">◐</span>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">
                Última actualización: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* User Position */}
          {userPosition && currentUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <div className="text-center">
                <h3 className="font-bold text-blue-800 mb-2">📍 {t('rankings.yourPosition')}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  #{userPosition.position}
                </div>
                <p className="text-blue-600 text-sm">
                  {t('rankings.of')} {userPosition.total_users.toLocaleString()} {t('rankings.users')}
                </p>
                <p className="text-blue-500 text-xs mt-1">
                  Top {Math.round((userPosition.position / userPosition.total_users) * 100)}%
                </p>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <span className={`text-lg ${loading ? 'animate-spin' : ''}`}>↻</span>
              <span className="text-sm font-medium">
                {loading ? t('rankings.updating') : t('rankings.refresh')}
              </span>
            </button>
          </div>

          {/* Rankings List */}
          <div className="space-y-3">
            {userRankings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('rankings.noUsers')}</p>
              </div>
            ) : (
              userRankings.map((user, index) => {
                const isCurrentUser = user.user_id === currentUser
                const position = index + 1
                
                return (
                  <div
                    key={user.user_id}
                    className={`rounded-2xl p-4 flex items-center justify-between transition-shadow ${
                      position === 1
                        ? 'bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 ring-1 ring-amber-400/20'
                        : isCurrentUser
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl w-8 text-center">
                        {getRankIcon(position)}
                      </span>
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm ${
                          position === 1
                            ? 'bg-amber-200 text-amber-800'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {user.profiles.display_name
                            ? user.profiles.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                            : 'U'
                          }
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5">
                          <span className="text-xs text-mexico-green">⚽</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-[#333333] dark:text-white">
                            {user.profiles.display_name || 'Usuario'}
                            {isCurrentUser && ' (TÚ)'}
                          </h3>
                          {position === 1 && (
                            <span className="bg-amber-400 text-[8px] font-black text-white px-1 rounded uppercase tracking-tighter">
                              PRO
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-wide ${
                          position === 1 ? 'text-amber-700 dark:text-amber-400' : getLevelColor(user.level)
                        }`}>
                          Nivel {user.level} {getLevelName(user.level)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`block text-lg font-black ${
                        position === 1 ? 'text-amber-700 dark:text-amber-400' : 'text-[#333333] dark:text-white'
                      }`}>
                        {user.points}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {t('rankings.users')}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* CTA */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold mb-2">🚀 {t('rankings.wantToClimb')}</h3>
            <p className="text-gray-600 mb-4 text-sm">
              {t('rankings.climbDescription')}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCreateMemory}
                className="bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                <span className="text-white">+</span> {t('rankings.createMemoryPoints')}
              </button>
              <button
                onClick={() => router.push('/v2/feed')}
                className="bg-primary/10 text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-colors"
              >
                <span>▶</span> {t('rankings.viewGallery')}
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
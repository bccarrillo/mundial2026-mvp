'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RankingCard from '@/components/RankingCard'
import MemoryRankingCard from '@/components/MemoryRankingCard'

type TabType = 'users' | 'memories'
type CountryType = 'global' | 'colombia' | 'mexico' | 'argentina' | 'brasil' | 'usa' | 'canada'

interface UserRanking {
  user_id: string
  points: number
  level: number
  profiles: {
    display_name: string
    email: string
  }
}

interface MemoryRanking {
  id: string
  title: string
  image_url: string
  created_at: string
  profiles: {
    display_name: string
  }
  likes_count: number
}

interface UserPosition {
  position: number
  points: number
  level: number
  total_users: number
}

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('users')
  const [selectedCountry, setSelectedCountry] = useState<CountryType>('global')
  const [userRankings, setUserRankings] = useState<UserRanking[]>([])
  const [memoryRankings, setMemoryRankings] = useState<MemoryRanking[]>([])
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  
  const router = useRouter()
  const supabase = createClient()

  const countries = [
    { value: 'global', label: '🌍 Global', flag: '🌍' },
    { value: 'colombia', label: '🇨🇴 Colombia', flag: '🇨🇴' },
    { value: 'mexico', label: '🇲🇽 México', flag: '🇲🇽' },
    { value: 'argentina', label: '🇦🇷 Argentina', flag: '🇦🇷' },
    { value: 'brasil', label: '🇧🇷 Brasil', flag: '🇧🇷' },
    { value: 'usa', label: '🇺🇸 USA', flag: '🇺🇸' },
    { value: 'canada', label: '🇨🇦 Canadá', flag: '🇨🇦' }
  ]

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user?.id || null)
      await loadRankings()
    }
    init()
  }, [activeTab, selectedCountry])

  // Auto-refresh cada 60 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadRankings()
    }, 60000)

    return () => clearInterval(interval)
  }, [activeTab, selectedCountry])

  const loadRankings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: activeTab,
        country: selectedCountry,
        ...(currentUser && { userId: currentUser })
      })

      const response = await fetch(`/api/rankings?${params}`)
      const data = await response.json()

      if (data.success) {
        if (activeTab === 'users') {
          setUserRankings(data.data)
          setUserPosition(data.userPosition)
        } else {
          setMemoryRankings(data.data)
        }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          ← Volver
        </Button>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">🏆 Rankings</h1>
          <p className="text-muted-foreground">
            Compite con fanáticos de todo el mundo
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Última actualización: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className="flex-1"
          >
            👥 Usuarios
          </Button>
          <Button
            variant={activeTab === 'memories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('memories')}
            className="flex-1"
          >
            📸 Recuerdos
          </Button>
        </div>

        {/* Filtro de país (solo para usuarios) */}
        {activeTab === 'users' && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <Button
                  key={country.value}
                  variant={selectedCountry === country.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCountry(country.value as CountryType)}
                >
                  {country.flag}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Mi posición (solo para usuarios) */}
        {activeTab === 'users' && userPosition && currentUser && (
          <Card className="mb-6 border-2 border-blue-500 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-center text-blue-800">
                📍 Tu Posición
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                #{userPosition.position}
              </div>
              <p className="text-muted-foreground">
                de {userPosition.total_users.toLocaleString()} usuarios
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Estás en el top {Math.round((userPosition.position / userPosition.total_users) * 100)}%
              </p>
            </CardContent>
          </Card>
        )}

        {/* Botón refresh */}
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? '🔄 Actualizando...' : '🔄 Actualizar'}
          </Button>
        </div>

        {/* Rankings */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Cargando rankings...</p>
            </div>
          ) : (
            <>
              {activeTab === 'users' ? (
                userRankings.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">
                        No hay usuarios en este ranking aún
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  userRankings.map((user, index) => (
                    <RankingCard
                      key={user.user_id}
                      position={index + 1}
                      user={user}
                      isCurrentUser={user.user_id === currentUser}
                    />
                  ))
                )
              ) : (
                memoryRankings.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">
                        No hay recuerdos en este ranking aún
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  memoryRankings.map((memory, index) => (
                    <MemoryRankingCard
                      key={memory.id}
                      position={index + 1}
                      memory={memory}
                    />
                  ))
                )
              )}
            </>
          )}
        </div>

        {/* CTA */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <CardContent className="text-center p-6">
            <h3 className="text-xl font-bold mb-2">🚀 ¿Quieres subir en el ranking?</h3>
            <p className="text-muted-foreground mb-4">
              Crea recuerdos, recibe likes y comenta para ganar puntos
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => router.push('/crear')}>
                📸 Crear Recuerdo (+10 pts)
              </Button>
              <Button variant="outline" onClick={() => router.push('/puntos')}>
                🎮 Ver Mis Puntos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
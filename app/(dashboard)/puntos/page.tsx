'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getUserPoints, getPointsHistory, getLevelInfo, getLevelProgress, POINT_VALUES } from '@/lib/points'

interface UserPoints {
  points: number
  level: number
  created_at: string
}

interface PointTransaction {
  id: string
  points: number
  action: string
  created_at: string
}

export default function PuntosPage() {
  const router = useRouter()
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null)
  const [history, setHistory] = useState<PointTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    try {
      const [pointsData, historyData] = await Promise.all([
        getUserPoints(user.id),
        getPointsHistory(user.id, 20)
      ])

      setUserPoints(pointsData)
      setHistory(historyData)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionText = (action: string) => {
    const actions: Record<string, string> = {
      create_memory: 'Crear recuerdo',
      receive_like: 'Recibir like',
      comment: 'Comentar',
      share: 'Compartir',
      invite: 'Invitar amigo'
    }
    return actions[action] || action
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando puntos...</p>
        </div>
      </div>
    )
  }

  if (!userPoints) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error al cargar puntos</p>
      </div>
    )
  }

  const levelInfo = getLevelInfo(userPoints.level)
  const progress = getLevelProgress(userPoints.points, userPoints.level)

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

        {/* Header con puntos y nivel */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🎮 Mis Puntos</h1>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {userPoints.points.toLocaleString()}
          </div>
          <div className="text-2xl">
            {levelInfo.emoji} {levelInfo.name} (Nivel {userPoints.level})
          </div>
        </div>

        {/* Progreso al siguiente nivel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              Progreso al siguiente nivel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{levelInfo.name}</span>
                <span>{progress.nextLevelName}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress.progress}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {progress.pointsToNext > 0 
                  ? `${progress.pointsToNext} puntos para ${progress.nextLevelName}`
                  : '¡Nivel máximo alcanzado!'
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cómo ganar puntos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🎯 Cómo ganar puntos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span>📸 Crear recuerdo</span>
                <span className="font-bold text-blue-600">+{POINT_VALUES.create_memory}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span>❤️ Recibir like</span>
                <span className="font-bold text-red-600">+{POINT_VALUES.receive_like}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span>💬 Comentar</span>
                <span className="font-bold text-green-600">+{POINT_VALUES.comment}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span>📱 Compartir</span>
                <span className="font-bold text-purple-600">+{POINT_VALUES.share}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg md:col-span-2">
                <span>👥 Invitar amigo</span>
                <span className="font-bold text-yellow-600">+{POINT_VALUES.invite}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historial de puntos */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Historial reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aún no tienes actividad. ¡Crea tu primer recuerdo para ganar puntos!
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex justify-between items-center p-3 bg-white rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">
                        {getActionText(transaction.action)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.created_at)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push('/crear')}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            📸 Crear Recuerdo (+{POINT_VALUES.create_memory} puntos)
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/rankings')}
          >
            🏆 Ver Rankings
          </Button>
        </div>
      </div>
    </div>
  )
}
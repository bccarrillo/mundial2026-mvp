import { Card, CardContent } from '@/components/ui/card'
import { getLevelInfo } from '@/lib/points'

interface RankingCardProps {
  position: number
  user: {
    user_id: string
    points: number
    level: number
    profiles: {
      display_name: string
      email: string
    }
  }
  isCurrentUser?: boolean
}

export default function RankingCard({ position, user, isCurrentUser = false }: RankingCardProps) {
  const levelInfo = getLevelInfo(user.level)
  
  const getMedalEmoji = (pos: number) => {
    switch (pos) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${pos}`
    }
  }

  const getCardStyle = () => {
    if (isCurrentUser) {
      return 'border-2 border-blue-500 bg-blue-50'
    }
    if (position <= 3) {
      return 'border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50'
    }
    if (position <= 10) {
      return 'border border-gray-300 bg-gray-50'
    }
    return 'border border-gray-200'
  }

  return (
    <Card className={`${getCardStyle()} transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Posición */}
            <div className="text-2xl font-bold min-w-[60px] text-center">
              {getMedalEmoji(position)}
            </div>
            
            {/* Info del usuario */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{levelInfo.emoji}</span>
                <h3 className="font-semibold text-lg">
                  {user.profiles.display_name}
                  {isCurrentUser && (
                    <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
                      TÚ
                    </span>
                  )}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {levelInfo.name} • Nivel {user.level}
              </p>
            </div>
          </div>

          {/* Puntos */}
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {user.points.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              puntos
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface MemoryRankingCardProps {
  position: number
  memory: {
    id: string
    title: string
    image_url: string
    created_at: string
    profiles: {
      display_name: string
    }
    likes_count: number
  }
}

export default function MemoryRankingCard({ position, memory }: MemoryRankingCardProps) {
  const getMedalEmoji = (pos: number) => {
    switch (pos) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${pos}`
    }
  }

  const getCardStyle = () => {
    if (position <= 3) {
      return 'border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50'
    }
    if (position <= 10) {
      return 'border border-gray-300 bg-gray-50'
    }
    return 'border border-gray-200'
  }

  return (
    <Link href={`/recuerdo/${memory.id}`}>
      <Card className={`${getCardStyle()} transition-all hover:shadow-md cursor-pointer`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Posición */}
            <div className="text-xl font-bold min-w-[50px] text-center">
              {getMedalEmoji(position)}
            </div>
            
            {/* Imagen */}
            <img
              src={memory.image_url}
              alt={memory.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            
            {/* Info del recuerdo */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">
                {memory.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Por: {memory.profiles.display_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(memory.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Likes */}
            <div className="text-right">
              <div className="text-xl font-bold text-red-500">
                ❤️ {memory.likes_count}
              </div>
              <div className="text-sm text-muted-foreground">
                likes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
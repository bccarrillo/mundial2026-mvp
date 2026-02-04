'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Memory } from '@/types/database'

export default function RecuerdoPage() {
  const [memory, setMemory] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const fetchMemory = async () => {
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          profiles (display_name, email)
        `)
        .eq('id', params.id)
        .single()

      if (!error && data) {
        setMemory(data)
      }
      setLoading(false)
    }

    fetchMemory()
  }, [params.id, supabase])

  const handleLike = async () => {
    if (!memory || liked) return

    const { error } = await supabase
      .from('memories')
      .update({ likes: memory.likes + 1 })
      .eq('id', memory.id)

    if (!error) {
      setMemory({ ...memory, likes: memory.likes + 1 })
      setLiked(true)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({
        title: memory?.title,
        text: memory?.description || '',
        url: url,
      })
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copiado al portapapeles')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!memory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Recuerdo no encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push('/feed')}
          className="mb-4"
        >
          ← Volver al Feed
        </Button>

        <Card>
          <img
            src={memory.image_url}
            alt={memory.title}
            className="w-full h-96 object-cover rounded-t-lg"
          />
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-4">{memory.title}</h1>
            
            {memory.description && (
              <p className="text-muted-foreground mb-4">{memory.description}</p>
            )}

            {memory.team && (
              <p className="text-lg mb-2">⚽ {memory.team}</p>
            )}

            {memory.match_date && (
              <p className="text-sm text-muted-foreground mb-4">
                📅 {new Date(memory.match_date).toLocaleDateString()}
              </p>
            )}

            {memory.profiles && (
              <p className="text-sm text-muted-foreground mb-4">
                👤 Por: <span className="font-semibold">{memory.profiles.display_name}</span>
              </p>
            )}

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleLike}
                disabled={liked}
                variant={liked ? 'secondary' : 'default'}
              >
                ❤️ {memory.likes} {liked ? '(Te gusta)' : 'Me gusta'}
              </Button>
              <Button onClick={handleShare} variant="outline">
                🔗 Compartir
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Creado el {new Date(memory.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold mb-2">
              📸 ¿Tienes recuerdos del Mundial?
            </p>
            <p className="text-muted-foreground mb-4">
              Crea tu álbum digital gratis
            </p>
            <Button onClick={() => router.push('/register')}>
              Crear mi cuenta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

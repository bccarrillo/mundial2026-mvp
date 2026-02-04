'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Memory } from '@/types/database'

export default function FeedPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchMemories = async () => {
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          profiles (display_name, email)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setMemories(data)
      }
      setLoading(false)
    }

    fetchMemories()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">⚽ Recuerdos del Mundial</h1>

        {memories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Aún no hay recuerdos públicos
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <Card 
                key={memory.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/recuerdo/${memory.id}`)}
              >
                <img
                  src={memory.image_url}
                  alt={memory.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{memory.title}</h3>
                  {memory.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {memory.description}
                    </p>
                  )}
                  {memory.team && (
                    <p className="text-sm mt-2">⚽ {memory.team}</p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground">
                      {new Date(memory.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm">❤️ {memory.likes}</p>
                  </div>
                  {memory.profiles && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Por: {memory.profiles.display_name}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

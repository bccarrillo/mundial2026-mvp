'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Memory } from '@/types/database'

export default function MisRecuerdosPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchMemories()
  }, [router, supabase])

  const fetchMemories = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setMemories(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('¿Estás seguro de eliminar este recuerdo?')) return

    // Eliminar imagen del storage
    const fileName = imageUrl.split('/').pop()
    if (fileName) {
      await supabase.storage.from('memories').remove([fileName])
    }

    // Eliminar recuerdo de la DB
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id)

    if (!error) {
      setMemories(memories.filter(m => m.id !== id))
    }
  }

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">📸 Mis Recuerdos</h1>
          <Button onClick={() => router.push('/crear')}>
            + Crear Recuerdo
          </Button>
        </div>

        {memories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Aún no tienes recuerdos
              </p>
              <Button onClick={() => router.push('/crear')}>
                Crear tu primer recuerdo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <Card key={memory.id} className="overflow-hidden">
                <img
                  src={memory.image_url}
                  alt={memory.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => router.push(`/recuerdo/${memory.id}`)}
                />
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{memory.title}</h3>
                  {memory.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {memory.description}
                    </p>
                  )}
                  {memory.team && (
                    <p className="text-sm mb-2">⚽ {memory.team}</p>
                  )}
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs text-muted-foreground">
                      {new Date(memory.created_at).toLocaleDateString()}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {memory.is_public ? '🌍 Público' : '🔒 Privado'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/editar/${memory.id}`)}
                    >
                      ✏️ Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDelete(memory.id, memory.image_url)}
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

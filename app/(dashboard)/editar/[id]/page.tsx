'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import imageCompression from 'browser-image-compression'
import { generateFileName } from '@/lib/utils/file'

export default function EditarRecuerdoPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [team, setTeam] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [image, setImage] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const fetchMemory = async () => {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!error && data) {
        setTitle(data.title)
        setDescription(data.description || '')
        setTeam(data.team || '')
        setMatchDate(data.match_date || '')
        setIsPublic(data.is_public)
        setCurrentImageUrl(data.image_url)
        setPreview(data.image_url)
      }
    }

    fetchMemory()
  }, [params.id, supabase])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    try {
      const compressedFile = await imageCompression(file, options)
      setImage(compressedFile)
      setPreview(URL.createObjectURL(compressedFile))
    } catch (error) {
      setError('Error al procesar la imagen')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      let imageUrl = currentImageUrl

      // Si hay nueva imagen, subirla
      if (image) {
        const fileName = generateFileName(user.id, image.name)
        const { error: uploadError } = await supabase.storage
          .from('memories')
          .upload(fileName, image)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('memories')
          .getPublicUrl(fileName)

        imageUrl = publicUrl

        // Eliminar imagen anterior
        const oldFileName = currentImageUrl.split('/').pop()
        if (oldFileName) {
          await supabase.storage.from('memories').remove([oldFileName])
        }
      }

      // Actualizar recuerdo
      const { error: updateError } = await supabase
        .from('memories')
        .update({
          title,
          description,
          team,
          match_date: matchDate || null,
          image_url: imageUrl,
          is_public: isPublic,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (updateError) throw updateError

      router.push('/mis-recuerdos')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push('/mis-recuerdos')}
          className="mb-4"
        >
          ← Volver
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">✏️ Editar Recuerdo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="image">Imagen</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-full h-48 object-cover rounded"
                  />
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Deja vacío para mantener la imagen actual
                </p>
              </div>

              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="team">Equipo</Label>
                <Input
                  id="team"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="matchDate">Fecha del partido</Label>
                <Input
                  id="matchDate"
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="isPublic" className="cursor-pointer">
                  🌍 Hacer público (aparecerá en el feed)
                </Label>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

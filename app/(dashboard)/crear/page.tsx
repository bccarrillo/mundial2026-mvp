'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import imageCompression from 'browser-image-compression'
import { generateFileName } from '@/lib/utils/file'
import { useTranslation } from 'react-i18next'

export default function CrearRecuerdoPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [team, setTeam] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const { t } = useTranslation()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Comprimir imagen
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
    if (!image) {
      setError(t('create.imageRequired'))
      return
    }

    setLoading(true)
    setError('')

    try {
      // Obtener usuario
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // Subir imagen
      const fileName = generateFileName(user.id, image.name)
      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(fileName, image)

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('memories')
        .getPublicUrl(fileName)

      // Crear recuerdo
      const { error: insertError } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          title,
          description,
          team,
          match_date: matchDate || null,
          image_url: publicUrl,
          is_public: isPublic
        })

      if (insertError) throw insertError

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
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          ← {t('common.back')}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">📸 {t('create.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="image">{t('create.imageLabel')} *</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-full h-48 object-cover rounded"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="title">{t('create.titleLabel')} *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('create.titlePlaceholder')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">{t('create.descriptionLabel')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('create.descriptionPlaceholder')}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="team">{t('create.teamLabel')}</Label>
                <Input
                  id="team"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder={t('create.teamPlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="matchDate">{t('create.dateLabel')}</Label>
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
                  🌍 {t('create.publicLabel')} ({t('create.publicDesc')})
                </Label>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('create.saving') : t('create.saveButton')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

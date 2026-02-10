'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import imageCompression from 'browser-image-compression'
import { generateFileName } from '@/lib/utils/file'
import { addPoints } from '@/lib/points'
import { makeAuthenticatedRequest } from '@/lib/blockedUserHandler'
import MobileHeader from '../components/MobileHeader'
import BottomNavigation from '../components/BottomNavigation'
import Icon from '../components/Icon'
import '../globals.css'

export default function CreateMemoryV2() {
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
    if (!image) {
      setError('La imagen es requerida')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // Upload image
      const fileName = generateFileName(user.id, image.name)
      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(fileName, image)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memories')
        .getPublicUrl(fileName)

      // Create memory using API
      const result = await makeAuthenticatedRequest('/api/memories', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          team,
          match_date: matchDate || null,
          image_url: publicUrl,
          is_public: isPublic
        })
      })

      const newMemory = result.memory

      // Add points for creating memory
      await addPoints(user.id, 'create_memory', newMemory.id)

      router.push('/v2/feed')
    } catch (err: any) {
      if (err.message === 'BLOCKED_USER') {
        setLoading(false)
        return
      }
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="font-display bg-white min-h-screen max-w-md mx-auto">
      <MobileHeader />
      
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24 px-6">
        <div className="py-6">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <Icon name="chevron_left" className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Crear Recuerdo</h1>
              <p className="text-gray-500 text-sm">Comparte tu momento del Mundial</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                📸 Imagen del Recuerdo *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  required
                />
                <label
                  htmlFor="image-upload"
                  className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary transition-colors"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Icon name="add_photo_alternate" className="text-4xl mb-2" />
                      <span className="text-sm font-medium">Toca para seleccionar imagen</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Título del Recuerdo *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Gol histórico de Colombia"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cuenta la historia detrás de este momento..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Team */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Equipo
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Seleccionar equipo</option>
                <option value="Colombia">🇨🇴 Colombia</option>
                <option value="México">🇲🇽 México</option>
                <option value="Argentina">🇦🇷 Argentina</option>
                <option value="Brasil">🇧🇷 Brasil</option>
                <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                <option value="Canadá">🇨🇦 Canadá</option>
                <option value="Otro">⚽ Otro</option>
              </select>
            </div>

            {/* Match Date */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Fecha del Partido
              </label>
              <input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Public Toggle */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="public" className="text-lg text-gray-600" />
                    <span className="font-bold text-gray-900">Recuerdo Público</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Otros usuarios podrán ver y dar like a tu recuerdo
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Icon name="save" className="text-xl" />
                  Crear Recuerdo
                </div>
              )}
            </button>
          </form>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
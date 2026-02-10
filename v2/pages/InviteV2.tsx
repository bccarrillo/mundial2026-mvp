'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Invitation } from '@/types/database'
import MobileHeader from '../components/MobileHeader'
import BottomNavigation from '../components/BottomNavigation'
import Icon from '../components/Icon'
import '../globals.css'

export default function InviteV2() {
  const [user, setUser] = useState<any>(null)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/v2/login')
        return
      }
      setUser(user)
      
      // Generate invite link
      const link = `${window.location.origin}/v2/register?ref=${user.id}`
      setInviteLink(link)

      // Load invitations
      const { data } = await supabase
        .from('invitations')
        .select('*')
        .eq('inviter_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setInvitations(data)
      setLoading(false)
    }

    init()
  }, [router, supabase])

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const text = `🎉 ¡Únete a Mundial 2026!\n\nGuarda y comparte tus recuerdos del Mundial.\n\n👉 Regístrate gratis:`
    const url = `https://wa.me/?text=${encodeURIComponent(text + '\n' + inviteLink)}`
    window.open(url, '_blank')
  }

  const handleShare = async () => {
    const text = `🎉 ¡Únete a Mundial 2026!\n\nGuarda y comparte tus recuerdos del Mundial.\n\n👉 Regístrate gratis: ${inviteLink}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mundial 2026 - Memories26',
          text: text,
          url: inviteLink,
        })
        return
      } catch (err) {
        // Continue with other options
      }
    }
    
    // Fallback to WhatsApp
    handleWhatsApp()
  }

  if (loading) {
    return (
      <div className="font-display bg-white min-h-screen max-w-md mx-auto">
        <MobileHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  const acceptedCount = invitations.filter(i => i.status === 'accepted').length
  const pendingCount = invitations.filter(i => i.status === 'pending').length

  return (
    <div className="font-display bg-white min-h-screen max-w-md mx-auto">
      <MobileHeader />
      
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24 px-6">
        <div className="py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <Icon name="chevron_left" className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Invitar Amigos</h1>
              <p className="text-gray-500 text-sm">Gana puntos por cada amigo que se registre</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
              <p className="text-xs text-green-600 font-medium">Registrados</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              <p className="text-xs text-orange-600 font-medium">Pendientes</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{invitations.length}</p>
              <p className="text-xs text-blue-600 font-medium">Total</p>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="emoji_events" className="text-yellow-500" />
              Recompensas
            </h3>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-xl ${acceptedCount >= 3 ? 'bg-green-100 border border-green-200' : 'bg-white border border-gray-200'}`}>
                <span className="text-2xl">{acceptedCount >= 3 ? '✅' : '⭐'}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Badge Invitador</p>
                  <p className="text-xs text-gray-500">{acceptedCount}/3 amigos</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl ${acceptedCount >= 10 ? 'bg-green-100 border border-green-200' : 'bg-white border border-gray-200'}`}>
                <span className="text-2xl">{acceptedCount >= 10 ? '✅' : '🏆'}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Embajador Mundial</p>
                  <p className="text-xs text-gray-500">{acceptedCount}/10 amigos</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl ${acceptedCount >= 50 ? 'bg-green-100 border border-green-200' : 'bg-white border border-gray-200'}`}>
                <span className="text-2xl">{acceptedCount >= 50 ? '✅' : '💎'}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Leyenda VIP</p>
                  <p className="text-xs text-gray-500">{acceptedCount}/50 amigos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="link" className="text-blue-500" />
              Tu Link de Invitación
            </h3>
            
            {/* Link Display */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">Link de invitación:</p>
              <p className="text-sm font-mono text-gray-700 break-all">{inviteLink}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCopy}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Icon name={copied ? "check" : "content_copy"} />
                {copied ? 'Copiado!' : 'Copiar Link'}
              </button>
              
              <button
                onClick={handleShare}
                className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="share" />
                Compartir Invitación
              </button>
              
              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="chat" />
                Enviar por WhatsApp
              </button>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Icon name="info" className="text-blue-600" />
              ¿Cómo funciona?
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Comparte tu link de invitación</p>
              <p>• Tus amigos se registran usando tu link</p>
              <p>• Ambos reciben puntos bonus</p>
              <p>• Desbloqueas recompensas especiales</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import VIPBadge from '@/components/VIPBadge'
import { isUserVIPClient, calculateNFTPrice } from '@/lib/vip-client'
import { getUserPoints } from '@/lib/points'

export default function VIPPage() {
  const [isVIP, setIsVIP] = useState(false)
  const [vipData, setVIPData] = useState<any>(null)
  const [userPoints, setUserPoints] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkVIPStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const vipStatus = await isUserVIPClient(user.id)
      setIsVIP(vipStatus)
      
      if (!vipStatus) {
        router.push('/dashboard')
        return
      }

      const [membership, points] = await Promise.all([
        supabase.from('vip_memberships').select('*').eq('user_id', user.id).single(),
        getUserPoints(user.id)
      ])

      setUserPoints(points)
      
      if (membership.data) {
        const joinDate = new Date(membership.data.purchased_at).toLocaleDateString()
        setVIPData({ ...membership.data, joinDate })
      }
      
      setLoading(false)
    }

    checkVIPStatus()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (!isVIP) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Zona VIP Exclusiva
            </h1>
            <VIPBadge isVIP={true} size="lg" />
          </div>
          <p className="text-gray-600">Bienvenido a tu área premium del Mundial 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-yellow-200">
            <div className="text-center">
              <div className="text-3xl mb-2">👑</div>
              <div className="text-2xl font-bold text-yellow-600">VIP</div>
              <div className="text-sm text-gray-500">Miembro desde</div>
              <div className="font-semibold">{vipData?.joinDate}</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg border border-green-200">
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-green-600">10%</div>
              <div className="text-sm text-gray-500">Descuento NFTs</div>
              <div className="font-semibold">${calculateNFTPrice(userPoints?.level || 1, true)} vs $3.00</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg border border-purple-200">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-500">Funciones exclusivas</div>
              <div className="font-semibold">Acceso completo</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">🌟 Tus Beneficios VIP</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600 mb-4">✅ Activos Ahora</h3>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">👑</span>
                <div>
                  <div className="font-semibold">Badge VIP Exclusivo</div>
                  <div className="text-sm text-gray-600">Visible en toda la app</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">💎</span>
                <div>
                  <div className="font-semibold">10% Descuento en NFTs</div>
                  <div className="text-sm text-gray-600">Ahorro automático en certificaciones</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold">Estadísticas Avanzadas</div>
                  <div className="text-sm text-gray-600">Dashboard premium disponible</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-600 mb-4">🚀 Próximamente</h3>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-2xl">🎨</span>
                <div>
                  <div className="font-semibold">Filtros Especiales</div>
                  <div className="text-sm text-gray-600">Efectos exclusivos para fotos</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-2xl">🎪</span>
                <div>
                  <div className="font-semibold">Chat VIP Exclusivo</div>
                  <div className="text-sm text-gray-600">Sala privada para miembros VIP</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-2xl">🎫</span>
                <div>
                  <div className="font-semibold">Acceso Anticipado</div>
                  <div className="text-sm text-gray-600">Nuevas funciones antes que nadie</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">🎯 Acciones VIP</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => router.push('/crear')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              📸 Crear Recuerdo VIP
            </Button>
            
            <Button 
              onClick={() => router.push('/puntos')}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
            >
              📊 Ver Estadísticas
            </Button>
            
            <Button 
              onClick={() => router.push('/rankings')}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              🏆 Rankings VIP
            </Button>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500">
          <p>Gracias por ser parte del club VIP del Mundial 2026 🌟</p>
        </div>
      </div>
    </div>
  )
}
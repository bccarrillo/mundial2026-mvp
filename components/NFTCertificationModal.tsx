'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Award, Shield, Zap } from 'lucide-react'

interface NFTCertificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  memoryId: string
  memoryTitle: string
  price: number
  userLevel: number
  isVIP: boolean
}

export default function NFTCertificationModal({
  isOpen,
  onClose,
  onSuccess,
  memoryId,
  memoryTitle,
  price,
  userLevel,
  isVIP
}: NFTCertificationModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCertify = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          memory_id: memoryId,
          mode: 'demo' // Cambiar a 'production' cuando esté listo
        })
      })
      
      const data = await response.json()

      if (data.success) {
        onSuccess()
        onClose()
      } else {
        setError(data.error || 'Failed to certify memory')
      }

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const originalPrice = 3
  const savings = originalPrice - price

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🎫 Certificar como NFT</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Información del recuerdo */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">📸 {memoryTitle}</h3>
            <p className="text-sm text-blue-600">
              Este recuerdo será certificado como NFT permanente en blockchain Polygon
            </p>
          </div>

          {/* Beneficios de certificación */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold mb-3">✨ ¿Qué obtienes?</h3>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Shield className="text-green-600" size={20} />
              <div>
                <div className="font-semibold text-green-800">Certificado Permanente</div>
                <div className="text-sm text-green-600">Registro inmutable en blockchain</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Award className="text-purple-600" size={20} />
              <div>
                <div className="font-semibold text-purple-800">Elegible para Subasta Final</div>
                <div className="text-sm text-purple-600">Participa en el Top 100 del Mundial</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Zap className="text-orange-600" size={20} />
              <div>
                <div className="font-semibold text-orange-800">Prueba de Autoría</div>
                <div className="text-sm text-orange-600">Verificación de fecha y creador</div>
              </div>
            </div>
          </div>

          {/* Precio y descuentos */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${price.toFixed(2)} USD</div>
              
              {savings > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="line-through text-gray-400">${originalPrice.toFixed(2)}</span>
                  <span className="text-green-600 font-semibold ml-2">
                    ¡Ahorras ${savings.toFixed(2)}!
                  </span>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-1">
                {userLevel >= 5 && "🎉 GRATIS por ser Leyenda"}
                {userLevel === 4 && "🥇 Descuento Campeón"}
                {userLevel === 3 && "🥈 Descuento Estrella"}
                {isVIP && " + 10% descuento VIP"}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-600">
            <div className="font-semibold mb-2">⚠️ Importante:</div>
            <ul className="space-y-1 text-xs">
              <li>• No es una inversión financiera</li>
              <li>• Es un certificado conmemorativo</li>
              <li>• El proceso es irreversible</li>
              <li>• Modo demo activo (sin costo real)</li>
            </ul>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center mb-4">
              {error}
            </div>
          )}

          <Button 
            onClick={handleCertify}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {loading ? 'Certificando...' : `🎫 Certificar por $${price.toFixed(2)}`}
          </Button>

          <div className="text-xs text-gray-500 text-center mt-3">
            Modo demo • Funcionalidad completa • Sin costo real
          </div>
        </div>
      </div>
    </div>
  )
}
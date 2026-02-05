'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface VIPPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

function DemoVIPForm({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDemoVIP = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()

      if (data.success) {
        onSuccess()
        onClose()
      } else {
        setError(data.error || 'Failed to activate VIP')
      }

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Beneficios VIP */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">
          🌟 Pase VIP Mundial 2026
        </h3>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span>🎨</span> Filtros especiales
            </div>
            <div className="flex items-center gap-2">
              <span>👑</span> Badge VIP
            </div>
            <div className="flex items-center gap-2">
              <span>📈</span> Estadísticas avanzadas
            </div>
            <div className="flex items-center gap-2">
              <span>💎</span> 10% descuento NFTs
            </div>
            <div className="flex items-center gap-2">
              <span>🎪</span> Chat VIP exclusivo
            </div>
            <div className="flex items-center gap-2">
              <span>🎫</span> Acceso anticipado
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">$5 USD</div>
          <div className="text-sm text-gray-500">Pago único • Sin suscripciones</div>
        </div>
      </div>

      {/* Modo Demo */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-blue-800 font-semibold mb-2">
            🛠️ Modo Demo Activo
          </div>
          <div className="text-sm text-blue-600 mb-4">
            Puedes probar VIP gratis mientras configuramos los pagos
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <Button 
        onClick={handleDemoVIP}
        disabled={loading}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
      >
        {loading ? 'Activando...' : '👑 Probar VIP Gratis (Demo)'}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        Modo demo • Funcionalidad completa • Sin costo
      </div>
    </div>
  )
}

export default function VIPPurchaseModal({ isOpen, onClose, onSuccess }: VIPPurchaseModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Únete al Club VIP</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <DemoVIPForm onClose={onClose} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  )
}
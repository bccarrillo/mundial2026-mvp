'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { X, Award, Shield, Zap } from 'lucide-react'
import { logInfoClient, logErrorClient } from '@/lib/logger-client'
import { logLegalAcceptance } from '@/lib/legalUtils'
import NFTPaymentDisclaimer from '@/v2/components/NFTPaymentDisclaimer'

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
  const { t } = useTranslation()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nftConsent, setNftConsent] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [memoryOwner, setMemoryOwner] = useState<string | null>(null)
  const [existingNFT, setExistingNFT] = useState<boolean>(false)
  const [validationLoading, setValidationLoading] = useState(true)
  
  useEffect(() => {
    const validateNFTCreation = async () => {
      setValidationLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
      
      if (!user || !memoryId) {
        setValidationLoading(false)
        return
      }
      
      // Check if user owns the memory
      const { data: memory } = await supabase
        .from('memories')
        .select('user_id')
        .eq('id', memoryId)
        .single()
      
      setMemoryOwner(memory?.user_id || null)
      
      // Check if NFT already exists for this memory
      const { data: nftData, error: nftError } = await supabase
        .from('nft_certificates')
        .select('id')
        .eq('memory_id', memoryId)
        .maybeSingle()
      
      console.log('NFT check:', { nftData, nftError, memoryId })
      setExistingNFT(!!nftData && !nftError)
      setValidationLoading(false)
    }
    
    if (isOpen) {
      validateNFTCreation()
    }
  }, [isOpen, memoryId, supabase])

  const handleCrossmintPayment = async () => {
    if (!nftConsent) {
      setError('Debes aceptar los términos del servicio NFT')
      return
    }
    
    setLoading(true)
    setError(null)
    
    console.log("PROJECT:", process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID);
    console.log("COLLECTION:", process.env.NEXT_PUBLIC_CROSSMINT_COLLECTION_ID);
    
    // Log a Supabase para debug
    await logInfoClient('crossmint', 'Iniciando pago NFT (modo test)', {
      memoryId,
      memoryTitle,
      price,
      userLevel,
      isVIP,
      projectId: process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID,
      collectionId: process.env.NEXT_PUBLIC_CROSSMINT_COLLECTION_ID,
      clientApiKey: process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_API_KEY?.substring(0, 20) + '...',
      paymentMode: process.env.NEXT_PUBLIC_NFT_PAYMENT_MODE,
      environment: process.env.NODE_ENV
    })
    
    try {
      const res = await fetch("/api/nft/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memory_id: memoryId
        }),
      })

      const data = await res.json()

      if (data?.success && data?.nftData) {
        // Log NFT consent acceptance
        if (currentUserId && nftConsent) {
          await logLegalAcceptance({
            userId: currentUserId,
            context: 'nft_payment'
          })
        }
        
        await logInfoClient('crossmint', 'NFT creado exitosamente', {
          nftData: data.nftData,
          success: true
        })
        
        // NFT creado directamente
        onSuccess()
        onClose()
      } else {
        await logErrorClient('crossmint', 'Error: Respuesta inesperada', {
          response: data,
          error: data.error || 'Respuesta sin datos esperados'
        })
        setError(data.error || 'Error creando checkout')
      }
    } catch (err) {
      await logErrorClient('crossmint', 'Error de conexion en pago NFT', {
        error: err instanceof Error ? err.message : 'Unknown error',
        memoryId,
        price
      })
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Validation checks
  if (validationLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Validando permisos...</p>
        </div>
      </div>
    )
  }

  // User is not the owner of the memory
  if (currentUserId !== memoryOwner) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-red-600">🚫</span>
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Acceso Denegado</h2>
            <p className="text-red-600 mb-4">
              Solo el creador del recuerdo puede generar su NFT
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // NFT already exists for this memory
  if (existingNFT) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-blue-600">🎫</span>
            </div>
            <h2 className="text-xl font-bold text-blue-800 mb-2">NFT Ya Existe</h2>
            <p className="text-blue-600 mb-4">
              Este recuerdo ya tiene un NFT certificado
            </p>
            <button
              onClick={onClose}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl"
            >
              Ver NFT Existente
            </button>
          </div>
        </div>
      </div>
    )
  }

  const originalPrice = 3
  const savings = originalPrice - price

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🎫 {t('nft.modalTitle')}</h2>
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
              {t('nft.description')}
            </p>
          </div>

          {/* Beneficios de certificación */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold mb-3">✨ {t('nft.benefitsTitle')}</h3>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Shield className="text-green-600" size={20} />
              <div>
                <div className="font-semibold text-green-800">{t('nft.permanentCertificate')}</div>
                <div className="text-sm text-green-600">{t('nft.permanentCertificateDesc')}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Award className="text-purple-600" size={20} />
              <div>
                <div className="font-semibold text-purple-800">{t('nft.auctionEligible')}</div>
                <div className="text-sm text-purple-600">{t('nft.auctionEligibleDesc')}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Zap className="text-orange-600" size={20} />
              <div>
                <div className="font-semibold text-orange-800">{t('nft.proofOfAuthorship')}</div>
                <div className="text-sm text-orange-600">{t('nft.proofOfAuthorshipDesc')}</div>
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
                    ¡{t('nft.savings')} ${savings.toFixed(2)}!
                  </span>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-1">
                {userLevel >= 5 && `🎉 ${t('nft.freeForLegends')}`}
                {userLevel === 4 && `🥇 ${t('nft.championDiscount')}`}
                {userLevel === 3 && `🥈 ${t('nft.starDiscount')}`}
                {isVIP && ` + 10% ${t('nft.vipDiscount')}`}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-600">
            <div className="font-semibold mb-2">⚠️ {t('nft.importantTitle')}</div>
            <ul className="space-y-1 text-xs">
              <li>• {t('nft.notInvestment')}</li>
              <li>• {t('nft.commemorativeCertificate')}</li>
              <li>• {t('nft.irreversibleProcess')}</li>
              <li>• {t('nft.productionMode')}</li>
            </ul>
          </div>

          {/* Warning modo test */}
          {(process.env.NEXT_PUBLIC_NFT_PRICING_MODE === 'test' || process.env.NFT_PAYMENT_MODE === 'test') && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
                <span className="text-lg mr-2">⚠️</span>
                <div>
                  <strong>MODO TEST ACTIVO</strong>
                  <div className="text-sm">
                    {process.env.NEXT_PUBLIC_NFT_PRICING_MODE === 'test' && 'Precios: $0.70 fijo'}
                    {process.env.NEXT_PUBLIC_NFT_PRICING_MODE === 'test' && process.env.NFT_PAYMENT_MODE === 'test' && ' | '}
                    {process.env.NFT_PAYMENT_MODE === 'test' && 'Pago: Sin tarjeta'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NFT Payment Disclaimer */}
          <NFTPaymentDisclaimer 
            accepted={nftConsent}
            onChange={setNftConsent}
            amount={price.toFixed(2)}
          />

          {error && (
            <div className="text-red-600 text-sm text-center mb-4">
              {error}
            </div>
          )}

          {process.env.NEXT_PUBLIC_NFT_PAYMENT_MODE === 'test' ? (
            <Button 
              onClick={handleCrossmintPayment}
              disabled={loading || !nftConsent}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? 'Creando checkout...' : `💳 ${t('nft.certifyButton')} $${price.toFixed(2)} USD`}
            </Button>
          ) : (
            <Button 
              onClick={handleCrossmintPayment}
              disabled={loading || !nftConsent}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? 'Creando checkout...' : `💳 ${t('nft.certifyButton')} $${price.toFixed(2)} USD`}
            </Button>
          )}

          <div className="text-xs text-gray-500 text-center mt-3">
            {t('nft.footerText')}
          </div>
        </div>
      </div>
    </div>
  )
}
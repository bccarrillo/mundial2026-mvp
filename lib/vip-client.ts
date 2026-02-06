import { createClient } from '@/lib/supabase/client'

export interface VIPBenefits {
  hasVIPBadge: boolean
  hasSpecialFilters: boolean
  hasAdvancedStats: boolean
  hasEarlyAccess: boolean
  hasNFTDiscount: boolean
  hasVIPChat: boolean
  hasPremiumDashboard: boolean
  discountPercentage: number
}

// Verificar si usuario es VIP (versión cliente simplificada)
export async function isUserVIPClient(userId: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    // Verificar directamente en profiles.is_vip (más simple y confiable)
    const { data, error } = await supabase
      .from('profiles')
      .select('is_vip')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error checking VIP status:', error)
      return false
    }
    
    return data?.is_vip || false
  } catch (error) {
    console.error('Error in VIP check:', error)
    return false
  }
}

// Obtener beneficios VIP
export function getVIPBenefits(isVIP: boolean): VIPBenefits {
  return {
    hasVIPBadge: isVIP,
    hasSpecialFilters: isVIP,
    hasAdvancedStats: isVIP,
    hasEarlyAccess: isVIP,
    hasNFTDiscount: isVIP,
    hasVIPChat: isVIP,
    hasPremiumDashboard: isVIP,
    discountPercentage: isVIP ? 10 : 0
  }
}

// Calcular precio NFT con descuento VIP
export function calculateNFTPrice(userLevel: number, isVIP: boolean): number {
  const pricingMode = process.env.NEXT_PUBLIC_NFT_PRICING_MODE || process.env.NFT_PRICING_MODE || 'production'
  
  if (pricingMode === 'test') {
    // MODO TEST - Precio fijo $0.70 para todos
    return 0.70
  } else {
    // MODO PRODUCCIÓN - Cálculos completos por nivel y VIP
    let basePrice = 3 // Precio por defecto
    
    if (userLevel >= 5) basePrice = 0.75     // Mínimo Crossmint para Leyendas
    else if (userLevel >= 4) basePrice = 1.5 // $1.50 para Campeones
    else if (userLevel >= 3) basePrice = 2.25 // $2.25 para Estrellas
    
    // Descuento VIP adicional (10%) pero respetando mínimo $0.75
    if (isVIP && basePrice > 0.75) {
      basePrice = Math.max(0.75, basePrice * 0.9)
    }
    
    return Math.round(basePrice * 100) / 100
  }
}
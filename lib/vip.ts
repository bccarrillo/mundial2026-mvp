import { createClient } from '@/lib/supabase/server'

export interface VIPMembership {
  id: string
  user_id: string
  purchased_at: string
  expires_at: string | null
  payment_intent_id: string
  amount_paid: number
  currency: string
  is_active: boolean
}

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

// Verificar si usuario es VIP
export async function isUserVIP(userId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .rpc('is_user_vip', { user_id_param: userId })
  
  if (error) {
    console.error('Error checking VIP status:', error)
    return false
  }
  
  return data || false
}

// Obtener membresía VIP del usuario
export async function getUserVIPMembership(userId: string): Promise<VIPMembership | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('vip_memberships')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()
  
  if (error || !data) return null
  
  return data
}

// Crear membresía VIP
export async function createVIPMembership(
  userId: string, 
  paymentIntentId: string,
  amountPaid: number = 5.00
): Promise<VIPMembership | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('vip_memberships')
    .insert({
      user_id: userId,
      payment_intent_id: paymentIntentId,
      amount_paid: amountPaid,
      currency: 'USD',
      is_active: true,
      expires_at: null // Lifetime membership
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating VIP membership:', error)
    return null
  }
  
  return data
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
  let basePrice = 3 // Precio por defecto
  
  // Descuentos por nivel
  if (userLevel >= 5) basePrice = 0
  else if (userLevel >= 4) basePrice = 1
  else if (userLevel >= 3) basePrice = 2
  
  // Descuento VIP adicional (10%)
  if (isVIP && basePrice > 0) {
    basePrice = Math.max(0.1, basePrice * 0.9) // Mínimo $0.10
  }
  
  return Math.round(basePrice * 100) / 100 // Redondear a 2 decimales
}

// Obtener estadísticas VIP avanzadas
export async function getVIPStats(userId: string): Promise<any> {
  const supabase = await createClient()
  
  // Estadísticas básicas
  const { data: basicStats } = await supabase
    .from('memories')
    .select('id, created_at, likes(count)')
    .eq('user_id', userId)
  
  // Estadísticas de engagement
  const { data: commentStats } = await supabase
    .from('comments')
    .select('id')
    .eq('user_id', userId)
  
  // Posición en ranking
  const { data: userPoints } = await supabase
    .from('user_points')
    .select('points, level')
    .eq('user_id', userId)
    .single()
  
  const totalMemories = basicStats?.length || 0
  const totalLikes = basicStats?.reduce((sum, memory) => sum + (memory.likes?.length || 0), 0) || 0
  const totalComments = commentStats?.length || 0
  
  return {
    totalMemories,
    totalLikes,
    totalComments,
    currentLevel: userPoints?.level || 1,
    currentPoints: userPoints?.points || 0,
    avgLikesPerMemory: totalMemories > 0 ? Math.round(totalLikes / totalMemories) : 0,
    engagementScore: Math.min(100, Math.round((totalLikes + totalComments * 2) / 10))
  }
}
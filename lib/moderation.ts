import { createClient } from '@/lib/supabase/server'

export async function checkUserBlocked(userId: string): Promise<{
  isBlocked: boolean
  reason?: string
  blockedAt?: string
}> {
  try {
    const supabase = await createClient()
    
    const { data: blockedUser } = await supabase
      .from('blocked_users')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()
    
    if (blockedUser) {
      // Verificar si el bloqueo ha expirado
      if (blockedUser.expires_at && new Date(blockedUser.expires_at) < new Date()) {
        // Desactivar bloqueo expirado
        await supabase
          .from('blocked_users')
          .update({ is_active: false })
          .eq('id', blockedUser.id)
        
        return { isBlocked: false }
      }
      
      return {
        isBlocked: true,
        reason: blockedUser.reason,
        blockedAt: blockedUser.blocked_at
      }
    }
    
    return { isBlocked: false }
  } catch (error) {
    console.error('Error verificando usuario bloqueado:', error)
    return { isBlocked: false }
  }
}

export async function preventBlockedUserActions(userId: string) {
  const blockStatus = await checkUserBlocked(userId)
  
  if (blockStatus.isBlocked) {
    throw new Error(`Tu cuenta ha sido suspendida. Razón: ${blockStatus.reason}`)
  }
  
  return true
}
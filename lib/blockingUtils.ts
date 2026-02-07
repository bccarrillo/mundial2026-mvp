import { createClient } from '@/lib/supabase/server'

export async function checkUserBlocked(userId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blocked_users')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  
  console.log('🔍 Verificando bloqueo para usuario:', userId)
  console.log('🔍 Datos encontrados:', data)
  console.log('🔍 Error:', error)
  console.log('🔍 Resultado final:', !!data)
  
  return !!data
}

export function createBlockedUserError() {
  return new Response(
    JSON.stringify({ 
      error: 'Tu cuenta está suspendida. Contacta al administrador.' 
    }),
    { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkUserBlocked } from '@/lib/blockingUtils'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Obtener usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado', authError: authError?.message }, { status: 401 })
    }

    // Verificar bloqueo
    const isBlocked = await checkUserBlocked(user.id)
    
    // Obtener datos del usuario bloqueado directamente
    const { data: blockedData, error: blockedError } = await supabase
      .from('blocked_users')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    // Obtener todos los usuarios bloqueados
    const { data: allBlocked, error: allBlockedError } = await supabase
      .from('blocked_users')
      .select('*')

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      isBlocked,
      blockedData,
      blockedError: blockedError?.message,
      allBlocked,
      allBlockedError: allBlockedError?.message
    })
  } catch (error) {
    console.error('Debug API Error:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
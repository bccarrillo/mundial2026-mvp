import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkUserBlocked, createBlockedUserError } from '@/lib/blockingUtils'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar si el usuario está bloqueado
    const isBlocked = await checkUserBlocked(user.id)
    if (isBlocked) {
      return createBlockedUserError()
    }

    const body = await request.json()
    const { title, description, team, match_date, image_url, is_public } = body

    // Crear memoria
    const { data: newMemory, error: insertError } = await supabase
      .from('memories')
      .insert({
        user_id: user.id,
        title,
        description,
        team,
        match_date: match_date || null,
        image_url,
        is_public: is_public ?? true
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    return NextResponse.json({ memory: newMemory })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
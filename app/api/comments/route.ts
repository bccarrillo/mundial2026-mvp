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
    const { memory_id, content } = body

    if (!memory_id || !content?.trim()) {
      return NextResponse.json({ error: 'Datos requeridos faltantes' }, { status: 400 })
    }

    // Crear comentario
    const { data: newComment, error: insertError } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        memory_id,
        content: content.trim()
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    return NextResponse.json({ comment: newComment })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
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
    const { memory_id } = body

    if (!memory_id) {
      return NextResponse.json({ error: 'memory_id requerido' }, { status: 400 })
    }

    // Crear like
    const { data: newLike, error: insertError } = await supabase
      .from('likes')
      .insert({
        user_id: user.id,
        memory_id
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    return NextResponse.json({ like: newLike })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const memory_id = searchParams.get('memory_id')

    if (!memory_id) {
      return NextResponse.json({ error: 'memory_id requerido' }, { status: 400 })
    }

    // Eliminar like
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('memory_id', memory_id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
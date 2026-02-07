import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { memoryId, reportedUserId, reason } = await request.json()
    
    const supabase = await createClient()
    
    // Verificar usuario autenticado
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    // Crear reporte
    const { error } = await supabase
      .from('user_reports')
      .insert({
        memory_id: memoryId,
        reported_by: user.id,
        reported_user: reportedUserId,
        reason
      })
    
    if (error) throw error
    
    return NextResponse.json({ success: true, message: 'Reporte enviado' })
    
  } catch (error) {
    console.error('Error creando reporte:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar que el usuario es admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (!profile || !['admin', 'moderator'].includes(profile.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }
    
    // Obtener reportes pendientes
    const { data: reports, error } = await supabase
      .from('user_reports')
      .select(`
        *,
        memories (id, title, image_url),
        reported_user:profiles!user_reports_reported_user_fkey (id, email, display_name),
        reporter:profiles!user_reports_reported_by_fkey (id, email, display_name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ reports })
    
  } catch (error) {
    console.error('Error obteniendo reportes:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
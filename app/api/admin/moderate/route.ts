import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { action, memoryId, userId, reason } = await request.json()
    
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
    
    if (action === 'delete_memory') {
      // Marcar memoria como eliminada
      const { error: deleteError } = await supabase
        .from('memories')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
          deletion_reason: reason
        })
        .eq('id', memoryId)
      
      if (deleteError) throw deleteError
      
      // Registrar acción de moderación
      const { error: actionError } = await supabase
        .from('moderation_actions')
        .insert({
          memory_id: memoryId,
          user_id: userId,
          admin_id: user.id,
          action_type: 'delete',
          reason
        })
      
      if (actionError) throw actionError
      
      return NextResponse.json({ success: true, message: 'Contenido eliminado' })
    }
    
    if (action === 'block_user') {
      // Bloquear usuario manualmente
      const { error: blockError } = await supabase
        .from('blocked_users')
        .insert({
          user_id: userId,
          blocked_by: user.id,
          reason,
          violations_count: 1
        })
      
      if (blockError) {
        // Si ya está bloqueado, actualizar
        const { error: updateError } = await supabase
          .from('blocked_users')
          .update({
            reason,
            blocked_at: new Date().toISOString(),
            is_active: true
          })
          .eq('user_id', userId)
        
        if (updateError) throw updateError
      }
      
      return NextResponse.json({ success: true, message: 'Usuario bloqueado' })
    }
    
    if (action === 'unblock_user') {
      // Desbloquear usuario
      const { error: unblockError } = await supabase
        .from('blocked_users')
        .update({ is_active: false })
        .eq('user_id', userId)
      
      if (unblockError) throw unblockError
      
      return NextResponse.json({ success: true, message: 'Usuario desbloqueado' })
    }
    
    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
    
  } catch (error) {
    console.error('Error en moderación:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
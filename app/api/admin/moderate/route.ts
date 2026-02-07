import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { action, memoryId, userId, reason } = await request.json()
    
    console.log('🔍 API Moderación llamada:', { action, memoryId, userId, reason })
    
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
      console.log('🔍 Eliminando memoria:', { memoryId, userId, reason })
      
      // Verificar que la memoria existe primero
      const { data: existingMemory, error: checkError } = await supabase
        .from('memories')
        .select('id, title')
        .eq('id', memoryId)
        .single()
      
      if (checkError || !existingMemory) {
        console.error('❌ Memoria no encontrada:', checkError)
        return NextResponse.json({ error: 'Memoria no encontrada' }, { status: 404 })
      }
      
      console.log('✅ Memoria encontrada:', existingMemory)
      
      // Marcar memoria como eliminada
      const { data: updateResult, error: deleteError } = await supabase
        .from('memories')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
          deletion_reason: reason
        })
        .eq('id', memoryId)
        .select()
      
      if (deleteError) {
        console.error('❌ Error eliminando memoria:', deleteError)
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }
      
      console.log('✅ Memoria actualizada:', updateResult)
      
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
      
      if (actionError) {
        console.error('⚠️ Error registrando acción:', actionError)
        // No fallar si no se puede registrar la acción
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Contenido eliminado',
        updated: updateResult
      })
    }
    
    if (action === 'restore_memory') {
      // Restaurar memoria eliminada
      const { error: restoreError } = await supabase
        .from('memories')
        .update({
          deleted_at: null,
          deleted_by: null,
          deletion_reason: null
        })
        .eq('id', memoryId)
      
      if (restoreError) throw restoreError
      
      return NextResponse.json({ success: true, message: 'Contenido restaurado' })
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
        .delete()
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
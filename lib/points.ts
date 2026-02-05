import { createClient } from '@/lib/supabase/client'

// Tipos de acciones que dan puntos
export type PointAction = 
  | 'create_memory'
  | 'receive_like' 
  | 'comment'
  | 'share'
  | 'invite'

// Configuración de puntos por acción
export const POINT_VALUES: Record<PointAction, number> = {
  create_memory: 10,
  receive_like: 2,
  comment: 5,
  share: 15,
  invite: 50
}

// Configuración de niveles
export const LEVELS = [
  { level: 1, minPoints: 0, maxPoints: 99, name: 'Hincha', emoji: '⚽' },
  { level: 2, minPoints: 100, maxPoints: 299, name: 'Fan', emoji: '🏃' },
  { level: 3, minPoints: 300, maxPoints: 599, name: 'Seguidor', emoji: '🎯' },
  { level: 4, minPoints: 600, maxPoints: 999, name: 'Fanático', emoji: '🔥' },
  { level: 5, minPoints: 1000, maxPoints: Infinity, name: 'Leyenda', emoji: '👑' }
]

// Función principal para agregar puntos (arreglada)
export async function addPoints(
  userId: string,
  action: PointAction,
  referenceId?: string
): Promise<{ success: boolean; newPoints?: number; newLevel?: number }> {
  const supabase = createClient()
  const points = POINT_VALUES[action]

  try {
    // 1. Insertar transacción
    const { error: transactionError } = await supabase
      .from('point_transactions')
      .insert({
        user_id: userId,
        points,
        action,
        reference_id: referenceId
      })

    if (transactionError) throw transactionError

    // 2. Obtener puntos actuales del usuario (usar maybeSingle)
    const { data: currentPoints, error: fetchError } = await supabase
      .from('user_points')
      .select('points, level')
      .eq('user_id', userId)
      .maybeSingle()

    if (fetchError) {
      throw fetchError
    }

    // 3. Calcular nuevos puntos
    const newPoints = (currentPoints?.points || 0) + points
    const newLevel = calculateLevel(newPoints)

    // 4. Upsert puntos del usuario
    const { error: upsertError } = await supabase
      .from('user_points')
      .upsert({
        user_id: userId,
        points: newPoints,
        level: newLevel
      }, {
        onConflict: 'user_id'
      })

    if (upsertError) throw upsertError

    return { success: true, newPoints, newLevel }

  } catch (error) {
    console.error('Error adding points:', error)
    return { success: false }
  }
}

// Función para obtener puntos de un usuario (optimizada)
export async function getUserPoints(userId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('user_points')
      .select('points, level, created_at')
      .eq('user_id', userId)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user points:', error)
      return { points: 0, level: 1, created_at: new Date().toISOString() }
    }

    // Si no existe, retornar valores por defecto sin crear registro
    if (!data) {
      return { points: 0, level: 1, created_at: new Date().toISOString() }
    }

    return data
  } catch (error) {
    console.error('Error in getUserPoints:', error)
    return { points: 0, level: 1, created_at: new Date().toISOString() }
  }
}

// Función para calcular nivel basado en puntos
export function calculateLevel(points: number): number {
  for (const level of LEVELS) {
    if (points >= level.minPoints && points <= level.maxPoints) {
      return level.level
    }
  }
  return 1 // Fallback
}

// Función para obtener información del nivel
export function getLevelInfo(level: number) {
  return LEVELS.find(l => l.level === level) || LEVELS[0]
}

// Función para obtener progreso al siguiente nivel
export function getLevelProgress(points: number, level: number) {
  const currentLevel = getLevelInfo(level)
  const nextLevel = LEVELS.find(l => l.level === level + 1)

  if (!nextLevel) {
    return { progress: 100, pointsToNext: 0, nextLevelName: 'Máximo' }
  }

  const pointsInCurrentLevel = points - currentLevel.minPoints
  const pointsNeededForNext = nextLevel.minPoints - currentLevel.minPoints
  const progress = Math.min((pointsInCurrentLevel / pointsNeededForNext) * 100, 100)
  const pointsToNext = nextLevel.minPoints - points

  return {
    progress: Math.round(progress),
    pointsToNext: Math.max(pointsToNext, 0),
    nextLevelName: nextLevel.name
  }
}

// Función para obtener historial de puntos
export async function getPointsHistory(userId: string, limit = 10) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching points history:', error)
    return []
  }

  return data || []
}
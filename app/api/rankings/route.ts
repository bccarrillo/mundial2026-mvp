import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  
  const type = searchParams.get('type') || 'users'
  const country = searchParams.get('country') || 'global'
  const userId = searchParams.get('userId')

  try {
    if (type === 'users') {
      // Rankings de usuarios por puntos - queries separadas
      const { data: userPoints, error: pointsError } = await supabase
        .from('user_points')
        .select('user_id, points, level')
        .order('points', { ascending: false })
        .limit(50)

      if (pointsError) {
        console.error('Points query error:', pointsError)
        throw pointsError
      }

      if (!userPoints || userPoints.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          type: 'users'
        })
      }

      // Obtener datos de usuarios
      const userIds = userPoints.map(up => up.user_id)
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds)

      if (usersError) {
        console.error('Users query error:', usersError)
        throw usersError
      }

      console.log('Users data sample:', users?.[0])

      // Combinar datos
      const topUsers = userPoints.map((up, index) => {
        const user = users?.find(u => u.id === up.user_id)
        return {
          user_id: up.user_id,
          points: up.points,
          level: up.level,
          position: index + 1,
          profiles: {
            display_name: user?.display_name || 'Usuario'
          },
          users: {
            name: user?.display_name || 'Usuario',
            avatar_url: user?.avatar_url,
            country: user?.country
          }
        }
      })

      // Si se solicita posición específica de un usuario
      let userPosition = null
      if (userId) {
        const { data: userRank, error: rankError } = await supabase
          .rpc('get_user_rank', { target_user_id: userId, target_country: country })
        
        if (!rankError && userRank) {
          userPosition = userRank
        }
      }

      return NextResponse.json({
        success: true,
        data: topUsers || [],
        userPosition,
        type: 'users'
      })

    } else if (type === 'memories') {
      // Rankings de recuerdos por likes
      const { data: topMemories, error: memoriesError } = await supabase
        .from('memories')
        .select(`
          id,
          title,
          image_url,
          created_at,
          user_id,
          profiles!inner(display_name),
          likes_count:likes(count)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false }) // Temporal, cambiar por likes count
        .limit(20)

      if (memoriesError) throw memoriesError

      // Contar likes reales para cada recuerdo
      const memoriesWithLikes = await Promise.all(
        (topMemories || []).map(async (memory) => {
          const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('memory_id', memory.id)

          return {
            ...memory,
            likes_count: count || 0
          }
        })
      )

      // Ordenar por likes reales
      memoriesWithLikes.sort((a, b) => b.likes_count - a.likes_count)

      return NextResponse.json({
        success: true,
        data: memoriesWithLikes,
        type: 'memories'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid type parameter'
    }, { status: 400 })

  } catch (error) {
    console.error('Error fetching rankings:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch rankings'
    }, { status: 500 })
  }
}
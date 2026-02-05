-- FUNCIÓN PARA OBTENER POSICIÓN DE USUARIO EN RANKING
-- Ejecutar en Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_user_rank(target_user_id UUID, target_country TEXT DEFAULT 'global')
RETURNS TABLE(
  position INTEGER,
  points INTEGER,
  level INTEGER,
  total_users INTEGER
) AS $$
BEGIN
  IF target_country = 'global' THEN
    RETURN QUERY
    WITH ranked_users AS (
      SELECT 
        user_id,
        points,
        level,
        ROW_NUMBER() OVER (ORDER BY points DESC) as rank
      FROM user_points
    ),
    user_stats AS (
      SELECT 
        rank::INTEGER as position,
        points,
        level
      FROM ranked_users 
      WHERE user_id = target_user_id
    ),
    total_count AS (
      SELECT COUNT(*)::INTEGER as total FROM user_points
    )
    SELECT 
      COALESCE(us.position, 0) as position,
      COALESCE(us.points, 0) as points,
      COALESCE(us.level, 1) as level,
      tc.total as total_users
    FROM user_stats us
    CROSS JOIN total_count tc;
  ELSE
    RETURN QUERY
    WITH ranked_users AS (
      SELECT 
        user_id,
        points,
        level,
        ROW_NUMBER() OVER (ORDER BY points DESC) as rank
      FROM user_points
      WHERE country = target_country
    ),
    user_stats AS (
      SELECT 
        rank::INTEGER as position,
        points,
        level
      FROM ranked_users 
      WHERE user_id = target_user_id
    ),
    total_count AS (
      SELECT COUNT(*)::INTEGER as total FROM user_points WHERE country = target_country
    )
    SELECT 
      COALESCE(us.position, 0) as position,
      COALESCE(us.points, 0) as points,
      COALESCE(us.level, 1) as level,
      tc.total as total_users
    FROM user_stats us
    CROSS JOIN total_count tc;
  END IF;
END;
$$ LANGUAGE plpgsql;
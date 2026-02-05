-- ARREGLO DE POLÍTICAS RLS PARA SISTEMA DE PUNTOS
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar política restrictiva existente
DROP POLICY IF EXISTS "Users can insert their own transactions" ON point_transactions;

-- 2. Crear nueva política que permite insertar transacciones para cualquier usuario
CREATE POLICY "Authenticated users can insert point transactions" ON point_transactions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Arreglar política de user_points también
DROP POLICY IF EXISTS "Users can insert their own points" ON user_points;
DROP POLICY IF EXISTS "Users can update their own points" ON user_points;

-- 4. Nuevas políticas más permisivas para user_points
CREATE POLICY "Authenticated users can insert user points" ON user_points
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update user points" ON user_points
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 5. OPCIONAL: Constraint para prevenir auto-likes a nivel de DB
-- (Esto es adicional a la validación en el código)
-- NOTA: Comentado porque puede causar problemas con queries complejas
-- ALTER TABLE likes ADD CONSTRAINT no_self_likes 
--   CHECK (user_id != (SELECT user_id FROM memories WHERE memories.id = memory_id));
-- SISTEMA DE PUNTOS - TABLAS PRINCIPALES
-- Ejecutar en Supabase SQL Editor

-- 1. Tabla de puntos por usuario
CREATE TABLE user_points (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  country TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabla de transacciones de puntos (historial)
CREATE TABLE point_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action TEXT NOT NULL, -- 'create_memory', 'receive_like', 'comment', 'share', 'invite'
  reference_id UUID, -- ID del recuerdo/comentario relacionado
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Políticas RLS para user_points
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all user points" ON user_points
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own points" ON user_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own points" ON user_points
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Políticas RLS para point_transactions
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all transactions" ON point_transactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own transactions" ON point_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_points_updated_at 
  BEFORE UPDATE ON user_points 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Función para calcular nivel automáticamente
CREATE OR REPLACE FUNCTION calculate_user_level(points_total INTEGER)
RETURNS INTEGER AS $$
BEGIN
  IF points_total >= 1000 THEN RETURN 5; -- Leyenda
  ELSIF points_total >= 600 THEN RETURN 4; -- Fanático
  ELSIF points_total >= 300 THEN RETURN 3; -- Seguidor
  ELSIF points_total >= 100 THEN RETURN 2; -- Fan
  ELSE RETURN 1; -- Hincha
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger para actualizar nivel automáticamente
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = calculate_user_level(NEW.points);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_level_on_points_change
  BEFORE INSERT OR UPDATE ON user_points
  FOR EACH ROW EXECUTE FUNCTION update_user_level();
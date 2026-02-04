-- Tabla de likes
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, memory_id)
);

-- RLS policies
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver likes
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden dar like
CREATE POLICY "Users can insert their own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden quitar su propio like
CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_likes_memory_id ON likes(memory_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

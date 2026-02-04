-- Tabla de recuerdos
CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  match_date DATE,
  team TEXT,
  is_public BOOLEAN DEFAULT true,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX idx_memories_user_id ON memories(user_id);
CREATE INDEX idx_memories_created_at ON memories(created_at DESC);
CREATE INDEX idx_memories_is_public ON memories(is_public);

-- Row Level Security (RLS)
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Usuarios pueden ver sus propios recuerdos
CREATE POLICY "Users can view own memories"
  ON memories FOR SELECT
  USING (auth.uid() = user_id);

-- Usuarios pueden ver recuerdos públicos
CREATE POLICY "Anyone can view public memories"
  ON memories FOR SELECT
  USING (is_public = true);

-- Usuarios pueden crear sus propios recuerdos
CREATE POLICY "Users can create own memories"
  ON memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar sus propios recuerdos
CREATE POLICY "Users can update own memories"
  ON memories FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuarios pueden eliminar sus propios recuerdos
CREATE POLICY "Users can delete own memories"
  ON memories FOR DELETE
  USING (auth.uid() = user_id);

-- Storage bucket para imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('memories', 'memories', true);

-- Políticas de storage
CREATE POLICY "Anyone can view memory images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'memories');

CREATE POLICY "Users can upload memory images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'memories' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);

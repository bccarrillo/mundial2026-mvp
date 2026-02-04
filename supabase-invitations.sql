-- Tabla de invitaciones
CREATE TABLE invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  invitee_email TEXT,
  invitee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  reward_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_invitations_inviter ON invitations(inviter_id);
CREATE INDEX idx_invitations_invitee ON invitations(invitee_id);
CREATE INDEX idx_invitations_status ON invitations(status);

-- RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view own invitations"
  ON invitations FOR SELECT
  USING (auth.uid() = inviter_id);

CREATE POLICY "Users can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (auth.uid() = inviter_id);

-- Función para procesar invitación aceptada
CREATE OR REPLACE FUNCTION process_invitation()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar invitación cuando el invitado se registra
  UPDATE invitations
  SET 
    invitee_id = NEW.id,
    status = 'accepted'
  WHERE invitee_email = NEW.email
    AND status = 'pending';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para procesar invitación
CREATE TRIGGER on_user_registered
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION process_invitation();

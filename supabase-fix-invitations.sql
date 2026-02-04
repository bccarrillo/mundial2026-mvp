-- Eliminar trigger que causa conflicto
DROP TRIGGER IF EXISTS on_user_registered ON profiles;

-- Eliminar función
DROP FUNCTION IF EXISTS process_invitation();

-- Política más permisiva para invitaciones
DROP POLICY IF EXISTS "Users can create invitations" ON invitations;

CREATE POLICY "Anyone can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (true);

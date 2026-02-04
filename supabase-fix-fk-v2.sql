-- Eliminar constraint anterior
ALTER TABLE memories
DROP CONSTRAINT IF EXISTS memories_user_id_fkey;

-- Agregar nueva constraint apuntando a profiles
ALTER TABLE memories
ADD CONSTRAINT memories_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

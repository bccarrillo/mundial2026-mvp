-- Agregar foreign key entre memories y profiles
ALTER TABLE memories
ADD CONSTRAINT memories_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

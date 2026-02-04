-- Crear vista para facilitar joins con profiles
CREATE OR REPLACE VIEW comments_with_profiles AS
SELECT 
  c.*,
  p.display_name,
  p.email
FROM comments c
LEFT JOIN profiles p ON c.user_id = p.id;

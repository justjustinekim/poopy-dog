
-- Function to get a user's profile by ID
CREATE OR REPLACE FUNCTION public.get_profile(user_id_input UUID)
RETURNS json AS $$
DECLARE
  profile_record json;
BEGIN
  SELECT json_build_object(
    'id', id,
    'username', username,
    'avatar_url', avatar_url,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO profile_record
  FROM profiles
  WHERE id = user_id_input;
  
  RETURN profile_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update a user's profile
CREATE OR REPLACE FUNCTION public.update_profile(
  user_id_input UUID,
  username_input TEXT DEFAULT NULL,
  avatar_url_input TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    username = COALESCE(username_input, username),
    avatar_url = COALESCE(avatar_url_input, avatar_url),
    updated_at = now()
  WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

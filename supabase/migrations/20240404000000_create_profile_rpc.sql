
-- Create an RPC function that creates a profile for the current authenticated user
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_record json;
BEGIN
  -- Insert a new profile for the current user
  INSERT INTO public.profiles (id)
  VALUES (auth.uid())
  RETURNING * INTO profile_record;
  
  RETURN profile_record;
END;
$$;

-- Ensure this function is available to authenticated users
GRANT EXECUTE ON FUNCTION public.create_profile_for_user() TO authenticated;

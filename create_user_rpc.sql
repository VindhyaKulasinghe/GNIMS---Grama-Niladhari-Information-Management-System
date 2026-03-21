-- Create a function to securely create users from the frontend
-- This function runs with "SECURITY DEFINER" (admin privileges)
CREATE OR REPLACE FUNCTION create_user_admin(
  user_email TEXT,
  user_password TEXT,
  user_name TEXT,
  user_role TEXT,
  user_division TEXT
) RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert into auth.users (this is the tricky part in Supabase)
  -- We use the gen_random_uuid() and basic fields. 
  -- Note: Depending on your Supabase version, you might need to adjust fields.
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    is_super_admin
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    json_build_object('full_name', user_name, 'role', user_role, 'division', user_division),
    now(),
    now(),
    '',
    '',
    '',
    false
  )
  RETURNING id INTO new_user_id;

  -- Create public user profile
  INSERT INTO public.users (id, name, email, role, division, status)
  VALUES (new_user_id, user_name, user_email, user_role, user_division, 'Active');

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function for the authenticated role
GRANT EXECUTE ON FUNCTION create_user_admin(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_admin(TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

-- RPC: Create a new auth + public user (replaces service role key usage)
CREATE OR REPLACE FUNCTION public.admin_create_user(
  p_email    TEXT,
  p_password TEXT,
  p_name     TEXT,
  p_role     TEXT,
  p_division TEXT,
  p_status   TEXT DEFAULT 'Active'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id UUID := gen_random_uuid();
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token,
    is_super_admin
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name', p_name, 'role', p_role),
    '', '',
    false
  );

  -- Insert into auth.identities
  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider,
    created_at, updated_at, last_sign_in_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    p_email,
    jsonb_build_object('sub', v_user_id::text, 'email', p_email),
    'email',
    NOW(), NOW(), NOW()
  );

  -- Insert into public.users
  INSERT INTO public.users (id, full_name, email, password_hash, role, division, status)
  VALUES (v_user_id, p_name, p_email, 'supabase_auth_managed', p_role, p_division, p_status);

  RETURN jsonb_build_object('id', v_user_id, 'email', p_email);

EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION '%', SQLERRM;
END;
$$;

-- RPC: Delete an auth + public user
CREATE OR REPLACE FUNCTION public.admin_delete_user(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  DELETE FROM auth.identities WHERE user_id = p_user_id;
  DELETE FROM auth.sessions   WHERE user_id = p_user_id;
  DELETE FROM auth.users      WHERE id      = p_user_id;
  DELETE FROM public.users    WHERE id      = p_user_id;
END;
$$;

-- RPC: Update auth user password / metadata
CREATE OR REPLACE FUNCTION public.admin_update_user(
  p_user_id  UUID,
  p_name     TEXT    DEFAULT NULL,
  p_role     TEXT    DEFAULT NULL,
  p_division TEXT    DEFAULT NULL,
  p_status   TEXT    DEFAULT NULL,
  p_password TEXT    DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Update public.users
  UPDATE public.users SET
    full_name = COALESCE(p_name,     full_name),
    role      = COALESCE(p_role,     role),
    division  = COALESCE(p_division, division),
    status    = COALESCE(p_status,   status),
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Update auth metadata if name/role changed
  IF p_name IS NOT NULL OR p_role IS NOT NULL THEN
    UPDATE auth.users SET
      raw_user_meta_data = raw_user_meta_data
        || jsonb_strip_nulls(jsonb_build_object(
             'full_name', p_name,
             'role',      p_role
           )),
      updated_at = NOW()
    WHERE id = p_user_id;
  END IF;

  -- Update password if provided
  IF p_password IS NOT NULL THEN
    UPDATE auth.users SET
      encrypted_password = crypt(p_password, gen_salt('bf')),
      updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$;

-- Grant execute to authenticated users (admin check happens inside app logic)
GRANT EXECUTE ON FUNCTION public.admin_create_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user TO authenticated;

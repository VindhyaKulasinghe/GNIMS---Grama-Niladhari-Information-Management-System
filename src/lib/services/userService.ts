import { supabase } from '../supabaseClient'
import { supabaseAdmin } from '../supabaseAdmin'
import { User, UserSchema } from '../validationSchemas'

export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data || null
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

export async function createUser(
  user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  password?: string
): Promise<User> {
  try {
    const validated = UserSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(user)
    // 1. Create user in Supabase Auth via the secure RPC (SECURITY DEFINER)
    // This avoids using the Service Role Key in the browser
    const { data: authData, error: authError } = await supabase.rpc('create_user_admin', {
      user_email: validated.email,
      user_password: password || 'Welcome@123',
      user_name: validated.name,
      user_role: validated.role,
      user_division: validated.division
    });

    if (authError) {
      console.error('Auth RPC Error:', authError);
      throw new Error(authError.message || 'Failed to create authentication account');
    }

    if (!authData) {
      throw new Error('No data returned from user creation');
    }

    // Success! The RPC handled both Auth and Public User insertion.
    // We fetch the newly created user to return it.
    const { data: newUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData)
      .single();

    if (fetchError) throw fetchError;
    return newUser;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
}

export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  try {
    const validated = UserSchema.partial().parse(user)

    // Update public user record
    const { data, error } = await supabase
      .from('users')
      .update(validated)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Also update auth metadata if role/name changed
    if (user.role || user.name) {
      await supabaseAdmin.auth.admin.updateUserById(id, {
        user_metadata: {
          ...(user.name && { full_name: user.name }),
          ...(user.role && { role: user.role }),
        }
      })
    }

    return data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    // 1. Delete auth user first
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (authError) {
      console.warn('Could not delete auth user (may not exist):', authError.message)
    }

    // 2. Delete public user record
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

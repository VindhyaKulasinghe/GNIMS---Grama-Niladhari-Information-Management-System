import { supabase } from '../../supabaseClient'
import { User } from '../../validationSchemas'

/**
 * Create or get user during authentication
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data || null
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

/**
 * Get user by ID
 */
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
    console.error('Error fetching user by ID:', error)
    return null
  }
}

/**
 * Create new user
 */
export async function createUser(
  email: string,
  passwordHash: string,
  fullName: string,
  role: string,
  division: string
): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          full_name: fullName,
          role,
          division,
          status: 'Active',
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data || null
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  updates: Partial<User>
): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data || null
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

/**
 * Get all users
 */
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
    return []
  }
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<void> {
  try {
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

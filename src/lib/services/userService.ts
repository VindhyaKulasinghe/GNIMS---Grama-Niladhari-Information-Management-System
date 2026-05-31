import { supabase } from '../supabaseClient'
import { User } from '../validationSchemas'

// Map DB row (full_name, snake_case dates) → app User schema (name, camelCase)
function mapDbUser(row: any): User {
  return {
    id: row.id,
    name: row.full_name || '',
    email: row.email,
    role: row.role,
    division: row.division,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(mapDbUser)
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
    return data ? mapDbUser(data) : null
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
    const { data, error } = await supabase.rpc('admin_create_user', {
      p_email:    user.email,
      p_password: password || 'Welcome@123',
      p_name:     user.name,
      p_role:     user.role,
      p_division: user.division,
      p_status:   user.status,
    })

    if (error) throw error

    // Fetch the newly created user record
    const { data: newUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', (data as any).id)
      .single()

    if (fetchError) throw fetchError
    return mapDbUser(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  try {
    const { error } = await supabase.rpc('admin_update_user', {
      p_user_id:  id,
      p_name:     user.name     ?? null,
      p_role:     user.role     ?? null,
      p_division: user.division ?? null,
      p_status:   user.status   ?? null,
      p_password: null,
    })

    if (error) throw error

    const { data, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    return mapDbUser(data)
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('admin_delete_user', {
      p_user_id: id,
    })
    if (error) throw error
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

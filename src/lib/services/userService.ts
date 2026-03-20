import supabase from '../supabaseClient'
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

export async function createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  try {
    const validated = UserSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(user)

    const { data, error } = await supabase
      .from('users')
      .insert([validated])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  try {
    const validated = UserSchema.partial().parse(user)

    const { data, error } = await supabase
      .from('users')
      .update(validated)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

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

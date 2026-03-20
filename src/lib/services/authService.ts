import { supabase } from '../supabaseClient'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: string
  division: string
  status: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: AuthUser
}

function mapProfileToAuthUser(
  profile: any,
  fallbackEmail: string,
  fallbackId: string
): AuthUser {
  return {
    id: (profile && (profile.id as string)) || fallbackId,
    email: (profile && (profile.email as string)) || fallbackEmail,
    fullName:
      (profile &&
        ((profile.full_name as string) || (profile.name as string))) ||
      '',
    role: (profile && (profile.role as string)) || 'GN Officer',
    division: (profile && (profile.division as string)) || '',
    status: (profile && (profile.status as string)) || 'Active',
  }
}

/**
 * Login user with email and password via Supabase Auth
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.signInWithPassword({ email, password })

    if (authError || !authData.user) {
      return {
        success: false,
        message: authError?.message || 'Invalid email or password',
      }
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error loading user profile:', profileError)
    }

    const user = mapProfileToAuthUser(profile, email, authData.user.id)

    if (user.status && user.status !== 'Active') {
      await supabase.auth.signOut()
      return {
        success: false,
        message: 'User account is inactive',
      }
    }

    return {
      success: true,
      message: 'Login successful',
      user,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      message: 'An error occurred during authentication',
    }
  }
}

/**
 * Verify current auth status using Supabase session
 */
export async function verifyAuth(): Promise<AuthResponse> {
  try {
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser()

    if (error || !authUser) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const email = authUser.email || ''

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error loading user profile:', profileError)
    }

    const user = mapProfileToAuthUser(profile, email, authUser.id)

    if (user.status && user.status !== 'Active') {
      await supabase.auth.signOut()
      return {
        success: false,
        message: 'User account is inactive',
      }
    }

    return {
      success: true,
      message: 'Authenticated',
      user,
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return {
      success: false,
      message: 'Failed to verify authentication',
    }
  }
}

/**
 * Logout user from Supabase Auth
 */
export async function logoutUser(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return {
        success: false,
        message: 'Logout failed',
      }
    }

    return {
      success: true,
      message: 'Logged out successfully',
    }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      message: 'Logout failed',
    }
  }
}

/**
 * Keep session alive / check Supabase session
 */
export async function refreshAuthToken(): Promise<AuthResponse> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error || !session) {
      return {
        success: false,
        message: 'No active session',
      }
    }

    return {
      success: true,
      message: 'Session active',
    }
  } catch (error) {
    console.error('Session check error:', error)
    return {
      success: false,
      message: 'Failed to check session',
    }
  }
}

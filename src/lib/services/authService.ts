export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    fullName: string
    role: string
    division: string
    status: string
  }
  token?: string
}

/**
 * Login user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    // Call edge function or API to authenticate
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Include cookies
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Authentication failed',
      }
    }

    return {
      success: true,
      message: 'Login successful',
      user: data.user,
      token: data.token,
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
 * Verify current auth status
 */
export async function verifyAuth(): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: 'Not authenticated',
        }
      }
      throw new Error('Verification failed')
    }

    const data = await response.json()

    return {
      success: true,
      message: 'Authenticated',
      user: data.user,
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
 * Logout user and clear auth cookies
 */
export async function logoutUser(): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }

    return {
      success: true,
      message: 'Logged out successfully',
    }
  } catch (error) {
    console.error('Logout error:', error)
    // Clear local auth state even if API call fails
    return {
      success: true,
      message: 'Logged out',
    }
  }
}

/**
 * Get refresh token (for keeping session alive)
 */
export async function refreshAuthToken(): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      return {
        success: false,
        message: 'Token refresh failed',
      }
    }

    const data = await response.json()

    return {
      success: true,
      message: 'Token refreshed',
      token: data.token,
    }
  } catch (error) {
    console.error('Token refresh error:', error)
    return {
      success: false,
      message: 'Failed to refresh token',
    }
  }
}

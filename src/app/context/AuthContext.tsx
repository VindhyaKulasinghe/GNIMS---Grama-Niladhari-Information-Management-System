import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import {
  authenticateUser,
  verifyAuth,
  logoutUser,
  refreshAuthToken,
} from '../../lib/services/authService'

export interface User {
  id: string
  email: string
  fullName: string
  role: 'Admin' | 'GN Officer' | 'Divisional Secretariat'
  division: string
  status: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Check authentication status on mount
   */
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      const result = await verifyAuth()

      if (result.success && result.user) {
        setUser(result.user)
        setIsAuthenticated(true)
        setError(null)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error('Error checking auth:', err)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Initialize auth on component mount
   */
  useEffect(() => {
    checkAuth()

    // Set up interval to refresh token every 15 minutes
    const tokenRefreshInterval = setInterval(async () => {
      if (isAuthenticated) {
        const result = await refreshAuthToken()
        if (!result.success) {
          setIsAuthenticated(false)
          setUser(null)
        }
      }
    }, 15 * 60 * 1000) // 15 minutes

    return () => clearInterval(tokenRefreshInterval)
  }, [isAuthenticated, checkAuth])

  /**
   * Login user
   */
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setLoading(true)
        setError(null)

        const result = await authenticateUser(email, password)

        if (result.success && result.user) {
          setUser(result.user)
          setIsAuthenticated(true)
          return true
        } else {
          setError(result.message || 'Login failed')
          setIsAuthenticated(false)
          return false
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred'
        setError(errorMessage)
        setIsAuthenticated(false)
        return false
      } finally {
        setLoading(false)
      }
    },
    []
  )

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      await logoutUser()
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
    } catch (err) {
      console.error('Error logging out:', err)
      // Clear local state even if API fails
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

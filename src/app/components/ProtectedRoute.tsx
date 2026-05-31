import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext'
import { Loader } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
}

/**
 * ProtectedRoute component to guard pages that require authentication
 */
export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto text-slate-900 mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect admins away from non-admin pages
  if (user?.role === "Admin" && !requiredRole?.includes("Admin")) {
    return <Navigate to="/divisions" replace />
  }

  // Block non-admins from admin-only pages
  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

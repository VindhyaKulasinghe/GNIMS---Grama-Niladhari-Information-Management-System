/**
 * Server-side authentication endpoints
 * These should be implemented as Vite middleware or separate server
 */

// This file provides the structure for backend endpoints
// Implement these using Express, Fastify, or similar Node.js framework

/*
POST /api/auth/login
Body: { email: string, password: string }
Response: { success: boolean, user: User, token: string }
- Validates email/password against database
- Hashes password and compares with stored hash
- Sets secure HTTP-only cookie with JWT token
- Returns user data and token

POST /api/auth/logout
Response: { success: boolean }
- Clears authentication cookies
- Invalidates token if needed

GET /api/auth/me
Response: { success: boolean, user: User }
- Validates JWT token from cookies
- Returns current authenticated user
- Returns 401 if not authenticated

POST /api/auth/refresh
Response: { success: boolean, token: string }
- Validates refresh token
- Issues new access token
- Sets new cookie

POST /api/auth/admin-create
Body: { email: string, password: string, fullName: string, division: string }
Response: { success: boolean, user: User }
- Only callable by admin users
- Creates new user account
*/

export const authenticatedEndpoints = {
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  me: '/api/auth/me',
  refresh: '/api/auth/refresh',
  createAdmin: '/api/auth/admin-create',
}

export const publicEndpoints = ['/login', '/api/health']

export const adminEndpoints = ['/user-management', '/api/auth/admin-create']

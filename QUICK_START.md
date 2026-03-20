# GNIMS Authentication System - Quick Start Guide

## What Has Been Implemented

### ✅ Authentication System Components

1. **Email/Password Authentication**
   - Users log in with email and password
   - Passwords are hashed with bcrypt
   - Backend validates credentials against database

2. **Cookie-Based Session Management**
   - Secure HTTP-only cookies store JWT tokens
   - Separate access tokens (1 hour) and refresh tokens (7 days)
   - Automatic token refresh every 15 minutes
   - SameSite=Strict policy for security

3. **Protected Routes**
   - All pages (except login) require authentication
   - Automatic redirect to login for unauthenticated users
   - Role-based access control (Admin-only pages)
   - Loading state while checking authentication

4. **User Authentication Context**
   - Global auth state management
   - Login, logout, and auth verification functions
   - Error handling and user information
   - Auto-initialization on app load

5. **Logout Functionality**
   - Clears all authentication cookies
   - Resets user state
   - Redirects to login page

## File Structure

```
src/app/
├── context/
│   └── AuthContext.tsx                    # Auth state & functions
├── components/
│   ├── ProtectedRoute.tsx                # Route guard component
│   ├── UserMenu.tsx                      # User menu with logout
│   └── Layout.tsx                        # Include UserMenu in header
├── pages/
│   ├── Login.tsx                         # Email/password login form
│   └── [other pages - all protected]
└── services/
    ├── authService.ts                    # API calls to backend
    ├── authUserService.ts                # User database queries
    └── authEndpoints.ts                  # Endpoint definitions

src/lib/
├── supabaseClient.ts                     # Supabase setup
└── validationSchemas.ts                  # Includes User schema

auth-server.js                             # Express backend server
package.json                               # Updated with dependencies
.env.example                               # Environment variables template
AUTHENTICATION_GUIDE.md                   # Comprehensive guide
QUICK_START.md                            # This file
```

## Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- `express` - Backend server
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT tokens
- `cors` - Cross-origin requests
- `cookie-parser` - Parse cookies
- `dotenv` - Environment variables

### Step 2: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

3. Generate secure JWT secrets (use a random generator or):
   ```bash
   # Generate random strings for JWT secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Step 3: Create Users Table in Database

Run this SQL in Supabase SQL Editor:

```sql
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'GN Officer',
  division VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Step 4: Create Admin Account

Generate bcrypt hash for password "admin@123":

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin@123', 10, (err, hash) => console.log(hash));"
```

Copy the hash and run (replace `HASHED_PASSWORD`):

```sql
INSERT INTO users (email, password_hash, full_name, role, division, status)
VALUES (
  'admin@gnims.lk',
  'HASHED_PASSWORD',
  'System Administrator',
  'Admin',
  'Hambantota',
  'Active'
);
```

### Step 5: Start Both Frontend and Backend

**Option A: Run both together**
```bash
npm run dev:all
```

**Option B: Run frontend only**
```bash
npm run dev
# Frontend runs at http://localhost:5173
```

**Option C: Run backend only**
```bash
npm run auth-server
# Backend runs at http://localhost:3001
```

## Testing the Authentication

### Login

1. Navigate to http://localhost:5173/login
2. Enter credentials:
   - **Email**: `admin@gnims.lk`
   - **Password**: `admin@123`
3. Click "Sign In"

### Expected Behavior

✅ **Login Success**
- Redirected to dashboard
- User menu shows in header with user info
- Cookies `authToken` and `refreshToken` set

❌ **Login Failure**
- Error message displayed
- Stays on login page
- No cookies set

### Test Protected Routes

1. After login, navigate to any page (e.g., `/households`)
   - Should display page content

2. Log out using user menu
   - Redirected to login page
   - Cookies cleared
   - Cannot access protected pages

3. Try accessing protected page without login
   - Automatically redirected to login

4. Try accessing admin-only page as non-admin
   - "Access Denied" message shown

## API Endpoints

All endpoints are on `http://localhost:3001/api/auth`

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "admin@gnims.lk",
  "password": "admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "admin@gnims.lk",
    "fullName": "System Administrator",
    "role": "Admin",
    "division": "Hambantota",
    "status": "Active"
  }
}
```

**Cookies Set:**
- `authToken`: JWT access token (1 hour expiry)
- `refreshToken`: JWT refresh token (7 days expiry)

### GET `/api/auth/me`
**Headers:** Requires valid `authToken` cookie

**Response:**
```json
{
  "success": true,
  "user": { /* user object */ }
}
```

### POST `/api/auth/logout`
**Response:**
```json
{
  "success": true,
  "message": "Logged out"
}
```

**Cookies Cleared:**
- `authToken` removed
- `refreshToken` removed

### POST `/api/auth/refresh`
**Headers:** Requires valid `refreshToken` cookie

**Response:**
```json
{
  "success": true,
  "token": "new_access_token"
}
```

## Common Issues & Troubleshooting

### Issue: "Network Error" or "Failed to fetch"
**Solution:**
- Ensure backend server is running: `npm run auth-server`
- Check backend is on port 3001
- Check CORS is enabled in auth-server.js

### Issue: Login page shows but backend not responding
**Solution:**
- Start backend in separate terminal
- Add `CLIENT_URL` to .env matching your frontend URL
- Verify Supabase credentials in .env

### Issue: "User not found" after login
**Solution:**
- Check admin account was created in database
- Verify email matches exactly (case-sensitive in URLs)
- Check bcrypt hash is correct

### Issue: Session expires too quickly
**Solution:**
- Tokens auto-refresh every 15 minutes
- Access token valid for 1 hour
- Refresh token valid for 7 days
- Check browser time is synchronized

### Issue: Can't see user menu after login
**Solution:**
- Ensure Layout.tsx includes UserMenu component
- Check imports are correct
- Verify AuthContext is wrapping app

## Production Checklist

Before deploying:

- [ ] Change all JWT secrets to random 32+ character strings
- [ ] Use HTTPS for all communications
- [ ] Set NODE_ENV=production
- [ ] Enable HSTS headers
- [ ] Set SameSite=Strict on cookies
- [ ] Implement rate limiting on login endpoint
- [ ] Add CSRF protection
- [ ] Set proper CORS origins (not '*')
- [ ] Store secrets in environment variables only
- [ ] Enable database encryption
- [ ] Set up audit logging
- [ ] Test all authentication flows
- [ ] Set up backup authentication method

## Next Steps

### Add More Features

1. **User Management Page**
   - Create new users (admin only)
   - Edit user roles
   - Deactivate users

2. **Password Reset**
   - Email-based reset link
   - Token expiration
   - New password validation

3. **Two-Factor Authentication**
   - TOTP authenticator
   - SMS verification
   - Backup codes

4. **Audit Logging**
   - Track login attempts
   - Log admin actions
   - Monitor suspicious activity

### Create Admin Panel

```typescript
// pages/UserManagement.tsx
import { ProtectedRoute } from '../components/ProtectedRoute'

<ProtectedRoute requiredRole={['Admin']}>
  <UserManagement />
</ProtectedRoute>
```

## Support & Documentation

- **Full Guide**: See `AUTHENTICATION_GUIDE.md`
- **Backend Code**: `auth-server.js`
- **Frontend Auth**: `src/app/context/AuthContext.tsx`
- **API Service**: `src/lib/services/authService.ts`
- **Protected Routes**: `src/app/components/ProtectedRoute.tsx`

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start frontend + backend | `npm run dev:all` |
| Start frontend only | `npm run dev` |
| Start backend only | `npm run auth-server` |
| Build for production | `npm run build` |

---

**Status**: ✅ Authentication system fully implemented and ready to use

# GNIMS Authentication System Implementation Guide

## Overview
This guide walks you through implementing a complete production-ready authentication system for the GNIMS application with role-based access control, cookie-based session management, and protected routes.

## 1. Database Setup

### SQL: Create Users Table and Admin Account

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert admin account
-- IMPORTANT: Replace the password_hash with an actual bcrypt hash
-- Use: bcrypt.hash("admin@123", 10) to generate the hash
INSERT INTO users (email, password_hash, full_name, role, division, status)
VALUES (
  'admin@gnims.lk',
  '$2b$10$ZXjHqM7OZ2xZzQxQT5xO.e2ZxZzQxQT5xO.e2ZxZzQxQT5xO.e2',
  'System Administrator',
  'Admin',
  'Hambantota',
  'Active'
);
```

**To generate a bcrypt hash:**
```bash
npm install -g bcrypt
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin@123', 10, (err, hash) => console.log(hash));"
```

## 2. Backend API Implementation

### Create a Backend Server (Express.js Example)

Create `server.js` in your project root:

```javascript
import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Middleware: Verify JWT token
async function verifyToken(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    // Fetch user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check user status
    if (user.status !== 'Active') {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Set secure HTTP-only cookies
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800000, // 7 days
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        division: user.division,
        status: user.status,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        division: user.division,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('authToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.json({ success: true, token: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('authToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
```

### Install Backend Dependencies

```bash
npm install express cookie-parser bcrypt jsonwebtoken cors @supabase/supabase-js
```

### Add to .env

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret_key_change_this
REFRESH_SECRET=your_refresh_secret_key_change_this
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## 3. Frontend Implementation

### Already Implemented Files:

1. **AuthContext** (`src/app/context/AuthContext.tsx`)
   - Manages authentication state
   - Provides login/logout/checkAuth functions
   - Auto-refreshes token every 15 minutes

2. **authService** (`src/lib/services/authService.ts`)
   - Makes API calls to backend endpoints
   - Handles email/password authentication
   - Includes credentials mode for cookie transmission

3. **ProtectedRoute** (`src/app/components/ProtectedRoute.tsx`)
   - Guards routes that require authentication
   - Checks user role for role-based access
   - Redirects to login if not authenticated

4. **UserMenu** (`src/app/components/UserMenu.tsx`)
   - Displays current user info
   - Logout functionality
   - Settings access

5. **Updated Login Page** (`src/app/pages/Login.tsx`)
   - Email/password login form
   - Shows demo credentials
   - Password recovery dialog
   - Error messaging

6. **Protected Routes** (`src/app/routes.tsx`)
   - All routes except login are protected
   - Admin-only routes specified

## 4. Integration Steps

### Step 1: Update Layout.tsx to include UserMenu

```typescript
import { UserMenu } from './UserMenu';

export function Layout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-64">
        {/* navigation items */}
      </nav>

      {/* Main content */}
      <div className="flex-1">
        {/* Header with UserMenu */}
        <header className="flex justify-between items-center p-4">
          <h1>GNIMS</h1>
          <UserMenu />
        </header>

        {/* Page content */}
        <main>{/* Outlet */}</main>
      </div>
    </div>
  );
}
```

### Step 2: Verify App.tsx wraps everything with AuthProvider

Already done in routes.tsx - AuthProvider wraps RootWrapper.

## 5. Security Features Implemented

✅ **Email/Password Authentication**
- Email validation
- Password comparison with bcrypt

✅ **Cookie-Based Sessions**
- HTTP-only cookies (secure)
- SameSite strict policy
- Separate access and refresh tokens

✅ **Protected Routes**
- ProtectedRoute component guards all pages
- Automatic redirect to login for unauthenticated users
- Role-based access control

✅ **Session Management**
- Auto token refresh every 15 minutes
- Logout clears all cookies
- Auth status verification on app init

✅ **Error Handling**
- User-friendly error messages
- Proper HTTP status codes
- Client-side error display

## 6. Usage Examples

### Login
```typescript
const { login } = useAuth();
const success = await login('admin@gnims.lk', 'admin@123');
```

### Check Authentication
```typescript
const { isAuthenticated, user } = useAuth();
```

### Logout
```typescript
const { logout } = useAuth();
await logout();
```

### Protected Component
```typescript
<ProtectedRoute requiredRole={['Admin']}>
  <AdminPanel />
</ProtectedRoute>
```

## 7. Testing the System

1. **Start backend server**
   ```bash
   node server.js
   ```

2. **Start frontend (in another terminal)**
   ```bash
   npm run dev
   ```

3. **Login with demo credentials**
   - Email: `admin@gnims.lk`
   - Password: `admin@123`

4. **Test protected routes**
   - Try accessing `/` without logging in → redirects to login
   - Login successfully → redirects to dashboard
   - Check user info in header menu

5. **Test logout**
   - Click user menu → Logout
   - Cookies cleared, redirected to login

## 8. Troubleshooting

### Issue: Login fails with "Network Error"
- Check backend server is running
- Verify CORS settings in server.js
- Check CLIENT_URL in .env

### Issue: Cookies not being set
- Verify `credentials: 'include'` in fetch calls
- Check `httpOnly` flag in cookie settings
- Verify HTTPS in production (required for secure cookies)

### Issue: Token refresh not working
- Check refresh token hasn't expired (7 days)
- Verify jwt.verify() doesn't throw error
- Check logs for token validation errors

## 9. Next Steps

### Create Admin User Management Interface
- Add user creation form
- Add role assignment
- Add user status toggle
- Soft delete users

### Implement Password Reset
- Email-based reset link
- Token expiration (30 mins)
- Password validation rules

### Add Audit Logging
- Log all login attempts
- Track admin actions
- Store IP addresses

### Enable 2FA
- TOTP authenticator app
- SMS-based verification
- Backup codes

## 10. Production Checklist

- [ ] Change all default secrets in .env
- [ ] Set JWT_SECRET to random 32+ character string
- [ ] Use HTTPS for all communications
- [ ] Enable HSTS headers
- [ ] Set SameSite=Strict for all cookies
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF protection
- [ ] Set proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Implement proper error logging
- [ ] Set up backup authentication (emergency access)
- [ ] Test all auth flows thoroughly

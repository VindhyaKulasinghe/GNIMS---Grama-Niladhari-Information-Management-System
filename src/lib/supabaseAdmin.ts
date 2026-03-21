import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = (import.meta as any).env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Missing Supabase Service Role Key. Admin features may be limited.')
}

// This client has admin privileges (bypasses RLS)
// !! WARNING: DO NOT EXPOSE THIS IN A PUBLIC PRODUCTION APP !!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

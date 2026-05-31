import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env vars missing – using mock client");
  const mockAuth = {
    signInWithPassword: async () => ({
      data: { user: null },
      error: { message: "Missing supabase config" },
    }),
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null }),
  } as any;
  supabase = { auth: mockAuth } as any;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

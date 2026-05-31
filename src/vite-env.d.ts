/// <reference types="vite/client" />

// This file provides TypeScript type definitions for Vite's import.meta.env
// It declares the environment variables used in the project.
interface ImportMetaEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_SUPABASE_SERVICE_ROLE_KEY?: string;
  // Add any other Vite env variables you need here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

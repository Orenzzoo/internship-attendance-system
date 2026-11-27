import { createSupabaseApi } from './supabaseApi'
import { localApi } from './localApi'

const env = import.meta.env

// VITE_* from a local .env, or the NEXT_PUBLIC_* names Vercel's Supabase integration sets.
const url = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
const key = env.VITE_SUPABASE_KEY
  || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Without Supabase settings the app still runs, in a single-browser demo mode.
export const isDemo = !(url && key)

export const api = isDemo ? localApi : createSupabaseApi(url, key)

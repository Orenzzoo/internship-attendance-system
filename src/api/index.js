import { createSupabaseApi } from './supabaseApi'
import { localApi } from './localApi'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

// Without Supabase settings the app still runs, in a single-browser demo mode.
export const isDemo = !(url && key)

export const api = isDemo ? localApi : createSupabaseApi(url, key)

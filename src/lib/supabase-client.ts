import { createClient } from '@supabase/supabase-js'

// Lazy initialization of Supabase client to avoid build-time issues
let supabase: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    supabase = createClient(supabaseUrl, supabaseKey)
  }
  return supabase
}

// Export for backward compatibility
export { getSupabase as supabase }

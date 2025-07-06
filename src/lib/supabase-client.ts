import { createClient } from '@supabase/supabase-js'

// Lazy initialization of Supabase client to avoid build-time issues
let supabase: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Check if environment variables are available
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables:', {
        url: !!supabaseUrl,
        key: !!supabaseKey
      })
      // Return a mock client for development/build
      supabase = createClient('https://placeholder.supabase.co', 'placeholder-key')
    } else {
      supabase = createClient(supabaseUrl, supabaseKey)
    }
  }
  return supabase
}

// Export for backward compatibility
export { getSupabase as supabase }

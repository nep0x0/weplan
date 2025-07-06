// Test Supabase connection
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...\n')

console.log('Environment Variables:')
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Key:', supabaseKey ? '✅ Set' : '❌ Missing')
console.log('Key length:', supabaseKey ? supabaseKey.length : 0)
console.log('Key starts with:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'N/A')

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing environment variables!')
  process.exit(1)
}

try {
  console.log('\n🔗 Creating Supabase client...')
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  console.log('✅ Supabase client created successfully')
  
  // Test connection
  console.log('\n🧪 Testing connection...')
  
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.log('❌ Auth error:', error.message)
    } else {
      console.log('✅ Auth connection successful')
      console.log('Session:', data.session ? 'Active' : 'No session')
    }
    
    // Test a simple query
    console.log('\n🗄️ Testing database connection...')
    return supabase.from('user_profiles').select('count', { count: 'exact', head: true })
  }).then(({ error, count }) => {
    if (error) {
      console.log('❌ Database error:', error.message)
      if (error.message.includes('relation "user_profiles" does not exist')) {
        console.log('💡 This means the database schema hasn\'t been created yet.')
        console.log('   Run the SQL schema in Supabase Dashboard first.')
      }
    } else {
      console.log('✅ Database connection successful')
      console.log('User profiles count:', count)
    }
  }).catch(err => {
    console.log('❌ Connection test failed:', err.message)
  })
  
} catch (error) {
  console.log('❌ Failed to create Supabase client:', error.message)
}

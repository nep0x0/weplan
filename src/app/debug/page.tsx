'use client'

export default function DebugPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Debug Environment Variables</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
        
        <div className="space-y-3">
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>
            <div className="mt-1 p-2 bg-gray-100 rounded text-sm font-mono">
              {supabaseUrl || 'NOT SET'}
            </div>
          </div>
          
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>
            <div className="mt-1 p-2 bg-gray-100 rounded text-sm font-mono">
              {supabaseKey ? `${supabaseKey.substring(0, 50)}...` : 'NOT SET'}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Status:</h3>
          <div className={`p-3 rounded ${
            supabaseUrl && supabaseKey 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {supabaseUrl && supabaseKey 
              ? '✅ Environment variables are set' 
              : '❌ Environment variables are missing'
            }
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">All process.env:</h3>
          <pre className="p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(
              Object.keys(process.env)
                .filter(key => key.startsWith('NEXT_PUBLIC_'))
                .reduce((obj, key) => {
                  obj[key] = process.env[key]
                  return obj
                }, {} as Record<string, string | undefined>),
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase-client'

export default function DebugSupabasePage() {
  const [status, setStatus] = useState('Initializing...')
  const [logs, setLogs] = useState<string[]>([])
  const [sessionInfo, setSessionInfo] = useState<Record<string, unknown> | null>(null)

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const testSupabase = async () => {
      try {
        addLog('🔍 Starting Supabase debug test...')
        
        // Test 1: Create Supabase client
        addLog('📝 Step 1: Creating Supabase client...')
        const supabase = getSupabase()
        addLog('✅ Supabase client created successfully')
        
        // Test 2: Test auth.getSession()
        addLog('📝 Step 2: Testing auth.getSession()...')
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          addLog(`❌ Auth error: ${error.message}`)
          setStatus('Auth Error')
        } else {
          addLog('✅ Auth.getSession() successful')
          setSessionInfo(data)
          setStatus('Success')
        }
        
        // Test 3: Test database connection
        addLog('📝 Step 3: Testing database connection...')
        const { data: dbData, error: dbError } = await supabase
          .from('user_profiles')
          .select('count', { count: 'exact', head: true })
        
        if (dbError) {
          addLog(`❌ Database error: ${dbError.message}`)
          if (dbError.message.includes('relation "user_profiles" does not exist')) {
            addLog('💡 Database schema not created yet - this is expected')
          }
        } else {
          addLog('✅ Database connection successful')
          addLog(`📊 User profiles count: ${dbData}`)
        }
        
        // Test 4: Test auth state listener
        addLog('📝 Step 4: Testing auth state listener...')
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          addLog(`🔔 Auth state change: ${event}, session: ${session ? 'exists' : 'null'}`)
        })
        
        // Clean up after 5 seconds
        setTimeout(() => {
          subscription.unsubscribe()
          addLog('🧹 Auth listener cleaned up')
        }, 5000)
        
        addLog('✅ All tests completed')
        
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        addLog(`❌ Critical error: ${errorMessage}`)
        setStatus('Critical Error')
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Debug Supabase Connection</h1>
      
      <div className="grid gap-6">
        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Current Status</h2>
          <div className={`p-3 rounded text-center font-semibold ${
            status === 'Success' ? 'bg-green-100 text-green-800' :
            status.includes('Error') ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {status}
          </div>
        </div>

        {/* Session Info */}
        {sessionInfo && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Session Information</h2>
            <pre className="p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Logs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Debug Logs</h2>
          <div className="space-y-1 max-h-96 overflow-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono p-2 bg-gray-50 rounded">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm">
            <div><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</div>
            <div><strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 50)}...</div>
            <div><strong>Node ENV:</strong> {process.env.NODE_ENV}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Test
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Go to Main App
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

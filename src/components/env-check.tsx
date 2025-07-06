'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Heart } from 'lucide-react'

export function EnvCheck({ children }: { children: React.ReactNode }) {
  const [envStatus, setEnvStatus] = useState<'checking' | 'ok' | 'error'>('checking')
  const [missingVars, setMissingVars] = useState<string[]>([])

  useEffect(() => {
    // Check environment variables on client side
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('EnvCheck - URL:', supabaseUrl ? 'Set' : 'Missing')
    console.log('EnvCheck - Key:', supabaseKey ? 'Set' : 'Missing')

    const missing = []

    if (!supabaseUrl || supabaseUrl === 'undefined' || supabaseUrl.includes('placeholder')) {
      missing.push('NEXT_PUBLIC_SUPABASE_URL')
    }

    if (!supabaseKey || supabaseKey === 'undefined' || supabaseKey.includes('placeholder')) {
      missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }

    if (missing.length > 0) {
      setMissingVars(missing)
      setEnvStatus('error')
      console.error('Missing environment variables:', missing)
    } else {
      setEnvStatus('ok')
      console.log('Environment variables OK')
    }
  }, [])

  if (envStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Checking configuration...</p>
        </div>
      </div>
    )
  }

  if (envStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Configuration Error
          </h1>
          
          <p className="text-gray-600 mb-4">
            The application is missing required environment variables:
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <ul className="text-left text-sm text-orange-800">
              {missingVars.map(varName => (
                <li key={varName} className="font-mono">
                  • {varName}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-left text-sm text-gray-600 space-y-2">
            <p><strong>For Vercel deployment:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Go to Vercel Dashboard</li>
              <li>Select your project</li>
              <li>Go to Settings → Environment Variables</li>
              <li>Add the missing variables</li>
              <li>Redeploy the application</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

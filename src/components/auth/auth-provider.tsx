'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase-client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const supabaseClient = getSupabase()

        // Get initial session
        const { data: { session }, error } = await supabaseClient.auth.getSession()

        if (mounted) {
          if (error) {
            console.error('Auth session error:', error)
          }
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }

        // Listen for auth changes
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
          (event, session) => {
            if (mounted) {
              console.log('Auth state changed:', event)
              setSession(session)
              setUser(session?.user ?? null)
            }
          }
        )

        return () => {
          subscription.unsubscribe()
        }

      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    const cleanup = initAuth()

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted) {
        console.log('Auth timeout fallback')
        setLoading(false)
      }
    }, 3000)

    return () => {
      mounted = false
      clearTimeout(timeout)
      cleanup?.then(cleanupFn => cleanupFn?.())
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const supabaseClient = getSupabase()
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password })
      return error ? { error: error.message } : {}
    } catch {
      return { error: 'Sign in failed' }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const supabaseClient = getSupabase()
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })
      return error ? { error: error.message } : {}
    } catch {
      return { error: 'Sign up failed' }
    }
  }

  const signOut = async () => {
    try {
      const supabaseClient = getSupabase()
      await supabaseClient.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const supabaseClient = getSupabase()
      await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` },
      })
    } catch (error) {
      console.error('Google sign in error:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { getSupabase }

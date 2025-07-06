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
  const [loading] = useState(false) // Set to false for now to avoid loading issues

  // Simplified auth initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        const supabaseClient = getSupabase()
        const { data: { session } } = await supabaseClient.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Auth initialization error:', error)
      }
    }

    initAuth()
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

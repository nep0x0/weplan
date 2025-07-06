import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Wedding {
  id: string
  user_id: string
  bride_name: string
  groom_name: string
  wedding_date: string
  budget_total: number
  created_at: string
  updated_at: string
}

export interface BudgetCategory {
  id: string
  wedding_id: string
  name: string
  allocated_amount: number
  spent_amount: number
  color: string
  created_at: string
  updated_at: string
}

export interface Todo {
  id: string
  wedding_id: string
  title: string
  description?: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  due_date?: string
  category?: string
  created_at: string
  updated_at: string
}

export interface Guest {
  id: string
  wedding_id: string
  name: string
  email?: string
  phone?: string
  rsvp_status: 'pending' | 'yes' | 'no'
  plus_ones: number
  dietary_restrictions?: string
  table_number?: number
  created_at: string
  updated_at: string
}

export interface CalendarEvent {
  id: string
  wedding_id: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  location?: string
  type: 'appointment' | 'deadline' | 'reminder' | 'ceremony'
  created_at: string
  updated_at: string
}

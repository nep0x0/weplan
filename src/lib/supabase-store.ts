import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types for our database tables
export interface UserProfile {
  id: string
  name: string | null
  avatar_url: string | null
  wedding_date: string | null
  partner_name: string | null
  venue: string | null
  created_at: string
  updated_at: string
}

export interface Wedding {
  id: string
  user_id: string
  title: string
  wedding_date: string | null
  venue: string | null
  budget_total: number
  guest_count: number
  created_at: string
  updated_at: string
}

export interface BudgetCategory {
  id: string
  wedding_id: string
  user_id: string
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
  user_id: string
  title: string
  description: string | null
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  category: string | null
  created_at: string
  updated_at: string
}

export interface Guest {
  id: string
  wedding_id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  rsvp_status: 'pending' | 'yes' | 'no'
  plus_ones: number
  dietary_restrictions: string | null
  table_number: number | null
  created_at: string
  updated_at: string
}

export interface CalendarEvent {
  id: string
  wedding_id: string
  user_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  location: string | null
  type: 'ceremony' | 'appointment' | 'deadline' | 'reminder'
  created_at: string
  updated_at: string
}

// Supabase Database Service
export class SupabaseService {
  // User Profile methods
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    
    return data
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }
    
    return data
  }

  // Wedding methods
  static async getUserWeddings(userId: string): Promise<Wedding[]> {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching weddings:', error)
      return []
    }
    
    return data || []
  }

  static async getDefaultWedding(userId: string): Promise<Wedding | null> {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()
    
    if (error) {
      console.error('Error fetching default wedding:', error)
      return null
    }
    
    return data
  }

  // Budget Categories methods
  static async getBudgetCategories(weddingId: string): Promise<BudgetCategory[]> {
    const { data, error } = await supabase
      .from('budget_categories')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching budget categories:', error)
      return []
    }
    
    return data || []
  }

  static async createBudgetCategory(category: Omit<BudgetCategory, 'id' | 'created_at' | 'updated_at'>): Promise<BudgetCategory | null> {
    const { data, error } = await supabase
      .from('budget_categories')
      .insert([category])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating budget category:', error)
      return null
    }
    
    return data
  }

  static async updateBudgetCategory(id: string, updates: Partial<BudgetCategory>): Promise<BudgetCategory | null> {
    const { data, error } = await supabase
      .from('budget_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating budget category:', error)
      return null
    }
    
    return data
  }

  static async deleteBudgetCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('budget_categories')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting budget category:', error)
      return false
    }
    
    return true
  }

  // Todos methods
  static async getTodos(weddingId: string): Promise<Todo[]> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching todos:', error)
      return []
    }
    
    return data || []
  }

  static async createTodo(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>): Promise<Todo | null> {
    const { data, error } = await supabase
      .from('todos')
      .insert([todo])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating todo:', error)
      return null
    }
    
    return data
  }

  static async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo | null> {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating todo:', error)
      return null
    }
    
    return data
  }

  static async deleteTodo(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting todo:', error)
      return false
    }
    
    return true
  }

  // Guests methods
  static async getGuests(weddingId: string): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching guests:', error)
      return []
    }
    
    return data || []
  }

  static async createGuest(guest: Omit<Guest, 'id' | 'created_at' | 'updated_at'>): Promise<Guest | null> {
    const { data, error } = await supabase
      .from('guests')
      .insert([guest])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating guest:', error)
      return null
    }
    
    return data
  }

  static async updateGuest(id: string, updates: Partial<Guest>): Promise<Guest | null> {
    const { data, error } = await supabase
      .from('guests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating guest:', error)
      return null
    }
    
    return data
  }

  static async deleteGuest(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting guest:', error)
      return false
    }
    
    return true
  }

  // Calendar Events methods
  static async getCalendarEvents(weddingId: string): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('start_date', { ascending: true })
    
    if (error) {
      console.error('Error fetching calendar events:', error)
      return []
    }
    
    return data || []
  }

  static async createCalendarEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>): Promise<CalendarEvent | null> {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([event])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating calendar event:', error)
      return null
    }
    
    return data
  }

  static async updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating calendar event:', error)
      return null
    }
    
    return data
  }

  static async deleteCalendarEvent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting calendar event:', error)
      return false
    }
    
    return true
  }
}

export { supabase }

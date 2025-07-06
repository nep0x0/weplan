import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Wedding, BudgetCategory, Todo, Guest, CalendarEvent } from './supabase'

interface User {
  id: string
  email: string
  name?: string
}

interface AppState {
  // Auth state
  user: User | null
  isLoading: boolean
  
  // Current wedding
  currentWedding: Wedding | null
  
  // Data
  budgetCategories: BudgetCategory[]
  todos: Todo[]
  guests: Guest[]
  calendarEvents: CalendarEvent[]
  
  // UI state
  activeTab: 'dashboard' | 'budget' | 'todos' | 'guests' | 'calendar'
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setCurrentWedding: (wedding: Wedding | null) => void
  setBudgetCategories: (categories: BudgetCategory[]) => void
  setTodos: (todos: Todo[]) => void
  setGuests: (guests: Guest[]) => void
  setCalendarEvents: (events: CalendarEvent[]) => void
  setActiveTab: (tab: 'dashboard' | 'budget' | 'todos' | 'guests' | 'calendar') => void
  
  // Helper actions
  addTodo: (todo: Todo) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  
  addGuest: (guest: Guest) => void
  updateGuest: (id: string, updates: Partial<Guest>) => void
  deleteGuest: (id: string) => void
  
  addBudgetCategory: (category: BudgetCategory) => void
  updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => void
  deleteBudgetCategory: (id: string) => void

  addCalendarEvent: (event: CalendarEvent) => void
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void
  deleteCalendarEvent: (id: string) => void
  
  // Computed values
  getTotalBudgetSpent: () => number
  getTotalBudgetAllocated: () => number
  getCompletedTodosCount: () => number
  getPendingTodosCount: () => number
  getConfirmedGuestsCount: () => number
  getPendingRSVPCount: () => number
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      currentWedding: null,
      budgetCategories: [],
      todos: [],
      guests: [],
      calendarEvents: [],
      activeTab: 'dashboard',
      
      // Actions
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setCurrentWedding: (currentWedding) => set({ currentWedding }),
      setBudgetCategories: (budgetCategories) => set({ budgetCategories }),
      setTodos: (todos) => set({ todos }),
      setGuests: (guests) => set({ guests }),
      setCalendarEvents: (calendarEvents) => set({ calendarEvents }),
      setActiveTab: (activeTab) => set({ activeTab }),
      
      // Todo actions
      addTodo: (todo) => set((state) => ({
        todos: [...state.todos, todo]
      })),
      
      updateTodo: (id, updates) => set((state) => ({
        todos: state.todos.map(todo => 
          todo.id === id ? { ...todo, ...updates } : todo
        )
      })),
      
      deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
      })),
      
      // Guest actions
      addGuest: (guest) => set((state) => ({
        guests: [...state.guests, guest]
      })),
      
      updateGuest: (id, updates) => set((state) => ({
        guests: state.guests.map(guest => 
          guest.id === id ? { ...guest, ...updates } : guest
        )
      })),
      
      deleteGuest: (id) => set((state) => ({
        guests: state.guests.filter(guest => guest.id !== id)
      })),
      
      // Budget actions
      addBudgetCategory: (category) => set((state) => ({
        budgetCategories: [...state.budgetCategories, category]
      })),
      
      updateBudgetCategory: (id, updates) => set((state) => ({
        budgetCategories: state.budgetCategories.map(category => 
          category.id === id ? { ...category, ...updates } : category
        )
      })),
      
      deleteBudgetCategory: (id) => set((state) => ({
        budgetCategories: state.budgetCategories.filter(category => category.id !== id)
      })),

      // Calendar actions
      addCalendarEvent: (event) => set((state) => ({
        calendarEvents: [...state.calendarEvents, event]
      })),

      updateCalendarEvent: (id, updates) => set((state) => ({
        calendarEvents: state.calendarEvents.map(event =>
          event.id === id ? { ...event, ...updates } : event
        )
      })),

      deleteCalendarEvent: (id) => set((state) => ({
        calendarEvents: state.calendarEvents.filter(event => event.id !== id)
      })),
      
      // Computed values
      getTotalBudgetSpent: () => {
        const { budgetCategories } = get()
        return budgetCategories.reduce((total, category) => total + category.spent_amount, 0)
      },
      
      getTotalBudgetAllocated: () => {
        const { budgetCategories } = get()
        return budgetCategories.reduce((total, category) => total + category.allocated_amount, 0)
      },
      
      getCompletedTodosCount: () => {
        const { todos } = get()
        return todos.filter(todo => todo.completed).length
      },
      
      getPendingTodosCount: () => {
        const { todos } = get()
        return todos.filter(todo => !todo.completed).length
      },
      
      getConfirmedGuestsCount: () => {
        const { guests } = get()
        return guests.filter(guest => guest.rsvp_status === 'yes').length
      },
      
      getPendingRSVPCount: () => {
        const { guests } = get()
        return guests.filter(guest => guest.rsvp_status === 'pending').length
      }
    }),
    {
      name: 'planwed-storage',
      partialize: (state) => ({
        user: state.user,
        currentWedding: state.currentWedding,
        activeTab: state.activeTab
      })
    }
  )
)

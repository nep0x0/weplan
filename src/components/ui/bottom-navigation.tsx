'use client'

import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { 
  Home, 
  DollarSign, 
  CheckSquare, 
  Users, 
  Calendar 
} from 'lucide-react'

const tabs = [
  {
    id: 'dashboard' as const,
    label: 'Home',
    icon: Home
  },
  {
    id: 'budget' as const,
    label: 'Budget',
    icon: DollarSign
  },
  {
    id: 'todos' as const,
    label: 'Tasks',
    icon: CheckSquare
  },
  {
    id: 'guests' as const,
    label: 'Guests',
    icon: Users
  },
  {
    id: 'calendar' as const,
    label: 'Calendar',
    icon: Calendar
  }
]

export function BottomNavigation() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all duration-200 haptic",
                isActive 
                  ? "text-primary bg-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "mb-1 transition-transform duration-200",
                  isActive && "scale-110"
                )} 
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// Desktop Sidebar Navigation
export function SidebarNavigation() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:h-full lg:bg-white lg:border-r lg:border-border lg:z-40">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">PlanWed</h1>
        <p className="text-sm text-muted-foreground mt-1">Wedding Planner</p>
      </div>
      
      <div className="flex-1 px-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 haptic",
                isActive 
                  ? "text-primary bg-accent border border-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-foreground">P</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Wedding Planner</p>
            <p className="text-xs text-muted-foreground">Plan your perfect day</p>
          </div>
        </div>
      </div>
    </nav>
  )
}

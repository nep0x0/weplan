'use client'

import { ReactNode } from 'react'
import { BottomNavigation, SidebarNavigation } from '@/components/ui/bottom-navigation'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: ReactNode
  className?: string
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <SidebarNavigation />
      
      {/* Main Content */}
      <main className={cn(
        "pb-20 lg:pb-0 lg:pl-64", // pb-20 for mobile bottom nav, lg:pl-64 for desktop sidebar
        className
      )}>
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border safe-area-top">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-lg font-semibold">PlanWed</h1>
              <p className="text-xs text-muted-foreground">Wedding Planner</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-foreground">P</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="native-scroll">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

// Page Container for consistent spacing
interface PageContainerProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: ReactNode
}

export function PageContainer({ 
  children, 
  className, 
  title, 
  subtitle, 
  action 
}: PageContainerProps) {
  return (
    <div className={cn("min-h-screen", className)}>
      {/* Desktop Header */}
      {(title || subtitle || action) && (
        <div className="hidden lg:block sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-border">
          <div className="container-proportional py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-text-safe">
                {title && <h1 className="text-responsive-xl font-semibold leading-comfortable">{title}</h1>}
                {subtitle && <p className="text-muted-foreground mt-1 text-responsive-sm leading-relaxed-mobile">{subtitle}</p>}
              </div>
              {action && <div className="flex-shrink-0">{action}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container-proportional space-y-proportional">
        {children}
      </div>
    </div>
  )
}

// Card Component for consistent styling
interface AppCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function AppCard({ children, className, onClick, hover = false }: AppCardProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-border card-proportional card-shadow overflow-hidden",
        hover && "transition-all duration-200 hover:card-shadow-lg hover:scale-[1.02]",
        onClick && "haptic cursor-pointer text-left w-full",
        className
      )}
    >
      <div className="flex-text-safe leading-comfortable">
        {children}
      </div>
    </Component>
  )
}

// Stats Card for dashboard
interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  color?: 'primary' | 'success' | 'warning' | 'muted'
  onClick?: () => void
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'muted',
  onClick 
}: StatsCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-accent border-primary/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-orange-600 bg-orange-50 border-orange-200',
    muted: 'text-muted-foreground bg-muted border-border'
  }
  
  return (
    <AppCard onClick={onClick} hover={!!onClick} className="text-center">
      {icon && (
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border",
          colorClasses[color]
        )}>
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </AppCard>
  )
}

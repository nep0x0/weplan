'use client'

import { useEffect } from 'react'
import { AppLayout, PageContainer, StatsCard } from '@/components/layout/app-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAppStore } from '@/lib/store'
import { useAuth } from '@/components/auth/auth-provider'
import {
  DollarSign,
  CheckSquare,
  Users,
  Calendar,
  Heart,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BudgetPage } from '@/components/budget/budget-page'
import { TodosPage } from '@/components/todos/todos-page'
import { GuestsPage } from '@/components/guests/guests-page'
import { CalendarPage } from '@/components/calendar/calendar-page'

export default function Home() {
  const { user } = useAuth()
  const {
    activeTab,
    budgetCategories,
    todos,
    guests,
    setBudgetCategories,
    setTodos,
    setGuests,
    getTotalBudgetSpent,
    getCompletedTodosCount,
    getPendingTodosCount,
    getConfirmedGuestsCount,
    getPendingRSVPCount
  } = useAppStore()

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      // TODO: Load real data from Supabase
      // For now, we'll show empty state until data is loaded
      console.log('User authenticated, should load data from Supabase:', user.email)
    }
  }, [user])

  // Real data from store (no mock data)
  const totalBudget = 100000000 // Default 100 million IDR budget
  const spentBudget = getTotalBudgetSpent()
  const budgetPercentage = totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0

  const completedTasks = getCompletedTodosCount()
  const pendingTasks = getPendingTodosCount()
  const totalTasks = completedTasks + pendingTasks

  const confirmedGuests = getConfirmedGuestsCount()
  const pendingRSVP = getPendingRSVPCount()
  const totalGuests = confirmedGuests + pendingRSVP

  // Calculate days to wedding (placeholder - should come from wedding date)
  const daysToWedding = 120 // This should be calculated from actual wedding date

  // Handle different tabs
  if (activeTab === 'budget') {
    return (
      <AppLayout>
        <BudgetPage />
      </AppLayout>
    )
  }

  if (activeTab === 'todos') {
    return (
      <AppLayout>
        <TodosPage />
      </AppLayout>
    )
  }

  if (activeTab === 'guests') {
    return (
      <AppLayout>
        <GuestsPage />
      </AppLayout>
    )
  }

  if (activeTab === 'calendar') {
    return (
      <AppLayout>
        <CalendarPage />
      </AppLayout>
    )
  }

  if (activeTab !== 'dashboard') {
    return (
      <AppLayout>
        <PageContainer
          title={String(activeTab).charAt(0).toUpperCase() + String(activeTab).slice(1)}
          subtitle={`Manage your wedding ${activeTab}`}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Coming Soon</h3>
              <p className="text-muted-foreground max-w-sm">
                This feature is being built with love. Check back soon!
              </p>
            </div>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  return (
    <ProtectedRoute>
      <AppLayout>
      <PageContainer>
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Welcome to PlanWed{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            {budgetCategories.length === 0 && todos.length === 0 && guests.length === 0
              ? "Let's start planning your perfect wedding day! Add your first budget, task, or guest to get started."
              : "Plan your perfect wedding day"
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Budget"
            value={spentBudget > 0 ? `${budgetPercentage}%` : "0%"}
            subtitle={spentBudget > 0 ? `Rp ${(spentBudget / 1000000).toFixed(0)}M used` : "No expenses yet"}
            icon={<DollarSign size={20} />}
            color="primary"
          />
          <StatsCard
            title="Tasks"
            value={totalTasks > 0 ? `${completedTasks}/${totalTasks}` : "0"}
            subtitle={totalTasks > 0 ? `${pendingTasks} pending` : "No tasks yet"}
            icon={<CheckSquare size={20} />}
            color={totalTasks === 0 ? 'muted' : (pendingTasks === 0 ? 'success' : 'warning')}
          />
          <StatsCard
            title="Guests"
            value={totalGuests > 0 ? confirmedGuests : "0"}
            subtitle={totalGuests > 0 ? `${totalGuests} invited` : "No guests yet"}
            icon={<Users size={20} />}
            color={totalGuests === 0 ? 'muted' : 'success'}
          />
          <StatsCard
            title="Days Left"
            value={daysToWedding}
            subtitle="Until wedding"
            icon={<Calendar size={20} />}
            color="muted"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <Button size="sm" variant="outline">
              <Plus size={16} className="mr-2" />
              Add New
            </Button>
          </div>

          <div className="grid gap-4">
            <div className="bg-white rounded-xl border border-border p-6 card-shadow">
              <h3 className="font-semibold mb-2">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-muted-foreground">Task completed: Order flowers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Budget updated: Photography</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-muted-foreground">Guest added: Mike Johnson</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6 card-shadow">
              <h3 className="font-semibold mb-2">Upcoming Deadlines</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>📋 Book photographer</span>
                  <span className="text-orange-600 font-medium">3 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🎂 Order wedding cake</span>
                  <span className="text-orange-600 font-medium">1 week</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>💐 Finalize decorations</span>
                  <span className="text-muted-foreground">2 weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
    </ProtectedRoute>
  )
}

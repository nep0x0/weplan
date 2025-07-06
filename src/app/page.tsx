'use client'

import { AppLayout, PageContainer, StatsCard } from '@/components/layout/app-layout'
import { useAppStore } from '@/lib/store'
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
  const {
    activeTab,
    getTotalBudgetSpent,
    getTotalBudgetAllocated,
    getCompletedTodosCount,
    getPendingTodosCount,
    getConfirmedGuestsCount,
    getPendingRSVPCount
  } = useAppStore()

  // Mock data for demo
  const totalBudget = 70000000 // 70 million IDR
  const spentBudget = getTotalBudgetSpent() || 50000000 // 50 million IDR
  const budgetPercentage = Math.round((spentBudget / totalBudget) * 100)

  const completedTasks = getCompletedTodosCount() || 7
  const pendingTasks = getPendingTodosCount() || 8

  const confirmedGuests = getConfirmedGuestsCount() || 30
  const totalGuests = confirmedGuests + getPendingRSVPCount() || 45

  const daysToWedding = 120

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
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
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
    <AppLayout>
      <PageContainer>
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Wedding Planner</h1>
          <p className="text-muted-foreground">
            Plan your perfect wedding day
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Budget"
            value={`${budgetPercentage}%`}
            subtitle={`Rp ${(spentBudget / 1000000).toFixed(0)}M used`}
            icon={<DollarSign size={20} />}
            color="primary"
          />
          <StatsCard
            title="Tasks"
            value={`${completedTasks}/${completedTasks + pendingTasks}`}
            subtitle={`${pendingTasks} pending`}
            icon={<CheckSquare size={20} />}
            color={pendingTasks === 0 ? 'success' : 'warning'}
          />
          <StatsCard
            title="Guests"
            value={confirmedGuests}
            subtitle={`${totalGuests} invited`}
            icon={<Users size={20} />}
            color="success"
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
  )
}

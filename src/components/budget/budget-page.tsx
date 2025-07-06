'use client'

import { useState } from 'react'
import { PageContainer, AppCard } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  PieChart,
  Edit,
  Trash2
} from 'lucide-react'
import { BudgetCategoryForm } from './budget-category-form'
import { BudgetProgress } from './budget-progress'

export function BudgetPage() {
  const { 
    budgetCategories, 
    getTotalBudgetSpent, 
    getTotalBudgetAllocated,
    deleteBudgetCategory 
  } = useAppStore()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)



  // Mock data for demo if no categories exist
  const mockCategories = budgetCategories.length === 0 ? [
    {
      id: '1',
      wedding_id: 'demo',
      name: 'Venue',
      allocated_amount: 20000000,
      spent_amount: 18000000,
      color: '#E11D48',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      wedding_id: 'demo',
      name: 'Catering',
      allocated_amount: 15000000,
      spent_amount: 12000000,
      color: '#059669',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      wedding_id: 'demo',
      name: 'Photography',
      allocated_amount: 8000000,
      spent_amount: 8000000,
      color: '#3B82F6',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      wedding_id: 'demo',
      name: 'Decoration',
      allocated_amount: 5000000,
      spent_amount: 3000000,
      color: '#F59E0B',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] : budgetCategories

  const displayTotalAllocated = mockCategories.reduce((sum, cat) => sum + cat.allocated_amount, 0)
  const displayTotalSpent = mockCategories.reduce((sum, cat) => sum + cat.spent_amount, 0)
  const displaySpentPercentage = displayTotalAllocated > 0 ? Math.round((displayTotalSpent / displayTotalAllocated) * 100) : 0



  const formatShortCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(0)}M`
    }
    if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)}K`
    }
    return `Rp ${amount}`
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this budget category?')) {
      deleteBudgetCategory(id)
    }
  }

  return (
    <PageContainer
      title="Budget"
      subtitle="Track your wedding expenses"
      action={
        <Button onClick={() => setShowAddForm(true)} size="sm">
          <Plus size={16} className="mr-2" />
          Add Category
        </Button>
      }
    >
      {/* Budget Overview */}
      <div className="space-y-6">
        {/* Total Budget Card */}
        <AppCard className="text-center">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-primary">{displaySpentPercentage}%</h2>
              <p className="text-muted-foreground">Budget Used</p>
            </div>
            
            <BudgetProgress 
              spent={displayTotalSpent} 
              allocated={displayTotalAllocated}
              className="max-w-xs mx-auto"
            />
            
            <div className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{formatShortCurrency(displayTotalSpent)}</p>
                <p className="text-muted-foreground">Spent</p>
              </div>
              <div>
                <p className="font-medium">{formatShortCurrency(displayTotalAllocated)}</p>
                <p className="text-muted-foreground">Budget</p>
              </div>
            </div>
          </div>
        </AppCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign size={20} className="text-primary" />
            </div>
            <p className="text-lg font-semibold">{formatShortCurrency(displayTotalAllocated)}</p>
            <p className="text-xs text-muted-foreground">Total Budget</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp size={20} className="text-success" />
            </div>
            <p className="text-lg font-semibold">{formatShortCurrency(displayTotalSpent)}</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <PieChart size={20} className="text-orange-600" />
            </div>
            <p className="text-lg font-semibold">{formatShortCurrency(displayTotalAllocated - displayTotalSpent)}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </AppCard>
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Categories</h3>
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
              <Plus size={16} className="mr-2" />
              Add
            </Button>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {mockCategories.map((category) => {
              const categoryPercentage = category.allocated_amount > 0 
                ? Math.round((category.spent_amount / category.allocated_amount) * 100) 
                : 0
              
              return (
                <AppCard key={category.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <h4 className="font-medium">{category.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCategory(category.id)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{formatShortCurrency(category.spent_amount)}</span>
                      <span className="text-muted-foreground">
                        {formatShortCurrency(category.allocated_amount)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(categoryPercentage, 100)}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{categoryPercentage}% used</span>
                      <span>
                        {formatShortCurrency(category.allocated_amount - category.spent_amount)} left
                      </span>
                    </div>
                  </div>
                </AppCard>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add/Edit Category Form Modal */}
      {(showAddForm || editingCategory) && (
        <BudgetCategoryForm
          categoryId={editingCategory}
          onClose={() => {
            setShowAddForm(false)
            setEditingCategory(null)
          }}
        />
      )}
    </PageContainer>
  )
}

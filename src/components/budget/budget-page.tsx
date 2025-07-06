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
    deleteBudgetCategory
  } = useAppStore()

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)

  // Use real data only
  const displayTotalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated_amount, 0)
  const displayTotalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent_amount, 0)
  const displaySpentPercentage = displayTotalAllocated > 0 ? Math.round((displayTotalSpent / displayTotalAllocated) * 100) : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatShortCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)}K`
    }
    return formatCurrency(amount)
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign size={20} className="text-primary" />
            </div>
            <p className="text-lg font-semibold">{formatShortCurrency(displayTotalAllocated)}</p>
            <p className="text-xs text-muted-foreground">Total Budget</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp size={20} className="text-orange-600" />
            </div>
            <p className="text-lg font-semibold">{formatShortCurrency(displayTotalSpent)}</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <PieChart size={20} className="text-green-600" />
            </div>
            <p className="text-lg font-semibold">{displaySpentPercentage}%</p>
            <p className="text-xs text-muted-foreground">Budget Used</p>
          </AppCard>
        </div>

        {/* Budget Progress */}
        {displayTotalAllocated > 0 && (
          <AppCard>
            <h3 className="font-semibold mb-4">Budget Overview</h3>
            <BudgetProgress
              spent={displayTotalSpent}
              allocated={displayTotalAllocated}
              showPercentage={true}
              size="lg"
            />
          </AppCard>
        )}

        {/* Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Budget Categories</h3>
            <Button onClick={() => setShowAddForm(true)} size="sm">
              <Plus size={16} className="mr-2" />
              Add Category
            </Button>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {budgetCategories.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Budget Categories Yet</h3>
                <p className="text-gray-600 mb-4">Start planning your wedding budget by adding your first category.</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
                  <Plus size={16} className="mr-2" />
                  Add Your First Category
                </Button>
              </div>
            ) : (
              budgetCategories.map((category) => {
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
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(category.spent_amount)} of {formatCurrency(category.allocated_amount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{categoryPercentage}%</span>
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
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(categoryPercentage, 100)}%`,
                          backgroundColor: category.color 
                        }}
                      />
                    </div>
                  </AppCard>
                )
              })
            )}
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

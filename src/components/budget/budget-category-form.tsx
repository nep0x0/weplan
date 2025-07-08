'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { X } from 'lucide-react'
import type { BudgetCategory } from '@/lib/supabase'

interface BudgetCategoryFormProps {
  categoryId?: string | null
  onClose: () => void
}

const predefinedCategories = [
  { name: 'Venue', color: '#E11D48' },
  { name: 'Catering', color: '#059669' },
  { name: 'Photography', color: '#3B82F6' },
  { name: 'Videography', color: '#8B5CF6' },
  { name: 'Decoration', color: '#F59E0B' },
  { name: 'Flowers', color: '#EC4899' },
  { name: 'Music & Entertainment', color: '#10B981' },
  { name: 'Transportation', color: '#6366F1' },
  { name: 'Wedding Dress', color: '#F97316' },
  { name: 'Rings', color: '#84CC16' },
  { name: 'Invitations', color: '#06B6D4' },
  { name: 'Honeymoon', color: '#EF4444' }
]

const colorOptions = [
  '#E11D48', '#059669', '#3B82F6', '#8B5CF6',
  '#F59E0B', '#EC4899', '#10B981', '#6366F1',
  '#F97316', '#84CC16', '#06B6D4', '#EF4444'
]

export function BudgetCategoryForm({ categoryId, onClose }: BudgetCategoryFormProps) {
  const { budgetCategories, addBudgetCategory, updateBudgetCategory } = useAppStore()
  
  const [formData, setFormData] = useState({
    name: '',
    allocated_amount: '',
    spent_amount: '',
    color: '#E11D48'
  })
  
  const [showPredefined, setShowPredefined] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!categoryId
  const existingCategory = isEditing 
    ? budgetCategories.find(cat => cat.id === categoryId)
    : null

  useEffect(() => {
    if (existingCategory) {
      setFormData({
        name: existingCategory.name,
        allocated_amount: existingCategory.allocated_amount.toString(),
        spent_amount: existingCategory.spent_amount.toString(),
        color: existingCategory.color
      })
      setShowPredefined(false)
    }
  }, [existingCategory])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }
    
    if (!formData.allocated_amount || parseFloat(formData.allocated_amount) <= 0) {
      newErrors.allocated_amount = 'Budget amount must be greater than 0'
    }
    
    if (formData.spent_amount && parseFloat(formData.spent_amount) < 0) {
      newErrors.spent_amount = 'Spent amount cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const categoryData: Omit<BudgetCategory, 'id' | 'created_at' | 'updated_at'> = {
      wedding_id: 'demo', // Will be replaced with actual wedding ID
      name: formData.name.trim(),
      allocated_amount: parseFloat(formData.allocated_amount),
      spent_amount: parseFloat(formData.spent_amount) || 0,
      color: formData.color
    }

    if (isEditing && categoryId) {
      updateBudgetCategory(categoryId, categoryData)
    } else {
      const newCategory: BudgetCategory = {
        ...categoryData,
        id: Date.now().toString(), // Temporary ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      addBudgetCategory(newCategory)
    }

    onClose()
  }

  const handlePredefinedSelect = (category: typeof predefinedCategories[0]) => {
    setFormData(prev => ({
      ...prev,
      name: category.name,
      color: category.color
    }))
    setShowPredefined(false)
  }

  const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/[^\d]/g, ''))
    if (isNaN(number)) return ''
    return number.toLocaleString('id-ID')
  }

  const handleAmountChange = (field: 'allocated_amount' | 'spent_amount', value: string) => {
    const numericValue = value.replace(/[^\d]/g, '')
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center pb-20 sm:pb-0">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[calc(85vh-5rem)] sm:max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Edit Category' : 'Add Budget Category'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Predefined Categories */}
          {showPredefined && !isEditing && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Quick Select</h3>
              <div className="grid grid-cols-2 gap-2">
                {predefinedCategories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => handlePredefinedSelect(category)}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPredefined(false)}
                >
                  Or create custom category
                </Button>
              </div>
            </div>
          )}

          {/* Custom Form */}
          {(!showPredefined || isEditing) && (
            <div className="space-y-4">
              {/* Category Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Venue, Catering, Photography"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Budget Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    value={formatCurrency(formData.allocated_amount)}
                    onChange={(e) => handleAmountChange('allocated_amount', e.target.value)}
                    placeholder="0"
                    className={`pl-10 ${errors.allocated_amount ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.allocated_amount && (
                  <p className="text-sm text-red-500">{errors.allocated_amount}</p>
                )}
              </div>

              {/* Spent Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Spent (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    value={formatCurrency(formData.spent_amount)}
                    onChange={(e) => handleAmountChange('spent_amount', e.target.value)}
                    placeholder="0"
                    className={`pl-10 ${errors.spent_amount ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.spent_amount && (
                  <p className="text-sm text-red-500">{errors.spent_amount}</p>
                )}
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color 
                          ? 'border-foreground scale-110' 
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {(!showPredefined || isEditing) && (
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {isEditing ? 'Update' : 'Add'} Category
              </Button>
            </div>
          )}
          </form>
        </div>

        {/* Mobile Bottom Padding for Safe Area */}
        <div className="h-4 sm:h-0 flex-shrink-0" />
      </div>
    </div>
  )
}

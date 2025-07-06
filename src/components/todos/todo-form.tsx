'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { X, Calendar, AlertTriangle, Clock, Circle } from 'lucide-react'
import { format } from 'date-fns'
import type { Todo } from '@/lib/supabase'

interface TodoFormProps {
  todoId?: string | null
  onClose: () => void
}

const predefinedTasks = [
  { title: 'Book wedding venue', category: 'Venue', priority: 'high' as const },
  { title: 'Send wedding invitations', category: 'Invitations', priority: 'high' as const },
  { title: 'Order wedding cake', category: 'Catering', priority: 'medium' as const },
  { title: 'Choose wedding dress', category: 'Attire', priority: 'high' as const },
  { title: 'Book photographer', category: 'Photography', priority: 'high' as const },
  { title: 'Order wedding flowers', category: 'Decoration', priority: 'medium' as const },
  { title: 'Plan honeymoon', category: 'Honeymoon', priority: 'low' as const },
  { title: 'Book wedding band/DJ', category: 'Entertainment', priority: 'medium' as const },
  { title: 'Order wedding rings', category: 'Jewelry', priority: 'high' as const },
  { title: 'Plan rehearsal dinner', category: 'Events', priority: 'medium' as const },
  { title: 'Book transportation', category: 'Transportation', priority: 'low' as const },
  { title: 'Finalize guest list', category: 'Planning', priority: 'high' as const }
]

const categories = [
  'Venue', 'Catering', 'Photography', 'Decoration', 'Invitations', 
  'Attire', 'Entertainment', 'Transportation', 'Honeymoon', 'Planning', 
  'Jewelry', 'Events'
]

export function TodoForm({ todoId, onClose }: TodoFormProps) {
  const { todos, addTodo, updateTodo } = useAppStore()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    due_date: '',
    category: ''
  })
  
  const [showPredefined, setShowPredefined] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!todoId
  const existingTodo = isEditing 
    ? todos.find(todo => todo.id === todoId)
    : null

  useEffect(() => {
    if (existingTodo) {
      setFormData({
        title: existingTodo.title,
        description: existingTodo.description || '',
        priority: existingTodo.priority,
        due_date: existingTodo.due_date || '',
        category: existingTodo.category || ''
      })
      setShowPredefined(false)
    }
  }, [existingTodo])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const todoData: Omit<Todo, 'id' | 'created_at' | 'updated_at'> = {
      wedding_id: 'demo', // Will be replaced with actual wedding ID
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      completed: false,
      priority: formData.priority,
      due_date: formData.due_date || undefined,
      category: formData.category || undefined
    }

    if (isEditing && todoId) {
      updateTodo(todoId, todoData)
    } else {
      const newTodo: Todo = {
        ...todoData,
        id: Date.now().toString(), // Temporary ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      addTodo(newTodo)
    }

    onClose()
  }

  const handlePredefinedSelect = (task: typeof predefinedTasks[0]) => {
    setFormData(prev => ({
      ...prev,
      title: task.title,
      category: task.category,
      priority: task.priority
    }))
    setShowPredefined(false)
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-600" />
      case 'medium':
        return <Clock size={16} className="text-orange-600" />
      case 'low':
        return <Circle size={16} className="text-blue-600" />
      default:
        return <Circle size={16} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-700'
      case 'medium':
        return 'border-orange-200 bg-orange-50 text-orange-700'
      case 'low':
        return 'border-blue-200 bg-blue-50 text-blue-700'
      default:
        return 'border-border bg-background'
    }
  }

  // Get tomorrow's date as default
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowString = format(tomorrow, 'yyyy-MM-dd')

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end lg:items-center justify-center p-4">
      <div className="bg-white rounded-t-xl lg:rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Predefined Tasks */}
          {showPredefined && !isEditing && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Quick Select</h3>
              <div className="grid gap-2">
                {predefinedTasks.map((task, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePredefinedSelect(task)}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(task.priority)}
                      <span className="text-xs capitalize">{task.priority}</span>
                    </div>
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
                  Or create custom task
                </Button>
              </div>
            </div>
          )}

          {/* Custom Form */}
          {(!showPredefined || isEditing) && (
            <div className="space-y-4">
              {/* Task Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Task Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Book wedding venue"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add more details about this task..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as const).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority }))}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                        formData.priority === priority
                          ? getPriorityColor(priority)
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {getPriorityIcon(priority)}
                      <span className="text-sm capitalize font-medium">{priority}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date (Optional)</label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                    className="pl-10"
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, due_date: format(new Date(), 'yyyy-MM-dd') }))}
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, due_date: tomorrowString }))}
                  >
                    Tomorrow
                  </Button>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category (Optional)</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
                {isEditing ? 'Update' : 'Add'} Task
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

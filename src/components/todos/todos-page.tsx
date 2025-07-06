'use client'

import { useState } from 'react'
import { PageContainer, AppCard } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { TodoForm } from './todo-form'
import { TodoItem } from './todo-item'
import { isToday, isPast, parseISO } from 'date-fns'

type FilterType = 'all' | 'pending' | 'completed' | 'overdue' | 'today'
type SortType = 'priority' | 'dueDate' | 'created'

export function TodosPage() {
  const {
    todos,
    updateTodo,
    deleteTodo
  } = useAppStore()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('priority')

  // Mock data for demo if no todos exist
  const mockTodos = todos.length === 0 ? [
    {
      id: '1',
      wedding_id: 'demo',
      title: 'Book wedding venue',
      description: 'Research and book the perfect venue for our special day',
      completed: false,
      priority: 'high' as const,
      due_date: '2024-12-15',
      category: 'Venue',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      wedding_id: 'demo',
      title: 'Send wedding invitations',
      description: 'Design and send invitations to all guests',
      completed: false,
      priority: 'high' as const,
      due_date: '2024-12-20',
      category: 'Invitations',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      wedding_id: 'demo',
      title: 'Order wedding flowers',
      description: 'Choose and order bridal bouquet and decorations',
      completed: true,
      priority: 'medium' as const,
      due_date: '2024-12-10',
      category: 'Decoration',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      wedding_id: 'demo',
      title: 'Wedding cake tasting',
      description: 'Schedule cake tasting with 3 different bakeries',
      completed: false,
      priority: 'medium' as const,
      due_date: '2024-12-08',
      category: 'Catering',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      wedding_id: 'demo',
      title: 'Plan honeymoon trip',
      description: 'Research destinations and book flights',
      completed: false,
      priority: 'low' as const,
      due_date: '2025-01-15',
      category: 'Honeymoon',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] : todos

  const completedCount = mockTodos.filter(todo => todo.completed).length
  const pendingCount = mockTodos.filter(todo => !todo.completed).length
  const overdueCount = mockTodos.filter(todo => 
    !todo.completed && todo.due_date && isPast(parseISO(todo.due_date))
  ).length
  const todayCount = mockTodos.filter(todo => 
    !todo.completed && todo.due_date && isToday(parseISO(todo.due_date))
  ).length

  // Filter and sort todos
  const filteredTodos = mockTodos
    .filter(todo => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!todo.title.toLowerCase().includes(query) && 
            !todo.description?.toLowerCase().includes(query) &&
            !todo.category?.toLowerCase().includes(query)) {
          return false
        }
      }

      // Status filter
      switch (activeFilter) {
        case 'completed':
          return todo.completed
        case 'pending':
          return !todo.completed
        case 'overdue':
          return !todo.completed && todo.due_date && isPast(parseISO(todo.due_date))
        case 'today':
          return !todo.completed && todo.due_date && isToday(parseISO(todo.due_date))
        default:
          return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'dueDate':
          if (!a.due_date && !b.due_date) return 0
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  const handleToggleComplete = (id: string) => {
    const todo = mockTodos.find(t => t.id === id)
    if (todo) {
      updateTodo(id, { completed: !todo.completed })
    }
  }

  const handleDeleteTodo = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTodo(id)
    }
  }



  const filters = [
    { key: 'all' as const, label: 'All', count: mockTodos.length },
    { key: 'pending' as const, label: 'Pending', count: pendingCount },
    { key: 'completed' as const, label: 'Completed', count: completedCount },
    { key: 'overdue' as const, label: 'Overdue', count: overdueCount },
    { key: 'today' as const, label: 'Today', count: todayCount }
  ]

  return (
    <PageContainer
      title="Tasks"
      subtitle="Manage your wedding to-do list"
      action={
        <Button onClick={() => setShowAddForm(true)} size="sm">
          <Plus size={16} className="mr-2" />
          Add Task
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={20} className="text-primary" />
            </div>
            <p className="text-lg font-semibold">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Circle size={20} className="text-orange-600" />
            </div>
            <p className="text-lg font-semibold">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <p className="text-lg font-semibold">{overdueCount}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock size={20} className="text-blue-600" />
            </div>
            <p className="text-lg font-semibold">{todayCount}</p>
            <p className="text-xs text-muted-foreground">Due Today</p>
          </AppCard>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-responsive-xs font-medium whitespace-nowrap transition-all min-w-0 flex-shrink-0 ${
                  activeFilter === filter.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <span className="truncate">
                  {filter.label}
                </span>
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium flex-shrink-0 ${
                  activeFilter === filter.key
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-background text-foreground'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="text-sm bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="created">Created</option>
            </select>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <AppCard className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || activeFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first wedding task'
                }
              </p>
              {!searchQuery && activeFilter === 'all' && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Your First Task
                </Button>
              )}
            </AppCard>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onEdit={() => setEditingTodo(todo.id)}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Todo Form Modal */}
      {(showAddForm || editingTodo) && (
        <TodoForm
          todoId={editingTodo}
          onClose={() => {
            setShowAddForm(false)
            setEditingTodo(null)
          }}
        />
      )}
    </PageContainer>
  )
}

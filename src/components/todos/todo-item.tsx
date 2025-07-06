'use client'

import { useState } from 'react'
import { AppCard } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  Circle, 
  Calendar,
  Edit,
  Trash2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Todo } from '@/lib/supabase'

interface TodoItemProps {
  todo: Todo
  onToggleComplete: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggleComplete, onEdit, onDelete }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDueDate = (dateString: string) => {
    const date = parseISO(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM d, yyyy')
  }

  const getDueDateColor = (dateString: string, completed: boolean) => {
    if (completed) return 'text-muted-foreground'
    const date = parseISO(dateString)
    if (isPast(date)) return 'text-red-600'
    if (isToday(date)) return 'text-orange-600'
    return 'text-muted-foreground'
  }

  const getDueDateIcon = (dateString: string, completed: boolean) => {
    if (completed) return <Calendar size={14} />
    const date = parseISO(dateString)
    if (isPast(date)) return <AlertTriangle size={14} />
    if (isToday(date)) return <Clock size={14} />
    return <Calendar size={14} />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-orange-500'
      case 'low':
        return 'bg-blue-500'
      default:
        return 'bg-muted-foreground'
    }
  }

  return (
    <AppCard className={cn(
      "transition-all duration-200 hover:shadow-md",
      todo.completed && "opacity-75"
    )}>
      <div className="space-y-3">
        {/* Main Content */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(todo.id)}
            className="mt-0.5 haptic transition-transform hover:scale-110"
          >
            {todo.completed ? (
              <CheckCircle2 size={20} className="text-success" />
            ) : (
              <Circle size={20} className="text-muted-foreground hover:text-primary" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0 flex-text-safe">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 flex-text-safe">
                {/* Title */}
                <h3 className={cn(
                  "font-medium text-responsive-sm leading-comfortable",
                  todo.completed && "line-through text-muted-foreground"
                )}>
                  {todo.title}
                </h3>

                {/* Meta Info */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {/* Priority Indicator */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className={cn("w-2 h-2 rounded-full", getPriorityDot(todo.priority))} />
                    <span className="text-responsive-xs text-muted-foreground capitalize">
                      {todo.priority}
                    </span>
                  </div>

                  {/* Due Date */}
                  {todo.due_date && (
                    <div className={cn(
                      "flex items-center gap-1 text-xs",
                      getDueDateColor(todo.due_date, todo.completed)
                    )}>
                      {getDueDateIcon(todo.due_date, todo.completed)}
                      <span>{formatDueDate(todo.due_date)}</span>
                    </div>
                  )}

                  {/* Category */}
                  {todo.category && (
                    <span className="text-xs text-muted-foreground">
                      {todo.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {/* Expand Button */}
                {todo.description && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-6 w-6 p-0"
                  >
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </Button>
                )}

                {/* Edit Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(todo.id)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit size={14} />
                </Button>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(todo.id)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Description */}
        {isExpanded && todo.description && (
          <div className="ml-8 pl-3 border-l-2 border-muted">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {todo.description}
            </p>
          </div>
        )}

        {/* Priority Badge (for high priority items) */}
        {todo.priority === 'high' && !todo.completed && (
          <div className="ml-8">
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
              getPriorityColor(todo.priority)
            )}>
              <AlertTriangle size={12} />
              High Priority
            </span>
          </div>
        )}

        {/* Overdue Warning */}
        {!todo.completed && todo.due_date && isPast(parseISO(todo.due_date)) && (
          <div className="ml-8">
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-sm text-red-700 font-medium">
                This task is overdue
              </span>
            </div>
          </div>
        )}

        {/* Due Today Highlight */}
        {!todo.completed && todo.due_date && isToday(parseISO(todo.due_date)) && (
          <div className="ml-8">
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
              <Clock size={16} className="text-orange-600" />
              <span className="text-sm text-orange-700 font-medium">
                Due today
              </span>
            </div>
          </div>
        )}
      </div>
    </AppCard>
  )
}

'use client'

import { useState } from 'react'
import { AppCard } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { format, parseISO, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/lib/supabase'

interface EventItemProps {
  event: CalendarEvent
  compact?: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function EventItem({ event, compact = false, onEdit, onDelete }: EventItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const startDate = parseISO(event.start_date)
  const endDate = event.end_date ? parseISO(event.end_date) : null

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'ceremony':
        return <Users size={16} className="text-primary" />
      case 'appointment':
        return <CalendarIcon size={16} className="text-blue-600" />
      case 'deadline':
        return <AlertTriangle size={16} className="text-orange-600" />
      case 'reminder':
        return <Clock size={16} className="text-purple-600" />
      default:
        return <CalendarIcon size={16} className="text-muted-foreground" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'ceremony':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'appointment':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'deadline':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'reminder':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'ceremony':
        return 'Ceremony'
      case 'appointment':
        return 'Appointment'
      case 'deadline':
        return 'Deadline'
      case 'reminder':
        return 'Reminder'
      default:
        return 'Event'
    }
  }

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a')
  }

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy')
  }

  const formatDateTime = (date: Date) => {
    return format(date, 'MMM d, yyyy • h:mm a')
  }

  const getTimeDisplay = () => {
    if (event.type === 'deadline') {
      return `Due: ${formatDateTime(startDate)}`
    }
    
    if (endDate && !isSameDay(startDate, endDate)) {
      return `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`
    }
    
    if (endDate) {
      return `${formatDate(startDate)} • ${formatTime(startDate)} - ${formatTime(endDate)}`
    }
    
    return formatDateTime(startDate)
  }

  const hasDetails = event.description || event.location

  if (compact) {
    return (
      <div className="group p-3 border border-border rounded-lg hover:bg-muted/50 transition-all">
        <div className="flex items-start gap-2">
          {/* Event Type Icon */}
          <div className="mt-0.5">
            {getEventTypeIcon(event.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-tight truncate">
              {event.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {formatTime(startDate)}
              {endDate && ` - ${formatTime(endDate)}`}
            </p>
            {event.location && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {event.location}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(event.id)}
              className="h-6 w-6 p-0"
            >
              <Edit size={12} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(event.id)}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AppCard className="group hover:shadow-md transition-all duration-200">
      <div className="space-y-3">
        {/* Main Content */}
        <div className="flex items-start gap-3">
          {/* Event Type Badge */}
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 mt-0.5",
            getEventTypeColor(event.type)
          )}>
            {getEventTypeIcon(event.type)}
            <span>{getEventTypeLabel(event.type)}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="font-medium text-sm leading-tight">
                  {event.title}
                </h3>

                {/* Time */}
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {getTimeDisplay()}
                  </span>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {event.location}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {/* Expand Button */}
                {hasDetails && (
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
                  onClick={() => onEdit(event.id)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit size={14} />
                </Button>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(event.id)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Description */}
        {isExpanded && event.description && (
          <div className="ml-8 pl-3 border-l-2 border-muted">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>
        )}

        {/* Deadline Warning */}
        {event.type === 'deadline' && (
          <div className="ml-8">
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle size={16} className="text-orange-600" />
              <span className="text-sm text-orange-700 font-medium">
                Deadline: {formatDate(startDate)}
              </span>
            </div>
          </div>
        )}

        {/* Ceremony Highlight */}
        {event.type === 'ceremony' && (
          <div className="ml-8">
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <Users size={16} className="text-primary" />
              <span className="text-sm text-primary font-medium">
                Wedding Event
              </span>
            </div>
          </div>
        )}
      </div>
    </AppCard>
  )
}

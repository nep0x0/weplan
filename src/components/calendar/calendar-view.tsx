'use client'

import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isSameDay,
  parseISO
} from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { CalendarEvent } from '@/lib/supabase'

interface CalendarViewProps {
  currentDate: Date
  events: CalendarEvent[]
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onAddEvent: (date: Date) => void
}

export function CalendarView({ 
  currentDate, 
  events, 
  selectedDate, 
  onDateSelect, 
  onAddEvent 
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.start_date), date)
    )
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'ceremony':
        return 'bg-primary'
      case 'appointment':
        return 'bg-blue-500'
      case 'deadline':
        return 'bg-orange-500'
      case 'reminder':
        return 'bg-purple-500'
      default:
        return 'bg-muted-foreground'
    }
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-4">
      {/* Week Headers */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[80px] p-1 border border-border rounded-lg transition-all cursor-pointer hover:bg-muted/50",
                !isCurrentMonth && "opacity-40",
                isSelected && "ring-2 ring-primary bg-accent",
                isCurrentDay && "bg-primary/5 border-primary/30"
              )}
              onClick={() => onDateSelect(day)}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-sm font-medium",
                  isCurrentDay && "text-primary font-semibold",
                  !isCurrentMonth && "text-muted-foreground"
                )}>
                  {format(day, 'd')}
                </span>
                
                {/* Add Event Button (on hover) */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddEvent(day)
                  }}
                >
                  <Plus size={12} />
                </Button>
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-xs px-1 py-0.5 rounded text-white truncate",
                      getEventTypeColor(event.type)
                    )}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                
                {/* More events indicator */}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-xs text-muted-foreground">Ceremony</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-muted-foreground">Appointment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-xs text-muted-foreground">Deadline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-xs text-muted-foreground">Reminder</span>
        </div>
      </div>
    </div>
  )
}

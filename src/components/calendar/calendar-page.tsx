'use client'

import { useState } from 'react'
import { PageContainer, AppCard } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3X3
} from 'lucide-react'
import { CalendarView } from './calendar-view'
import { EventForm } from './event-form'
import { EventItem } from './event-item'
import { parseISO, isSameDay } from 'date-fns'

type ViewType = 'month' | 'list'
type FilterType = 'all' | 'appointment' | 'deadline' | 'reminder' | 'ceremony'

export function CalendarPage() {
  const { calendarEvents, deleteCalendarEvent } = useAppStore()
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>('month')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Mock data for demo if no events exist
  const mockEvents = calendarEvents.length === 0 ? [
    {
      id: '1',
      wedding_id: 'demo',
      title: 'Wedding Day',
      description: 'The big day! Ceremony and reception',
      start_date: '2025-06-15T14:00:00Z',
      end_date: '2025-06-15T23:00:00Z',
      location: 'Grand Ballroom Hotel',
      type: 'ceremony' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      wedding_id: 'demo',
      title: 'Venue Visit',
      description: 'Final venue walkthrough with coordinator',
      start_date: '2024-12-20T10:00:00Z',
      end_date: '2024-12-20T12:00:00Z',
      location: 'Grand Ballroom Hotel',
      type: 'appointment' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      wedding_id: 'demo',
      title: 'Cake Tasting',
      description: 'Taste and finalize wedding cake design',
      start_date: '2024-12-18T15:00:00Z',
      end_date: '2024-12-18T17:00:00Z',
      location: 'Sweet Dreams Bakery',
      type: 'appointment' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      wedding_id: 'demo',
      title: 'Send Invitations',
      description: 'Deadline to send wedding invitations',
      start_date: '2024-12-25T23:59:00Z',
      end_date: undefined,
      location: undefined,
      type: 'deadline' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      wedding_id: 'demo',
      title: 'Dress Fitting',
      description: 'Final dress fitting appointment',
      start_date: '2025-01-10T14:00:00Z',
      end_date: '2025-01-10T16:00:00Z',
      location: 'Bridal Boutique',
      type: 'appointment' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '6',
      wedding_id: 'demo',
      title: 'Rehearsal Dinner',
      description: 'Wedding rehearsal and dinner with family',
      start_date: '2025-06-14T18:00:00Z',
      end_date: '2025-06-14T22:00:00Z',
      location: 'Restaurant Venue',
      type: 'ceremony' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] : calendarEvents

  // Filter events
  const filteredEvents = mockEvents.filter(event => {
    if (activeFilter === 'all') return true
    return event.type === activeFilter
  })



  // Get upcoming events (next 7 days)
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingEvents = filteredEvents
    .filter(event => {
      const eventDate = parseISO(event.start_date)
      return eventDate >= today && eventDate <= nextWeek
    })
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())

  // Get events for selected date
  const selectedDateEvents = selectedDate 
    ? filteredEvents.filter(event => isSameDay(parseISO(event.start_date), selectedDate))
    : []

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleAddEvent = (date?: Date) => {
    if (date) setSelectedDate(date)
    setShowAddForm(true)
  }

  const handleEditEvent = (eventId: string) => {
    setEditingEvent(eventId)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteCalendarEvent(eventId)
    }
  }

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



  const eventTypeCounts = {
    all: mockEvents.length,
    ceremony: mockEvents.filter(e => e.type === 'ceremony').length,
    appointment: mockEvents.filter(e => e.type === 'appointment').length,
    deadline: mockEvents.filter(e => e.type === 'deadline').length,
    reminder: mockEvents.filter(e => e.type === 'reminder').length
  }

  const filters = [
    { key: 'all' as const, label: 'All', count: eventTypeCounts.all },
    { key: 'ceremony' as const, label: 'Ceremony', count: eventTypeCounts.ceremony },
    { key: 'appointment' as const, label: 'Appointments', count: eventTypeCounts.appointment },
    { key: 'deadline' as const, label: 'Deadlines', count: eventTypeCounts.deadline },
    { key: 'reminder' as const, label: 'Reminders', count: eventTypeCounts.reminder }
  ]

  return (
    <PageContainer
      title="Calendar"
      subtitle="Manage your wedding timeline"
      action={
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant={viewType === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('month')}
              className="rounded-none"
            >
              <Grid3X3 size={16} />
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('list')}
              className="rounded-none"
            >
              <List size={16} />
            </Button>
          </div>
          <Button onClick={() => handleAddEvent()} size="sm">
            <Plus size={16} className="mr-2" />
            Add Event
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <CalendarIcon size={20} className="text-primary" />
            </div>
            <p className="text-lg font-semibold">{mockEvents.length}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CalendarIcon size={20} className="text-blue-600" />
            </div>
            <p className="text-lg font-semibold">{eventTypeCounts.appointment}</p>
            <p className="text-xs text-muted-foreground">Appointments</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            <p className="text-lg font-semibold">{eventTypeCounts.deadline}</p>
            <p className="text-xs text-muted-foreground">Deadlines</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users size={20} className="text-success" />
            </div>
            <p className="text-lg font-semibold">{upcomingEvents.length}</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </AppCard>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {getEventTypeIcon(filter.key)}
              {filter.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeFilter === filter.key
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-background text-foreground'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Calendar Content */}
        {viewType === 'month' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <AppCard>
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    {format(currentDate, 'MMMM yyyy')}
                  </h3>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNextMonth}>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <CalendarView
                  currentDate={currentDate}
                  events={filteredEvents}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  onAddEvent={handleAddEvent}
                />
              </AppCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Selected Date Events */}
              {selectedDate && (
                <AppCard>
                  <h4 className="font-semibold mb-3">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </h4>
                  {selectedDateEvents.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">No events</p>
                      <Button size="sm" onClick={() => handleAddEvent(selectedDate)}>
                        <Plus size={14} className="mr-1" />
                        Add Event
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedDateEvents.map((event) => (
                        <EventItem
                          key={event.id}
                          event={event}
                          compact
                          onEdit={handleEditEvent}
                          onDelete={handleDeleteEvent}
                        />
                      ))}
                    </div>
                  )}
                </AppCard>
              )}

              {/* Upcoming Events */}
              <AppCard>
                <h4 className="font-semibold mb-3">Upcoming This Week</h4>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming events
                  </p>
                ) : (
                  <div className="space-y-2">
                    {upcomingEvents.slice(0, 5).map((event) => (
                      <EventItem
                        key={event.id}
                        event={event}
                        compact
                        onEdit={handleEditEvent}
                        onDelete={handleDeleteEvent}
                      />
                    ))}
                  </div>
                )}
              </AppCard>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <AppCard className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeFilter !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Start by adding your first event'
                  }
                </p>
                {activeFilter === 'all' && (
                  <Button onClick={() => handleAddEvent()}>
                    <Plus size={16} className="mr-2" />
                    Add Your First Event
                  </Button>
                )}
              </AppCard>
            ) : (
              filteredEvents
                .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                .map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Event Form Modal */}
      {(showAddForm || editingEvent) && (
        <EventForm
          eventId={editingEvent}
          initialDate={selectedDate}
          onClose={() => {
            setShowAddForm(false)
            setEditingEvent(null)
            setSelectedDate(null)
          }}
        />
      )}
    </PageContainer>
  )
}

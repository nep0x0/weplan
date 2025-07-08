'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { X, Calendar, Clock, MapPin, Users, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import type { CalendarEvent } from '@/lib/supabase'

interface EventFormProps {
  eventId?: string | null
  initialDate?: Date | null
  onClose: () => void
}

const predefinedEvents = [
  { title: 'Wedding Ceremony', type: 'ceremony' as const, duration: 2 },
  { title: 'Wedding Reception', type: 'ceremony' as const, duration: 4 },
  { title: 'Rehearsal Dinner', type: 'ceremony' as const, duration: 3 },
  { title: 'Venue Visit', type: 'appointment' as const, duration: 2 },
  { title: 'Cake Tasting', type: 'appointment' as const, duration: 2 },
  { title: 'Dress Fitting', type: 'appointment' as const, duration: 2 },
  { title: 'Photography Session', type: 'appointment' as const, duration: 3 },
  { title: 'Florist Meeting', type: 'appointment' as const, duration: 1 },
  { title: 'Send Invitations', type: 'deadline' as const, duration: 0 },
  { title: 'RSVP Deadline', type: 'deadline' as const, duration: 0 },
  { title: 'Final Guest Count', type: 'deadline' as const, duration: 0 },
  { title: 'Payment Due', type: 'deadline' as const, duration: 0 }
]

export function EventForm({ eventId, initialDate, onClose }: EventFormProps) {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent } = useAppStore()
  
  const [formData, setFormData] = useState<{
    title: string
    description: string
    start_date: string
    start_time: string
    end_date: string
    end_time: string
    location: string
    type: 'appointment' | 'deadline' | 'reminder' | 'ceremony'
  }>({
    title: '',
    description: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    location: '',
    type: 'appointment'
  })
  
  const [showPredefined, setShowPredefined] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!eventId
  const existingEvent = isEditing 
    ? calendarEvents.find(event => event.id === eventId)
    : null

  useEffect(() => {
    if (existingEvent) {
      const startDate = new Date(existingEvent.start_date)
      const endDate = existingEvent.end_date ? new Date(existingEvent.end_date) : null
      
      setFormData({
        title: existingEvent.title,
        description: existingEvent.description || '',
        start_date: format(startDate, 'yyyy-MM-dd'),
        start_time: format(startDate, 'HH:mm'),
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
        end_time: endDate ? format(endDate, 'HH:mm') : '',
        location: existingEvent.location || '',
        type: existingEvent.type
      })
      setShowPredefined(false)
    } else if (initialDate) {
      setFormData(prev => ({
        ...prev,
        start_date: format(initialDate, 'yyyy-MM-dd'),
        end_date: format(initialDate, 'yyyy-MM-dd')
      }))
    }
  }, [existingEvent, initialDate])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required'
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required'
    }

    if (!formData.start_time && formData.type !== 'deadline') {
      newErrors.start_time = 'Start time is required'
    }

    if (formData.end_date && formData.start_date && formData.end_date < formData.start_date) {
      newErrors.end_date = 'End date cannot be before start date'
    }

    if (formData.end_time && formData.start_time && 
        formData.end_date === formData.start_date && 
        formData.end_time <= formData.start_time) {
      newErrors.end_time = 'End time must be after start time'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Create start date
    const startDateTime = formData.type === 'deadline' 
      ? `${formData.start_date}T23:59:00Z`
      : `${formData.start_date}T${formData.start_time}:00Z`

    // Create end date if provided
    let endDateTime: string | undefined
    if (formData.end_date && formData.end_time) {
      endDateTime = `${formData.end_date}T${formData.end_time}:00Z`
    }

    const eventData: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'> = {
      wedding_id: 'demo', // Will be replaced with actual wedding ID
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      start_date: startDateTime,
      end_date: endDateTime,
      location: formData.location.trim() || undefined,
      type: formData.type
    }

    if (isEditing && eventId) {
      updateCalendarEvent(eventId, eventData)
    } else {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(), // Temporary ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      addCalendarEvent(newEvent)
    }

    onClose()
  }

  const handlePredefinedSelect = (event: typeof predefinedEvents[0]) => {
    const now = new Date()
    const startTime = format(now, 'HH:mm')
    const endTime = event.duration > 0 
      ? format(new Date(now.getTime() + event.duration * 60 * 60 * 1000), 'HH:mm')
      : ''

    setFormData(prev => ({
      ...prev,
      title: event.title,
      type: event.type,
      start_time: event.type === 'deadline' ? '' : startTime,
      end_time: event.type === 'deadline' ? '' : endTime
    }))
    setShowPredefined(false)
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'ceremony':
        return <Users size={16} className="text-primary" />
      case 'appointment':
        return <Calendar size={16} className="text-blue-600" />
      case 'deadline':
        return <AlertTriangle size={16} className="text-orange-600" />
      case 'reminder':
        return <Clock size={16} className="text-purple-600" />
      default:
        return <Calendar size={16} />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'ceremony':
        return 'border-primary bg-primary/10 text-primary'
      case 'appointment':
        return 'border-blue-200 bg-blue-50 text-blue-700'
      case 'deadline':
        return 'border-orange-200 bg-orange-50 text-orange-700'
      case 'reminder':
        return 'border-purple-200 bg-purple-50 text-purple-700'
      default:
        return 'border-border bg-background'
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Edit Event' : 'Add New Event'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Predefined Events */}
          {showPredefined && !isEditing && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Quick Select</h3>
              <div className="grid gap-2">
                {predefinedEvents.map((event, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePredefinedSelect(event)}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{event.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.type)}
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
                  Or create custom event
                </Button>
              </div>
            </div>
          )}

          {/* Custom Form */}
          {(!showPredefined || isEditing) && (
            <div className="space-y-4">
              {/* Event Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Wedding Ceremony"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['ceremony', 'appointment', 'deadline', 'reminder'] as const).map((type) => {
                    const labels = { 
                      ceremony: 'Ceremony', 
                      appointment: 'Appointment', 
                      deadline: 'Deadline', 
                      reminder: 'Reminder' 
                    }
                    
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type }))}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                          formData.type === type
                            ? getEventTypeColor(type)
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        {getEventTypeIcon(type)}
                        {labels[type]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Start Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className={errors.start_date ? 'border-red-500' : ''}
                  />
                  {errors.start_date && (
                    <p className="text-sm text-red-500">{errors.start_date}</p>
                  )}
                </div>
                
                {formData.type !== 'deadline' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                      className={errors.start_time ? 'border-red-500' : ''}
                    />
                    {errors.start_time && (
                      <p className="text-sm text-red-500">{errors.start_time}</p>
                    )}
                  </div>
                )}
              </div>

              {/* End Date & Time */}
              {formData.type !== 'deadline' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date (Optional)</label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className={errors.end_date ? 'border-red-500' : ''}
                    />
                    {errors.end_date && (
                      <p className="text-sm text-red-500">{errors.end_date}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time (Optional)</label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                      className={errors.end_time ? 'border-red-500' : ''}
                    />
                    {errors.end_time && (
                      <p className="text-sm text-red-500">{errors.end_time}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location (Optional)</label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Grand Ballroom Hotel"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add more details about this event..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
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
                {isEditing ? 'Update' : 'Add'} Event
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

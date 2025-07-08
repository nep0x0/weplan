'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { X, User, Mail, Phone, Users, Utensils, MapPin } from 'lucide-react'
import type { Guest } from '@/lib/supabase'

interface GuestFormProps {
  guestId?: string | null
  onClose: () => void
}

export function GuestForm({ guestId, onClose }: GuestFormProps) {
  const { guests, addGuest, updateGuest } = useAppStore()
  
  const [formData, setFormData] = useState<{
    name: string
    email: string
    phone: string
    rsvp_status: 'pending' | 'yes' | 'no'
    plus_ones: number
    dietary_restrictions: string
    table_number: string
  }>({
    name: '',
    email: '',
    phone: '',
    rsvp_status: 'pending',
    plus_ones: 0,
    dietary_restrictions: '',
    table_number: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!guestId
  const existingGuest = isEditing 
    ? guests.find(guest => guest.id === guestId)
    : null

  useEffect(() => {
    if (existingGuest) {
      setFormData({
        name: existingGuest.name,
        email: existingGuest.email || '',
        phone: existingGuest.phone || '',
        rsvp_status: existingGuest.rsvp_status,
        plus_ones: existingGuest.plus_ones,
        dietary_restrictions: existingGuest.dietary_restrictions || '',
        table_number: existingGuest.table_number?.toString() || ''
      })
    }
  }, [existingGuest])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Guest name is required'
    }

    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.plus_ones < 0) {
      newErrors.plus_ones = 'Plus ones cannot be negative'
    }

    if (formData.table_number && (isNaN(Number(formData.table_number)) || Number(formData.table_number) < 1)) {
      newErrors.table_number = 'Table number must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const guestData: Omit<Guest, 'id' | 'created_at' | 'updated_at'> = {
      wedding_id: 'demo', // Will be replaced with actual wedding ID
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      rsvp_status: formData.rsvp_status,
      plus_ones: formData.plus_ones,
      dietary_restrictions: formData.dietary_restrictions.trim() || undefined,
      table_number: formData.table_number ? Number(formData.table_number) : undefined
    }

    if (isEditing && guestId) {
      updateGuest(guestId, guestData)
    } else {
      const newGuest: Guest = {
        ...guestData,
        id: Date.now().toString(), // Temporary ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      addGuest(newGuest)
    }

    onClose()
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format Indonesian phone number
    if (digits.startsWith('62')) {
      // International format
      return `+${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5, 9)}-${digits.slice(9, 13)}`
    } else if (digits.startsWith('0')) {
      // Local format
      return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`
    }
    
    return value
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setFormData(prev => ({ ...prev, phone: formatted }))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Edit Guest' : 'Add New Guest'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Guest Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Guest Name</label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., John Smith"
                className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email (Optional)</label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john.smith@email.com"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number (Optional)</label>
            <div className="relative">
              <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+62 812-3456-7890"
                className="pl-10"
              />
            </div>
          </div>

          {/* RSVP Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">RSVP Status</label>
            <div className="grid grid-cols-3 gap-2">
              {(['pending', 'yes', 'no'] as const).map((status) => {
                const labels = { pending: 'Pending', yes: 'Confirmed', no: 'Declined' }
                const colors = {
                  pending: 'border-orange-200 bg-orange-50 text-orange-700',
                  yes: 'border-green-200 bg-green-50 text-green-700',
                  no: 'border-red-200 bg-red-50 text-red-700'
                }
                
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rsvp_status: status }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.rsvp_status === status
                        ? colors[status]
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {labels[status]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Plus Ones */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Plus Ones</label>
            <div className="relative">
              <Users size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                max="10"
                value={formData.plus_ones}
                onChange={(e) => setFormData(prev => ({ ...prev, plus_ones: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className={`pl-10 ${errors.plus_ones ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.plus_ones && (
              <p className="text-sm text-red-500">{errors.plus_ones}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Number of additional guests this person is bringing
            </p>
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Dietary Restrictions (Optional)</label>
            <div className="relative">
              <Utensils size={20} className="absolute left-3 top-3 text-muted-foreground" />
              <textarea
                value={formData.dietary_restrictions}
                onChange={(e) => setFormData(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                placeholder="e.g., Vegetarian, Gluten-free, No nuts..."
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
          </div>

          {/* Table Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Table Number (Optional)</label>
            <div className="relative">
              <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="number"
                min="1"
                value={formData.table_number}
                onChange={(e) => setFormData(prev => ({ ...prev, table_number: e.target.value }))}
                placeholder="e.g., 1, 2, 3..."
                className={`pl-10 ${errors.table_number ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.table_number && (
              <p className="text-sm text-red-500">{errors.table_number}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update' : 'Add'} Guest
            </Button>
          </div>
          </form>
        </div>

        {/* Mobile Bottom Padding for Safe Area */}
        <div className="h-4 sm:h-0 flex-shrink-0" />
      </div>
    </div>
  )
}

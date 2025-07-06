'use client'

import { useState } from 'react'
import { AppCard } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { 
  UserCheck, 
  UserX, 
  Clock,
  Phone,
  Mail,
  Edit,
  Trash2,
  Users,
  ChevronDown,
  ChevronRight,
  MapPin,
  Utensils
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Guest } from '@/lib/supabase'

interface GuestItemProps {
  guest: Guest
  onUpdateRSVP: (id: string, status: 'yes' | 'no' | 'pending') => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function GuestItem({ guest, onUpdateRSVP, onEdit, onDelete }: GuestItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getRSVPIcon = (status: string) => {
    switch (status) {
      case 'yes':
        return <UserCheck size={16} className="text-success" />
      case 'no':
        return <UserX size={16} className="text-red-600" />
      case 'pending':
        return <Clock size={16} className="text-orange-600" />
      default:
        return <Clock size={16} className="text-muted-foreground" />
    }
  }

  const getRSVPColor = (status: string) => {
    switch (status) {
      case 'yes':
        return 'text-success bg-success/10 border-success/20'
      case 'no':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'pending':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-muted-foreground bg-muted border-border'
    }
  }

  const getRSVPLabel = (status: string) => {
    switch (status) {
      case 'yes':
        return 'Confirmed'
      case 'no':
        return 'Declined'
      case 'pending':
        return 'Pending'
      default:
        return 'Unknown'
    }
  }

  const totalAttendees = guest.rsvp_status === 'yes' ? 1 + guest.plus_ones : 0

  const hasDetails = guest.phone || guest.dietary_restrictions || guest.table_number

  return (
    <AppCard className="group hover:shadow-md transition-all duration-200">
      <div className="space-y-3">
        {/* Main Content */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sm font-semibold text-primary">
              {guest.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Name */}
                <h3 className="font-medium text-sm leading-tight">
                  {guest.name}
                </h3>

                {/* Email */}
                {guest.email && (
                  <div className="flex items-center gap-1 mt-1">
                    <Mail size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">
                      {guest.email}
                    </span>
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-3 mt-2">
                  {/* RSVP Status */}
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                    getRSVPColor(guest.rsvp_status)
                  )}>
                    {getRSVPIcon(guest.rsvp_status)}
                    <span>{getRSVPLabel(guest.rsvp_status)}</span>
                  </div>

                  {/* Plus Ones */}
                  {guest.plus_ones > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users size={12} />
                      <span>+{guest.plus_ones}</span>
                    </div>
                  )}

                  {/* Total Attendees */}
                  {guest.rsvp_status === 'yes' && totalAttendees > 1 && (
                    <div className="text-xs text-muted-foreground">
                      {totalAttendees} attendees
                    </div>
                  )}
                </div>
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
                  onClick={() => onEdit(guest.id)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit size={14} />
                </Button>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(guest.id)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Quick Actions */}
        {guest.rsvp_status === 'pending' && (
          <div className="ml-13 flex gap-2">
            <Button
              size="sm"
              onClick={() => onUpdateRSVP(guest.id, 'yes')}
              className="h-7 px-3 text-xs"
            >
              <UserCheck size={12} className="mr-1" />
              Confirm
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateRSVP(guest.id, 'no')}
              className="h-7 px-3 text-xs"
            >
              <UserX size={12} className="mr-1" />
              Decline
            </Button>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && hasDetails && (
          <div className="ml-13 pl-3 border-l-2 border-muted space-y-2">
            {/* Phone */}
            {guest.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{guest.phone}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs ml-auto"
                  onClick={() => window.open(`tel:${guest.phone}`)}
                >
                  Call
                </Button>
              </div>
            )}

            {/* Dietary Restrictions */}
            {guest.dietary_restrictions && (
              <div className="flex items-center gap-2">
                <Utensils size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {guest.dietary_restrictions}
                </span>
              </div>
            )}

            {/* Table Number */}
            {guest.table_number && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Table {guest.table_number}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Status Change Buttons for Confirmed/Declined */}
        {guest.rsvp_status !== 'pending' && (
          <div className="ml-13">
            <div className="flex gap-2">
              {guest.rsvp_status !== 'yes' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateRSVP(guest.id, 'yes')}
                  className="h-7 px-3 text-xs"
                >
                  <UserCheck size={12} className="mr-1" />
                  Mark as Confirmed
                </Button>
              )}
              {guest.rsvp_status !== 'no' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateRSVP(guest.id, 'no')}
                  className="h-7 px-3 text-xs"
                >
                  <UserX size={12} className="mr-1" />
                  Mark as Declined
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateRSVP(guest.id, 'pending')}
                className="h-7 px-3 text-xs"
              >
                <Clock size={12} className="mr-1" />
                Mark as Pending
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppCard>
  )
}

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
  Users,
  UserCheck,
  Clock,
  Download,
  Upload
} from 'lucide-react'
import { GuestForm } from './guest-form'
import { GuestItem } from './guest-item'

type FilterType = 'all' | 'yes' | 'no' | 'pending'
type SortType = 'name' | 'rsvp' | 'plusOnes' | 'created'

export function GuestsPage() {
  const {
    guests,
    updateGuest,
    deleteGuest
  } = useAppStore()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGuest, setEditingGuest] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('name')

  // Use real data only - no mock data
  const confirmedCount = guests.filter(guest => guest.rsvp_status === 'yes').length
  const declinedCount = guests.filter(guest => guest.rsvp_status === 'no').length
  const pendingCount = guests.filter(guest => guest.rsvp_status === 'pending').length
  const totalAttendees = guests
    .filter(guest => guest.rsvp_status === 'yes')
    .reduce((sum, guest) => sum + 1 + guest.plus_ones, 0)

  // Filter and sort guests
  const filteredGuests = guests
    .filter(guest => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!guest.name.toLowerCase().includes(query) && 
            !guest.email?.toLowerCase().includes(query) &&
            !guest.phone?.toLowerCase().includes(query)) {
          return false
        }
      }

      // RSVP filter
      switch (activeFilter) {
        case 'yes':
          return guest.rsvp_status === 'yes'
        case 'no':
          return guest.rsvp_status === 'no'
        case 'pending':
          return guest.rsvp_status === 'pending'
        default:
          return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rsvp':
          const rsvpOrder = { yes: 3, pending: 2, no: 1 }
          return rsvpOrder[b.rsvp_status] - rsvpOrder[a.rsvp_status]
        case 'plusOnes':
          return b.plus_ones - a.plus_ones
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  const handleUpdateRSVP = (id: string, status: 'yes' | 'no' | 'pending') => {
    updateGuest(id, { rsvp_status: status })
  }

  const handleDeleteGuest = (id: string) => {
    if (confirm('Are you sure you want to remove this guest?')) {
      deleteGuest(id)
    }
  }

  const filters = [
    { key: 'all' as const, label: 'All', count: guests.length },
    { key: 'yes' as const, label: 'Confirmed', count: confirmedCount },
    { key: 'pending' as const, label: 'Pending', count: pendingCount },
    { key: 'no' as const, label: 'Declined', count: declinedCount }
  ]

  return (
    <PageContainer
      title="Guests"
      subtitle="Manage your wedding guest list"
      action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowAddForm(true)} size="sm">
            <Plus size={16} className="mr-2" />
            Add Guest
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users size={20} className="text-primary" />
            </div>
            <p className="text-lg font-semibold">{guests.length}</p>
            <p className="text-xs text-muted-foreground">Total Invited</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserCheck size={20} className="text-success" />
            </div>
            <p className="text-lg font-semibold">{confirmedCount}</p>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock size={20} className="text-orange-600" />
            </div>
            <p className="text-lg font-semibold">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </AppCard>
          
          <AppCard className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users size={20} className="text-blue-600" />
            </div>
            <p className="text-lg font-semibold">{totalAttendees}</p>
            <p className="text-xs text-muted-foreground">Total Attendees</p>
          </AppCard>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search guests by name, email, or phone..."
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

          {/* Sort and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="text-sm bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="name">Name</option>
                <option value="rsvp">RSVP Status</option>
                <option value="plusOnes">Plus Ones</option>
                <option value="created">Recently Added</option>
              </select>
            </div>

            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Guest List */}
        <div className="space-y-3">
          {filteredGuests.length === 0 ? (
            <AppCard className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No guests found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || activeFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first guest'
                }
              </p>
              {!searchQuery && activeFilter === 'all' && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Your First Guest
                </Button>
              )}
            </AppCard>
          ) : (
            filteredGuests.map((guest) => (
              <GuestItem
                key={guest.id}
                guest={guest}
                onUpdateRSVP={handleUpdateRSVP}
                onEdit={() => setEditingGuest(guest.id)}
                onDelete={handleDeleteGuest}
              />
            ))
          )}
        </div>

        {/* Summary Card */}
        {filteredGuests.length > 0 && (
          <AppCard>
            <h3 className="font-semibold mb-3">Guest Summary</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-success">{confirmedCount}</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{declinedCount}</p>
                <p className="text-xs text-muted-foreground">Declined</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{totalAttendees}</p>
                <p className="text-xs text-muted-foreground">Total Attendees</p>
              </div>
            </div>
          </AppCard>
        )}
      </div>

      {/* Add/Edit Guest Form Modal */}
      {(showAddForm || editingGuest) && (
        <GuestForm
          guestId={editingGuest}
          onClose={() => {
            setShowAddForm(false)
            setEditingGuest(null)
          }}
        />
      )}
    </PageContainer>
  )
}

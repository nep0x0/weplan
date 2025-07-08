'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'
import { useAppStore } from '@/lib/store'
import { User, LogOut, Settings, Heart } from 'lucide-react'

export function UserMenu() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { setActiveTab } = useAppStore()
  const [showMenu, setShowMenu] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom')
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Calculate dropdown position based on button position
  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const spaceBelow = windowHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top


      // If there's less than 300px space below, show dropdown above
      if (spaceBelow < 300 && spaceAbove > 200) {
        setDropdownPosition('top')
      } else {
        setDropdownPosition('bottom')
      }
    }
  }, [showMenu])

  if (!user) return null

  const handleSignOut = async () => {
    try {
      // Reset navigation to dashboard
      setActiveTab('dashboard')

      // Sign out from Supabase
      await signOut()

      // Close menu
      setShowMenu(false)

      // Force redirect to sign-in page
      router.push('/auth/signin')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if there's an error
      router.push('/auth/signin')
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-primary">
            {getUserInitials(displayName)}
          </span>
        </div>
        <span className="text-sm font-medium hidden sm:block">{displayName}</span>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className={`absolute right-0 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-border z-50 ${
            dropdownPosition === 'top'
              ? 'bottom-full mb-2'
              : 'top-full mt-2'
          } max-w-[calc(100vw-2rem)]`}>
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm font-medium text-primary">
                    {getUserInitials(displayName)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => setShowMenu(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-left"
              >
                <User size={16} />
                Profile Settings
              </button>
              
              <button
                onClick={() => setShowMenu(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-left"
              >
                <Settings size={16} />
                App Settings
              </button>
              
              <hr className="my-2" />
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>

            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Heart size={12} className="text-primary" />
                <span>Made with love for your special day</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

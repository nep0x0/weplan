'use client'

import { cn } from '@/lib/utils'

interface BudgetProgressProps {
  spent: number
  allocated: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
}

export function BudgetProgress({ 
  spent, 
  allocated, 
  className,
  size = 'md',
  showPercentage = false
}: BudgetProgressProps) {
  const percentage = allocated > 0 ? Math.round((spent / allocated) * 100) : 0
  const isOverBudget = spent > allocated
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  }
  
  const strokeWidths = {
    sm: 4,
    md: 6,
    lg: 8
  }
  
  const radius = {
    sm: 28,
    md: 42,
    lg: 56
  }
  
  const circumference = 2 * Math.PI * radius[size]
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference
  
  const progressColor = isOverBudget 
    ? '#EF4444' // Red for over budget
    : percentage >= 90 
    ? '#F59E0B' // Orange for near budget limit
    : '#E11D48' // Primary color for normal

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg 
        className={cn("transform -rotate-90", sizeClasses[size])}
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius[size]}
          stroke="currentColor"
          strokeWidth={strokeWidths[size]}
          fill="transparent"
          className="text-muted"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius[size]}
          stroke={progressColor}
          strokeWidth={strokeWidths[size]}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={cn(
            "font-bold",
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base',
            isOverBudget ? 'text-red-600' : 'text-foreground'
          )}>
            {percentage}%
          </div>
          {showPercentage && (
            <div className={cn(
              "text-muted-foreground",
              size === 'sm' ? 'text-xs' : 'text-xs'
            )}>
              used
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Linear progress bar variant
interface LinearProgressProps {
  spent: number
  allocated: number
  className?: string
  height?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
}

export function LinearBudgetProgress({
  spent,
  allocated,
  className,
  height = 'md',
  showLabels = false
}: LinearProgressProps) {
  const percentage = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0
  const isOverBudget = spent > allocated
  
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  
  const progressColor = isOverBudget 
    ? 'bg-red-500' 
    : percentage >= 90 
    ? 'bg-orange-500' 
    : 'bg-primary'

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(0)}M`
    }
    if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)}K`
    }
    return `Rp ${amount}`
  }

  return (
    <div className={cn("space-y-2", className)}>
      {showLabels && (
        <div className="flex justify-between text-sm">
          <span className="font-medium">{formatCurrency(spent)}</span>
          <span className="text-muted-foreground">{formatCurrency(allocated)}</span>
        </div>
      )}
      
      <div className={cn("w-full bg-muted rounded-full", heightClasses[height])}>
        <div
          className={cn(
            "rounded-full transition-all duration-500 ease-out",
            heightClasses[height],
            progressColor
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(percentage)}% used</span>
          <span>{formatCurrency(allocated - spent)} remaining</span>
        </div>
      )}
    </div>
  )
}

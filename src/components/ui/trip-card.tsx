import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TripCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TripCard = forwardRef<HTMLDivElement, TripCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          // Base styles - TripTogether design system
          'bg-white rounded-2xl shadow-trip-lg p-6',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TripCard.displayName = 'TripCard'

// Card Header Component
export interface TripCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TripCardHeader = forwardRef<HTMLDivElement, TripCardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('space-y-1 mb-6', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TripCardHeader.displayName = 'TripCardHeader'

// Card Title Component  
export interface TripCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

const TripCardTitle = forwardRef<HTMLHeadingElement, TripCardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        className={cn('text-xl font-semibold text-neutral-800', className)}
        ref={ref}
        {...props}
      >
        {children}
      </h2>
    )
  }
)

TripCardTitle.displayName = 'TripCardTitle'

// Card Description Component
export interface TripCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const TripCardDescription = forwardRef<HTMLParagraphElement, TripCardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn('text-base text-neutral-600', className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    )
  }
)

TripCardDescription.displayName = 'TripCardDescription'

// Card Content Component
export interface TripCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TripCardContent = forwardRef<HTMLDivElement, TripCardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('space-y-4', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TripCardContent.displayName = 'TripCardContent'

export { 
  TripCard, 
  TripCardHeader, 
  TripCardTitle, 
  TripCardDescription, 
  TripCardContent 
}
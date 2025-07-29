import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TripInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
}

const TripInput = forwardRef<HTMLInputElement, TripInputProps>(
  ({ className, leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
            {leftIcon}
          </div>
        )}
        
        {/* Input Field */}
        <input
          className={cn(
            // Base styles - TripTogether design system
            'w-full h-input bg-input-background rounded-xl text-base text-neutral-800 placeholder:text-neutral-500 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
            'border-0', // Borderless design
            
            // Padding adjustments for icons
            {
              'pl-10': leftIcon,     // Left padding when icon present
              'pr-10': rightIcon,    // Right padding when icon present  
              'px-4': !leftIcon && !rightIcon, // Default padding
              'pl-4 pr-10': !leftIcon && rightIcon, // Only right icon
              'pl-10 pr-4': leftIcon && !rightIcon, // Only left icon
            },
            
            // Error styles
            {
              'ring-2 ring-red-500 bg-red-50': error,
            },
            
            className
          )}
          ref={ref}
          {...props}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)

TripInput.displayName = 'TripInput'

export { TripInput }
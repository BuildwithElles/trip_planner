import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface TripButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'default' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const TripButton = forwardRef<HTMLButtonElement, TripButtonProps>(
  ({ className, variant = 'primary', size = 'default', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles - TripTogether design system
          'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          
          // Size variants
          {
            'h-button px-6 text-base': size === 'default',  // h-12 (48px)
            'h-button-lg px-8 text-base': size === 'lg',    // h-14 (56px)
          },
          
          // Variant styles
          {
            // Primary - Gradient background with shadow
            'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-trip-lg hover:shadow-xl focus:ring-blue-600': 
              variant === 'primary',
            
            // Secondary - White background with border
            'bg-white text-neutral-800 border-2 border-neutral-200 hover:border-neutral-300 focus:ring-neutral-600': 
              variant === 'secondary',
            
            // Tertiary - Text only
            'bg-transparent text-blue-600 hover:text-blue-700 focus:ring-blue-600': 
              variant === 'tertiary',
          },
          
          // Disabled styles
          {
            'opacity-50 cursor-not-allowed': disabled || loading,
          },
          
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

TripButton.displayName = 'TripButton'

export { TripButton }
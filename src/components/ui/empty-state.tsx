import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-8 px-4 ${className}`}>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-soft flex items-center justify-center text-soft-blue-500">
          {icon}
        </div>
      </div>
      <h3 className="text-heading-sm text-soft-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-body-md text-soft-gray-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  )
} 
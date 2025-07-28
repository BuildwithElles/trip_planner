interface ProgressRingProps {
  progress: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'turquoise' | 'emerald' | 'pink'
  children?: React.ReactNode
}

export function ProgressRing({ 
  progress, 
  size = 'md', 
  color = 'turquoise', 
  children 
}: ProgressRingProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  }
  
  const strokeWidths = {
    sm: 2,
    md: 3,
    lg: 4
  }
  
  const colorClasses = {
    blue: 'text-soft-blue-500',
    turquoise: 'text-turquoise-500',
    emerald: 'text-accent-emerald-500',
    pink: 'text-accent-pink-500'
  }
  
  const radius = size === 'sm' ? 20 : size === 'md' ? 26 : 32
  const strokeWidth = strokeWidths[size]
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <svg
        className={`${sizeClasses[size]} transform -rotate-90`}
        width={radius * 2}
        height={radius * 2}
      >
        {/* Background circle */}
        <circle
          stroke="currentColor"
          className="text-soft-gray-200"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke="currentColor"
          className={colorClasses[color]}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-semibold ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} ${colorClasses[color]}`}>
            {children}
          </span>
        </div>
      )}
    </div>
  )
} 
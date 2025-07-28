'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Wallet, MessageCircle, User } from 'lucide-react'

const navigationItems = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Itinerary', 
    href: '/itinerary',
    icon: Calendar,
  },
  {
    name: 'Budget',
    href: '/budget', 
    icon: Wallet,
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: MessageCircle,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
]

interface BottomNavigationProps {
  className?: string
}

export function BottomNavigation({ className = '' }: BottomNavigationProps) {
  const pathname = usePathname()
  
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-soft-gray-200 md:hidden ${className}`}>
      <div className="grid grid-cols-5 h-16">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                isActive 
                  ? 'text-soft-blue-600 bg-soft-blue-50' 
                  : 'text-soft-gray-500 hover:text-soft-gray-700 hover:bg-soft-gray-50'
              }`}
            >
              <Icon 
                className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} 
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={`text-xs font-medium ${isActive ? 'text-soft-blue-600' : 'text-soft-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 
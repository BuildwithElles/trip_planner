'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { 
  Home, 
  Calendar, 
  DollarSign, 
  Package, 
  MoreHorizontal
} from 'lucide-react'

interface AppShellProps {
  children: ReactNode
}

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  activePatterns: string[]
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    activePatterns: ['/dashboard']
  },
  {
    id: 'itinerary',
    label: 'Itinerary',
    icon: Calendar,
    href: '/itinerary',
    activePatterns: ['/itinerary']
  },
  {
    id: 'budget',
    label: 'Budget',
    icon: DollarSign,
    href: '/budget',
    activePatterns: ['/budget']
  },
  {
    id: 'packing',
    label: 'Packing',
    icon: Package,
    href: '/packing',
    activePatterns: ['/packing']
  },
  {
    id: 'more',
    label: 'More',
    icon: MoreHorizontal,
    href: '/more',
    activePatterns: ['/more', '/guests', '/chat', '/photos', '/settings']
  }
]

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  const isActiveNav = (item: NavItem): boolean => {
    return item.activePatterns.some(pattern => pathname.startsWith(pattern))
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-2 py-2 z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = isActiveNav(item)
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-600' : 'text-neutral-600'}`} />
                <span className={`text-xs font-medium truncate ${
                  isActive ? 'text-blue-600' : 'text-neutral-600'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

// Export individual navigation items for other components to use
export { navItems }
'use client'

import { AppShell } from '@/components/layout/AppShell'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Users, 
  MessageSquare, 
  Camera, 
  Settings, 
  LogOut,
  Star,
  ChevronRight,
  Shirt
} from 'lucide-react'
import Link from 'next/link'

export default function MorePage() {
  const { signOut, profile } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const menuItems = [
    {
      icon: Shirt,
      label: 'Outfits',
      description: 'Plan your outfits for each event',
      color: 'bg-purple-100 text-purple-600',
      href: '/outfits',
      badge: '4'
    },
    {
      icon: Users,
      label: 'Manage Guests',
      description: 'Invite and manage trip members',
      color: 'bg-blue-100 text-blue-600',
      href: '/guests'
    },
    {
      icon: Camera,
      label: 'Photos',
      description: 'Share trip memories',
      color: 'bg-orange-100 text-orange-600',
      href: '/photos',
      comingSoon: true
    },
    {
      icon: MessageSquare,
      label: 'Chat',
      description: 'Group conversations',
      color: 'bg-green-100 text-green-600',
      href: '/chat',
      comingSoon: true
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'App preferences',
      color: 'bg-neutral-100 text-neutral-600',
      href: '/settings',
      comingSoon: true
    }
  ]

  return (
    <AppShell>
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">More</h1>
          <p className="text-neutral-600">Additional features and settings</p>
        </div>

        {/* Profile Section */}
        {profile && (
          <div className="bg-white rounded-2xl p-4 shadow-trip-lg mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">
                  {profile.full_name || 'Trip Member'}
                </h3>
                <p className="text-sm text-neutral-600">{profile.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-2 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const ItemContent = (
              <>
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-neutral-800">{item.label}</h3>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
                <div className="flex items-center">
                  {item.comingSoon && (
                    <span className="text-xs text-neutral-500 mr-2">Coming Soon</span>
                  )}
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </div>
              </>
            )

            if (item.href === '/outfits') {
              return (
                <Link key={item.label} href={item.href}>
                  <div className="w-full bg-white rounded-2xl p-4 shadow-trip-lg flex items-center gap-4 hover:bg-neutral-50 transition-colors cursor-pointer">
                    {ItemContent}
                  </div>
                </Link>
              )
            }

            return (
              <button
                key={item.label}
                className="w-full bg-white rounded-2xl p-4 shadow-trip-lg flex items-center gap-4 hover:bg-neutral-50 transition-colors disabled:opacity-60"
                disabled={item.comingSoon}
              >
                {ItemContent}
              </button>
            )
          })}
        </div>

        {/* Rate App */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-neutral-800">Loving TripTogether?</h3>
              <p className="text-sm text-neutral-600">Rate us on the app store!</p>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full bg-red-50 text-red-600 rounded-2xl p-4 flex items-center gap-4 hover:bg-red-100 transition-colors border border-red-100"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium">Sign Out</h3>
            <p className="text-sm text-red-500">Sign out of your account</p>
          </div>
        </button>

        {/* Version Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">TripTogether v1.0.0</p>
        </div>
      </div>
    </AppShell>
  )
}
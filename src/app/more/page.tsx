'use client'

import { AppShell } from '@/components/layout/AppShell'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Users, 
  MessageSquare, 
  Camera, 
  Settings, 
  LogOut,
  HelpCircle,
  Shield,
  Star,
  ChevronRight
} from 'lucide-react'

export default function MorePage() {
  const { signOut, profile } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const menuItems = [
    {
      icon: Users,
      label: 'Manage Guests',
      description: 'Invite and manage trip members',
      color: 'bg-blue-100 text-blue-600',
      href: '/guests'
    },
    {
      icon: MessageSquare,
      label: 'Group Chat',
      description: 'Trip conversations and updates',
      color: 'bg-green-100 text-green-600',
      href: '/chat'
    },
    {
      icon: Camera,
      label: 'Photos',
      description: 'Shared trip memories',
      color: 'bg-purple-100 text-purple-600',
      href: '/photos'
    },
    {
      icon: Settings,
      label: 'Trip Settings',
      description: 'Edit trip details and preferences',
      color: 'bg-neutral-100 text-neutral-600',
      href: '/settings'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support',
      color: 'bg-orange-100 text-orange-600',
      href: '/help'
    },
    {
      icon: Shield,
      label: 'Privacy',
      description: 'Privacy settings and data',
      color: 'bg-indigo-100 text-indigo-600',
      href: '/privacy'
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
            return (
              <button
                key={item.label}
                className="w-full bg-white rounded-2xl p-4 shadow-trip-lg flex items-center gap-4 hover:bg-neutral-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-neutral-800">{item.label}</h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400" />
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
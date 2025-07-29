'use client'

import { useAuth } from '@/contexts/AuthContext'
import { AppShell } from '@/components/layout/AppShell'
import { 
  TripHeader,
  BudgetCard, 
  RSVPCard, 
  PackingCard, 
  EventsCard, 
  QuickActionsCard 
} from '@/components/dashboard/DashboardCards'
import { Settings, Share2, Edit3 } from 'lucide-react'

// Mock data - in a real app, this would come from your API/database
const mockTripData = {
  tripName: "Summer Beach Getaway",
  hostName: "Sarah Johnson",
  location: "Bali, Indonesia", 
  imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop&crop=center",
  budget: {
    total: 2400,
    spent: 1650,
    remaining: 750
  },
  rsvp: {
    confirmed: 6,
    pending: 2,
    total: 8
  },
  packing: {
    packed: 12,
    total: 18
  },
  events: {
    upcoming: 3,
    totalPlanned: 8
  },
  quickActions: {
    chatMessages: 3,
    photosShared: 24
  }
}

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppShell>
    )
  }

  if (!user) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-neutral-600">Please sign in to view your dashboard</p>
          </div>
        </div>
      </AppShell>
    )
  }

  const isAdmin = true // TODO: Determine based on user role in trip

  return (
    <AppShell>
      <div className="max-w-md mx-auto p-4">
        {/* Trip Header with Admin Controls */}
        <div className="relative">
          <TripHeader
            tripName={mockTripData.tripName}
            hostName={mockTripData.hostName}
            location={mockTripData.location}
            imageUrl={mockTripData.imageUrl}
          />
          
          {/* Admin Controls */}
          {isAdmin && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 flex gap-2">
              <button className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-neutral-50 transition-colors">
                <Edit3 className="w-4 h-4 text-neutral-600" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-neutral-50 transition-colors">
                <Share2 className="w-4 h-4 text-neutral-600" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-neutral-50 transition-colors">
                <Settings className="w-4 h-4 text-neutral-600" />
              </button>
            </div>
          )}
        </div>

        {/* Dashboard Cards Grid */}
        <div className="space-y-4">
          {/* Budget Card - Full Width */}
          <BudgetCard
            totalBudget={mockTripData.budget.total}
            spent={mockTripData.budget.spent}
            remaining={mockTripData.budget.remaining}
          />

          {/* RSVP Status Card - Full Width */}
          <RSVPCard
            confirmed={mockTripData.rsvp.confirmed}
            pending={mockTripData.rsvp.pending}
            total={mockTripData.rsvp.total}
          />

          {/* Packing and Events - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <PackingCard
              packed={mockTripData.packing.packed}
              total={mockTripData.packing.total}
            />
            <EventsCard
              upcoming={mockTripData.events.upcoming}
              totalPlanned={mockTripData.events.totalPlanned}
            />
          </div>

          {/* Quick Actions Card - Full Width */}
          <QuickActionsCard
            chatMessages={mockTripData.quickActions.chatMessages}
            photosShared={mockTripData.quickActions.photosShared}
          />

          {/* Admin-Only Actions */}
          {isAdmin && (
            <div className="bg-white rounded-2xl p-4 shadow-trip-lg">
              <h3 className="font-semibold text-neutral-800 mb-3">Admin Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-neutral-800">Manage Guests</div>
                  <div className="text-sm text-neutral-600">Invite, remove, or change guest permissions</div>
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-neutral-800">Edit Trip Details</div>
                  <div className="text-sm text-neutral-600">Update trip name, dates, or description</div>
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-neutral-800">Generate Invite Link</div>
                  <div className="text-sm text-neutral-600">Create shareable links for new guests</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Welcome Message for New Users */}
        {profile && (
          <div className="mt-6 bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="text-center">
              <h3 className="font-semibold text-blue-900 mb-1">
                Welcome to TripTogether, {profile.full_name || 'there'}! 👋
              </h3>
              <p className="text-sm text-blue-700">
                Your trip dashboard shows everything you need to plan the perfect getaway together.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
} 
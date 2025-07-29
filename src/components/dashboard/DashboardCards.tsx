'use client'

import { 
  DollarSign, 
  Users, 
  Package, 
  Calendar, 
  MessageSquare, 
  Camera,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react'

// Base Card Component
interface DashboardCardProps {
  children: React.ReactNode
  className?: string
}

function DashboardCard({ children, className = '' }: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-trip-lg ${className}`}>
      {children}
    </div>
  )
}

// Budget Card
interface BudgetCardProps {
  totalBudget: number
  spent: number
  remaining: number
}

export function BudgetCard({ totalBudget, spent, remaining }: BudgetCardProps) {
  const spentPercentage = (spent / totalBudget) * 100

  return (
    <DashboardCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-neutral-800">Budget</h3>
        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-green-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Total Budget</span>
          <span className="font-semibold text-neutral-800">${totalBudget.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Spent</span>
          <span className="font-semibold text-red-600">${spent.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Remaining</span>
          <span className="font-semibold text-green-600">${remaining.toLocaleString()}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

// RSVP Status Card
interface RSVPCardProps {
  confirmed: number
  pending: number
  total: number
}

export function RSVPCard({ confirmed, pending, total }: RSVPCardProps) {
  return (
    <DashboardCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-neutral-800">RSVP Status</h3>
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <Users className="w-4 h-4 text-blue-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-neutral-600">Confirmed</span>
          </div>
          <span className="font-semibold text-neutral-800">{confirmed}/{total}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-neutral-600">Pending</span>
          </div>
          <span className="font-semibold text-orange-500">{pending}</span>
        </div>
      </div>
    </DashboardCard>
  )
}

// Packing Card
interface PackingCardProps {
  packed: number
  total: number
}

export function PackingCard({ packed, total }: PackingCardProps) {
  const packedPercentage = (packed / total) * 100

  return (
    <DashboardCard className="flex-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-neutral-800">Packing</h3>
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <Package className="w-4 h-4 text-purple-600" />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-neutral-800 mb-1">
          {packed}/{total}
        </div>
        <div className="text-sm text-neutral-600 mb-3">Items packed</div>
        
        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${packedPercentage}%` }}
          />
        </div>
      </div>
    </DashboardCard>
  )
}

// Events Card
interface EventsCardProps {
  upcoming: number
  totalPlanned: number
}

export function EventsCard({ upcoming, totalPlanned }: EventsCardProps) {
  return (
    <DashboardCard className="flex-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-neutral-800">Events</h3>
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-orange-600" />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-neutral-800 mb-1">
          {upcoming}
        </div>
        <div className="text-sm text-neutral-600 mb-1">Upcoming</div>
        <div className="text-xs text-neutral-500">
          {totalPlanned} total planned
        </div>
      </div>
    </DashboardCard>
  )
}

// Quick Actions Card
interface QuickActionsProps {
  chatMessages: number
  photosShared: number
}

export function QuickActionsCard({ chatMessages, photosShared }: QuickActionsProps) {
  return (
    <DashboardCard>
      <div className="mb-3">
        <h3 className="font-semibold text-neutral-800">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Group Chat */}
        <button className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-neutral-800">Group Chat</div>
            <div className="text-xs text-blue-600">{chatMessages} new messages</div>
          </div>
        </button>
        
        {/* Photos */}
        <button className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Camera className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-neutral-800">Photos</div>
            <div className="text-xs text-green-600">{photosShared} shared</div>
          </div>
        </button>
      </div>
    </DashboardCard>
  )
}

// Trip Header Component
interface TripHeaderProps {
  tripName: string
  hostName: string
  location: string
  imageUrl: string
}

export function TripHeader({ tripName, hostName, location, imageUrl }: TripHeaderProps) {
  return (
    <div className="relative">
      {/* Trip Image */}
      <div className="h-48 rounded-2xl overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={tripName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Location Badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-2">
          <MapPin className="w-3 h-3 text-neutral-600" />
          <span className="text-xs font-medium text-neutral-800">{location}</span>
        </div>
      </div>
      
      {/* Trip Info */}
      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-1">{tripName}</h1>
        <p className="text-neutral-600">by {hostName}</p>
      </div>
    </div>
  )
}
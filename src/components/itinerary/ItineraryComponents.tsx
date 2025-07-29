'use client'

import { 
  Clock, 
  MapPin, 
  Users, 
  Star,
  ChevronRight,
  Calendar
} from 'lucide-react'

// Types for itinerary data
export interface ItineraryEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  description?: string
  category: 'transport' | 'meal' | 'activity' | 'accommodation'
  rsvpStatus: 'going' | 'maybe' | 'not-going'
  attendees: {
    going: number
    total: number
  }
  rating?: number
  createdBy: string
}

export interface ItineraryDay {
  date: string
  dayName: string
  events: ItineraryEvent[]
}

// Category Badge Component
interface CategoryBadgeProps {
  category: ItineraryEvent['category']
}

function CategoryBadge({ category }: CategoryBadgeProps) {
  const styles = {
    transport: 'bg-purple-100 text-purple-700 border-purple-200',
    meal: 'bg-green-100 text-green-700 border-green-200',  
    activity: 'bg-blue-100 text-blue-700 border-blue-200',
    accommodation: 'bg-orange-100 text-orange-700 border-orange-200'
  }

  const labels = {
    transport: 'transport',
    meal: 'meal',
    activity: 'activity', 
    accommodation: 'stay'
  }

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${styles[category]}`}>
      {labels[category]}
    </span>
  )
}

// RSVP Status Badge Component  
interface RSVPBadgeProps {
  status: ItineraryEvent['rsvpStatus']
}

function RSVPBadge({ status }: RSVPBadgeProps) {
  const styles = {
    'going': 'bg-green-100 text-green-700 border-green-200',
    'maybe': 'bg-orange-100 text-orange-700 border-orange-200',
    'not-going': 'bg-red-100 text-red-700 border-red-200'
  }

  const labels = {
    'going': 'Going',
    'maybe': 'Maybe', 
    'not-going': 'Not Going'
  }

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

// Star Rating Component
interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md'
}

function StarRating({ rating, size = 'sm' }: StarRatingProps) {
  const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star 
          key={i}
          className={`${starSize} ${
            i < rating 
              ? 'text-green-500 fill-green-500' 
              : 'text-neutral-300'
          }`}
        />
      ))}
    </div>
  )
}

// Event Card Component
interface EventCardProps {
  event: ItineraryEvent
  onClick?: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow-trip-lg cursor-pointer hover:shadow-xl transition-all duration-200"
      onClick={onClick}
    >
      {/* Header with badges */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CategoryBadge category={event.category} />
          <RSVPBadge status={event.rsvpStatus} />
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400" />
      </div>

      {/* Event Title */}
      <h3 className="font-semibold text-neutral-800 mb-3">
        {event.title}
      </h3>

      {/* Event Details */}
      <div className="space-y-2">
        {/* Time */}
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Clock className="w-4 h-4" />
          <span>{event.time}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>

        {/* RSVP Count and Rating */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Users className="w-4 h-4" />
            <span>{event.attendees.going}/{event.attendees.total} going</span>
          </div>
          
          {event.rating && (
            <StarRating rating={event.rating} />
          )}
        </div>
      </div>
    </div>
  )
}

// Date Section Component
interface DateSectionProps {
  day: ItineraryDay
  onEventClick?: (event: ItineraryEvent) => void
}

export function DateSection({ day, onEventClick }: DateSectionProps) {
  return (
    <div className="mb-6">
      {/* Date Header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <Calendar className="w-4 h-4 text-blue-600" />
        <h2 className="text-lg font-semibold text-neutral-800">
          {day.dayName}
        </h2>
      </div>

      {/* Events for this day */}
      <div className="space-y-3">
        {day.events.map((event) => (
          <EventCard 
            key={event.id}
            event={event}
            onClick={() => onEventClick?.(event)}
          />
        ))}
      </div>
    </div>
  )
}

// Empty State Component
export function ItineraryEmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
        No Events Yet
      </h3>
      <p className="text-neutral-600 mb-6">
        Start planning your trip by adding your first event or activity.
      </p>
    </div>
  )
}
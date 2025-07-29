'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
  DateSection, 
  ItineraryEmptyState,
  type ItineraryDay,
  type ItineraryEvent
} from '@/components/itinerary/ItineraryComponents'
import { AddEditEventModal } from '@/components/itinerary/AddEditEventModal'
import { Plus } from 'lucide-react'

// Mock data matching the design from the image
const initialItineraryData: ItineraryDay[] = [
  {
    date: '2024-08-15',
    dayName: 'Thursday, August 15',
    events: [
      {
        id: '1',
        title: 'Airport Pickup',
        date: '2024-08-15',
        time: '14:30',
        location: 'Ngurah Rai International Airport',
        category: 'transport',
        rsvpStatus: 'going',
        attendees: {
          going: 6,
          total: 8
        },
        rating: 5,
        createdBy: 'host'
      },
      {
        id: '2', 
        title: 'Welcome Dinner',
        date: '2024-08-15',
        time: '19:00',
        location: 'Seaside Restaurant, Seminyak',
        category: 'meal',
        rsvpStatus: 'going',
        attendees: {
          going: 7,
          total: 8
        },
        rating: 5,
        createdBy: 'host'
      }
    ]
  },
  {
    date: '2024-08-16',
    dayName: 'Friday, August 16',
    events: [
      {
        id: '3',
        title: 'Temple Tour',
        date: '2024-08-16', 
        time: '09:00',
        location: 'Tanah Lot Temple',
        category: 'activity',
        rsvpStatus: 'maybe',
        attendees: {
          going: 5,
          total: 8
        },
        rating: 5,
        createdBy: 'host'
      },
      {
        id: '4',
        title: 'Beach Day',
        date: '2024-08-16',
        time: '15:00', 
        location: 'Kuta Beach',
        category: 'activity',
        rsvpStatus: 'going',
        attendees: {
          going: 8,
          total: 8
        },
        rating: 4,
        createdBy: 'host'
      }
    ]
  },
  {
    date: '2024-08-17',
    dayName: 'Saturday, August 17',
    events: [
      {
        id: '5',
        title: 'Sunrise Hike',
        date: '2024-08-17',
        time: '05:30',
        location: 'Mount Batur',
        category: 'activity', 
        rsvpStatus: 'going',
        attendees: {
          going: 4,
          total: 8
        },
        rating: 5,
        createdBy: 'guest'
      }
    ]
  }
]

export default function ItineraryPage() {
  const [itineraryData, setItineraryData] = useState<ItineraryDay[]>(initialItineraryData)
  const [selectedEvent, setSelectedEvent] = useState<ItineraryEvent | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ItineraryEvent | null>(null)
  
  const handleEventClick = (event: ItineraryEvent) => {
    setSelectedEvent(event)
  }

  const handleAddEvent = () => {
    setShowAddModal(true)
  }

  const handleEditEvent = (event: ItineraryEvent) => {
    setEditingEvent(event)
  }

  const handleSaveEvent = async (eventData: Partial<ItineraryEvent>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingEvent) {
      // Update existing event
      setItineraryData(prevData => 
        prevData.map(day => ({
          ...day,
          events: day.events.map(event => 
            event.id === editingEvent.id 
              ? { ...event, ...eventData } as ItineraryEvent
              : event
          )
        }))
      )
      setEditingEvent(null)
    } else {
      // Add new event
      const newEvent = eventData as ItineraryEvent
      const eventDate = newEvent.date
      
      setItineraryData(prevData => {
        // Find existing day or create new one
        const existingDayIndex = prevData.findIndex(day => day.date === eventDate)
        
        if (existingDayIndex >= 0) {
          // Add to existing day
          const updatedData = [...prevData]
          updatedData[existingDayIndex] = {
            ...updatedData[existingDayIndex],
            events: [...updatedData[existingDayIndex].events, newEvent]
          }
          return updatedData
        } else {
          // Create new day
          const newDay: ItineraryDay = {
            date: eventDate,
            dayName: new Date(eventDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            events: [newEvent]
          }
          return [...prevData, newDay].sort((a, b) => a.date.localeCompare(b.date))
        }
      })
      setShowAddModal(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Itinerary</h1>
            <p className="text-neutral-600">Your trip schedule and activities</p>
          </div>
          <button 
            onClick={handleAddEvent}
            className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Timeline */}
        {itineraryData.length > 0 ? (
          <div className="space-y-6">
            {itineraryData.map((day) => (
              <DateSection
                key={day.date}
                day={day}
                onEventClick={handleEventClick}
              />
            ))}
          </div>
        ) : (
          <ItineraryEmptyState />
        )}

        {/* Add Event Modal */}
        <AddEditEventModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveEvent}
          mode="add"
        />

        {/* Edit Event Modal */}
        <AddEditEventModal
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSaveEvent}
          event={editingEvent || undefined}
          mode="edit"
        />

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
            <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-neutral-800">
                    {selectedEvent.title}
                  </h2>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {selectedEvent.category.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">Category</p>
                      <p className="text-sm text-neutral-600 capitalize">{selectedEvent.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">📅</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">When</p>
                      <p className="text-sm text-neutral-600">{selectedEvent.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">📍</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">Location</p>
                      <p className="text-sm text-neutral-600">{selectedEvent.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-orange-600">👥</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">Attendees</p>
                      <p className="text-sm text-neutral-600">
                        {selectedEvent.attendees.going}/{selectedEvent.attendees.total} going
                      </p>
                    </div>
                  </div>

                  {selectedEvent.description && (
                    <div className="pt-4 border-t border-neutral-100">
                      <p className="font-medium text-neutral-800 mb-2">Description</p>
                      <p className="text-sm text-neutral-600">{selectedEvent.description}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => {
                      setSelectedEvent(null)
                      handleEditEvent(selectedEvent)
                    }}
                    className="flex-1 bg-blue-50 text-blue-600 font-medium py-3 px-4 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    Edit Event
                  </button>
                  <button 
                    onClick={() => {
                      // TODO: Toggle RSVP status
                      console.log('Toggle RSVP for:', selectedEvent.title)
                    }}
                    className="flex-1 bg-green-50 text-green-600 font-medium py-3 px-4 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    {selectedEvent.rsvpStatus === 'going' ? 'Change RSVP' : 'Join Event'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add some bottom padding for the navigation */}
        <div className="h-6" />
      </div>
    </AppShell>
  )
}
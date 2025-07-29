'use client'

import { useState } from 'react'
import { TripButton } from '@/components/ui/trip-button'
import { TripInput } from '@/components/ui/trip-input'
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Tag,
  Save
} from 'lucide-react'
import type { ItineraryEvent } from './ItineraryComponents'

interface AddEditEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Partial<ItineraryEvent>) => void
  event?: ItineraryEvent // For editing existing events
  mode: 'add' | 'edit'
}

interface EventFormData {
  title: string
  date: string
  time: string
  location: string
  description: string
  category: ItineraryEvent['category']
}

export function AddEditEventModal({ 
  isOpen, 
  onClose, 
  onSave, 
  event, 
  mode 
}: AddEditEventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: event?.title || '',
    date: event?.date || '',
    time: event?.time || '',
    location: event?.location || '',
    description: event?.description || '',
    category: event?.category || 'activity'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Event title is required')
      return
    }
    if (!formData.date) {
      setError('Date is required')
      return
    }
    if (!formData.time) {
      setError('Time is required')
      return
    }
    if (!formData.location.trim()) {
      setError('Location is required')
      return
    }

    setLoading(true)
    
    try {
      // Create event object
      const eventData: Partial<ItineraryEvent> = {
        ...formData,
        id: event?.id || `event-${Date.now()}`,
        rsvpStatus: event?.rsvpStatus || 'going',
        attendees: event?.attendees || { going: 1, total: 8 },
        createdBy: event?.createdBy || 'current-user'
      }

      await onSave(eventData)
      onClose()
    } catch {
      setError('Failed to save event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-800">
            {mode === 'add' ? 'Add Event' : 'Edit Event'}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Event Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-neutral-800">
              Event Title
            </label>
            <TripInput
              id="title"
              type="text"
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              leftIcon={<FileText className="h-4 w-4" />}
              disabled={loading}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-neutral-800">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value as ItineraryEvent['category'])}
                className="w-full h-input bg-input-background rounded-xl text-base text-neutral-800 pl-10 pr-4 border-0 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all duration-200"
                disabled={loading}
              >
                <option value="activity">Activity</option>
                <option value="meal">Meal</option>
                <option value="transport">Transport</option>
                <option value="accommodation">Accommodation</option>
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-neutral-800">
                Date
              </label>
              <TripInput
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                leftIcon={<Calendar className="h-4 w-4" />}
                disabled={loading}
                required
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium text-neutral-800">
                Time
              </label>
              <TripInput
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                leftIcon={<Clock className="h-4 w-4" />}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-neutral-800">
              Location
            </label>
            <TripInput
              id="location"
              type="text"
              placeholder="Enter location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              leftIcon={<MapPin className="h-4 w-4" />}
              disabled={loading}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-neutral-800">
              Description (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-neutral-500 h-4 w-4" />
              <textarea
                id="description"
                placeholder="Add event description..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full bg-input-background rounded-xl text-base text-neutral-800 placeholder:text-neutral-500 pl-10 pr-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all duration-200 resize-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <TripButton
              type="button"
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </TripButton>
            
            <TripButton
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
              loading={loading}
              disabled={loading}
            >
              {loading ? (mode === 'add' ? 'Adding...' : 'Saving...') : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'add' ? 'Add Event' : 'Save Changes'}
                </>
              )}
            </TripButton>
          </div>
        </form>
      </div>
    </div>
  )
}
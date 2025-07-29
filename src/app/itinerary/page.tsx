'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Calendar, Plus } from 'lucide-react'

export default function ItineraryPage() {
  return (
    <AppShell>
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Itinerary</h1>
            <p className="text-neutral-600">Plan your perfect trip schedule</p>
          </div>
          <button className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Coming Soon */}
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            Itinerary Planning
          </h3>
          <p className="text-neutral-600 mb-6">
            Create day-by-day schedules, add activities, and coordinate with your group.
          </p>
          <div className="text-sm text-neutral-500">
            Coming soon...
          </div>
        </div>
      </div>
    </AppShell>
  )
}
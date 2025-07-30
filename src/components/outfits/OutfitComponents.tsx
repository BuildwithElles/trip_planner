'use client'

import { useState } from 'react'
import { 
  Shirt, 
  Edit3,
  Check,
  Calendar,
  Image as ImageIcon
} from 'lucide-react'

// Types for outfit data
export interface OutfitItem {
  id: string
  name: string
  isComplete: boolean
}

export interface Outfit {
  id: string
  name: string
  eventId: string
  eventName: string
  status: 'pending' | 'in-progress' | 'almost-ready' | 'ready'
  completionPercentage: number
  imageUrl?: string
  items: OutfitItem[]
  createdBy: string
  createdAt: string
}

export interface OutfitProgress {
  totalOutfits: number
  completedOutfits: number
  progressPercentage: number
}

// Outfit Progress Card Component
interface OutfitProgressCardProps {
  progress: OutfitProgress
}

export function OutfitProgressCard({ progress }: OutfitProgressCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-trip-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Shirt className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800">Overall Readiness</h3>
            <p className="text-sm text-neutral-600">{progress.progressPercentage}% complete</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600">{progress.progressPercentage}%</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 rounded-full h-3">
        <div 
          className="bg-neutral-800 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress.progressPercentage}%` }}
        />
      </div>
    </div>
  )
}

// Outfit Status Badge Component
interface OutfitStatusBadgeProps {
  status: Outfit['status']
  completionPercentage: number
}

function OutfitStatusBadge({ status, completionPercentage }: OutfitStatusBadgeProps) {
  const statusConfig = {
    'pending': { 
      label: 'Pending', 
      color: 'bg-neutral-100 text-neutral-600',
      textColor: 'text-neutral-600'
    },
    'in-progress': { 
      label: 'In Progress', 
      color: 'bg-orange-100 text-orange-700',
      textColor: 'text-orange-600'
    },
    'almost-ready': { 
      label: 'Almost Ready', 
      color: 'bg-blue-100 text-blue-700',
      textColor: 'text-blue-600'
    },
    'ready': { 
      label: 'Ready', 
      color: 'bg-green-100 text-green-700',
      textColor: 'text-green-600'
    }
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
      <span className={`text-sm font-medium ${config.textColor}`}>
        {completionPercentage}%
      </span>
    </div>
  )
}

// Outfit Item Checkbox Component
interface OutfitItemCheckboxProps {
  item: OutfitItem
  onToggle: (itemId: string, isComplete: boolean) => void
  disabled?: boolean
}

function OutfitItemCheckbox({ item, onToggle, disabled }: OutfitItemCheckboxProps) {
  return (
    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={(e) => onToggle(item.id, e.target.checked)}
        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
        disabled={disabled}
      />
      <span className={`text-sm ${item.isComplete ? 'text-neutral-500 line-through' : 'text-neutral-800'}`}>
        {item.name}
      </span>
      {item.isComplete && (
        <Check className="w-3 h-3 text-green-600" />
      )}
    </label>
  )
}

// Outfit Card Component
interface OutfitCardProps {
  outfit: Outfit
  onToggleItem: (outfitId: string, itemId: string, isComplete: boolean) => void
  onEdit?: (outfit: Outfit) => void
}

export function OutfitCard({ outfit, onToggleItem, onEdit }: OutfitCardProps) {
  const [showItems, setShowItems] = useState(false)

  return (
    <div className="bg-white rounded-2xl p-4 shadow-trip-lg mb-4">
      {/* Outfit Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Outfit Image */}
        <div className="w-16 h-16 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {outfit.imageUrl ? (
            <img 
              src={outfit.imageUrl} 
              alt={outfit.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-neutral-400" />
          )}
        </div>

        {/* Outfit Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-neutral-800">
              {outfit.name}
            </h3>
            {onEdit && (
              <button
                onClick={() => onEdit(outfit)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <Edit3 className="w-4 h-4 text-neutral-500" />
              </button>
            )}
          </div>

          {/* Connected Event */}
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3 h-3 text-neutral-500" />
            <span className="text-xs text-neutral-500">{outfit.eventName}</span>
          </div>

          {/* Status and Progress */}
          <OutfitStatusBadge 
            status={outfit.status} 
            completionPercentage={outfit.completionPercentage} 
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
        <div 
          className="bg-neutral-800 h-2 rounded-full transition-all duration-300"
          style={{ width: `${outfit.completionPercentage}%` }}
        />
      </div>

      {/* Toggle Items View */}
      <button
        onClick={() => setShowItems(!showItems)}
        className="w-full text-left text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {showItems ? 'Hide Items' : `View ${outfit.items.length} Items`}
      </button>

      {/* Outfit Items */}
      {showItems && (
        <div className="mt-4 space-y-1 border-t border-neutral-100 pt-4">
          {outfit.items.map((item) => (
            <OutfitItemCheckbox
              key={item.id}
              item={item}
              onToggle={(itemId, isComplete) => onToggleItem(outfit.id, itemId, isComplete)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Outfits Empty State
export function OutfitsEmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
        <Shirt className="w-8 h-8 text-purple-600" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
        No Outfits Yet
      </h3>
      <p className="text-neutral-600 mb-6">
        Start planning your looks by creating outfits for each event.
      </p>
    </div>
  )
}

// Helper function to calculate outfit progress
export function calculateOutfitProgress(outfits: Outfit[]): OutfitProgress {
  const totalOutfits = outfits.length
  const completedOutfits = outfits.filter(outfit => outfit.status === 'ready').length
  const progressPercentage = totalOutfits > 0 ? Math.round((completedOutfits / totalOutfits) * 100) : 0

  // If no completed outfits, calculate based on average completion
  const averageCompletion = totalOutfits > 0 
    ? Math.round(outfits.reduce((sum, outfit) => sum + outfit.completionPercentage, 0) / totalOutfits)
    : 0

  return {
    totalOutfits,
    completedOutfits,
    progressPercentage: completedOutfits > 0 ? progressPercentage : averageCompletion
  }
}

// Helper function to determine outfit status based on completion
export function determineOutfitStatus(completionPercentage: number): Outfit['status'] {
  if (completionPercentage === 0) return 'pending'
  if (completionPercentage < 50) return 'in-progress'
  if (completionPercentage < 100) return 'almost-ready'
  return 'ready'
}
'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
  OutfitProgressCard,
  OutfitCard,
  OutfitsEmptyState,
  calculateOutfitProgress,
  determineOutfitStatus,
  type Outfit
} from '@/components/outfits/OutfitComponents'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock data matching the design from the image
const initialOutfitData: Outfit[] = [
  {
    id: '1',
    name: 'Welcome Dinner Look',
    eventId: 'event-1',
    eventName: 'Welcome Dinner',
    status: 'in-progress',
    completionPercentage: 60,
    imageUrl: '/outfit-1.jpg', // This would be a real image URL
    items: [
      { id: 'item-1', name: 'Floral dress', isComplete: true },
      { id: 'item-2', name: 'Strappy sandals', isComplete: true },
      { id: 'item-3', name: 'Evening clutch', isComplete: false },
      { id: 'item-4', name: 'Gold jewelry', isComplete: true },
      { id: 'item-5', name: 'Light cardigan', isComplete: false }
    ],
    createdBy: 'user1',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Temple Visit Attire',
    eventId: 'event-2',
    eventName: 'Temple Tour',
    status: 'almost-ready',
    completionPercentage: 75,
    items: [
      { id: 'item-6', name: 'Modest long dress', isComplete: true },
      { id: 'item-7', name: 'Comfortable flats', isComplete: true },
      { id: 'item-8', name: 'Light scarf', isComplete: true },
      { id: 'item-9', name: 'Small backpack', isComplete: false }
    ],
    createdBy: 'user1',
    createdAt: '2024-01-15T11:00:00Z'
  }
]

export default function OutfitsPage() {
  const [outfitData, setOutfitData] = useState<Outfit[]>(initialOutfitData)
  
  // Toast notifications
  const { toasts, removeToast, showSuccess } = useToast()
  
  // Calculate progress data
  const outfitProgress = calculateOutfitProgress(outfitData)

  const handleToggleItem = async (outfitId: string, itemId: string, isComplete: boolean) => {
    // Update outfit item status
    setOutfitData(prevData => 
      prevData.map(outfit => 
        outfit.id === outfitId 
          ? {
              ...outfit,
              items: outfit.items.map(item => 
                item.id === itemId ? { ...item, isComplete } : item
              )
            }
          : outfit
      )
    )

    // Recalculate completion percentage and status
    setOutfitData(prevData =>
      prevData.map(outfit => {
        if (outfit.id === outfitId) {
          const completedItems = outfit.items.filter(item => 
            item.id === itemId ? isComplete : item.isComplete
          ).length
          const completionPercentage = Math.round((completedItems / outfit.items.length) * 100)
          const status = determineOutfitStatus(completionPercentage)

          return {
            ...outfit,
            completionPercentage,
            status
          }
        }
        return outfit
      })
    )
    
    // Show toast notification
    const outfitName = outfitData.find(o => o.id === outfitId)?.name || 'Outfit'
    const itemName = outfitData.find(o => o.id === outfitId)?.items.find(i => i.id === itemId)?.name || 'Item'
    
    if (isComplete) {
      showSuccess('Item Completed! ✅', `${itemName} added to ${outfitName}`)
    } else {
      showSuccess('Item Updated', `${itemName} removed from ${outfitName}`)
    }
  }

  const handleEditOutfit = (outfit: Outfit) => {
    // TODO: Open edit outfit modal
    console.log('Edit outfit:', outfit.name)
  }

  const handleAddOutfit = () => {
    // TODO: Open add outfit modal
    console.log('Add outfit clicked')
  }

  return (
    <AppShell>
      <div className="max-w-md mx-auto p-4">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link 
              href="/more"
              className="w-10 h-10 rounded-xl bg-white shadow-trip-lg flex items-center justify-center hover:shadow-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">Outfits</h1>
              <p className="text-neutral-600">Plan your looks for each event</p>
            </div>
          </div>
          <button 
            onClick={handleAddOutfit}
            className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Outfit Progress */}
        <OutfitProgressCard progress={outfitProgress} />

        {/* Outfit Grid */}
        {outfitData.length > 0 ? (
          <div className="space-y-4">
            {outfitData.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                onToggleItem={handleToggleItem}
                onEdit={handleEditOutfit}
              />
            ))}
          </div>
        ) : (
          <OutfitsEmptyState />
        )}

        {/* Add some bottom padding for the navigation */}
        <div className="h-6" />
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AppShell>
  )
}
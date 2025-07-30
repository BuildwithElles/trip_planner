'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
  PackingProgressCard,
  PackingCategorySection,
  PackingEmptyState,
  organizePackingByCategory,
  calculatePackingProgress,
  type PackingItem
} from '@/components/packing/PackingComponents'
import { AddEditPackingModal } from '@/components/packing/AddEditPackingModal'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { Plus } from 'lucide-react'

// Mock data matching the design from the image
const initialPackingData: PackingItem[] = [
  {
    id: '1',
    title: 'Swimwear',
    category: 'clothing',
    assignedTo: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'],
    packedBy: ['user1', 'user2', 'user3'], // 3/6 packed = 50%
    createdBy: 'host',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Casual Dresses',
    category: 'clothing',
    assignedTo: ['user2', 'user4', 'user6'],
    packedBy: ['user2'], // 1/3 packed = 33%
    createdBy: 'host',
    createdAt: '2024-01-15T11:00:00Z'
  },
  {
    id: '3',
    title: 'Sunscreen',
    category: 'toiletries',
    assignedTo: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'],
    packedBy: ['user1'], // 1/6 packed = 17%
    createdBy: 'host',
    createdAt: '2024-01-15T12:00:00Z'
  }
]

export default function PackingPage() {
  const [packingData, setPackingData] = useState<PackingItem[]>(initialPackingData)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<PackingItem['category'] | null>(null)
  
  // Toast notifications
  const { toasts, removeToast, showSuccess, showError } = useToast()
  
  // Calculate progress data
  const packingProgress = calculatePackingProgress(packingData)
  
  // Organize data by categories
  const packingCategories = organizePackingByCategory(packingData)

  const handleAddItem = (category?: PackingItem['category']) => {
    setSelectedCategory(category || null)
    setShowAddModal(true)
  }

  const handleEditItem = (item: PackingItem) => {
    setEditingItem(item)
  }

  const handleTogglePacked = async (itemId: string, userId: string, isPacked: boolean) => {
    // Find the item to get its title
    const item = packingData.find(item => item.id === itemId)
    const itemTitle = item?.title || 'Item'
    
    // Update packing status
    setPackingData(prevData => 
      prevData.map(item => 
        item.id === itemId 
          ? {
              ...item,
              packedBy: isPacked 
                ? [...item.packedBy, userId]
                : item.packedBy.filter(id => id !== userId)
            }
          : item
      )
    )
    
    // Show toast notification
    if (isPacked) {
      showSuccess('Item Packed! 📦', `${itemTitle} has been marked as packed`)
    } else {
      showSuccess('Item Unpacked', `${itemTitle} has been marked as unpacked`)
    }
  }

  const handleSaveItem = async (itemData: Partial<PackingItem>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingItem) {
        // Update existing item
        setPackingData(prevData => 
          prevData.map(item => 
            item.id === editingItem.id 
              ? { ...item, ...itemData } as PackingItem
              : item
          )
        )
        setEditingItem(null)
        showSuccess('Packing Item Updated! ✏️', `${itemData.title} has been saved`)
      } else {
        // Add new item
        const newItem = itemData as PackingItem
        setPackingData(prevData => [...prevData, newItem])
        setShowAddModal(false)
        setSelectedCategory(null)
        showSuccess('Packing Item Added! ➕', `${itemData.title} has been added to your packing list`)
      }
    } catch {
      showError('Error', 'Failed to save packing item. Please try again.')
    }
  }

  return (
    <AppShell>
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Packing List</h1>
            <p className="text-neutral-600">Organize your trip essentials</p>
          </div>
          <button 
            onClick={() => handleAddItem()}
            className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Packing Progress */}
        <PackingProgressCard progress={packingProgress} />

        {/* Packing Categories */}
        {packingCategories.length > 0 ? (
          <div className="space-y-6">
            {packingCategories.map((category) => (
              <PackingCategorySection
                key={category.category}
                category={category}
                onTogglePacked={handleTogglePacked}
                onEditItem={handleEditItem}
                onAddItem={handleAddItem}
              />
            ))}
          </div>
        ) : (
          <PackingEmptyState />
        )}

        {/* Add Packing Item Modal */}
        <AddEditPackingModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setSelectedCategory(null)
          }}
          onSave={handleSaveItem}
          mode="add"
          defaultCategory={selectedCategory || 'clothing'}
        />

        {/* Edit Packing Item Modal */}
        <AddEditPackingModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveItem}
          item={editingItem || undefined}
          mode="edit"
        />

        {/* Add some bottom padding for the navigation */}
        <div className="h-6" />
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AppShell>
  )
}
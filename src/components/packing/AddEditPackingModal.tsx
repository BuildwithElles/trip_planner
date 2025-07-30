'use client'

import { useState } from 'react'
import { TripButton } from '@/components/ui/trip-button'
import { TripInput } from '@/components/ui/trip-input'
import { 
  X, 
  Package, 
  FileText, 
  Tag,
  Users,
  Save
} from 'lucide-react'
import type { PackingItem } from './PackingComponents'

interface AddEditPackingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Partial<PackingItem>) => void
  item?: PackingItem // For editing existing items
  mode: 'add' | 'edit'
  defaultCategory?: PackingItem['category']
}

interface PackingFormData {
  title: string
  category: PackingItem['category']
  assignToAll: boolean
  assignedTo: string[]
}

// Mock users for selection
const mockUsers = [
  { id: 'user1', name: 'Alex', avatar: '👤' },
  { id: 'user2', name: 'Sam', avatar: '👤' },
  { id: 'user3', name: 'Jordan', avatar: '👤' },
  { id: 'user4', name: 'Casey', avatar: '👤' },
  { id: 'user5', name: 'Taylor', avatar: '👤' },
  { id: 'user6', name: 'Morgan', avatar: '👤' }
]

export function AddEditPackingModal({ 
  isOpen, 
  onClose, 
  onSave, 
  item, 
  mode,
  defaultCategory = 'clothing'
}: AddEditPackingModalProps) {
  const [formData, setFormData] = useState<PackingFormData>({
    title: item?.title || '',
    category: item?.category || defaultCategory,
    assignToAll: item ? item.assignedTo.length === mockUsers.length : true,
    assignedTo: item?.assignedTo || mockUsers.map(user => user.id)
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof PackingFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAssignToAllToggle = (assignToAll: boolean) => {
    setFormData(prev => ({
      ...prev,
      assignToAll,
      assignedTo: assignToAll ? mockUsers.map(user => user.id) : []
    }))
  }

  const handleUserToggle = (userId: string, selected: boolean) => {
    setFormData(prev => {
      const newAssignedTo = selected 
        ? [...prev.assignedTo, userId]
        : prev.assignedTo.filter(id => id !== userId)
      
      return {
        ...prev,
        assignedTo: newAssignedTo,
        assignToAll: newAssignedTo.length === mockUsers.length
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Item title is required')
      return
    }
    if (!formData.assignedTo.length) {
      setError('Please assign this item to at least one person')
      return
    }

    setLoading(true)
    
    try {
      // Create packing item object
      const packingData: Partial<PackingItem> = {
        ...formData,
        id: item?.id || `packing-${Date.now()}`,
        packedBy: item?.packedBy || [],
        createdBy: item?.createdBy || 'current-user',
        createdAt: item?.createdAt || new Date().toISOString()
      }

      await onSave(packingData)
      onClose()
    } catch {
      setError('Failed to save packing item. Please try again.')
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
            {mode === 'add' ? 'Add Packing Item' : 'Edit Packing Item'}
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
          {/* Item Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-neutral-800">
              Item Title
            </label>
            <TripInput
              id="title"
              type="text"
              placeholder="e.g., Swimwear, Sunscreen, Phone Charger"
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
                onChange={(e) => handleChange('category', e.target.value as PackingItem['category'])}
                className="w-full h-input bg-input-background rounded-xl text-base text-neutral-800 pl-10 pr-4 border-0 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all duration-200"
                disabled={loading}
              >
                <option value="clothing">👕 Clothing</option>
                <option value="toiletries">💄 Toiletries</option>
                <option value="electronics">🔌 Electronics</option>
                <option value="documents">📄 Documents</option>
                <option value="accessories">👜 Accessories</option>
              </select>
            </div>
          </div>

          {/* Assign To */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-800">
              Assign To
            </label>
            
            {/* Assign to All Toggle */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-800">
                  Assign to All Trip Members
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleAssignToAllToggle(!formData.assignToAll)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.assignToAll ? 'bg-blue-500' : 'bg-neutral-200'
                }`}
                disabled={loading}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.assignToAll ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Individual User Selection */}
            {!formData.assignToAll && (
              <div className="space-y-2">
                <p className="text-sm text-neutral-600">Select individual members:</p>
                <div className="grid grid-cols-2 gap-2">
                  {mockUsers.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(user.id)}
                        onChange={(e) => handleUserToggle(user.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <span className="text-sm text-neutral-800">{user.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Assignment Summary */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Package className="w-4 h-4" />
                <span>
                  {formData.assignedTo.length === mockUsers.length 
                    ? 'Assigned to all members' 
                    : `Assigned to ${formData.assignedTo.length} member${formData.assignedTo.length !== 1 ? 's' : ''}`
                  }
                </span>
              </div>
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
                  {mode === 'add' ? 'Add Item' : 'Save Changes'}
                </>
              )}
            </TripButton>
          </div>
        </form>
      </div>
    </div>
  )
}
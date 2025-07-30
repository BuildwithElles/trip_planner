'use client'

import { 
  Package, 
  Shirt, 
  Heart, 
  Plus,
  Edit3,
  Users,
  Check
} from 'lucide-react'

// Types for packing data
export interface PackingItem {
  id: string
  title: string
  category: 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'accessories'
  assignedTo: string[]
  packedBy: string[]
  createdBy: string
  createdAt: string
}

export interface PackingCategory {
  category: PackingItem['category']
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  items: PackingItem[]
  totalItems: number
  completedItems: number
  progressPercentage: number
}

export interface PackingProgress {
  totalItems: number
  packedItems: number
  progressPercentage: number
}

// Mock users for demonstration
const mockUsers = [
  { id: 'user1', name: 'Alex', avatar: '👤' },
  { id: 'user2', name: 'Sam', avatar: '👤' },
  { id: 'user3', name: 'Jordan', avatar: '👤' },
  { id: 'user4', name: 'Casey', avatar: '👤' },
  { id: 'user5', name: 'Taylor', avatar: '👤' },
  { id: 'user6', name: 'Morgan', avatar: '👤' }
]

// Progress Card Component
interface PackingProgressCardProps {
  progress: PackingProgress
}

export function PackingProgressCard({ progress }: PackingProgressCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-trip-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800">Your Progress</h3>
            <p className="text-sm text-neutral-600">{progress.progressPercentage}% complete</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{progress.progressPercentage}%</p>
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

// User Checkbox Component
interface UserCheckboxProps {
  user: { id: string; name: string; avatar: string }
  isChecked: boolean
  onChange: (userId: string, checked: boolean) => void
  disabled?: boolean
}

function UserCheckbox({ user, isChecked, onChange, disabled }: UserCheckboxProps) {
  return (
    <button
      onClick={() => onChange(user.id, !isChecked)}
      disabled={disabled}
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
        isChecked 
          ? 'bg-green-500 text-white' 
          : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={`${user.name} - ${isChecked ? 'Packed' : 'Not packed'}`}
    >
      {isChecked ? <Check className="w-4 h-4" /> : user.avatar}
    </button>
  )
}

// Packing Item Card
interface PackingItemCardProps {
  item: PackingItem
  onTogglePacked: (itemId: string, userId: string, isPacked: boolean) => void
  onEdit?: (item: PackingItem) => void
}

function PackingItemCard({ item, onTogglePacked, onEdit }: PackingItemCardProps) {
  const packedCount = item.packedBy.length
  const totalCount = item.assignedTo.length
  const progressPercentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100 mb-3">
      {/* Item Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={packedCount === totalCount && totalCount > 0}
              onChange={() => {}}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              disabled
            />
            <h4 className="font-semibold text-neutral-800">
              {item.title}
            </h4>
          </div>
          
          {/* Progress Info */}
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
            <Users className="w-4 h-4" />
            <span>{packedCount}/{totalCount} packed</span>
            <span className="text-blue-600 font-medium">{progressPercentage}%</span>
          </div>
        </div>

        {/* Edit Button */}
        {onEdit && (
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-neutral-500" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* User Checkboxes */}
      <div className="flex items-center gap-2 flex-wrap">
        {mockUsers.filter(user => item.assignedTo.includes(user.id)).map((user) => (
          <UserCheckbox
            key={user.id}
            user={user}
            isChecked={item.packedBy.includes(user.id)}
            onChange={(userId, checked) => onTogglePacked(item.id, userId, checked)}
          />
        ))}
      </div>
    </div>
  )
}

// Packing Category Section
interface PackingCategorySectionProps {
  category: PackingCategory
  onTogglePacked: (itemId: string, userId: string, isPacked: boolean) => void
  onEditItem?: (item: PackingItem) => void
  onAddItem?: (category: PackingItem['category']) => void
}

export function PackingCategorySection({ 
  category, 
  onTogglePacked, 
  onEditItem, 
  onAddItem 
}: PackingCategorySectionProps) {
  const Icon = category.icon

  return (
    <div className="mb-6">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800">
              {category.name}
            </h3>
            <p className="text-sm text-neutral-600">
              {category.progressPercentage}% complete • {category.totalItems} items
            </p>
          </div>
        </div>

        {/* Add Item Button */}
        {onAddItem && (
          <button
            onClick={() => onAddItem(category.category)}
            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4 text-neutral-600" />
          </button>
        )}
      </div>

      {/* Category Progress Bar */}
      <div className="w-full bg-neutral-200 rounded-full h-3 mb-4">
        <div 
          className="bg-neutral-800 h-3 rounded-full transition-all duration-300"
          style={{ width: `${category.progressPercentage}%` }}
        />
      </div>

      {/* Category Items */}
      <div className="space-y-3">
        {category.items.map((item) => (
          <PackingItemCard
            key={item.id}
            item={item}
            onTogglePacked={onTogglePacked}
            onEdit={onEditItem}
          />
        ))}
      </div>
    </div>
  )
}

// Packing Empty State
export function PackingEmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
        <Package className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
        No Packing Items Yet
      </h3>
      <p className="text-neutral-600 mb-6">
        Start organizing your trip by adding packing list items.
      </p>
    </div>
  )
}

// Helper function to organize packing items by category
export function organizePackingByCategory(items: PackingItem[]): PackingCategory[] {
  const categoryConfig = {
    clothing: {
      name: 'Clothing',
      icon: Shirt,
      color: 'bg-blue-500'
    },
    toiletries: {
      name: 'Toiletries',
      icon: Heart,
      color: 'bg-pink-500'
    },
    electronics: {
      name: 'Electronics',
      icon: Package,
      color: 'bg-purple-500'
    },
    documents: {
      name: 'Documents',
      icon: Package,
      color: 'bg-orange-500'
    },
    accessories: {
      name: 'Accessories',
      icon: Package,
      color: 'bg-green-500'
    }
  }

  return Object.entries(categoryConfig).map(([key, config]) => {
    const categoryItems = items.filter(item => item.category === key)
    const totalItems = categoryItems.length
    const completedItems = categoryItems.filter(item => 
      item.assignedTo.length > 0 && item.packedBy.length === item.assignedTo.length
    ).length
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

    return {
      category: key as PackingItem['category'],
      name: config.name,
      icon: config.icon,
      color: config.color,
      items: categoryItems,
      totalItems,
      completedItems,
      progressPercentage
    }
  }).filter(category => category.items.length > 0)
}

// Helper function to calculate overall packing progress
export function calculatePackingProgress(items: PackingItem[]): PackingProgress {
  const totalAssignments = items.reduce((sum, item) => sum + item.assignedTo.length, 0)
  const packedAssignments = items.reduce((sum, item) => sum + item.packedBy.length, 0)
  const progressPercentage = totalAssignments > 0 ? Math.round((packedAssignments / totalAssignments) * 100) : 0

  return {
    totalItems: items.length,
    packedItems: items.filter(item => 
      item.assignedTo.length > 0 && item.packedBy.length === item.assignedTo.length
    ).length,
    progressPercentage
  }
}
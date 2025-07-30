'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
  BudgetSummaryCards,
  BudgetCategorySection,
  BudgetEmptyState,
  organizeBudgetByCategory,
  calculateBudgetSummary,
  type BudgetItem
} from '@/components/budget/BudgetComponents'
import { AddEditBudgetModal } from '@/components/budget/AddEditBudgetModal'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { Plus } from 'lucide-react'

// Mock data matching the design from the image
const initialBudgetData: BudgetItem[] = [
  {
    id: '1',
    title: 'Beach Resort Accommodation',
    description: 'Luxury beachfront resort stay',
    category: 'accommodation',
    amount: 160,
    perPerson: true,
    assignedTo: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
    isPaid: true,
    createdBy: 'host',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Airport Transfer',
    description: 'Round trip airport pickup and drop-off',
    category: 'transport',
    amount: 120,
    perPerson: false,
    assignedTo: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
    isPaid: true,
    createdBy: 'host',
    createdAt: '2024-01-15T11:00:00Z'
  },
  {
    id: '3',
    title: 'Welcome Dinner',
    description: 'Traditional dinner at Seaside Restaurant',
    category: 'food',
    amount: 45,
    perPerson: true,
    assignedTo: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
    isPaid: false,
    paidBy: 'user2',
    createdBy: 'host',
    createdAt: '2024-01-15T19:00:00Z'
  },
  {
    id: '4',
    title: 'Snorkeling',
    description: 'Half-day snorkeling experience with equipment',
    category: 'activities',
    amount: 65,
    perPerson: true,
    assignedTo: ['user1', 'user3', 'user4', 'user6', 'user7', 'user8'],
    isPaid: true,
    createdBy: 'user3',
    createdAt: '2024-01-16T09:00:00Z'
  },
  {
    id: '5',
    title: 'Cooking Class',
    description: 'Traditional Indonesian cooking workshop',
    category: 'activities',
    amount: 80,
    perPerson: true,
    assignedTo: ['user1', 'user2', 'user4', 'user5', 'user6'],
    isPaid: false,
    createdBy: 'user5',
    createdAt: '2024-01-17T14:00:00Z'
  }
]

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState<BudgetItem[]>(initialBudgetData)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<BudgetItem['category'] | null>(null)
  
  // Toast notifications
  const { toasts, removeToast, showSuccess, showError } = useToast()
  
  // Current user for calculations (mock)
  const currentUserId = 'user1'
  
  // Calculate summary data
  const budgetSummary = calculateBudgetSummary(budgetData, currentUserId)
  
  // Organize data by categories
  const budgetCategories = organizeBudgetByCategory(budgetData)

  const handleAddItem = (category?: BudgetItem['category']) => {
    setSelectedCategory(category || null)
    setShowAddModal(true)
  }

  const handleEditItem = (item: BudgetItem) => {
    setEditingItem(item)
  }

  const handleTogglePaid = async (id: string, isPaid: boolean) => {
    // Find the item to get its title
    const item = budgetData.find(item => item.id === id)
    const itemTitle = item?.title || 'Item'
    
    // Simulate API call with toast notification
    setBudgetData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, isPaid } : item
      )
    )
    
    // Show toast notification
    if (isPaid) {
      showSuccess('Payment Confirmed! 💰', `${itemTitle} has been marked as paid`)
    } else {
      showSuccess('Payment Status Updated', `${itemTitle} has been marked as pending`)
    }
  }

  const handleSaveItem = async (itemData: Partial<BudgetItem>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingItem) {
        // Update existing item
        setBudgetData(prevData => 
          prevData.map(item => 
            item.id === editingItem.id 
              ? { ...item, ...itemData } as BudgetItem
              : item
          )
        )
        setEditingItem(null)
        showSuccess('Budget Item Updated! ✏️', `${itemData.title} has been saved`)
      } else {
        // Add new item
        const newItem = itemData as BudgetItem
        setBudgetData(prevData => [...prevData, newItem])
        setShowAddModal(false)
        setSelectedCategory(null)
        showSuccess('Budget Item Added! ➕', `${itemData.title} has been added to your budget`)
      }
    } catch {
      showError('Error', 'Failed to save budget item. Please try again.')
    }
  }

  return (
    <AppShell>
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Budget</h1>
            <p className="text-neutral-600">Track expenses and split costs</p>
          </div>
          <button 
            onClick={() => handleAddItem()}
            className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Budget Summary */}
        <BudgetSummaryCards summary={budgetSummary} />

        {/* Budget Categories */}
        {budgetCategories.length > 0 ? (
          <div className="space-y-6">
            {budgetCategories.map((category) => (
              <BudgetCategorySection
                key={category.category}
                category={category}
                onTogglePaid={handleTogglePaid}
                onEditItem={handleEditItem}
                onAddItem={handleAddItem}
              />
            ))}
          </div>
        ) : (
          <BudgetEmptyState />
        )}

        {/* Add Budget Item Modal */}
        <AddEditBudgetModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setSelectedCategory(null)
          }}
          onSave={handleSaveItem}
          mode="add"
          defaultCategory={selectedCategory || 'activities'}
        />

        {/* Edit Budget Item Modal */}
        <AddEditBudgetModal
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
'use client'

import { 
  DollarSign, 
  Home, 
  Car, 
  UtensilsCrossed, 
  Camera,
  Plus,
  Edit3,
  Users,
  Check,
  Clock
} from 'lucide-react'

// Types for budget data
export interface BudgetItem {
  id: string
  title: string
  description: string
  category: 'accommodation' | 'transport' | 'food' | 'activities'
  amount: number
  perPerson?: boolean
  assignedTo: string[]
  paidBy?: string
  isPaid: boolean
  isRecurring?: boolean
  notes?: string
  createdBy: string
  createdAt: string
}

export interface BudgetCategory {
  category: BudgetItem['category']
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  items: BudgetItem[]
  totalAmount: number
}

export interface BudgetSummary {
  totalBudget: number
  totalSpent: number
  youOwe: number
  youPaid: number
}

// Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
}

function ToggleSwitch({ checked, onChange, disabled, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked 
            ? 'bg-green-500' 
            : 'bg-neutral-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {label && (
        <span className="text-sm text-neutral-600">{label}</span>
      )}
    </div>
  )
}

// Budget Summary Cards
interface BudgetSummaryCardsProps {
  summary: BudgetSummary
}

export function BudgetSummaryCards({ summary }: BudgetSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Total Budget */}
      <div className="bg-white rounded-2xl p-4 shadow-trip-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-600">Total Budget</p>
            <p className="text-xl font-bold text-blue-600">${summary.totalBudget}</p>
          </div>
        </div>
      </div>

      {/* You Owe */}
      <div className="bg-white rounded-2xl p-4 shadow-trip-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-600">You Owe</p>
            <p className="text-xl font-bold text-red-600">${summary.youOwe}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Budget Item Card
interface BudgetItemCardProps {
  item: BudgetItem
  onTogglePaid: (id: string, isPaid: boolean) => void
  onEdit?: (item: BudgetItem) => void
}

function BudgetItemCard({ item, onTogglePaid, onEdit }: BudgetItemCardProps) {
  const handleTogglePaid = (checked: boolean) => {
    onTogglePaid(item.id, checked)
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100">
      {/* Item Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-neutral-800 mb-1">
            {item.title}
          </h4>
          <p className="text-sm text-neutral-600 mb-2">
            {item.description}
          </p>
          
          {/* Amount Info */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-neutral-600">
                ${item.amount} {item.perPerson ? 'per person' : 'total'}
              </span>
            </div>
            {item.assignedTo.length > 1 && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-neutral-500" />
                <span className="text-neutral-500">
                  {item.assignedTo.length} people
                </span>
              </div>
            )}
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

      {/* Payment Status and Toggle */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          {item.isPaid ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Paid</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-500">Pending</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">Mark as paid</span>
          <ToggleSwitch
            checked={item.isPaid}
            onChange={handleTogglePaid}
            label={`Mark ${item.title} as paid`}
          />
        </div>
      </div>
    </div>
  )
}

// Budget Category Section
interface BudgetCategorySectionProps {
  category: BudgetCategory
  onTogglePaid: (id: string, isPaid: boolean) => void
  onEditItem?: (item: BudgetItem) => void
  onAddItem?: (category: BudgetItem['category']) => void
}

export function BudgetCategorySection({ 
  category, 
  onTogglePaid, 
  onEditItem, 
  onAddItem 
}: BudgetCategorySectionProps) {
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
              {category.items.length} items • ${category.totalAmount} total
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

      {/* Category Items */}
      <div className="space-y-3">
        {category.items.map((item) => (
          <BudgetItemCard
            key={item.id}
            item={item}
            onTogglePaid={onTogglePaid}
            onEdit={onEditItem}
          />
        ))}
      </div>
    </div>
  )
}

// Budget Empty State
export function BudgetEmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 flex items-center justify-center mb-4">
        <DollarSign className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
        No Budget Items Yet
      </h3>
      <p className="text-neutral-600 mb-6">
        Start tracking expenses by adding your first budget item.
      </p>
    </div>
  )
}

// Helper function to organize budget items by category
export function organizeBudgetByCategory(items: BudgetItem[]): BudgetCategory[] {
  const categoryConfig = {
    accommodation: {
      name: 'Accommodation',
      icon: Home,
      color: 'bg-blue-500'
    },
    transport: {
      name: 'Transport',
      icon: Car,
      color: 'bg-purple-500'
    },
    food: {
      name: 'Food',
      icon: UtensilsCrossed,
      color: 'bg-green-500'
    },
    activities: {
      name: 'Activities',
      icon: Camera,
      color: 'bg-orange-500'
    }
  }

  return Object.entries(categoryConfig).map(([key, config]) => {
    const categoryItems = items.filter(item => item.category === key)
    const totalAmount = categoryItems.reduce((sum, item) => {
      const itemTotal = item.perPerson ? item.amount * item.assignedTo.length : item.amount
      return sum + itemTotal
    }, 0)

    return {
      category: key as BudgetItem['category'],
      name: config.name,
      icon: config.icon,
      color: config.color,
      items: categoryItems,
      totalAmount
    }
  }).filter(category => category.items.length > 0)
}

// Helper function to calculate budget summary
export function calculateBudgetSummary(items: BudgetItem[], currentUserId: string): BudgetSummary {
  let totalBudget = 0
  let totalSpent = 0
  let youOwe = 0
  let youPaid = 0

  items.forEach(item => {
    const itemTotal = item.perPerson ? item.amount * item.assignedTo.length : item.amount
    totalBudget += itemTotal

    if (item.isPaid) {
      totalSpent += itemTotal
    }

    // Calculate what current user owes/paid
    const isAssignedToUser = item.assignedTo.includes(currentUserId)
    const userShareAmount = item.perPerson ? item.amount : itemTotal / item.assignedTo.length

    if (isAssignedToUser) {
      if (item.isPaid && item.paidBy === currentUserId) {
        youPaid += userShareAmount
      } else if (!item.isPaid) {
        youOwe += userShareAmount
      }
    }
  })

  return {
    totalBudget,
    totalSpent,
    youOwe,
    youPaid
  }
}
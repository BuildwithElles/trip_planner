'use client'

import { useState } from 'react'
import { TripButton } from '@/components/ui/trip-button'
import { TripInput } from '@/components/ui/trip-input'
import { 
  X, 
  DollarSign, 
  FileText, 
  Tag,
  Users,
  Save,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import type { BudgetItem } from './BudgetComponents'

interface AddEditBudgetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Partial<BudgetItem>) => void
  item?: BudgetItem // For editing existing items
  mode: 'add' | 'edit'
  defaultCategory?: BudgetItem['category']
}

interface BudgetFormData {
  title: string
  description: string
  amount: string
  category: BudgetItem['category']
  perPerson: boolean
  assignedTo: string[]
  isPaid: boolean
  notes: string
}

export function AddEditBudgetModal({ 
  isOpen, 
  onClose, 
  onSave, 
  item, 
  mode,
  defaultCategory = 'activities'
}: AddEditBudgetModalProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    title: item?.title || '',
    description: item?.description || '',
    amount: item?.amount?.toString() || '',
    category: item?.category || defaultCategory,
    perPerson: item?.perPerson || true,
    assignedTo: item?.assignedTo || ['current-user'],
    isPaid: item?.isPaid || false,
    notes: item?.notes || ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof BudgetFormData, value: string | boolean | string[]) => {
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
      setError('Item title is required')
      return
    }
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (!formData.assignedTo.length) {
      setError('Please assign this expense to at least one person')
      return
    }

    setLoading(true)
    
    try {
      // Create budget item object
      const budgetData: Partial<BudgetItem> = {
        ...formData,
        amount: Number(formData.amount),
        id: item?.id || `budget-${Date.now()}`,
        createdBy: item?.createdBy || 'current-user',
        createdAt: item?.createdAt || new Date().toISOString()
      }

      await onSave(budgetData)
      onClose()
    } catch {
      setError('Failed to save budget item. Please try again.')
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
            {mode === 'add' ? 'Add Budget Item' : 'Edit Budget Item'}
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
              placeholder="e.g., Beach Resort Accommodation"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              leftIcon={<FileText className="h-4 w-4" />}
              disabled={loading}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-neutral-800">
              Description
            </label>
            <TripInput
              id="description"
              type="text"
              placeholder="e.g., Luxury beachfront resort stay"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              leftIcon={<FileText className="h-4 w-4" />}
              disabled={loading}
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
                onChange={(e) => handleChange('category', e.target.value as BudgetItem['category'])}
                className="w-full h-input bg-input-background rounded-xl text-base text-neutral-800 pl-10 pr-4 border-0 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all duration-200"
                disabled={loading}
              >
                <option value="accommodation">🏠 Accommodation</option>
                <option value="transport">🚗 Transport</option>
                <option value="food">🍽️ Food & Dining</option>
                <option value="activities">📸 Activities</option>
              </select>
            </div>
          </div>

          {/* Amount and Per Person Toggle */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-neutral-800">
              Amount
            </label>
            <div className="space-y-3">
              <TripInput
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                leftIcon={<DollarSign className="h-4 w-4" />}
                disabled={loading}
                required
              />
              
              {/* Per Person Toggle */}
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-800">
                    Per Person
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('perPerson', !formData.perPerson)}
                  className="flex items-center gap-2 text-sm text-neutral-600"
                  disabled={loading}
                >
                  <span>{formData.perPerson ? 'Per person' : 'Total amount'}</span>
                  {formData.perPerson ? (
                    <ToggleRight className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">
              Assigned To
            </label>
            <div className="p-3 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Users className="w-4 h-4" />
                <span>All trip members ({formData.assignedTo.length} people)</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Cost will be split among all assigned members
              </p>
            </div>
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">
              Payment Status
            </label>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${formData.isPaid ? 'bg-green-500' : 'bg-orange-400'}`} />
                <span className="text-sm font-medium text-neutral-800">
                  {formData.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('isPaid', !formData.isPaid)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isPaid ? 'bg-green-500' : 'bg-neutral-200'
                }`}
                disabled={loading}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isPaid ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-neutral-800">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-neutral-500 h-4 w-4" />
              <textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
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
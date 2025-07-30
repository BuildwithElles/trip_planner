'use client'

import { useState, useEffect } from 'react'
import { Check, X, AlertCircle } from 'lucide-react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  description?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastComponent({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const icons = {
    success: <Check className="w-5 h-5 text-green-600" />,
    error: <X className="w-5 h-5 text-red-600" />,
    info: <AlertCircle className="w-5 h-5 text-blue-600" />
  }

  const styles = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  }

  return (
    <div
      className={`rounded-xl p-4 border shadow-trip-lg ${styles[toast.type]} animate-in slide-in-from-right-full duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {icons[toast.type]}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-neutral-800">
            {toast.title}
          </h4>
          {toast.description && (
            <p className="text-sm text-neutral-600 mt-1">
              {toast.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

// Toast hook for easy usage
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (title: string, description?: string) => {
    addToast({ type: 'success', title, description })
  }

  const showError = (title: string, description?: string) => {
    addToast({ type: 'error', title, description })
  }

  const showInfo = (title: string, description?: string) => {
    addToast({ type: 'info', title, description })
  }

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo
  }
}
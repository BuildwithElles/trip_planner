'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TripButton } from '@/components/ui/trip-button'
import { TripInput } from '@/components/ui/trip-input'
import { TripCard, TripCardContent, TripCardDescription, TripCardHeader, TripCardTitle } from '@/components/ui/trip-card'
import { ArrowRight, Link as LinkIcon, ArrowLeft } from 'lucide-react'

export default function JoinTripPage() {
  const [inviteInput, setInviteInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

  const extractTokenFromInput = (input: string): string | null => {
    // Remove whitespace
    const cleanInput = input.trim()
    
    // If it's a URL, extract the token from the path
    try {
      const url = new URL(cleanInput)
      const pathParts = url.pathname.split('/')
      const inviteIndex = pathParts.findIndex(part => part === 'invite')
      if (inviteIndex !== -1 && pathParts[inviteIndex + 1]) {
        return pathParts[inviteIndex + 1]
      }
    } catch {
      // Not a valid URL, treat as token
    }
    
    // If it looks like a token (alphanumeric), use it directly
    if (/^[a-zA-Z0-9\-_]+$/.test(cleanInput)) {
      return cleanInput
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!inviteInput.trim()) {
      setError('Please enter an invite link or trip code')
      setLoading(false)
      return
    }

    const token = extractTokenFromInput(inviteInput)
    
    if (!token) {
      setError('Invalid invite link or trip code format')
      setLoading(false)
      return
    }

    // Redirect to the invite page
    router.push(`/invite/${token}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Mobile-first container - max-w-md centered */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6">
        
        {/* Header with back button */}
        <div className="flex items-center justify-between pt-8 pb-6">
          <Link 
            href="/welcome"
            className="w-10 h-10 rounded-xl bg-white shadow-trip-lg flex items-center justify-center text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-lg font-semibold text-neutral-800">Join Trip</h2>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Main content */}
        <div className="text-center mb-8">
          {/* Logo/Brand Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-trip-lg mb-6">
            <LinkIcon className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            Join a Trip 🎫
          </h1>
          <p className="text-base text-neutral-600">
            Enter your invite link or trip code to join an existing trip
          </p>
        </div>

        {/* Join Trip Form Card */}
        <TripCard>
          <TripCardHeader>
            <TripCardTitle className="text-center">Enter Invite Details</TripCardTitle>
            <TripCardDescription className="text-center">
              Paste your invite link or enter your trip code
            </TripCardDescription>
          </TripCardHeader>
          
          <TripCardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Invite Input Field */}
              <div className="space-y-2">
                <label htmlFor="inviteInput" className="text-sm font-medium text-neutral-800">
                  Invite Link or Trip Code
                </label>
                <TripInput
                  id="inviteInput"
                  type="text"
                  placeholder="Paste invite link or enter trip code"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  leftIcon={<LinkIcon className="h-4 w-4" />}
                  disabled={loading}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <TripButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Checking invite...' : (
                  <>
                    Join Trip
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </TripButton>
            </form>

            {/* Help Section */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-800 mb-2">How to join:</p>
              </div>
              
              <div className="space-y-3 text-sm text-neutral-600">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <p>Ask the trip organizer for an invite link or trip code</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <p>Paste the full link or enter just the code above</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <p>Create an account or sign in to join the trip</p>
                </div>
              </div>
            </div>

            {/* Alternative options */}
            <div className="mt-6 text-center">
              <span className="text-sm text-neutral-600">Want to create your own trip? </span>
              <Link 
                href="/signup" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up here
              </Link>
            </div>
          </TripCardContent>
        </TripCard>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            Need help? Contact the trip organizer or check your invitation email
          </p>
        </div>
      </div>
    </div>
  )
}
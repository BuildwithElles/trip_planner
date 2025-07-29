'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { TripButton } from '@/components/ui/trip-button'
import { TripInput } from '@/components/ui/trip-input'
import { TripCard, TripCardContent, TripCardDescription, TripCardHeader, TripCardTitle } from '@/components/ui/trip-card'
import { Mail, ArrowRight, Plane, Check, ArrowLeft } from 'lucide-react'

export default function MagicLinkPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signInWithMagicLink, loading: authLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email) {
      setError('Please enter your email address')
      setLoading(false)
      return
    }

    const { error } = await signInWithMagicLink(email)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  // Don't render anything while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center animate-pulse">
          <Plane className="w-8 h-8 text-white" />
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between pt-8 pb-6">
            <Link 
              href="/login"
              className="w-10 h-10 rounded-xl bg-white shadow-trip-lg flex items-center justify-center text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-lg font-semibold text-neutral-800">Magic Link Sent</h2>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          <TripCard>
            <TripCardContent className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-2">
                Check Your Email! 📬
              </h2>
              <p className="text-base text-neutral-600 mb-4">
                We&apos;ve sent a magic link to <span className="font-medium text-neutral-800">{email}</span>
              </p>
              <p className="text-sm text-neutral-500 mb-6">
                Click the link in your email to sign in instantly. The link will expire in 1 hour.
              </p>
              
              {/* Action buttons */}
              <div className="space-y-3">
                <TripButton
                  variant="primary"
                  size="default"
                  className="w-full"
                  onClick={() => setSuccess(false)}
                >
                  Send Another Link
                </TripButton>
                
                <Link href="/login">
                  <TripButton
                    variant="secondary"
                    size="default"
                    className="w-full"
                  >
                    Back to Login
                  </TripButton>
                </Link>
              </div>
            </TripCardContent>
          </TripCard>

          {/* Help text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Mobile-first container - max-w-md centered */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6">
        
        {/* Header with back button */}
        <div className="flex items-center justify-between pt-8 pb-6">
          <Link 
            href="/login"
            className="w-10 h-10 rounded-xl bg-white shadow-trip-lg flex items-center justify-center text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-lg font-semibold text-neutral-800">Magic Link</h2>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Main content */}
        <div className="text-center mb-8">
          {/* Logo/Brand Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-trip-lg mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            Passwordless Sign In ✨
          </h1>
          <p className="text-base text-neutral-600">
            Enter your email and we&apos;ll send you a secure link to sign in instantly - no password needed!
          </p>
        </div>

        {/* Magic Link Form Card */}
        <TripCard>
          <TripCardHeader>
            <TripCardTitle className="text-center">Get Magic Link</TripCardTitle>
            <TripCardDescription className="text-center">
              We&apos;ll email you a secure sign-in link
            </TripCardDescription>
          </TripCardHeader>
          
          <TripCardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-neutral-800">
                  Email Address
                </label>
                <TripInput
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
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
                {loading ? 'Sending magic link...' : (
                  <>
                    Send Magic Link
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </TripButton>
            </form>

            {/* Benefits */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Secure & Fast</p>
                  <p className="text-xs text-neutral-600">No password to remember or type</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">One-Click Access</p>
                  <p className="text-xs text-neutral-600">Simply click link in your email</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Auto-Expires</p>
                  <p className="text-xs text-neutral-600">Link expires in 1 hour for security</p>
                </div>
              </div>
            </div>

            {/* Alternative options */}
            <div className="mt-6 text-center">
              <span className="text-sm text-neutral-600">Prefer traditional login? </span>
              <Link 
                href="/login" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Use password instead
              </Link>
            </div>
          </TripCardContent>
        </TripCard>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            Magic links are secure and expire automatically for your protection
          </p>
        </div>
      </div>
    </div>
  )
}
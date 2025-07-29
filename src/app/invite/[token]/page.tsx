'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { TripButton } from '@/components/ui/trip-button'
import { TripInput } from '@/components/ui/trip-input'
import { TripCard, TripCardContent, TripCardDescription, TripCardHeader, TripCardTitle } from '@/components/ui/trip-card'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { 
  Plane, 
  Calendar, 
  MapPin, 
  Users, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

interface InvitePageData {
  invite: {
    id: string
    trip_id: string
    token: string
    email: string
    expires_at: string
    used_at?: string
    created_by: string
    created_at: string
  }
  trip: {
    id: string
    name: string
    description?: string
    start_date: string
    end_date: string
    created_by: string
    users?: {
      id: string
      full_name: string | null
      email: string
      avatar_url: string | null
    }
  }
}

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [inviteData, setInviteData] = useState<InvitePageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showSignup, setShowSignup] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  
  // Signup form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { validateInviteToken, signUpWithInvite, signInWithGoogle, user } = useAuth()

  // Load invite data on mount
  useEffect(() => {
    const loadInviteData = async () => {
      if (!token) return
      
      setLoading(true)
      const { data, error } = await validateInviteToken(token)
      
      if (error || !data) {
        setError(error?.message || 'Invalid invite link')
      } else {
        setInviteData(data as InvitePageData)
        // Pre-fill email if provided in invite
        setFormData(prev => ({ ...prev, email: data.invite.email }))
      }
      setLoading(false)
    }

    loadInviteData()
  }, [token, validateInviteToken])

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && inviteData) {
      // User is logged in, redirect to trip
      router.push(`/trips/${inviteData.trip.id}`)
    }
  }, [user, inviteData, router])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateSignupForm = (): string | null => {
    if (!formData.fullName.trim()) {
      return 'Please enter your full name'
    }
    if (!formData.email) {
      return 'Please enter your email'
    }
    if (!formData.password) {
      return 'Please enter a password'
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long'
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }
    return null
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const validationError = validateSignupForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setAuthLoading(true)
    const { error } = await signUpWithInvite(
      token, 
      formData.email, 
      formData.password, 
      formData.fullName
    )
    
    if (error) {
      setError(error.message)
      setAuthLoading(false)
    } else {
      // Success! Redirect will happen via useEffect when user state changes
      router.push(`/trips/${inviteData?.trip.id}`)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    const result = await signInWithGoogle()
    
    if (result.error) {
      setError(result.error.message)
    }
    return result
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center animate-pulse">
          <Plane className="w-8 h-8 text-white" />
        </div>
      </div>
    )
  }

  // Error state - invalid/expired invite
  if (error && !inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6">
          <TripCard>
            <TripCardContent className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-2">
                Invalid Invite Link
              </h2>
              <p className="text-base text-neutral-600 mb-6">
                This invite link is invalid or has expired. Please ask the trip organizer for a new invitation.
              </p>
              <Link href="/welcome">
                <TripButton variant="primary" size="default" className="w-full">
                  Go to TripTogether
                </TripButton>
              </Link>
            </TripCardContent>
          </TripCard>
        </div>
      </div>
    )
  }

  if (!inviteData) return null

  const trip = inviteData.trip
  const host = trip.users
  const startDate = new Date(trip.start_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const endDate = new Date(trip.end_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6">
        
        {/* Trip Information Card */}
        <TripCard className="mb-6">
          <TripCardContent className="text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-trip-lg mb-4">
              <Plane className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-xl font-semibold text-neutral-800 mb-2">
              You&apos;re Invited! 🎉
            </h1>
            
            <div className="space-y-3 text-left">
              {/* Trip Name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Trip</p>
                  <p className="font-semibold text-neutral-800">{trip.name}</p>
                </div>
              </div>
              
              {/* Dates */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Dates</p>
                  <p className="font-semibold text-neutral-800 text-sm">
                    {startDate} - {endDate}
                  </p>
                </div>
              </div>
              
              {/* Host */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Hosted by</p>
                  <p className="font-semibold text-neutral-800">{host?.full_name || host?.email || 'Trip Host'}</p>
                </div>
              </div>
              
              {/* Description */}
              {trip.description && (
                <div className="pt-2 border-t border-neutral-100">
                  <p className="text-sm text-neutral-600">{trip.description}</p>
                </div>
              )}
            </div>
          </TripCardContent>
        </TripCard>

        {/* Authentication Card */}
        <TripCard>
          <TripCardHeader>
            <TripCardTitle className="text-center">
              {showSignup ? 'Create Account' : 'Join the Trip'}
            </TripCardTitle>
            <TripCardDescription className="text-center">
              {showSignup 
                ? 'Create your account to join this amazing trip'
                : 'Sign in or create an account to join'
              }
            </TripCardDescription>
          </TripCardHeader>
          
          <TripCardContent>
            {!showSignup ? (
              // Quick join options
              <div className="space-y-4">
                {/* Google OAuth */}
                <GoogleAuthButton 
                  onSignIn={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full"
                />
                
                {/* Create Account Button */}
                <TripButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setShowSignup(true)}
                  disabled={authLoading}
                >
                  Create Account to Join
                  <ArrowRight className="ml-2 h-4 w-4" />
                </TripButton>
                
                {/* Already have account */}
                <div className="text-center">
                  <span className="text-sm text-neutral-600">Already have an account? </span>
                  <Link 
                    href={`/login?redirectTo=/invite/${token}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            ) : (
              // Signup form
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-neutral-800">
                    Full Name
                  </label>
                  <TripInput
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    leftIcon={<User className="h-4 w-4" />}
                    disabled={authLoading}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-neutral-800">
                    Email
                  </label>
                  <TripInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleFormChange}
                    leftIcon={<Mail className="h-4 w-4" />}
                    disabled={authLoading}
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-neutral-800">
                    Password
                  </label>
                  <TripInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleFormChange}
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
                        disabled={authLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                    disabled={authLoading}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-800">
                    Confirm Password
                  </label>
                  <TripInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleFormChange}
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
                        disabled={authLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                    disabled={authLoading}
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
                  loading={authLoading}
                  disabled={authLoading}
                >
                  {authLoading ? 'Creating account...' : (
                    <>
                      Join Trip
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </>
                  )}
                </TripButton>
                
                {/* Back to join options */}
                <TripButton
                  type="button"
                  variant="secondary"
                  size="default"
                  className="w-full"
                  onClick={() => setShowSignup(false)}
                  disabled={authLoading}
                >
                  Back to Join Options
                </TripButton>
              </form>
            )}
          </TripCardContent>
        </TripCard>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">
            By joining, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
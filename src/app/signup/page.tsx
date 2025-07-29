'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { TripButton } from '@/components/ui/trip-button'
import { TripInput } from '@/components/ui/trip-input'
import { TripCard, TripCardContent, TripCardDescription, TripCardHeader, TripCardTitle } from '@/components/ui/trip-card'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Plane } from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signUp, signInWithGoogle, loading: authLoading } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = (): string | null => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    const { error } = await signUp(formData.email, formData.password, formData.fullName)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Redirect to login after a brief success message
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    const result = await signInWithGoogle()
    
    if (result.error) {
      setError(result.error.message)
    }
    // Note: If successful, the user will be redirected via OAuth flow
    return result
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
          <TripCard>
            <TripCardContent className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-2">
                Account Created Successfully! 🎉
              </h2>
              <p className="text-base text-neutral-600 mb-4">
                Check your email to verify your account, then you can start planning amazing trips!
              </p>
              <p className="text-sm text-neutral-500">
                Redirecting you to login...
              </p>
            </TripCardContent>
          </TripCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Mobile-first container - max-w-md centered */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo/Brand Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-trip-lg mb-6">
            <Plane className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            Join TripTogether! ✈️
          </h1>
          <p className="text-base text-neutral-600">
            Create your account and start planning amazing adventures with friends
          </p>
        </div>

        {/* Signup Form Card */}
        <TripCard>
          <TripCardHeader>
            <TripCardTitle className="text-center">Create Account</TripCardTitle>
            <TripCardDescription className="text-center">
              Get started with your trip planning journey
            </TripCardDescription>
          </TripCardHeader>
          
          <TripCardContent>
            {/* Google OAuth Button */}
            <div className="mb-6">
              <GoogleAuthButton 
                onSignIn={handleGoogleSignUp}
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-neutral-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
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
                  onChange={handleChange}
                  leftIcon={<User className="h-4 w-4" />}
                  disabled={loading}
                  required
                />
              </div>

              {/* Email Field */}
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
                  onChange={handleChange}
                  leftIcon={<Mail className="h-4 w-4" />}
                  disabled={loading}
                  required
                />
              </div>

              {/* Password Field */}
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
                  onChange={handleChange}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  disabled={loading}
                  required
                />
              </div>

              {/* Confirm Password Field */}
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
                  onChange={handleChange}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
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
                {loading ? 'Creating account...' : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </TripButton>
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <span className="text-sm text-neutral-600">Already have an account? </span>
              <Link 
                href="/login" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </div>
          </TripCardContent>
        </TripCard>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { TripButton } from '@/components/ui/trip-button'
import { TripInput } from '@/components/ui/trip-input'
import { TripCard, TripCardContent, TripCardDescription, TripCardHeader, TripCardTitle } from '@/components/ui/trip-card'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Plane, Sparkles } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signInWithGoogle, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirectTo)
    }
  }

  const handleGoogleSignIn = async () => {
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
            Welcome back! ✈️
          </h1>
          <p className="text-base text-neutral-600">
            Sign in to continue planning your amazing trips
          </p>
        </div>

        {/* Login Form Card */}
        <TripCard>
          <TripCardHeader>
            <TripCardTitle className="text-center">Sign In</TripCardTitle>
            <TripCardDescription className="text-center">
              Choose your preferred sign-in method
            </TripCardDescription>
          </TripCardHeader>
          
          <TripCardContent>
            {/* Quick Sign-In Options */}
            <div className="space-y-3 mb-6">
              {/* Google OAuth Button */}
              <GoogleAuthButton 
                onSignIn={handleGoogleSignIn}
                disabled={loading}
                className="w-full"
              />
              
              {/* Magic Link Button */}
              <Link href="/auth/magic-link" className="block">
                <TripButton
                  variant="secondary"
                  size="default"
                  className="w-full"
                  disabled={loading}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="ml-2">Continue with Magic Link</span>
                </TripButton>
              </Link>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-neutral-500">Or use email & password</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-neutral-800">
                  Email
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

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-neutral-800">
                  Password
                </label>
                <TripInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? 'Signing in...' : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </TripButton>
            </form>

            {/* Links */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="text-center">
                <span className="text-sm text-neutral-600">Don&apos;t have an account? </span>
                <Link 
                  href="/signup" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </TripCardContent>
        </TripCard>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

function LoginPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center animate-pulse">
        <Plane className="w-8 h-8 text-white" />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginForm />
    </Suspense>
  )
} 
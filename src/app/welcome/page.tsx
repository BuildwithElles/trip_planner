import Link from 'next/link'
import { Plane, Users, MapPin, Calendar, Sparkles } from 'lucide-react'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Mobile-first container - max-w-md centered */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-8">
          {/* Logo/Brand Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-trip-lg">
            <Plane className="w-8 h-8 text-white" />
          </div>
          
          {/* Main Heading - H1 style */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-neutral-800">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TripTogether</span> ✈️
            </h1>
            <p className="text-base text-neutral-600">
              Plan amazing adventures with friends and family. Collaborate on itineraries, budgets, and make memories together.
            </p>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-trip-lg">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-medium text-neutral-800">Collaborate Together</h3>
              <p className="text-sm text-neutral-600">Plan with friends in real-time</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-trip-lg">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-base font-medium text-neutral-800">Smart Itineraries</h3>
              <p className="text-sm text-neutral-600">Build day-by-day travel plans</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-trip-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-medium text-neutral-800">Budget Tracking</h3>
              <p className="text-sm text-neutral-600">Keep expenses organized</p>
            </div>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="space-y-4">
          {/* Primary CTA - Log In */}
          <Link 
            href="/login"
            className="w-full h-button-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl flex items-center justify-center shadow-trip-lg hover:shadow-xl transition-all duration-200"
          >
            <span>Log In</span>
            <Sparkles className="w-5 h-5 ml-2" />
          </Link>
          
          {/* Secondary CTA - Join Trip */}
          <Link 
            href="/join-trip"
            className="w-full h-button bg-white text-neutral-800 font-medium rounded-xl flex items-center justify-center border-2 border-neutral-200 hover:border-neutral-300 transition-all duration-200"
          >
            Join Trip
          </Link>
          
          {/* Tertiary CTA - Sign Up */}
          <div className="text-center pt-2">
            <span className="text-sm text-neutral-600">New to TripTogether? </span>
            <Link href="/signup" className="text-sm text-blue-600 font-medium hover:text-blue-700">
              Create Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            Start planning your next adventure today
          </p>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { BottomNavigation } from '@/components/ui/bottom-navigation'
import { 
  LogOut, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Wallet, 
  Package, 
  Users, 
  MapPin,
  Bell,
  Settings,
  Plane
} from 'lucide-react'

export default function DashboardPage() {
  const { user, profile, signOut, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
        <div className="animate-pulse-soft">
          <div className="w-16 h-16 rounded-full bg-gradient-turquoise-blue flex items-center justify-center">
            <Plane className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Mock data - in real app this would come from API
  const tripData = {
    name: "Bali Adventure 2025",
    dates: "March 15-22, 2025",
    rsvpStatus: "confirmed",
    totalBudget: 2500,
    paidAmount: 1200,
    packingProgress: 65,
    outfitsReady: 4,
    totalOutfits: 6,
    upcomingEvents: 3,
    unreadMessages: 5
  }

  const budgetPercentage = (tripData.paidAmount / tripData.totalBudget) * 100
  const outfitsPercentage = (tripData.outfitsReady / tripData.totalOutfits) * 100

  return (
    <div className="min-h-screen bg-gradient-soft pb-20 md:pb-0">
      {/* Header with Gradient */}
      <div className="bg-gradient-turquoise-blue px-4 pt-12 pb-6 md:pt-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-start">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-heading-lg">Welcome back! 👋</h1>
                <div className="relative">
                  <Bell className="w-6 h-6" />
                  {tripData.unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-soft-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {tripData.unreadMessages}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-lg opacity-90">
                {profile?.full_name || user?.email?.split('@')[0]}
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm hidden md:flex"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Trip Info Card */}
      <div className="px-4 -mt-4 mb-6">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-gradient-card shadow-soft-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-heading-md text-soft-gray-900 mb-1">
                    {tripData.name}
                  </h2>
                  <div className="flex items-center gap-4 text-body-md text-soft-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {tripData.dates}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Indonesia
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-accent-emerald-100 text-accent-emerald-700 rounded-full text-body-sm font-medium">
                    ✓ Confirmed
                  </div>
                  <Button size="sm" className="shadow-card">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* RSVP Status Card */}
          <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-accent-emerald-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-accent-emerald-600" />
                </div>
                <span className="text-body-sm font-medium text-accent-emerald-600 bg-accent-emerald-100 px-2 py-1 rounded">
                  Confirmed
                </span>
              </div>
              <h3 className="text-heading-sm text-soft-gray-900 mb-1">RSVP Status</h3>
              <p className="text-body-md text-soft-gray-500">
                You&apos;re all set for the trip!
              </p>
            </CardContent>
          </Card>

          {/* Budget Card */}
          <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-soft-blue-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-soft-blue-600" />
                </div>
                <ProgressRing progress={budgetPercentage} size="sm" color="blue">
                  {Math.round(budgetPercentage)}%
                </ProgressRing>
              </div>
              <h3 className="text-heading-sm text-soft-gray-900 mb-1">Budget</h3>
              <p className="text-body-md text-soft-gray-500">
                ${tripData.paidAmount.toLocaleString()} of ${tripData.totalBudget.toLocaleString()} paid
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Events Card */}
          <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-turquoise-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-turquoise-600" />
                </div>
                <span className="text-heading-sm font-bold text-turquoise-600">
                  {tripData.upcomingEvents}
                </span>
              </div>
              <h3 className="text-heading-sm text-soft-gray-900 mb-1">Upcoming Events</h3>
              <p className="text-body-md text-soft-gray-500">
                Next: Beach day tomorrow
              </p>
            </CardContent>
          </Card>

          {/* Packing Status Card */}
          <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-accent-pink-100 rounded-lg">
                  <Package className="w-5 h-5 text-accent-pink-600" />
                </div>
                <ProgressRing progress={tripData.packingProgress} size="sm" color="pink">
                  {tripData.packingProgress}%
                </ProgressRing>
              </div>
              <h3 className="text-heading-sm text-soft-gray-900 mb-1">Packing</h3>
              <p className="text-body-md text-soft-gray-500">
                {Math.round((tripData.packingProgress / 100) * 20)} of 20 items packed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-heading-sm text-soft-gray-900">Recent Activity</CardTitle>
                <CardDescription className="text-body-md text-soft-gray-500">
                  Stay up to date with trip updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-soft-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-turquoise-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md font-medium text-soft-gray-900">
                      Sarah added 3 new activities to the itinerary
                    </p>
                    <p className="text-body-sm text-soft-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-soft-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-soft-blue-500 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md font-medium text-soft-gray-900">
                      Hotel payment of $800 was processed
                    </p>
                    <p className="text-body-sm text-soft-gray-500">Yesterday</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-soft-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-accent-pink-500 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md font-medium text-soft-gray-900">
                      You completed packing for beach activities
                    </p>
                    <p className="text-body-sm text-soft-gray-500">2 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-heading-sm text-soft-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-body-md text-soft-gray-500">
                  Get things done faster
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start shadow-card" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
                <Button className="w-full justify-start shadow-card" variant="outline">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Update Packing
                </Button>
                <Button className="w-full justify-start shadow-card" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Itinerary
                </Button>
                <Button className="w-full justify-start shadow-card" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Message Group
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Outfit Progress */}
        <Card className="shadow-card mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-heading-sm text-soft-gray-900">Outfit Planning</CardTitle>
                <CardDescription className="text-body-md text-soft-gray-500">
                  {tripData.outfitsReady} of {tripData.totalOutfits} outfits ready
                </CardDescription>
              </div>
              <ProgressRing progress={outfitsPercentage} size="md" color="emerald">
                {Math.round(outfitsPercentage)}%
              </ProgressRing>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {Array.from({ length: tripData.totalOutfits }, (_, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border-2 border-dashed transition-colors ${
                    i < tripData.outfitsReady
                      ? 'border-accent-emerald-300 bg-accent-emerald-50'
                      : 'border-soft-gray-200 bg-soft-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      i < tripData.outfitsReady 
                        ? 'bg-accent-emerald-500 text-white' 
                        : 'bg-soft-gray-300 text-soft-gray-500'
                    }`}>
                      {i < tripData.outfitsReady ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                    <p className="text-body-sm font-medium text-soft-gray-700">
                      Day {i + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Message - Remove this after testing */}
        <Card className="bg-gradient-soft border-turquoise-200 shadow-soft">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-heading-md text-turquoise-900 mb-2">
                🎉 New Design System Applied!
              </h2>
              <p className="text-body-lg text-turquoise-700 mb-4">
                Your Trip Planner now features a bright, social, and mobile-friendly interface with soft gradients, progress indicators, and beautiful cards!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-body-sm text-turquoise-600">
                <p>✅ Turquoise → Blue gradients</p>
                <p>✅ Progress rings & indicators</p>
                <p>✅ Mobile bottom navigation</p>
                <p>✅ Dashboard cards with shadows</p>
                <p>✅ Soft color system</p>
                <p>✅ New typography scale</p>
                <p>✅ Empty states ready</p>
                <p>✅ Visual hierarchy improved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
} 
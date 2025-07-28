'use client'

import { useEffect, useState } from 'react'
import { testSupabaseConnection } from '@/lib/test-connection'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Session } from '@supabase/supabase-js'

interface ConnectionResult {
  success: boolean
  error?: string
  session?: Session | null
  environment?: {
    hasUrl: boolean
    hasAnonKey: boolean
    projectId?: string
  }
  databaseTests?: Record<string, {
    exists: boolean
    error: string | null
    buckets?: string[]
  }>
}

export default function TestConnectionPage() {
  const [result, setResult] = useState<ConnectionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    try {
      const connectionResult = await testSupabaseConnection()
      setResult(connectionResult)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    // Test connection automatically when page loads
    handleTest()
  }, [])

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">🚀 Supabase Connection & Database Test</h1>
          <p className="text-secondary-600 mt-2">
            Testing the connection to your Supabase backend and verifying database schema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>
              This page tests if your environment variables are configured correctly
              and if the app can connect to Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleTest} 
              loading={loading}
              className="w-full"
            >
              {loading ? 'Testing Connection...' : 'Test Connection'}
            </Button>

            {result && (
              <div className={`p-4 rounded-xl ${
                result.success 
                  ? 'bg-emerald-50 border border-emerald-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {result.success ? '✅' : '❌'}
                  </span>
                  <span className="font-semibold">
                    {result.success ? 'Connection Successful!' : 'Connection Failed'}
                  </span>
                </div>
                
                {result.environment && (
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Environment Check:</strong>
                    </div>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        Supabase URL: {result.environment.hasUrl ? '✅ Found' : '❌ Missing'}
                      </li>
                      <li>
                        Anon Key: {result.environment.hasAnonKey ? '✅ Found' : '❌ Missing'}
                      </li>
                      {result.environment.projectId && (
                        <li>
                          Project ID: <code>{result.environment.projectId}</code>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {result.error && (
                  <div className="mt-2">
                    <strong>Error:</strong>
                    <pre className="text-red-600 text-sm mt-1 whitespace-pre-wrap">
                      {result.error}
                    </pre>
                  </div>
                )}

                {result.success && (
                  <div className="mt-2 text-sm text-emerald-700">
                    🎉 Great! Your Supabase backend is connected and ready.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {result?.databaseTests && (
          <Card>
            <CardHeader>
              <CardTitle>Database Schema Test</CardTitle>
              <CardDescription>
                Verifying that all database tables and storage buckets are properly configured.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Database Tables</h4>
                  <div className="space-y-2">
                    {Object.entries(result.databaseTests)
                      .filter(([key]) => key !== 'storage')
                      .map(([table, test]) => (
                        <div key={table} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{table.replace('_', ' ')}</span>
                          <span className="flex items-center gap-1">
                            {test.exists ? '✅' : '❌'}
                            {test.error && (
                              <span className="text-red-600 text-xs">({test.error})</span>
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Storage Buckets</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Storage System</span>
                      <span className="flex items-center gap-1">
                        {result.databaseTests.storage.exists ? '✅' : '❌'}
                      </span>
                    </div>
                    {result.databaseTests.storage.buckets && (
                      <div className="text-xs text-secondary-600">
                        Buckets: {result.databaseTests.storage.buckets.join(', ')}
                      </div>
                    )}
                    {result.databaseTests.storage.error && (
                      <div className="text-xs text-red-600">
                        Error: {result.databaseTests.storage.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {result.success && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <strong>Note:</strong> RLS (Row Level Security) errors are expected and indicate that 
                  your security policies are working correctly. Tables showing ✅ are properly configured.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>Now that your Supabase backend is fully configured, you can:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li><strong>Set up authentication</strong> - Create login/signup pages</li>
                <li><strong>Build the layout</strong> - Create responsive navigation and layout</li>
                <li><strong>Develop features</strong> - Start building the trip planning components</li>
              </ol>
              
              <p className="mt-4">
                <strong>🚀 Ready for Phase 3:</strong> Authentication Setup
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
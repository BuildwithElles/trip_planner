import { createClient } from './supabase/client'

export async function testSupabaseConnection() {
  try {
    const supabase = createClient()
    
    // Test the connection by trying to get the current user
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase connection successful!')
    
    // Test database access by checking if tables exist
    const databaseTests = await testDatabaseAccess(supabase)
    
    const environment = {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      projectId: process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].split('//')[1]
    }
    
    console.log('📊 Environment check:', environment)
    
    return { 
      success: true, 
      session,
      environment,
      databaseTests
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ Connection test failed:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

type DatabaseTest = {
  exists: boolean
  error: string | null
  buckets?: string[]
}

async function testDatabaseAccess(supabase: any) {
  const tests: Record<string, DatabaseTest> = {
    users: { exists: false, error: null },
    trips: { exists: false, error: null },
    trip_users: { exists: false, error: null },
    itinerary_items: { exists: false, error: null },
    budget_items: { exists: false, error: null },
    packing_items: { exists: false, error: null },
    photos: { exists: false, error: null },
    messages: { exists: false, error: null },
    storage: { exists: false, error: null }
  }

  // Test each table by attempting to select from it (should work even with RLS)
  const tables = ['users', 'trips', 'trip_users', 'itinerary_items', 'budget_items', 'packing_items', 'photos', 'messages']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        // If it's a RLS error, that means the table exists but access is restricted (which is good!)
        if (error.message.includes('RLS') || error.message.includes('row-level security') || error.code === 'PGRST301') {
          tests[table] = { exists: true, error: null }
        } else {
          tests[table] = { exists: false, error: error.message }
        }
      } else {
        tests[table] = { exists: true, error: null }
      }
    } catch (err) {
      tests[table] = { 
        exists: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      }
    }
  }

  // Test storage buckets
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      tests.storage = { exists: false, error: error.message }
    } else {
      const hasTripPhotos = buckets?.some((bucket: any) => bucket.name === 'trip-photos')
      const hasTripReceipts = buckets?.some((bucket: any) => bucket.name === 'trip-receipts')
      
      tests.storage = { 
        exists: hasTripPhotos && hasTripReceipts, 
        error: null,
        buckets: buckets?.map((b: any) => b.name) || []
      }
    }
  } catch (err) {
    tests.storage = { 
      exists: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    }
  }

  return tests
} 
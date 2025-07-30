import { createClient } from './client'
import { createClient as createServerClient } from './server'
import type { 
  Trip, 
  TripUser, 
  ItineraryItem, 
  BudgetItem, 
  PackingItem, 
  Photo, 
  Message, 
  User,
  InviteToken
} from '@/lib/types'

// Types for realtime subscriptions
type RealtimePayload = {
  schema: string
  table: string
  commit_timestamp: string
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new?: Record<string, unknown>
  old?: Record<string, unknown>
}

// Client-side queries
export const client = createClient()

// Server-side queries
export async function getServerClient() {
  return await createServerClient()
}

// ================================
// AUTH QUERIES
// ================================

export async function getCurrentUser() {
  const { data: { user }, error } = await client.auth.getUser()
  if (error) throw error
  return user
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// ================================
// TRIP QUERIES
// ================================

export async function getUserTrips(): Promise<Trip[]> {
  const { data, error } = await client
    .from('trips')
    .select(`
      *,
      trip_users!inner(
        role,
        rsvp_status
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getTrip(tripId: string): Promise<Trip | null> {
  const { data, error } = await client
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single()
  
  if (error) throw error
  return data
}

export async function createTrip(trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await client
    .from('trips')
    .insert({
      ...trip,
      created_by: user.id
    })
    .select()
    .single()
  
  if (error) throw error

  // Add creator as admin
  await addTripUser(data.id, user.id, 'admin')
  
  return data
}

export async function updateTrip(tripId: string, updates: Partial<Trip>) {
  const { data, error } = await client
    .from('trips')
    .update(updates)
    .eq('id', tripId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteTrip(tripId: string) {
  const { error } = await client
    .from('trips')
    .delete()
    .eq('id', tripId)
  
  if (error) throw error
}

// ================================
// TRIP USER QUERIES
// ================================

export async function getTripUsers(tripId: string): Promise<TripUser[]> {
  const { data, error } = await client
    .from('trip_users')
    .select(`
      *,
      users(
        id,
        email,
        full_name,
        avatar_url
      )
    `)
    .eq('trip_id', tripId)
  
  if (error) throw error
  return data || []
}

export async function addTripUser(tripId: string, userId: string, role: 'admin' | 'guest' = 'guest') {
  const { data, error } = await client
    .from('trip_users')
    .insert({
      trip_id: tripId,
      user_id: userId,
      role
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateTripUserRole(tripUserId: string, role: 'admin' | 'guest') {
  const { data, error } = await client
    .from('trip_users')
    .update({ role })
    .eq('id', tripUserId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateRSVPStatus(tripUserId: string, status: 'accepted' | 'declined') {
  const { data, error } = await client
    .from('trip_users')
    .update({ 
      rsvp_status: status,
      responded_at: new Date().toISOString()
    })
    .eq('id', tripUserId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ================================
// ITINERARY QUERIES
// ================================

export async function getItineraryItems(tripId: string): Promise<ItineraryItem[]> {
  const { data, error } = await client
    .from('itinerary_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('date', { ascending: true })
    .order('time', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function createItineraryItem(item: Omit<ItineraryItem, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await client
    .from('itinerary_items')
    .insert(item)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateItineraryItem(itemId: string, updates: Partial<ItineraryItem>) {
  const { data, error } = await client
    .from('itinerary_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteItineraryItem(itemId: string) {
  const { error } = await client
    .from('itinerary_items')
    .delete()
    .eq('id', itemId)
  
  if (error) throw error
}

// ================================
// BUDGET QUERIES
// ================================

export async function getBudgetItems(tripId: string): Promise<BudgetItem[]> {
  const { data, error } = await client
    .from('budget_items')
    .select(`
      *,
      users!budget_items_paid_by_fkey(
        id,
        full_name,
        email
      )
    `)
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createBudgetItem(item: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await client
    .from('budget_items')
    .insert(item)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateBudgetItem(itemId: string, updates: Partial<BudgetItem>) {
  const { data, error } = await client
    .from('budget_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteBudgetItem(itemId: string) {
  const { error } = await client
    .from('budget_items')
    .delete()
    .eq('id', itemId)
  
  if (error) throw error
}

// ================================
// PACKING QUERIES
// ================================

export async function getPackingItems(tripId: string): Promise<PackingItem[]> {
  const { data, error } = await client
    .from('packing_items')
    .select(`
      *,
      assigned_user:users!packing_items_assigned_to_fkey(
        id,
        full_name,
        email
      ),
      created_by_user:users!packing_items_created_by_fkey(
        id,
        full_name,
        email
      )
    `)
    .eq('trip_id', tripId)
    .order('category')
    .order('created_at')
  
  if (error) throw error
  return data || []
}

export async function createPackingItem(item: Omit<PackingItem, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await client
    .from('packing_items')
    .insert(item)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updatePackingItem(itemId: string, updates: Partial<PackingItem>) {
  const { data, error } = await client
    .from('packing_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deletePackingItem(itemId: string) {
  const { error } = await client
    .from('packing_items')
    .delete()
    .eq('id', itemId)
  
  if (error) throw error
}

// ================================
// PHOTO QUERIES
// ================================

export async function getTripPhotos(tripId: string): Promise<Photo[]> {
  const { data, error } = await client
    .from('photos')
    .select(`
      *,
      users(
        id,
        full_name,
        email
      )
    `)
    .eq('trip_id', tripId)
    .order('uploaded_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createPhoto(photo: Omit<Photo, 'id' | 'uploaded_at'>) {
  const { data, error } = await client
    .from('photos')
    .insert(photo)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deletePhoto(photoId: string) {
  const { error } = await client
    .from('photos')
    .delete()
    .eq('id', photoId)
  
  if (error) throw error
}

// ================================
// MESSAGE QUERIES
// ================================

export async function getTripMessages(tripId: string): Promise<Message[]> {
  const { data, error } = await client
    .from('messages')
    .select(`
      *,
      users(
        id,
        full_name,
        email,
        avatar_url
      )
    `)
    .eq('trip_id', tripId)
    .order('sent_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function sendMessage(message: {
  trip_id: string
  user_id: string
  content: string
  attachment_url?: string
  attachment_type?: 'image' | 'file'
  attachment_name?: string
}) {
  const { data, error } = await client
    .from('messages')
    .insert({
      trip_id: message.trip_id,
      user_id: message.user_id,
      content: message.content,
      attachment_url: message.attachment_url || null,
      attachment_type: message.attachment_type || null,
      attachment_name: message.attachment_name || null
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ================================
// REALTIME SUBSCRIPTIONS
// ================================

export function subscribeToTripMessages(tripId: string, callback: (payload: RealtimePayload) => void) {
  return client
    .channel(`trip-messages-${tripId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `trip_id=eq.${tripId}`
      },
      callback
    )
    .subscribe()
}

export function subscribeToTripUpdates(tripId: string, callback: (payload: RealtimePayload) => void) {
  return client
    .channel(`trip-updates-${tripId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'itinerary_items',
        filter: `trip_id=eq.${tripId}`
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'budget_items',
        filter: `trip_id=eq.${tripId}`
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'packing_items',
        filter: `trip_id=eq.${tripId}`
      },
      callback
    )
    .subscribe()
}

// ================================
// INVITE TOKEN QUERIES
// ================================

export async function createInviteToken(tripId: string, email: string): Promise<InviteToken> {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

  const { data, error } = await client
    .from('invite_tokens')
    .insert({
      trip_id: tripId,
      token,
      email,
      expires_at: expiresAt.toISOString(),
      created_by: user.id
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getInviteTokens(tripId: string): Promise<InviteToken[]> {
  const { data, error } = await client
    .from('invite_tokens')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function validateInviteToken(token: string): Promise<InviteToken | null> {
  const { data, error } = await client
    .from('invite_tokens')
    .select('*')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()
  
  if (error) return null
  return data
}

export async function useInviteToken(token: string): Promise<void> {
  const { error } = await client
    .from('invite_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)
  
  if (error) throw error
}

export async function deleteInviteToken(tokenId: string): Promise<void> {
  const { error } = await client
    .from('invite_tokens')
    .delete()
    .eq('id', tokenId)
  
  if (error) throw error
}
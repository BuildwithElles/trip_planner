export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TripUser {
  id: string;
  trip_id: string;
  user_id: string;
  role: 'admin' | 'guest';
  rsvp_status: 'pending' | 'accepted' | 'declined';
  invited_at: string;
  responded_at?: string;
}

export interface ItineraryItem {
  id: string;
  trip_id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  id: string;
  trip_id: string;
  description: string;
  amount: number;
  paid_by: string;
  split_among: string[];
  category: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PackingItem {
  id: string;
  trip_id: string;
  item: string;
  assigned_to?: string;
  checked: boolean;
  category: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  trip_id: string;
  url: string;
  caption?: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface Outfit {
  id: string;
  trip_id: string;
  event_id: string;
  user_id: string;
  description?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  trip_id: string;
  user_id: string;
  content: string;
  sent_at: string;
}

export interface InviteToken {
  id: string;
  trip_id: string;
  token: string;
  email: string;
  expires_at: string;
  used_at?: string;
  created_by: string;
  created_at: string;
}

export type UserRole = 'admin' | 'guest';
export type RSVPStatus = 'pending' | 'accepted' | 'declined'; 
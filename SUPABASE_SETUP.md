# 🚀 Supabase Setup Instructions

Follow these steps to set up your Supabase backend for the Trip Planner app.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/create account
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `trip-planner` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (takes ~2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Project API Keys** → **anon public** key
   - **Project API Keys** → **service_role** key (keep this secret!)

## Step 3: Update Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `database/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- ✅ All database tables with proper relationships
- ✅ Row Level Security (RLS) policies
- ✅ Database functions and triggers
- ✅ Indexes for performance

## Step 5: Set Up Storage Buckets

1. In your Supabase dashboard, go to **Storage**
2. Click "New bucket"
3. Run the storage setup:
   - Go back to **SQL Editor**
   - Copy the contents of `database/storage.sql`
   - Paste and run it

This creates:
- ✅ `trip-photos` bucket (public) - for trip photos
- ✅ `trip-receipts` bucket (private) - for expense receipts
- ✅ Storage policies for security

## Step 6: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following:

### Site URL
- Set to: `http://localhost:3000` (for development)
- For production, use your actual domain

### Redirect URLs
Add these URLs:
- `http://localhost:3000/auth/callback`
- `https://yourdomain.com/auth/callback` (for production)

### Email Templates (Optional)
Customize the email templates in **Authentication** → **Email Templates**

## Step 7: Test the Connection

1. Start your development server:
```bash
npm run dev
```

2. Check the browser console for any Supabase connection errors
3. The app should connect successfully to your Supabase backend

## 🔐 Security Notes

- ✅ **RLS is enabled** on all tables - users can only access data they have permission for
- ✅ **Anon key is safe** to use in frontend - it only has limited permissions
- ⚠️ **Service role key** should never be exposed in frontend code
- ✅ **Storage policies** ensure users can only access their trip files

## 📊 Database Schema Overview

The schema includes these main tables:

- **users** - User profiles (extends Supabase auth)
- **trips** - Trip information
- **trip_users** - Many-to-many relationship (users ↔ trips)
- **itinerary_items** - Trip events and activities
- **budget_items** - Expense tracking
- **packing_items** - Packing list management
- **photos** - Trip photo gallery
- **outfits** - Event-specific outfit planning
- **messages** - Real-time chat
- **invite_tokens** - Trip invitation system

## 🔄 Real-time Features

The following features use Supabase Realtime:

- ✅ **Chat messages** - Instant messaging
- ✅ **Trip updates** - Live itinerary/budget/packing changes
- ✅ **User status** - Online/offline indicators

## 🚀 Ready to Develop!

Once you've completed these steps:

1. Your database is ready with all tables and security
2. Authentication is configured
3. Storage is set up for file uploads
4. Real-time features are enabled

You can now start building the frontend components and they'll automatically connect to your Supabase backend!

## 🆘 Troubleshooting

### Common Issues:

**Connection Error**: Check that your environment variables are correct
**RLS Error**: Make sure you're authenticated and have proper permissions
**Storage Error**: Verify bucket names match the ones in your policies

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Supabase Discord](https://discord.supabase.com/)
- Check the browser console and Supabase logs for detailed error messages 
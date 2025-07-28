-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'guest');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE rsvp_status AS ENUM ('pending', 'accepted', 'declined');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- TABLES
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Trips table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Trip users (many-to-many relationship between users and trips)
CREATE TABLE IF NOT EXISTS public.trip_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role user_role DEFAULT 'guest' NOT NULL,
    rsvp_status rsvp_status DEFAULT 'pending' NOT NULL,
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    responded_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(trip_id, user_id)
);

-- Itinerary items
CREATE TABLE IF NOT EXISTS public.itinerary_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Budget items
CREATE TABLE IF NOT EXISTS public.budget_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    split_among UUID[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL DEFAULT 'general',
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Packing items
CREATE TABLE IF NOT EXISTS public.packing_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    item TEXT NOT NULL,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    checked BOOLEAN DEFAULT FALSE NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Photos
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Outfits
CREATE TABLE IF NOT EXISTS public.outfits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.itinerary_items(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    description TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(trip_id, event_id, user_id)
);

-- Messages (for chat)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Invite tokens
CREATE TABLE IF NOT EXISTS public.invite_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER handle_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_itinerary_items_updated_at BEFORE UPDATE ON public.itinerary_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_budget_items_updated_at BEFORE UPDATE ON public.budget_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_packing_items_updated_at BEFORE UPDATE ON public.packing_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_outfits_updated_at BEFORE UPDATE ON public.outfits FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trips policies
CREATE POLICY "Users can view trips they're part of" ON public.trips FOR SELECT 
USING (
    id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Trip admins can update trips" ON public.trips FOR UPDATE 
USING (
    id IN (
        SELECT trip_id FROM public.trip_users 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Users can create trips" ON public.trips FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trip admins can delete trips" ON public.trips FOR DELETE 
USING (
    id IN (
        SELECT trip_id FROM public.trip_users 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Trip users policies
CREATE POLICY "Users can view trip members for their trips" ON public.trip_users FOR SELECT 
USING (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Trip admins can manage trip members" ON public.trip_users FOR ALL 
USING (
    trip_id IN (
        SELECT trip_id FROM public.trip_users 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Users can update their own trip membership" ON public.trip_users FOR UPDATE 
USING (user_id = auth.uid());

-- Itinerary items policies
CREATE POLICY "Trip members can view itinerary items" ON public.itinerary_items FOR SELECT 
USING (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Trip admins can manage itinerary items" ON public.itinerary_items FOR ALL 
USING (
    trip_id IN (
        SELECT trip_id FROM public.trip_users 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Budget items policies
CREATE POLICY "Trip members can view budget items" ON public.budget_items FOR SELECT 
USING (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Trip members can create budget items" ON public.budget_items FOR INSERT 
WITH CHECK (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    ) AND paid_by = auth.uid()
);

CREATE POLICY "Budget item creators and admins can update items" ON public.budget_items FOR UPDATE 
USING (
    paid_by = auth.uid() OR 
    trip_id IN (
        SELECT trip_id FROM public.trip_users 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Budget item creators and admins can delete items" ON public.budget_items FOR DELETE 
USING (
    paid_by = auth.uid() OR 
    trip_id IN (
        SELECT trip_id FROM public.trip_users 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Packing items policies
CREATE POLICY "Trip members can view packing items" ON public.packing_items FOR SELECT 
USING (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Trip members can create packing items" ON public.packing_items FOR INSERT 
WITH CHECK (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    ) AND created_by = auth.uid()
);

CREATE POLICY "Packing item creators, assignees, and admins can update items" ON public.packing_items FOR UPDATE 
USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    trip_id IN (
        SELECT trip_id FROM public.trip_users 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Packing item creators and admins can delete items" ON public.packing_items FOR DELETE 
USING (
    created_by = auth.uid() OR 
    trip_id IN (
        SELECT trip_id FROM public.trip_users 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Photos policies
CREATE POLICY "Trip members can view photos" ON public.photos FOR SELECT 
USING (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Trip members can upload photos" ON public.photos FOR INSERT 
WITH CHECK (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    ) AND uploaded_by = auth.uid()
);

CREATE POLICY "Photo uploaders and admins can delete photos" ON public.photos FOR DELETE 
USING (
    uploaded_by = auth.uid() OR 
    trip_id IN (
        SELECT trip_id FROM public.trip_users 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Outfits policies
CREATE POLICY "Trip members can view outfits" ON public.outfits FOR SELECT 
USING (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can manage their own outfits" ON public.outfits FOR ALL 
USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Trip members can view messages" ON public.messages FOR SELECT 
USING (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Trip members can send messages" ON public.messages FOR INSERT 
WITH CHECK (
    trip_id IN (
        SELECT trip_id FROM public.trip_users WHERE user_id = auth.uid()
    ) AND user_id = auth.uid()
);

-- Invite tokens policies
CREATE POLICY "Trip admins can manage invite tokens" ON public.invite_tokens FOR ALL 
USING (
    trip_id IN (
        SELECT trip_id FROM public.trip_users 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_trip_users_trip_id ON public.trip_users(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_users_user_id ON public.trip_users(user_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_trip_id ON public.itinerary_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_date ON public.itinerary_items(date);
CREATE INDEX IF NOT EXISTS idx_budget_items_trip_id ON public.budget_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_packing_items_trip_id ON public.packing_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_photos_trip_id ON public.photos(trip_id);
CREATE INDEX IF NOT EXISTS idx_outfits_trip_id ON public.outfits(trip_id);
CREATE INDEX IF NOT EXISTS idx_messages_trip_id ON public.messages(trip_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON public.messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_token ON public.invite_tokens(token);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_trip_id ON public.invite_tokens(trip_id); 
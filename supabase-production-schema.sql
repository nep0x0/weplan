-- =============================================
-- PlanWed Production Database Schema
-- Wedding Planner PWA with Supabase Auth
-- =============================================

-- =============================================
-- 1. USER PROFILES (extends auth.users)
-- =============================================

-- User profiles table to extend Supabase auth.users
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  wedding_date DATE,
  partner_name TEXT,
  venue TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- 2. WEDDINGS
-- =============================================

CREATE TABLE public.weddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Wedding',
  wedding_date DATE,
  venue TEXT,
  budget_total DECIMAL(12,2) DEFAULT 0,
  guest_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weddings
CREATE POLICY "Users can manage own weddings" ON public.weddings
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 3. BUDGET CATEGORIES
-- =============================================

CREATE TABLE public.budget_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  allocated_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  spent_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for budget_categories
CREATE POLICY "Users can manage own budget categories" ON public.budget_categories
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 4. TODOS
-- =============================================

CREATE TABLE public.todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date DATE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for todos
CREATE POLICY "Users can manage own todos" ON public.todos
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 5. GUESTS
-- =============================================

CREATE TABLE public.guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status TEXT CHECK (rsvp_status IN ('pending', 'yes', 'no')) DEFAULT 'pending',
  plus_ones INTEGER DEFAULT 0,
  dietary_restrictions TEXT,
  table_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guests
CREATE POLICY "Users can manage own guests" ON public.guests
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 6. CALENDAR EVENTS
-- =============================================

CREATE TABLE public.calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  type TEXT CHECK (type IN ('ceremony', 'appointment', 'deadline', 'reminder')) DEFAULT 'appointment',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calendar_events
CREATE POLICY "Users can manage own calendar events" ON public.calendar_events
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 7. FUNCTIONS & TRIGGERS
-- =============================================

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_weddings
  BEFORE UPDATE ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_budget_categories
  BEFORE UPDATE ON public.budget_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_todos
  BEFORE UPDATE ON public.todos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_guests
  BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_calendar_events
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 8. AUTO-CREATE USER PROFILE & DEFAULT WEDDING
-- =============================================

-- Function to create user profile and default wedding on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  
  -- Create default wedding
  INSERT INTO public.weddings (user_id, title)
  VALUES (NEW.id, 'My Wedding');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 9. INDEXES FOR PERFORMANCE
-- =============================================

-- Indexes for better query performance
CREATE INDEX idx_weddings_user_id ON public.weddings(user_id);
CREATE INDEX idx_budget_categories_wedding_id ON public.budget_categories(wedding_id);
CREATE INDEX idx_budget_categories_user_id ON public.budget_categories(user_id);
CREATE INDEX idx_todos_wedding_id ON public.todos(wedding_id);
CREATE INDEX idx_todos_user_id ON public.todos(user_id);
CREATE INDEX idx_todos_due_date ON public.todos(due_date);
CREATE INDEX idx_guests_wedding_id ON public.guests(wedding_id);
CREATE INDEX idx_guests_user_id ON public.guests(user_id);
CREATE INDEX idx_guests_rsvp_status ON public.guests(rsvp_status);
CREATE INDEX idx_calendar_events_wedding_id ON public.calendar_events(wedding_id);
CREATE INDEX idx_calendar_events_user_id ON public.calendar_events(user_id);
CREATE INDEX idx_calendar_events_start_date ON public.calendar_events(start_date);

-- =============================================
-- SETUP COMPLETE!
-- =============================================

-- To use this schema:
-- 1. Copy this entire SQL script
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and run this script
-- 4. Your database will be ready for the wedding planner app!

-- Features included:
-- ✅ User profiles extending Supabase auth
-- ✅ Row Level Security (RLS) for data isolation
-- ✅ Auto-creation of user profile and default wedding on signup
-- ✅ Complete wedding planning tables (budget, todos, guests, calendar)
-- ✅ Performance indexes
-- ✅ Updated_at triggers
-- ✅ Data integrity with foreign keys and constraints

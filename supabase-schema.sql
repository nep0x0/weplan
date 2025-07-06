-- Wedding Planner Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create weddings table
CREATE TABLE IF NOT EXISTS weddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bride_name VARCHAR(255) NOT NULL,
  groom_name VARCHAR(255) NOT NULL,
  wedding_date DATE NOT NULL,
  budget_total DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_categories table
CREATE TABLE IF NOT EXISTS budget_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  allocated_amount DECIMAL(12,2) DEFAULT 0,
  spent_amount DECIMAL(12,2) DEFAULT 0,
  color VARCHAR(7) DEFAULT '#E11D48',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(10) CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  due_date DATE,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  rsvp_status VARCHAR(10) CHECK (rsvp_status IN ('pending', 'yes', 'no')) DEFAULT 'pending',
  plus_ones INTEGER DEFAULT 0,
  dietary_restrictions TEXT,
  table_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  type VARCHAR(20) CHECK (type IN ('appointment', 'deadline', 'reminder', 'ceremony')) DEFAULT 'appointment',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weddings_user_id ON weddings(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_wedding_id ON budget_categories(wedding_id);
CREATE INDEX IF NOT EXISTS idx_todos_wedding_id ON todos(wedding_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_wedding_id ON calendar_events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);

-- Enable Row Level Security
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Weddings policies
CREATE POLICY "Users can view their own weddings" ON weddings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weddings" ON weddings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weddings" ON weddings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weddings" ON weddings
  FOR DELETE USING (auth.uid() = user_id);

-- Budget categories policies
CREATE POLICY "Users can view budget categories for their weddings" ON budget_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = budget_categories.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert budget categories for their weddings" ON budget_categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = budget_categories.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update budget categories for their weddings" ON budget_categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = budget_categories.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete budget categories for their weddings" ON budget_categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM weddings 
      WHERE weddings.id = budget_categories.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Similar policies for todos, guests, and calendar_events
-- (Apply the same pattern as budget_categories)

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_weddings_updated_at BEFORE UPDATE ON weddings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON budget_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

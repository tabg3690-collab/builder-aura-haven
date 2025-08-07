import { createClient } from '@supabase/supabase-js';

// These will be environment variables in production
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseMember {
  id: string;
  name: string;
  zone: string;
  mandal: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseFeedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  name: string;
  created_at: string;
  last_login: string | null;
}

// SQL for creating tables (to be run in Supabase dashboard)
export const createTablesSQL = `
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL CHECK (email LIKE '%@gmail.com'),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Members table
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  zone VARCHAR(100) NOT NULL CHECK (zone IN ('Amalsad', 'Dharampur', 'Gandevi', 'Valsad', 'Vapi')),
  mandal VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_members_zone ON members(zone);
CREATE INDEX idx_members_date_of_birth ON members(date_of_birth);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all operations for now, can be refined later)
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON members FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON feedback FOR ALL USING (true);
`;

// Initial admin user (to be inserted manually in Supabase)
export const initialAdminUser = {
  email: 'admin@gmail.com',
  password_hash: '$2b$10$rBV2wHRV3FthCrKzpAhOoeHBLJ5TQZx4PZOGHPJwBOQCFGKxUFRYG', // hashed "admin123"
  role: 'admin',
  name: 'Administrator'
};

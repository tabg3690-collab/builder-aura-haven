import { neon } from "@neondatabase/serverless";

// Get Neon database URL from environment variables
const neonUrl = import.meta.env.VITE_NEON_DATABASE_URL;

// Check if Neon is configured
export const isNeonConfigured = !!neonUrl;

// Create Neon client only if configured
export const sql = isNeonConfigured ? neon(neonUrl) : null;

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
  role: "admin" | "user";
  name: string;
  created_at: string;
  last_login: string | null;
}

// SQL for creating tables (to be run in Neon dashboard)
export const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL CHECK (email LIKE '%@gmail.com'),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
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
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_zone ON members(zone);
CREATE INDEX IF NOT EXISTS idx_members_date_of_birth ON members(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);

-- Insert initial admin users if they don't exist
INSERT INTO users (email, password_hash, role, name) 
SELECT 'admin@gmail.com', 'admin123', 'admin', 'Administrator'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@gmail.com');

INSERT INTO users (email, password_hash, role, name) 
SELECT 'haricharan@gmail.com', 'hari123', 'admin', 'Haricharan'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'haricharan@gmail.com');
`;

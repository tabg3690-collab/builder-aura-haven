-- =====================================================
-- Haricharan Database Setup SQL for NEON
-- Copy and paste this entire query into your Neon SQL Console
-- =====================================================

-- 1. Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Members table for storing member information
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

-- 3. Feedback table for storing user feedback
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_zone ON members(zone);
CREATE INDEX IF NOT EXISTS idx_members_date_of_birth ON members(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);

-- 5. Insert initial admin users (only if they don't exist)
-- SECURITY NOTE: Change these passwords after setup!
INSERT INTO users (email, password_hash, role, name)
SELECT 'admin@gmail.com', 'TempPass123!', 'admin', 'Administrator'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@gmail.com');

INSERT INTO users (email, password_hash, role, name)
SELECT 'haricharan@gmail.com', 'TempPass456!', 'admin', 'Haricharan'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'haricharan@gmail.com');

-- 6. Insert some sample members (only if table is empty)
INSERT INTO members (name, zone, mandal, date_of_birth, phone_number, email) 
SELECT * FROM (VALUES 
  ('Rajesh Patel', 'Vapi', 'Vapi Central', '1985-03-15', '+91 98765 43210', 'rajesh.patel@gmail.com'),
  ('Priya Shah', 'Gandevi', 'Gandevi North', '1990-07-22', '+91 87654 32109', 'priya.shah@gmail.com'),
  ('Amit Kumar', 'Valsad', 'Valsad East', '1988-11-08', '+91 76543 21098', 'amit.kumar@gmail.com'),
  ('Kavita Desai', 'Dharampur', 'Dharampur West', '1992-12-03', '+91 65432 10987', 'kavita.desai@gmail.com'),
  ('Suresh Mehta', 'Amalsad', 'Amalsad South', '1987-05-18', '+91 54321 09876', 'suresh.mehta@gmail.com')
) AS sample_data(name, zone, mandal, date_of_birth, phone_number, email)
WHERE NOT EXISTS (SELECT 1 FROM members LIMIT 1);

-- =====================================================
-- Setup Complete! 
-- Your Neon database is now ready for use.
-- =====================================================

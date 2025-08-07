-- =====================================================
-- Haricharan Database Setup SQL
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Users table for authentication
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL CHECK (email LIKE '%@gmail.com'),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Members table for storing member information
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

-- 3. Feedback table for storing user feedback
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX idx_members_zone ON members(zone);
CREATE INDEX idx_members_date_of_birth ON members(date_of_birth);
CREATE INDEX idx_members_name ON members(name);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON members FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON feedback FOR ALL USING (true);

-- 7. Insert initial admin user
-- Note: In production, password should be properly hashed with bcrypt
INSERT INTO users (email, password_hash, role, name) VALUES 
('admin@gmail.com', 'admin123', 'admin', 'Administrator'),
('haricharan@gmail.com', 'hari123', 'admin', 'Haricharan');

-- 8. Insert some sample members (optional)
INSERT INTO members (name, zone, mandal, date_of_birth, phone_number, email) VALUES 
('Rajesh Patel', 'Vapi', 'Vapi Central', '1985-03-15', '+91 98765 43210', 'rajesh.patel@gmail.com'),
('Priya Shah', 'Gandevi', 'Gandevi North', '1990-07-22', '+91 87654 32109', 'priya.shah@gmail.com'),
('Amit Kumar', 'Valsad', 'Valsad East', '1988-11-08', '+91 76543 21098', 'amit.kumar@gmail.com'),
('Kavita Desai', 'Dharampur', 'Dharampur West', '1992-12-03', '+91 65432 10987', 'kavita.desai@gmail.com'),
('Suresh Mehta', 'Amalsad', 'Amalsad South', '1987-05-18', '+91 54321 09876', 'suresh.mehta@gmail.com');

-- =====================================================
-- Setup Complete! 
-- Your database is now ready for use.
-- =====================================================

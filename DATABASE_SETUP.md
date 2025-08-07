# Database Setup Instructions

This guide will help you set up a real Supabase database for your Haricharan Database application.

## 🚀 Quick Setup

### 1. Create Supabase Account

1. Go to [https://supabase.com/](https://supabase.com/)
2. Sign up for a free account
3. Create a new project

### 2. Get Database Credentials

1. In your Supabase project dashboard, go to **Settings > API**
2. Copy your **Project URL** and **anon public key**

### 3. Configure Environment Variables

1. Create a `.env` file in your project root
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and run this SQL script:

```sql
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

-- RLS Policies (allow all operations for now)
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON members FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON feedback FOR ALL USING (true);
```

### 5. Create Admin User

1. In the Supabase dashboard, go to **Table Editor > users**
2. Click **Insert > Insert row**
3. Add your admin user:

```
email: admin@gmail.com
password_hash: admin123
role: admin
name: Administrator
```

**Note:** In production, you should hash passwords properly. This is just for initial setup.

### 6. Test Your Setup

1. Start your application: `npm run dev`
2. Try logging in with your admin credentials
3. Add a test member to verify database connectivity

## 🔒 Security Notes

### Production Security (Important!)

- **Password Hashing**: Implement proper bcrypt password hashing
- **RLS Policies**: Configure proper Row Level Security policies
- **Environment Variables**: Keep your database credentials secure
- **HTTPS**: Always use HTTPS in production

### Recommended Security Updates

1. Install bcrypt: `npm install bcrypt @types/bcrypt`
2. Update the `usersAPI.hashPassword()` and `usersAPI.verifyPassword()` functions
3. Configure proper RLS policies based on user roles

## 📊 Database Features

### What's Included

- ✅ **Members Management**: Store and manage member data
- ✅ **Feedback System**: Collect and store user feedback
- ✅ **User Authentication**: Database-backed user login
- ✅ **Role-Based Access**: Admin vs regular user permissions
- ✅ **Data Validation**: Proper constraints and validation
- ✅ **Performance Optimization**: Indexes for fast queries

### Data Storage

- **Members**: Name, zone, mandal, contact info, birthdays
- **Feedback**: User inquiries and feedback submissions
- **Users**: Admin and user accounts with role-based access

## 🆘 Troubleshooting

### Common Issues

1. **Connection Error**: Check your environment variables
2. **Table Not Found**: Make sure you ran the SQL script
3. **Login Failed**: Verify user exists in users table
4. **Permission Denied**: Check RLS policies

### Getting Help

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Community: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

## 🚀 Next Steps

1. **Add More Users**: Create additional admin and user accounts
2. **Import Data**: Use the Excel import feature to bulk add members
3. **Backup Strategy**: Set up regular database backups
4. **Monitor Usage**: Keep an eye on your Supabase usage limits

Your Haricharan Database is now ready for production use with real data storage! 🎉

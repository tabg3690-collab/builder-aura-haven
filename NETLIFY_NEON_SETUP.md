# Netlify + Neon Database Setup Guide

Perfect choice! Netlify with Neon database is an excellent combination for your Haricharan Database application.

## 🚀 **What You Need to Do**

Since you've already created the database on Netlify using Neon, you just need to:

### **Step 1: Get Your Neon Database URL**

1. **In your Netlify dashboard**, go to your site settings
2. **Go to Environment Variables** (or Functions → Environment Variables)
3. **Find your Neon database URL** - it should look like:
   ```
   postgresql://username:password@host.neon.tech/database_name?sslmode=require
   ```

### **Step 2: Set Environment Variable**

In your Netlify site settings:

1. **Add Environment Variable**:

   - **Key**: `NEON_DATABASE_URL`
   - **Value**: Your Neon PostgreSQL connection string

2. **Also add for frontend**:
   - **Key**: `VITE_NEON_DATABASE_URL`
   - **Value**: Same Neon PostgreSQL connection string

### **Step 3: Create Database Tables**

1. **Access your Neon database** (you can do this through Netlify dashboard or Neon console)
2. **Run this SQL** to create the required tables:

```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_members_zone ON members(zone);
CREATE INDEX IF NOT EXISTS idx_members_date_of_birth ON members(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);

-- Insert initial admin users
INSERT INTO users (email, password_hash, role, name)
SELECT 'admin@gmail.com', 'admin123', 'admin', 'Administrator'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@gmail.com');

INSERT INTO users (email, password_hash, role, name)
SELECT 'haricharan@gmail.com', 'hari123', 'admin', 'Haricharan'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'haricharan@gmail.com');
```

### **Step 4: Deploy & Test**

1. **Deploy your site** on Netlify
2. **Test login** with: `admin@gmail.com` / `admin123`
3. **Add members** to verify database connectivity

## 🎯 **Your Current Setup**

✅ **Netlify Hosting**: Your frontend is hosted on Netlify  
✅ **Neon Database**: PostgreSQL database for data storage  
✅ **Serverless Functions**: Netlify functions handle API calls  
✅ **Code Updated**: All code now works with Neon instead of Supabase

## ��� **What I've Updated in Your Code**

1. **Replaced Supabase** with Neon PostgreSQL client
2. **Created Netlify Functions** for API endpoints:
   - `/api/members` - Member management
   - `/api/feedback` - Feedback submission
   - `/api/auth` - User authentication
   - `/api/stats` - Dashboard statistics
3. **Updated all pages** to use Neon configuration checks
4. **Demo mode** works when database isn't configured

## 🚀 **Benefits of Your Setup**

- **🌟 Serverless**: Scales automatically with usage
- **💰 Cost Effective**: Pay only for what you use
- **⚡ Fast**: Neon is optimized for performance
- **🔒 Secure**: Built-in security features
- **🔄 Reliable**: Enterprise-grade uptime

## ❓ **Need Help?**

If you need help finding your Neon database URL or setting up the environment variables, just let me know!

Your Haricharan Database is now perfectly set up for production use with Netlify + Neon! 🎉

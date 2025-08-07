# Update Your Supabase Credentials

## Step 1: Get Your Credentials from Supabase
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the following:

**Project URL**: `https://abc123def456.supabase.co`
**anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)

## Step 2: Update Environment Variables

Run these commands in your terminal OR use the Builder.io DevServerControl:

### Option A: Using DevServerControl (Recommended)
1. In Builder.io, use the DevServerControl tool
2. Set these environment variables:
   - VITE_SUPABASE_URL = your actual project URL
   - VITE_SUPABASE_ANON_KEY = your actual anon key

### Option B: Using .env file
Update the .env file with your actual values:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 3: Restart Your Development Server
After updating the credentials, restart your development server for changes to take effect.

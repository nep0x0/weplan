# 🗄️ Database Setup Guide

## Production Database Schema Setup

### **Step 1: Run Database Schema**

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project: `lxchljeyf zyioqqhagwh`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Schema Script**
   - Copy the entire content from `supabase-production-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

### **Step 2: Verify Tables Created**

After running the schema, you should see these tables in your Database:

#### **Core Tables:**
- ✅ `user_profiles` - User profile information
- ✅ `weddings` - Wedding details per user
- ✅ `budget_categories` - Budget planning
- ✅ `todos` - Task management
- ✅ `guests` - Guest list management
- ✅ `calendar_events` - Event scheduling

#### **Features Enabled:**
- ✅ **Row Level Security (RLS)** - Data isolation per user
- ✅ **Auto-triggers** - User profile and default wedding creation
- ✅ **Performance indexes** - Optimized queries
- ✅ **Updated_at triggers** - Automatic timestamp updates

### **Step 3: Test Database Connection**

1. **Start the app**: `npm run dev`
2. **Sign up** with a new account
3. **Check database** - Should auto-create:
   - User profile in `user_profiles` table
   - Default wedding in `weddings` table

### **Step 4: Environment Variables**

Make sure your `.env.local` has:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lxchljeyf zyioqqhagwh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4Y2hsamV5Znp5aW9xcWhhZ3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTE5NDgsImV4cCI6MjA2NzM4Nzk0OH0.Hcg8iTLDXmcQD0yieYwoJAPFPFw1d3-gKaLg7pipc-g
```

### **Step 5: Optional - Enable Google OAuth**

1. **Go to Authentication > Providers**
2. **Enable Google provider**
3. **Add OAuth credentials**:
   - Get from [Google Cloud Console](https://console.cloud.google.com)
   - Add authorized redirect URI: `https://lxchljeyf zyioqqhagwh.supabase.co/auth/v1/callback`

## 🔒 Security Features

### **Row Level Security (RLS)**
- Each user can only access their own data
- Automatic data isolation
- Secure by default

### **Data Relationships**
```
auth.users (Supabase)
    ↓
user_profiles (1:1)
    ↓
weddings (1:many)
    ↓
├── budget_categories
├── todos  
├── guests
└── calendar_events
```

### **Auto-Creation on Signup**
When a user signs up:
1. ✅ User profile is created automatically
2. ✅ Default wedding is created
3. ✅ User can start planning immediately

## 🚀 Production Ready

### **Performance Optimizations**
- ✅ Database indexes on frequently queried columns
- ✅ Efficient RLS policies
- ✅ Optimized foreign key relationships

### **Data Integrity**
- ✅ Foreign key constraints
- ✅ Check constraints for enums
- ✅ NOT NULL constraints where needed
- ✅ Cascade deletes for cleanup

### **Scalability**
- ✅ UUID primary keys
- ✅ Timestamp tracking
- ✅ Extensible schema design
- ✅ Ready for multi-wedding support

## 🧪 Testing

### **Manual Testing**
1. Sign up new user → Check `user_profiles` and `weddings` tables
2. Add budget category → Check `budget_categories` table
3. Create todo → Check `todos` table
4. Add guest → Check `guests` table
5. Create event → Check `calendar_events` table

### **RLS Testing**
1. Create two different users
2. Verify each user only sees their own data
3. Try to access other user's data (should fail)

## 🎯 Next Steps

After database setup:
1. ✅ **Test authentication flow**
2. ✅ **Verify data isolation**
3. ✅ **Test all CRUD operations**
4. 🔄 **Connect app to production database**
5. 🔄 **Deploy to Vercel with environment variables**

Your wedding planner database is now production-ready! 🎉

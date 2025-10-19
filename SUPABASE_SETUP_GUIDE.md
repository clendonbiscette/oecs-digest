# OECS Education Data Entry System - Supabase Setup Guide

This guide will walk you through setting up Supabase for the OECS Education Data Entry System.

## Prerequisites

- A Supabase account (sign up at https://supabase.com if you don't have one)
- Node.js installed on your machine
- Access to this project directory

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Enter project details:
   - **Name**: OECS Education Data System
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to Caribbean (e.g., US East)
4. Click "Create new project"
5. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear) in the left sidebar
2. Click on **API** in the settings menu
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. In this project directory, create a file named `.env.local`
2. Copy the contents from `.env.example` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=your-openai-api-key
```

## Step 4: Run the Database Schema

1. In your Supabase project dashboard, click on the **SQL Editor** icon in the left sidebar
2. Click **New Query**
3. Open the file `supabase-schema.sql` from this project
4. Copy the entire contents of `supabase-schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for the script to complete (you should see "Success" messages)

This will create:
- ✅ All database tables (countries, academic_years, institutions, enrollment tables, etc.)
- ✅ Row Level Security policies (data isolation per country)
- ✅ Seed data for 9 OECS member states
- ✅ Academic years (2022-2023 through 2025-2026)
- ✅ Indexes for performance
- ✅ Triggers for automatic timestamp updates

## Step 5: Verify Database Setup

1. In Supabase, click on the **Table Editor** icon in the left sidebar
2. You should see the following tables:
   - `countries` (9 OECS member states)
   - `academic_years` (4 years)
   - `user_profiles`
   - `data_submissions`
   - `institutions`
   - `early_childhood_enrollment`
   - `primary_enrollment`
   - `secondary_enrollment`
   - `special_education_enrollment`

3. Click on `countries` table - you should see 9 rows with OECS member states
4. Click on `academic_years` table - you should see 4 academic years

## Step 6: Configure Authentication

1. In Supabase, click on **Authentication** icon in the left sidebar
2. Click on **Providers**
3. Enable **Email** provider (it should be enabled by default)
4. Optional: Configure email templates under **Email Templates**

### Email Configuration (Optional but Recommended)

For production, you should configure a custom SMTP server:
1. Go to **Project Settings** > **Auth**
2. Scroll to **SMTP Settings**
3. Enter your SMTP server details (Gmail, SendGrid, AWS SES, etc.)

## Step 7: Create Your First User (Admin)

You have two options:

### Option A: Using Supabase Dashboard (Recommended for first admin)

1. In Supabase, click on **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter:
   - **Email**: your admin email
   - **Password**: choose a strong password
   - **Auto Confirm User**: Check this box
4. Click **Create user**
5. Copy the User ID (UUID)
6. Go to **SQL Editor** and run:

```sql
INSERT INTO user_profiles (id, email, full_name, role, is_active)
VALUES (
  'paste-user-id-here',
  'your-email@example.com',
  'Your Full Name',
  'admin',
  true
);
```

### Option B: Using the App (After Step 8)

1. Start the development server
2. Navigate to the signup page
3. Create your account
4. Manually update the user role in Supabase:
   - Go to **Table Editor** > `user_profiles`
   - Find your user
   - Change `role` from `statistician` to `admin`

## Step 8: Install Dependencies and Run

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

Navigate to http://localhost:3000

## Step 9: Create Member State User Accounts

For each OECS member state statistician:

1. **As Admin**: Use the admin interface (to be built) to invite users
2. **Or Manually**:
   - Have them sign up through the app
   - In Supabase Table Editor > `user_profiles`, set their:
     - `country_id` (1-9 for respective country)
     - `role` = `'statistician'`
     - `is_active` = `true`

### Country IDs

```
1 = Anguilla
2 = Antigua and Barbuda
3 = Dominica
4 = Grenada
5 = Montserrat
6 = Saint Kitts and Nevis
7 = Saint Lucia
8 = Saint Vincent and the Grenadines
9 = British Virgin Islands
```

## Row Level Security (RLS) Explained

The database is configured with **Row Level Security** to ensure:

- **Statisticians** can only view/edit data for their assigned country
- **Admins** can view/edit all data
- **Viewers** can view all data but cannot edit

This is automatically enforced at the database level - no additional code required!

## Troubleshooting

### Error: "relation 'auth.users' does not exist"

This shouldn't happen in Supabase, but if it does:
1. Make sure you're running the SQL in your Supabase project (not locally)
2. The `auth` schema is automatically created by Supabase

### Error: "permission denied for schema auth"

This is normal when running locally. The RLS policies reference `auth.users` which only exists in Supabase.

### Can't log in / Authentication errors

1. Check that your `.env.local` file has the correct values
2. Make sure you copied the **anon** key, not the **service_role** key
3. Restart your dev server after changing `.env.local`

### Data not showing up

1. Check that RLS policies are enabled
2. Verify your user has a `user_profiles` record with correct `country_id`
3. Check browser console for errors

## Next Steps

After completing this setup:

1. ✅ Database is ready
2. ✅ Authentication is configured
3. ✅ RLS policies are in place
4. ⏭️ Build the data entry UI (next phase)
5. ⏭️ Test with sample data
6. ⏭️ Deploy to production

## Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Enable email confirmation for new users
- [ ] Configure custom SMTP for emails
- [ ] Set up database backups (Supabase does this automatically)
- [ ] Enable 2FA for admin accounts
- [ ] Review and test all RLS policies
- [ ] Set up monitoring and alerts

## Support

For issues with:
- **Supabase setup**: https://supabase.com/docs
- **This project**: Check project documentation or contact project maintainer

## Database Backup

Supabase automatically backs up your database, but you can also:

1. Go to **Database** > **Backups** in Supabase
2. See automatic daily backups
3. Manually create a backup by clicking **Create backup**
4. Download backups for local storage

---

**Setup Time**: ~15-30 minutes

**Next**: Once this is complete, you can start building the data entry forms!
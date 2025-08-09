-- ================================================
-- UPDATE WEBSITE_USERS TABLE FOR ORIGINAL DATABASE
-- ================================================
-- This script updates the website_users table structure and policies
-- Run this in your Supabase SQL Editor for your original database

-- First, let's ensure the table has all the correct columns
-- (This will add missing columns if they don't exist, or do nothing if they do)

-- Add any missing columns (these will be ignored if they already exist)
DO $$ 
BEGIN
    -- Add business_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'website_users' AND column_name = 'business_id') THEN
        ALTER TABLE public.website_users 
        ADD COLUMN business_id uuid NOT NULL DEFAULT '550e8400-e29b-41d4-a716-446655440000'::uuid;
    END IF;

    -- Add is_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'website_users' AND column_name = 'is_verified') THEN
        ALTER TABLE public.website_users 
        ADD COLUMN is_verified boolean DEFAULT false;
    END IF;

    -- Add verification_token column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'website_users' AND column_name = 'verification_token') THEN
        ALTER TABLE public.website_users 
        ADD COLUMN verification_token text;
    END IF;

    -- Add reset_token column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'website_users' AND column_name = 'reset_token') THEN
        ALTER TABLE public.website_users 
        ADD COLUMN reset_token text;
    END IF;

    -- Add reset_token_expires column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'website_users' AND column_name = 'reset_token_expires') THEN
        ALTER TABLE public.website_users 
        ADD COLUMN reset_token_expires timestamp with time zone;
    END IF;

    -- Add last_login column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'website_users' AND column_name = 'last_login') THEN
        ALTER TABLE public.website_users 
        ADD COLUMN last_login timestamp with time zone;
    END IF;

    -- Ensure country has default value
    ALTER TABLE public.website_users ALTER COLUMN country SET DEFAULT 'Sri Lanka';

    RAISE NOTICE 'Website users table structure updated successfully!';
END $$;

-- ================================================
-- ENABLE ROW LEVEL SECURITY
-- ================================================
ALTER TABLE public.website_users ENABLE ROW LEVEL SECURITY;

-- ================================================
-- DROP EXISTING POLICIES (if any)
-- ================================================
DROP POLICY IF EXISTS "Users can view own profile" ON website_users;
DROP POLICY IF EXISTS "Users can update own profile" ON website_users;
DROP POLICY IF EXISTS "Public can insert new users" ON website_users;
DROP POLICY IF EXISTS "Managers can view all website users" ON website_users;

-- ================================================
-- CREATE RLS POLICIES FOR WEBSITE_USERS
-- ================================================

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.website_users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.website_users
    FOR UPDATE USING (auth.uid() = id);

-- Allow public registration (anyone can insert new users)
CREATE POLICY "Public can insert new users" ON public.website_users
    FOR INSERT WITH CHECK (true);

-- Allow managers to view all website users (optional - for admin panel)
CREATE POLICY "Managers can view all website users" ON public.website_users
    FOR SELECT USING (
        auth.uid() IS NOT NULL 
        AND EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (
                'admin@geolex.com',
                'manager@geolex.com'
                -- Add your admin emails here
            )
        )
    );

-- ================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ================================================
CREATE INDEX IF NOT EXISTS idx_website_users_email ON public.website_users(email);
CREATE INDEX IF NOT EXISTS idx_website_users_business_id ON public.website_users(business_id);
CREATE INDEX IF NOT EXISTS idx_website_users_verification_token ON public.website_users(verification_token);
CREATE INDEX IF NOT EXISTS idx_website_users_reset_token ON public.website_users(reset_token);

-- ================================================
-- GRANT PERMISSIONS
-- ================================================
-- Allow anonymous users to register (insert)
GRANT INSERT ON public.website_users TO anon;

-- Allow authenticated users to select and update their own data
GRANT SELECT, UPDATE ON public.website_users TO authenticated;

-- ================================================
-- CREATE UPDATED_AT TRIGGER
-- ================================================
-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_website_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_website_users_updated_at ON public.website_users;

-- Create the trigger
CREATE TRIGGER update_website_users_updated_at 
    BEFORE UPDATE ON public.website_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_website_users_updated_at();

-- ================================================
-- TEST THE CONFIGURATION
-- ================================================
DO $$
DECLARE
    test_result INTEGER;
BEGIN
    -- Test that the table structure is correct
    SELECT COUNT(*) INTO test_result 
    FROM information_schema.columns 
    WHERE table_name = 'website_users' 
    AND column_name IN ('id', 'email', 'password_hash', 'first_name', 'last_name', 
                        'phone', 'address', 'city', 'postal_code', 'country', 
                        'is_verified', 'verification_token', 'reset_token', 
                        'reset_token_expires', 'created_at', 'updated_at', 
                        'last_login', 'business_id');
    
    IF test_result = 18 THEN
        RAISE NOTICE '✓ All required columns are present';
    ELSE
        RAISE NOTICE '⚠ Some columns may be missing. Found % columns', test_result;
    END IF;
END $$;

-- ================================================
-- SUCCESS MESSAGE
-- ================================================
DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE 'WEBSITE_USERS TABLE UPDATE COMPLETED!';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Table structure: ✓ Updated';
    RAISE NOTICE 'RLS policies: ✓ Created';
    RAISE NOTICE 'Indexes: ✓ Added for performance';
    RAISE NOTICE 'Permissions: ✓ Granted';
    RAISE NOTICE 'Triggers: ✓ Updated_at trigger active';
    RAISE NOTICE '';
    RAISE NOTICE 'Your website_users table is now ready!';
    RAISE NOTICE 'You can now insert users and test authentication.';
    RAISE NOTICE '================================================';
END $$;

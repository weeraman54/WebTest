-- ================================================
-- QUICK FIX: DISABLE RLS FOR INVENTORY ITEMS
-- ================================================
-- This is the simplest solution for an e-commerce website
-- Run this in your Supabase SQL Editor

-- Disable RLS for inventory_items to allow public access
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled for user_profiles but fix the recursive policies
DROP POLICY IF EXISTS "Managers can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Managers can insert profiles" ON user_profiles;

-- Create non-recursive policies for user_profiles
CREATE POLICY "Managers can view all profiles" ON user_profiles
    FOR SELECT USING (
        -- Users can view their own profile
        id = auth.uid()
        OR
        -- Or if they are authenticated and their email is in the admin list
        (auth.uid() IS NOT NULL AND auth.email() IN ('admin@geolex.com', 'manager@geolex.com'))
    );

CREATE POLICY "Managers can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL 
        AND auth.email() IN ('admin@geolex.com', 'manager@geolex.com')
    );

-- ================================================
-- INSTRUCTIONS:
-- ================================================
-- 1. Replace 'admin@geolex.com' and 'manager@geolex.com' with your actual admin emails
-- 2. Run this script in your Supabase SQL Editor
-- 3. Your website should now load products correctly
-- ================================================

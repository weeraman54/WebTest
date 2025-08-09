-- ================================================
-- FIX RLS POLICIES TO PREVENT INFINITE RECURSION
-- ================================================
-- Run this script in your Supabase SQL Editor to fix the RLS policy issues

-- First, drop all existing problematic policies
DROP POLICY IF EXISTS "Everyone can view active inventory" ON inventory_items;
DROP POLICY IF EXISTS "Managers can modify inventory" ON inventory_items;
DROP POLICY IF EXISTS "Managers can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Managers can insert profiles" ON user_profiles;

-- ================================================
-- INVENTORY ITEMS POLICIES (Public Access)
-- ================================================
-- For website products, we want everyone to be able to view them
-- This includes both authenticated and anonymous users

-- Allow everyone to view active website items
CREATE POLICY "Public can view website items" ON inventory_items
    FOR SELECT USING (
        is_active = true 
        AND is_website_item = true
    );

-- Allow authenticated users to view all active items
CREATE POLICY "Authenticated users can view active items" ON inventory_items
    FOR SELECT USING (
        auth.uid() IS NOT NULL 
        AND is_active = true
    );

-- Allow managers to modify inventory (simplified - no recursion)
CREATE POLICY "Managers can modify inventory" ON inventory_items
    FOR ALL USING (
        auth.uid() IS NOT NULL 
        AND EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (
                -- Add your admin/manager emails here
                'admin@geolex.com',
                'manager@geolex.com'
                -- Add more emails as needed
            )
        )
    );

-- ================================================
-- USER PROFILES POLICIES (Simplified)
-- ================================================
-- Keep the basic policies but remove the recursive ones

-- Simplified manager check - using a different approach
CREATE POLICY "Managers can view all profiles" ON user_profiles
    FOR SELECT USING (
        auth.uid() IS NOT NULL 
        AND (
            -- Users can always view their own profile
            id = auth.uid()
            OR
            -- Managers can view all profiles (using email-based check to avoid recursion)
            EXISTS (
                SELECT 1 FROM auth.users 
                WHERE auth.users.id = auth.uid()
                AND auth.users.email IN (
                    -- Add your admin/manager emails here
                    'admin@geolex.com',
                    'manager@geolex.com'
                    -- Add more emails as needed
                )
            )
        )
    );

CREATE POLICY "Managers can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL 
        AND EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (
                -- Add your admin/manager emails here
                'admin@geolex.com',
                'manager@geolex.com'
                -- Add more emails as needed
            )
        )
    );

-- ================================================
-- ALTERNATIVE: DISABLE RLS FOR WEBSITE ITEMS (Simpler approach)
-- ================================================
-- If you want the simplest solution, you can comment out the above policies
-- and uncomment the following to disable RLS for inventory_items completely:

-- ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;

-- This will make all inventory items publicly accessible, which is often
-- what you want for an e-commerce website anyway.

-- ================================================
-- INSTRUCTIONS:
-- ================================================
-- 1. Replace 'admin@geolex.com' and 'manager@geolex.com' with your actual admin emails
-- 2. If you prefer the simpler approach, uncomment the DISABLE RLS line above
-- 3. Run this script in your Supabase SQL Editor
-- 4. Test your website to make sure products load correctly

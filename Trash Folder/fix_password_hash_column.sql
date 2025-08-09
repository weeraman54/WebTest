-- ================================================
-- FIX PASSWORD_HASH COLUMN FOR SUPABASE AUTH
-- ================================================
-- This script makes password_hash nullable since we use Supabase Auth
-- Run this in your Supabase SQL Editor

-- Make password_hash column nullable
ALTER TABLE public.website_users 
ALTER COLUMN password_hash DROP NOT NULL;

-- Update existing records that might have null password_hash
UPDATE public.website_users 
SET password_hash = 'auth_managed' 
WHERE password_hash IS NULL;

-- Add a check constraint to ensure password_hash is not empty string
ALTER TABLE public.website_users 
ADD CONSTRAINT password_hash_not_empty 
CHECK (password_hash IS NULL OR length(trim(password_hash)) > 0);

-- Add comment for documentation
COMMENT ON COLUMN public.website_users.password_hash IS 
'Password hash - nullable since authentication is managed by Supabase Auth. Use "auth_managed" as placeholder.';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE '✅ PASSWORD_HASH COLUMN UPDATED SUCCESSFULLY!';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '  ✓ password_hash column is now nullable';
    RAISE NOTICE '  ✓ Existing null values updated to "auth_managed"';
    RAISE NOTICE '  ✓ Check constraint added to prevent empty strings';
    RAISE NOTICE '';
    RAISE NOTICE 'Your website_users table now works with Supabase Auth!';
    RAISE NOTICE '================================================';
END $$;

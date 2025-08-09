-- ================================================
-- CREATE PUBLIC INVENTORY VIEW FOR E-COMMERCE
-- ================================================
-- This creates a public view that automatically updates when inventory_items changes
-- Run this in your Supabase SQL Editor

-- First, ensure the main table has proper security
-- Keep RLS enabled on the main inventory_items table for admin access
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Drop the view if it exists (for updates)
DROP VIEW IF EXISTS public.inventory_item_view;

-- Create the public view with all columns
CREATE VIEW public.inventory_item_view AS
SELECT 
  id,
  name,
  description,
  category,
  unit_of_measure,
  purchase_cost,
  selling_price,
  current_stock,
  reorder_level,
  sku,
  is_active,
  is_website_item,
  image_url,
  additional_images,
  specifications,
  weight,
  dimensions,
  url_slug,
  manufacturer,
  model_number,
  warranty_period,
  is_featured,
  is_on_sale,
  sale_price,
  meta_description,
  search_keywords,
  barcode,
  supplier_id,
  last_restocked_date,
  created_at,
  updated_at
FROM inventory_items 
WHERE is_website_item = true 
  AND is_active = true;

-- Make the view completely public (no RLS)
ALTER VIEW public.inventory_item_view OWNER TO postgres;

-- Grant public access to the view
GRANT SELECT ON public.inventory_item_view TO anon;
GRANT SELECT ON public.inventory_item_view TO authenticated;

-- Optional: Create an index on the underlying table for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_website_items 
ON inventory_items (is_website_item, is_active, category, is_featured);

-- ================================================
-- EXPLANATION:
-- ================================================
-- 1. The main inventory_items table keeps RLS for admin security
-- 2. The view filters only website items (is_website_item = true, is_active = true)
-- 3. The view is completely public - no authentication required
-- 4. All columns are included for maximum flexibility
-- 5. Out-of-stock items are included (no current_stock > 0 filter)
-- 6. Real-time updates: when inventory_items changes, the view updates automatically
-- 7. Performance optimized with database index

-- ================================================
-- VERIFICATION QUERY:
-- ================================================
-- Run this to test the view after creation:
-- SELECT COUNT(*) FROM inventory_item_view;
-- SELECT * FROM inventory_item_view LIMIT 5;

-- ================================================
-- URGENT: CREATE INVENTORY VIEW TO FIX WEBSITE
-- ================================================
-- Copy and paste this ENTIRE script into Supabase SQL Editor and run it

-- First, ensure the main table has proper security
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

-- Create performance index
CREATE INDEX IF NOT EXISTS idx_inventory_website_items 
ON inventory_items (is_website_item, is_active, category, is_featured);

-- Test the view (should return count of website products)
SELECT COUNT(*) as total_website_products FROM inventory_item_view;

-- Show first 3 products to verify
SELECT name, category, selling_price, is_featured 
FROM inventory_item_view 
LIMIT 3;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE '✅ INVENTORY VIEW CREATED SUCCESSFULLY!';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Your website should now load products correctly.';
    RAISE NOTICE 'Refresh your React app to see the changes.';
    RAISE NOTICE '================================================';
END $$;

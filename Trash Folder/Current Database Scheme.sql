-- ================================================
-- COMPLETE DATABASE SETUP SCRIPT
-- ================================================
-- This script creates the entire database from scratch
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- PART 1: CREATE ALL BASE TABLES
-- ================================================

CREATE TABLE public.businesses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'trial'::text])),
  subscription_plan text NOT NULL DEFAULT 'trial'::text CHECK (subscription_plan = ANY (ARRAY['trial'::text, 'basic'::text, 'standard'::text, 'premium'::text, 'enterprise'::text])),
  subscription_status text DEFAULT 'active'::text CHECK (subscription_status = ANY (ARRAY['active'::text, 'cancelled'::text, 'past_due'::text, 'suspended'::text])),
  is_active boolean DEFAULT true,
  max_users integer DEFAULT 5,
  trial_start_date timestamp with time zone DEFAULT now(),
  trial_end_date timestamp with time zone DEFAULT (now() + '30 days'::interval),
  subscription_start_date timestamp with time zone,
  subscription_end_date timestamp with time zone,
  grace_period_end_date timestamp with time zone,
  manager_id uuid,
  contact_email text,
  contact_phone text,
  business_address text,
  address text,
  city text,
  state_province text,
  country text,
  postal_code text,
  phone_number text,
  email text,
  tax_id text,
  logo_url text,
  is_custom_plan boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT businesses_pkey PRIMARY KEY (id)
);

CREATE TABLE public.website_users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'Sri Lanka'::text,
  is_verified boolean DEFAULT false,
  verification_token text,
  reset_token text,
  reset_token_expires timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone,
  business_id uuid NOT NULL DEFAULT '550e8400-e29b-41d4-a716-446655440000'::uuid,
  CONSTRAINT website_users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid DEFAULT '550e8400-e29b-41d4-a716-446655440000'::uuid,
  name text NOT NULL,
  telephone text,
  address text,
  email text,
  source text DEFAULT 'manual'::text,
  registered_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  website_user_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  -- Authentication columns (added for Document 2 compatibility)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  preferences JSONB DEFAULT '{}',
  loyalty_points INTEGER DEFAULT 0,
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);

CREATE TABLE public.inventory_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid DEFAULT '550e8400-e29b-41d4-a716-446655440000'::uuid,
  name text NOT NULL,
  description text,
  category text,
  unit_of_measure text DEFAULT 'units'::text,
  purchase_cost numeric DEFAULT 0,
  selling_price numeric DEFAULT 0,
  current_stock integer DEFAULT 0,
  reorder_level integer DEFAULT 0,
  sku text,
  is_active boolean DEFAULT true,
  is_website_item boolean DEFAULT false,
  image_url text,
  additional_images text DEFAULT '[]'::text,
  specifications text,
  weight numeric,
  dimensions text,
  url_slug text,
  meta_description text,
  is_featured boolean DEFAULT false,
  sale_price numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_items_pkey PRIMARY KEY (id)
);

CREATE TABLE public.suppliers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  telephone text,
  address text,
  payment_terms text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  business_id uuid NOT NULL,
  CONSTRAINT suppliers_pkey PRIMARY KEY (id),
  CONSTRAINT suppliers_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id)
);

CREATE TABLE public.sales_orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid DEFAULT '550e8400-e29b-41d4-a716-446655440000'::uuid,
  order_number text NOT NULL,
  customer_id uuid,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])),
  order_date timestamp with time zone DEFAULT now(),
  total_amount numeric NOT NULL,
  payment_method text DEFAULT 'card'::text,
  notes text,
  order_source text DEFAULT 'manual'::text CHECK (order_source = ANY (ARRAY['manual'::text, 'website'::text, 'api'::text])),
  shipping_address text,
  shipping_city text,
  shipping_postal_code text,
  customer_email text,
  customer_phone text,
  delivery_instructions text,
  website_user_id uuid,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sales_orders_pkey PRIMARY KEY (id),
  CONSTRAINT sales_orders_website_user_id_fkey FOREIGN KEY (website_user_id) REFERENCES public.website_users(id),
  CONSTRAINT sales_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);

CREATE TABLE public.sales_order_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  sales_order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  discount numeric DEFAULT 0,
  total_price numeric NOT NULL,
  CONSTRAINT sales_order_items_pkey PRIMARY KEY (id),
  CONSTRAINT sales_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.inventory_items(id),
  CONSTRAINT sales_order_items_sales_order_id_fkey FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id)
);

CREATE TABLE public.purchase_orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_number text NOT NULL UNIQUE,
  supplier_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['draft'::text, 'sent'::text, 'received'::text, 'completed'::text, 'cancelled'::text])),
  total_amount numeric NOT NULL,
  expected_delivery_date timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  business_id uuid NOT NULL,
  CONSTRAINT purchase_orders_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_orders_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id),
  CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id)
);

CREATE TABLE public.purchase_order_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  purchase_order_id uuid NOT NULL,
  name text NOT NULL,
  quantity integer NOT NULL,
  unit_cost numeric NOT NULL,
  total_cost numeric NOT NULL,
  received_quantity integer DEFAULT 0,
  CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id)
);

CREATE TABLE public.boms (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_name text NOT NULL,
  description text,
  finished_item_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  business_id uuid NOT NULL,
  CONSTRAINT boms_pkey PRIMARY KEY (id),
  CONSTRAINT boms_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id)
);

CREATE TABLE public.bom_materials (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  bom_id uuid NOT NULL,
  item_id uuid NOT NULL,
  quantity numeric NOT NULL,
  unit_of_measure text NOT NULL,
  CONSTRAINT bom_materials_pkey PRIMARY KEY (id),
  CONSTRAINT bom_materials_bom_id_fkey FOREIGN KEY (bom_id) REFERENCES public.boms(id)
);

CREATE TABLE public.production_orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  bom_id uuid NOT NULL,
  quantity_to_produce integer NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['planned'::text, 'in_progress'::text, 'in-progress'::text, 'completed'::text, 'cancelled'::text])),
  start_date timestamp with time zone NOT NULL,
  completion_date timestamp with time zone,
  labor_cost numeric DEFAULT 0,
  additional_costs numeric DEFAULT 0,
  batch_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  business_id uuid NOT NULL,
  CONSTRAINT production_orders_pkey PRIMARY KEY (id),
  CONSTRAINT production_orders_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id),
  CONSTRAINT production_orders_bom_id_fkey FOREIGN KEY (bom_id) REFERENCES public.boms(id)
);

CREATE TABLE public.goods_received_notes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  purchase_order_id uuid,
  receipt_number text NOT NULL UNIQUE,
  received_date timestamp with time zone DEFAULT now(),
  notes text,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT goods_received_notes_pkey PRIMARY KEY (id),
  CONSTRAINT goods_received_notes_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id)
);

CREATE TABLE public.goods_received_note_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  grn_id uuid NOT NULL,
  item_id uuid,
  purchase_order_item_id uuid,
  quantity_received integer NOT NULL,
  unit_cost numeric NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT goods_received_note_items_pkey PRIMARY KEY (id),
  CONSTRAINT goods_received_note_items_purchase_order_item_id_fkey FOREIGN KEY (purchase_order_item_id) REFERENCES public.purchase_order_items(id),
  CONSTRAINT goods_received_note_items_grn_id_fkey FOREIGN KEY (grn_id) REFERENCES public.goods_received_notes(id)
);

CREATE TABLE public.financial_transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid DEFAULT '550e8400-e29b-41d4-a716-446655440000'::uuid,
  type text NOT NULL CHECK (type = ANY (ARRAY['income'::text, 'expense'::text])),
  amount numeric NOT NULL,
  category text NOT NULL,
  description text,
  date timestamp with time zone NOT NULL,
  payment_method text NOT NULL,
  reference_number text,
  source_order_id uuid,
  transaction_source text DEFAULT 'manual'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT financial_transactions_pkey PRIMARY KEY (id)
);

CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  sales_order_id uuid NOT NULL,
  invoice_number text NOT NULL UNIQUE,
  amount numeric NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  paid_at timestamp with time zone,
  CONSTRAINT invoices_pkey PRIMARY KEY (id)
);

CREATE TABLE public.inventory_adjustments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  item_id uuid NOT NULL,
  previous_quantity integer NOT NULL,
  new_quantity integer NOT NULL,
  reason text NOT NULL CHECK (reason = ANY (ARRAY['damage'::text, 'counting_error'::text, 'return'::text, 'theft'::text, 'production'::text, 'other'::text])),
  notes text,
  created_by text,
  adjustment_date timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_adjustments_pkey PRIMARY KEY (id)
);

CREATE TABLE public.erp_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username character varying NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  role character varying NOT NULL DEFAULT 'employee'::character varying CHECK (role::text = ANY (ARRAY['manager'::character varying::text, 'employee'::character varying::text])),
  is_active boolean DEFAULT true,
  last_login timestamp with time zone,
  created_by uuid,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT erp_users_pkey PRIMARY KEY (id),
  CONSTRAINT erp_users_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.erp_users(id)
);

CREATE TABLE public.erp_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_token character varying NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  ip_address inet,
  user_agent text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT erp_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT erp_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.erp_users(id)
);

CREATE TABLE public.erp_modules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  module_name character varying NOT NULL UNIQUE,
  module_key character varying NOT NULL UNIQUE,
  description text,
  icon character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT erp_modules_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_module_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id uuid NOT NULL,
  has_access boolean DEFAULT true,
  granted_by uuid,
  granted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_module_permissions_pkey PRIMARY KEY (id),
  CONSTRAINT user_module_permissions_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.erp_modules(id),
  CONSTRAINT user_module_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.erp_users(id),
  CONSTRAINT user_module_permissions_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.erp_users(id)
);

CREATE TABLE public.item_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_name character varying NOT NULL UNIQUE,
  description text,
  icon_name character varying,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT item_categories_pkey PRIMARY KEY (id)
);

CREATE TABLE public.sales_order_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sales_order_id uuid NOT NULL,
  previous_status character varying,
  new_status character varying NOT NULL,
  changed_by uuid,
  changed_at timestamp without time zone DEFAULT now(),
  reason text,
  notes text,
  CONSTRAINT sales_order_status_history_pkey PRIMARY KEY (id)
);

CREATE TABLE public.website_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  session_token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT website_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT website_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.website_users(id)
);

-- ================================================
-- PART 2: CREATE USER PROFILES TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('manager', 'employee', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- PART 3: CREATE INDEXES AND CONSTRAINTS
-- ================================================

-- Customer indexes
CREATE UNIQUE INDEX idx_customers_user_id_unique 
ON customers(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Inventory items indexes
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);

-- Sales orders indexes
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON sales_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON sales_orders(status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_date ON sales_orders(order_date);

-- Purchase orders indexes
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);

-- Financial transactions indexes
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(date);

-- ================================================
-- PART 4: ENABLE ROW LEVEL SECURITY
-- ================================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- ================================================
-- PART 5: CREATE RLS POLICIES
-- ================================================

-- Customer policies
CREATE POLICY "BMS users can view all customers" ON customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Customers can view own profile" ON customers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "BMS managers can modify all customers" ON customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('manager', 'admin') AND is_active = true
        )
    );

CREATE POLICY "Customers can update own profile" ON customers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert own profile" ON customers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Managers can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('manager', 'admin')
        )
    );

CREATE POLICY "Managers can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('manager', 'admin')
        )
    );

-- Inventory items policies
CREATE POLICY "Everyone can view active inventory" ON inventory_items
    FOR SELECT USING (is_active = true);
    
CREATE POLICY "Managers can modify inventory" ON inventory_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('manager', 'admin') AND is_active = true
        )
    );

-- Sales orders policies
CREATE POLICY "Users can view own sales orders" ON sales_orders
    FOR SELECT USING (
        created_by = auth.uid() OR 
        customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
    );
    
CREATE POLICY "Managers can view all sales orders" ON sales_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('manager', 'admin') AND is_active = true
        )
    );
    
CREATE POLICY "Authenticated users can create sales orders" ON sales_orders
    FOR INSERT WITH CHECK (
        (created_by = auth.uid() OR created_by IS NULL) AND 
        (auth.uid() IS NOT NULL)
    );
    
CREATE POLICY "Users can update own orders or managers can update all" ON sales_orders
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('manager', 'admin') AND is_active = true
        )
    );

-- Sales order items policies
CREATE POLICY "Users can view items for accessible orders" ON sales_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sales_orders so 
            WHERE so.id = sales_order_id AND (
                so.created_by = auth.uid() OR EXISTS (
                    SELECT 1 FROM user_profiles 
                    WHERE id = auth.uid() AND role IN ('manager', 'admin') AND is_active = true
                )
            )
        )
    );
    
CREATE POLICY "Users can manage items for accessible orders" ON sales_order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM sales_orders so 
            WHERE so.id = sales_order_id AND (
                so.created_by = auth.uid() OR EXISTS (
                    SELECT 1 FROM user_profiles 
                    WHERE id = auth.uid() AND role IN ('manager', 'admin') AND is_active = true
                )
            )
        )
    );

-- Suppliers policies
CREATE POLICY "Authenticated users can view active suppliers" ON suppliers
    FOR SELECT USING (
        is_active = true AND EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND is_active = true
        )
    );
    
CREATE POLICY "Managers can modify suppliers" ON suppliers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('manager', 'admin') AND is_active = true
        )
    );

-- Purchase orders policies
CREATE POLICY "Managers can manage purchase orders" ON purchase_orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('manager', 'admin') AND is_active = true
        )
    );

-- Production orders policies
CREATE POLICY "Managers can manage production orders" ON production_orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('manager', 'admin') AND is_active = true
        )
    );

-- Financial transactions policies
CREATE POLICY "Managers can manage financial transactions" ON financial_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('manager', 'admin') AND is_active = true
        )
    );

-- ================================================
-- PART 6: CREATE FUNCTIONS AND TRIGGERS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at 
    BEFORE UPDATE ON inventory_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_orders_updated_at 
    BEFORE UPDATE ON sales_orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at 
    BEFORE UPDATE ON purchase_orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_orders_updated_at 
    BEFORE UPDATE ON production_orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- PART 7: GRANT PERMISSIONS
-- ================================================

-- Grant permissions for authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON customers TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON inventory_items TO authenticated;
GRANT ALL ON sales_orders TO authenticated;
GRANT ALL ON sales_order_items TO authenticated;
GRANT ALL ON suppliers TO authenticated;
GRANT ALL ON purchase_orders TO authenticated;
GRANT ALL ON production_orders TO authenticated;
GRANT ALL ON financial_transactions TO authenticated;

-- Grant select permissions for anonymous users (for public data)
GRANT SELECT ON customers TO anon;
GRANT SELECT ON inventory_items TO anon;

-- ================================================
-- COMPLETION MESSAGE
-- ================================================

DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE 'COMPLETE DATABASE SETUP FINISHED SUCCESSFULLY!';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'All tables created: ✓';
    RAISE NOTICE 'Authentication columns added: ✓';
    RAISE NOTICE 'RLS policies created: ✓';
    RAISE NOTICE 'Indexes created: ✓';
    RAISE NOTICE 'Triggers created: ✓';
    RAISE NOTICE 'Permissions granted: ✓';
    RAISE NOTICE '';
    RAISE NOTICE 'Your database is ready to use!';
    RAISE NOTICE '================================================';
END $$;
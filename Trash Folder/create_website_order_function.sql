-- ================================================
-- CREATE WEBSITE ORDER RPC FUNCTION
-- ================================================
-- This function creates a new order in the sales_orders table
-- and its associated order items in the sales_order_items table

CREATE OR REPLACE FUNCTION create_website_order(
    p_user_id UUID,
    p_total_amount NUMERIC,
    p_payment_method TEXT,
    p_shipping_address TEXT,
    p_shipping_city TEXT,
    p_shipping_postal_code TEXT,
    p_delivery_instructions TEXT DEFAULT '',
    p_order_items JSONB
)
RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_item RECORD;
    v_user_record RECORD;
    calculated_total NUMERIC := 0.00;
BEGIN
    -- Get user record and validate user exists
    SELECT * INTO v_user_record FROM public.website_users WHERE id = p_user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found' USING ERRCODE = 'P0001';
    END IF;

    -- Generate new order ID and order number
    v_order_id := uuid_generate_v4();
    v_order_number := 'WEB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    -- Calculate total from order items for validation
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_order_items)
    LOOP
        calculated_total := calculated_total + (v_item.value->>'total_price')::NUMERIC;
    END LOOP;

    -- Validate that the provided total matches calculated total
    IF ABS(calculated_total - p_total_amount) > 0.01 THEN
        RAISE EXCEPTION 'Total amount mismatch. Expected: %, Provided: %', calculated_total, p_total_amount
        USING ERRCODE = 'P0002';
    END IF;

    -- Insert into sales_orders table (using correct column names from schema)
    INSERT INTO public.sales_orders (
        id,
        business_id,
        order_number,
        website_user_id,
        status,
        order_date,
        total_amount,
        payment_method,
        order_source,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        delivery_instructions,
        customer_email,
        customer_phone
    ) VALUES (
        v_order_id,
        v_user_record.business_id, -- Use business_id from user record
        v_order_number,
        p_user_id,
        'pending',
        NOW(),
        p_total_amount,
        p_payment_method,
        'website',
        p_shipping_address,
        p_shipping_city,
        p_shipping_postal_code,
        p_delivery_instructions,
        v_user_record.email,
        v_user_record.phone
    );

    -- Insert order items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_order_items)
    LOOP
        INSERT INTO public.sales_order_items (
            sales_order_id,
            product_id,
            quantity,
            unit_price,
            total_price
        ) VALUES (
            v_order_id,
            (v_item.value->>'product_id')::UUID,
            (v_item.value->>'quantity')::INTEGER,
            (v_item.value->>'unit_price')::NUMERIC,
            (v_item.value->>'total_price')::NUMERIC
        );
    END LOOP;

    -- Return the order ID
    RETURN v_order_id;

EXCEPTION
    WHEN OTHERS THEN
        -- Log the error and re-raise
        RAISE NOTICE 'Error in create_website_order: %', SQLERRM;
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_website_order(UUID, NUMERIC, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION create_website_order(UUID, NUMERIC, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) IS 
'Creates a new website order with order items. Validates user exists and total amount matches item totals.';

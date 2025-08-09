import { supabase } from '../lib/supabase';

// Interface for website user data
export interface WebsiteUserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  alt_phone?: string;
  business_id: string;
}

// Interface for checkout form data (matches existing CheckoutFormData)
export interface WebsiteCheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  altPhone?: string;
  address: string;
  city: string;
  postalCode: string;
}

// Interface for order creation
export interface OrderData {
  user_id: string;
  total_amount: number;
  payment_method: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  delivery_instructions: string;
  order_items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

export class WebsiteUserService {
  /**
   * Get website user data by auth ID
   */
  static async getWebsiteUser(authUserId: string): Promise<WebsiteUserData | null> {
    try {
      const { data, error } = await supabase
        .from('website_users')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User not found - this is expected for new users
          return null;
        }
        console.error('Error fetching website user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch website user:', error);
      return null;
    }
  }

  /**
   * Create or update website user
   */
  static async upsertWebsiteUser(
    authUserId: string, 
    userData: WebsiteCheckoutData
  ): Promise<{ success: boolean; errors: string[] }> {
    try {
      console.log('Upserting website user:', authUserId, userData);

      // Get current auth user email
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Authentication error:', authError);
        return { success: false, errors: ['Authentication required'] };
      }

      console.log('Current auth user:', user.id, user.email);

      // First check if user already exists by ID or email
      const { data: existingUser } = await supabase
        .from('website_users')
        .select('id, email')
        .or(`id.eq.${authUserId},email.eq.${user.email}`)
        .maybeSingle();

      console.log('Existing user found:', existingUser);

      // Prepare data for database
      const websiteUserData = {
        id: authUserId,
        email: user.email || userData.email,
        password_hash: 'auth_managed', // Required field - auth is managed by Supabase
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        alt_phone: userData.altPhone || null,
        address: userData.address,
        city: userData.city,
        postal_code: userData.postalCode,
        business_id: '550e8400-e29b-41d4-a716-446655440000' // Default business ID
      };

      console.log('Prepared website user data:', websiteUserData);

      let error;

      if (existingUser) {
        // User exists, update it
        console.log('Updating existing user...');
        const { error: updateError } = await supabase
          .from('website_users')
          .update(websiteUserData)
          .eq('id', authUserId);
        error = updateError;
        console.log('Update result:', error ? 'Error: ' + JSON.stringify(error) : 'Success');
      } else {
        // User doesn't exist, insert it
        console.log('Inserting new user...');
        const { error: insertError } = await supabase
          .from('website_users')
          .insert(websiteUserData);
        error = insertError;
        console.log('Insert result:', error ? 'Error: ' + JSON.stringify(error) : 'Success');
      }

      if (error) {
        console.error('Error saving website user:', error);
        return { success: false, errors: ['Failed to save user data: ' + error.message] };
      }

      // Verify the user was saved by fetching it back
      const savedUser = await this.getWebsiteUser(authUserId);
      console.log('Verified saved user:', savedUser);

      return { success: true, errors: [] };
    } catch (error) {
      console.error('Failed to upsert website user:', error);
      return { success: false, errors: ['Failed to save user data'] };
    }
  }

  /**
   * Transform WebsiteUserData to CheckoutFormData format
   */
  static transformToCheckoutData(userData: WebsiteUserData | null, defaultEmail: string): WebsiteCheckoutData {
    if (!userData) {
      return {
        email: defaultEmail,
        firstName: '',
        lastName: '',
        phone: '',
        altPhone: '',
        address: '',
        city: '',
        postalCode: ''
      };
    }

    return {
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: userData.phone || '',
      altPhone: userData.alt_phone || '',
      address: userData.address || '',
      city: userData.city || '',
      postalCode: userData.postal_code || ''
    };
  }

  /**
   * Validate checkout data
   */
  static validateCheckoutData(data: WebsiteCheckoutData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.firstName.trim()) {
      errors.push('First name is required');
    }

    if (!data.lastName.trim()) {
      errors.push('Last name is required');
    }

    if (!data.phone.trim()) {
      errors.push('Phone number is required');
    } else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) {
      errors.push('Phone number must be 10 digits');
    }

    if (!data.address.trim()) {
      errors.push('Address is required');
    }

    if (!data.city.trim()) {
      errors.push('City is required');
    }

    if (!data.postalCode.trim()) {
      errors.push('Postal code is required');
    }

    if (!data.email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Valid email is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create website order using RPC function
   */
  static async createWebsiteOrder(orderData: OrderData): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      // First, let's verify the user exists before calling the RPC
      console.log('Creating order for user:', orderData.user_id);
      
      const userExists = await this.getWebsiteUser(orderData.user_id);
      if (!userExists) {
        console.error('User not found in website_users table:', orderData.user_id);
        return { success: false, error: 'User not found in database. Please complete your profile first.' };
      }
      
      console.log('User found in website_users:', userExists);
      console.log('Calling RPC with data:', {
        p_user_id: orderData.user_id,
        p_total_amount: orderData.total_amount,
        p_payment_method: orderData.payment_method,
        p_shipping_address: orderData.shipping_address,
        p_shipping_city: orderData.shipping_city,
        p_shipping_postal_code: orderData.shipping_postal_code,
        p_delivery_instructions: orderData.delivery_instructions,
        p_order_items: orderData.order_items
      });

      const { data, error } = await supabase.rpc('create_website_order', {
        p_user_id: orderData.user_id,
        p_total_amount: orderData.total_amount,
        p_payment_method: orderData.payment_method,
        p_shipping_address: orderData.shipping_address,
        p_shipping_city: orderData.shipping_city,
        p_shipping_postal_code: orderData.shipping_postal_code,
        p_delivery_instructions: orderData.delivery_instructions,
        p_order_items: orderData.order_items
      });

      if (error) {
        console.error('Error creating website order:', error);
        return { success: false, error: error.message };
      }

      console.log('Order created successfully:', data);
      return { success: true, orderId: data };
    } catch (error) {
      console.error('Failed to create website order:', error);
      return { success: false, error: 'Failed to create order' };
    }
  }
}

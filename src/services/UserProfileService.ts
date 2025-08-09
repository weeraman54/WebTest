import { supabase } from '../lib/supabase';

export interface UserProfileData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  alt_phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  is_verified: boolean;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  altPhone: string;
  deliveryAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

export class UserProfileService {
  /**
   * Fetch user profile data from website_users table
   */
  static async getUserProfile(userId: string): Promise<UserProfileData | null> {
    try {
      const { data, error } = await supabase
        .from('website_users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          phone,
          alt_phone,
          address,
          city,
          postal_code,
          country,
          is_verified
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfileData;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  /**
   * Update user profile data in website_users table
   */
  static async updateUserProfile(userId: string, profileData: Partial<CheckoutFormData>): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {};

      if (profileData.firstName) updateData.first_name = profileData.firstName;
      if (profileData.lastName) updateData.last_name = profileData.lastName;
      if (profileData.phone) updateData.phone = profileData.phone;
      if (profileData.altPhone !== undefined) updateData.alt_phone = profileData.altPhone || null;
      if (profileData.deliveryAddress !== undefined) updateData.address = profileData.deliveryAddress || null;
      if (profileData.city !== undefined) updateData.city = profileData.city || null;
      if (profileData.postalCode !== undefined) updateData.postal_code = profileData.postalCode || null;

      // Add timestamp
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('website_users')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      };
    }
  }

  /**
   * Update user profile by email address
   */
  static async updateUserProfileByEmail(email: string, profileData: Partial<CheckoutFormData>): Promise<UserProfileData | null> {
    try {
      const updateData: any = {};
      
      if (profileData.firstName !== undefined) updateData.first_name = profileData.firstName || null;
      if (profileData.lastName !== undefined) updateData.last_name = profileData.lastName || null;
      if (profileData.phone !== undefined) updateData.phone = profileData.phone || null;
      if (profileData.altPhone !== undefined) updateData.alt_phone = profileData.altPhone || null;
      if (profileData.deliveryAddress !== undefined) updateData.address = profileData.deliveryAddress || null;
      if (profileData.city !== undefined) updateData.city = profileData.city || null;
      if (profileData.postalCode !== undefined) updateData.postal_code = profileData.postalCode || null;

      const { data, error } = await supabase
        .from('website_users')
        .update(updateData)
        .eq('email', email)
        .select(`
          id,
          email,
          first_name,
          last_name,
          phone,
          alt_phone,
          address,
          city,
          postal_code,
          country,
          is_verified
        `)
        .single();

      if (error) {
        console.error('Error updating user profile by email:', error);
        throw new Error('Failed to update profile');
      }

      return data;
    } catch (error) {
      console.error('Error in updateUserProfileByEmail:', error);
      throw error;
    }
  }

  /**
   * Validate checkout form data and return individual error messages
   */
  static validateCheckoutData(data: CheckoutFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!data.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!data.email?.trim()) {
      errors.push('Email address is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.phone?.trim()) {
      errors.push('Phone number is required');
    } else if (!/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
      errors.push('Please enter a valid phone number');
    }

    if (!data.deliveryAddress?.trim()) {
      errors.push('Delivery address is required');
    }

    if (!data.city?.trim()) {
      errors.push('City is required');
    }

    if (!data.postalCode?.trim()) {
      errors.push('Postal code is required');
    }

    // Optional field validation
    if (data.altPhone && !/^[\d\s\-\+\(\)]+$/.test(data.altPhone)) {
      errors.push('Please enter a valid alternative phone number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert UserProfileData to CheckoutFormData format
   */
  static profileToFormData(profile: UserProfileData): CheckoutFormData {
    return {
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      altPhone: profile.alt_phone || '',
      deliveryAddress: profile.address || '',
      city: profile.city || '',
      postalCode: profile.postal_code || '',
      country: profile.country || ''
    };
  }
}

export default UserProfileService;

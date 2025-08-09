import { supabase, type CustomerProfile, type AuthUser } from '../lib/supabase'

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return url && key && url !== 'your_supabase_project_url_here' && key !== 'your_supabase_anon_key_here'
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  error?: string
}

export class AuthService {
  /**
   * Sign up a new customer
   */
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      console.log('🚧 Mock sign up - Supabase not configured')
      return {
        success: false,
        error: 'Authentication not configured. Please set up Supabase credentials.'
      }
    }

    try {
      // 1. Create user in Supabase Auth
      // The database triggers will automatically create records in website_users and customers tables
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            user_type: 'customer',
            full_name: data.fullName,
            phone: data.phone
          }
        }
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: 'User creation failed' }
      }

      // 2. Create session record if user is confirmed and has a session
      if (authData.session) {
        await this.createWebsiteSession(authData.user.id, authData.session.access_token, authData.session.expires_at || 0)
      }

      return {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          user_metadata: authData.user.user_metadata as AuthUser['user_metadata']
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign up failed'
      }
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(data: SignInData): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      console.log('🚧 Mock sign in - Supabase not configured')
      return {
        success: false,
        error: 'Authentication not configured. Please set up Supabase credentials.'
      }
    }

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Sign in failed' }
      }

      // Check if user is a customer
      if (authData.user.user_metadata?.user_type !== 'customer') {
        await this.signOut() // Sign out non-customer users
        return { success: false, error: 'Access denied. Customer account required.' }
      }

      // Create session record (last_login will be updated by database trigger)
      if (authData.session) {
        await this.createWebsiteSession(authData.user.id, authData.session.access_token, authData.session.expires_at || 0)
      }

      return {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          user_metadata: authData.user.user_metadata as AuthUser['user_metadata']
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed'
      }
    }
  }

  /**
   * Sign in with Google OAuth
   */
  // static async signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
  //   try {
  //     const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: 'google',
  //       options: {
  //         redirectTo: `${siteUrl}/auth/callback`,
  //         queryParams: {
  //           user_type: 'customer'
  //         }
  //       }
  //     })

  //     if (error) {
  //       return { success: false, error: error.message }
  //     }

  //     return { success: true }
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: error instanceof Error ? error.message : 'Google sign in failed'
  //     }
  //   }
  // }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current user before signing out
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }

      // Delete website session record if user existed
      if (user) {
        await this.deleteWebsiteSession(user.id)
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed'
      }
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user || user.user_metadata?.user_type !== 'customer') {
        return null
      }

      return {
        id: user.id,
        email: user.email!,
        user_metadata: user.user_metadata as AuthUser['user_metadata']
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  /**
   * Create a session record in website_sessions table
   */
  private static async createWebsiteSession(userId: string, sessionToken: string, expiresAtTimestamp: number): Promise<void> {
    try {
      // Convert timestamp to ISO string
      const expiresAt = new Date(expiresAtTimestamp * 1000).toISOString()
      
      // Clean up any existing sessions for this user (optional, or keep multiple sessions)
      await this.cleanupExpiredSessions(userId)
      
      const { error } = await supabase
        .from('website_sessions')
        .insert({
          user_id: userId,
          session_token: sessionToken,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Failed to create website session:', error)
      }
    } catch (error) {
      console.error('Error creating website session:', error)
    }
  }

  /**
   * Clean up expired sessions for a user
   */
  private static async cleanupExpiredSessions(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('website_sessions')
        .delete()
        .eq('user_id', userId)
        .lt('expires_at', new Date().toISOString())

      if (error) {
        console.error('Failed to cleanup expired sessions:', error)
      }
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error)
    }
  }

  /**
   * Delete session record when user signs out
   */
  private static async deleteWebsiteSession(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('website_sessions')
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('Failed to delete website session:', error)
      }
    } catch (error) {
      console.error('Error deleting website session:', error)
    }
  }

  /**
   * Get customer profile data
   */
  static async getCustomerProfile(userId: string): Promise<CustomerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !data) {
        return null
      }

      return data as CustomerProfile
    } catch (error) {
      console.error('Get customer profile error:', error)
      return null
    }
  }

  /**
   * Reset password - sends password reset email
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      console.log('🚧 Mock password reset - Supabase not configured')
      return {
        success: false,
        error: 'Authentication not configured. Please set up Supabase credentials.'
      }
    }

    try {
      // First check if the email exists in website_users table
      const { data: existingUser, error: checkError } = await supabase
        .from('website_users')
        .select('email')
        .eq('email', email)
        .single();

      if (checkError || !existingUser) {
        return { 
          success: false, 
          error: 'Email address not found in our records' 
        };
      }

      // If email exists, send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed'
      };
    }
  }

  /**
   * Update password for authenticated user
   */
  static async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      console.log('🚧 Mock password update - Supabase not configured')
      return {
        success: false,
        error: 'Authentication not configured. Please set up Supabase credentials.'
      }
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password update failed'
      };
    }
  }

  /**
   * Update customer profile
   */
  static async updateCustomerProfile(
    userId: string, 
    updates: Partial<Omit<CustomerProfile, 'id' | 'created_at'>>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed'
      }
    }
  }
}

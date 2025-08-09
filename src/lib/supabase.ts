import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url_here' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.includes('your-project-id') === false &&
  supabaseAnonKey.includes('your_actual_anon_key_here') === false &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co')

if (!hasValidCredentials) {
  console.error('❌ SUPABASE CONFIGURATION REQUIRED')
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.error('Please configure your Supabase credentials in the .env file:')
  console.error('')
  console.error('1. Go to https://supabase.com')
  console.error('2. Create a new project or select existing one')
  console.error('3. Go to Settings > API')
  console.error('4. Copy the Project URL and anon/public key')
  console.error('5. Update .env file with actual values:')
  console.error('   VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co')
  console.error('   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...')
  console.error('')
  console.error('Current values:')
  console.error('URL:', supabaseUrl || 'undefined')
  console.error('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined')
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  throw new Error('Supabase configuration required. Please check console for setup instructions.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for our customer data
export interface CustomerProfile {
  id: string
  user_id: string
  full_name: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    user_type?: string
  }
}

// Database table type definitions
export type Database = {
  public: {
    Tables: {
      customers: {
        Row: CustomerProfile
        Insert: Omit<CustomerProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CustomerProfile, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

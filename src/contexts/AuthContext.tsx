import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase, type AuthUser } from '../lib/supabase'
import { AuthService } from '../services/AuthService'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  // signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Session check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Verify customer access
          if (session.user.user_metadata?.user_type === 'customer') {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              user_metadata: session.user.user_metadata as AuthUser['user_metadata']
            })
          } else {
            // Non-customer users should be signed out
            await AuthService.signOut()
            setUser(null)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await AuthService.signIn({ email, password })
      if (result.success && result.user) {
        setUser(result.user)
      }
      return { success: result.success, error: result.error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    setLoading(true)
    try {
      const result = await AuthService.signUp({ email, password, fullName, phone })
      if (result.success && result.user) {
        setUser(result.user)
      }
      return { success: result.success, error: result.error }
    } finally {
      setLoading(false)
    }
  }

  // const signInWithGoogle = async () => {
  //   return await AuthService.signInWithGoogle()
  // }

  const signOut = async () => {
    setLoading(true)
    try {
      const result = await AuthService.signOut()
      if (result.success) {
        setUser(null)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    return await AuthService.resetPassword(email)
  }

  const updatePassword = async (newPassword: string) => {
    return await AuthService.updatePassword(newPassword)
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    // signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

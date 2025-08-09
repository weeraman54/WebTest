import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const AuthCallback: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait a moment for the auth context to update
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (user) {
          // Successfully authenticated, redirect to home
          navigate('/', { replace: true })
        } else {
          // No user found, there might have been an error
          setError('Authentication failed. Please try again.')
          setTimeout(() => {
            navigate('/', { replace: true })
          }, 3000)
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('An error occurred during authentication.')
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [user, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Completing Authentication...
          </h2>
          <p className="text-gray-600">
            Please wait while we sign you in.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you back to the homepage...
          </p>
        </div>
      </div>
    )
  }

  // This shouldn't be reached, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Redirecting...
        </h2>
      </div>
    </div>
  )
}

export default AuthCallback

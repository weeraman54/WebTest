import React, { useState } from 'react'
import { XMarkIcon, EyeIcon, EyeSlashIcon, UserIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import ForgotPasswordModal from './ForgotPasswordModal'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const { signIn, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setFormData({ email: '', password: '' })
    setErrors('')
    setShowPassword(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setErrors('Email and password are required')
      return false
    }

    if (!formData.email.includes('@')) {
      setErrors('Please enter a valid email address')
      return false
    }

    if (formData.password.length < 6) {
      setErrors('Password must be at least 6 characters')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors('')

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const result = await signIn(
        formData.email,
        formData.password
      )

      if (result.success) {
        handleClose()
      } else {
        setErrors(result.error || 'Sign in failed')
      }
    } catch (error) {
      setErrors('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // const handleGoogleSignIn = async () => {
  //   setErrors('')
  //   try {
  //     const result = await signInWithGoogle()
  //     if (!result.success && result.error) {
  //       setErrors(result.error)
  //     }
  //     // Note: For OAuth, the user will be redirected, so we don't close the modal here
  //   } catch (error) {
  //     setErrors('Google sign in failed')
  //   }
  // }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors) setErrors('') // Clear errors when user starts typing
  }

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative flex items-center justify-end p-6 border-b border-gray-100">
  {/* Centered Title */}
  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
    <div className="w-10 h-10 bg-gradient-to-br from-[#13ee9e] to-[#0fa777] rounded-lg flex items-center justify-center mr-3">
      <UserIcon className="w-5 h-5 text-white" />
    </div>
    <h2 className="text-xl font-semibold text-gray-900">Welcome Back</h2>
  </div>
  
  {/* Close Button */}
  <button
    onClick={handleClose}
    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
    disabled={isSubmitting}
  >
    <XMarkIcon className="w-5 h-5" />
  </button>
</div>

          {/* Content */}
          <div className="p-6">
            {/* Google Sign In Button */}
            {/* <button
              id="signin-google-button"
              onClick={handleGoogleSignIn}
              disabled={loading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Login using Google Account
          </button> */}

            {/* Divider */}
            {/* <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with email</span>
              </div>
            </div> */}

            {/* Error Message */}
            {errors && (
              <div id="signin-error-box" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{errors}</p>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="signin-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13ee9e] focus:border-transparent transition-all duration-200 text-gray-900"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13ee9e] focus:border-transparent transition-all duration-200 text-gray-900"
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    id="toggle-password-button"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="signin-submit-button"
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-6 text-center">
              <button
                id="forgot-password-button"
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-bold text-gray-700 hover:text-gray-400 transition-colors"
                disabled={isSubmitting}
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </>
  )
}

export default SignInModal

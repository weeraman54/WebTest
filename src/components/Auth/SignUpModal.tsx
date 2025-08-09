import React, { useState } from 'react'
import { XMarkIcon, EyeIcon, EyeSlashIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const { signUp, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setFormData({ fullName: '', email: '', password: '' })
    setErrors('')
    setShowPassword(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setErrors('Full name is required')
      return false
    }

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

    if (formData.fullName.length < 2) {
      setErrors('Full name must be at least 2 characters')
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
      const result = await signUp(
        formData.email,
        formData.password,
        formData.fullName.trim()
      )

      if (result.success) {
        handleClose()
        // You might want to show a success message or redirect here
      } else {
        setErrors(result.error || 'Sign up failed')
      }
    } catch (error) {
      setErrors('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors) setErrors('') // Clear errors when user starts typing
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative flex items-center justify-end p-6 border-b border-gray-100">
  {/* Centered Title */}
  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
    <div className="w-10 h-10 bg-gradient-to-br from-[#13ee9e] to-[#0fa777] rounded-lg flex items-center justify-center mr-3">
      <UserPlusIcon className="w-5 h-5 text-white" />
    </div>
    <h2 className="text-xl font-semibold text-gray-900">Join Geolex</h2>
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
          {/* Welcome Message */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm leading-relaxed">Create your account and start exploring our wide range of products.</p>
          </div>

          {/* Error Message */}
          {errors && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="signup-fullname" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="signup-fullname"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13ee9e] focus:border-transparent transition-all duration-200 text-gray-900"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password (min. 6 characters)"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13ee9e] focus:border-transparent transition-all duration-200 text-gray-900"
                  disabled={isSubmitting}
                  required
                />
                <button
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
              <p className="mt-2 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Terms and Conditions */}
<div className="flex justify-center">
  <div className="flex items-center space-x-1 overflow-x-auto">
    <label htmlFor="terms" className="text-sm text-gray-600 whitespace-nowrap flex items-center">
      <input
        id="terms"
        name="terms"
        type="checkbox"
        className="w-4 h-4 text-[#13ee9e] border-gray-300 rounded focus:ring-[#13ee9e] mr-2 align-middle"
        required
        disabled={isSubmitting}
      />
      I agree to the{' '}
      <button
        type="button"
        className="text-[#13ee9e] hover:text-[#0fa777] underline transition-colors mx-0.5"
        disabled={isSubmitting}
      >
        Terms of Service
      </button>
      and
      <button
        type="button"
        className="text-[#13ee9e] hover:text-[#0fa777] underline transition-colors mx-0.5"
        disabled={isSubmitting}
      >
        Privacy Policy
      </button>
    </label>
  </div>
</div>





            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                className="text-[#13ee9e] hover:text-[#0fa777] font-medium transition-colors"
                disabled={isSubmitting}
                onClick={handleClose}
              >
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpModal
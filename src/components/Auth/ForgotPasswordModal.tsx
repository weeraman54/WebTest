import React, { useState } from 'react';
import { XMarkIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../Toast/Toast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState('');

  const resetForm = () => {
    setEmail('');
    setErrors('');
    setEmailSent(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors('');

    if (!email.trim()) {
      setErrors('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setErrors('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // First check if email exists in database
      const result = await resetPassword(email);
      
      if (result.success) {
        setEmailSent(true);
        showSuccess('Password reset link sent to your email!');
      } else {
        // Show appropriate error message based on the error
        if (result.error?.includes('User not found') || result.error?.includes('Invalid email') || result.error?.includes('not found')) {
          showError('Email address not found in our records');
          setErrors('Email address not found in our records');
        } else {
          showError('Operation failed. Please try again.');
          setErrors('Operation failed. Please try again.');
        }
      }
    } catch (error) {
      showError('Operation failed. Please try again.');
      setErrors('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors) setErrors('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-[#13ee9e] to-[#0fa777] rounded-lg flex items-center justify-center mr-3">
              <EnvelopeIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {emailSent ? 'Check Your Email' : 'Reset Password'}
            </h2>
          </div>
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
          {!emailSent ? (
            <>
              {/* Instructions */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Error Message */}
              {errors && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{errors}</p>
                </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13ee9e] focus:border-transparent transition-all duration-200 text-gray-900"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="w-4 h-4" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#13ee9e] to-[#0fa777] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Reset Link Sent!
                </h3>
                
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your email and click the link to reset your password.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Didn't receive the email?</strong>
                  </p>
                  <p className="text-blue-700 text-xs mt-1">
                    Check your spam folder or try again with a different email address.
                  </p>
                </div>

                <button
                  onClick={() => setEmailSent(false)}
                  className="text-[#13ee9e] hover:text-[#0fa777] font-medium text-sm transition-colors"
                >
                  Try Different Email
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-center">
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              disabled={isSubmitting}
            >
              {emailSent ? 'Close' : 'Back to Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

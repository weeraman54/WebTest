import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserCircleIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { WebsiteUserService } from '../../services/WebsiteUserService';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import type { CheckoutFormData } from '../../services/UserProfileService';

interface CheckoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (formData: CheckoutFormData) => void;
  userProfile: CheckoutFormData;
  isLoading?: boolean;
}

const CheckoutConfirmationModal: React.FC<CheckoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userProfile,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>(userProfile);
  const [originalData, setOriginalData] = useState<CheckoutFormData>(userProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Update form data when userProfile changes
  useEffect(() => {
    setFormData(userProfile);
    setOriginalData(userProfile);
  }, [userProfile]);

  // Helper function to check if a field has changed
  const hasFieldChanged = (field: keyof CheckoutFormData): boolean => {
    return formData[field] !== originalData[field];
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = () => {
    // Convert CheckoutFormData to WebsiteCheckoutData for validation
    const websiteCheckoutData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      altPhone: formData.altPhone,
      address: formData.deliveryAddress,
      city: formData.city,
      postalCode: formData.postalCode
    };
    
    const validation = WebsiteUserService.validateCheckoutData(websiteCheckoutData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Show confirmation dialog instead of directly proceeding
    setShowConfirmation(true);
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    
    try {
      // Pass the form data to the parent component for processing
      onConfirm(formData);
    } catch (error) {
      console.error('Error processing checkout:', error);
      setErrors(['Failed to process checkout. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmation(false);
  };

  const resetForm = () => {
    setFormData(userProfile);
    setIsEditing(false);
    setErrors([]);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-[#13ee9e] to-[#0fa777] rounded-lg flex items-center justify-center mr-3">
              <UserCircleIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Confirm Order Details
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

        {/* Loading State */}
        {isLoading && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13ee9e] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your details...</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div className="p-6">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <UserCircleIcon className="w-5 h-5 mr-2 text-gray-600" />
                    Personal Information
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit Details
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                      {hasFieldChanged('firstName') && (
                        <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13ee9e] focus:border-transparent transition-all duration-200 ${
                          hasFieldChanged('firstName') 
                            ? 'border-[#13ee9e] bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p className={`py-2 font-medium transition-all duration-200 ${
                        hasFieldChanged('firstName') 
                          ? 'text-[#13ee9e] bg-green-50 px-3 rounded-md' 
                          : 'text-gray-900'
                      }`}>
                        {formData.firstName || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                      {hasFieldChanged('lastName') && (
                        <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13ee9e] focus:border-transparent transition-all duration-200 ${
                          hasFieldChanged('lastName') 
                            ? 'border-[#13ee9e] bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p className={`py-2 font-medium transition-all duration-200 ${
                        hasFieldChanged('lastName') 
                          ? 'text-[#13ee9e] bg-green-50 px-3 rounded-md' 
                          : 'text-gray-900'
                      }`}>
                        {formData.lastName || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <p className="py-2 text-gray-900 font-medium bg-gray-50 px-3 rounded-md">
                      {formData.email || 'Not provided'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-2 text-gray-600" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                      {hasFieldChanged('phone') && (
                        <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13ee9e] focus:border-transparent transition-all duration-200 ${
                          hasFieldChanged('phone') 
                            ? 'border-[#13ee9e] bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className={`py-2 font-medium transition-all duration-200 ${
                        hasFieldChanged('phone') 
                          ? 'text-[#13ee9e] bg-green-50 px-3 rounded-md' 
                          : 'text-gray-900'
                      }`}>
                        {formData.phone || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Alternative Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alternative Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.altPhone}
                        onChange={(e) => handleInputChange('altPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter alternative phone (optional)"
                      />
                    ) : (
                      <p className="py-2 text-gray-900 font-medium">
                        {formData.altPhone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2 text-gray-600" />
                  Delivery Address
                </h3>

                <div className="space-y-4">
                  {/* Delivery Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.deliveryAddress}
                        onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Enter full delivery address including city"
                      />
                    ) : (
                      <p className="py-2 text-gray-900 font-medium whitespace-pre-wrap">
                        {formData.deliveryAddress || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter city"
                        />
                      ) : (
                        <p className="py-2 text-gray-900 font-medium">
                          {formData.city || 'Not provided'}
                        </p>
                      )}
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter postal code"
                        />
                      ) : (
                        <p className="py-2 text-gray-900 font-medium">
                          {formData.postalCode || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Payment Method:</strong> Cash on Delivery (COD)
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Please ensure all details are correct before proceeding. You will pay upon delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!isLoading && (
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setFormData(userProfile);
                    setIsEditing(false);
                    setErrors([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl"
                  id='proceed-with-order-btn'
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Proceed with Order'
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleCancelUpdate}
        onConfirm={handleConfirmUpdate}
        title="Confirm Profile Update"
        message="Are you sure you want to update your profile with these details and proceed with the order?"
        confirmText="Yes, Update & Proceed"
        cancelText="No, Continue Editing"
      />
    </div>
  );
};

export default CheckoutConfirmationModal;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  UserCircleIcon, 
  MapPinIcon, 
  PhoneIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  CalendarIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { UserProfileService, type CheckoutFormData, type UserProfileData } from '../../services/UserProfileService';
import { OrderService } from '../../services/OrderService';
import { OrderHistoryService, type OrderHistory } from '../../services/OrderHistoryService';
import { useToast } from '../../components/Toast/Toast';

// Convert UserProfileData to CheckoutFormData format
const convertToFormData = (profileData: UserProfileData): CheckoutFormData => {
  return {
    firstName: profileData.first_name || '',
    lastName: profileData.last_name || '',
    email: profileData.email || '',
    phone: profileData.phone || '',
    altPhone: profileData.alt_phone || '',
    deliveryAddress: profileData.address || '',
    city: profileData.city || '',
    postalCode: profileData.postal_code || '',
    country: profileData.country || '',
  };
};

const AccountPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();
  
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [userProfile, setUserProfile] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    altPhone: '',
    deliveryAddress: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [originalProfile, setOriginalProfile] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    altPhone: '',
    deliveryAddress: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Purchase History state
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Handle URL parameters to set active tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'history') {
      setActiveTab('history');
    } else if (tabParam === 'details') {
      setActiveTab('details');
    }
  }, [location.search]);

  // Load user data and check edit permissions
  useEffect(() => {
    if (!user?.id) return;

    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Load user profile
        const profileResult = await UserProfileService.getUserProfile(user.id);
        if (profileResult) {
          const formData = convertToFormData(profileResult);
          setUserProfile(formData);
          setOriginalProfile(formData);
        }

        // Check if editing is allowed
        const editCheck = await OrderService.canEditAccountDetails(user.email);
        setCanEdit(editCheck.canEdit);

        // Get pending orders count
        const pendingResult = await OrderService.getPendingOrdersCount(user.id);
        setPendingOrdersCount(pendingResult.count);

      } catch (error) {
        console.error('Error loading user data:', error);
        showError('Failed to load account data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user?.id]);

  // Load order history when switching to history tab
  useEffect(() => {
    if (activeTab === 'history' && user?.email) {
      const loadOrderHistory = async () => {
        setIsLoadingOrders(true);
        try {
          const result = await OrderHistoryService.fetchOrderHistory(user.email);
          if (result.success) {
            setOrderHistory(result.orders);
          } else {
            showError(result.error || 'Failed to load order history');
          }
        } catch (error) {
          console.error('Error loading order history:', error);
          showError('Failed to load order history');
        } finally {
          setIsLoadingOrders(false);
        }
      };

      loadOrderHistory();
    }
  }, [activeTab, user?.email]);

  // Navigate to order detail page
  const handleOrderClick = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  // Helper function to check if a field has changed
  const hasFieldChanged = (field: keyof CheckoutFormData): boolean => {
    return userProfile[field] !== originalProfile[field];
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateProfile = (): boolean => {
    const newErrors: string[] = [];

    if (!userProfile.firstName.trim()) {
      newErrors.push('First name is required');
    }
    if (!userProfile.lastName.trim()) {
      newErrors.push('Last name is required');
    }
    if (!userProfile.phone.trim()) {
      newErrors.push('Phone number is required');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validateProfile() || !user?.id) return;

    setIsSaving(true);
    try {
      const result = await UserProfileService.updateUserProfile(user.id, userProfile);
      
      if (result.success) {
        setOriginalProfile(userProfile);
        setIsEditing(false);
        showSuccess('Account details updated successfully!');
      } else {
        showError(result.error || 'Failed to update account details');
        setErrors([result.error || 'Failed to update account details']);
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      showError(errorMessage);
      setErrors([errorMessage]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUserProfile(originalProfile);
    setIsEditing(false);
    setErrors([]);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-6 space-y-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Account Menu</h2>
              
              {/* Account Details Tab */}
              <button
                onClick={() => setActiveTab('details')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'details'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <UserCircleIcon className="w-5 h-5 mr-3" />
                Account Details
              </button>

              {/* Purchase History Tab */}
              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'history'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ShoppingBagIcon className="w-5 h-5 mr-3" />
                Purchase History
                {/* <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  Soon
                </span> */}
              </button>
            </nav>

            {/* Edit Restrictions Info */}
            {!canEdit && pendingOrdersCount > 0 && (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Editing Restricted
                    </h3>
                    <p className="mt-1 text-sm text-amber-700">
                      You have {pendingOrdersCount} incomplete order{pendingOrdersCount !== 1 ? 's' : ''}. 
                      Account details can only be edited when all orders are completed, delivered, or cancelled.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {activeTab === 'details' && (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <UserCircleIcon className="w-6 h-6 text-gray-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Account Details</h2>
                  </div>
                  {canEdit && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Edit Details
                    </button>
                  )}
                </div>

                {/* Content */}
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

                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <UserCircleIcon className="w-5 h-5 mr-2 text-gray-600" />
                        Personal Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                            {hasFieldChanged('firstName') && (
                              <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                            )}
                          </label>
                          {isEditing && canEdit ? (
                            <input
                              type="text"
                              value={userProfile.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
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
                              {userProfile.firstName || 'Not provided'}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                            {hasFieldChanged('lastName') && (
                              <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                            )}
                          </label>
                          {isEditing && canEdit ? (
                            <input
                              type="text"
                              value={userProfile.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
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
                              {userProfile.lastName || 'Not provided'}
                            </p>
                          )}
                        </div>

                        {/* Email (Read-only) */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <p className="py-2 text-gray-900 font-medium bg-gray-50 px-3 rounded-md">
                            {userProfile.email || 'Not provided'}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Email cannot be changed. Contact support if needed.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <PhoneIcon className="w-5 h-5 mr-2 text-gray-600" />
                        Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                            {hasFieldChanged('phone') && (
                              <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                            )}
                          </label>
                          {isEditing && canEdit ? (
                            <input
                              type="tel"
                              value={userProfile.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
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
                              {userProfile.phone || 'Not provided'}
                            </p>
                          )}
                        </div>

                        {/* Alternative Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alternative Phone
                            {hasFieldChanged('altPhone') && (
                              <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                            )}
                          </label>
                          {isEditing && canEdit ? (
                            <input
                              type="tel"
                              value={userProfile.altPhone}
                              onChange={(e) => handleInputChange('altPhone', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
                                hasFieldChanged('altPhone') 
                                  ? 'border-[#13ee9e] bg-green-50' 
                                  : 'border-gray-300'
                              }`}
                              placeholder="Enter alternative phone"
                            />
                          ) : (
                            <p className={`py-2 font-medium transition-all duration-200 ${
                              hasFieldChanged('altPhone') 
                                ? 'text-[#13ee9e] bg-green-50 px-3 rounded-md' 
                                : 'text-gray-900'
                            }`}>
                              {userProfile.altPhone || 'Not provided'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <MapPinIcon className="w-5 h-5 mr-2 text-gray-600" />
                        Address Information
                      </h3>

                      <div className="space-y-4">
                        {/* Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                            {hasFieldChanged('deliveryAddress') && (
                              <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                            )}
                          </label>
                          {isEditing && canEdit ? (
                            <input
                              type="text"
                              value={userProfile.deliveryAddress}
                              onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
                                hasFieldChanged('deliveryAddress') 
                                  ? 'border-[#13ee9e] bg-green-50' 
                                  : 'border-gray-300'
                              }`}
                              placeholder="Enter street address"
                            />
                          ) : (
                            <p className={`py-2 font-medium transition-all duration-200 ${
                              hasFieldChanged('deliveryAddress') 
                                ? 'text-[#13ee9e] bg-green-50 px-3 rounded-md' 
                                : 'text-gray-900'
                            }`}>
                              {userProfile.deliveryAddress || 'Not provided'}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* City */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                              {hasFieldChanged('city') && (
                                <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                              )}
                            </label>
                            {isEditing && canEdit ? (
                              <input
                                type="text"
                                value={userProfile.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
                                  hasFieldChanged('city') 
                                    ? 'border-[#13ee9e] bg-green-50' 
                                    : 'border-gray-300'
                                }`}
                                placeholder="Enter city"
                              />
                            ) : (
                              <p className={`py-2 font-medium transition-all duration-200 ${
                                hasFieldChanged('city') 
                                  ? 'text-[#13ee9e] bg-green-50 px-3 rounded-md' 
                                  : 'text-gray-900'
                              }`}>
                                {userProfile.city || 'Not provided'}
                              </p>
                            )}
                          </div>

                          {/* Postal Code */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postal Code
                              {hasFieldChanged('postalCode') && (
                                <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                              )}
                            </label>
                            {isEditing && canEdit ? (
                              <input
                                type="text"
                                value={userProfile.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
                                  hasFieldChanged('postalCode') 
                                    ? 'border-[#13ee9e] bg-green-50' 
                                    : 'border-gray-300'
                                }`}
                                placeholder="Enter postal code"
                              />
                            ) : (
                              <p className={`py-2 font-medium transition-all duration-200 ${
                                hasFieldChanged('postalCode') 
                                  ? 'text-[#13ee9e] bg-green-50 px-3 rounded-md' 
                                  : 'text-gray-900'
                              }`}>
                                {userProfile.postalCode || 'Not provided'}
                              </p>
                            )}
                          </div>

                          {/* Country */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                              {hasFieldChanged('country') && (
                                <span className="ml-2 text-xs text-[#13ee9e] font-medium">• Modified</span>
                              )}
                            </label>
                            {isEditing && canEdit ? (
                              <input
                                type="text"
                                value={userProfile.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
                                  hasFieldChanged('country') 
                                    ? 'border-[#13ee9e] bg-green-50' 
                                    : 'border-gray-300'
                                }`}
                                placeholder="Enter country"
                              />
                            ) : (
                              <p className={`py-2 font-medium transition-all duration-200 ${
                                hasFieldChanged('country') 
                                  ? 'text-[#13ee9e] bg-green-50 px-3 rounded-md' 
                                  : 'text-gray-900'
                              }`}>
                                {userProfile.country || 'Not provided'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && canEdit && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-6 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingBagIcon className="w-6 h-6 text-gray-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Purchase History</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {orderHistory.length} order{orderHistory.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {isLoadingOrders ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading order history...</p>
                    </div>
                  ) : orderHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                      <button
                        onClick={() => navigate('/')}
                        className="bg-[#151b25] text-white px-6 py-3 rounded-lg hover:bg-[#13ee9e] transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orderHistory.map((order) => (
                        <div
                          key={order.id}
                          onClick={() => handleOrderClick(order.id)}
                          className="border border-gray-200 rounded-lg p-4 hover:border-[#13ee9e] hover:shadow-md transition-all duration-200 cursor-pointer group relative"
                        >
                          {/* Arrow positioned absolutely */}
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-[#13ee9e] transition-colors">
                            <ChevronRightIcon className="w-5 h-5" />
                          </div>

                          {/* Order content with right padding for arrow */}
                          <div className="pr-8">
                            <div className="mb-3">
                              <div className="flex items-center space-x-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Order #{order.order_number}
                                </h3>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                                  OrderHistoryService.getStatusColor(order.status)
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                              <div className="flex items-center">
                                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-600">
                                  {OrderHistoryService.formatOrderDate(order.order_date)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <CreditCardIcon className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-600">{order.payment_method}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-lg font-bold text-gray-900">
                                  Rs. {order.total_amount.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 text-sm text-gray-600">
                              <p><strong>Customer:</strong> {order.customer_name}</p>
                              <p><strong>Phone:</strong> {order.customer_phone}</p>
                              <p><strong>Address:</strong> {order.shipping_address}, {order.shipping_city}</p>
                            </div>

                            <div className="mt-3 text-sm text-gray-500">
                              {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''} ordered
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

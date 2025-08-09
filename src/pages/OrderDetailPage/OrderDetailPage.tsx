import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/Toast/Toast';
import OrderStepper from '../../components/OrderStepper/OrderStepper';
import { OrderHistoryService, type OrderHistory } from '../../services/OrderHistoryService';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showError } = useToast();

  const [order, setOrder] = useState<OrderHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load order details
  useEffect(() => {
    if (!orderId || !user?.email) return;

    const loadOrderDetails = async () => {
      setIsLoading(true);
      try {
        const result = await OrderHistoryService.fetchOrderDetails(orderId);
        
        if (result.success && result.order) {
          // Verify the order belongs to the current user
          if (result.order.user_email === user.email) {
            setOrder(result.order);
          } else {
            showError('Order not found or access denied');
            navigate('/account');
          }
        } else {
          showError(result.error || 'Failed to load order details');
          navigate('/account');
        }
      } catch (error) {
        console.error('Error loading order details:', error);
        showError('Failed to load order details');
        navigate('/account');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, user?.email]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h2>
          <button
            onClick={() => navigate('/account')}
            className="bg-[#151b25] text-white px-6 py-3 rounded-lg hover:bg-[#13ee9e] transition-colors"
          >
            Back to Account
          </button>
        </div>
      </div>
    );
  }

  const { steps, currentStep } = OrderHistoryService.getOrderStatusSteps(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/account')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Account
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="mt-2 text-gray-600">Order #{order.order_number}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${
                OrderHistoryService.getStatusColor(order.status)
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Progress & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Progress Stepper */}
            <OrderStepper 
              steps={steps} 
              currentStep={currentStep} 
              orderStatus={order.status}
            />

            {/* Order Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Date</p>
                    <p className="text-sm text-gray-600">
                      {OrderHistoryService.formatOrderDate(order.order_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CreditCardIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Method</p>
                    <p className="text-sm text-gray-600">{order.payment_method}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Customer</p>
                    <p className="text-sm text-gray-600">{order.customer_name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{order.customer_phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                    <p className="text-sm text-gray-600">
                      {order.shipping_address}<br />
                      {order.shipping_city}, {order.shipping_postal_code}
                    </p>
                  </div>
                </div>

                {order.delivery_instructions && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delivery Instructions</p>
                    <p className="text-sm text-gray-600">{order.delivery_instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
              </div>

              {/* Items List */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {/* Product Image Placeholder */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-medium text-gray-900 mb-1">{item.product_name}</h4>
                        <p className="text-sm text-gray-600 mb-2">SKU: {item.sku}</p>
                        <p className="text-xl font-bold text-gray-900">
                          Rs. {item.unit_price.toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="text-lg font-semibold text-gray-900">{item.quantity}</p>
                      </div>

                      {/* Total Price */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-gray-900">
                          Rs. {item.total_price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total Amount</span>
                        <span>Rs. {order.total_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

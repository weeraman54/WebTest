import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useAuth } from '../../contexts/AuthContext';
import { WebsiteUserService, type WebsiteCheckoutData } from '../../services/WebsiteUserService';
import type { CheckoutFormData } from '../../services/UserProfileService';
import { useToast, ToastContainer } from '../../components/Toast/Toast';
import CheckoutConfirmationModal from '../../components/CheckoutConfirmationModal/CheckoutConfirmationModal';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';
import AuthModal from '../../components/Auth/AuthModal';
import type { CartItem } from '../../data/cartData';
import type { WishlistItem } from '../../data/wishlistData';
import { 
  PlusIcon,
  MinusIcon,
  HeartIcon,
  DocumentArrowDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface CheckoutPageProps {
  cartItems?: CartItem[];
  onCartChange?: (items: CartItem[]) => void;
  wishlistItems?: WishlistItem[];
  onWishlistChange?: (items: WishlistItem[]) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems = [],
  onCartChange,
  wishlistItems = [],
  onWishlistChange
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  
  // State for modals and confirmation
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<CheckoutFormData | null>(null);
  
  // State for authentication handling
  const [wasWaitingForAuth, setWasWaitingForAuth] = useState(false);
  
  const discount = 0; // Fixed discount for now

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const payableAmount = subtotal - discountAmount;

  // Handle quantity update
  const handleQuantityUpdate = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    
    if (onCartChange) {
      const updatedItems = cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      onCartChange(updatedItems);
    }
  };

  // Handle remove item
  const handleRemoveItem = (id: string) => {
    if (onCartChange) {
      const updatedItems = cartItems.filter(item => item.id !== id);
      onCartChange(updatedItems);
    }
  };

  // Handle move to wishlist
  const handleMoveToWishlist = (item: CartItem) => {
    if (onWishlistChange && wishlistItems) {
      // Check if item is already in wishlist
      const isInWishlist = wishlistItems.some(wishItem => wishItem.id === item.id);
      
      if (!isInWishlist) {
        const wishlistItem: WishlistItem = {
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          category: 'Electronics', // Default category
          inStock: true
        };
        onWishlistChange([...wishlistItems, wishlistItem]);
      }
    }
    
    // Remove from cart
    handleRemoveItem(item.id);
  };

  // Generate and download PDF quotation
  const handleDownloadQuotation = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Colors
    const primaryColor = '#151b25';
    const accentColor = '#13ee9e';
    const textColor = '#333333';
    const lightGray = '#666666';

    // Calculate available table width
    const tableWidth = pageWidth - (margin * 2);
    
    // Fixed column widths that fit within page boundaries
    const col1Width = tableWidth * 0.5;  // 50% for Item name
    const col2Width = tableWidth * 0.1;  // 10% for Quantity
    const col3Width = tableWidth * 0.2;  // 20% for Unit Price
    
    // Column X positions
    const col1X = margin;
    const col2X = col1X + col1Width;
    const col3X = col2X + col2Width;
    const col4X = col3X + col3Width;

    // Helper function to add wrapped text within column boundaries
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length; // Return number of lines
    };

    // Header
    doc.setTextColor(primaryColor);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('GEOLEX', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray);
    doc.text('Product Quotation', pageWidth / 2, yPosition, { align: 'center' });

    // Underline
    yPosition += 5;
    doc.setDrawColor(accentColor);
    doc.setLineWidth(1);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    
    yPosition += 15;

    // Date
    doc.setTextColor(lightGray);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, yPosition, { align: 'right' });
    
    yPosition += 20;

    // Table header
    doc.setTextColor(textColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    // Table headers with fixed positions
    doc.text('Item', col1X, yPosition);
    doc.text('Qty', col2X + 5, yPosition);
    doc.text('Unit Price', col3X + 5, yPosition);
    doc.text('Total', col4X + 5, yPosition);
    
    yPosition += 5;
    
    // Header underline
    doc.setDrawColor(lightGray);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    
    yPosition += 8;

    // Table content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    cartItems.forEach((item, index) => {
      // Calculate how many lines the item name will take
      const itemNameLines = doc.splitTextToSize(item.name, col1Width - 5);
      const rowHeight = Math.max(itemNameLines.length * 4, 15); // Minimum height of 15
      
      // Check if we need a new page
      if (yPosition + rowHeight > pageHeight - 60) {
        doc.addPage();
        yPosition = margin + 20;
        
        // Repeat headers on new page
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Item', col1X, yPosition);
        doc.text('Qty', col2X + 5, yPosition);
        doc.text('Unit Price', col3X + 5, yPosition);
        doc.text('Total', col4X + 5, yPosition);
        yPosition += 5;
        doc.setDrawColor(lightGray);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
      }
      
      // Item name with wrapping within fixed column width
      addWrappedText(item.name, col1X, yPosition, col1Width - 5, 10);
      
      // Other columns aligned to the first line, within their fixed boundaries
      doc.text(item.quantity.toString(), col2X + 5, yPosition);
      
      // Format prices to fit within column width
      const unitPrice = `Rs. ${item.price.toLocaleString()}`;
      const totalPrice = `Rs. ${(item.price * item.quantity).toLocaleString()}`;
      
      doc.text(unitPrice, col3X + 5, yPosition);
      doc.text(totalPrice, col4X + 5, yPosition);
      
      yPosition += rowHeight;
      
      // Add a subtle line between items (except for the last item)
      if (index < cartItems.length - 1) {
        doc.setDrawColor(240, 240, 240);
        doc.setLineWidth(0.2);
        doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
      }
    });

    // Totals section
    yPosition += 15;
    doc.setDrawColor(accentColor);
    doc.setLineWidth(1);
    doc.line(col3X, yPosition, pageWidth - margin, yPosition);
    
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setTextColor(textColor);
    
    // Subtotal
    doc.text('Subtotal:', col3X + 5, yPosition);
    doc.text(`Rs. ${subtotal.toLocaleString()}`, col4X + 5, yPosition);
    yPosition += 12;
    
    // Discount (if any)
    if (discount > 0) {
      doc.text(`Discount (${discount}%):`, col3X + 5, yPosition);
      doc.text(`- Rs. ${discountAmount.toLocaleString()}`, col4X + 5, yPosition);
      yPosition += 12;
    }
    
    // Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('Total Amount:', col3X + 5, yPosition);
    doc.text(`Rs. ${payableAmount.toLocaleString()}`, col4X + 5, yPosition);
    
    yPosition += 20;
    
    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(lightGray);
    
    const footerY = pageHeight - 40;
    doc.text('Thank you for choosing Geolex!', pageWidth / 2, footerY, { align: 'center' });
    doc.text('This quotation is valid for 30 days from the date of issue.', pageWidth / 2, footerY + 10, { align: 'center' });

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Geolex_Quotation_${currentDate}.pdf`;

    // Save the PDF
    doc.save(filename);
  };

  // Handle checkout with authentication check
  const handleCheckout = useCallback(async () => {
    try {
      // Check if user is authenticated
      if (!user) {
        setWasWaitingForAuth(true);
        setIsAuthModalOpen(true);
        return;
      }

      // Fetch website user data
      const websiteUser = await WebsiteUserService.getWebsiteUser(user.id);
      
      // Transform website user data to checkout format
      const checkoutData = WebsiteUserService.transformToCheckoutData(
        websiteUser, 
        user.email || ''
      );
      
      // Convert to CheckoutFormData format for the modal
      const modalData: CheckoutFormData = {
        firstName: checkoutData.firstName,
        lastName: checkoutData.lastName,
        email: checkoutData.email,
        phone: checkoutData.phone,
        altPhone: checkoutData.altPhone || '',
        deliveryAddress: checkoutData.address,
        city: checkoutData.city,
        postalCode: checkoutData.postalCode,
        country: '' // Default empty country
      };
      
      setCurrentUserProfile(modalData);
      
      // Always show the checkout modal for verification/editing
      setIsCheckoutModalOpen(true);
    } catch (error) {
      console.error('Checkout error:', error);
      showError('Failed to load checkout data. Please try again.');
    }
  }, [user, showError]);

  // Handle successful order confirmation
  const handleOrderConfirm = () => {
    setShowOrderConfirmation(false);
    
    // Clear cart
    if (onCartChange) {
      onCartChange([]);
    }
    
    // Download quotation
    handleDownloadQuotation();
    
    // Show success message
    showSuccess('Order confirmed! Your quotation has been downloaded.');
    
    // Navigate to home page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  // Handle profile update and order creation
  const handleProfileUpdateSuccess = async (formData: CheckoutFormData) => {
    try {
      if (!user) {
        showError('User authentication required');
        return;
      }

      // Convert CheckoutFormData to WebsiteCheckoutData
      const websiteCheckoutData: WebsiteCheckoutData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        altPhone: formData.altPhone,
        address: formData.deliveryAddress,
        city: formData.city,
        postalCode: formData.postalCode
      };

      // Validate the data
      const validation = WebsiteUserService.validateCheckoutData(websiteCheckoutData);
      if (!validation.isValid) {
        // Show individual error messages
        validation.errors.forEach(error => {
          showError(error);
        });
        return;
      }

      // Save user data to website_users table
      const saveResult = await WebsiteUserService.upsertWebsiteUser(user.id, websiteCheckoutData);
      if (!saveResult.success) {
        saveResult.errors.forEach(error => {
          showError(error);
        });
        return;
      }

      // Prepare order data
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const orderData = {
        user_id: user.id,
        total_amount: payableAmount,
        payment_method: 'Cash on Delivery', // Default payment method
        shipping_address: formData.deliveryAddress,
        shipping_city: formData.city,
        shipping_postal_code: formData.postalCode,
        delivery_instructions: '', // Can be extended later
        order_items: orderItems
      };

      // Create the order
      const orderResult = await WebsiteUserService.createWebsiteOrder(orderData);
      if (!orderResult.success) {
        showError(orderResult.error || 'Failed to create order');
        return;
      }

      // Close modal and show success
      setIsCheckoutModalOpen(false);
      showSuccess('Order created successfully!');
      
      // Clear cart
      if (onCartChange) {
        onCartChange([]);
      }
      
      // Download quotation
      handleDownloadQuotation();
      
      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Order creation error:', error);
      showError('Failed to process order. Please try again.');
    }
  };

  // Monitor user authentication changes
  useEffect(() => {
    if (user && wasWaitingForAuth && isAuthModalOpen) {
      setIsAuthModalOpen(false);
      setWasWaitingForAuth(false);
      // Retry checkout after successful authentication
      setTimeout(() => {
        handleCheckout();
      }, 500);
    }
  }, [user, wasWaitingForAuth, isAuthModalOpen, handleCheckout]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background-color)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#151b25] text-white px-6 py-3 rounded-lg hover:bg-[#13ee9e] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-color)]" style={{ fontFamily: 'Red Hat Display, sans-serif' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Side - Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white mb-0 rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-[#13ee9e]/10 text-[#13ee9e] text-xs rounded-full border border-[#13ee9e]/20">
                          In Stock
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        Rs. {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                        className="p-2 rounded-full bg-gray-50 hover:bg-[#13ee9e] hover:text-white transition-colors border border-gray-200"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium text-lg">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                        className="p-2 rounded-full bg-gray-50 hover:bg-[#13ee9e] hover:text-white transition-colors border border-gray-200"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="p-2 text-gray-400 hover:text-[#13ee9e] transition-colors rounded-full hover:bg-gray-50"
                        title="Move to Wishlist"
                      >
                        <HeartIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-50"
                        title="Remove Item"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Receipt */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Receipt</h2>
              
              {/* Receipt Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Discount Amount</span>
                  <span className="font-semibold">Rs. {discountAmount.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-900">Payable Amount</span>
                    <span className="text-gray-900">Rs. {payableAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#151b25] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#13ee9e] transition-colors"
                  id='checkout-page-checkout-btn'
                >
                  Checkout
                </button>
                
                <button
                  onClick={handleDownloadQuotation}
                  className="w-full bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200"
                >
                  <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                  Download Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Checkout Confirmation Modal */}
      {user && currentUserProfile && (
        <CheckoutConfirmationModal 
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          onConfirm={handleProfileUpdateSuccess}
          userProfile={currentUserProfile}
        />
      )}

      {/* Order Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showOrderConfirmation}
        onClose={() => setShowOrderConfirmation(false)}
        onConfirm={handleOrderConfirm}
        title="Confirm Your Order"
        message={`Are you sure you want to proceed with this order? Total amount: $${payableAmount.toFixed(2)}`}
        confirmText="Confirm Order"
        cancelText="Cancel"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default CheckoutPage;
import React from "react";
import { useNavigate } from "react-router-dom";
import { TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
import "./CartDropdown.css";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartDropdownProps {
  isVisible: boolean;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onMoveToWishlist: (item: CartItem) => void;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({
  isVisible,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const navigate = useNavigate();
  const totalCost = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  // const handleViewCart = () => {
  //   onClose();
  //   // You can navigate to a dedicated cart page or keep this as is
  //   navigate('/checkout');
  // };

  if (!isVisible) return null;

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-[420px] bg-[#151b25] border border-white/10 rounded-lg shadow-2xl backdrop-blur-md z-50 transform transition-all duration-300 ease-in-out max-h-[calc(100vh-120px)] flex flex-col"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Invisible bridge area to help with hover */}
      <div className="absolute -top-4 right-0 w-20 h-4 bg-transparent"></div>
      
      {/* Arrow pointing up - positioned to align with cart icon */}
      <div className="absolute -top-2 right-6 w-4 h-4 bg-[#151b25] border-l border-t border-white/10 transform rotate-45"></div>
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <h3 className="text-lg font-semibold text-white">Shopping Cart</h3>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">Your cart is empty</p>
            <p className="text-gray-500 text-sm mt-2">Add some products to get started!</p>
          </div>
        ) : (
          <div className="py-2">
            {items.map((item) => (
              <div key={item.id} className="px-4 py-4 hover:bg-white/5 transition-colors duration-200 border-b border-white/5 last:border-b-0">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md border border-white/10"
                    />
                  </div>

                  {/* Product Info and Controls */}
                  <div className="flex-1 space-y-3">
                    {/* Product Name and Price */}
                    <div>
                      <h4 className="text-sm font-medium text-white leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-sm text-[#13ee9e] font-semibold mt-1">
                        Rs. {item.price.toLocaleString()} each
                      </p>
                    </div>

                    {/* Quantity Controls and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 bg-white/5 rounded-lg px-3 py-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="text-white text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        {/* Move to Wishlist Button */}
                        <button
                          onClick={() => onMoveToWishlist(item)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200 hover:bg-red-400/10 rounded-lg"
                          title="Move to wishlist"
                        >
                          <HeartIcon className="h-4 w-4" />
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 hover:bg-red-500/10 rounded-lg"
                          title="Remove item"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total Price for this item */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-sm text-gray-300">Subtotal:</span>
                      <span className="text-sm font-semibold text-[#13ee9e]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Total and Actions */}
      {items.length > 0 && (
        <div className="px-4 py-4 border-t-2 border-white/20 bg-white/5 flex-shrink-0">
          {/* Total Cost */}
          <div className="flex justify-between items-center mb-4 p-3 bg-[#13ee9e]/10 rounded-lg border border-[#13ee9e]/20">
            <span className="text-xl font-bold text-white font-roboto">Total:</span>
            <span className="text-xl font-bold text-[#13ee9e]">
              Rs. {totalCost.toLocaleString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {/* <button 
              onClick={handleViewCart}
              className="flex-1 bg-[#13ee9e] text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-[#0fd189] transform hover:scale-[1.02] font-roboto shadow-lg"
            >
              View Cart
            </button> */}
            <button 
              onClick={handleCheckout}
              className="flex-1 bg-white/10 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-white/20 backdrop-blur-sm font-roboto border border-white/20"
              id="checkout-button"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;

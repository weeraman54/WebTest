import React from "react";
import { HeartIcon, ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";
import "./WishlistDropdown.css";

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  inStock?: boolean;
}

interface WishlistDropdownProps {
  isVisible: boolean;
  items: WishlistItem[];
  onAddToCart: (item: WishlistItem) => void;
  onRemoveItem: (id: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const WishlistDropdown: React.FC<WishlistDropdownProps> = ({
  isVisible,
  items,
  onAddToCart,
  onRemoveItem,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-96 bg-[#151b25] border border-white/10 rounded-lg shadow-2xl backdrop-blur-md z-50 transform transition-all duration-300 ease-in-out max-h-[calc(100vh-120px)] flex flex-col"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Invisible bridge area to help with hover */}
      <div className="absolute -top-4 right-0 w-20 h-4 bg-transparent"></div>
      
      {/* Arrow pointing up - positioned to align with wishlist icon */}
      <div className="absolute -top-2 right-6 w-4 h-4 bg-[#151b25] border-l border-t border-white/10 transform rotate-45"></div>
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <h3 className="text-lg font-semibold text-white font-roboto">Wishlist</h3>
      </div>

      {/* Wishlist Items */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <HeartIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 font-roboto text-lg">Your wishlist is empty</p>
            <p className="text-gray-500 font-roboto text-sm mt-2">Save items you love for later!</p>
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
                      <h4 className="text-sm font-medium text-white font-roboto leading-tight">
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-[#13ee9e] font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <p className="text-xs text-gray-400 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{item.category}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => onAddToCart(item)}
                        disabled={!item.inStock}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                          item.inStock
                            ? "bg-[#13ee9e] text-white hover:bg-[#0fd189] transform hover:scale-[1.02] shadow-lg"
                            : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCartIcon className="w-4 h-4" />
                        <span>{item.inStock ? "Add to Cart" : "Out of Stock"}</span>
                      </button>

                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200 hover:bg-red-400/10 rounded-lg"
                        title="Remove from wishlist"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Actions */}
      {items.length > 0 && (
        <div className="px-4 py-4 border-t-2 border-white/20 bg-white/5 flex-shrink-0">
          {/* Item Count */}
          <div className="flex justify-between items-center mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <span className="text-lg font-bold text-white font-roboto">Items:</span>
            <span className="text-lg font-bold text-red-400">
              {items.length}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 bg-red-500/80 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-red-500 transform hover:scale-[1.02] font-roboto shadow-lg">
              View Wishlist
            </button>
            <button 
              onClick={() => {
                const inStockItems = items.filter(item => item.inStock);
                inStockItems.forEach(item => onAddToCart(item));
              }}
              className="flex-1 bg-white/10 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-white/20 backdrop-blur-sm font-roboto border border-white/20"
            >
              Add All to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistDropdown;

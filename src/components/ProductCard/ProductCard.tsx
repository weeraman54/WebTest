import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  isOnSale?: boolean;
  isWishlisted?: boolean;
  onAddToWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onQuickView: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  inStock,
  isOnSale,
  isWishlisted,
  onAddToWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Stock Badge */}
      {inStock && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            IN STOCK
          </span>
        </div>
      )}

      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <button
              onClick={(e) => handleButtonClick(e, () => onAddToWishlist(id))}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Add to Wishlist"
            >
              {isWishlisted ? (
                <HeartIconSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-700" />
              )}
            </button>
            
            <button
              onClick={(e) => handleButtonClick(e, () => onQuickView(id))}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Quick View"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-700" />
            </button>
            
            <button
              onClick={(e) => handleButtonClick(e, () => onAddToCart(id))}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Add to Cart"
            >
              <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
            - {category} -
          </p>
          
          <div className="flex items-center justify-center space-x-2 mb-3">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => handleButtonClick(e, () => onAddToCart(id))}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

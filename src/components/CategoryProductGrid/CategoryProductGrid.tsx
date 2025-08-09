import React from 'react';
import ProductBox from '../ProductBox/ProductBox';
import type { Product } from '../../types/product';

interface CategoryProductGridProps {
  products: Product[];
  onAddToWishlist: (productId: string, productData: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    category: string;
    inStock?: boolean;
  }) => void;
  onAddToCart: (productId: string, productData: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    category: string;
    inStock?: boolean;
  }) => void;
  onQuickView: (id: string) => void;
  wishlistItems?: { id: string }[];
}

const CategoryProductGrid: React.FC<CategoryProductGridProps> = ({
  products,
  onAddToWishlist,
  onAddToCart,
  onQuickView: _onQuickView,
  wishlistItems = [],
}) => {
  const handleToggleWishlist = (productId: string, productData: any) => {
    onAddToWishlist(productId, productData);
  };

  const handleAddToCart = (productId: string, productData: any) => {
    onAddToCart(productId, productData);
  };

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters or search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductBox
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          originalPrice={product.originalPrice}
          image={product.image}
          category={product.category}
          inStock={product.inStock}
          discount={product.isOnSale ? 10 : undefined}
          rating={4.5}
          reviewCount={10}
          isInWishlist={wishlistItems.some(item => item.id === product.id)}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};

export default CategoryProductGrid;

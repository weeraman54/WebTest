import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ProductSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  totalResults: number;
  currentPage: number;
  itemsPerPage: number;
}

const ProductSort: React.FC<ProductSortProps> = ({
  sortBy,
  onSortChange,
  totalResults,
  currentPage,
  itemsPerPage,
}) => {
  const sortOptions = [
    { value: 'default', label: 'Default sorting' },
    { value: 'popularity', label: 'Sort by popularity' },
    { value: 'rating', label: 'Sort by average rating' },
    { value: 'date', label: 'Sort by latest' },
    { value: 'price-asc', label: 'Sort by price: low to high' },
    { value: 'price-desc', label: 'Sort by price: high to low' },
  ];

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4" id="product-sort-container">
      {/* Category Filter Dropdown */}
      <div className="flex items-center gap-4" id="sort-controls">
        <div className="relative">
          <select 
            className="appearance-none bg-white text-gray-900 px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            id="category-filter-dropdown"
          >
            <option value="all">All Products</option>
            <option value="laptops">Laptops</option>
            <option value="desktops">Desktops</option>
            <option value="accessories">Accessories</option>
            <option value="components">Components</option>
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
        </div>
        
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-white text-gray-900 px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            id="sort-dropdown"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-700 text-sm font-medium" id="results-count">
        Showing {startItem} – {endItem} of {totalResults} results
      </div>
    </div>
  );
};

export default ProductSort;

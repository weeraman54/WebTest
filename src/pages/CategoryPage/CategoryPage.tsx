import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FilterSidebar from '../../components/Filters/FilterSidebar';
import ProductSort from '../../components/ProductSort/ProductSort';
import CategoryProductGrid from '../../components/CategoryProductGrid/CategoryProductGrid';
import Pagination from '../../components/Pagination/Pagination';
import { ProductService } from '../../services/ProductService';
import { filterData, priceRange } from '../../data/categoryData';
import type { Product } from '../../types/product';
import type { WishlistItem } from '../../data/wishlistData';
import type { CartItem } from '../../data/cartData';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface FilterSection {
  title: string;
  options: Array<{ id: string; name: string; count?: number }>;
  type: 'checkbox' | 'radio';
}

interface CategoryPageProps {
  wishlistItems?: WishlistItem[];
  onWishlistChange?: (items: WishlistItem[]) => void;
  cartItems?: CartItem[];
  onCartChange?: (items: CartItem[]) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ 
  wishlistItems = [], 
  onWishlistChange,
  cartItems = [],
  onCartChange 
}) => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRange);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dynamicPriceRange, setDynamicPriceRange] = useState(priceRange);
  const itemsPerPage = 12;

  // Category name mapping
  const categoryNames: Record<string, string> = {
    'laptops': 'Laptops',
    'used-desktop': 'Used Desktop',
    'brand-new-desktop': 'Brand New Desktop',
    'processors': 'Processors',
    'motherboards': 'Motherboards',
    'memory': 'Memory',
    'casing': 'Casing',
    'monitors': 'Monitors',
    'storage-odd': 'Storage & ODD',
    'ssd': 'SSD',
    'power-supply': 'Power Supply',
    'graphics-card': 'Graphics Card',
    'cooling': 'Cooling',
    'speaker-headphone': 'Speaker & Headphone',
    'laptop-accessories': 'Laptop Accessories',
    'printers-accessories': 'Printers & Accessories',
    'network-accessories': 'Network Accessories',
    'pen-drive-sd-card': 'Pen Drive & SD Card',
    'accessories': 'Accessories',
    'pcie-adapters-cables': 'PCIe Adapters & Cables',
    'keyboard-mouse': 'Keyboard & Mouse',
  };

  const currentCategoryName = categoryId ? categoryNames[categoryId] || 'All Products' : 'All Products';

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔍 CategoryPage: Fetching products for categoryId:', categoryId);
        
        let fetchedProducts: Product[] = [];
        
        if (categoryId) {
          // Map categoryId to actual database category_name values - these should match the database exactly
          const categoryMap: Record<string, string> = {
            'laptops': 'Laptops',
            'used-desktop': 'Used Desktop', 
            'brand-new-desktop': 'Brand New Desktop',
            'processors': 'Processors',
            'motherboards': 'Motherboards',
            'memory': 'Memory',
            'casing': 'Casing',
            'monitors': 'Monitors',
            'storage-odd': 'Storage & ODD',
            'ssd': 'SSD',
            'power-supply': 'Power Supply',
            'graphics-card': 'Graphics Card',
            'cooling': 'Cooling',
            'speaker-headphone': 'Speaker & Headphone',
            'laptop-accessories': 'Laptop Accessories',
            'printers-accessories': 'Printers & Accessories',
            'network-accessories': 'Network Accessories',
            'pen-drive-sd-card': 'Pen Drive & SD Card',
            'accessories': 'Accessories',
            'pcie-adapters-cables': 'PCIe Adapters & Cables',
            'keyboard-mouse': 'Keyboard & Mouse'
          };
          
          const dbCategory = categoryMap[categoryId];
          console.log('🔍 CategoryPage: categoryId:', categoryId, '-> dbCategory:', dbCategory);
          
          if (dbCategory) {
            fetchedProducts = await ProductService.fetchProductsByCategory(dbCategory);
            console.log('🔍 CategoryPage: Fetched products for category:', dbCategory, 'count:', fetchedProducts.length);
          } else {
            console.log('🔍 CategoryPage: No mapping found, fetching all products');
            fetchedProducts = await ProductService.fetchWebsiteProducts();
          }
        } else {
          console.log('🔍 CategoryPage: No categoryId, fetching all products');
          fetchedProducts = await ProductService.fetchWebsiteProducts();
        }
        
        console.log('🔍 CategoryPage: Final products count:', fetchedProducts.length);
        if (fetchedProducts.length > 0) {
          console.log('🔍 CategoryPage: ===== PRODUCT STRUCTURE DEBUG =====');
          console.log('🔍 CategoryPage: First product sample:', JSON.stringify(fetchedProducts[0], null, 2));
          console.log('🔍 CategoryPage: All product fields:', Object.keys(fetchedProducts[0] || {}));
          console.log('🔍 CategoryPage: ===== END PRODUCT STRUCTURE DEBUG =====');
        }
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        
        // Calculate dynamic price range based on fetched products
        if (fetchedProducts.length > 0) {
          const prices = fetchedProducts.map(p => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          
          // Ensure there's always a meaningful range
          const minRounded = Math.floor(minPrice / 1000) * 1000;
          const maxRounded = Math.ceil(maxPrice / 1000) * 1000;
          
          // Ensure minimum gap between min and max for slider functionality
          const minGap = 10000; // 10,000 minimum gap
          const calculatedRange = {
            min: minRounded,
            max: Math.max(maxRounded, minRounded + minGap)
          };
          
          console.log('🔍 CategoryPage: Product prices range:', { minPrice, maxPrice });
          console.log('🔍 CategoryPage: Calculated price range:', calculatedRange);
          
          setDynamicPriceRange(calculatedRange);
          setSelectedPriceRange(calculatedRange); // Set initial selected range to full range
        }
        
        setCurrentPage(1); // Reset to first page when category changes
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Filter sections configuration
  const filterSections: FilterSection[] = [
    {
      title: 'PRODUCT BRANDS',
      options: filterData.brands,
      type: 'checkbox'
    },
    {
      title: 'PRODUCT AVAILABILITY',
      options: filterData.availability,
      type: 'checkbox'
    }
  ];

  // Helper function to extract brand from product specifications
  const extractBrandFromProduct = (product: any): string | null => {
    try {
      console.log('🔍 CategoryPage: Extracting brand for product:', product.name);
      
      // First, try to get brand from parsedSpecifications (preferred method)
      if (product.parsedSpecifications && typeof product.parsedSpecifications === 'object') {
        console.log('🔍 CategoryPage: Checking parsedSpecifications:', product.parsedSpecifications);
        
        if (product.parsedSpecifications.Brand) {
          const brandName = product.parsedSpecifications.Brand.trim();
          console.log('🔍 CategoryPage: ✅ Found brand in parsedSpecifications:', brandName);
          return brandName;
        }
      }
      
      // NEW: Parse the original specifications field directly (your actual data format)
      if (product.specifications && typeof product.specifications === 'string') {
        console.log('🔍 CategoryPage: Parsing original specifications field:', product.specifications);
        
        try {
          const specifications = JSON.parse(product.specifications);
          console.log('🔍 CategoryPage: Parsed specifications object:', specifications);
          
          // Check if Brand is directly in the specifications object
          if (specifications.Brand) {
            const brandName = specifications.Brand.trim();
            console.log('🔍 CategoryPage: ✅ Found brand directly in specifications:', brandName);
            return brandName;
          }
          
          // Fallback: check if it has the nested features structure
          if (specifications.features && Array.isArray(specifications.features)) {
            console.log('🔍 CategoryPage: Checking nested features structure...');
            for (let i = 0; i < specifications.features.length; i++) {
              const featureStr = specifications.features[i];
              try {
                let feature;
                if (typeof featureStr === 'string') {
                  feature = JSON.parse(featureStr);
                } else {
                  feature = featureStr;
                }
                
                if (feature.Brand) {
                  const brandName = feature.Brand.trim();
                  console.log('🔍 CategoryPage: ✅ Found brand in nested features:', brandName);
                  return brandName;
                }
              } catch (featureParseError) {
                continue;
              }
            }
          }
        } catch (parseError) {
          console.error('🔍 CategoryPage: Failed to parse specifications JSON:', parseError);
        }
      }
      
      console.log('🔍 CategoryPage: No brand found for product:', product.name);
      return null;
    } catch (error) {
      console.error('🔍 CategoryPage: Error extracting brand from product:', product.name, error);
      return null;
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    // Don't apply filters if we don't have products yet or are still loading
    if (products.length === 0 || isLoading) {
      console.log('🔍 CategoryPage: Skipping filters - no products or still loading');
      return;
    }

    let filtered = [...products];

    console.log('🔍 CategoryPage: Applying filters. Products count:', products.length);
    console.log('🔍 CategoryPage: Selected filters:', selectedFilters);
    console.log('🔍 CategoryPage: Price range filter:', selectedPriceRange);

    // Remove the duplicate category filtering logic here since products are already fetched by category
    // The category filtering is already handled in the fetch logic

    // Apply brand filters
    if (selectedFilters['PRODUCT BRANDS']?.length > 0) {
      console.log('🔍 CategoryPage: Applying brand filters:', selectedFilters['PRODUCT BRANDS']);
      
      filtered = filtered.filter(product => {
        const productBrand = extractBrandFromProduct(product);
        
        // If no brand found, treat as "Unknown" brand
        if (!productBrand) {
          console.log('🔍 CategoryPage: No brand found for product (treating as Unknown):', product.name);
          // Check if "unknown" brand is selected in filters
          const hasUnknownFilter = selectedFilters['PRODUCT BRANDS'].some(brandId => 
            brandId.toLowerCase() === 'unknown'
          );
          return hasUnknownFilter; // Only include if "unknown" is specifically selected
        }
        
        // Check if the product brand matches any of the selected brand filters (robust case-insensitive)
        const matches = selectedFilters['PRODUCT BRANDS'].some(brandId => {
          // Get the brand name from filterData for comparison
          const brandFilter = filterData.brands.find(b => b.id === brandId);
          if (!brandFilter) return false;
          
          // Normalize both strings: trim, lowercase, remove extra spaces
          const normalizedProductBrand = productBrand.trim().toLowerCase().replace(/\s+/g, ' ');
          const normalizedFilterBrand = brandFilter.name.trim().toLowerCase().replace(/\s+/g, ' ');
          
          const isMatch = normalizedProductBrand === normalizedFilterBrand;
          console.log('🔍 CategoryPage: Comparing product brand:', `"${productBrand}"`, 'with filter:', `"${brandFilter.name}"`, 'normalized match:', isMatch);
          return isMatch;
        });
        
        return matches;
      });
      
      console.log('🔍 CategoryPage: After brand filtering:', filtered.length);
    } else {
      // No brand filters selected - show ALL products including those without brand info
      console.log('🔍 CategoryPage: No brand filters selected - showing all products including unknown brands');
    }

    // Apply availability filters
    if (selectedFilters['PRODUCT AVAILABILITY']?.length > 0) {
      filtered = filtered.filter(product => {
        const availability = selectedFilters['PRODUCT AVAILABILITY'];
        if (availability.includes('in-stock')) return product.inStock;
        if (availability.includes('out-of-stock')) return !product.inStock;
        return true;
      });
      console.log('🔍 CategoryPage: After availability filtering:', filtered.length);
    }

    // Apply price range filter
    filtered = filtered.filter(product => {
      const withinRange = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
      if (!withinRange) {
        console.log(`🔍 CategoryPage: Product ${product.name} (${product.price}) filtered out by price range ${selectedPriceRange.min}-${selectedPriceRange.max}`);
      }
      return withinRange;
    });
    console.log('🔍 CategoryPage: After price filtering:', filtered.length);

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        // Sort by in-stock first, then by price
        filtered.sort((a, b) => {
          if (a.inStock === b.inStock) return a.price - b.price;
          return a.inStock ? -1 : 1;
        });
        break;
      case 'date':
        // Sort by newest first (reverse order)
        filtered.reverse();
        break;
      default:
        // Default sorting
        break;
    }

    console.log('🔍 CategoryPage: Final filtered products:', filtered.length);
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedFilters, selectedPriceRange, sortBy, products, isLoading]);

  const handleFilterChange = (sectionTitle: string, optionId: string, isSelected: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[sectionTitle]) {
        newFilters[sectionTitle] = [];
      }
      
      if (isSelected) {
        newFilters[sectionTitle] = [...newFilters[sectionTitle], optionId];
      } else {
        newFilters[sectionTitle] = newFilters[sectionTitle].filter(id => id !== optionId);
      }
      
      return newFilters;
    });
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    setSelectedPriceRange(range);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToWishlist = (productId: string, productData: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    category: string;
    inStock?: boolean;
  }) => {
    if (!onWishlistChange) return;

    const existingIndex = wishlistItems.findIndex(item => item.id === productId);
    
    if (existingIndex >= 0) {
      // Remove from wishlist
      onWishlistChange(wishlistItems.filter(item => item.id !== productId));
    } else {
      // Add to wishlist
      const newWishlistItem: WishlistItem = {
        id: productData.id,
        name: productData.name,
        image: productData.image,
        price: productData.price,
        originalPrice: productData.originalPrice,
        category: productData.category,
        inStock: productData.inStock,
      };
      onWishlistChange([...wishlistItems, newWishlistItem]);
    }
  };

  const handleAddToCart = (productId: string, productData: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    category: string;
    inStock?: boolean;
  }) => {
    if (!onCartChange || !productData.inStock) return;

    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      const updatedCartItems = cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      onCartChange(updatedCartItems);
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        id: productData.id,
        name: productData.name,
        image: productData.image,
        price: productData.price,
        quantity: 1,
      };
      onCartChange([...cartItems, newCartItem]);
    }
  };

  const handleQuickView = (id: string) => {
    console.log('Quick view:', id);
    // Implement quick view logic here
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }} id="category-page">
      {/* Page Header */}
      <div className="py-8" style={{ backgroundColor: 'var(--category-bg)' }} id="category-header">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white" id="category-title">{currentCategoryName}</h1>
            <div className="text-sm text-gray-300" id="breadcrumb">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span className="text-white">{currentCategoryName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 py-16" id="loading-state">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" id="loading-spinner"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="container mx-auto px-4 py-16" id="error-state">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" id="error-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Products</h3>
            <p className="text-gray-600 mb-4" id="error-message">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              id="retry-button"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <div className="container mx-auto px-4 py-8" id="main-content">
        <div className="flex flex-col lg:flex-row gap-8" id="content-layout">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6" id="mobile-filter-toggle">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm"
              id="filter-toggle-button"
            >
              {isFilterOpen ? (
                <>
                  <XMarkIcon className="w-5 h-5" />
                  <span>Close Filters</span>
                </>
              ) : (
                <>
                  <Bars3Icon className="w-5 h-5" />
                  <span>Show Filters</span>
                </>
              )}
            </button>
          </div>

          {/* Filter Sidebar */}
          <div className={`
            lg:block lg:w-80 flex-shrink-0
            ${isFilterOpen ? 'block' : 'hidden'}
            ${isFilterOpen ? 'mb-8' : ''}
          `} id="filter-sidebar">
            <FilterSidebar
              filters={filterSections}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              priceRange={dynamicPriceRange}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={handlePriceRangeChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1" id="products-section">
            {/* Product Sort */}
            <ProductSort
              sortBy={sortBy}
              onSortChange={handleSortChange}
              totalResults={filteredProducts.length}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />

            {/* Products Grid */}
            <CategoryProductGrid
              products={currentProducts}
              onAddToWishlist={handleAddToWishlist}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              wishlistItems={wishlistItems}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

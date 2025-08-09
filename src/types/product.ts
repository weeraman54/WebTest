// Database inventory item interface (matches database schema and view)
export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  category_name?: string; // From view
  category_id?: string; // From view
  unit_of_measure?: string;
  purchase_cost?: number;
  selling_price?: number;
  price?: number; // From view (mapped from selling_price)
  current_stock?: number;
  stock?: number; // From view (mapped from current_stock)
  reorder_level?: number;
  sku?: string;
  is_active?: boolean;
  is_website_item?: boolean;
  image_url?: string;
  additional_images?: string;
  specifications?: string;
  weight?: number;
  dimensions?: string;
  url_slug?: string;
  meta_description?: string;
  is_featured?: boolean;
  sale_price?: number;
  created_at?: string;
  updated_at?: string;
}

// Frontend product interface (transformed from InventoryItem)
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  image: string;
  category: string;
  description: string;
  specs: string[];
  specifications: string[];
  parsedSpecifications: Record<string, string>; // For structured specifications display
  inStock: boolean;
  stock: number;
  isOnSale: boolean;
  isFeatured: boolean;
  rating: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  metaDescription?: string;
  urlSlug?: string;
  sku?: string;
  unitOfMeasure: string;
}

// Transform function from InventoryItem to Product
export const transformInventoryItemToProduct = (item: InventoryItem): Product => {
  // Get stock value (handle both view and table formats)
  const stockValue = item.stock ?? item.current_stock ?? 0;
  const priceValue = item.price ?? item.selling_price ?? 0;
  
  // Parse specifications with improved error handling
  let specs: string[] = [];
  let parsedSpecifications: Record<string, string> = {};
  
  try {
    if (item.specifications) {
      const outerParsed = JSON.parse(item.specifications);
      
      // Handle direct specification format (Brand directly in object)
      if (outerParsed.Brand || outerParsed.description || outerParsed.Processor) {
        // Direct format: specifications contains the data directly
        parsedSpecifications = outerParsed;
        specs = Object.entries(outerParsed).map(([key, value]) => `${key}: ${value}`);
        console.log('🔍 Direct specifications format detected:', parsedSpecifications);
      }
      // Handle nested features format (original format)
      else if (outerParsed.features && outerParsed.features.length > 0) {
        const featureData = outerParsed.features[0];
        
        // Handle different specification formats
        if (typeof featureData === 'string') {
          try {
            // Try to parse as JSON
            const innerParsed = JSON.parse(featureData);
            if (typeof innerParsed === 'object' && innerParsed !== null) {
              parsedSpecifications = innerParsed;
              specs = Object.entries(innerParsed).map(([key, value]) => `${key}: ${value}`);
            }
          } catch {
            // If not JSON, treat as simple string specification
            parsedSpecifications = { 'Features': featureData };
            specs = [featureData];
          }
        } else if (typeof featureData === 'object') {
          parsedSpecifications = featureData;
          specs = Object.entries(featureData).map(([key, value]) => `${key}: ${value}`);
        }
      }
    }
  } catch (error) {
    // Silently handle specification parsing errors
    console.warn('🔍 Specification parsing error:', error);
    specs = [];
    parsedSpecifications = {};
  }

  // Parse dimensions safely
  let dimensions = { length: 0, width: 0, height: 0 };
  try {
    if (item.dimensions) {
      dimensions = JSON.parse(item.dimensions);
    }
  } catch {
    dimensions = { length: 0, width: 0, height: 0 };
  }

  const finalProduct = {
    id: item.id,
    name: item.name,
    price: item.sale_price || priceValue,
    originalPrice: item.sale_price && priceValue && item.sale_price < priceValue ? priceValue : undefined,
    salePrice: item.sale_price || undefined,
    image: item.image_url || '/placeholder.svg?height=400&width=400',
    category: item.category_name || item.category || 'Uncategorized',
    description: item.description || '',
    specs,
    specifications: specs,
    parsedSpecifications,
    inStock: Number(stockValue) > 0,
    stock: Number(stockValue),
    isOnSale: !!item.sale_price && priceValue > 0 && item.sale_price < priceValue,
    isFeatured: item.is_featured || false,
    rating: 4.5,
    weight: item.weight || undefined,
    dimensions: dimensions.length > 0 || dimensions.width > 0 || dimensions.height > 0 ? dimensions : undefined,
    metaDescription: item.meta_description || undefined,
    urlSlug: item.url_slug || undefined,
    sku: item.sku || undefined,
    unitOfMeasure: item.unit_of_measure || 'pcs'
  };

  return finalProduct;
};

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   HeartIcon, 
//   ArrowLeftIcon,
//   ShoppingCartIcon 
// } from '@heroicons/react/24/outline';
// import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
// import { ProductService } from '../../services/ProductService';
// import { type Product } from '../../types/product';

// interface ProductDetailPageProps {
//   onAddToCart: (productId: string) => void;
//   onAddToWishlist: (productId: string) => void;
//   wishlistItems: Array<{ id: string }>;
// }

// const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
//   onAddToCart,
//   onAddToWishlist,
//   wishlistItems
// }) => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Load product directly by ID for better performance
//     const loadProduct = async () => {
//       if (!id) return;
      
//       setLoading(true);
      
//       try {
//         const foundProduct = await ProductService.fetchProductById(id);
//         setProduct(foundProduct);
//         console.log('🎯 Product loaded for detail page:', foundProduct);
//       } catch (error) {
//         console.error('Error loading product:', error);
//         setProduct(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProduct();
//   }, [id]);

//   const formatPrice = (price: number) => {
//     return `Rs. ${price.toLocaleString()}`;
//   };

//   const isWishlisted = product ? wishlistItems.some(item => item.id === product.id) : false;

//   const handleAddToCart = () => {
//     if (product) {
//       onAddToCart(product.id);
//     }
//   };

//   const handleAddToWishlist = () => {
//     if (product) {
//       onAddToWishlist(product.id);
//     }
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   // Filter out specifications with empty values and format them properly
//   const getFilteredSpecifications = (specs: Record<string, string>) => {
//     return Object.entries(specs).filter(([_, value]) => 
//       value && 
//       value.toString().trim() !== '' && 
//       value !== 'null' && 
//       value !== 'undefined' &&
//       value.toLowerCase() !== 'n/a'
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
//           <button
//             onClick={handleGoBack}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const filteredSpecifications = getFilteredSpecifications(product.parsedSpecifications || {});

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Back Button */}
//         <button
//           onClick={handleGoBack}
//           className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
//         >
//           <ArrowLeftIcon className="h-5 w-5 mr-2" />
//           Back to Products
//         </button>

//         {/* Product Details Container */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            
//             {/* Product Image */}
//             <div className="flex justify-center items-center bg-gray-50 rounded-lg p-8">
//               <div className="w-full max-w-md">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-auto object-contain rounded-lg"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.src = '/placeholder.svg?height=400&width=400';
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Product Information */}
//             <div className="space-y-6">
//               {/* Title and Category */}
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4">
//                   {product.name}
//                 </h1>
                
//                 {/* Category and Stock Status */}
//                 <div className="flex items-center space-x-4 mb-4">
//                   <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full uppercase tracking-wider">
//                     {product.category}
//                   </span>
                  
//                   <span className={`text-sm font-medium px-3 py-1 rounded-full ${
//                     product.inStock 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-red-100 text-red-800'
//                   }`}>
//                     {product.inStock ? 'In Stock' : 'Out of Stock'}
//                   </span>

//                   {/* Brand (if available in category or separate field) */}
//                   <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  
//                   </span>
//                 </div>
//               </div>

//               {/* Price */}
//               <div className="space-y-2">
//                 <div className="flex items-center space-x-4">
//                   <span className="text-4xl font-bold text-gray-900">
//                     {formatPrice(product.price)}
//                   </span>
//                   {product.originalPrice && product.originalPrice > product.price && (
//                     <span className="text-xl text-gray-500 line-through">
//                       {formatPrice(product.originalPrice)}
//                     </span>
//                   )}
//                 </div>
//                 {product.isOnSale && (
//                   <div className="flex items-center space-x-2">
//                     <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
//                       Sale Price
//                     </span>
//                     <span className="text-sm text-gray-600">
//                       Save {formatPrice((product.originalPrice || 0) - product.price)}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex space-x-4">
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={!product.inStock}
//                   className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
//                     product.inStock
//                       ? 'bg-cyan-400 text-white hover:bg-cyan-500'
//                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   }`}
//                 >
//                   <ShoppingCartIcon className="h-5 w-5 mr-2" />
//                   {product.inStock ? 'Add To Cart' : 'Out of Stock'}
//                 </button>

//                 <button className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
//                   Buy Now
//                 </button>
//               </div>

//               {/* Specifications */}
//               {filteredSpecifications.length > 0 && (
//                 <div className="mt-8">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                     Specifications
//                   </h2>
                  
//                   <div className="bg-gray-50 rounded-lg p-6">
//                     <div className="grid grid-cols-1 gap-4">
//                       {filteredSpecifications.map(([key, value]) => (
//                         <div key={key} className="grid grid-cols-5 gap-4 py-3 border-b border-gray-200 last:border-b-0">
//                           <div className="col-span-2">
//                             <span className="font-semibold text-gray-800 uppercase text-sm tracking-wide">
//                               {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="col-span-3">
//                             <span className="text-gray-700 text-sm leading-relaxed">
//                               {value}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Additional Product Info */}
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <div className="flex items-center space-x-6 text-sm text-gray-600">
//                   <div className="flex items-center space-x-2">
//                     <span>SKU:</span>
//                     <span className="font-medium">{product.sku || 'N/A'}</span>
//                   </div>
                  
//                   <div className="flex items-center space-x-2">
//                     <span>Stock:</span>
//                     <span className="font-medium">{product.stock} units</span>
//                   </div>

//                   <button
//                     onClick={handleAddToWishlist}
//                     className="flex items-center space-x-1 hover:text-red-600 transition-colors"
//                   >
//                     {isWishlisted ? (
//                       <HeartIconSolid className="h-5 w-5 text-red-500" />
//                     ) : (
//                       <HeartIcon className="h-5 w-5" />
//                     )}
//                     <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;

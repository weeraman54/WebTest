import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/HomePage/Home";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import About from "./pages/AboutPage/About";
import AuthCallback from "./pages/AuthCallback/AuthCallback";
import AuthExample from "./pages/AuthExample/AuthExample";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";
import PasswordResetPage from "./pages/PasswordResetPage/PasswordResetPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import OrderDetailPage from "./pages/OrderDetailPage/OrderDetailPage";
import { ToastContainer, useToast } from "./components/Toast/Toast";
import { ProductService } from "./services/ProductService";
import type { Product } from "./types/product";
import type { WishlistItem } from "./data/wishlistData";
import type { CartItem } from "./data/cartData";
import "./App.css";

function App() {
  // Toast state
  const { toasts, removeToast } = useToast();
  
  // State for all products (loaded from database)
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Initialize wishlist from localStorage or empty array
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    try {
      const savedWishlist = localStorage.getItem('geolex-wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      return [];
    }
  });

  // Initialize cart from localStorage or empty array
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('geolex-cart-app');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Load all products on app initialization
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await ProductService.fetchWebsiteProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('geolex-wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('geolex-cart-app', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const handleWishlistChange = (items: WishlistItem[]) => {
    setWishlistItems(items);
  };

  const handleCartChange = (items: CartItem[]) => {
    setCartItems(items);
  };

  // Add to cart function for product detail page
  const handleAddToCart = (productId: string) => {
    // Find product from loaded products data
    const product = allProducts.find((p: Product) => p.id === productId);
    if (!product || !product.inStock) return;

    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      const updatedCartItems = cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedCartItems);
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
      };
      setCartItems([...cartItems, newCartItem]);
    }
  };

  // Toggle wishlist function for product detail page
  const handleToggleWishlist = (productId: string) => {
    const product = allProducts.find((p: Product) => p.id === productId);
    if (!product) return;

    const existingIndex = wishlistItems.findIndex(item => item.id === productId);
    
    if (existingIndex >= 0) {
      // Remove from wishlist
      setWishlistItems(wishlistItems.filter(item => item.id !== productId));
    } else {
      // Add to wishlist
      const newWishlistItem: WishlistItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        inStock: product.inStock,
      };
      setWishlistItems([...wishlistItems, newWishlistItem]);
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
          <Navbar 
            enableShrinking={false} 
            size="sm" 
            wishlistItems={wishlistItems}
            onWishlistChange={handleWishlistChange}
            cartItems={cartItems}
            onCartChange={handleCartChange}
          />
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  wishlistItems={wishlistItems}
                  onWishlistChange={handleWishlistChange}
                  cartItems={cartItems}
                  onCartChange={handleCartChange}
                />
              } 
            />
            <Route 
              path="/category/:categoryId" 
              element={
                <CategoryPage 
                  wishlistItems={wishlistItems} 
                  onWishlistChange={setWishlistItems}
                  cartItems={cartItems}
                  onCartChange={setCartItems}
                />
              } 
            />
            <Route 
              path="/category" 
              element={
                <CategoryPage 
                  wishlistItems={wishlistItems} 
                  onWishlistChange={setWishlistItems}
                  cartItems={cartItems}
                  onCartChange={setCartItems}
                />
              } 
            />
            <Route 
              path="/categories" 
              element={
                <CategoryPage 
                  wishlistItems={wishlistItems} 
                  onWishlistChange={setWishlistItems}
                  cartItems={cartItems}
                  onCartChange={setCartItems}
                />
              } 
            />
            <Route 
              path="/shop" 
              element={
                <CategoryPage 
                  wishlistItems={wishlistItems} 
                  onWishlistChange={setWishlistItems}
                  cartItems={cartItems}
                  onCartChange={setCartItems}
                />
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                <ProductDetailPage 
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleToggleWishlist}
                  wishlistItems={wishlistItems}
                />
              } 
            />
            <Route 
              path="/about" 
              element={<About />} 
            />
            <Route 
              path="/checkout" 
              element={
                <CheckoutPage 
                  cartItems={cartItems}
                  onCartChange={setCartItems}
                  wishlistItems={wishlistItems}
                  onWishlistChange={setWishlistItems}
                />
              } 
            />
            <Route 
              path="/auth/callback" 
              element={<AuthCallback />} 
            />
            <Route 
              path="/auth/reset-password" 
              element={<PasswordResetPage />} 
            />
            <Route 
              path="/account" 
              element={<AccountPage />} 
            />
            <Route 
              path="/order/:orderId" 
              element={<OrderDetailPage />} 
            />
            <Route 
              path="/auth-demo" 
              element={<AuthExample />} 
            />
          </Routes>
        </div>
        
        {/* Footer */}
        <Footer />
        
        {/* Global Toast Container */}
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </Router>
    </AuthProvider>
  );
}

export default App;

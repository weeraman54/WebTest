import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Images } from "../../assets/assets";
import CartDropdown from "../Cart/CartDropdown";
import WishlistDropdown from "../Wishlist/WishlistDropdown";
import Categories from "../Categories/Categories";
import UserProfileDropdown from "../Auth/UserProfileDropdown";
import SignInModal from "../Auth/SignInModal";
import SignUpModal from "../Auth/SignUpModal";
import type { CartItem } from "../../data/cartData";
import type { WishlistItem } from "../../data/wishlistData";

interface NavbarProps {
  enableShrinking?: boolean;
  shrinkThreshold?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  wishlistItems?: WishlistItem[];
  onWishlistChange?: (items: WishlistItem[]) => void;
  cartItems?: CartItem[];
  onCartChange?: (items: CartItem[]) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  enableShrinking = true,
  shrinkThreshold = 50,
  size = "md",
  wishlistItems = [],
  onWishlistChange,
  cartItems = [],
  onCartChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTabletSize, setIsTabletSize] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isWishlistVisible, setIsWishlistVisible] = useState(false);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [categoriesTimeout, setCategoriesTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // Cart functionality
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (!onCartChange) return;
    
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    onCartChange(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    if (!onCartChange) return;
    onCartChange(cartItems.filter(item => item.id !== id));
  };

  // Move item from cart to wishlist
  const handleMoveToWishlist = (cartItem: CartItem) => {
    // Add to wishlist
    const wishlistItem: WishlistItem = {
      id: cartItem.id,
      name: cartItem.name,
      image: cartItem.image,
      price: cartItem.price,
      category: "Electronics", // Default category since cart items don't have category
      inStock: true, // Assume in stock
    };

    // Check if item already exists in wishlist
    if (onWishlistChange) {
      const existingItem = wishlistItems.find(item => item.id === wishlistItem.id);
      if (!existingItem) {
        onWishlistChange([...wishlistItems, wishlistItem]);
      }
    }

    // Remove entire item from cart (regardless of quantity)
    // This is intentional - when moving to wishlist, we move the whole item
    if (onCartChange) {
      onCartChange(cartItems.filter(item => item.id !== cartItem.id));
    }
  };

  // Wishlist functionality
  const handleAddToCartFromWishlist = (wishlistItem: WishlistItem) => {
    if (!onCartChange) return;
    
    // Add to cart
    const cartItem: CartItem = {
      id: wishlistItem.id,
      name: wishlistItem.name,
      image: wishlistItem.image,
      price: wishlistItem.price,
      quantity: 1,
    };
    
    const existingItem = cartItems.find(item => item.id === cartItem.id);
    if (existingItem) {
      const updatedItems = cartItems.map(item =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      onCartChange(updatedItems);
    } else {
      onCartChange([...cartItems, cartItem]);
    }

    // Remove from wishlist after adding to cart
    if (onWishlistChange) {
      onWishlistChange(wishlistItems.filter(item => item.id !== wishlistItem.id));
    }
  };

  const handleRemoveFromWishlist = (id: string) => {
    if (onWishlistChange) {
      onWishlistChange(wishlistItems.filter(item => item.id !== id));
    }
  };

  // Calculate totals - these will update whenever the state changes
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalWishlistItems = wishlistItems.length;

  // Categories dropdown timeout handlers
  const handleCategoriesMouseEnter = () => {
    if (categoriesTimeout) {
      clearTimeout(categoriesTimeout);
      setCategoriesTimeout(null);
    }
    setIsCategoriesVisible(true);
  };

  const handleCategoriesMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsCategoriesVisible(false);
    }, 300); // 300ms delay before hiding
    setCategoriesTimeout(timeout);
  };

  const handleCategoriesClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (categoriesTimeout) {
      clearTimeout(categoriesTimeout);
      setCategoriesTimeout(null);
    }
    setIsCategoriesVisible(true);
  };

  // Check if we're in different size ranges
  useEffect(() => {
    const checkTabletSize = () => {
      const width = window.innerWidth;
      setIsTabletSize(width >= 770 && width <= 1440);
    };

    checkTabletSize();
    window.addEventListener('resize', checkTabletSize);
    return () => window.removeEventListener('resize', checkTabletSize);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (categoriesTimeout) {
        clearTimeout(categoriesTimeout);
      }
    };
  }, [categoriesTimeout]);

  // Close search dropdown when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchVisible && !(event.target as Element).closest('.search-dropdown')) {
        setIsSearchVisible(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSearchVisible) {
        setIsSearchVisible(false);
      }
    };

    if (isSearchVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isSearchVisible]);

  // Close search dropdown when mobile menu opens and vice versa
  useEffect(() => {
    if (isMenuOpen) {
      setIsSearchVisible(false);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isSearchVisible) {
      setIsMenuOpen(false);
    }
  }, [isSearchVisible]);

  // Size configurations
  const sizeConfig = {
    xs: {
      height: "h-12",
      logoSize: "h-8",
      iconSize: "h-4 w-4",
      profileIconSize: "h-6 w-6",
      iconSizeShrunken: "h-3 w-3",
      profileIconSizeShrunken: "h-5 w-5",
      textSize: "text-sm",
      textSizeShrunken: "text-xs",
      searchWidth: "w-32 md:w-40",
      searchWidthShrunken: "w-28 md:w-32",
      spacing: "space-x-1 md:space-x-2",
      spacingShrunken: "space-x-1",
      padding: "px-1 py-1 md:px-2",
      inputPadding: "py-1",
      logoScale: "scale-75",
      logoScaleShrunken: "scale-60",
    },
    sm: {
      height: "h-14",
      logoSize: "h-10",
      iconSize: "h-5 w-5",
      profileIconSize: "h-8 w-8",
      iconSizeShrunken: "h-4 w-4",
      profileIconSizeShrunken: "h-6 w-6",
      textSize: "text-sm md:text-base",
      textSizeShrunken: "text-xs md:text-sm",
      searchWidth: "w-36 md:w-70",
      searchWidthShrunken: "w-32 md:w-44",
      spacing: "space-x-1 md:space-x-3",
      spacingShrunken: "space-x-1 md:space-x-2",
      padding: "px-1 py-1 md:px-2",
      inputPadding: "py-1.5",
      logoScale: "scale-85",
      logoScaleShrunken: "scale-70",
    },
    md: {
      height: "h-18",
      logoSize: "h-14",
      iconSize: "h-8 w-8",
      profileIconSize: "h-12 w-12",
      iconSizeShrunken: "h-6 w-6",
      profileIconSizeShrunken: "h-10 w-10",
      textSize: "text-base md:text-xl",
      textSizeShrunken: "text-sm md:text-base",
      searchWidth: "w-48 md:w-72",
      searchWidthShrunken: "w-40 md:w-56",
      spacing: "space-x-2 md:space-x-6",
      spacingShrunken: "space-x-1 md:space-x-3",
      padding: "px-2 py-2 md:px-3",
      inputPadding: "py-2",
      logoScale: "scale-100",
      logoScaleShrunken: "scale-90",
    },
    lg: {
      height: "h-20",
      logoSize: "h-16",
      iconSize: "h-9 w-9",
      profileIconSize: "h-14 w-14",
      iconSizeShrunken: "h-7 w-7",
      profileIconSizeShrunken: "h-11 w-11",
      textSize: "text-lg md:text-2xl",
      textSizeShrunken: "text-base md:text-lg",
      searchWidth: "w-56 md:w-80",
      searchWidthShrunken: "w-48 md:w-64",
      spacing: "space-x-3 md:space-x-8",
      spacingShrunken: "space-x-2 md:space-x-4",
      padding: "px-3 py-2 md:px-4",
      inputPadding: "py-2.5",
      logoScale: "scale-110",
      logoScaleShrunken: "scale-95",
    },
    xl: {
      height: "h-24",
      logoSize: "h-20",
      iconSize: "h-10 w-10",
      profileIconSize: "h-16 w-16",
      iconSizeShrunken: "h-8 w-8",
      profileIconSizeShrunken: "h-12 w-12",
      textSize: "text-xl md:text-3xl",
      textSizeShrunken: "text-lg md:text-xl",
      searchWidth: "w-64 md:w-96",
      searchWidthShrunken: "w-56 md:w-80",
      spacing: "space-x-4 md:space-x-10",
      spacingShrunken: "space-x-3 md:space-x-5",
      padding: "px-4 py-3 md:px-5",
      inputPadding: "py-3",
      logoScale: "scale-125",
      logoScaleShrunken: "scale-105",
    },
  };

  const currentSizeConfig = sizeConfig[size];

  // Throttle scroll events for better performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setIsScrolled(scrollPosition > shrinkThreshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shrinkThreshold]);

  const shouldShrink = enableShrinking && isScrolled;
  const shouldBeTransparent = !enableShrinking && isScrolled && !isNavbarHovered; // Full transparent when shrinking disabled and not hovered

  return (
    <nav
      className={`
        w-full sticky top-0 z-50 navbar-container transition-all duration-300 ease-in-out flex justify-center
        ${
          shouldBeTransparent
            ? "bg-transparent"
            : shouldShrink
            ? "bg-transparent"
            : "shadow-md"
        }
      `}
      style={{
        backgroundColor: shouldBeTransparent ? 'transparent' : shouldShrink ? 'transparent' : '#000308',
        isolation: 'isolate',
        zIndex: 50,
        overflow: 'visible',
      }}
      onMouseEnter={() => setIsNavbarHovered(true)}
      onMouseLeave={() => setIsNavbarHovered(false)}
    >
      <div
        className={`
          px-2 sm:px-4 lg:px-8 transition-all duration-300 ease-in-out
          ${
            shouldBeTransparent
              ? "w-full bg-transparent" // Full transparent when shrinking disabled and not hovered
              : shouldShrink
              ? "w-full sm:w-1/2 backdrop-blur-md sm:rounded-b-2xl sm:mx-auto shadow-lg border border-white/10"
              : "w-full"
          }
        `}
        style={{
          backgroundColor: shouldBeTransparent 
            ? 'transparent' 
            : shouldShrink 
            ? 'rgba(0, 3, 8, 0.2)'
            : '#000308',
          ...((!enableShrinking && isScrolled && isNavbarHovered) && {
            backgroundColor: 'rgba(0, 3, 8, 0.95)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          })
        }}
      >
        <div className={`flex items-center justify-between ${currentSizeConfig.height}`}>
          {/* Left Section - Logo */}
          <div className="flex items-center justify-start flex-shrink-0 min-w-0">
            <div className="flex-shrink-0 flex items-center">
              <img
                src={Images.NavbarLogo}
                alt="Geolex Logo"
                className={`
                  ${currentSizeConfig.logoSize} w-auto transition-all duration-700 ease-in-out max-w-none
                  ${
                    shouldShrink
                      ? `opacity-100 ${currentSizeConfig.logoScaleShrunken}`
                      : `opacity-100 ${currentSizeConfig.logoScale}`
                  }
                `}
              />
            </div>
          </div>

          {/* Center Section - Navigation and Search */}
          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <div
              className={`
              flex items-center justify-center transition-all duration-700 ease-in-out
              ${isTabletSize 
                ? (shouldShrink ? "space-x-2" : "space-x-3") 
                : (shouldShrink ? currentSizeConfig.spacingShrunken : currentSizeConfig.spacing)
              }
            `}
            >
              {/* Navigation Links */}
              <div
                className={`
                flex items-center justify-center transition-all duration-700 ease-in-out
                ${isTabletSize 
                  ? (shouldShrink ? "space-x-2" : "space-x-3") 
                  : (shouldShrink ? currentSizeConfig.spacingShrunken : currentSizeConfig.spacing)
                }
              `}
              >
                <a
                  href="/"
                  className={`
                    ${isTabletSize ? "px-2 py-2" : currentSizeConfig.padding} font-medium transition-all duration-700 whitespace-nowrap flex items-center
                    ${
                      shouldShrink
                        ? `${isTabletSize ? "text-sm" : currentSizeConfig.textSizeShrunken} text-white hover:text-[#13ee9e]`
                        : `${isTabletSize ? "text-base" : currentSizeConfig.textSize} text-white hover:text-[#13ee9e]`
                    }
                  `}
                >
                  Home
                </a>
                
                {/* Categories Dropdown */}
                <div className="relative flex items-center">
                  <div
                    className="relative flex items-center"
                    onMouseEnter={handleCategoriesMouseEnter}
                    onMouseLeave={handleCategoriesMouseLeave}
                  >
                    <a
                      href="/categories"
                      onClick={handleCategoriesClick}
                      className={`
                        ${isTabletSize ? "px-2 py-2" : currentSizeConfig.padding} font-medium transition-all duration-700 whitespace-nowrap cursor-pointer flex items-center
                        ${
                          shouldShrink
                            ? `${isTabletSize ? "text-sm" : currentSizeConfig.textSizeShrunken} text-white hover:text-[#13ee9e]`
                            : `${isTabletSize ? "text-base" : currentSizeConfig.textSize} text-white hover:text-[#13ee9e]`
                        }
                      `}
                    >
                      Categories
                    </a>
                  </div>
                </div>
                
                {/* Categories Dropdown - Fixed positioning spanning full viewport */}
                {isCategoriesVisible && (
                  <div 
                    className="categories-dropdown-container"
                    onMouseEnter={handleCategoriesMouseEnter}
                    onMouseLeave={handleCategoriesMouseLeave}
                    style={{
                      position: 'fixed',
                      top: size === 'sm' ? '56px' : size === 'xs' ? '48px' : size === 'md' ? '72px' : size === 'lg' ? '80px' : '96px',
                      left: '0',
                      width: '100vw',
                      zIndex: 9999,
                      marginTop: '0px',
                    }}
                  >
                    <div className="w-full">
                      <Categories />
                    </div>
                  </div>
                )}
                
                <a
                  href="/about"
                  className={`
                    ${isTabletSize ? "px-2 py-2" : currentSizeConfig.padding} font-medium transition-all duration-700 whitespace-nowrap navbar-links flex items-center
                    ${
                      shouldShrink
                        ? `${isTabletSize ? "text-sm" : currentSizeConfig.textSizeShrunken} text-white hover:text-[#13ee9e]`
                        : `${isTabletSize ? "text-base" : currentSizeConfig.textSize} text-white hover:text-[#13ee9e]`
                    }
                  `}
                >
                  About Us
                </a>
              </div>

              {/* Search Bar - Hidden on screens smaller than 1280px to prevent overlap */}
              <div
                className={`
                hidden xl:flex items-center transition-all duration-700 ease-in-out
                ${isTabletSize 
                  ? (shouldShrink ? "w-40" : "w-48") 
                  : (shouldShrink ? currentSizeConfig.searchWidthShrunken : currentSizeConfig.searchWidth)
                }
              `}
              >
                <div className="relative w-full flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className={`text-gray-400 ${shouldShrink ? "h-4 w-4" : "h-5 w-5"}`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                      text-white block w-full pl-10 pr-3 ${isTabletSize ? "py-2" : (shouldShrink ? currentSizeConfig.inputPadding : currentSizeConfig.inputPadding)} border rounded-lg leading-5 placeholder-gray-400 
                      focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-[#13ee9e] focus:border-[#13ee9e]
                      transition-all duration-700
                      ${
                        shouldBeTransparent
                          ? `${isTabletSize ? "text-sm" : (shouldShrink ? currentSizeConfig.textSizeShrunken : currentSizeConfig.textSize)} border-gray-600/20 bg-gray-800/10`
                          : shouldShrink
                          ? `${isTabletSize ? "text-sm" : currentSizeConfig.textSizeShrunken} border-gray-600/40 bg-gray-800/60 backdrop-blur-sm`
                          : `${isTabletSize ? "text-base" : currentSizeConfig.textSize} border-gray-600 bg-gray-800`
                      }
                    `}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Icons */}
          <div className="flex items-center justify-end flex-shrink-0 min-w-0">
            <div
              className={`
              flex items-center transition-all duration-700 ease-in-out
              ${isTabletSize 
                ? (shouldShrink ? "space-x-1" : "space-x-2") 
                : (shouldShrink ? currentSizeConfig.spacingShrunken : currentSizeConfig.spacing)
              }
            `}
            >
              {/* Search Icon - Visible on screens smaller than xl (1280px) */}
              <button
                className={`
                  xl:hidden p-2 transition-all duration-700 relative search-dropdown
                  text-white hover:text-[#13ee9e]
                `}
                onClick={() => setIsSearchVisible(!isSearchVisible)}
              >
                <MagnifyingGlassIcon
                  className={`
                  transition-all duration-700 ease-in-out
                  ${isTabletSize 
                    ? (shouldShrink ? "h-5 w-5" : "h-6 w-6") 
                    : (shouldShrink ? currentSizeConfig.iconSizeShrunken : currentSizeConfig.iconSize)
                  }
                `}
                />
              </button>

              {/* Wishlist Icon */}
              <div 
                className="relative"
                onMouseEnter={() => setIsWishlistVisible(true)}
                onMouseLeave={() => setIsWishlistVisible(false)}
              >
                <button
                  className={`
                    p-2 transition-all duration-700 relative
                    text-white hover:text-[#13ee9e]
                  `}
                >
                  <HeartIcon
                    className={`
                    transition-all duration-700 ease-in-out
                    ${isTabletSize 
                      ? (shouldShrink ? "h-5 w-5" : "h-6 w-6") 
                      : (shouldShrink ? currentSizeConfig.iconSizeShrunken : currentSizeConfig.iconSize)
                    }
                  `}
                  />
                  {totalWishlistItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {totalWishlistItems}
                    </span>
                  )}
                </button>
                
                {/* Wishlist Dropdown */}
                <WishlistDropdown
                  isVisible={isWishlistVisible}
                  items={wishlistItems}
                  onAddToCart={handleAddToCartFromWishlist}
                  onRemoveItem={handleRemoveFromWishlist}
                  onMouseEnter={() => setIsWishlistVisible(true)}
                  onMouseLeave={() => setIsWishlistVisible(false)}
                />
              </div>

              {/* Cart Icon */}
              <div 
                className="relative"
                onMouseEnter={() => setIsCartVisible(true)}
                onMouseLeave={() => setIsCartVisible(false)}
              >
                <button
                  className={`
                    p-2 transition-all duration-700 relative
                    text-white hover:text-[#13ee9e]
                  `}
                >
                  <ShoppingCartIcon
                    className={`
                    transition-all duration-700 ease-in-out
                    ${isTabletSize 
                      ? (shouldShrink ? "h-5 w-5" : "h-6 w-6") 
                      : (shouldShrink ? currentSizeConfig.iconSizeShrunken : currentSizeConfig.iconSize)
                    }
                  `}
                  />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#13ee9e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {totalCartItems}
                    </span>
                  )}
                </button>

                {/* Cart Dropdown */}
                <CartDropdown
                  isVisible={isCartVisible}
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onMoveToWishlist={handleMoveToWishlist}
                  onClose={() => setIsCartVisible(false)}
                  onMouseEnter={() => setIsCartVisible(true)}
                  onMouseLeave={() => setIsCartVisible(false)}
                />
              </div>

              {/* Profile Icon - Hidden on very small screens to save space */}
              <div className="hidden sm:block">
                <UserProfileDropdown 
                  onSignInClick={() => setIsSignInModalOpen(true)}
                  onSignUpClick={() => setIsSignUpModalOpen(true)} 
                />
              </div>

              {/* Mobile Menu Button - High priority for visibility on small screens */}
              <button
                className={`
                  md:hidden p-1 sm:p-2 transition-all duration-700 flex-shrink-0
                  text-white hover:text-[#13ee9e] border border-transparent hover:border-[#13ee9e]/30 rounded
                `}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown - Appears when search icon is clicked */}
        {isSearchVisible && (
          <div
            className={`
              xl:hidden transition-all duration-300 ease-in-out border-t search-dropdown
              ${
                shouldBeTransparent
                  ? "bg-transparent border-gray-600/20"
                  : shouldShrink
                  ? "backdrop-blur-sm border-white/10"
                  : "border-gray-600"
              }
            `}
            style={{
              backgroundColor: shouldBeTransparent 
                ? 'transparent' 
                : shouldShrink 
                ? 'rgba(0, 3, 8, 0.2)'
                : '#000308'
            }}
          >
            <div className="px-2 sm:px-4 py-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    text-white block w-full pl-10 pr-3 py-2 border rounded-lg leading-5 placeholder-gray-400 
                    focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-[#13ee9e] focus:border-[#13ee9e] text-base
                    transition-all duration-700
                    ${
                      shouldBeTransparent
                        ? "border-gray-600/20 bg-gray-800/10"
                        : shouldShrink
                        ? "border-gray-600/40 bg-gray-800/60"
                        : "border-gray-600 bg-gray-800"
                    }
                  `}
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`
              md:hidden transition-all duration-700
              ${
                shouldBeTransparent
                  ? "bg-transparent"
                  : shouldShrink
                  ? "backdrop-blur-sm border-t border-white/10"
                  : "border-t border-gray-600"
              }
            `}
            style={{
              backgroundColor: shouldBeTransparent 
                ? 'transparent' 
                : shouldShrink 
                ? 'rgba(0, 3, 8, 0.2)'
                : '#000308'
            }}
          >
            <div className="px-1 sm:px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              <a
                href="/"
                className={`
                  block ${currentSizeConfig.padding} ${currentSizeConfig.textSizeShrunken} font-medium whitespace-nowrap navbar-links transition-all duration-700
                  text-white hover:text-[#13ee9e]
                `}
              >
                Home
              </a>
              <a
                href="/about"
                className={`
                  block ${currentSizeConfig.padding} ${currentSizeConfig.textSizeShrunken} font-medium whitespace-nowrap navbar-links transition-all duration-700
                  text-white hover:text-[#13ee9e]
                `}
              >
                About Us
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Authentication Modals */}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
      
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
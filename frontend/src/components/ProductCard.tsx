import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Package, Sparkles, Eye, Gift } from 'lucide-react';
import { toast } from 'react-toastify';
import { createProductSlug } from '../utils/slugify';
import { buildImageUrl } from '../config/api';
import { addToCartUnified } from '../utils/cartUtils';


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId?: number | null;
  productType?: string;
  dynamicOptions?: any[];
  mainImage: string;
  detailedImages?: string[];
  specifications?: { name: string; value: string }[];
  createdAt?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Load wishlist status from localStorage
  useEffect(() => {
    checkWishlistStatus();
  }, [product.id]);

  // Listen for wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = (event: any) => {
      if (event.detail && Array.isArray(event.detail)) {
        setIsInWishlist(event.detail.includes(product.id));
      } else {
        checkWishlistStatus();
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [product.id]);

  const checkWishlistStatus = () => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setIsInWishlist(parsedWishlist.includes(product.id));
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل حالة المفضلة:', error);
      setIsInWishlist(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      let currentWishlist: number[] = [];
      
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          currentWishlist = parsedWishlist;
        }
      }

      let newWishlist: number[];
      if (isInWishlist) {
        // Remove from wishlist
        newWishlist = currentWishlist.filter(id => id !== product.id);
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        newWishlist = [...currentWishlist, product.id];
        setIsInWishlist(true);
      }

      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: newWishlist }));
      
    } catch (error) {
      console.error('خطأ في تحديث المفضلة:', error);
    }
  };

  const isOutOfStock = product.stock <= 0;

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🛒 [ProductCard] addToCart called:', { productId: product.id, quantity });
    
    // Check if product has required options
    if (product.dynamicOptions && product.dynamicOptions.some((opt: any) => opt.required)) {
      console.log('🔄 [ProductCard] Product has required options, redirecting to product page');
      const productPath = `/product/${createProductSlug(product.id, product.name)}`;
      navigate(productPath);
      return;
    }
    
    try {
      const success = await addToCartUnified(
        product.id,
        product.name,
        product.price,
        quantity,
        {}, // selectedOptions
        {}, // optionsPricing
        {}, // attachments
        product // product object
      );
      if (success) {
        console.log('✅ [ProductCard] Product added to cart successfully');
      } else {
        console.log('❌ [ProductCard] Failed to add to cart');
      }
    } catch (error) {
      console.error('❌ [ProductCard] Error in addToCart:', error);
    }
  };

  const increaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productPath = `/product/${createProductSlug(product.id, product.name)}`;
    console.log('🔗 [ProductCard] Navigating to:', productPath);
    navigate(productPath);
  };

  // ---- LIST VIEW ----
  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border border-gray-100 shadow-md sm:shadow-lg overflow-hidden hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="flex flex-col md:flex-row p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 md:gap-6">
          <div className="relative w-full md:w-40 lg:w-48 xl:w-64 h-48 sm:h-56 md:h-64 lg:h-72 flex-shrink-0 bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
            <img
              src={buildImageUrl(product.mainImage)}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-pink-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-md">
              جديد
            </div>
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl">
                <span className="text-white font-semibold bg-red-600 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg text-xs sm:text-sm">
                  نفذت الكمية
                </span>
              </div>
            )}
            <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4">
              <button
                onClick={toggleWishlist}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 touch-button wishlist-button ${
                  isInWishlist 
                    ? 'bg-red-100 hover:bg-red-200' 
                    : 'bg-white hover:bg-gray-100'
                }`}
                type="button"
                aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              >
                <Heart 
                  className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-colors duration-200 ${
                    isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'
                  }`} 
                />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-between min-h-0">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight hover:text-pink-500 transition-colors duration-200">
                {product.name}
              </h3>
              <div className="flex flex-col items-start gap-1 mb-2 sm:mb-3">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                        {product.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400">ر.س</span>
                      <span className="bg-red-500 text-white px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-bold">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">
                        {product.price.toFixed(2)}
                      </span>
                      <span className="text-sm sm:text-base text-gray-600">ر.س</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">
                      {product.price.toFixed(2)}
                    </span>
                    <span className="text-sm sm:text-base text-gray-600">ر.س</span>
                  </div>
                )}
              </div>
              {isOutOfStock && (
                <p className="text-sm sm:text-base font-semibold text-red-600">نفذت الكمية</p>
              )}
            </div>
            
            {!isOutOfStock && (
              <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                {/* Required Options Indicator */}
                {product.dynamicOptions && product.dynamicOptions.some((opt: any) => opt.required) && (
                  <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200 text-center">
                    يتطلب اختيار المقاسات
                  </div>
                )}
                
                {/* Only show quantity controls if product doesn't need required options */}
                {!(product.dynamicOptions && product.dynamicOptions.some((opt: any) => opt.required)) && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold text-sm transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="w-8 sm:w-10 md:w-12 text-center font-semibold text-gray-800 text-sm sm:text-base">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold text-sm transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={addToCart}
                    disabled={false}
                    className={`flex-1 disabled:opacity-50 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm md:text-base shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                      product.dynamicOptions && product.dynamicOptions.some((opt: any) => opt.required)
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-pink-500 hover:bg-pink-600'
                    }`}
                  >
                    {product.dynamicOptions && product.dynamicOptions.some((opt: any) => opt.required) ? (
                      <>
                        <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>اختر المقاسات</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>إضافة للسلة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- GRID VIEW - PROFESSIONAL AND MODERN ----
  return (
    <div 
      className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg sm:shadow-xl overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 sm:duration-500 hover:scale-[1.02] sm:hover:scale-[1.03] w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:w-80 h-auto group relative mx-auto cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 sm:from-pink-500/20 via-transparent to-purple-500/10 sm:to-purple-500/20 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:duration-500 -z-10"></div>
      
      {/* Product Image - Taller for mobile, even taller for desktop */}
      <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={buildImageUrl(product.mainImage)}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 sm:duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center&auto=format,compress&q=60&ixlib=rb-4.0.3';
          }}
        />
        
        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 sm:from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:duration-500"></div>
        
        {/* New Badge - Left side only */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-pink-400/30 z-10">
          جديد
        </div>
        
        {/* Wishlist Button - Top Right Corner - Always Visible - HIGHEST Z-INDEX */}
        <div className="absolute top-2 right-2 z-50">
          <button
            onClick={toggleWishlist}
            className={`w-10 h-10 rounded-full shadow-xl flex items-center justify-center border-2 transition-all duration-200 hover:scale-110 touch-button wishlist-button ${
              isInWishlist 
                ? 'bg-red-100 hover:bg-red-200 border-red-200' 
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
            type="button"
            aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart 
              className={`w-5 h-5 transition-colors duration-200 ${
                isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-700'
              }`} 
            />
          </button>
        </div>
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 sm:bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold bg-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm shadow-lg border border-red-500">
              نفذت الكمية
            </span>
          </div>
        )}
      </div>
      
      {/* Product Info - Smaller padding on mobile */}
      <div className="p-4 sm:p-6 flex flex-col items-center text-center space-y-3 sm:space-y-4">
        {/* Product Name - Smaller on mobile */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-tight hover:text-pink-600 transition-colors duration-300 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.name}
        </h3>
        
        {/* Elegant Divider - Smaller on mobile */}
        <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent w-12 sm:w-16"></div>
        
        {/* Price - Smaller on mobile */}
        <div className="flex flex-col items-center space-y-1 sm:space-y-2">
          {product.originalPrice && product.originalPrice > product.price ? (
            <>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                  {product.originalPrice.toFixed(0)} ر.س
                </span>
                <span className="bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-pink-600">
                {product.price.toFixed(0)} <span className="text-base sm:text-lg text-gray-600">ر.س</span>
              </div>
            </>
          ) : (
            <div className="text-xl sm:text-2xl font-bold text-pink-600">
              {product.price.toFixed(0)} <span className="text-base sm:text-lg text-gray-600">ر.س</span>
            </div>
          )}
          
          {/* Stock Indicator */}
          <div className="text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">متوفر</span>
            ) : (
              <span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">نفذ</span>
            )}
          </div>
        </div>
        
        {isOutOfStock && (
          <p className="text-xs sm:text-sm font-bold text-red-600 bg-red-50 px-2 sm:px-3 py-1 rounded-full">نفذت الكمية</p>
        )}
        
        {/* Required Options Indicator */}
        {product.dynamicOptions && product.dynamicOptions.some((opt: any) => opt.required) && (
          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
            يتطلب اختيار المقاسات
          </div>
        )}
        
        {/* Actions - Smaller on mobile */}
        {!isOutOfStock && (
          <div className="w-full space-y-2 sm:space-y-3 mt-3 sm:mt-4">
            {/* Only show quantity controls if product doesn't need required options */}
            {!(product.dynamicOptions && product.dynamicOptions.some((opt: any) => opt.required)) && (
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold transition-all duration-200 hover:scale-105 sm:hover:scale-110 text-sm sm:text-base"
                >
                  -
                </button>
                <span className="w-10 sm:w-12 text-center font-bold text-gray-800 text-base sm:text-lg bg-gray-50 py-1 rounded-md sm:rounded-lg">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold transition-all duration-200 hover:scale-105 sm:hover:scale-110 text-sm sm:text-base"
                >
                  +
                </button>
              </div>
            )}
            
            <button
              onClick={addToCart}
              disabled={false}
              className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-md sm:shadow-lg disabled:opacity-50 transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg sm:hover:shadow-xl flex items-center justify-center gap-2 ${
                product.dynamicOptions && product.dynamicOptions.some((opt: any) => opt.required)
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border border-blue-400/30 text-white'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border border-pink-400/30 text-white'
              }`}
            >
              {product.dynamicOptions && product.dynamicOptions.some((opt: any) => opt.required) ? (
                <>
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>اختر المقاسات</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>إضافة للسلة</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
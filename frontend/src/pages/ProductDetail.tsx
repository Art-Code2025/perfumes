import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowRight,
  Sparkles,
  Crown,
  Droplets,
  Wind,
  Flower,
  Leaf,
  Gift,
  Award,
  Truck,
  Shield,
  Phone,
  Mail,
  Plus,
  Minus,
  Share2,
  Check,
  Clock,
  Zap,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { productsAPI } from '../utils/api';
import { buildImageUrl } from '../config/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number | null;
  productType?: string;
  dynamicOptions?: any[];
  mainImage: string;
  detailedImages?: string[];
  specifications?: { name: string; value: string }[];
  createdAt?: string;
  rating?: number;
  brand?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('معرف المنتج غير صحيح');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching product with ID:', id);
        
        // Get product by ID
        const productData = await productsAPI.getById(parseInt(id));
        
        if (productData) {
          console.log('✅ Product data loaded:', productData);
          setProduct(productData);
        } else {
          console.log('❌ Product not found');
          setError('المنتج غير موجود');
        }
        
      } catch (error) {
        console.error('❌ Error fetching product:', error);
        setError('حدث خطأ في تحميل المنتج');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    if (product) {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(wishlist.includes(product.id));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">جاري التحميل...</h2>
          <p className="text-gray-600">يتم تحميل تفاصيل المنتج</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">المنتج غير موجود</h2>
          <p className="text-gray-600 mb-6">{error || 'لم يتم العثور على المنتج المطلوب'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get product images
  const productImages = [
    product.mainImage,
    ...(product.detailedImages || [])
  ].filter(Boolean);

  const getScentStrengthDots = (strength: string) => {
    const strengthLevels: Record<string, number> = {
      light: 1,
      medium: 2,
      strong: 3,
      intense: 4
    };
    
    const level = strengthLevels[strength] || 2;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < level ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getScentFamilyIcon = (family?: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'زهري': <Flower className="w-5 h-5 text-pink-500" />,
      'شرقي': <Crown className="w-5 h-5 text-amber-600" />,
      'حمضي': <Leaf className="w-5 h-5 text-green-500" />,
      'خشبي': <Wind className="w-5 h-5 text-amber-600" />,
      'منعش': <Droplets className="w-5 h-5 text-blue-500" />
    };
    
    return family ? iconMap[family] || <Sparkles className="w-5 h-5 text-blue-600" /> : null;
  };

  const handleAddToCart = () => {
    try {
      const existingCart = localStorage.getItem('cartItems');
      let cartItems = existingCart ? JSON.parse(existingCart) : [];
      
      const cartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.mainImage,
        quantity: quantity,
        total: product.price * quantity
      };
      
      const existingItemIndex = cartItems.findIndex((item: any) => 
        item.productId === product.id
      );
      
      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += quantity;
        cartItems[existingItemIndex].total = cartItems[existingItemIndex].price * cartItems[existingItemIndex].quantity;
      } else {
        cartItems.push(cartItem);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      // Dispatch custom event for cart update
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { items: cartItems } 
      }));
      
      toast.success(`تم إضافة ${product.name} إلى السلة!`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('حدث خطأ أثناء إضافة المنتج إلى السلة');
    }
  };

  const handleAddToWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      let newWishlist;
      
      if (isWishlisted) {
        // Remove from wishlist
        newWishlist = wishlist.filter((id: number) => id !== product.id);
        toast.info(`تم إزالة ${product.name} من المفضلة`);
      } else {
        // Add to wishlist
        newWishlist = [...wishlist, product.id];
        toast.success(`تم إضافة ${product.name} إلى المفضلة!`);
      }
      
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsWishlisted(!isWishlisted);
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: newWishlist }));
      
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('حدث خطأ أثناء تحديث المفضلة');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ الرابط!');
    }
  };

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20" dir="rtl">
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
          <ArrowRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-blue-600 transition-colors">المنتجات</Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Product Images */}
          <div className="space-y-6">
            
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-lg">
              <img
                src={buildImageUrl(productImages[selectedImage] || product.mainImage)}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('❌ Image failed to load:', productImages[selectedImage]);
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCAyMDBMMTgwIDE3MEwyMDAgMTkwTDI0MCAyNTBIMTUwVjIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iMjAwIiB5PSIzMDAiIGZpbGw9IiM2QjczODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCI+2YTYpyDYqtmI2KzYryDYtdmI2LHYqTwvdGV4dD4KPC9zdmc+'; 
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.stock > 0 && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    متوفر
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discountPercentage}%
                  </span>
                )}
              </div>

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleAddToWishlist}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 group"
                >
                  <Heart 
                    className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                      isWishlisted 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-400 hover:text-red-500'
                    }`} 
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 group"
                >
                  <Share2 className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors group-hover:scale-110" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-blue-600 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={buildImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCAyMDBMMTgwIDE3MEwyMDAgMTkwTDI0MCAyNTBIMTUwVjIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iMjAwIiB5PSIzMDAiIGZpbGw9IiM2QjczODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCI+2YTYpyDYqtmI2KzYryDYtdmI2LHYqTwvdGV4dD4KPC9zdmc+'; 
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {product.brand || 'FLEUR'}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0) 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-lg font-bold text-gray-900 mr-2">
                    {product.rating || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-blue-600">{product.price} ر.س</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-2xl text-gray-500 line-through ml-3">
                      {product.originalPrice} ر.س
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-bold">
                    وفر {discountPercentage}%
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  {product.stock > 0 ? `متوفر في المخزون (${product.stock} قطعة)` : 'غير متوفر'}
                </span>
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">الكمية:</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  الحد الأقصى: {product.stock} قطعة
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock > 0 ? 'إضافة إلى السلة' : 'غير متوفر'}
            </button>

            {/* Product Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">وصف المنتج:</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">المواصفات:</h3>
                <div className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-700">{spec.name}:</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 
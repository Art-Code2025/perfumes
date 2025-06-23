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
  Zap
} from 'lucide-react';
import { toast } from 'react-toastify';

// Sample product data (in real app, this would come from API)
const sampleProduct = {
  id: '1',
  name: 'زيكو العود الملكي',
  price: 299.99,
  originalPrice: 399.99,
  images: [
    '/api/placeholder/600/800',
    '/api/placeholder/600/800',
    '/api/placeholder/600/800',
    '/api/placeholder/600/800'
  ],
  category: 'رجالي',
  rating: 4.8,
  reviewCount: 124,
  inStock: true,
  isNew: true,
  isLuxury: true,
  brand: 'زيكو',
  scentFamily: 'شرقي',
  description: 'عطر فاخر يجمع بين أرقى أنواع العود والمسك الأبيض، مصمم خصيصاً للرجل الذي يقدر الفخامة والأناقة. يتميز بثباته الطويل وانتشاره القوي، مما يجعله الخيار الأمثل للمناسبات الرسمية والسهرات الخاصة.',
  fragranceNotes: {
    top: ['العود الكمبودي', 'الورد الدمشقي', 'البرغموت'],
    middle: ['الياسمين الهندي', 'المسك الأبيض', 'العنبر الرمادي'],
    base: ['خشب الصندل', 'العنبر الأسود', 'الباتشولي']
  },
  scentStrength: 'intense' as const,
  sizes: [
    { size: '50ml', price: 199.99, originalPrice: 249.99 },
    { size: '100ml', price: 299.99, originalPrice: 399.99 },
    { size: '200ml', price: 449.99, originalPrice: 599.99 }
  ],
  concentration: 'Parfum',
  longevity: '8-12 ساعة',
  sillage: 'قوي',
  seasonRecommendation: ['شتاء', 'خريف'],
  occasionRecommendation: ['مناسبات رسمية', 'سهرات', 'أعراس'],
  ingredients: [
    'عود كمبودي طبيعي 100%',
    'مسك أبيض خالص',
    'زيوت عطرية طبيعية',
    'كحول عطري فاخر'
  ],
  careInstructions: [
    'يحفظ في مكان بارد وجاف',
    'يبعد عن أشعة الشمس المباشرة',
    'يرج قبل الاستخدام',
    'للاستخدام الخارجي فقط'
  ]
};

const relatedProducts = [
  {
    id: '2',
    name: 'زيكو روز الذهبي',
    price: 249.99,
    originalPrice: 329.99,
    image: '/api/placeholder/300/400',
    rating: 4.9,
    isLuxury: true
  },
  {
    id: '3',
    name: 'زيكو عنبر الليل',
    price: 349.99,
    image: '/api/placeholder/300/400',
    rating: 4.7,
    isLuxury: true
  },
  {
    id: '4',
    name: 'زيكو مسك الأميرة',
    price: 279.99,
    image: '/api/placeholder/300/400',
    rating: 4.8,
    isLuxury: true
  }
];

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product] = useState(sampleProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]); // Default to 100ml
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

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
              i < level ? 'bg-zico-primary' : 'bg-beige-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getScentFamilyIcon = (family?: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'زهري': <Flower className="w-5 h-5 text-pink-500" />,
      'شرقي': <Crown className="w-5 h-5 text-zico-gold" />,
      'حمضي': <Leaf className="w-5 h-5 text-green-500" />,
      'خشبي': <Wind className="w-5 h-5 text-amber-600" />,
      'منعش': <Droplets className="w-5 h-5 text-blue-500" />
    };
    
    return family ? iconMap[family] || <Sparkles className="w-5 h-5 text-zico-primary" /> : null;
  };

  const handleAddToCart = () => {
    try {
      const existingCart = localStorage.getItem('cartItems');
      let cartItems = existingCart ? JSON.parse(existingCart) : [];
      
      const cartItem = {
        id: product.id,
        name: product.name,
        price: selectedSize.price,
        image: product.images[0],
        quantity: quantity,
        size: selectedSize.size,
        concentration: product.concentration
      };
      
      const existingItemIndex = cartItems.findIndex((item: any) => 
        item.id === product.id && item.size === selectedSize.size
      );
      
      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push(cartItem);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      // Dispatch custom event for cart update
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { items: cartItems } 
      }));
      
      toast.success(`تم إضافة ${product.name} (${selectedSize.size}) إلى السلة!`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('حدث خطأ أثناء إضافة المنتج إلى السلة');
    }
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? 'تم حذف المنتج من المفضلة' : 'تم إضافة المنتج إلى المفضلة!',
      {
        position: "bottom-right",
        autoClose: 2000,
      }
    );
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

  const discountPercentage = selectedSize.originalPrice 
    ? Math.round(((selectedSize.originalPrice - selectedSize.price) / selectedSize.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zico-cream to-beige-50 pt-20">
      
      {/* Breadcrumb */}
      <div className="container-responsive py-6">
        <nav className="flex items-center gap-2 text-sm text-beige-600">
          <Link to="/" className="hover:text-zico-primary transition-colors">الرئيسية</Link>
          <ArrowRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-zico-primary transition-colors">المنتجات</Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="container-responsive pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Product Images */}
          <div className="space-y-6">
            
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-zico-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    جديد
                  </span>
                )}
                {product.isLuxury && (
                  <span className="luxury-badge flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    فاخر
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
                  <Share2 className="w-5 h-5 text-gray-400 hover:text-zico-primary transition-colors group-hover:scale-110" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-zico-primary shadow-lg' 
                      : 'border-beige-200 hover:border-beige-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain bg-white p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-beige-600 uppercase tracking-wide">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1">
                  {getScentFamilyIcon(product.scentFamily)}
                  <span className="text-sm text-beige-600">{product.scentFamily}</span>
                </div>
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
                        i < Math.floor(product.rating) 
                          ? 'text-zico-gold fill-zico-gold' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-lg font-bold text-gray-900 mr-2">
                    {product.rating}
                  </span>
                </div>
                <span className="text-beige-600">
                  ({product.reviewCount} تقييم)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-beige-50 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-zico-primary">
                    {selectedSize.price.toFixed(2)} ر.س
                  </span>
                  {selectedSize.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {selectedSize.originalPrice.toFixed(2)} ر.س
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
                <span className="font-medium">متوفر في المخزون</span>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">اختر الحجم:</h3>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                      selectedSize.size === size.size
                        ? 'border-zico-primary bg-zico-primary/10'
                        : 'border-beige-300 hover:border-beige-400'
                    }`}
                  >
                    <div className="font-bold text-gray-900">{size.size}</div>
                    <div className="text-sm text-zico-primary font-medium">
                      {size.price.toFixed(0)} ر.س
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">الكمية:</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-beige-100 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-beige-200 rounded-r-xl transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-beige-200 rounded-l-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-beige-600">
                  الإجمالي: <span className="font-bold text-zico-primary">
                    {(selectedSize.price * quantity).toFixed(2)} ر.س
                  </span>
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full btn-zico py-4 text-lg flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                أضف إلى السلة
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="btn-zico-outline py-3 flex items-center justify-center gap-2">
                  <Gift className="w-5 h-5" />
                  اشتري كهدية
                </button>
                <button className="btn-zico-outline py-3 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  اشتري الآن
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-6 bg-white rounded-2xl p-6 shadow-zico">
              <div className="text-center">
                <Clock className="w-8 h-8 text-zico-primary mx-auto mb-2" />
                <div className="font-bold text-gray-900">الثبات</div>
                <div className="text-sm text-beige-600">{product.longevity}</div>
              </div>
              <div className="text-center">
                <Wind className="w-8 h-8 text-zico-primary mx-auto mb-2" />
                <div className="font-bold text-gray-900">الإنتشار</div>
                <div className="text-sm text-beige-600">{product.sillage}</div>
              </div>
            </div>

            {/* Scent Strength */}
            <div className="bg-white rounded-2xl p-6 shadow-zico">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">قوة العطر:</span>
                {getScentStrengthDots(product.scentStrength)}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-3xl shadow-zico-lg overflow-hidden mb-16">
          
          {/* Tab Headers */}
          <div className="flex border-b border-beige-200">
            {[
              { id: 'description', label: 'الوصف', icon: <Sparkles className="w-5 h-5" /> },
              { id: 'notes', label: 'النوتات العطرية', icon: <Flower className="w-5 h-5" /> },
              { id: 'ingredients', label: 'المكونات', icon: <Leaf className="w-5 h-5" /> },
              { id: 'care', label: 'تعليمات العناية', icon: <Shield className="w-5 h-5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-zico-primary border-b-2 border-zico-primary bg-zico-primary/5'
                    : 'text-gray-600 hover:text-zico-primary hover:bg-beige-50'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">وصف المنتج</h3>
                <p className="text-lg text-beige-700 leading-relaxed">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-zico-gold" />
                      مناسب للمواسم
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.seasonRecommendation.map((season) => (
                        <span key={season} className="fragrance-note">{season}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-zico-primary" />
                      مناسب للمناسبات
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.occasionRecommendation.map((occasion) => (
                        <span key={occasion} className="fragrance-note">{occasion}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">النوتات العطرية</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                      النوتات العلوية (Top Notes)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.fragranceNotes.top.map((note) => (
                        <span key={note} className="fragrance-note bg-yellow-100 text-yellow-700">{note}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"></div>
                      النوتات الوسطى (Heart Notes)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.fragranceNotes.middle.map((note) => (
                        <span key={note} className="fragrance-note bg-pink-100 text-pink-700">{note}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full"></div>
                      النوتات القاعدية (Base Notes)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.fragranceNotes.base.map((note) => (
                        <span key={note} className="fragrance-note bg-amber-100 text-amber-700">{note}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">المكونات</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-beige-50 rounded-xl">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">تعليمات العناية</h3>
                <div className="space-y-4">
                  {product.careInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-bold luxury-heading mb-8 text-center">
            منتجات ذات صلة
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                className="perfume-card group"
              >
                <div className="perfume-bottle-container relative p-6">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-contain transition-all duration-500 group-hover:scale-105"
                  />
                  {relatedProduct.isLuxury && (
                    <div className="absolute top-3 left-3">
                      <span className="luxury-badge flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        فاخر
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                    {relatedProduct.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(relatedProduct.rating) 
                            ? 'text-zico-gold fill-zico-gold' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-zico-primary">
                        {relatedProduct.price.toFixed(2)} ر.س
                      </span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {relatedProduct.originalPrice.toFixed(2)} ر.س
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 
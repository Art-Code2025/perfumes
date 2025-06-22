import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Gift, 
  Truck, 
  Clock, 
  Star,
  Plus,
  Minus,
  X,
  ArrowRight,
  ArrowLeft,
  Package,
  Shield,
  Heart,
  Zap,
  Phone,
  Mail,
  Home,
  Calendar,
  Award,
  Percent,
  Calculator,
  Edit3,
  Trash2
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  category?: string;
  originalPrice?: number;
  discount?: number;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  buildingNumber?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
}

interface ShippingZone {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  regions: string[];
  icon?: string;
  color?: string;
  freeShippingThreshold?: number;
}

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed' | 'freeShipping';
  value: number;
  minAmount: number;
  maxDiscount?: number;
  description: string;
  validUntil?: string;
  category?: string;
  isActive: boolean;
}

const Checkout: React.FC = () => {
  console.log('🚀 [Checkout] Component starting to load...');
  
  // All state declarations first
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  console.log('🔧 [Checkout] Initial state set up complete');
  
  // All state hooks
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    buildingNumber: '',
    floor: '',
    apartment: '',
    landmark: ''
  });
  const [selectedShippingZone, setSelectedShippingZone] = useState<ShippingZone | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cod' | 'bank'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [preferredDeliveryTime, setPreferredDeliveryTime] = useState('');

  // Static data
  const shippingZones: ShippingZone[] = [
    {
      id: 'riyadh-express',
      name: 'الرياض - توصيل سريع',
      price: 25,
      estimatedDays: 'خلال 24 ساعة',
      regions: ['الرياض', 'riyadh'],
      icon: '🚀',
      color: 'from-blue-500 to-purple-500',
      freeShippingThreshold: 300
    },
    {
      id: 'riyadh-standard',
      name: 'الرياض - توصيل عادي',
      price: 15,
      estimatedDays: '2-3 أيام',
      regions: ['الرياض', 'riyadh'],
      icon: '🚚',
      color: 'from-green-500 to-blue-500',
      freeShippingThreshold: 200
    },
    {
      id: 'jeddah',
      name: 'جدة ومكة المكرمة',
      price: 30,
      estimatedDays: '3-4 أيام',
      regions: ['جدة', 'مكة', 'jeddah', 'mecca'],
      icon: '🕌',
      color: 'from-purple-500 to-pink-500',
      freeShippingThreshold: 350
    },
    {
      id: 'dammam',
      name: 'الدمام والخبر',
      price: 35,
      estimatedDays: '4-5 أيام',
      regions: ['الدمام', 'الخبر', 'dammam', 'khobar'],
      icon: '🏢',
      color: 'from-orange-500 to-red-500',
      freeShippingThreshold: 400
    },
    {
      id: 'other',
      name: 'باقي المناطق',
      price: 45,
      estimatedDays: '5-7 أيام',
      regions: ['other'],
      icon: '📦',
      color: 'from-gray-500 to-gray-600',
      freeShippingThreshold: 500
    }
  ];

  const availableCoupons: Coupon[] = [
    {
      code: 'WELCOME15',
      type: 'percentage',
      value: 15,
      minAmount: 100,
      maxDiscount: 50,
      description: 'خصم 15% للعملاء الجدد (حتى 50 ريال)',
      validUntil: '2024-12-31',
      isActive: true
    },
    {
      code: 'SAVE100',
      type: 'fixed',
      value: 100,
      minAmount: 500,
      description: 'خصم 100 ريال عند الشراء بـ 500 ريال أو أكثر',
      validUntil: '2024-12-31',
      isActive: true
    },
    {
      code: 'FREESHIP',
      type: 'freeShipping',
      value: 0,
      minAmount: 200,
      description: 'شحن مجاني للطلبات أكثر من 200 ريال',
      validUntil: '2024-12-31',
      isActive: true
    }
  ];

  // Load cart data
  useEffect(() => {
    const loadCartData = () => {
      console.log('🔄 [Checkout] Loading cart data...');
      setIsLoadingCart(true);
      
      try {
        // Try 'cartItems' first (new key), then 'cart' (old key) as fallback
        let savedCart = localStorage.getItem('cartItems');
        let keyUsed = 'cartItems';
        
        if (!savedCart || savedCart === 'null' || savedCart === 'undefined') {
          savedCart = localStorage.getItem('cart');
          keyUsed = 'cart';
          console.log('💾 [Checkout] Fallback to old cart key');
        }
        
        console.log('💾 [Checkout] Raw cart data from', keyUsed, ':', savedCart);
        
        if (savedCart && savedCart !== 'null' && savedCart !== 'undefined') {
          const parsedCart = JSON.parse(savedCart);
          console.log('📦 [Checkout] Parsed cart:', parsedCart);
          
          // Handle different cart data formats
          let cartData = [];
          
          if (Array.isArray(parsedCart)) {
            cartData = parsedCart;
          } else if (parsedCart.items && Array.isArray(parsedCart.items)) {
            cartData = parsedCart.items;
          } else if (typeof parsedCart === 'object') {
            cartData = Object.values(parsedCart).filter((item: any) => 
              item && typeof item === 'object' && item.id
            );
          }
          
          // Convert cart data to standard format
          const standardizedCart = cartData.map((item: any) => {
            // Handle different data structures
            const product = item.product || item;
            const name = product.name || product.title || item.name || item.title || 'منتج';
            const price = parseFloat(product.price || item.price || 0);
            const image = product.image || product.images?.[0] || item.image || item.images?.[0] || product.mainImage;
            
            return {
              id: String(product.id || item.id || item.productId || Math.random()),
              name,
              price,
              quantity: parseInt(item.quantity || 1),
              image,
              size: item.selectedOptions?.size || item.size,
              category: product.category || item.category,
              originalPrice: product.originalPrice || item.originalPrice,
              discount: product.discount || item.discount
            };
          }).filter((item: CartItem) => item.id && item.name && item.price > 0);
          
          console.log('✅ [Checkout] Standardized cart:', standardizedCart);
          setCartItems(standardizedCart);
          
          if (standardizedCart.length === 0) {
            console.log('⚠️ [Checkout] Cart is empty after processing');
          }
        } else {
          console.log('❌ [Checkout] No cart data found in localStorage');
          setCartItems([]);
        }
      } catch (error) {
        console.error('💥 [Checkout] Error loading cart:', error);
        setCartItems([]);
      } finally {
        setIsLoadingCart(false);
      }
    };

    loadCartData();

    // Listen for cart updates
    const handleCartUpdate = (event: any) => {
      console.log('🔄 [Checkout] Cart update event received:', event);
      loadCartData();
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'cartItems' || event.key === 'cart') {
        console.log('💾 [Checkout] localStorage cart changed for key:', event.key);
        loadCartData();
      }
    };

    // Add event listeners
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 0;
  const couponDiscount = appliedCoupon ? (
    appliedCoupon.type === 'percentage' 
      ? Math.min(subtotal * (appliedCoupon.value / 100), appliedCoupon.maxDiscount || Infinity)
      : appliedCoupon.value
  ) : 0;
  const freeShipping = true;
  const finalShippingCost = 0;
  const total = subtotal - couponDiscount + finalShippingCost;

  const updateQuantity = (itemId: string, size: string | undefined, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId && item.size === size) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      
      return updatedItems;
    });
  };

  const removeItem = (itemId: string, size: string | undefined) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => 
        !(item.id === itemId && item.size === size)
      );
      
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      
      return updatedItems;
    });
    
    toast.success('تم حذف المنتج من السلة');
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 2) {
      if (!userData.name.trim()) newErrors.name = 'الاسم مطلوب';
      if (!userData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
      if (!userData.address.trim()) newErrors.address = 'العنوان مطلوب';
      if (!userData.city.trim()) newErrors.city = 'المدينة مطلوبة';
    }
    
    if (step === 4) {
      if (!agreeToTerms) newErrors.terms = 'يجب الموافقة على الشروط والأحكام';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    
    try {
      const coupon = availableCoupons.find(c => 
        c.code === couponCode && c.isActive
      );
      
      if (!coupon) {
        toast.error('كود الخصم غير صحيح أو منتهي الصلاحية');
        return;
      }
      
      if (subtotal < coupon.minAmount) {
        toast.error(`الحد الأدنى للطلب ${coupon.minAmount} ريال`);
        return;
      }
      
      setAppliedCoupon(coupon);
      toast.success('تم تطبيق كود الخصم بنجاح!');
      setCouponCode('');
    } catch (error) {
      toast.error('حدث خطأ في تطبيق كود الخصم');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info('تم إلغاء كود الخصم');
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setLoading(true);
    
    try {
      const orderData = {
        items: cartItems,
        userData,
        shippingZone: selectedShippingZone,
        paymentMethod: selectedPaymentMethod,
        appliedCoupon,
        totals: {
          subtotal,
          couponDiscount,
          shippingCost: finalShippingCost,
          total
        },
        isGift,
        giftMessage,
        orderNotes,
        preferredDeliveryTime
      };

      console.log('📦 [Checkout] Submitting order:', orderData);

      const response = await fetch('/.netlify/functions/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('فشل في إرسال الطلب');
      }

      const result = await response.json();
      console.log('✅ [Checkout] Order submitted successfully:', result);

      // Clear cart
      localStorage.removeItem('cartItems');
      setCartItems([]);

      // Navigate to thank you page
      navigate('/thank-you', { 
        state: { order: result.order },
        replace: true 
      });

      toast.success('تم إرسال طلبك بنجاح!');
    } catch (error) {
      console.error('💥 [Checkout] Order submission error:', error);
      toast.error('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Handle empty cart case
  if (!isLoadingCart && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-12">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-6">
                السلة فارغة
              </h1>
              <p className="text-gray-600 text-xl mb-12 leading-relaxed">
                لا توجد منتجات في سلة التسوق حالياً.<br />
                يرجى إضافة بعض المنتجات أولاً لإتمام الطلب.
              </p>
              <div className="space-y-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-xl shadow-2xl transform hover:scale-105 hover:shadow-3xl"
                >
                  <ArrowRight size={28} />
                  ابدأ التسوق الآن
                </Link>
                <div>
                  <Link
                    to="/cart"
                    className="text-gray-500 hover:text-gray-700 transition-colors underline text-lg"
                  >
                    العودة إلى السلة
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoadingCart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl font-medium">جاري تحميل بيانات السلة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-30" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            العودة للتسوق
          </button>
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <ShoppingCart className="w-6 h-6" />
            إتمام الطلب
          </div>
          <div className="w-6 h-6"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-12">
            
            {/* Order Summary Sidebar – يظهر يسار الشاشة الكبيرة */}
            <div className="order-2 xl:order-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-black p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">ملخص الطلب</h3>
                    <p className="text-gray-300">تفاصيل طلبك النهائية</p>
                  </div>

                  <div className="p-8">
                    {/* Coupon Section */}
                    {!appliedCoupon && (
                      <div className="mb-8">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="كود الخصم"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                            disabled={couponLoading}
                          />
                          <button
                            onClick={applyCoupon}
                            disabled={!couponCode.trim() || couponLoading}
                            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 font-bold"
                          >
                            {couponLoading ? '...' : 'تطبيق'}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {appliedCoupon && (
                      <div className="mb-8 p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Gift className="text-green-600" size={24} />
                            <div>
                              <p className="font-bold text-green-800">{appliedCoupon.code}</p>
                              <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={removeCoupon}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Price Breakdown */}
                    <div className="space-y-6 mb-8">
                      <div className="flex justify-between text-base">
                        <span className="text-gray-600">المجموع الفرعي</span>
                        <span className="font-bold text-gray-900">{subtotal.toFixed(2)} ر.س</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-base text-green-600">
                          <span>الخصم</span>
                          <span className="font-bold">-{couponDiscount.toFixed(2)} ر.س</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base">
                        <span className="text-gray-600">الشحن</span>
                        <span className={freeShipping ? 'font-bold text-green-600' : 'font-bold text-gray-900'}>
                          {freeShipping ? 'مجاني' : `${finalShippingCost.toFixed(2)} ر.س`}
                        </span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">الإجمالي</span>
                          <span className="text-2xl font-bold text-gray-900">{total.toFixed(2)} ر.س</span>
                        </div>
                      </div>
                    </div>

                    {/* زر الإتمام */}
                    <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
                      {currentStep > 1 ? (
                        <button
                          onClick={prevStep}
                          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                        >
                          <ArrowRight className="w-5 h-5" />
                          السابق
                        </button>
                      ) : <span />}

                      {currentStep < 4 ? (
                        <button
                          onClick={nextStep}
                          className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-bold"
                        >
                          التالي
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={loading || !agreeToTerms}
                          className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-bold disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              جاري الإرسال...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              تأكيد الطلب
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="order-1 xl:order-2">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                
                {/* Step 1: Order Review */}
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <ShoppingCart className="text-white" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">مراجعة طلبك</h2>
                      <p className="text-gray-600 text-lg">{cartItems.length} منتج في السلة</p>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <div 
                        key={`${item.id}-${item.size || 'default'}`}
                        className="group relative bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <div className="flex items-center gap-6">
                          {/* Product Image */}
                          {item.image && (
                            <div className="relative">
                              <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white/50">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                              </div>
                              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-xl animate-bounce">
                                {item.quantity}
                              </div>
                              {item.discount && (
                                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-xl animate-pulse">
                                  -{item.discount}%
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-2xl mb-3 group-hover:text-purple-600 transition-colors duration-300">
                              {item.name}
                            </h4>
                            {item.size && (
                              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-sm text-purple-700 mb-4 font-medium">
                                <Package size={16} />
                                الحجم: {item.size}
                              </div>
                            )}
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-2 border border-gray-200/50 shadow-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 shadow-lg hover:from-red-600 hover:to-pink-600 text-white transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={20} />
                                </button>
                                <span className="w-16 text-center font-bold text-xl text-gray-800">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                                >
                                  <Plus size={20} />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeItem(item.id, item.size)}
                                className="p-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                                title="حذف المنتج"
                              >
                                <Trash2 size={22} />
                              </button>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <div className="space-y-2">
                              {item.originalPrice && item.originalPrice > item.price && (
                                <p className="text-lg text-gray-400 line-through">
                                  {(item.originalPrice * item.quantity).toFixed(2)} ريال
                                </p>
                              )}
                              <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                {(item.price * item.quantity).toFixed(2)} ريال
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.price.toFixed(2)} ريال × {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Information Form */}
                <div className="border-t border-gray-100 p-8 bg-gray-50">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="text-white" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">بيانات التوصيل</h2>
                      <p className="text-gray-600 text-lg">أدخل بياناتك لإتمام التوصيل</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">الاسم الكامل *</label>
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 hover:shadow-lg"
                        placeholder="أدخل اسمك الكامل"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-2 animate-pulse">{errors.name}</p>}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">رقم الهاتف *</label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 hover:shadow-lg"
                        placeholder="05xxxxxxxx"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-2 animate-pulse">{errors.phone}</p>}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 hover:shadow-lg"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">المدينة *</label>
                      <select
                        value={userData.city}
                        onChange={(e) => setUserData({...userData, city: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 hover:shadow-lg"
                      >
                        <option value="">اختر المدينة</option>
                        <option value="الرياض">الرياض</option>
                        <option value="جدة">جدة</option>
                        <option value="مكة">مكة المكرمة</option>
                        <option value="الدمام">الدمام</option>
                        <option value="الخبر">الخبر</option>
                        <option value="المدينة">المدينة المنورة</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                      {errors.city && <p className="text-red-500 text-sm mt-2 animate-pulse">{errors.city}</p>}
                    </div>

                    <div className="md:col-span-2 group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">العنوان التفصيلي *</label>
                      <textarea
                        value={userData.address}
                        onChange={(e) => setUserData({...userData, address: e.target.value})}
                        rows={3}
                        className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 resize-none hover:shadow-lg"
                        placeholder="أدخل العنوان التفصيلي (الحي، الشارع، رقم المبنى)"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-2 animate-pulse">{errors.address}</p>}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8">طريقة الدفع</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                          selectedPaymentMethod === 'cod'
                            ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-2xl scale-105'
                            : 'border-gray-200/50 bg-white/70 hover:border-emerald-300 hover:shadow-xl'
                        }`}
                        onClick={() => setSelectedPaymentMethod('cod')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Truck className="text-white" size={28} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">الدفع عند الاستلام</h4>
                            <p className="text-sm text-gray-600">ادفع نقداً عند وصول الطلب</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'cod' && (
                          <div className="absolute top-4 left-4 animate-bounce">
                            <CheckCircle className="text-emerald-500" size={24} />
                          </div>
                        )}
                      </div>
                      
                      <div
                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                          selectedPaymentMethod === 'bank'
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-2xl scale-105'
                            : 'border-gray-200/50 bg-white/70 hover:border-blue-300 hover:shadow-xl'
                        }`}
                        onClick={() => setSelectedPaymentMethod('bank')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <CreditCard className="text-white" size={28} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">تحويل بنكي</h4>
                            <p className="text-sm text-gray-600">تحويل إلى الحساب البنكي</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'bank' && (
                          <div className="absolute top-4 left-4 animate-bounce">
                            <CheckCircle className="text-blue-500" size={24} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="mt-12">
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-3xl border border-gray-200/50 backdrop-blur-sm">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 w-6 h-6 text-purple-600 border-gray-300 rounded-lg focus:ring-purple-500 focus:ring-4"
                      />
                      <label htmlFor="terms" className="text-gray-700 leading-relaxed text-lg">
                        أوافق على <Link to="/privacy-policy" className="text-purple-600 hover:text-purple-800 font-bold hover:underline transition-colors">الشروط والأحكام</Link> و
                        <Link to="/return-policy" className="text-purple-600 hover:text-purple-800 font-bold hover:underline transition-colors"> سياسة الإرجاع</Link>
                      </label>
                    </div>
                    {errors.terms && <p className="text-red-500 text-sm mt-2 animate-pulse">{errors.terms}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes animate-gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-x {
          animation: animate-gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Checkout;

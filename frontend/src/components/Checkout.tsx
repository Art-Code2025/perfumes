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
      // اسم العميل
      if (!userData.name.trim()) {
        newErrors.name = 'الاسم مطلوب';
      } else if (userData.name.trim().length < 2) {
        newErrors.name = 'الاسم يجب أن يكون على الأقل حرفين';
      } else if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(userData.name.trim())) {
        newErrors.name = 'الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط';
      }
      
      // رقم الهاتف
      if (!userData.phone.trim()) {
        newErrors.phone = 'رقم الهاتف مطلوب';
      } else if (!/^(05|5)[0-9]{8}$/.test(userData.phone.replace(/\s|-/g, ''))) {
        newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام';
      }
      
      // البريد الإلكتروني (اختياري لكن إذا تم إدخاله يجب أن يكون صحيح)
      if (userData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email.trim())) {
        newErrors.email = 'البريد الإلكتروني غير صحيح';
      }
      
      // المدينة
      if (!userData.city.trim()) {
        newErrors.city = 'المدينة مطلوبة';
      }
      
      // العنوان
      if (!userData.address.trim()) {
        newErrors.address = 'العنوان مطلوب';
      } else if (userData.address.trim().length < 10) {
        newErrors.address = 'العنوان يجب أن يكون مفصل أكثر (على الأقل 10 أحرف)';
      }
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

      // محاكاة إرسال الطلب
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // إنشاء بيانات الطلب المحاكية
      const result = {
        order: {
          id: `MW${Date.now().toString().slice(-6)}`,
          orderNumber: `MW${Date.now().toString().slice(-6)}`,
          items: cartItems,
          userData,
          paymentMethod: selectedPaymentMethod,
          total,
          estimatedDelivery: 'خلال 2-3 أيام عمل',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      };
      
      console.log('✅ [Checkout] Order created successfully:', result);

      // Clear cart
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cart'); // إزالة المفتاح القديم أيضاً
      setCartItems([]);
      
      // إرسال حدث تحديث السلة
      window.dispatchEvent(new CustomEvent('cartUpdated'));

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
                            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 font-bold whitespace-nowrap min-w-[80px]"
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
                
                {/* Step Indicator */}
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center justify-between max-w-2xl mx-auto">
                    {[
                      { step: 1, title: 'مراجعة الطلب', icon: ShoppingCart },
                      { step: 2, title: 'بيانات التوصيل', icon: User },
                      { step: 3, title: 'طريقة الدفع', icon: CreditCard },
                      { step: 4, title: 'تأكيد الطلب', icon: CheckCircle }
                    ].map(({ step, title, icon: Icon }, index) => (
                      <div key={step} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                            currentStep === step 
                              ? 'bg-black border-black text-white' 
                              : currentStep > step 
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'bg-white border-gray-300 text-gray-400'
                          }`}>
                            <Icon size={20} />
                          </div>
                          <span className={`text-sm mt-2 font-medium ${
                            currentStep === step ? 'text-black' : 'text-gray-500'
                          }`}>
                            {title}
                          </span>
                        </div>
                        {index < 3 && (
                          <div className={`w-16 h-0.5 mx-4 ${
                            currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 1: Order Review */}
                {currentStep === 1 && (
                  <div className="p-4 lg:p-6 xl:p-8">
                    <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-black rounded-xl lg:rounded-2xl flex items-center justify-center">
                        <ShoppingCart className="text-white" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">مراجعة طلبك</h2>
                        <p className="text-gray-600 text-sm lg:text-base xl:text-lg">{cartItems.length} منتج في السلة</p>
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-4 lg:space-y-6">
                      {cartItems.map((item, index) => (
                        <div 
                          key={`${item.id}-${item.size || 'default'}`}
                          className="bg-gray-50 lg:bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-center gap-3 lg:gap-4 xl:gap-6">
                            {/* Product Image */}
                            {item.image && (
                              <div className="relative">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-lg lg:rounded-xl overflow-hidden">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-black text-white rounded-full w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center text-xs lg:text-sm font-bold">
                                  {item.quantity}
                                </div>
                              </div>
                            )}
                            
                            {/* Product Details */}
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-base lg:text-lg xl:text-xl mb-1 lg:mb-2">
                                {item.name}
                              </h4>
                              {item.size && (
                                <div className="inline-flex items-center gap-1 lg:gap-2 bg-gray-100 px-2 lg:px-3 py-1 rounded-md lg:rounded-lg text-xs lg:text-sm text-gray-700 mb-2 lg:mb-3">
                                  <Package size={12} className="lg:w-3.5 lg:h-3.5" />
                                  الحجم: {item.size}
                                </div>
                              )}
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 lg:gap-3">
                                <div className="flex items-center gap-1 lg:gap-2 bg-gray-50 rounded-md lg:rounded-lg p-1">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                    className="w-6 h-6 lg:w-8 lg:h-8 rounded-sm lg:rounded-md bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={12} className="lg:w-4 lg:h-4" />
                                  </button>
                                  <span className="w-8 lg:w-12 text-center font-bold text-sm lg:text-base text-gray-900">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                    className="w-6 h-6 lg:w-8 lg:h-8 rounded-sm lg:rounded-md bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                                  >
                                    <Plus size={12} className="lg:w-4 lg:h-4" />
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => removeItem(item.id, item.size)}
                                  className="p-1 lg:p-2 text-red-500 hover:bg-red-50 rounded-md lg:rounded-lg transition-colors"
                                  title="حذف المنتج"
                                >
                                  <Trash2 size={14} className="lg:w-4 lg:h-4" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Price */}
                            <div className="text-right">
                              <div className="space-y-0.5 lg:space-y-1">
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <p className="text-xs lg:text-sm text-gray-400 line-through">
                                    {(item.originalPrice * item.quantity).toFixed(2)} ر.س
                                  </p>
                                )}
                                <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                                  {(item.price * item.quantity).toFixed(2)} ر.س
                                </p>
                                <p className="text-xs lg:text-sm text-gray-500">
                                  {item.price.toFixed(2)} ر.س × {item.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Customer Information */}
                {currentStep === 2 && (
                  <div className="p-4 lg:p-6 xl:p-8 bg-gray-50">
                    <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-black rounded-xl lg:rounded-2xl flex items-center justify-center">
                        <User className="text-white" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">بيانات التوصيل</h2>
                        <p className="text-gray-600 text-sm lg:text-base xl:text-lg">أدخل بياناتك لإتمام التوصيل</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm lg:text-base font-bold text-gray-700">الاسم الكامل *</label>
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                          className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border rounded-lg lg:rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-all ${
                            errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="أدخل اسمك الكامل"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs lg:text-sm flex items-center gap-1">
                            <X size={14} />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm lg:text-base font-bold text-gray-700">رقم الهاتف *</label>
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) => {
                            // تنسيق رقم الهاتف تلقائياً
                            let phone = e.target.value.replace(/\D/g, '');
                            if (phone.length > 0 && !phone.startsWith('05')) {
                              if (phone.startsWith('5')) {
                                phone = '0' + phone;
                              }
                            }
                            if (phone.length > 10) {
                              phone = phone.slice(0, 10);
                            }
                            setUserData({...userData, phone});
                          }}
                          className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border rounded-lg lg:rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-all ${
                            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="05xxxxxxxx"
                          maxLength={10}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs lg:text-sm flex items-center gap-1">
                            <X size={14} />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm lg:text-base font-bold text-gray-700">البريد الإلكتروني (اختياري)</label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border rounded-lg lg:rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-all ${
                            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="example@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs lg:text-sm flex items-center gap-1">
                            <X size={14} />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm lg:text-base font-bold text-gray-700">المدينة *</label>
                        <select
                          value={userData.city}
                          onChange={(e) => setUserData({...userData, city: e.target.value})}
                          className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border rounded-lg lg:rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-all ${
                            errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          <option value="">اختر المدينة</option>
                          <option value="الرياض">الرياض</option>
                          <option value="جدة">جدة</option>
                          <option value="مكة">مكة المكرمة</option>
                          <option value="الدمام">الدمام</option>
                          <option value="الخبر">الخبر</option>
                          <option value="المدينة">المدينة المنورة</option>
                          <option value="الطائف">الطائف</option>
                          <option value="أبها">أبها</option>
                          <option value="تبوك">تبوك</option>
                          <option value="القصيم">القصيم</option>
                          <option value="أخرى">أخرى</option>
                        </select>
                        {errors.city && (
                          <p className="text-red-500 text-xs lg:text-sm flex items-center gap-1">
                            <X size={14} />
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm lg:text-base font-bold text-gray-700">العنوان التفصيلي *</label>
                        <textarea
                          value={userData.address}
                          onChange={(e) => setUserData({...userData, address: e.target.value})}
                          rows={4}
                          className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border rounded-lg lg:rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-all resize-none ${
                            errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="أدخل العنوان التفصيلي (الحي، الشارع، رقم المبنى)"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-xs lg:text-sm flex items-center gap-1">
                            <X size={14} />
                            {errors.address}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          مثال: حي الملز، شارع الأمير محمد بن عبدالعزيز، مبنى رقم 123، الدور الثاني
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
                {currentStep === 3 && (
                  <div className="p-4 lg:p-6 xl:p-8">
                    <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-black rounded-xl lg:rounded-2xl flex items-center justify-center">
                        <CreditCard className="text-white" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">طريقة الدفع</h2>
                        <p className="text-gray-600 text-sm lg:text-base xl:text-lg">اختر الطريقة المناسبة لك</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                      <div
                        className={`p-4 lg:p-6 rounded-xl lg:rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedPaymentMethod === 'cod'
                            ? 'border-black bg-gray-50 shadow-lg'
                            : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedPaymentMethod('cod')}
                      >
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500 rounded-lg lg:rounded-xl flex items-center justify-center">
                            <Truck className="text-white" size={18} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base lg:text-lg">الدفع عند الاستلام</h4>
                            <p className="text-xs lg:text-sm text-gray-600">ادفع نقداً عند وصول الطلب</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'cod' && (
                          <div className="mt-3 lg:mt-4 flex justify-center">
                            <div className="bg-green-500 text-white rounded-full p-1">
                              <CheckCircle size={16} />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div
                        className={`p-4 lg:p-6 rounded-xl lg:rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedPaymentMethod === 'bank'
                            ? 'border-black bg-gray-50 shadow-lg'
                            : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedPaymentMethod('bank')}
                      >
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-lg lg:rounded-xl flex items-center justify-center">
                            <CreditCard className="text-white" size={18} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base lg:text-lg">تحويل بنكي</h4>
                            <p className="text-xs lg:text-sm text-gray-600">تحويل إلى الحساب البنكي</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'bank' && (
                          <div className="mt-3 lg:mt-4 flex justify-center">
                            <div className="bg-blue-500 text-white rounded-full p-1">
                              <CheckCircle size={16} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* معلومات إضافية عن طريقة الدفع */}
                    <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-gray-50 rounded-xl lg:rounded-2xl">
                      <div className="flex items-start gap-3">
                        <Shield className="text-green-600 flex-shrink-0 mt-1" size={20} />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">الدفع آمن ومضمون</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• جميع المعاملات محمية ومشفرة</li>
                            <li>• يمكنك الدفع نقداً عند الاستلام</li>
                            <li>• التحويل البنكي متاح للطلبات الكبيرة</li>
                            <li>• ضمان استرداد الأموال في حالة عدم الرضا</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Order Confirmation */}
                {currentStep === 4 && (
                  <div className="p-4 lg:p-6 xl:p-8">
                    <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-black rounded-xl lg:rounded-2xl flex items-center justify-center">
                        <CheckCircle className="text-white" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">تأكيد الطلب</h2>
                        <p className="text-gray-600 text-sm lg:text-base xl:text-lg">راجع بياناتك قبل إتمام الطلب</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4 lg:space-y-6">
                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <User className="text-blue-600" size={20} />
                          <h3 className="font-bold text-gray-900 text-base lg:text-lg">بيانات التوصيل</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 text-sm lg:text-base">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">الاسم:</span>
                            <span className="text-gray-900">{userData.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">الهاتف:</span>
                            <span className="text-gray-900" dir="ltr">{userData.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">المدينة:</span>
                            <span className="text-gray-900">{userData.city}</span>
                          </div>
                          {userData.email && (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-700">البريد:</span>
                              <span className="text-gray-900" dir="ltr">{userData.email}</span>
                            </div>
                          )}
                          <div className="lg:col-span-2 flex items-start gap-2">
                            <span className="font-bold text-gray-700 flex-shrink-0">العنوان:</span>
                            <span className="text-gray-900">{userData.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <CreditCard className="text-green-600" size={20} />
                          <h3 className="font-bold text-gray-900 text-base lg:text-lg">طريقة الدفع</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            selectedPaymentMethod === 'cod' ? 'bg-green-500' : 'bg-blue-500'
                          }`}>
                            {selectedPaymentMethod === 'cod' ? (
                              <Truck className="text-white" size={16} />
                            ) : (
                              <CreditCard className="text-white" size={16} />
                            )}
                          </div>
                          <span className="text-gray-900 font-medium">
                            {selectedPaymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'تحويل بنكي'}
                          </span>
                        </div>
                      </div>

                      {/* Order Items Summary */}
                      <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Package className="text-purple-600" size={20} />
                          <h3 className="font-bold text-gray-900 text-base lg:text-lg">المنتجات ({cartItems.length})</h3>
                        </div>
                        <div className="space-y-3">
                          {cartItems.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                              )}
                              <span className="flex-1 text-gray-900">{item.name}</span>
                              <span className="text-gray-600">×{item.quantity}</span>
                              <span className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} ر.س</span>
                            </div>
                          ))}
                          {cartItems.length > 3 && (
                            <div className="text-center text-gray-500 text-sm">
                              وعدد {cartItems.length - 3} منتجات أخرى...
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Terms Agreement */}
                      <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                        <div className="flex items-start gap-3 lg:gap-4">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 lg:w-5 lg:h-5 text-black border-gray-300 rounded focus:ring-black"
                          />
                          <label htmlFor="terms" className="text-gray-700 leading-relaxed text-sm lg:text-base">
                            أوافق على <Link to="/privacy-policy" className="text-black font-bold hover:underline">الشروط والأحكام</Link> و
                            <Link to="/return-policy" className="text-black font-bold hover:underline"> سياسة الإرجاع</Link>
                          </label>
                        </div>
                        {errors.terms && (
                          <p className="text-red-500 text-xs lg:text-sm mt-2 flex items-center gap-1">
                            <X size={14} />
                            {errors.terms}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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

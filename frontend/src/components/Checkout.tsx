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
        const savedCart = localStorage.getItem('cart');
        console.log('💾 [Checkout] Raw cart data:', savedCart);
        
        if (savedCart) {
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
            const image = product.image || product.images?.[0] || item.image || item.images?.[0];
            
            return {
              id: String(product.id || item.id || Math.random()),
              name,
              price,
              quantity: parseInt(item.quantity || 1),
              image,
              size: item.selectedOptions?.size || item.size,
              category: product.category || item.category,
              originalPrice: product.originalPrice || item.originalPrice,
              discount: product.discount || item.discount
            };
          }).filter(item => item.id && item.name && item.price > 0);
          
          console.log('✅ [Checkout] Standardized cart:', standardizedCart);
          setCartItems(standardizedCart);
          
          if (standardizedCart.length === 0) {
            console.log('⚠️ [Checkout] Cart is empty after processing');
            // Add test data for development
            const testItems = [
              {
                id: 'test-1',
                name: 'عطر فاخر - اختبار',
                price: 299.99,
                quantity: 1,
                image: '/api/placeholder/300/300',
                size: '50ml',
                category: 'عطور',
                originalPrice: 399.99,
                discount: 25
              }
            ];
            setCartItems(testItems);
            console.log('🧪 [Checkout] Added test data:', testItems);
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
      if (event.key === 'cart') {
        console.log('💾 [Checkout] localStorage cart changed');
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
  const shippingCost = selectedShippingZone ? selectedShippingZone.price : 0;
  const couponDiscount = appliedCoupon ? (
    appliedCoupon.type === 'percentage' 
      ? Math.min(subtotal * (appliedCoupon.value / 100), appliedCoupon.maxDiscount || Infinity)
      : appliedCoupon.value
  ) : 0;
  const freeShipping = appliedCoupon?.type === 'freeShipping' || 
    (selectedShippingZone && subtotal >= selectedShippingZone.freeShippingThreshold!);
  const finalShippingCost = freeShipping ? 0 : shippingCost;
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
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      
      return updatedItems;
    });
  };

  const removeItem = (itemId: string, size: string | undefined) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => 
        !(item.id === itemId && item.size === size)
      );
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      
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
      if (!selectedShippingZone) newErrors.shipping = 'يرجى اختيار منطقة الشحن';
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
      localStorage.removeItem('cart');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">إتمام الطلب</h1>
            <p className="text-gray-600 text-lg">اكمل بياناتك لإتمام عملية الشراء</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                
                {/* Step 1: Order Review */}
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <ShoppingCart className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">مراجعة طلبك</h2>
                      <p className="text-gray-600">{cartItems.length} منتج في السلة</p>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <div 
                        key={`${item.id}-${item.size || 'default'}`}
                        className="group relative bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-6">
                          {/* Product Image */}
                          {item.image && (
                            <div className="relative">
                              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                              </div>
                              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                                {item.quantity}
                              </div>
                              {item.discount && (
                                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-2 py-1 text-xs font-bold shadow-lg">
                                  -{item.discount}%
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-xl mb-2 group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </h4>
                            {item.size && (
                              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-2 rounded-full text-sm text-gray-600 mb-3">
                                <Package size={16} />
                                الحجم: {item.size}
                              </div>
                            )}
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-1 border border-gray-200 shadow-sm">
                                <button
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                  className="w-10 h-10 rounded-xl bg-white shadow-sm hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                  className="w-10 h-10 rounded-xl bg-white shadow-sm hover:bg-green-50 hover:text-green-600 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeItem(item.id, item.size)}
                                className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                                title="حذف المنتج"
                              >
                                <Trash2 size={20} />
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
                              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
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
                <div className="border-t border-gray-100 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">بيانات التوصيل</h2>
                      <p className="text-gray-600">أدخل بياناتك لإتمام التوصيل</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">الاسم الكامل *</label>
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm text-lg transition-all duration-300"
                        placeholder="أدخل اسمك الكامل"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">رقم الهاتف *</label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm text-lg transition-all duration-300"
                        placeholder="05xxxxxxxx"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm text-lg transition-all duration-300"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">المدينة *</label>
                      <select
                        value={userData.city}
                        onChange={(e) => setUserData({...userData, city: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm text-lg transition-all duration-300"
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
                      {errors.city && <p className="text-red-500 text-sm mt-2">{errors.city}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3">العنوان التفصيلي *</label>
                      <textarea
                        value={userData.address}
                        onChange={(e) => setUserData({...userData, address: e.target.value})}
                        rows={3}
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 resize-none"
                        placeholder="أدخل العنوان التفصيلي (الحي، الشارع، رقم المبنى)"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-2">{errors.address}</p>}
                    </div>
                  </div>

                  {/* Shipping Zones */}
                  <div className="mt-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">اختر منطقة الشحن</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shippingZones.map((zone) => (
                        <div
                          key={zone.id}
                          className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            selectedShippingZone?.id === zone.id
                              ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedShippingZone(zone)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl">{zone.icon}</div>
                              <div>
                                <h4 className="font-bold text-gray-800">{zone.name}</h4>
                                <p className="text-sm text-gray-600">{zone.estimatedDays}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">{zone.price} ريال</p>
                              {zone.freeShippingThreshold && (
                                <p className="text-xs text-gray-500">
                                  شحن مجاني عند {zone.freeShippingThreshold} ريال
                                </p>
                              )}
                            </div>
                          </div>
                          {selectedShippingZone?.id === zone.id && (
                            <div className="absolute top-3 left-3">
                              <CheckCircle className="text-blue-500" size={24} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {errors.shipping && <p className="text-red-500 text-sm mt-2">{errors.shipping}</p>}
                  </div>

                  {/* Payment Method */}
                  <div className="mt-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">طريقة الدفع</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          selectedPaymentMethod === 'cod'
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-green-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod('cod')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                            <Truck className="text-green-600" size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">الدفع عند الاستلام</h4>
                            <p className="text-sm text-gray-600">ادفع نقداً عند وصول الطلب</p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          selectedPaymentMethod === 'bank'
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod('bank')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <CreditCard className="text-blue-600" size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">تحويل بنكي</h4>
                            <p className="text-sm text-gray-600">تحويل إلى الحساب البنكي</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="mt-10">
                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="terms" className="text-gray-700 leading-relaxed">
                        أوافق على <Link to="/privacy-policy" className="text-blue-600 hover:underline">الشروط والأحكام</Link> و
                        <Link to="/return-policy" className="text-blue-600 hover:underline"> سياسة الإرجاع</Link>
                      </label>
                    </div>
                    {errors.terms && <p className="text-red-500 text-sm mt-2">{errors.terms}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-8">ملخص الطلب</h3>
                    
                    {/* Coupon Section */}
                    {!appliedCoupon && (
                      <div className="mb-8">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="كود الخصم"
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            disabled={couponLoading}
                          />
                          <button
                            onClick={applyCoupon}
                            disabled={!couponCode.trim() || couponLoading}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 font-bold"
                          >
                            {couponLoading ? '...' : 'تطبيق'}
                          </button>
                        </div>
                      </div>
                    )}

                    {appliedCoupon && (
                      <div className="mb-8 p-4 bg-green-50 rounded-2xl border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Gift className="text-green-600" size={20} />
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
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">المجموع الفرعي:</span>
                        <span className="font-bold text-gray-800">{subtotal.toFixed(2)} ريال</span>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="flex justify-between text-lg text-green-600">
                          <span>الخصم:</span>
                          <span className="font-bold">-{couponDiscount.toFixed(2)} ريال</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">الشحن:</span>
                        <span className={`font-bold ${freeShipping ? 'text-green-600' : 'text-gray-800'}`}>
                          {freeShipping ? 'مجاني' : `${finalShippingCost.toFixed(2)} ريال`}
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-2xl font-bold">
                          <span className="text-gray-800">المجموع:</span>
                          <span className="text-green-600">{total.toFixed(2)} ريال</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !agreeToTerms}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-2xl transform hover:scale-105 active:scale-95"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          جاري إرسال الطلب...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <CheckCircle size={24} />
                          إتمام الطلب
                        </div>
                      )}
                    </button>

                    {/* Security Badge */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                      <Shield size={16} />
                      <span>معاملة آمنة ومحمية</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

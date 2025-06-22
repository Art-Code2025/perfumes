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
  
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  console.log('🔧 [Checkout] Initial state set up complete');
  
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

  useEffect(() => {
    const loadCartData = () => {
      console.log('🔄 [Checkout] Loading cart data...');
      setIsLoadingCart(true);
      
      try {
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
          
          const standardizedCart = cartData.map((item: any) => {
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

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
      
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      
      return updatedItems;
    });
  };

  const removeItem = (itemId: string, size: string | undefined) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => 
        !(item.id === itemId && item.size === size)
      );
      
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

      localStorage.removeItem('cartItems');
      setCartItems([]);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50" dir="rtl" style={{ margin: '0mm', padding: '10mm' }}>
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden" style={{ padding: '15mm 10mm' }}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative container mx-auto" style={{ padding: '0mm' }}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-2xl" style={{ width: '20mm', height: '20mm', marginBottom: '6mm' }}>
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg" style={{ fontSize: '12mm', marginBottom: '4mm' }}>إتمام الطلب</h1>
            <p className="text-white/90 text-xl font-medium" style={{ fontSize: '5mm' }}>اكمل بياناتك لإتمام عملية الشراء بأمان</p>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 animate-pulse" style={{ width: '40mm', height: '40mm', margin: '-10mm' }}></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16 animate-pulse delay-300" style={{ width: '32mm', height: '32mm', margin: '8mm' }}></div>
      </div>

      <div className="container mx-auto" style={{ padding: '10mm' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden" style={{ borderRadius: '6mm', padding: '8mm' }}>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8" style={{ gap: '4mm', marginBottom: '8mm' }}>
                    <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg" style={{ width: '14mm', height: '14mm', borderRadius: '4mm' }}>
                      <ShoppingCart className="text-white" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent" style={{ fontSize: '9mm' }}>مراجعة طلبك</h2>
                      <p className="text-gray-600 text-lg" style={{ fontSize: '5mm' }}>{cartItems.length} منتج في السلة</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <div 
                        key={`${item.id}-${item.size || 'default'}`}
                        className="group relative bg-gradient-to-r from-white to-gray-50/50 rounded-3xl p-6 border border-gray-100/50 hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:border-purple-200"
                        style={{
                          borderRadius: '6mm',
                          padding: '6mm',
                          animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <div className="flex items-center gap-6" style={{ gap: '6mm' }}>
                          {item.image && (
                            <div className="relative">
                              <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white/50" style={{ width: '28mm', height: '28mm', borderRadius: '6mm' }}>
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                              </div>
                              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-xl animate-bounce" style={{ width: '10mm', height: '10mm', margin: '-3mm' }}>
                                {item.quantity}
                              </div>
                              {item.discount && (
                                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-xl animate-pulse" style={{ margin: '-3mm' }}>
                                  -{item.discount}%
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-2xl mb-3 group-hover:text-purple-600 transition-colors duration-300" style={{ fontSize: '6mm', marginBottom: '3mm' }}>
                              {item.name}
                            </h4>
                            {item.size && (
                              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-sm text-purple-700 mb-4 font-medium" style={{ gap: '2mm', padding: '2mm 4mm', borderRadius: '4mm', marginBottom: '4mm' }}>
                                <Package size={16} />
                                الحجم: {item.size}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 mt-4" style={{ gap: '4mm', marginTop: '4mm' }}>
                              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-2 border border-gray-200/50 shadow-lg" style={{ gap: '2mm', padding: '2mm', borderRadius: '4mm' }}>
                                <button
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 shadow-lg hover:from-red-600 hover:to-pink-600 text-white transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                  style={{ width: '12mm', height: '12mm', borderRadius: '4mm' }}
                                >
                                  <Minus size={20} />
                                </button>
                                <span className="w-16 text-center font-bold text-xl text-gray-800" style={{ width: '16mm', fontSize: '5mm' }}>{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                                  style={{ width: '12mm', height: '12mm', borderRadius: '4mm' }}
                                >
                                  <Plus size={20} />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeItem(item.id, item.size)}
                                className="p-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                                title="حذف المنتج"
                                style={{ padding: '3mm', borderRadius: '4mm' }}
                              >
                                <Trash2 size={22} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="space-y-2">
                              {item.originalPrice && item.originalPrice > item.price && (
                                <p className="text-lg text-gray-400 line-through" style={{ fontSize: '4mm' }}>
                                  {(item.originalPrice * item.quantity).toFixed(2)} ريال
                                </p>
                              )}
                              <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent" style={{ fontSize: '10mm' }}>
                                {(item.price * item.quantity).toFixed(2)} ريال
                              </p>
                              <p className="text-sm text-gray-500" style={{ fontSize: '3mm' }}>
                                {item.price.toFixed(2)} ريال × {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100/50 p-8 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
                  <div className="flex items-center gap-4 mb-8" style={{ gap: '4mm', marginBottom: '8mm' }}>
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg" style={{ width: '14mm', height: '14mm', borderRadius: '4mm' }}>
                      <User className="text-white" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent" style={{ fontSize: '9mm' }}>بيانات التوصيل</h2>
                      <p className="text-gray-600 text-lg" style={{ fontSize: '5mm' }}>أدخل بياناتك لإتمام التوصيل</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors" style={{ fontSize: '3mm', marginBottom: '3mm' }}>الاسم الكامل *</label>
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 hover:shadow-lg"
                        style={{ padding: '4mm 6mm', borderRadius: '4mm' }}
                        placeholder="أدخل اسمك الكامل"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-2 animate-pulse" style={{ fontSize: '3mm', marginTop: '2mm' }}>{errors.name}</p>}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors" style={{ fontSize: '3mm', marginBottom: '3mm' }}>رقم الهاتف *</label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 hover:shadow-lg"
                        style={{ padding: '4mm 6mm', borderRadius: '4mm' }}
                        placeholder="05xxxxxxxx"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-2 animate-pulse" style={{ fontSize: '3mm', marginTop: '2mm' }}>{errors.phone}</p>}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors" style={{ fontSize: '3mm', marginBottom: '3mm' }}>البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 hover:shadow-lg"
                        style={{ padding: '4mm 6mm', borderRadius: '4mm' }}
                        placeholder="example@email.com"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors" style={{ fontSize: '3mm', marginBottom: '3mm' }}>المدينة *</label>
                      <select
                        value={userData.city}
                        onChange={(e) => setUserData({...userData, city: e.target.value})}
                        className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 hover:shadow-lg"
                        style={{ padding: '4mm 6mm', borderRadius: '4mm' }}
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
                      {errors.city && <p className="text-red-500 text-sm mt-2 animate-pulse" style={{ fontSize: '3mm', marginTop: '2mm' }}>{errors.city}</p>}
                    </div>

                    <div className="md:col-span-2 group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors" style={{ fontSize: '3mm', marginBottom: '3mm' }}>العنوان التفصيلي *</label>
                      <textarea
                        value={userData.address}
                        onChange={(e) => setUserData({...userData, address: e.target.value})}
                        rows={3}
                        className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm text-lg transition-all duration-300 resize-none hover:shadow-lg"
                        style={{ padding: '4mm 6mm', borderRadius: '4mm' }}
                        placeholder="أدخل العنوان التفصيلي (الحي، الشارع، رقم المبنى)"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-2 animate-pulse" style={{ fontSize: '3mm', marginTop: '2mm' }}>{errors.address}</p>}
                    </div>
                  </div>

                  <div className="mt-12">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8" style={{ fontSize: '6mm', marginBottom: '8mm' }}>اختر منطقة الشحن</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {shippingZones.map((zone, index) => (
                        <div
                          key={zone.id}
                          className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                            selectedShippingZone?.id === zone.id
                              ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-2xl scale-105'
                              : 'border-gray-200/50 bg-white/70 hover:border-purple-300 hover:shadow-xl'
                          }`}
                          onClick={() => setSelectedShippingZone(zone)}
                          style={{
                            padding: '6mm',
                            borderRadius: '6mm',
                            animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4" style={{ gap: '4mm' }}>
                              <div className="text-3xl animate-bounce" style={{ fontSize: '9mm' }}>{zone.icon}</div>
                              <div>
                                <h4 className="font-bold text-gray-800 text-lg" style={{ fontSize: '5mm' }}>{zone.name}</h4>
                                <p className="text-sm text-gray-600" style={{ fontSize: '3mm' }}>{zone.estimatedDays}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent" style={{ fontSize: '9mm' }}>{zone.price} ريال</p>
                              {zone.freeShippingThreshold && (
                                <p className="text-xs text-gray-500 mt-1" style={{ fontSize: '2mm', marginTop: '1mm' }}>
                                  شحن مجاني عند {zone.freeShippingThreshold} ريال
                                </p>
                              )}
                            </div>
                          </div>
                          {selectedShippingZone?.id === zone.id && (
                            <div className="absolute top-4 left-4 animate-bounce" style={{ margin: '4mm' }}>
                              <CheckCircle className="text-purple-500" size={28} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {errors.shipping && <p className="text-red-500 text-sm mt-2 animate-pulse" style={{ fontSize: '3mm', marginTop: '2mm' }}>{errors.shipping}</p>}
                  </div>

                  <div className="mt-12">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8" style={{ fontSize: '6mm', marginBottom: '8mm' }}>طريقة الدفع</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                          selectedPaymentMethod === 'cod'
                            ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-2xl scale-105'
                            : 'border-gray-200/50 bg-white/70 hover:border-emerald-300 hover:shadow-xl'
                        }`}
                        onClick={() => setSelectedPaymentMethod('cod')}
                        style={{ padding: '6mm', borderRadius: '6mm' }}
                      >
                        <div className="flex items-center gap-4" style={{ gap: '4mm' }}>
                          <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg" style={{ width: '14mm', height: '14mm', borderRadius: '4mm' }}>
                            <Truck className="text-white" size={28} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg" style={{ fontSize: '5mm' }}>الدفع عند الاستلام</h4>
                            <p className="text-sm text-gray-600" style={{ fontSize: '3mm' }}>ادفع نقداً عند وصول الطلب</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'cod' && (
                          <div className="absolute top-4 left-4 animate-bounce" style={{ margin: '4mm' }}>
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
                        style={{ padding: '6mm', borderRadius: '6mm' }}
                      >
                        <div className="flex items-center gap-4" style={{ gap: '4mm' }}>
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg" style={{ width: '14mm', height: '14mm', borderRadius: '4mm' }}>
                            <CreditCard className="text-white" size={28} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg" style={{ fontSize: '5mm' }}>تحويل بنكي</h4>
                            <p className="text-sm text-gray-600" style={{ fontSize: '3mm' }}>تحويل إلى الحساب البنكي</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'bank' && (
                          <div className="absolute top-4 left-4 animate-bounce" style={{ margin: '4mm' }}>
                            <CheckCircle className="text-blue-500" size={24} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-3xl border border-gray-200/50 backdrop-blur-sm" style={{ gap: '4mm', padding: '6mm', borderRadius: '6mm' }}>
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 w-6 h-6 text-purple-600 border-gray-300 rounded-lg focus:ring-purple-500 focus:ring-4"
                        style={{ width: '6mm', height: '6mm', marginTop: '1mm' }}
                      />
                      <label htmlFor="terms" className="text-gray-700 leading-relaxed text-lg" style={{ fontSize: '5mm' }}>
                        أوافق على <Link to="/privacy-policy" className="text-purple-600 hover:text-purple-800 font-bold hover:underline transition-colors">الشروط والأحكام</Link> و
                        <Link to="/return-policy" className="text-purple-600 hover:text-purple-800 font-bold hover:underline transition-colors"> سياسة الإرجاع</Link>
                      </label>
                    </div>
                    {errors.terms && <p className="text-red-500 text-sm mt-2 animate-pulse" style={{ fontSize: '3mm', marginTop: '2mm' }}>{errors.terms}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden" style={{ borderRadius: '6mm' }}>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white" style={{ padding: '6mm' }}>
                    <h3 className="text-2xl font-bold mb-2" style={{ fontSize: '6mm', marginBottom: '2mm' }}>ملخص الطلب</h3>
                    <p className="text-purple-100" style={{ fontSize: '4mm' }}>تفاصيل طلبك النهائية</p>
                  </div>
                  
                  <div className="p-8" style={{ padding: '8mm' }}>
                    {!appliedCoupon && (
                      <div className="mb-8" style={{ marginBottom: '8mm' }}>
                        <div className="flex gap-3" style={{ gap: '3mm' }}>
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="كود الخصم"
                            className="flex-1 px-4 py-3 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm transition-all duration-300"
                            style={{ padding: '3mm 4mm', borderRadius: '4mm' }}
                            disabled={couponLoading}
                          />
                          <button
                            onClick={applyCoupon}
                            disabled={!couponCode.trim() || couponLoading}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 font-bold shadow-lg hover:scale-105 active:scale-95"
                            style={{ padding: '3mm 6mm', borderRadius: '4mm' }}
                          >
                            {couponLoading ? '...' : 'تطبيق'}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {appliedCoupon && (
                      <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/50 animate-pulse" style={{ padding: '4mm', borderRadius: '4mm', marginBottom: '8mm' }}>
                        <div className="flex items-center justify-between" style={{ gap: '3mm' }}>
                          <div className="flex items-center gap-3" style={{ gap: '3mm' }}>
                            <Gift className="text-emerald-600 animate-bounce" size={24} />
                            <div>
                              <p className="font-bold text-emerald-800" style={{ fontSize: '5mm' }}>{appliedCoupon.code}</p>
                              <p className="text-sm text-emerald-600" style={{ fontSize: '3mm' }}>{appliedCoupon.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={removeCoupon}
                            className="text-red-500 hover:text-red-700 p-1 hover:scale-110 transition-all duration-300"
                            style={{ padding: '1mm' }}
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-6 mb-8" style={{ marginBottom: '8mm' }}>
                      <div className="flex justify-between text-xl" style={{ fontSize: '5mm' }}>
                        <span className="text-gray-600">المجموع الفرعي:</span>
                        <span className="font-bold text-gray-800">{subtotal.toFixed(2)} ريال</span>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="flex justify-between text-xl text-emerald-600 animate-pulse" style={{ fontSize: '5mm' }}>
                          <span>الخصم:</span>
                          <span className="font-bold">-{couponDiscount.toFixed(2)} ريال</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-xl" style={{ fontSize: '5mm' }}>
                        <span className="text-gray-600">الشحن:</span>
                        <span className={`font-bold ${freeShipping ? 'text-emerald-600' : 'text-gray-800'}`}>
                          {freeShipping ? 'مجاني 🎉' : `${finalShippingCost.toFixed(2)} ريال`}
                        </span>
                      </div>

                      <div className="border-t border-gray-200/50 pt-6">
                        <div className="flex justify-between text-3xl font-bold" style={{ fontSize: '9mm' }}>
                          <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">المجموع:</span>
                          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{total.toFixed(2)} ريال</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading || !agreeToTerms}
                      className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-6 rounded-3xl hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-2xl transform hover:scale-105 active:scale-95 animate-gradient-x"
                      style={{
                        padding: '6mm',
                        borderRadius: '6mm',
                        backgroundSize: '200% 200%'
                      }}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-3" style={{ gap: '3mm' }}>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" style={{ width: '8mm', height: '8mm' }}></div>
                          جاري إرسال الطلب...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3" style={{ gap: '3mm' }}>
                          <CheckCircle size={28} />
                          إتمام الطلب 🚀
                        </div>
                      )}
                    </button>

                    <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm" style={{ marginTop: '6mm' }}>
                      <Shield size={20} className="animate-pulse" />
                      <span>معاملة آمنة ومحمية 🔒</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
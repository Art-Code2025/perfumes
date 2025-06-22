import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Zap
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  category?: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
}

interface ShippingZone {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  regions: string[];
}

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount: number;
  description: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: ''
  });
  const [selectedShippingZone, setSelectedShippingZone] = useState<ShippingZone | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: 'مراجعة الطلب', icon: ShoppingCart },
    { id: 2, title: 'معلومات التوصيل', icon: MapPin },
    { id: 3, title: 'الدفع', icon: CreditCard },
    { id: 4, title: 'التأكيد', icon: CheckCircle }
  ];

  const shippingZones: ShippingZone[] = [
    {
      id: 'riyadh',
      name: 'الرياض',
      price: 15,
      estimatedDays: '1-2 أيام',
      regions: ['الرياض', 'الدرعية', 'الخرج']
    },
    {
      id: 'jeddah',
      name: 'جدة ومكة',
      price: 20,
      estimatedDays: '2-3 أيام',
      regions: ['جدة', 'مكة', 'الطائف']
    },
    {
      id: 'dammam',
      name: 'الدمام والشرقية',
      price: 25,
      estimatedDays: '2-4 أيام',
      regions: ['الدمام', 'الخبر', 'الظهران', 'الأحساء']
    },
    {
      id: 'other',
      name: 'باقي المناطق',
      price: 30,
      estimatedDays: '3-5 أيام',
      regions: ['أخرى']
    }
  ];

  const availableCoupons: Coupon[] = [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minAmount: 100,
      description: 'خصم 10% للعملاء الجدد'
    },
    {
      code: 'SAVE50',
      type: 'fixed',
      value: 50,
      minAmount: 200,
      description: 'خصم 50 ريال عند الشراء بـ 200 ريال أو أكثر'
    },
    {
      code: 'FREESHIP',
      type: 'percentage',
      value: 100,
      minAmount: 150,
      description: 'شحن مجاني عند الشراء بـ 150 ريال أو أكثر'
    }
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart:', error);
        setCartItems([]);
      }
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          region: user.region || '',
          postalCode: user.postalCode || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = selectedShippingZone?.price || 0;
  const couponDiscount = appliedCoupon ? 
    (appliedCoupon.type === 'percentage' ? 
      (subtotal * appliedCoupon.value / 100) : 
      appliedCoupon.value) : 0;
  const total = Math.max(0, subtotal + shippingCost - couponDiscount);

  const updateQuantity = (itemId: string, size: string | undefined, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === itemId && item.size === size 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const removeItem = (itemId: string, size: string | undefined) => {
    const updatedItems = cartItems.filter(item => 
      !(item.id === itemId && item.size === size)
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    if (updatedItems.length === 0) {
      toast.info('تم إزالة جميع المنتجات من السلة');
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!userData.name.trim()) newErrors.name = 'الاسم مطلوب';
      if (!userData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
      if (!userData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
      if (!userData.address.trim()) newErrors.address = 'العنوان مطلوب';
      if (!userData.city.trim()) newErrors.city = 'المدينة مطلوبة';
      if (!selectedShippingZone) newErrors.shipping = 'يرجى اختيار منطقة الشحن';
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

  const applyCoupon = () => {
    const coupon = availableCoupons.find(c => 
      c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!coupon) {
      toast.error('كود الخصم غير صحيح');
      return;
    }

    if (subtotal < coupon.minAmount) {
      toast.error(`الحد الأدنى للطلب ${coupon.minAmount} ريال`);
      return;
    }

    setAppliedCoupon(coupon);
    toast.success('تم تطبيق كود الخصم بنجاح!');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('تم إلغاء كود الخصم');
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      setCurrentStep(2);
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems,
        userData,
        shippingZone: selectedShippingZone,
        subtotal,
        shippingCost,
        couponDiscount,
        total,
        appliedCoupon,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/.netlify/functions/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        
        localStorage.removeItem('cartItems');
        localStorage.setItem('lastOrder', JSON.stringify({
          ...orderData,
          id: result.id || Date.now().toString()
        }));

        toast.success('تم إرسال طلبك بنجاح!');
        navigate('/thank-you');
      } else {
        throw new Error('فشل في إرسال الطلب');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center max-w-md w-full border border-white/20">
          <div className="text-8xl mb-6 animate-bounce">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">السلة فارغة</h2>
          <p className="text-gray-600 mb-8 text-lg">لا توجد منتجات في سلة التسوق</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
          >
            العودة للتسوق
          </button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingCart className="text-blue-600" />
                مراجعة طلبك ({cartItems.length} منتج)
              </h3>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size || 'default'}`} 
                       className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <div className="relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-20 h-20 object-cover rounded-xl shadow-md" 
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-lg">{item.name}</h4>
                        {item.size && (
                          <p className="text-sm text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded-full mt-1">
                            الحجم: {item.size}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-green-50 hover:text-green-600 transition-colors flex items-center justify-center"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          {(item.price * item.quantity).toFixed(2)} ريال
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.price.toFixed(2)} ريال × {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Gift className="text-green-600" />
                كود الخصم
              </h3>
              
              {!appliedCoupon ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="أدخل كود الخصم"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={!couponCode.trim()}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
                  >
                    تطبيق
                  </button>
                </div>
              ) : (
                <div className="bg-green-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-800">
                      كود الخصم: {appliedCoupon.code}
                    </p>
                    <p className="text-sm text-green-600">
                      {appliedCoupon.description}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {availableCoupons.map((coupon) => (
                  <div key={coupon.code} 
                       className={`bg-white/70 backdrop-blur-sm rounded-xl p-3 border transition-all duration-300 cursor-pointer hover:shadow-md ${
                         appliedCoupon?.code === coupon.code 
                           ? 'border-green-500 bg-green-50' 
                           : 'border-gray-200 hover:border-green-300'
                       }`}
                       onClick={() => {
                         setCouponCode(coupon.code);
                         if (subtotal >= coupon.minAmount) {
                           setAppliedCoupon(coupon);
                         }
                       }}>
                    <p className="font-semibold text-sm text-gray-800">{coupon.code}</p>
                    <p className="text-xs text-gray-600 mt-1">{coupon.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص الطلب</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن:</span>
                  <span className="font-semibold">
                    {selectedShippingZone ? `${shippingCost} ريال` : 'يحدد لاحقاً'}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم ({appliedCoupon.code}):</span>
                    <span className="font-semibold">-{couponDiscount.toFixed(2)} ريال</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                  <span>المجموع الكلي:</span>
                  <span>{total.toFixed(2)} ريال</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="text-blue-600" />
                معلومات العميل
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="أدخل اسمك الكامل"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="05xxxxxxxx"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    المدينة *
                  </label>
                  <input
                    type="text"
                    value={userData.city}
                    onChange={(e) => setUserData(prev => ({ ...prev, city: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 ${
                      errors.city ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="اسم المدينة"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    العنوان التفصيلي *
                  </label>
                  <textarea
                    value={userData.address}
                    onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 resize-none ${
                      errors.address ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="الحي، الشارع، رقم المبنى، رقم الشقة..."
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Zones */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Truck className="text-green-600" />
                اختر منطقة الشحن
              </h3>
              
              {errors.shipping && <p className="text-red-500 text-sm mb-4">{errors.shipping}</p>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shippingZones.map((zone) => (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedShippingZone(zone)}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 hover:shadow-lg ${
                      selectedShippingZone?.id === zone.id
                        ? 'border-green-500 bg-green-100 shadow-lg transform scale-105'
                        : 'border-gray-200 bg-white/70 backdrop-blur-sm hover:border-green-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-gray-800">{zone.name}</h4>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{zone.price} ريال</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock size={14} />
                          {zone.estimatedDays}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      يشمل: {zone.regions.join('، ')}
                    </p>
                    {selectedShippingZone?.id === zone.id && (
                      <div className="mt-3 flex items-center gap-2 text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-sm font-semibold">تم الاختيار</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="text-purple-600" />
                طريقة الدفع
              </h3>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">الدفع عند الاستلام</h4>
                    <p className="text-gray-600">ادفع نقداً عند وصول الطلب</p>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-start gap-3">
                    <Shield className="text-green-600 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-green-800 mb-1">دفع آمن ومضمون</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• لا حاجة لبطاقة ائتمان</li>
                        <li>• افحص المنتج قبل الدفع</li>
                        <li>• إمكانية الإرجاع فوري</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص الطلب النهائي</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن ({selectedShippingZone?.name}):</span>
                  <span className="font-semibold">{shippingCost} ريال</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم ({appliedCoupon.code}):</span>
                    <span className="font-semibold">-{couponDiscount.toFixed(2)} ريال</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-2xl font-bold text-gray-800">
                  <span>المجموع الكلي:</span>
                  <span className="text-green-600">{total.toFixed(2)} ريال</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                جاهز لإتمام الطلب!
              </h3>
              
              <p className="text-gray-600 mb-6 text-lg">
                تأكد من صحة جميع البيانات قبل تأكيد الطلب
              </p>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-right">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">معلومات العميل:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-semibold">الاسم:</span> {userData.name}</p>
                      <p><span className="font-semibold">الهاتف:</span> {userData.phone}</p>
                      <p><span className="font-semibold">البريد:</span> {userData.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">عنوان التوصيل:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-semibold">المدينة:</span> {userData.city}</p>
                      <p><span className="font-semibold">العنوان:</span> {userData.address}</p>
                      <p><span className="font-semibold">الشحن:</span> {selectedShippingZone?.name} ({selectedShippingZone?.estimatedDays})</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transform hover:scale-105 mt-6"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap size={20} />
                    تأكيد الطلب الآن
                  </div>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">إتمام الطلب</h1>
          <p className="text-gray-600 text-lg">اتبع الخطوات لإكمال طلبك بسهولة</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white shadow-lg'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle size={20} />
                  ) : (
                    <step.icon size={20} />
                  )}
                </div>
                <div className="mr-3 text-right">
                  <p className={`font-semibold text-sm ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                    currentStep > step.id ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="bg-gray-50/80 backdrop-blur-sm px-8 py-6 flex justify-between items-center border-t border-gray-200/50">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <ArrowLeft size={20} />
              السابق
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
              >
                التالي
                <ArrowRight size={20} />
              </button>
            ) : (
              <div className="text-sm text-gray-500">
                اضغط "تأكيد الطلب" أعلاه لإكمال الطلب
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; // Updated Sun Jun 22 15:43:16 EEST 2025

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, ShoppingCart, User, Phone, Mail, MapPin, CreditCard, Tag, Package, Check, X } from 'lucide-react';
import { apiCall, API_ENDPOINTS, buildImageUrl } from '../config/api';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedOptions?: Record<string, any>;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
}

interface CouponInfo {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  isValid: boolean;
  discount: number;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(50); // Default shipping cost
  const [total, setTotal] = useState(0);
  const [isGuest, setIsGuest] = useState(false);

  // Load cart items and user data
  useEffect(() => {
    console.log('🛒 [Checkout] Loading cart items and user data');
    
    // Load cart items from location state or localStorage
    const items = location.state?.cartItems || JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (items.length === 0) {
      toast.error('السلة فارغة');
      navigate('/');
      return;
    }
    setCartItems(items);
    console.log('🛒 [Checkout] Loaded cart items:', items.length);

    // Load user data if logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('👤 [Checkout] Loading user data:', user);
        
        setCustomerInfo({
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          address: user.address || '',
          city: user.city || '',
          notes: ''
        });
        setIsGuest(false);
      } catch (error) {
        console.error('❌ [Checkout] Error parsing user data:', error);
        setIsGuest(true);
      }
    } else {
      console.log('👤 [Checkout] No user data found, continuing as guest');
      setIsGuest(true);
    }
  }, [location.state, navigate]);

  // Calculate totals
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
    
    let newDiscount = 0;
    if (appliedCoupon && appliedCoupon.isValid) {
      if (appliedCoupon.type === 'percentage') {
        newDiscount = (newSubtotal * appliedCoupon.value) / 100;
      } else {
        newDiscount = appliedCoupon.value;
      }
    }
    setDiscount(newDiscount);
    
    const newTotal = newSubtotal - newDiscount + shippingCost;
    setTotal(Math.max(0, newTotal));
  }, [cartItems, appliedCoupon, shippingCost]);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('يرجى إدخال كود الكوبون');
      return;
    }

    setValidatingCoupon(true);
    try {
      // Simple coupon validation - you can enhance this
      const validCoupons = [
        { code: 'WELCOME10', type: 'percentage', value: 10 },
        { code: 'SAVE50', type: 'fixed', value: 50 }
      ];
      
      const coupon = validCoupons.find(c => c.code === couponCode.toUpperCase());
      
      if (coupon) {
        setAppliedCoupon({
          code: couponCode,
          type: coupon.type as 'percentage' | 'fixed',
          value: coupon.value,
          isValid: true,
          discount: coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value
        });
        toast.success('تم تطبيق الكوبون بنجاح');
      } else {
        toast.error('كوبون غير صالح');
        setAppliedCoupon(null);
      }
    } catch (error: any) {
      console.error('Error validating coupon:', error);
      toast.error('خطأ في التحقق من الكوبون');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('تم إلغاء الكوبون');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('📋 [Checkout] Starting order submission');

    // Validation
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        address: customerInfo.address,
        city: customerInfo.city,
        notes: customerInfo.notes,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity,
          selectedOptions: item.selectedOptions || {},
          productImage: item.image
        })),
        subtotal,
        deliveryFee: shippingCost,
        couponDiscount: discount,
        total,
        couponCode: appliedCoupon?.code || null,
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        status: 'pending',
        isGuestOrder: isGuest,
        createdAt: new Date().toISOString()
      };

      console.log('📋 [Checkout] Submitting order:', orderData);

      const response = await apiCall(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      console.log('✅ [Checkout] Order submitted successfully:', response);

      if (response) {
        // Clear cart from localStorage
        localStorage.removeItem('cartItems');
        
        // Update cart count in navbar
        const cartCountEvent = new CustomEvent('cartCountChanged', { detail: 0 });
        window.dispatchEvent(cartCountEvent);
        
        toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً', {
          position: "top-center",
          autoClose: 3000,
        });
        
        // Navigate to thank you page with order data
        navigate('/thank-you', { 
          state: { 
            order: {
              id: response.id,
              customerName: orderData.customerName,
              customerPhone: orderData.customerPhone,
              customerEmail: orderData.customerEmail,
              address: orderData.address,
              city: orderData.city,
              items: orderData.items,
              totalAmount: subtotal,
              couponDiscount: discount,
              deliveryFee: shippingCost,
              finalAmount: total,
              paymentMethod: 'الدفع عند الاستلام',
              status: 'pending',
              isGuestOrder: isGuest,
              createdAt: new Date().toISOString()
            }
          } 
        });
      } else {
        throw new Error('لم يتم إرجاع بيانات الطلب');
      }
    } catch (error: any) {
      console.error('❌ [Checkout] Error submitting order:', error);
      toast.error(error.message || 'خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى', {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">السلة فارغة</h2>
          <p className="text-gray-600 mb-4">لا توجد منتجات في السلة</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للتسوق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">إتمام الطلب</h1>
            {isGuest && (
              <span className="mr-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                طلب ضيف
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 ml-2" />
                  معلومات العميل
                  {!isGuest && (
                    <span className="mr-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                      تم تحميل البيانات تلقائياً
                    </span>
                  )}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الجوال *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="05xxxxxxxx"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المدينة *
                    </label>
                    <select
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">اختر المدينة</option>
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                      <option value="مكة المكرمة">مكة المكرمة</option>
                      <option value="المدينة المنورة">المدينة المنورة</option>
                      <option value="الطائف">الطائف</option>
                      <option value="تبوك">تبوك</option>
                      <option value="بريدة">بريدة</option>
                      <option value="خميس مشيط">خميس مشيط</option>
                      <option value="حائل">حائل</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان التفصيلي *
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل عنوانك التفصيلي (الحي، الشارع، رقم المبنى)"
                    required
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أي ملاحظات إضافية للطلب (اختياري)"
                  />
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Tag className="h-5 w-5 ml-2" />
                  كوبون الخصم
                </h2>

                {!appliedCoupon ? (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل كود الكوبون"
                    />
                    <button
                      type="button"
                      onClick={validateCoupon}
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {validatingCoupon ? 'جاري التحقق...' : 'تطبيق'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 ml-2" />
                      <span className="text-green-800 font-medium">
                        تم تطبيق الكوبون: {appliedCoupon.code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                    جاري إرسال الطلب...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 ml-2" />
                    تأكيد الطلب
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="h-5 w-5 ml-2" />
                ملخص الطلب
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="flex items-center space-x-4 space-x-reverse">
                    <img
                      src={buildImageUrl(item.image)}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="mt-1">
                          {Object.entries(item.selectedOptions).map(([key, value]) => (
                            <span key={key} className="text-xs text-gray-500 block">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">الكمية: {item.quantity}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="text-gray-900">{subtotal.toFixed(2)} ر.س</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">الخصم:</span>
                    <span className="text-green-600">-{discount.toFixed(2)} ر.س</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">رسوم الشحن:</span>
                  <span className="text-gray-900">{shippingCost.toFixed(2)} ر.س</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">المجموع الإجمالي:</span>
                    <span className="text-lg font-bold text-blue-600">{total.toFixed(2)} ر.س</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-blue-600 ml-2" />
                  <span className="text-sm font-medium text-blue-800">طريقة الدفع: الدفع عند الاستلام</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  ستقوم بالدفع نقداً عند استلام طلبك
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
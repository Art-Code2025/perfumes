import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  ShoppingBag, 
  ArrowRight, 
  Home,
  Star,
  Gift,
  Clock,
  Shield,
  Download,
  Share2,
  Heart
} from 'lucide-react';
import { buildImageUrl } from '../config/api';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  selectedOptions?: Record<string, any>;
  productImage: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: string;
  items: OrderItem[];
  totalAmount: number;
  couponDiscount: number;
  deliveryFee: number;
  finalAmount: number;
  paymentMethod: string;
  status: string;
  isGuestOrder?: boolean;
  createdAt: string;
}

const ThankYou: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const orderData = location.state?.order;
    if (!orderData) {
      // إذا لم تكن هناك بيانات طلب، توجه للصفحة الرئيسية
      navigate('/', { replace: true });
      return;
    }
    setOrder(orderData);

    // Hide confetti after animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تم تأكيد طلبي!',
          text: `تم إرسال طلبي رقم ${order.id} بنجاح من متجر العطور`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط الطلب!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50" dir="rtl">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '🎊', '💫', '⭐'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-ping"></div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              تم إرسال طلبك بنجاح! 🎉
            </h1>
            
            <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
              شكراً لك على ثقتك بنا. سنتواصل معك قريباً لتأكيد التفاصيل.
            </p>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-3 bg-green-100 px-6 py-3 rounded-2xl">
                <Package className="text-green-600" size={24} />
                <span className="font-bold text-green-800">رقم الطلب: #{order.id}</span>
              </div>
              
              {order.isGuestOrder && (
                <div className="flex items-center gap-3 bg-blue-100 px-6 py-3 rounded-2xl">
                  <User className="text-blue-600" size={24} />
                  <span className="font-bold text-blue-800">طلب ضيف</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={handleShare}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:scale-105"
              >
                <Share2 size={20} />
                مشاركة الطلب
              </button>
              
              <button
                onClick={() => window.print()}
                className="flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:scale-105"
              >
                <Download size={20} />
                طباعة الطلب
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Order Items */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <ShoppingBag className="text-blue-600" size={28} />
                    المنتجات المطلوبة ({order.items.length})
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="group relative bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                              <img
                                src={buildImageUrl(item.productImage)}
                                alt={item.productName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                              {item.quantity}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                              {item.productName}
                            </h3>
                            
                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {Object.entries(item.selectedOptions).map(([key, value]) => (
                                  <span key={key} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {key}: {String(value)}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>الكمية: {item.quantity}</span>
                              <span>•</span>
                              <span>السعر: {item.price.toFixed(2)} ر.س</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              {item.totalPrice.toFixed(2)} ر.س
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer & Delivery Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Customer Information */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <User className="text-blue-600" size={24} />
                      معلومات العميل
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="text-gray-400" size={20} />
                      <span className="font-bold text-gray-800">{order.customerName}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={20} />
                      <span className="text-gray-700" dir="ltr">{order.customerPhone}</span>
                    </div>
                    
                    {order.customerEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="text-gray-400" size={20} />
                        <span className="text-gray-700" dir="ltr">{order.customerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <MapPin className="text-green-600" size={24} />
                      عنوان التوصيل
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-gray-400 mt-1" size={20} />
                      <div>
                        <p className="font-bold text-gray-800 mb-1">{order.city}</p>
                        <p className="text-gray-600 leading-relaxed">{order.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="text-gray-400" size={20} />
                      <span className="text-gray-700">{formatDate(order.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Truck className="text-gray-400" size={20} />
                      <span className="text-gray-700">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                
                {/* Order Status */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <Clock className="text-orange-600" size={24} />
                      حالة الطلب
                    </h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="font-bold text-gray-800">
                        {order.status === 'pending' ? 'في انتظار التأكيد' : order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>تم استلام الطلب</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span>جاري التأكيد</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span>التحضير للشحن</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span>في الطريق إليك</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <Package className="text-green-600" size={24} />
                      ملخص الطلب
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">المجموع الفرعي:</span>
                      <span className="font-bold text-gray-800">{order.totalAmount.toFixed(2)} ر.س</span>
                    </div>
                    
                    {order.couponDiscount > 0 && (
                      <div className="flex justify-between text-lg text-green-600">
                        <span>الخصم:</span>
                        <span className="font-bold">-{order.couponDiscount.toFixed(2)} ر.س</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">رسوم التوصيل:</span>
                      <span className="font-bold text-gray-800">
                        {order.deliveryFee === 0 ? (
                          <span className="text-green-600">مجاني</span>
                        ) : (
                          `${order.deliveryFee.toFixed(2)} ر.س`
                        )}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-2xl font-bold">
                        <span className="text-gray-800">المجموع النهائي:</span>
                        <span className="text-green-600">{order.finalAmount.toFixed(2)} ر.س</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support & Actions */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <Heart className="text-purple-600" size={24} />
                      نحن هنا لمساعدتك
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <p className="text-gray-600 text-center mb-6">
                      هل تحتاج مساعدة أو لديك استفسار حول طلبك؟
                    </p>
                    
                    <div className="space-y-3">
                      <Link
                        to="/contact"
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:scale-105"
                      >
                        <Phone size={20} />
                        تواصل معنا
                      </Link>
                      
                      <Link
                        to="/"
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-bold shadow-lg hover:scale-105"
                      >
                        <Home size={20} />
                        العودة للتسوق
                      </Link>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <Shield size={16} />
                        <span>طلبك محمي ومؤمن</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">لماذا نحن؟</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="text-white" size={32} />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">ضمان الجودة</h4>
                  <p className="text-gray-600">منتجات أصلية 100% مع ضمان الجودة</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Truck className="text-white" size={32} />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">توصيل سريع</h4>
                  <p className="text-gray-600">توصيل سريع وآمن إلى باب منزلك</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="text-white" size={32} />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">خدمة متميزة</h4>
                  <p className="text-gray-600">دعم عملاء 24/7 لخدمتك</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou; 
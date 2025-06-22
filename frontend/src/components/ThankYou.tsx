import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Phone, Mail, MapPin, Calendar, User, ShoppingBag, ArrowRight, Home } from 'lucide-react';
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

  useEffect(() => {
    const orderData = location.state?.order;
    if (!orderData) {
      // إذا لم تكن هناك بيانات طلب، توجه للصفحة الرئيسية
      navigate('/', { replace: true });
      return;
    }
    setOrder(orderData);
  }, [location.state, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h1>
          <p className="text-lg text-gray-600 mb-4">
            شكراً لك على طلبك. سنتواصل معك قريباً لتأكيد التفاصيل.
          </p>
          {order.isGuestOrder && (
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
              <User className="w-4 h-4 ml-2" />
              طلب ضيف
            </div>
          )}
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">تفاصيل الطلب</h2>
              <div className="text-right">
                <p className="text-sm text-gray-500">رقم الطلب</p>
                <p className="font-mono text-lg font-semibold text-blue-600">#{order.id}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 ml-2" />
                  معلومات العميل
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 ml-2" />
                    <span className="text-gray-900">{order.customerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 ml-2" />
                    <span className="text-gray-900" dir="ltr">{order.customerPhone}</span>
                  </div>
                  {order.customerEmail && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 ml-2" />
                      <span className="text-gray-900" dir="ltr">{order.customerEmail}</span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 ml-2 mt-1" />
                    <div>
                      <p className="text-gray-900">{order.address}</p>
                      <p className="text-gray-600 text-sm">{order.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 ml-2" />
                  معلومات الطلب
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 ml-2" />
                    <span className="text-gray-900">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 text-gray-400 ml-2" />
                    <span className="text-gray-900">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full ml-3"></div>
                    <span className="text-gray-900">
                      {order.status === 'pending' ? 'في انتظار التأكيد' : order.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ShoppingBag className="w-5 w-5 ml-2" />
              المنتجات المطلوبة ({order.items.length})
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 space-x-reverse p-4 border border-gray-100 rounded-lg">
                  <img
                    src={buildImageUrl(item.productImage)}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {item.productName}
                    </h3>
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <div className="mt-1">
                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                          <span key={key} className="text-sm text-gray-500 block">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        الكمية: {item.quantity} × {item.price.toFixed(2)} ر.س
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {item.totalPrice.toFixed(2)} ر.س
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">ملخص الطلب</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>المجموع الفرعي:</span>
                <span>{order.totalAmount.toFixed(2)} ر.س</span>
              </div>
              
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>الخصم:</span>
                  <span>-{order.couponDiscount.toFixed(2)} ر.س</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-600">
                <span>رسوم الشحن:</span>
                <span>{order.deliveryFee.toFixed(2)} ر.س</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>المجموع الإجمالي:</span>
                  <span className="text-blue-600">{order.finalAmount.toFixed(2)} ر.س</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">الخطوات التالية</h3>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold ml-3 mt-0.5">
                1
              </div>
              <p>سنتواصل معك خلال 24 ساعة لتأكيد تفاصيل الطلب</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold ml-3 mt-0.5">
                2
              </div>
              <p>سيتم تجهيز طلبك وشحنه خلال 2-3 أيام عمل</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold ml-3 mt-0.5">
                3
              </div>
              <p>ستتلقى رسالة نصية عند وصول الطلب للتوصيل</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5 ml-2" />
            العودة للصفحة الرئيسية
          </Link>
          
          <Link
            to="/products"
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 ml-2" />
            تصفح المنتجات
          </Link>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8 p-6 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">هل تحتاج مساعدة؟</h4>
          <p className="text-gray-600 mb-4">تواصل معنا في أي وقت</p>
          <div className="flex justify-center space-x-6 space-x-reverse">
            <a href="tel:+966500000000" className="flex items-center text-blue-600 hover:text-blue-800">
              <Phone className="w-4 h-4 ml-1" />
              <span dir="ltr">+966 50 000 0000</span>
            </a>
            <a href="mailto:support@perfum-sa.com" className="flex items-center text-blue-600 hover:text-blue-800">
              <Mail className="w-4 h-4 ml-1" />
              <span dir="ltr">support@perfum-sa.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou; 
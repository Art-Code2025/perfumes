import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { couponsAPI } from '../utils/api';

interface Coupon {
  id?: number;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
  usageLimit?: number;
  usedCount?: number;
  expiryDate?: string;
  isActive: boolean;
}

const CouponForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [coupon, setCoupon] = useState<Coupon>({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    maxDiscount: 0,
    minOrderValue: 0,
    usageLimit: 0,
    usedCount: 0,
    expiryDate: '',
    isActive: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      fetchCoupon(parseInt(id));
    }
  }, [isEdit, id]);

  const fetchCoupon = async (couponId: number) => {
    try {
      setLoading(true);
      const response = await couponsAPI.getById(couponId);
      if (response.success) {
        setCoupon(response.data);
      } else {
        toast.error('الكوبون غير موجود');
        navigate('/admin/coupons');
      }
    } catch (error) {
      console.error('Error fetching coupon:', error);
      toast.error('فشل في جلب بيانات الكوبون');
      navigate('/admin/coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coupon.code || !coupon.name || coupon.value <= 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      const couponData = {
        ...coupon,
        value: Number(coupon.value),
        maxDiscount: Number(coupon.maxDiscount) || null,
        minOrderValue: Number(coupon.minOrderValue) || null,
        usageLimit: Number(coupon.usageLimit) || null
      };

      let response;
      if (isEdit && id) {
        response = await couponsAPI.update(parseInt(id), couponData);
      } else {
        response = await couponsAPI.create(couponData);
      }

      if (response.success) {
        toast.success(isEdit ? 'تم تحديث الكوبون بنجاح' : 'تم إضافة الكوبون بنجاح');
        navigate('/admin/coupons');
      } else {
        toast.error(response.message || 'فشل في حفظ الكوبون');
      }
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast.error(error.message || 'خطأ في حفظ الكوبون');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الكوبون...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'تعديل الكوبون' : 'إضافة كوبون جديد'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">معلومات الكوبون</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كود الكوبون *
                </label>
                <input
                  type="text"
                  value={coupon.code}
                  onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SAVE20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الكوبون *
                </label>
                <input
                  type="text"
                  value={coupon.name}
                  onChange={(e) => setCoupon({ ...coupon, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="خصم 20%"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الكوبون
                </label>
                <textarea
                  value={coupon.description}
                  onChange={(e) => setCoupon({ ...coupon, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="وصف مختصر للكوبون"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الخصم *
                </label>
                <select
                  value={coupon.type}
                  onChange={(e) => setCoupon({ ...coupon, type: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ر.س)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قيمة الخصم *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={coupon.value}
                  onChange={(e) => setCoupon({ ...coupon, value: parseFloat(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={coupon.type === 'percentage' ? '20' : '50.00'}
                  required
                />
              </div>

              {coupon.type === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحد الأقصى للخصم (ر.س)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={coupon.maxDiscount || ''}
                    onChange={(e) => setCoupon({ ...coupon, maxDiscount: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100.00"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأدنى لقيمة الطلب (ر.س)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={coupon.minOrderValue || ''}
                  onChange={(e) => setCoupon({ ...coupon, minOrderValue: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="200.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حد الاستخدام
                </label>
                <input
                  type="number"
                  value={coupon.usageLimit || ''}
                  onChange={(e) => setCoupon({ ...coupon, usageLimit: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الانتهاء
                </label>
                <input
                  type="date"
                  value={coupon.expiryDate || ''}
                  onChange={(e) => setCoupon({ ...coupon, expiryDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={coupon.isActive}
                    onChange={(e) => setCoupon({ ...coupon, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="mr-2 text-sm font-medium text-gray-700">
                    الكوبون نشط
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 space-x-reverse">
            <button
              type="button"
              onClick={() => navigate('/admin/coupons')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  {isEdit ? 'حفظ التغييرات' : 'إضافة الكوبون'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm; 
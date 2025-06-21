import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiCall, API_ENDPOINTS } from '../config/api.js';

interface Category {
  id: string | number;
  name: string;
  description?: string;
}

interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  categoryId: string | number | null;
  mainImage: string;
  detailedImages: string[];
  specifications: { key: string; value: string }[];
  productType: string;
  dynamicOptions: any[];
}

interface ProductFormProps {
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ isEdit: propIsEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = propIsEdit || Boolean(id);

  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    categoryId: null,
    mainImage: '',
    detailedImages: [],
    specifications: [],
    productType: '',
    dynamicOptions: []
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // New specification state
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });

  useEffect(() => {
    console.log('🚀 [ProductForm] Component mounted, isEdit:', isEdit, 'id:', id);
    fetchCategories();
    
    if (isEdit && id) {
      fetchProduct(id);
    }
  }, [isEdit, id]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      console.log('🔄 [ProductForm] Fetching categories...');
      
      const categories = await apiCall(API_ENDPOINTS.CATEGORIES);
      
      console.log('✅ [ProductForm] Categories loaded:', categories.length);
      setCategories(categories);
    } catch (error) {
      console.error('❌ [ProductForm] Error fetching categories:', error);
      toast.error('فشل في جلب التصنيفات');
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      console.log('🔄 [ProductForm] Fetching product:', productId);
      
      const products = await apiCall(API_ENDPOINTS.PRODUCTS);
      
      console.log('📦 [ProductForm] All products loaded:', products.length);
      console.log('🔍 [ProductForm] Looking for product ID:', productId);
      
      const product = products.find((p: Product) => p.id && p.id.toString() === productId.toString());
      
      if (!product) {
        console.error('❌ [ProductForm] Product not found with ID:', productId);
        toast.error('المنتج غير موجود');
        navigate('/admin');
        return;
      }
      
      console.log('✅ [ProductForm] Product found:', product.name);
      setFormData(product);
      
    } catch (error) {
      console.error('❌ [ProductForm] Error fetching product:', error);
      toast.error('فشل في جلب بيانات المنتج');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare the data
      const productData = {
        ...formData,
        price: parseFloat(formData.price.toString()) || 0,
        originalPrice: parseFloat(formData.originalPrice?.toString() || '0') || 0,
        stock: parseInt(formData.stock?.toString() || '0') || 0,
        categoryId: formData.categoryId || null,
        mainImage: formData.mainImage || '',
        detailedImages: formData.detailedImages || [],
        specifications: formData.specifications || [],
        productType: formData.productType || '',
        dynamicOptions: formData.dynamicOptions || []
      };
      
      console.log('💾 [ProductForm] Saving product data:', productData);

      if (isEdit && id) {
        // Update existing product using PUT
        await apiCall(API_ENDPOINTS.PRODUCT_BY_ID(id), {
          method: 'PUT',
          body: JSON.stringify(productData)
        });
        toast.success('تم تحديث المنتج بنجاح');
      } else {
        // Create new product using POST
        await apiCall(API_ENDPOINTS.PRODUCTS, {
          method: 'POST',
          body: JSON.stringify(productData)
        });
        toast.success('تم إضافة المنتج بنجاح');
      }
      
      // Trigger refresh in main app
      window.dispatchEvent(new Event('productsUpdated'));
      navigate('/admin');
      
    } catch (error) {
      console.error('❌ [ProductForm] Error saving product:', error);
      toast.error(isEdit ? 'فشل في تحديث المنتج' : 'فشل في إضافة المنتج');
    } finally {
      setLoading(false);
    }
  };

  const addSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setFormData({
        ...formData,
        specifications: [...formData.specifications, { ...newSpec }]
      });
      setNewSpec({ key: '', value: '' });
    }
  };

  const removeSpecification = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-white">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                {isEdit ? 'تحديث بيانات المنتج' : 'إنشاء منتج جديد في المتجر'}
              </p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              ← العودة للداشبورد
            </button>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Information Card */}
          <div className="bg-gray-900 rounded-lg sm:rounded-xl border border-gray-800 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <span className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-sm mr-3">📦</span>
              معلومات المنتج الأساسية
            </h2>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-500 text-sm sm:text-base"
                  placeholder="عباية تخرج فاخرة"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  وصف المنتج *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-500 resize-none text-sm sm:text-base"
                  placeholder="وصف تفصيلي للمنتج..."
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  التصنيف
                </label>
                {loadingCategories ? (
                  <div className="flex items-center text-gray-400">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    جاري تحميل التصنيفات...
                  </div>
                ) : (
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || null })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white text-sm sm:text-base"
                  >
                    <option value="">اختر التصنيف</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="bg-gray-900 rounded-lg sm:rounded-xl border border-gray-800 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <span className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-sm mr-3">💰</span>
              السعر والمخزون
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  السعر الحالي (ر.س) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-500 text-sm sm:text-base"
                  placeholder="299.99"
                  required
                />
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  السعر الأصلي (ر.س)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-500 text-sm sm:text-base"
                  placeholder="399.99"
                />
                <p className="text-xs text-gray-500 mt-1">للعروض والخصومات</p>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الكمية المتاحة
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-500 text-sm sm:text-base"
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-gray-900 rounded-lg sm:rounded-xl border border-gray-800 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <span className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-sm mr-3">🖼️</span>
              صور المنتج
            </h2>
            
            <div className="space-y-4">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الصورة الرئيسية
                </label>
                <input
                  type="text"
                  value={formData.mainImage}
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-500 text-sm sm:text-base"
                  placeholder="رابط الصورة أو اسم الملف"
                />
                <p className="text-xs text-gray-500 mt-1">يمكنك إدخال رابط الصورة أو اسم الملف في مجلد images</p>
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نوع المنتج
                </label>
                <input
                  type="text"
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-500 text-sm sm:text-base"
                  placeholder="عباية، أوشحة، كاب، إلخ..."
                />
              </div>
            </div>
          </div>

          {/* Specifications Card */}
          <div className="bg-gray-900 rounded-lg sm:rounded-xl border border-gray-800 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <span className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-sm mr-3">📋</span>
              مواصفات المنتج
            </h2>
            
            {/* Add New Specification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={newSpec.key}
                onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-500 text-sm sm:text-base"
                placeholder="اسم المواصفة (مثل: المقاس)"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpec.value}
                  onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-500 text-sm sm:text-base"
                  placeholder="القيمة (مثل: XL)"
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-4 py-2.5 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  إضافة
                </button>
              </div>
            </div>

            {/* Current Specifications */}
            <div className="space-y-2">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex items-center justify-between bg-black border border-gray-700 rounded-lg p-3">
                  <div className="flex-1">
                    <span className="text-white font-medium">{spec.key}:</span>
                    <span className="text-gray-300 mr-2">{spec.value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    حذف
                  </button>
                </div>
              ))}
              {formData.specifications.length === 0 && (
                <p className="text-gray-500 text-sm">لا توجد مواصفات مضافة</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-full sm:w-auto px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors text-sm sm:text-base font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base font-medium"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  {isEdit ? 'تحديث المنتج' : 'إضافة المنتج'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
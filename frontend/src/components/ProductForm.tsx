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

const ProductForm: React.FC<ProductFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
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

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      console.log('🔄 [ProductForm] Fetching categories...');
      
      const categories = await apiCall(API_ENDPOINTS.CATEGORIES);
      
      console.log('✅ [ProductForm] Categories loaded:', categories.length);
      console.log('📂 [ProductForm] Categories data:', categories);
      
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
      console.log('🔄 [ProductForm] Fetching product:', productId, 'Type:', typeof productId);
      
      // Fetch all products and find the one we need
      const products = await apiCall(API_ENDPOINTS.PRODUCTS);
      
      console.log('📦 [ProductForm] All products loaded:', products.length);
      console.log('🔍 [ProductForm] Looking for product ID:', productId);
      console.log('📋 [ProductForm] Available product IDs:', products.map((p: Product) => p.id));
      
      // Find product by ID (handle both string and number IDs)
      const product = products.find((p: Product) => p.id.toString() === productId.toString());
      
      if (!product) {
        console.error('❌ [ProductForm] Product not found with ID:', productId);
        toast.error('المنتج غير موجود');
        navigate('/admin/products');
        return;
      }
      
      console.log('✅ [ProductForm] Product found:', product.name);
      setFormData(product);
      
    } catch (error) {
      console.error('❌ [ProductForm] Error fetching product:', error);
      toast.error('فشل في جلب بيانات المنتج');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 [ProductForm] Component mounted, isEdit:', isEdit, 'id:', id);
    
    fetchCategories();
    
    if (isEdit && id) {
      fetchProduct(id);
    }
  }, [isEdit, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
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
        // Update existing product using PUT to /products/{id}
        await apiCall(API_ENDPOINTS.PRODUCT_BY_ID(id), {
          method: 'PUT',
          body: JSON.stringify(productData)
        });
        toast.success('تم تحديث المنتج بنجاح');
      } else {
        // Create new product using POST method
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            اسم المنتج *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="أدخل اسم المنتج"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            الوصف *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="أدخل وصف المنتج"
          />
        </div>

        {/* Price and Original Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              السعر *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || ''}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
              السعر الأصلي
            </label>
            <input
              type="number"
              id="originalPrice"
              name="originalPrice"
              value={formData.originalPrice || ''}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Stock and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              الكمية المتوفرة
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock || ''}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
              التصنيف
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId || ''}
              onChange={handleInputChange}
              disabled={loadingCategories}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر التصنيف</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {loadingCategories && (
              <p className="text-sm text-gray-500 mt-1">جاري تحميل التصنيفات...</p>
            )}
          </div>
        </div>

        {/* Main Image */}
        <div>
          <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-2">
            الصورة الرئيسية (URL)
          </label>
          <input
            type="url"
            id="mainImage"
            name="mainImage"
            value={formData.mainImage || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Product Type */}
        <div>
          <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-2">
            نوع المنتج
          </label>
          <input
            type="text"
            id="productType"
            name="productType"
            value={formData.productType || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="أدخل نوع المنتج"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'جاري الحفظ...' : (isEdit ? 'تحديث المنتج' : 'إضافة المنتج')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
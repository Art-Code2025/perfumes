import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Plus, Minus, Upload, X, Save } from 'lucide-react';
import { buildImageUrl, apiCall, API_ENDPOINTS } from '../config/api';

interface DynamicOption {
  name: string;
  type: 'text' | 'select' | 'number' | 'color';
  required: boolean;
  options?: string[];
}

interface Specification {
  name: string;
  value: string;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: string | number; // Support both string and number IDs
  productType?: string;
  dynamicOptions?: DynamicOption[];
  mainImage: string;
  detailedImages?: string[];
  specifications?: Specification[];
}

interface Category {
  id: string | number; // Support both string and number IDs
  name: string;
  description: string;
  image: string;
  createdAt?: string;
}

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    categoryId: '0', // Use string '0' as default
    productType: '',
    dynamicOptions: [],
    mainImage: '',
    detailedImages: [],
    specifications: []
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [detailedImageFiles, setDetailedImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Load categories
  useEffect(() => {
    fetchCategories();
    
    // Listen for category updates
    const handleCategoriesUpdated = () => {
      console.log('📂 Categories updated event received, refreshing...');
      fetchCategories();
    };
    
    window.addEventListener('categoriesUpdated', handleCategoriesUpdated);
    
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdated);
    };
  }, []);

  // Load product if editing
  useEffect(() => {
    if (isEdit && id) {
      console.log('🔄 ProductForm: Loading product for edit, ID:', id, 'Type:', typeof id);
      fetchProduct(id); // Pass ID as string, let fetchProduct handle the conversion
    }
  }, [isEdit, id]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      console.log('🔄 Fetching categories for product form...');
      
      // Force fallback mode to ensure we get data
      const categories = await apiCall(API_ENDPOINTS.CATEGORIES, {
        headers: {
          'X-Force-Fallback': 'true'
        }
      });
      
      console.log('✅ Categories loaded:', categories.length);
      console.log('📂 Categories data:', categories);
      
      setCategories(categories);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      toast.error('فشل في جلب التصنيفات');
      
      // Fallback to hardcoded categories
      const fallbackCategories = [
        {
          id: 'c1',
          name: 'أوشحة التخرج',
          description: 'أوشحة تخرج أنيقة بألوان وتصاميم متنوعة',
          image: 'categories/graduation-sashes.jpg'
        },
        {
          id: 'c2',
          name: 'عبايات التخرج',
          description: 'عبايات تخرج رسمية للمراسم الأكاديمية',
          image: 'categories/graduation-gowns.jpg'
        },
        {
          id: 'c3',
          name: 'الأزياء المدرسية',
          description: 'ملابس مدرسية عالية الجودة ومريحة',
          image: 'categories/school-uniforms.jpg'
        }
      ];
      
      console.log('🔄 Using fallback categories:', fallbackCategories.length);
      setCategories(fallbackCategories);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      console.log('🔄 Fetching product:', productId, 'Type:', typeof productId);
      
      // Force fallback mode to ensure we get data
      const products = await apiCall(API_ENDPOINTS.PRODUCTS, {
        headers: {
          'X-Force-Fallback': 'true'
        }
      });
      
      console.log('📦 All products loaded:', products.length);
      
      const product = products.find((p: any) => {
        const productIdStr = p.id.toString();
        const searchIdStr = productId.toString();
        console.log('🔍 Comparing:', productIdStr, 'vs', searchIdStr);
        return productIdStr === searchIdStr;
      });
      
      if (!product) {
        console.error('❌ Product not found with ID:', productId);
        console.log('📋 Available product IDs:', products.map((p: any) => p.id));
        throw new Error('المنتج غير موجود');
      }
      
      console.log('✅ Product loaded:', product.name, 'ID:', product.id);
      
      setProduct({
        ...product,
        categoryId: product.categoryId ? product.categoryId.toString() : '0', // Ensure categoryId is string for form
        originalPrice: product.originalPrice || 0,
        specifications: product.specifications || [],
        dynamicOptions: product.dynamicOptions || [],
        detailedImages: product.detailedImages || []
      });
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      toast.error('فشل في جلب بيانات المنتج');
      navigate('/admin/products'); // Navigate to products list instead of admin root
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async () => {
    const uploadedImages: string[] = [];
    
    try {
      setUploading(true);
      console.log('📸 Processing images...');

      // For now, we'll use placeholder images or data URLs
      // In a real app, you would implement actual file upload to a service like Cloudinary
      
      if (mainImageFile) {
        // Convert to data URL for immediate use
        const dataUrl = await fileToDataUrl(mainImageFile);
        uploadedImages.push(dataUrl);
        console.log('✅ Main image processed');
      }

      if (detailedImageFiles.length > 0) {
        // Convert detailed images to data URLs
        for (const file of detailedImageFiles) {
          const dataUrl = await fileToDataUrl(file);
          uploadedImages.push(dataUrl);
        }
        console.log('✅ Detailed images processed:', detailedImageFiles.length);
      }

      return uploadedImages;
    } catch (error) {
      console.error('❌ Error processing images:', error);
      toast.error('فشل في معالجة الصور');
      return [];
    } finally {
      setUploading(false);
    }
  };

  // Helper function to convert file to data URL
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.name || !product.description || product.price <= 0 || product.categoryId === '0' || product.categoryId === 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      let updatedProduct = { ...product };

      // Process images if any
      const uploadedImages = await uploadImages();
      if (uploadedImages.length > 0) {
        updatedProduct.mainImage = uploadedImages[0];
        if (uploadedImages.length > 1) {
          updatedProduct.detailedImages = uploadedImages.slice(1);
        }
      } else if (!updatedProduct.mainImage) {
        // Set a default image if no image is provided
        updatedProduct.mainImage = 'products/default-product.jpg';
      }

      // Prepare product data
      const productData = {
        ...updatedProduct,
        price: Number(updatedProduct.price),
        originalPrice: Number(updatedProduct.originalPrice) || null,
        stock: Number(updatedProduct.stock),
        categoryId: Number(updatedProduct.categoryId) // Convert to number for API
      };

      console.log('💾 Saving product:', productData);

      let result;
      if (isEdit && id) {
        // For edit mode, we need to use PUT request
        result = await apiCall(API_ENDPOINTS.PRODUCTS, {
          method: 'PUT',
          body: JSON.stringify({ ...productData, id: parseInt(id) })
        });
      } else {
        result = await apiCall(API_ENDPOINTS.PRODUCTS, {
          method: 'POST',
          body: JSON.stringify(productData)
        });
      }

      console.log('✅ Product saved successfully:', result);
      toast.success(isEdit ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
      
      // Trigger refresh in main app
      window.dispatchEvent(new Event('productsUpdated'));
      navigate('/admin');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'خطأ في حفظ المنتج');
    } finally {
      setLoading(false);
    }
  };

  const addDynamicOption = () => {
    setProduct({
      ...product,
      dynamicOptions: [
        ...(product.dynamicOptions || []),
        { name: '', type: 'text', required: false, options: [] }
      ]
    });
  };

  const removeDynamicOption = (index: number) => {
    const newOptions = [...(product.dynamicOptions || [])];
    newOptions.splice(index, 1);
    setProduct({ ...product, dynamicOptions: newOptions });
  };

  const updateDynamicOption = (index: number, field: keyof DynamicOption, value: any) => {
    const newOptions = [...(product.dynamicOptions || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setProduct({ ...product, dynamicOptions: newOptions });
  };

  const addSpecification = () => {
    setProduct({
      ...product,
      specifications: [
        ...(product.specifications || []),
        { name: '', value: '' }
      ]
    });
  };

  const removeSpecification = (index: number) => {
    const newSpecs = [...(product.specifications || [])];
    newSpecs.splice(index, 1);
    setProduct({ ...product, specifications: newSpecs });
  };

  const updateSpecification = (index: number, field: keyof Specification, value: string) => {
    const newSpecs = [...(product.specifications || [])];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setProduct({ ...product, specifications: newSpecs });
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المنتج...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/products')}
                className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">المعلومات الأساسية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل اسم المنتج"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التصنيف *
                </label>
                {loadingCategories ? (
                  <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    جاري تحميل التصنيفات...
                  </div>
                ) : (
                  <select
                    value={product.categoryId}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      console.log('🔄 Selected category value:', selectedValue);
                      const newCategoryId = selectedValue === '0' ? '0' : selectedValue;
                      console.log('🎯 Setting categoryId to:', newCategoryId);
                      setProduct({ ...product, categoryId: newCategoryId });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="0">
                      {categories.length === 0 ? 'لا توجد تصنيفات متاحة' : 'اختر التصنيف'}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
                
                {!loadingCategories && categories.length === 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600 mb-2">
                      لم يتم العثور على تصنيفات. يرجى إضافة تصنيفات أولاً.
                    </p>
                    <button
                      type="button"
                      onClick={fetchCategories}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر الأصلي (اختياري)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={product.originalPrice || ''}
                  onChange={(e) => setProduct({ ...product, originalPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية المتوفرة *
                </label>
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المنتج (اختياري)
                </label>
                <input
                  type="text"
                  value={product.productType || ''}
                  onChange={(e) => setProduct({ ...product, productType: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: ملابس، إلكترونيات"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المنتج *
              </label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="اكتب وصفاً مفصلاً للمنتج"
                required
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">الصور</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصورة الرئيسية
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {product.mainImage && !mainImageFile ? (
                    <div className="relative">
                      <img
                        src={buildImageUrl(product.mainImage)}
                        alt="الصورة الرئيسية"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                      <p className="mt-2 text-sm text-gray-600">الصورة الحالية</p>
                    </div>
                  ) : mainImageFile ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(mainImageFile)}
                        alt="الصورة الجديدة"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setMainImageFile(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">اختر الصورة الرئيسية</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
                    className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صور إضافية
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">اختر صور إضافية</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setDetailedImageFiles(Array.from(e.target.files || []))}
                    className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                
                {/* Preview detailed images */}
                {detailedImageFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {detailedImageFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = [...detailedImageFiles];
                            newFiles.splice(index, 1);
                            setDetailedImageFiles(newFiles);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 space-x-reverse">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading || uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  {uploading ? 'جاري رفع الصور...' : 'جاري الحفظ...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  {isEdit ? 'حفظ التغييرات' : 'إضافة المنتج'}
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
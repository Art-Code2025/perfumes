import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Plus, Minus, Upload, X, Save } from 'lucide-react';
import { productsAPI, categoriesAPI, uploadAPI } from '../utils/api';
import { buildImageUrl } from '../config/api';

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
  categoryId: number;
  productType?: string;
  dynamicOptions?: DynamicOption[];
  mainImage: string;
  detailedImages?: string[];
  specifications?: Specification[];
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
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
    categoryId: 0,
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
  }, []);

  // Load product if editing
  useEffect(() => {
    if (isEdit && id) {
      fetchProduct(parseInt(id));
    }
  }, [isEdit, id]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoriesAPI.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('فشل في جلب التصنيفات');
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProduct = async (productId: number) => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(productId);
      if (response.success) {
        setProduct(response.data);
      } else {
        toast.error('المنتج غير موجود');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('فشل في جلب بيانات المنتج');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async () => {
    const uploadedImages: string[] = [];
    
    try {
      setUploading(true);

      // Upload main image
      if (mainImageFile) {
        const mainImageResponse = await uploadAPI.single(mainImageFile, 'products');
        if (mainImageResponse.success) {
          uploadedImages.push(mainImageResponse.data.url);
        }
      }

      // Upload detailed images
      if (detailedImageFiles.length > 0) {
        const detailedImagesResponse = await uploadAPI.multiple(detailedImageFiles, 'products');
        if (detailedImagesResponse.success) {
          uploadedImages.push(...detailedImagesResponse.data.urls);
        }
      }

      return uploadedImages;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('فشل في رفع الصور');
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.name || !product.description || product.price <= 0 || product.categoryId === 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      let updatedProduct = { ...product };

      // Upload images if any
      const uploadedImages = await uploadImages();
      if (uploadedImages.length > 0) {
        updatedProduct.mainImage = uploadedImages[0];
        if (uploadedImages.length > 1) {
          updatedProduct.detailedImages = uploadedImages.slice(1);
        }
      }

      // Prepare product data
      const productData = {
        ...updatedProduct,
        price: Number(updatedProduct.price),
        originalPrice: Number(updatedProduct.originalPrice) || null,
        stock: Number(updatedProduct.stock),
        categoryId: Number(updatedProduct.categoryId)
      };

      let response;
      if (isEdit && id) {
        response = await productsAPI.update(parseInt(id), productData);
      } else {
        response = await productsAPI.create(productData);
      }

      if (response.success) {
        toast.success(isEdit ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
        navigate('/admin/products');
      } else {
        toast.error(response.message || 'فشل في حفظ المنتج');
      }
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
                <select
                  value={product.categoryId}
                  onChange={(e) => setProduct({ ...product, categoryId: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value={0}>اختر التصنيف</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import { categoriesAPI, uploadAPI } from '../utils/api';
import { buildImageUrl } from '../config/api';

// تعريف نوع التصنيف
interface Category {
  id?: number;
  name: string;
  description: string;
  image: string;
}

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [category, setCategory] = useState<Category>({
    name: '',
    description: '',
    image: ''
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      fetchCategory(parseInt(id));
    }
  }, [isEdit, id]);

  const fetchCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getById(categoryId);
      if (response.success) {
        setCategory(response.data);
      } else {
        toast.error('التصنيف غير موجود');
        navigate('/admin/categories');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('فشل في جلب بيانات التصنيف');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      setUploading(true);
      const response = await uploadAPI.single(imageFile, 'categories');
      if (response.success) {
        return response.data.url;
      } else {
        toast.error('فشل في رفع الصورة');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('فشل في رفع الصورة');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.name || !category.description) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      let updatedCategory = { ...category };

      // Upload image if new one is selected
      if (imageFile) {
        const imageUrl = await uploadImage();
        if (imageUrl) {
          updatedCategory.image = imageUrl;
        }
      }

      let response;
      if (isEdit && id) {
        response = await categoriesAPI.update(parseInt(id), updatedCategory);
      } else {
        response = await categoriesAPI.create(updatedCategory);
      }

      if (response.success) {
        toast.success(isEdit ? 'تم تحديث التصنيف بنجاح' : 'تم إضافة التصنيف بنجاح');
        navigate('/admin/categories');
      } else {
        toast.error(response.message || 'فشل في حفظ التصنيف');
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'خطأ في حفظ التصنيف');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات التصنيف...</p>
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
                onClick={() => navigate('/admin/categories')}
                className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">معلومات التصنيف</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم التصنيف *
                </label>
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => setCategory({ ...category, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل اسم التصنيف"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة التصنيف
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {category.image && !imageFile ? (
                    <div className="relative">
                      <img
                        src={buildImageUrl(category.image)}
                        alt="صورة التصنيف"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                      <p className="mt-2 text-sm text-gray-600">الصورة الحالية</p>
                    </div>
                  ) : imageFile ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="الصورة الجديدة"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImageFile(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">اختر صورة التصنيف</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف التصنيف *
              </label>
              <textarea
                value={category.description}
                onChange={(e) => setCategory({ ...category, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="اكتب وصفاً للتصنيف"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 space-x-reverse">
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
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
                  {uploading ? 'جاري رفع الصورة...' : 'جاري الحفظ...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  {isEdit ? 'حفظ التغييرات' : 'إضافة التصنيف'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm; 
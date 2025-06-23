import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { perfumeCategories, perfumeProducts } from '../utils/perfumeDataScript';
import { Upload, Package, Tag, CheckCircle, AlertCircle, Loader, Sparkles } from 'lucide-react';
import { runPerfumeDataScript } from '../utils/runPerfumeScript';

interface ImportProgress {
  categories: { completed: number; total: number; errors: string[] };
  products: { completed: number; total: number; errors: string[] };
}

interface Category {
  name: string;
}

interface Product {
  name: string;
}

const BulkDataImporter: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress>({
    categories: { completed: 0, total: 0, errors: [] },
    products: { completed: 0, total: 0, errors: [] }
  });
  const [showProgress, setShowProgress] = useState(false);

  // Simulate API delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const importCategories = async () => {
    console.log('🏷️ Starting category import...');
    const total = perfumeCategories.length;
    setProgress(prev => ({ ...prev, categories: { completed: 0, total, errors: [] } }));

    for (let i = 0; i < perfumeCategories.length; i++) {
      const category = perfumeCategories[i];
      try {
        // Simulate API call
        await delay(300);
        
        // Get existing categories from localStorage
        const existingCategories = JSON.parse(localStorage.getItem('categories') || '[]');
        
        // Check if category already exists
        const exists = existingCategories.find((cat: any) => cat.name === category.name);
        
        if (!exists) {
          const newCategory = {
            ...category,
            id: Date.now() + i,
            createdAt: new Date().toISOString()
          };
          
          existingCategories.push(newCategory);
          localStorage.setItem('categories', JSON.stringify(existingCategories));
          
          console.log(`✅ Added category: ${category.name}`);
        } else {
          console.log(`⚠️ Category already exists: ${category.name}`);
        }
        
        setProgress(prev => ({
          ...prev,
          categories: { ...prev.categories, completed: i + 1 }
        }));
        
      } catch (error) {
        console.error(`❌ Error importing category ${category.name}:`, error);
        setProgress(prev => ({
          ...prev,
          categories: { 
            ...prev.categories, 
            completed: i + 1,
            errors: [...prev.categories.errors, `فشل في إضافة ${category.name}`]
          }
        }));
      }
    }
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('categoriesUpdated'));
    console.log('🎉 Categories import completed!');
  };

  const importProducts = async () => {
    console.log('📦 Starting products import...');
    const total = perfumeProducts.length;
    setProgress(prev => ({ ...prev, products: { completed: 0, total, errors: [] } }));

    // Get categories for mapping
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    for (let i = 0; i < perfumeProducts.length; i++) {
      const product = perfumeProducts[i];
      try {
        // Simulate API call
        await delay(200);
        
        // Find category ID
        const category = categories.find((cat: any) => cat.name === product.categoryName);
        const categoryId = category ? category.id : null;
        
        // Get existing products from localStorage
        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Check if product already exists
        const exists = existingProducts.find((prod: any) => prod.name === product.name);
        
        if (!exists) {
          const newProduct = {
            name: product.name,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            stock: product.stock,
            categoryId: categoryId,
            mainImage: product.mainImage,
            rating: product.rating || 4,
            brand: product.brand,
            specifications: product.specifications || [],
            createdAt: new Date().toISOString(),
            id: Date.now() + i
          };
          
          existingProducts.push(newProduct);
          localStorage.setItem('products', JSON.stringify(existingProducts));
          
          console.log(`✅ Added product: ${product.name}`);
        } else {
          console.log(`⚠️ Product already exists: ${product.name}`);
        }
        
        setProgress(prev => ({
          ...prev,
          products: { ...prev.products, completed: i + 1 }
        }));
        
      } catch (error) {
        console.error(`❌ Error importing product ${product.name}:`, error);
        setProgress(prev => ({
          ...prev,
          products: { 
            ...prev.products, 
            completed: i + 1,
            errors: [...prev.products.errors, `فشل في إضافة ${product.name}`]
          }
        }));
      }
    }
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('productsUpdated'));
    console.log('🎉 Products import completed!');
  };

  const handleBulkImport = async () => {
    if (isImporting) return;
    
    setIsImporting(true);
    setShowProgress(true);
    
    try {
      toast.info('🚀 بدء استيراد البيانات...');
      
      // Import categories first
      await importCategories();
      toast.success(`✅ تم استيراد ${perfumeCategories.length} تصنيف بنجاح!`);
      
      // Then import products
      await importProducts();
      toast.success(`✅ تم استيراد ${perfumeProducts.length} منتج بنجاح!`);
      
      toast.success('🎉 تم استيراد جميع البيانات بنجاح!');
      
    } catch (error) {
      console.error('❌ Bulk import error:', error);
      toast.error('❌ حدث خطأ أثناء استيراد البيانات');
    } finally {
      setIsImporting(false);
    }
  };

  const clearAllData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      localStorage.removeItem('categories');
      localStorage.removeItem('products');
      window.dispatchEvent(new CustomEvent('categoriesUpdated'));
      window.dispatchEvent(new CustomEvent('productsUpdated'));
      toast.success('تم حذف جميع البيانات بنجاح');
      setShowProgress(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-6 h-6 text-[#8B5A3C]" />
        <h2 className="text-2xl font-bold text-[#6B4226]">استيراد البيانات المجمعة</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Tag className="w-5 h-5 text-[#8B5A3C]" />
            <h3 className="font-semibold text-[#6B4226]">التصنيفات</h3>
          </div>
          <p className="text-[#A67C52] text-sm mb-2">
            سيتم إضافة {perfumeCategories.length} تصنيف للعطور
          </p>
          <ul className="text-xs text-[#8B5A3C] space-y-1">
            {perfumeCategories.slice(0, 4).map((cat: Category, i: number) => (
              <li key={i}>• {cat.name}</li>
            ))}
            {perfumeCategories.length > 4 && (
              <li className="text-[#A67C52]">... و {perfumeCategories.length - 4} تصنيف آخر</li>
            )}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-5 h-5 text-[#8B5A3C]" />
            <h3 className="font-semibold text-[#6B4226]">المنتجات</h3>
          </div>
          <p className="text-[#A67C52] text-sm mb-2">
            سيتم إضافة {perfumeProducts.length} منتج عطر فاخر
          </p>
          <ul className="text-xs text-[#8B5A3C] space-y-1">
            {perfumeProducts.slice(0, 4).map((prod: Product, i: number) => (
              <li key={i}>• {prod.name}</li>
            ))}
            {perfumeProducts.length > 4 && (
              <li className="text-[#A67C52]">... و {perfumeProducts.length - 4} منتج آخر</li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleBulkImport}
          disabled={isImporting}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
            isImporting
              ? 'bg-[#C4A484] cursor-not-allowed'
              : 'bg-gradient-to-r from-[#8B5A3C] to-[#A67C52] hover:from-[#6B4226] hover:to-[#8B5A3C] text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isImporting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              جاري الاستيراد...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              استيراد جميع البيانات ({perfumeCategories.length + perfumeProducts.length} عنصر)
            </>
          )}
        </button>

        <button
          onClick={runPerfumeDataScript}
          disabled={isImporting}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          100 منتج فاخر
        </button>

        <button
          onClick={clearAllData}
          disabled={isImporting}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
        >
          مسح جميع البيانات
        </button>
      </div>

      {showProgress && (
        <div className="bg-[#FAF8F5] rounded-lg p-4">
          <h3 className="font-semibold text-[#6B4226] mb-4">تقدم الاستيراد</h3>
          
          {/* Categories Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#8B5A3C]">التصنيفات</span>
              <span className="text-sm text-[#A67C52]">
                {progress.categories.completed}/{progress.categories.total}
              </span>
            </div>
            <div className="w-full bg-[#E5D5C8] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#8B5A3C] to-[#A67C52] h-2 rounded-full transition-all duration-300"
                style={{
                  width: progress.categories.total > 0 
                    ? `${(progress.categories.completed / progress.categories.total) * 100}%` 
                    : '0%'
                }}
              />
            </div>
            {progress.categories.errors.length > 0 && (
              <div className="mt-2">
                {progress.categories.errors.map((error, i) => (
                  <div key={i} className="flex items-center gap-2 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Products Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#8B5A3C]">المنتجات</span>
              <span className="text-sm text-[#A67C52]">
                {progress.products.completed}/{progress.products.total}
              </span>
            </div>
            <div className="w-full bg-[#E5D5C8] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#A67C52] to-[#C4A484] h-2 rounded-full transition-all duration-300"
                style={{
                  width: progress.products.total > 0 
                    ? `${(progress.products.completed / progress.products.total) * 100}%` 
                    : '0%'
                }}
              />
            </div>
            {progress.products.errors.length > 0 && (
              <div className="mt-2">
                {progress.products.errors.slice(0, 5).map((error, i) => (
                  <div key={i} className="flex items-center gap-2 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </div>
                ))}
                {progress.products.errors.length > 5 && (
                  <div className="text-xs text-[#A67C52] mt-1">
                    ... و {progress.products.errors.length - 5} خطأ آخر
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completion Status */}
          {!isImporting && progress.categories.completed === progress.categories.total && 
           progress.products.completed === progress.products.total && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 rounded-lg text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">تم الانتهاء من استيراد جميع البيانات بنجاح!</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">ملاحظات مهمة:</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• سيتم تجاهل البيانات المكررة تلقائياً</li>
          <li>• يمكنك إضافة المزيد من المنتجات والتصنيفات لاحقاً</li>
          <li>• جميع البيانات محفوظة محلياً في المتصفح</li>
          <li>• يمكنك مسح جميع البيانات والبدء من جديد</li>
        </ul>
      </div>
    </div>
  );
};

export default BulkDataImporter; 
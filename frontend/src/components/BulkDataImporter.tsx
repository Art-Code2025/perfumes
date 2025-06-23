import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Upload, Package, Tag, CheckCircle, AlertCircle, Loader, Sparkles, Trash2, Database, Zap } from 'lucide-react';
import { seedCategories, seedProducts } from '../utils/seedData';

// --- Start Fix: Provide complete mock data and interfaces ---

interface Category {
  id?: number;
  name: string;
  description?: string;
}

interface Product {
  id?: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryName: string;
  rating: number;
  mainImage: string;
  specifications: { name: string; value: string }[];
}

// Create complete mock data - KEEPING a small version for quick testing
const smallScaleCategories: Category[] = [
  { id: 1, name: 'عطور رجالية', description: 'أفخم العطور الرجالية' },
  { id: 2, name: 'عطور نسائية', description: 'أرقى العطور النسائية' }
];

const smallScaleProducts: Product[] = [
  {
    id: 1,
    name: 'عطر رجالي فاخر',
    brand: 'ماركة وهمية',
    description: 'عطر يناسب الرجل العصري.',
    price: 250,
    originalPrice: 300,
    stock: 50,
    categoryName: 'عطور رجالية',
    rating: 4.8,
    mainImage: '/placeholder-image.png',
    specifications: [{ name: 'الحجم', value: '100مل' }]
  },
  {
    id: 2,
    name: 'عطر نسائي جذاب',
    brand: 'ماركة وهمية',
    description: 'عطر يبرز أنوثتك.',
    price: 280,
    stock: 40,
    categoryName: 'عطور نسائية',
    rating: 4.9,
    mainImage: '/placeholder-image.png',
    specifications: [{ name: 'الحجم', value: '75مل' }]
  }
];

// --- End Fix ---

interface ImportProgress {
  categories: { completed: number; total: number; errors: string[] };
  products: { completed: number; total: number; errors: string[] };
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

  const importCategories = async (categoriesToImport: Category[]) => {
    console.log('🏷️ Starting category import...');
    const total = categoriesToImport.length;
    setProgress(prev => ({ ...prev, categories: { completed: 0, total, errors: [] } }));

    for (let i = 0; i < categoriesToImport.length; i++) {
      const category = categoriesToImport[i];
      try {
        // Simulate API call
        await delay(50);
        
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

  const importProducts = async (productsToImport: Product[]) => {
    console.log('📦 Starting products import...');
    const total = productsToImport.length;
    setProgress(prev => ({ ...prev, products: { completed: 0, total, errors: [] } }));

    // Get categories for mapping
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    for (let i = 0; i < productsToImport.length; i++) {
      const product = productsToImport[i];
      try {
        // Simulate API call
        await delay(20);
        
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

  const handleBulkImport = async (scale: 'small' | 'large') => {
    if (isImporting) return;
    
    const categories = scale === 'large' ? seedCategories : smallScaleCategories;
    const products = scale === 'large' ? seedProducts : smallScaleProducts;

    setIsImporting(true);
    setShowProgress(true);
    
    try {
      toast.info(`🚀 بدء استيراد ${scale === 'large' ? 'البيانات الكبيرة' : 'البيانات الصغيرة'}...`);
      
      // Import categories first
      await importCategories(categories);
      toast.success(`✅ تم استيراد ${categories.length} تصنيف بنجاح!`);
      
      // Then import products
      await importProducts(products);
      toast.success(`✅ تم استيراد ${products.length} منتج بنجاح!`);
      
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
      localStorage.removeItem('wishlist');
      localStorage.removeItem('cart');
      localStorage.removeItem('orders');
      localStorage.removeItem('coupons');
      localStorage.removeItem('shippingZones');
      localStorage.removeItem('shippingSettings');
      localStorage.removeItem('customers');
      window.dispatchEvent(new CustomEvent('categoriesUpdated'));
      window.dispatchEvent(new CustomEvent('productsUpdated'));
      toast.success('تم حذف جميع البيانات بنجاح');
      setShowProgress(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-[#8B5A3C]" />
        <h2 className="text-2xl font-bold text-[#6B4226]">إدارة بيانات المتجر</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500" /> استيراد بيانات جديدة</h3>
          <p className="text-sm text-gray-600 mb-4">
            قم بإضافة مجموعة من المنتجات والتصنيفات الجاهزة لتجربة لوحة التحكم.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleBulkImport('large')}
              disabled={isImporting}
              className="w-full flex items-center justify-center gap-2 bg-[#6B4226] text-white px-4 py-3 rounded-lg hover:bg-[#543520] transition-colors disabled:opacity-50"
            >
              {isImporting ? <Loader className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5" />}
              <span>استيراد 100 منتج فاخر</span>
            </button>
            <button
              onClick={() => handleBulkImport('small')}
              disabled={isImporting}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              {isImporting ? <Loader className="animate-spin w-5 h-5" /> : <Package className="w-5 h-5" />}
              <span>استيراد بيانات تجريبية صغيرة</span>
            </button>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-600" /> منطقة الخطر</h3>
           <p className="text-sm text-red-700 mb-4">
            سيؤدي هذا الإجراء إلى حذف جميع المنتجات والتصنيفات والطلبات من الذاكرة المحلية للمتصفح.
          </p>
          <button
            onClick={clearAllData}
            disabled={isImporting}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
            <span>حذف جميع البيانات</span>
          </button>
        </div>
      </div>

      {showProgress && (
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-4">تقدم عملية الاستيراد</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">التصنيفات</span>
                <span className="text-sm font-medium text-gray-500">
                  {progress.categories.completed} / {progress.categories.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(progress.categories.completed / (progress.categories.total || 1)) * 100}%` }}
                ></div>
              </div>
              {progress.categories.errors.length > 0 && (
                <div className="mt-2 text-xs text-red-600">
                  {progress.categories.errors.length} أخطاء
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">المنتجات</span>
                <span className="text-sm font-medium text-gray-500">
                  {progress.products.completed} / {progress.products.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.products.completed / (progress.products.total || 1)) * 100}%` }}
                ></div>
              </div>
              {progress.products.errors.length > 0 && (
                <div className="mt-2 text-xs text-red-600">
                  {progress.products.errors.length} أخطاء
                </div>
              )}
            </div>
          </div>
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
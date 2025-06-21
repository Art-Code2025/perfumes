import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Filter, Grid, List, Package, Sparkles, ChevronDown, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import ProductCard from './ProductCard';
import { createCategorySlug, createProductSlug } from '../utils/slugify';
import { productsAPI, categoriesAPI } from '../utils/api';
import { buildImageUrl } from '../config/api';


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number | null;
  productType?: string;
  dynamicOptions?: any[];
  mainImage: string;
  detailedImages?: string[];
  specifications?: { name: string; value: string }[];
  createdAt?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

const AllProducts: React.FC = () => {
  // تحميل البيانات فوراً من localStorage لتجنب الفلاش
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cachedAllProducts');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('cachedCategories');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cachedAllProducts');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  // No loading state needed
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, searchTerm, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      
      if (response.success) {
        setProducts(response.data);
        // حفظ في localStorage لتجنب الفلاش في المرة القادمة
        localStorage.setItem('cachedAllProducts', JSON.stringify(response.data));
      } else {
        // If API fails, keep cached data
        console.warn('Failed to fetch products from API, using cached data');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('فشل في جلب المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      
      if (response.success) {
        setCategories(response.data);
        // حفظ في localStorage لتجنب الفلاش في المرة القادمة
        localStorage.setItem('cachedCategories', JSON.stringify(response.data));
      } else {
        console.warn('Failed to fetch categories from API, using cached data');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('فشل في جلب التصنيفات');
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    if (selectedCategory) filtered = filtered.filter(product => product.categoryId === selectedCategory);
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    setFilteredProducts(filtered);
  };



  const handleCategoryFilter = (categoryId: number | null) => setSelectedCategory(categoryId);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value);

  // No loading screen - instant display

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">جميع المنتجات</h1>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            اكتشف مجموعتنا الكاملة من المنتجات المتميزة واختر ما يناسبك
          </p>
        </div>
        
        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="relative">
                <Search className="absolute top-1/2 right-3 sm:right-4 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن المنتجات..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pr-10 sm:pr-12 pl-3 sm:pl-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory || ''}
                onChange={(e) => handleCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
              >
                <option value="">جميع التصنيفات</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={handleSort}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
              >
                <option value="name">ترتيب حسب الاسم</option>
                <option value="price-low">السعر: من الأقل إلى الأعلى</option>
                <option value="price-high">السعر: من الأعلى إلى الأقل</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle & Results Count */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-semibold text-sm sm:text-base">عرض:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  جاري التحميل...
                </span>
              ) : (
                <span>عرض {filteredProducts.length} من {products.length} منتج</span>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">جاري تحميل المنتجات...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد منتجات</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory 
                    ? 'لم يتم العثور على منتجات تطابق البحث'
                    : 'لا توجد منتجات متاحة حالياً'
                  }
                </p>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory(null);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    مسح الفلاتر
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { extractIdFromSlug, isValidSlug, createProductSlug, createCategorySlug } from '../utils/slugify';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  ArrowRight, 
  Plus, 
  Minus, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Check,
  Eye,
  Package,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  Sparkles,
  Gift,
  Clock,
  RefreshCw
} from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import { apiCall, API_ENDPOINTS, buildImageUrl } from '../config/api';
import { addToCartUnified } from '../utils/cartUtils';
// استيراد صور جدول المقاسات
import size1Image from '../assets/size1.png';
import size2Image from '../assets/size2.png';
import size3Image from '../assets/size3.png';

interface Product {
  id: string | number; // Support both string and number IDs
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: string | number | null; // Support both string and number IDs
  productType?: string;
  dynamicOptions?: ProductOption[];
  mainImage: string;
  detailedImages: string[];
  sizeGuideImage?: string;
  specifications: { name: string; value: string }[];
  createdAt: string;
}

interface ProductOption {
  optionName: string;
  optionType: 'select' | 'text' | 'number' | 'radio';
  required: boolean;
  options?: OptionValue[];
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

interface OptionValue {
  value: string;
}

interface Category {
  id: string | number; // Support both string and number IDs
  name: string;
  description: string;
}

const ProductDetail: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [attachments, setAttachments] = useState<{
    images: File[];
    text: string;
  }>({
    images: [],
    text: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // استخراج ID من slug أو استخدام id مباشرة
  const productId = slug ? extractIdFromSlug(slug).toString() : id;

  const getSizeGuideImage = (productType: string): string => {
    const sizeGuideImages = {
      'جاكيت': size1Image,
      'عباية تخرج': size2Image, 
      'مريول مدرسي': size3Image
    };
    return sizeGuideImages[productType as keyof typeof sizeGuideImages] || size1Image;
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setError('معرف المنتج غير صحيح');
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      calculatePrice();
    }
  }, [product, selectedOptions]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching product:', productId);
      
      if (!productId) {
        throw new Error('معرف المنتج غير صحيح');
      }
      
      const products = await apiCall(API_ENDPOINTS.PRODUCTS);
      const product = products.find((p: Product) => p.id.toString() === productId.toString());
      
      if (!product) {
        throw new Error('المنتج غير موجود');
      }
      
      setProduct(product);
      setSelectedImage(product.mainImage);
      console.log('✅ Product loaded:', product.name);
      
      // تهيئة الخيارات الافتراضية
      if (product.dynamicOptions && product.dynamicOptions.length > 0) {
        const initialOptions: { [key: string]: string } = {};
        product.dynamicOptions.forEach((option: any) => {
          if (option.options && option.options.length > 0) {
            initialOptions[option.optionName] = option.options[0].value;
          }
        });
        setSelectedOptions(initialOptions);
      }
      
      // جلب معلومات التصنيف - Only if needed
      if (product.categoryId) {
        fetchCategory(product.categoryId);
      }
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      setError('فشل في تحميل المنتج');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async (categoryId: string | number) => {
    try {
      console.log('🔄 Fetching category:', categoryId);
      
      const categories = await apiCall(API_ENDPOINTS.CATEGORIES);
      const category = categories.find((cat: Category) => cat.id.toString() === categoryId.toString());
      
      if (category) {
        setCategory(category);
        console.log('✅ Category loaded:', category.name);
      }
    } catch (error) {
      console.error('❌ Error fetching category:', error);
    }
  };

  const calculatePrice = () => {
    if (!product) return;
    setCalculatedPrice(product.price);
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);
    
    // Clear any previous error for this field
    if (formErrors[optionName]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[optionName];
        return updated;
      });
    }
  };

  const handleAttachmentImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments(prev => ({ ...prev, images: [...prev.images, ...filesArray] }));
    }
  };

  const handleAttachmentTextChange = (text: string) => {
    setAttachments(prev => ({ ...prev, text }));
  };

  const removeAttachmentImage = (index: number) => {
    setAttachments(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (product?.dynamicOptions) {
      product.dynamicOptions.forEach(option => {
        if (option.required && !selectedOptions[option.optionName]) {
          errors[option.optionName] = `${getOptionDisplayName(option.optionName)} مطلوب`;
        }
      });
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getOptionDisplayName = (optionName: string): string => {
    const names: Record<string, string> = {
      nameOnSash: 'الاسم على الوشاح',
      embroideryColor: 'لون التطريز',
      capFabric: 'قماش الكاب',
      size: 'المقاس',
      color: 'اللون',
      capColor: 'لون الكاب',
      dandoshColor: 'لون الدندوش'
    };
    return names[optionName] || optionName;
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product?.stock || 1));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  const addToCart = async () => {
    if (!product || !validateForm()) return;
    
    setAddingToCart(true);
    try {
      const success = await addToCartUnified(
        product.id,
        product.name,
        product.price,
        quantity,
        selectedOptions,
        {}, // optionsPricing
        {
          images: attachments.images.map(file => URL.createObjectURL(file)),
          text: attachments.text
        },
        product
      );
      
      if (success) {
        toast.success('تم إضافة المنتج إلى السلة بنجاح!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('فشل في إضافة المنتج إلى السلة');
    } finally {
      setAddingToCart(false);
    }
  };

  const addToWishlist = async () => {
    if (!product) return;
    
    try {
      // استخدام localStorage للمفضلة (نظام بسيط للضيوف والمستخدمين)
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const productId = product.id;
      
      if (wishlist.includes(productId)) {
        toast.info('المنتج موجود بالفعل في المفضلة');
        return;
      }
      
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      
      // إطلاق أحداث لتحديث الواجهة
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      window.dispatchEvent(new CustomEvent('productAddedToWishlist', { 
        detail: { productId } 
      }));
      
      toast.success(`تم إضافة ${product.name} إلى المفضلة! ❤️`, {
        position: "top-center",
        autoClose: 3000,
        style: {
          background: '#EC4899',
          color: 'white',
          fontWeight: 'bold'
        }
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('فشل في إضافة المنتج إلى المفضلة');
    }
  };

  // حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتج...</p>
        </div>
      </div>
    );
  }

  // حالة الخطأ أو عدم وجود المنتج
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'المنتج غير موجود'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-pink-500">الرئيسية</Link>
          <ChevronLeft className="w-4 h-4 text-gray-400" />
          {category && (
            <>
              <Link 
                to={`/category/${createCategorySlug(category.id, category.name)}`}
                className="text-gray-500 hover:text-pink-500"
              >
                {category.name}
              </Link>
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </>
          )}
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={buildImageUrl(selectedImage)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.png';
                  }}
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.detailedImages && product.detailedImages.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto">
                  <button
                    onClick={() => setSelectedImage(product.mainImage)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === product.mainImage ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={buildImageUrl(product.mainImage)}
                      alt="Main"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {product.detailedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === image ? 'border-pink-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={buildImageUrl(image)}
                        alt={`Detail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <>
                    <span className="text-3xl font-bold text-pink-600">{calculatedPrice.toFixed(2)} ر.س</span>
                    <span className="text-xl text-gray-400 line-through">{product.originalPrice.toFixed(2)} ر.س</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-pink-600">{calculatedPrice.toFixed(2)} ر.س</span>
                )}
              </div>

              {/* Dynamic Options */}
              {product.dynamicOptions && product.dynamicOptions.length > 0 && (
                <div className="space-y-4">
                  {product.dynamicOptions.map((option) => (
                    <div key={option.optionName} className="space-y-2">
                      <label className="block text-lg font-semibold text-gray-800">
                        {getOptionDisplayName(option.optionName)}
                        {option.required && <span className="text-red-500 mr-1">*</span>}
                      </label>
                      
                      {option.optionType === 'select' && option.options && (
                        <select
                          value={selectedOptions[option.optionName] || ''}
                          onChange={(e) => handleOptionChange(option.optionName, e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                            formErrors[option.optionName] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">اختر {getOptionDisplayName(option.optionName)}</option>
                          {option.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.value}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {option.optionType === 'text' && (
                        <input
                          type="text"
                          value={selectedOptions[option.optionName] || ''}
                          onChange={(e) => handleOptionChange(option.optionName, e.target.value)}
                          placeholder={option.placeholder}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                            formErrors[option.optionName] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      )}
                      
                      {formErrors[option.optionName] && (
                        <p className="text-red-500 text-sm">{formErrors[option.optionName]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Size Guide */}
              {product.productType && ['جاكيت', 'عباية تخرج', 'مريول مدرسي'].includes(product.productType) && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <Eye className="w-5 h-5" />
                    <span>عرض جدول المقاسات</span>
                  </button>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <label className="text-lg font-semibold text-gray-800">الكمية:</label>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 font-semibold text-gray-800">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    متوفر: {product.stock} قطعة
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={addToCart}
                    disabled={addingToCart || product.stock === 0}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                  >
                    {addingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>جاري الإضافة...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>أضف إلى السلة</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={addToWishlist}
                    className="px-6 py-4 border-2 border-pink-500 text-pink-500 rounded-xl hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">جدول المقاسات</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={product.sizeGuideImage || getSizeGuideImage(product.productType || '')}
                alt="جدول المقاسات"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

// مكون المنتجات ذات الصلة
const RelatedProducts: React.FC<{ currentProductId: string | number; categoryId: string | number | null }> = ({ 
  currentProductId, 
  categoryId 
}) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRelatedProducts();
  }, [currentProductId, categoryId]);

  const fetchRelatedProducts = async () => {
    try {
      console.log('🔄 Fetching related products...');
      
      const allProducts = await apiCall(API_ENDPOINTS.PRODUCTS);
      const filtered = allProducts.filter((product: Product) => 
        product.id.toString() !== currentProductId.toString()
      );
      
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      
      setRelatedProducts(shuffled.slice(0, 3));
      console.log('✅ Related products loaded:', shuffled.slice(0, 3).length);
    } catch (error) {
      console.error('❌ Error fetching related products:', error);
    }
  };

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">منتجات ذات صلة</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <div 
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
            onClick={() => {
              const productSlug = createProductSlug(product.id, product.name);
              navigate(`/product/${productSlug}`);
            }}
          >
            <div className="relative">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={buildImageUrl(product.mainImage)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.png';
                  }}
                />
              </div>
              <div className="absolute top-3 right-3 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                {product.productType || 'منتج'}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-md font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs text-gray-400 line-through">
                          {product.originalPrice.toFixed(2)}
                        </span>
                        <span className="bg-red-500 text-white px-1 py-0.5 rounded text-xs font-bold">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      </div>
                      <span className="text-lg font-bold text-pink-600">{product.price.toFixed(2)} ر.س</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-pink-600">{product.price.toFixed(2)} ر.س</span>
                  )}
                </div>
                <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors duration-200 text-sm">
                  عرض
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
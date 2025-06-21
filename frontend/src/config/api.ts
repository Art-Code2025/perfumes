// API Configuration for Serverless environment
export const API_CONFIG = {
  // للتطوير المحلي
  development: {
    baseURL: 'http://localhost:8888/.netlify/functions',
  },
  // للإنتاج - Netlify Functions
  production: {
    baseURL: '/api', // Netlify Functions will be available at /api
  }
};

// الحصول على الـ base URL حسب البيئة
export const getApiBaseUrl = (): string => {
  // أولاً: تحقق من Environment Variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // ثانياً: تحقق من البيئة
  const isDevelopment = import.meta.env.DEV;
  return isDevelopment ? API_CONFIG.development.baseURL : API_CONFIG.production.baseURL;
};

// دالة مساعدة لبناء URL كامل للـ Serverless APIs
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  // إزالة الـ slash الأول من endpoint إذا كان موجود
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

// دالة مساعدة لبناء URL الصور - محدثة للـ Cloudinary
export const buildImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder-image.png';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('data:image/')) return imagePath;
  
  // إذا كان من Cloudinary، استخدمه كما هو
  if (imagePath.includes('cloudinary.com')) {
    return imagePath;
  }
  
  // إذا كان مسار محلي، أضف الـ base URL
  const baseUrl = getApiBaseUrl();
  
  // إذا كان المسار يبدأ بـ /images/ فهو مسار نسبي من الباك إند
  if (imagePath.startsWith('/images/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // إذا كان المسار يبدأ بـ images/ بدون slash
  if (imagePath.startsWith('images/')) {
    return `${baseUrl}/${imagePath}`;
  }
  
  // إذا كان مسار عادي، أضف /images/ قبله
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}/images${cleanPath}`;
};

// دالة مركزية لجميع API calls للـ Serverless
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    (defaultOptions.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// تصدير الثوابت المفيدة للـ Serverless APIs
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: 'products',
  PRODUCT_BY_ID: (id: string | number) => `products/${id}`,
  PRODUCTS_BY_CATEGORY: (categoryId: string | number) => `products/category/${categoryId}`,
  
  // Categories
  CATEGORIES: 'categories',
  CATEGORY_BY_ID: (id: string | number) => `categories/${id}`,
  
  // Orders
  ORDERS: 'orders',
  ORDER_BY_ID: (id: string | number) => `orders/${id}`,
  ORDER_STATS: 'orders/stats',
  ORDERS_BY_CUSTOMER: (phone: string) => `orders/customer/${phone}`,
  
  // Coupons
  COUPONS: 'coupons',
  COUPON_BY_ID: (id: string | number) => `coupons/${id}`,
  VALIDATE_COUPON: 'coupons/validate',
  APPLY_COUPON: 'coupons/apply',
  
  // Customers - NEW
  CUSTOMERS: 'customers',
  CUSTOMER_BY_ID: (id: string | number) => `customers/${id}`,
  CUSTOMER_ORDERS: (id: string | number) => `customers/${id}/orders`,
  
  // Cart - NEW
  CART: 'cart',
  USER_CART: (userId: string | number) => `cart/user/${userId}`,
  USER_CART_COUNT: (userId: string | number) => `cart/user/${userId}/count`,
  USER_CART_MERGE: (userId: string | number) => `cart/user/${userId}/merge`,
  CART_ITEM: (itemId: string | number) => `cart/${itemId}`,
  
  // Dashboard
  DASHBOARD: 'dashboard',
  DASHBOARD_ANALYTICS: (period: string) => `dashboard/analytics?period=${period}`,
  
  // Upload
  UPLOAD: 'upload',
  UPLOAD_MULTIPLE: 'upload/multiple',
  UPLOAD_DELETE: (publicId: string) => `upload/${publicId}`,
  UPLOAD_SIGNATURE: (folder: string) => `upload/signature?folder=${folder}`,
  
  // Auth - Updated to use customers function
  LOGIN: 'customers/login',
  REGISTER: 'customers/register',
  LOGOUT: 'customers/logout',
  RESET_PASSWORD: 'customers/reset-password',
  
  // Legacy Auth endpoints (keeping for backward compatibility)
  AUTH_LOGIN: 'customers/login',
  AUTH_ADMIN: 'auth/admin',
  AUTH_REGISTER: 'customers/register',
  AUTH_LOGOUT: 'customers/logout',
  AUTH_RESET_PASSWORD: 'customers/reset-password',
  AUTH_VERIFY: 'auth/verify',
  AUTH_ME: 'auth/me',
  
  // Legacy endpoints for backward compatibility
  CHECKOUT: 'orders', // Orders endpoint handles checkout
  HEALTH: 'dashboard', // Dashboard endpoint serves as health check
  notifications: `${getApiBaseUrl()}/.netlify/functions/notifications`
}; 
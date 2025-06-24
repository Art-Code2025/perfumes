// API Configuration for Serverless environment
export const API_CONFIG = {
  // للتطوير المحلي مع Netlify Dev
  development: {
    baseURL: 'http://localhost:8888/.netlify/functions',
  },
  // للإنتاج - Netlify Functions
  production: {
    baseURL: '/.netlify/functions', // الصيغة الصحيحة لـ Netlify Functions
  }
};

// الحصول على الـ base URL حسب البيئة
export const getApiBaseUrl = (): string => {
  // أولاً: تحقق من Environment Variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // ثانياً: تحقق من البيئة
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
  const baseUrl = isDevelopment ? API_CONFIG.development.baseURL : API_CONFIG.production.baseURL;
  
  console.log('🔗 API Base URL:', baseUrl, '(isDev:', isDevelopment, ')');
  return baseUrl;
};

// دالة مساعدة لبناء URL كامل للـ Serverless APIs
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  // إزالة الـ slash الأول من endpoint إذا كان موجود
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const fullUrl = `${baseUrl}/${cleanEndpoint}`;
  console.log('🌐 API Call URL:', fullUrl);
  return fullUrl;
};

// دالة مساعدة لبناء URL الصور - محدثة للـ Cloudinary
// 💥 FIX: Simplify the function to be more robust.
// It will now only trust absolute URLs (like those from Cloudinary)
// and fall back to a placeholder for anything else (null, undefined, relative paths).
export const buildImageUrl = (imagePath: string | null | undefined): string => {
  // Use a data URL as placeholder to avoid 404 errors
  const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCAyMDBMMjAwIDE1MEwyNTAgMjAwVjI1MEgxNTBWMjAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';

  console.log('🖼️ buildImageUrl called with:', imagePath);

  if (!imagePath) {
    console.log('🖼️ No image path provided, using placeholder');
    return placeholder;
  }

  // Handle absolute URLs (Cloudinary, etc.)
  if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
    console.log('🖼️ Using absolute URL:', imagePath);
    return imagePath;
  }

  // Handle data URLs (base64)
  if (imagePath.startsWith('data:image/')) {
    console.log('🖼️ Using data URL (base64)');
    return imagePath;
  }

  // Handle relative paths - try to build a proper URL
  if (imagePath.startsWith('/')) {
    console.log('🖼️ Using relative path:', imagePath);
    return imagePath;
  }

  // For anything else, try to build a relative URL
  const relativeUrl = `/${imagePath}`;
  console.log('🖼️ Building relative URL:', relativeUrl);
  return relativeUrl;
};

// دالة مركزية لجميع API calls للـ Serverless
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = buildApiUrl(endpoint);
  
  console.log('🚀 Starting API call:', {
    endpoint,
    url,
    method: options.method || 'GET'
  });
  
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
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    console.log('📡 Making fetch request...');
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📩 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData = {};
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json();
        } catch (e) {
          console.warn('Failed to parse error JSON:', e);
        }
      } else {
        const textError = await response.text();
        console.error('Non-JSON error response:', textError);
        errorData = { message: textError };
      }
      
      const errorMessage = (errorData as any).error || (errorData as any).message || `HTTP ${response.status}: ${response.statusText}`;
      console.error('❌ API Error:', {
        url,
        status: response.status,
        error: errorMessage,
        errorData
      });
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('✅ API Success:', {
      endpoint,
      dataReceived: !!data
    });
    
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏰ API Request Timeout:', url);
      throw new Error('انتهت مهلة الطلب - يرجى المحاولة مرة أخرى');
    }
    
    console.error('💥 API Call Failed:', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Improved error message for the user
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('خطأ في الاتصال - تأكد من اتصالك بالإنترنت');
      }
      throw error;
    }
    
    throw new Error('خطأ غير متوقع - يرجى المحاولة مرة أخرى');
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
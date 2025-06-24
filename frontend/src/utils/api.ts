import { getApiBaseUrl } from '../config/api';
import { getMockProducts, getMockCategories, getMockProductById, MockProduct, MockCategory } from './mockData';

// Debug log for API base URL
console.log('🔧 API Configuration loaded');
console.log('🌐 Environment:', import.meta.env.MODE);
console.log('🌐 Hostname:', window.location.hostname);

// Check if we should use mock data (only in development when API is not available)
const shouldUseMockData = () => {
  // Use mock data in development mode OR when API is not available
  const isDevelopment = import.meta.env.MODE === 'development' || 
                       import.meta.env.DEV || 
                       window.location.hostname === 'localhost' ||
                       window.location.hostname.includes('5173') ||
                       window.location.hostname.includes('5174') ||
                       window.location.hostname.includes('5175') ||
                       window.location.hostname.includes('5176') ||
                       window.location.hostname.includes('5177') ||
                       window.location.hostname.includes('3000') ||
                       window.location.hostname.includes('3001');
  
  console.log('🔍 shouldUseMockData check:', {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    hostname: window.location.hostname,
    port: window.location.port,
    isDevelopment
  });
  
  return isDevelopment;
};

// Generic API request function with fallback to mock data ONLY in development
const apiRequest = async (endpoint: string, options: RequestInit = {}, isPublic: boolean = false): Promise<any> => {
  const url = `${getApiBaseUrl()}${endpoint}`;
  
  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    // Add authorization header only if not a public request and token exists
    if (!isPublic) {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ API Success: ${endpoint}`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Error (${endpoint}):`, error);
    
    // Only fallback to mock data in development mode
    if (shouldUseMockData()) {
      console.log('🔄 Development mode: falling back to mock data');
      if (endpoint.includes('/products')) {
        return getMockProducts();
      } else if (endpoint.includes('/categories')) {
        return getMockCategories();
      }
    }
    
    throw error;
  }
};

// Products API
export const productsAPI = {
  getAll: async (params: any = {}, isPublic: boolean = false) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
      return await apiRequest(endpoint, { method: 'GET' }, isPublic);
    } catch (error) {
      if (shouldUseMockData()) {
        console.log('🔄 Using mock products data');
        return getMockProducts();
      }
      throw error;
    }
  },

  getById: async (id: string | number) => {
    console.log(`🔍 ProductsAPI.getById called with ID: ${id}`);
    
    try {
      const result = await apiRequest(`/products/${id}`, { method: 'GET' });
      console.log(`✅ Product found via API:`, result);
      return result;
    } catch (error) {
      console.log(`❌ API failed for product ${id}:`, error);
      
      if (shouldUseMockData()) {
        console.log(`🔄 Falling back to mock data for product ID: ${id}`);
        const mockProduct = getMockProductById(id);
        
        if (!mockProduct) {
          console.log(`❌ Product ${id} not found in mock data either`);
          console.log('📋 Available mock products:', getMockProducts().map(p => ({ id: p.id, name: p.name })));
          throw new Error('المنتج غير موجود');
        }
        
        console.log(`✅ Mock product found:`, mockProduct);
        return mockProduct;
      }
      
      console.log(`❌ Not in development mode, throwing error`);
      throw error;
    }
  },

  create: async (productData: any) => {
    try {
      const result = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      return result;
    } catch (error) {
      if (shouldUseMockData()) {
        // For create operations in dev mode, we'll store in localStorage as fallback
        console.log('🔄 Development mode: storing product in localStorage');
        const products = getMockProducts();
        const newProduct = {
          ...productData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        return newProduct;
      }
      throw error;
    }
  },

  update: async (id: string | number, productData: any) => {
    try {
      return await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    } catch (error) {
      if (shouldUseMockData()) {
        console.log(`🔄 Development mode: updating product ${id} in localStorage`);
        const products = getMockProducts();
        const index = products.findIndex(p => p.id.toString() === id.toString());
        if (index !== -1) {
          products[index] = { ...products[index], ...productData };
          localStorage.setItem('products', JSON.stringify(products));
          return products[index];
        }
        throw new Error('المنتج غير موجود');
      }
      throw error;
    }
  },

  delete: async (id: string | number) => {
    try {
      return await apiRequest(`/products/${id}`, { method: 'DELETE' });
    } catch (error) {
      if (shouldUseMockData()) {
        console.log(`🔄 Development mode: deleting product ${id} from localStorage`);
        const products = getMockProducts();
        const filteredProducts = products.filter(p => p.id.toString() !== id.toString());
        localStorage.setItem('products', JSON.stringify(filteredProducts));
        return { success: true };
      }
      throw error;
    }
  },
  
  getByCategory: (categoryId: string | number) => apiRequest(`/products/category/${categoryId}`),
  
  search: (query: string, params = {}) => {
    const searchParams = new URLSearchParams({ q: query, ...params });
    return apiRequest(`/products/search?${searchParams}`);
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    try {
      return await apiRequest('/categories', { method: 'GET' });
    } catch (error) {
      if (shouldUseMockData()) {
        console.log('🔄 Using mock categories data');
        return getMockCategories();
      }
      throw error;
    }
  },

  getById: async (id: string | number) => {
    try {
      return await apiRequest(`/categories/${id}`, { method: 'GET' });
    } catch (error) {
      if (shouldUseMockData()) {
        console.log(`🔄 Using mock category data for ID: ${id}`);
        const categories = getMockCategories();
        const category = categories.find(c => c.id.toString() === id.toString());
        if (!category) {
          throw new Error('التصنيف غير موجود');
        }
        return category;
      }
      throw error;
    }
  },

  create: async (categoryData: any) => {
    try {
      return await apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
    } catch (error) {
      if (shouldUseMockData()) {
        console.log('🔄 Development mode: storing category in localStorage');
        const categories = getMockCategories();
        const newCategory = {
          ...categoryData,
          id: Date.now(),
        };
        categories.push(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
        return newCategory;
      }
      throw error;
    }
  },

  update: async (id: string | number, categoryData: any) => {
    try {
      return await apiRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
    } catch (error) {
      if (shouldUseMockData()) {
        console.log(`🔄 Development mode: updating category ${id} in localStorage`);
        const categories = getMockCategories();
        const index = categories.findIndex(c => c.id.toString() === id.toString());
        if (index !== -1) {
          categories[index] = { ...categories[index], ...categoryData };
          localStorage.setItem('categories', JSON.stringify(categories));
          return categories[index];
        }
        throw new Error('التصنيف غير موجود');
      }
      throw error;
    }
  },

  delete: async (id: string | number) => {
    try {
      return await apiRequest(`/categories/${id}`, { method: 'DELETE' });
    } catch (error) {
      if (shouldUseMockData()) {
        console.log(`🔄 Development mode: deleting category ${id} from localStorage`);
        const categories = getMockCategories();
        const filteredCategories = categories.filter(c => c.id.toString() !== id.toString());
        localStorage.setItem('categories', JSON.stringify(filteredCategories));
        return { success: true };
      }
      throw error;
    }
  }
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    try {
      return await apiRequest('/orders', { method: 'GET' });
    } catch (error) {
      if (shouldUseMockData()) {
        console.log('🔄 Using mock orders data');
        return [];
      }
      throw error;
    }
  },

  getById: (id: string | number) => apiRequest(`/orders/${id}`),
  
  create: async (orderData: any) => {
    try {
      return await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    } catch (error) {
      if (shouldUseMockData()) {
        console.log('🔄 Development mode: storing order in localStorage');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const newOrder = {
          ...orderData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          status: 'pending'
        };
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        return newOrder;
      }
      throw error;
    }
  },
  
  update: (id: string | number, orderData: any) => apiRequest(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  
  delete: (id: string | number) => apiRequest(`/orders/${id}`, {
    method: 'DELETE',
  }),
  
  getByPhone: (phone: string) => apiRequest(`/orders/customer/${phone}`),
  
  updateStatus: (id: string | number, status: string) => apiRequest(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    try {
      return await apiRequest('/dashboard/stats', { method: 'GET' });
    } catch (error) {
      if (shouldUseMockData()) {
        console.log('🔄 Using mock stats data');
        const products = getMockProducts();
        const categories = getMockCategories();
        
        return {
          totalProducts: products.length,
          totalCustomers: 25,
          totalOrders: 18,
          totalRevenue: products.reduce((sum, p) => sum + (p.price * (20 - p.stock)), 0)
        };
      }
      throw error;
    }
  },
  
  getAnalytics: (period = '30') => apiRequest(`/dashboard/analytics?period=${period}`),
  
  getRecentOrders: (limit = 10) => apiRequest(`/dashboard/recent-orders?limit=${limit}`),
  
  getTopProducts: (limit = 10) => apiRequest(`/dashboard/top-products?limit=${limit}`),
};

// Upload API - Enhanced for proper Cloudinary integration
export const uploadAPI = {
  single: async (file: File) => {
    try {
      console.log('📤 Starting file upload:', file.name, file.type, file.size);
      
      // Convert file to base64 first
      const base64Data = await convertFileToBase64(file);
      console.log('✅ File converted to base64');
      
      // Send base64 data to upload API
      const response = await apiRequest('/upload', {
        method: 'POST',
        body: JSON.stringify({ base64Data }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.success && response.url) {
        console.log('✅ Upload successful:', response.url);
        return response;
      }
      
      // If API doesn't return a proper URL, use the base64 as fallback
      console.warn('⚠️ Upload API succeeded but no URL returned, using base64');
      return {
        success: true,
        url: base64Data,
        fallback: true
      };
      
    } catch (error) {
      console.log('🔄 Upload API failed, using base64 fallback:', error);
      
      // Fallback: return base64 directly
      try {
        const base64Data = await convertFileToBase64(file);
        return {
          success: true,
          url: base64Data,
          fallback: true
        };
      } catch (fallbackError) {
        console.error('❌ Even base64 conversion failed:', fallbackError);
        throw new Error('فشل في معالجة الصورة');
      }
    }
  },
  
  multiple: async (files: File[], folder = 'products') => {
    try {
      // Process multiple files as base64
      const results = await Promise.all(
        files.map(async (file) => {
          const base64Data = await convertFileToBase64(file);
          
          try {
            const response = await apiRequest('/upload', {
              method: 'POST',
              body: JSON.stringify({ base64Data, folder }),
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            return response;
          } catch (error) {
            // Return base64 as fallback for this file
            return {
              success: true,
              url: base64Data,
              fallback: true
            };
          }
        })
      );
      
      return {
        success: true,
        results
      };
    } catch (error) {
      console.error('❌ Multiple upload failed:', error);
      throw error;
    }
  },
};

// Coupons API
export const couponsAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/coupons?${searchParams}`);
  },
  
  getById: (id: string | number) => apiRequest(`/coupons/${id}`),
  
  create: (couponData: any) => apiRequest('/coupons', {
    method: 'POST',
    body: JSON.stringify(couponData),
  }),
  
  update: (id: string | number, couponData: any) => apiRequest(`/coupons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(couponData),
  }),
  
  delete: (id: string | number) => apiRequest(`/coupons/${id}`, {
    method: 'DELETE',
  }),
  
  validate: (code: string, orderTotal: number) => apiRequest('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, orderTotal }),
  }),
};

// Helper function to convert file to base64
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('فشل في تحويل الملف'));
    reader.readAsDataURL(file);
  });
};

// Simple cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Fast API call with caching
export const fastApi = async (endpoint: string, options: RequestInit = {}) => {
  const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  
  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const data = await apiRequest(endpoint, options);
    
    // Cache successful responses
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Clear cache
export const clearCache = () => {
  cache.clear();
};

// Specific API functions for backward compatibility
export const getProducts = () => productsAPI.getAll();
export const getCategories = () => categoriesAPI.getAll();
export const getProduct = (id: string | number) => productsAPI.getById(id);
export const getCategory = (id: string | number) => categoriesAPI.getById(id);

// Helper functions
export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // For JWT tokens, check expiration
    if (token.startsWith('eyJ')) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    }
    
    // For our demo base64 tokens
    const decoded = JSON.parse(atob(token));
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
};

// Legacy API object for backward compatibility
export const api = {
  get: async (endpoint: string) => {
    return apiRequest(endpoint);
  },
  
  post: async (endpoint: string, data: any) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  put: async (endpoint: string, data: any) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (endpoint: string) => {
    return apiRequest(endpoint, {
      method: 'DELETE',
    });
  },
};

export default {
  products: productsAPI,
  categories: categoriesAPI,
  orders: ordersAPI,
  coupons: couponsAPI,
  dashboard: dashboardAPI,
  upload: uploadAPI,
  setAuthToken,
  getAuthToken,
  isAuthenticated,
}; 
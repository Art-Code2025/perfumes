// API Base URL - will be automatically detected in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
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
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/products?${searchParams}`);
  },
  
  getById: (id: string | number) => apiRequest(`/products/${id}`),
  
  create: (productData: any) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  update: (id: string | number, productData: any) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  delete: (id: string | number) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
  
  getByCategory: (categoryId: string | number) => apiRequest(`/products/category/${categoryId}`),
};

// Categories API
export const categoriesAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/categories?${searchParams}`);
  },
  
  getById: (id: string | number) => apiRequest(`/categories/${id}`),
  
  create: (categoryData: any) => apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  
  update: (id: string | number, categoryData: any) => apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  
  delete: (id: string | number) => apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/orders?${searchParams}`);
  },
  
  getById: (id: string | number) => apiRequest(`/orders/${id}`),
  
  create: (orderData: any) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  update: (id: string | number, orderData: any) => apiRequest(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  
  delete: (id: string | number) => apiRequest(`/orders/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: () => apiRequest('/orders/stats'),
  
  getByCustomer: (phone: string) => apiRequest(`/orders/customer/${phone}`),
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
  
  validate: (code: string, orderValue: number) => apiRequest('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, orderValue }),
  }),
  
  apply: (code: string) => apiRequest('/coupons/apply', {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiRequest('/dashboard'),
  
  getAnalytics: (period = '30') => apiRequest(`/dashboard/analytics?period=${period}`),
};

// Upload API
export const uploadAPI = {
  single: (file: File, folder = 'products') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    return apiRequest('/upload', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it with boundary
      body: formData,
    });
  },
  
  multiple: (files: File[], folder = 'products') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('folder', folder);
    
    return apiRequest('/upload/multiple', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it with boundary
      body: formData,
    });
  },
  
  delete: (publicId: string) => apiRequest(`/upload/${publicId}`, {
    method: 'DELETE',
  }),
  
  getSignature: (folder = 'products') => apiRequest(`/upload/signature?folder=${folder}`),
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  adminLogin: (username: string, password: string) => apiRequest('/auth/admin', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  
  register: (email: string, password: string, adminKey: string) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, adminKey }),
  }),
  
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
  
  resetPassword: (email: string) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  
  verifyToken: (token: string) => apiRequest('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),
  
  getCurrentUser: () => apiRequest('/auth/me'),
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
  auth: authAPI,
  setAuthToken,
  getAuthToken,
  isAuthenticated,
}; 
// src/config/api.config.ts

// -----------------------------
// Environment-aware API URLs
// -----------------------------
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.priyafreshmeats.com';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'wss://api.priyafreshmeats.com/socket';

if (!import.meta.env.VITE_API_URL) {
  console.warn('⚠️ VITE_API_URL not set, using fallback:', BASE_URL);
}

if (!import.meta.env.VITE_SOCKET_URL) {
  console.warn('⚠️ VITE_SOCKET_URL not set, using fallback:', SOCKET_URL);
}

// -----------------------------
// Endpoints
// -----------------------------
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  ADMIN: {
    PROFILE: '/admin/profile',
    USERS: '/admin/users',
    CATEGORIES: '/admin/categories',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    DELIVERY_PARTNERS: '/admin/delivery-partners',
    MEAT_CENTERS: '/admin/meat-centers',
    NOTIFICATIONS: '/admin/notifications',
  },
  // ... include all other roles: MANAGER, STORE, CUSTOMER, DELIVERY_PARTNER
};

// -----------------------------
// Request config
// -----------------------------
export const REQUEST_CONFIG = {
  TIMEOUT: 10000,       // 10s
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,    // 1s
};

// -----------------------------
// Final API config object
// -----------------------------
export const API_CONFIG = {
  BASE_URL,
  SOCKET_URL,
  ENDPOINTS,
  REQUEST_CONFIG,
};

// -----------------------------
// Expose globally for debugging
// -----------------------------
if (typeof window !== 'undefined') {
  (window as any).API_CONFIG = API_CONFIG;
  console.log('✅ API_CONFIG attached to window:', window.API_CONFIG);
}

// -----------------------------
// Optional utility to log environment
// -----------------------------
export const logEnvironment = () => {
  console.log('🔧 Environment Configuration:');
  console.log('📡 API Base URL:', API_CONFIG.BASE_URL);
  console.log('🔌 Socket URL:', API_CONFIG.SOCKET_URL);
  console.log('🌍 Mode:', import.meta.env.MODE);
};

export default API_CONFIG;

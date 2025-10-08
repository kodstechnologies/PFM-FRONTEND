// src/config/api.config.ts

// -----------------------------
// TypeScript Global Declaration
// -----------------------------
declare global {
  interface Window {
    API_CONFIG?: any;
  }
}

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
// API Endpoints
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
  MANAGER: {
    DELIVERY_PARTNERS: '/manager/delivery-partners',
    INVENTORY: '/manager/inventory',
    INVENTORY_SUB_CATEGORIES: '/manager/inventory/sub-categories',
    INVENTORY_TYPES: '/manager/inventory/types',

    // ✅ Added missing keys below
    INVENTORY_CATEGORY: '/manager/inventory/category',
    INVENTORY_TYPE_CATEGORY: '/manager/inventory/type-category',
    INVENTORY_PRODUCT_QUANTITY: '/manager/inventory/product-quantity',

    ORDERS: '/manager/orders',
    ORDER_MANAGEMENT: '/manager/order-management',
    ORDER_STATS: '/manager/order-stats',
    LIVE_ORDERS: '/manager/live-orders',
  },
  STORE: {
    LIVE_ORDERS: '/store/live-orders',
    INVENTORY: '/store/inventory',
    PRODUCTS: '/store/products',
    ORDERS: '/store/orders',
  },
  CUSTOMER: {
    ORDERS: '/customer/orders',
    PROFILE: '/customer/profile',
  },
  DELIVERY_PARTNER: {
    ASSIGNED_ORDERS: '/delivery/orders',
    UPDATE_STATUS: '/delivery/update-status',
  },
};

// -----------------------------
// Request config
// -----------------------------
export const REQUEST_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
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
  window.API_CONFIG = API_CONFIG;
  console.log('✅ API_CONFIG attached to window:', window.API_CONFIG);
}

// -----------------------------
// Optional environment logger
// -----------------------------
export const logEnvironment = () => {
  console.log('🔧 Environment Configuration:');
  console.log('📡 API Base URL:', API_CONFIG.BASE_URL);
  console.log('🔌 Socket URL:', API_CONFIG.SOCKET_URL);
  console.log('🌍 Mode:', import.meta.env.MODE);
};

export default API_CONFIG;

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
const BASE_URL = import.meta.env.VITE_API_URL || '/api';  // <-- /api prefix for Nginx proxy
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
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    REFRESH: `${BASE_URL}/auth/refresh`,
    LOGOUT: `${BASE_URL}/auth/logout`,
  },
  ADMIN: {
    PROFILE: `${BASE_URL}/admin/profile`,
    USERS: `${BASE_URL}/admin/users`,
    CATEGORIES: `${BASE_URL}/admin/categories`,
    PRODUCTS: `${BASE_URL}/admin/products`,
    ORDERS: `${BASE_URL}/admin/orders`,
    DELIVERY_PARTNERS: `${BASE_URL}/admin/delivery-partners`,
    MEAT_CENTERS: `${BASE_URL}/admin/meat-centers`,
    NOTIFICATIONS: `${BASE_URL}/admin/notifications`,
  },
  MANAGER: {
    DELIVERY_PARTNERS: `${BASE_URL}/manager/delivery-partners`,
    INVENTORY: `${BASE_URL}/manager/inventory`,
    INVENTORY_SUB_CATEGORIES: `${BASE_URL}/manager/inventory/sub-categories`,
    INVENTORY_TYPES: `${BASE_URL}/manager/inventory/types`,
    INVENTORY_CATEGORY: `${BASE_URL}/manager/inventory/category`,
    INVENTORY_TYPE_CATEGORY: `${BASE_URL}/manager/inventory/type-category`,
    INVENTORY_PRODUCT_QUANTITY: `${BASE_URL}/manager/inventory/product-quantity`,
    ORDERS: `${BASE_URL}/manager/orders`,
    ORDER_MANAGEMENT: `${BASE_URL}/manager/order-management`,
    ORDER_STATS: `${BASE_URL}/manager/order-stats`,
    LIVE_ORDERS: `${BASE_URL}/manager/live-orders`,
  },
  STORE: {
    LIVE_ORDERS: `${BASE_URL}/store/live-orders`,
    INVENTORY: `${BASE_URL}/store/inventory`,
    PRODUCTS: `${BASE_URL}/store/products`,
    ORDERS: `${BASE_URL}/store/orders`,
  },
  CUSTOMER: {
    ORDERS: `${BASE_URL}/customer/orders`,
    PROFILE: `${BASE_URL}/customer/profile`,
  },
  DELIVERY_PARTNER: {
    ASSIGNED_ORDERS: `${BASE_URL}/delivery/orders`,
    UPDATE_STATUS: `${BASE_URL}/delivery/update-status`,
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

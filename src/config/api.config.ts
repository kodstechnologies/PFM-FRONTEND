// src/config/api.config.ts

// Environment-aware API configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.priyafreshmeats.com';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'wss://api.priyafreshmeats.com/socket';

// Ensure environment variables are present
if (!import.meta.env.VITE_API_URL) {

  console.warn('⚠️ VITE_API_URL not set, using fallback: https://api.priyafreshmeats.com');
}

if (!import.meta.env.VITE_SOCKET_URL) {
  console.warn('⚠️ VITE_SOCKET_URL not set, using fallback: wss://api.priyafreshmeats.com/socket');

  console.error('❌ VITE_API_URL is missing! Your frontend build cannot connect to the backend.');
}
if (!import.meta.env.VITE_SOCKET_URL) {
  console.error('❌ VITE_SOCKET_URL is missing! WebSocket connection may fail.');

}

// Export endpoints
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
    PROFILE: '/manager/profile',
    ORDERS: '/manager/orders',
    ORDER_STATS: '/manager/orders/stats',
    LIVE_ORDERS: '/manager/live-orders',
    DELIVERY_PARTNERS: '/manager/delivery-partners',
    INVENTORY: '/manager/inventory',
    INVENTORY_CATEGORY: '/manager/inventory/category',
    INVENTORY_TYPE_CATEGORY: '/manager/inventory/type-category',
    INVENTORY_PRODUCT_QUANTITY: '/manager/inventory/product',
    INVENTORY_LOW_STOCK: '/manager/inventory/low-stock',
    INVENTORY_OUT_OF_STOCK: '/manager/inventory/out-of-stock',
    INVENTORY_BULK_UPDATE: '/manager/inventory/bulk-update',
  },
  STORE: {
    PROFILE: '/store/profile',
    ORDERS: '/store/orders',
    PRODUCTS: '/store/products',
  },
  CUSTOMER: {
    PROFILE: '/customer/profile',
    CART: '/customer/cart',
    ORDERS: '/customer/orders',
    CATEGORIES: '/customer/categories',
  },
  DELIVERY_PARTNER: {
    PROFILE: '/deliveryPartner/profile',
    ORDERS: '/deliveryPartner/orders',
  },
};

// Request configuration
export const REQUEST_CONFIG = {
  TIMEOUT: 10000,       // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,    // 1 second
};

// Final API config object
export const API_CONFIG = {
  BASE_URL,
  SOCKET_URL,
  ENDPOINTS,
  REQUEST_CONFIG,
};

// Expose globally for temporary debugging in browser
;(window as any).API_CONFIG = API_CONFIG;

// Optional: debugging utility
export const logEnvironment = () => {
  console.log('🔧 Environment Configuration:');
  console.log('📡 API Base URL:', API_CONFIG.BASE_URL);
  console.log('🔌 Socket URL:', API_CONFIG.SOCKET_URL);
  console.log('🌍 Environment:', import.meta.env.MODE);
};

export default API_CONFIG;

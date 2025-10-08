// Environment Configuration
// This file contains default environment variables
// In production, these should be set via environment variables

export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: 'http://localhost:8000',
  SOCKET_URL: 'http://localhost:3001',
  
  // App Configuration
  APP_NAME: 'PriyaFreshMeat',
  APP_VERSION: '1.0.0',
  
  // Development Configuration
  DEV_MODE: true,
  DEBUG_LEVEL: 'info',
  
  // Feature Flags
  FEATURES: {
    SOCKET_ENABLED: true,
    DEBUG_MODE: true,
    LOGGING: true,
  }
};

// Override with environment variables if available
export const getConfig = () => {
  return {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || ENV_CONFIG.API_BASE_URL,
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL || ENV_CONFIG.SOCKET_URL,
    APP_NAME: import.meta.env.VITE_APP_NAME || ENV_CONFIG.APP_NAME,
    APP_VERSION: import.meta.env.VITE_APP_VERSION || ENV_CONFIG.APP_VERSION,
    DEV_MODE: import.meta.env.DEV || ENV_CONFIG.DEV_MODE,
    DEBUG_LEVEL: import.meta.env.VITE_DEBUG_LEVEL || ENV_CONFIG.DEBUG_LEVEL,
  };
};

export default ENV_CONFIG;

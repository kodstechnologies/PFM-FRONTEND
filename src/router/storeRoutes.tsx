// import { lazy } from 'react';
// import type { AppRoute } from './types';

// // Lazy-loaded components
// const LiveOrders = lazy(() => import('../pages/Vendor/LiveOrders'));
// const PrintQR = lazy(() => import('../components/PrintQR'));
// const StoreDashboard = lazy(() => import('../pages/Vendor/Dashboard'));

// export const storeRoutes: AppRoute[] = [
//   {
//     path: '/store',
//     element: <StoreDashboard />,
//     layout: 'default',
//     role: 'store',
//   },
//   {
//     path: '/store/live-orders',
//     element: <LiveOrders />,
//     layout: 'blank',
//     role: 'store',
//   },
//   {
//     path: '/store/print-qr/:orderId',
//     element: <PrintQR />,
//     layout: 'blank',
//     role: 'store',
//   },
// ];


// src/routes/storeRoutes.tsx
import { lazy } from 'react';
import type { AppRoute } from './types';
import LiveOrders3 from '../pages/Manager/live/LiveOrders3';
import StoreProfile from '../pages/Vendor/StoreProfile';

// Lazy-loaded components
const LiveOrders2 = lazy(() => import('../pages/Manager/live/LiveOrders2'));
const PrintQR = lazy(() => import('../components/PrintQR'));
const StoreDashboard = lazy(() => import('../pages/Vendor/Dashboard'));

export const storeRoutes: AppRoute[] = [
  {
    path: '/store',
    element: <StoreDashboard />,
    layout: 'default',
    role: 'store',
  },
  {
    path: '/store/profile',
    element: <StoreProfile />,
    layout: 'blank',
    role: 'store',
  },
  {
    path: '/store/live-orders',
    element: <LiveOrders2 />,
    layout: 'blank',
    role: 'store',
  },
  {
    path: '/store/front-desk',
    element: <LiveOrders3 />,
    layout: 'blank',
    role: 'store',
  },
  {
    path: '/store/print-qr/:orderId',
    element: <PrintQR />,
    layout: 'blank',
    role: 'store',
  },
];
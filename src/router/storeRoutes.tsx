// import { lazy } from 'react';
// import type { AppRoute } from './types';

// const LiveOrders = lazy(() => import('../pages/Vendor/LiveOrders'));

// export const storeRoutes: AppRoute[] = [
//   {
//     path: '/store/live-orders',
//     element: <LiveOrders />,
//     layout: 'blank',
//   },
// ];


import { lazy } from 'react';
import type { AppRoute } from './types';

// Lazy-loaded components
const LiveOrders = lazy(() => import('../pages/Vendor/LiveOrders'));
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
    path: '/store/live-orders',
    element: <LiveOrders />,
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

import { lazy } from 'react';
import type { AppRoute } from './types';

const LiveOrders = lazy(() => import('../pages/Vendor/LiveOrders'));

export const storeRoutes: AppRoute[] = [
  {
    path: '/store/live-orders',
    element: <LiveOrders />,
    layout: 'blank',
  },
];

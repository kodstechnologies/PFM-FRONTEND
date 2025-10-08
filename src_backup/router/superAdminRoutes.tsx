import { lazy } from 'react';
import type { AppRoute } from './types'; // ✅ Add this

const SuperAdminDashboard = lazy(() => import('../pages/SuperAdmin/Dashboard'));

export const superAdminRoutes: AppRoute[] = [ // ✅ Add the type
  {
    path: '/super-admin/dashboard',
    element: <SuperAdminDashboard />,
    layout: 'default',
    role: 'super-admin',
  },
];

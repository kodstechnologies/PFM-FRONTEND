// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';

import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import ProtectedRoute from './ProtectedRoute';

import { commonRoutes } from './routes';
import { superAdminRoutes } from './superAdminRoutes';
import { managerRoutes } from './managerRoutes';
import type { AppRoute } from './types';

// ✅ Create all routes and let ProtectedRoute handle authentication
const allRoutes: AppRoute[] = [
  ...commonRoutes,
  ...superAdminRoutes,
  ...managerRoutes,
];

// console.log('✅ All Routes:', allRoutes);

// ✅ Wrap each route with layout and protection
const finalRoutes = allRoutes.map((route) => {
  const Layout = route.layout === 'blank' ? BlankLayout : DefaultLayout;

  const wrappedElement = route.role ? (
    <ProtectedRoute allowedRole={route.role}>{route.element}</ProtectedRoute>
  ) : (
    route.element
  );

  return {
    path: route.path,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Layout>{wrappedElement}</Layout>
      </Suspense>
    ),
  };
});

// ✅ Final router setup
const router = createBrowserRouter(finalRoutes);

export default router;

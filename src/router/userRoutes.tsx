import React, { lazy } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

// Lazy-loaded component
const UserDashboard = lazy(() => import('../pages/user/pages/Dashboard')); // Change path as needed

export default function UserRouter() {
    const routes = [
        {
            path: '/dashboard',
            element: <UserDashboard />,
        },
        // Redirect unknown paths
        { path: '*', element: <Navigate to="/dashboard" /> },
    ];

    return useRoutes(routes);
}

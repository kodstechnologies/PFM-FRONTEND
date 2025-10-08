// import { lazy } from 'react';
// import type { AppRoute } from './types'; // ✅ Add this

// const SuperAdminDashboard = lazy(() => import('../pages/SuperAdmin/Dashboard'));

// export const superAdminRoutes: AppRoute[] = [ // ✅ Add the type
//   {
//     path: '/super-admin/dashboard',
//     element: <SuperAdminDashboard />,
//     layout: 'default',
//     role: 'super-admin',
//   },
// ];


import { lazy } from 'react';
import type { AppRoute } from './types';

// Lazy-loaded components
import AdminProfile from '../pages/SuperAdmin/Profile';
import ManagerProfile from '../pages/Manager/Profile';
import TypeCategoriesDisplay from '../pages/SuperAdmin/Categories/typeCategories/Display';
import TypeCategoriesAdd from '../pages/SuperAdmin/Categories/typeCategories/Add';
import TypeCategoriesEdit from '../pages/SuperAdmin/Categories/typeCategories/Edit';
import SubCategoriesDisplay from '../pages/SuperAdmin/Categories/typeCategories/subCategories/Display';
import SubCategoriesAdd from '../pages/SuperAdmin/Categories/typeCategories/subCategories/Add';
import SubCategoriesEdit from '../pages/SuperAdmin/Categories/typeCategories/subCategories/Edit';
import FullDetails from '../pages/SuperAdmin/Categories/typeCategories/subCategories/FullDetails';
import DisplayCoupons from '../pages/SuperAdmin/Coupons/Display';
// import AddCoupons from '../pages/SuperAdmin/Coupons/Add';
// import EditCoupons from '../pages/SuperAdmin/Coupons/Edit';
import OrderDisplay from "../pages/SuperAdmin/Order.js";
import { Layout } from 'lucide-react';
const DeliveryPartner = lazy(() => import('../pages/Manager/DeliveryPartner'));
const AddPartner = lazy(() => import('../pages/Manager/DeliveryPartner/AddPartner'));
const PartnerDetails = lazy(() => import('../pages/Manager/DeliveryPartner/PartnerDetails'));
const SuperAdminDashboard = lazy(() => import('../pages/SuperAdmin/Dashboard'));
const MeetCenterDisplay = lazy(() => import('../pages/SuperAdmin/MeatCenter/Display'));
const MeetCenterAdd = lazy(() => import('../pages/SuperAdmin/MeatCenter/Add'));
const MeetCenterEdit = lazy(() => import('../pages/SuperAdmin/MeatCenter/Edit'));
const SuperAdminDeliveryPartnerDisplay = lazy(() => import('../pages/SuperAdmin/DeliveryPartner/Display'));
const SuperAdminDeliveryPartnerAdd = lazy(() => import('../pages/SuperAdmin/DeliveryPartner/Add'));
const SuperAdminDeliveryPartnerEdit = lazy(() => import('../pages/SuperAdmin/DeliveryPartner/Edit'));
const AssignOrdersDisplay = lazy(() => import('../pages/SuperAdmin/AssignOrders/Display'));
const AssignOrdersAssign = lazy(() => import('../pages/SuperAdmin/AssignOrders/Assign'));
const NotificationPage = lazy(() => import('../pages/SuperAdmin/Notification/Notification'));
const CategoriesDisplay = lazy(() => import('../pages/SuperAdmin/Categories/Display'));
const CategoriesAdd = lazy(() => import('../pages/SuperAdmin/Categories/Add'));
const CategoriesEdit = lazy(() => import('../pages/SuperAdmin/Categories/Edit'));

// Super Admin routes
export const superAdminRoutes: AppRoute[] = [
  {
    path: '/super-admin/dashboard',
    element: <SuperAdminDashboard />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/super-admin/profile',
    element: <AdminProfile />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/super-admin',
    element: <SuperAdminDashboard />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/meat-center',
    element: <MeetCenterDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/meat-center/add',
    element: <MeetCenterAdd />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/meat-center/edit/:id',
    element: <MeetCenterEdit />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/delivery-partner',
    element: <SuperAdminDeliveryPartnerDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/delivery-partner/add',
    element: <SuperAdminDeliveryPartnerAdd />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/delivery-partner/edit/:id',
    element: <SuperAdminDeliveryPartnerEdit />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/assign-orders',
    element: <AssignOrdersDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/assign-orders/assign',
    element: <AssignOrdersAssign />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/notification',
    element: <NotificationPage />,
    layout: 'default',
    role: 'super-admin',
  },
  // Categories
  {
    path: '/categories',
    element: <CategoriesDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/categories/add',
    element: <CategoriesAdd />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/categories/edit',
    element: <CategoriesEdit />,
    layout: 'default',
    role: 'super-admin',
  },
  // Type Categories
  {
    path: '/type/categories',
    element: <TypeCategoriesDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/type/categories/add',
    element: <TypeCategoriesAdd />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/type/categories/edit',
    element: <TypeCategoriesEdit />,
    layout: 'default',
    role: 'super-admin',
  },
  // Sub Categories
  {
    path: '/sub/categories',
    element: <SubCategoriesDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/sub/categories/add',
    element: <SubCategoriesAdd />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/sub/categories/edit',
    element: <SubCategoriesEdit />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/sub/categories/full-details',
    element: <FullDetails />,
    layout: 'default',
    role: 'super-admin',
  },
  // Coupons
  {
    path: '/coupons',
    element: <DisplayCoupons />,
    layout: 'default',
    role: 'super-admin',
  },
  // Orders
  {
    path: '/order',
    element: <OrderDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
];

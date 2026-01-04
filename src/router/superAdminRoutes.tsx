
import { lazy } from 'react';
import type { AppRoute } from './types';
import MeetCenterView from '../pages/SuperAdmin/MeatCenter/View';
import ViewEmploye from '../pages/SuperAdmin/Employe/View';
import EditEmploye from '../pages/SuperAdmin/Employe/Edit';
import AddEmploye from '../pages/SuperAdmin/Employe/Add';
import DisplayEmploye from '../pages/SuperAdmin/Employe/Display';
import TimeDisplay from '../pages/SuperAdmin/Time/TimeDisplay';
import TextDisplay from '../pages/SuperAdmin/Text/TextDisplay';
import AddMarquee from '../pages/SuperAdmin/Text/AddMarquee';
import AddTime from '../pages/SuperAdmin/Time/AddTime';

// Lazy-loaded components
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
const TypeCategoriesDisplay = lazy(() => import('../pages/SuperAdmin/Categories/typeCategories/Display'));
const TypeCategoriesAdd = lazy(() => import('../pages/SuperAdmin/Categories/typeCategories/Add'));
const TypeCategoriesEdit = lazy(() => import('../pages/SuperAdmin/Categories/typeCategories/Edit'));
const SubCategoriesDisplay = lazy(() => import('../pages/SuperAdmin/Categories/typeCategories/subCategories/Display'));
const SubCategoriesAdd = lazy(() => import('../pages/SuperAdmin/Categories/typeCategories/subCategories/Add'));
const SubCategoriesEdit = lazy(() => import('../pages/SuperAdmin/Categories/typeCategories/subCategories/Edit'));
const FullDetails = lazy(() => import('../pages/SuperAdmin/Categories/typeCategories/subCategories/FullDetails'));
const DisplayCoupons = lazy(() => import('../pages/SuperAdmin/Coupons/Display'));
const OrderDisplay = lazy(() => import("../pages/SuperAdmin/Order.js"));
const AdminProfile = lazy(() => import('../pages/SuperAdmin/Profile'));

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
    path: '/meat-center/view/:id',
    element: <MeetCenterView />,
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

  // ======= == employe =============
  {
    path: '/employe',
    element: <ViewEmploye />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/employe/view/:id',
    element: <DisplayEmploye />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/employe/add',
    element: <AddEmploye />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/employe/edit/:id',
    element: <EditEmploye />,
    layout: 'default',
    role: 'super-admin',
  },

  // =======================
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
    path: '/categories/edit/:categoriesId',
    element: <CategoriesEdit />,
    layout: 'default',
    role: 'super-admin',
  },
  // Type Categories
  {
    path: '/type/categories/:categoriesId',
    element: <TypeCategoriesDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/type/categories/add/:categoriesId',
    element: <TypeCategoriesAdd />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/type/categories/edit/:typeCategoriesId',
    element: <TypeCategoriesEdit />,
    layout: 'default',
    role: 'super-admin',
  },
  // Sub Categories
  {
    path: '/sub/categories/:typeCategoriesId',
    element: <SubCategoriesDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/sub/categories/add/:typeCategoriesId',
    element: <SubCategoriesAdd />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/sub/categories/edit/:subCategoriesId',
    element: <SubCategoriesEdit />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/sub/categories/full-details/:subCategoriesId',
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
  // time 
  {
    path: '/time',
    element: <TimeDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/add/time',
    element: <AddTime />,
    layout: 'default',
    role: 'super-admin',
  },
  // text 
  {
    path: '/text',
    element: <TextDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
  {
    path: '/add/text',
    element: <AddMarquee />,
    layout: 'default',
    role: 'super-admin',
  },
];
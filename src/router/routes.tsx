import { lazy } from 'react';
import type { AppRoute } from './types';
import NotFoundPage from '../pages/NotFoundPage';
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
import UserPrivacyPolicy from '../pages/privacyPolicy/UserPrivacyPolicy';
import DeliveryPartnerPrivacyPolicy from '../pages/privacyPolicy/DeliveryPartnerPrivacyPolicy';
import UserTermsAndCondition from '../pages/privacyPolicy/UserTermsAndCondition';
import DeliveryPartnerTermsAndCondition from '../pages/privacyPolicy/DeliveryPartnerTermsAndCondition';

const DeliveryPartner = lazy(() => import('../pages/Manager/DeliveryPartner'));
const AddPartner = lazy(() => import('../pages/Manager/DeliveryPartner/AddPartner'));
const PartnerDetails = lazy(() => import('../pages/Manager/DeliveryPartner/PartnerDetails'));
const LiveOrders = lazy(() => import('../pages/Vendor/LiveOrders'));
const PrintQR = lazy(() => import('../components/PrintQR'));
const StoreDashboard = lazy(() => import('../pages/Vendor/Dashboard'));
const StoreLogin = lazy(() => import('../pages/VendorLogin'));

// SuperAdmin imports
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

const AdminLogin = lazy(() => import('../pages/AdminLogin'));
const ManagerLogin = lazy(() => import('../pages/ManagerLogin'));
// const Unauthorized = lazy(() => import('../pages/Unauthorized')); // Create this page

export const commonRoutes: AppRoute[] = [
  {
    path: '/',
    element: <AdminLogin />,
    layout: 'blank',
  },
  {
    path: '*', // Catch-all for unknown routes
    element: <NotFoundPage />,
    layout: 'blank',
  },
  {
    path: '/admin-login',
    element: <AdminLogin />,
    layout: 'blank',
  },
  {
    path: '/manager-login',
    element: <ManagerLogin />,
    layout: 'blank',
  },
  {
    path: '/store-login',
    element: <StoreLogin />,
    layout: 'blank',
  },
  // -----
  {
    path: '/privacy-policy',
    element: <UserPrivacyPolicy />,
    layout: 'blank'
  },
  {
    path: '/delivery-partner/privacy-policy',
    element: <DeliveryPartnerPrivacyPolicy />,
    layout: 'blank'
  },
  {
    path: '/terms-and-condition',
    element: <UserTermsAndCondition />,
    layout: 'blank'
  },
  {
    path: '/delivery-partner/terms-and-condition',
    element: <DeliveryPartnerTermsAndCondition />,
    layout: 'blank'
  }
  ,
  // store role ===========================================================
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
  // manager role ================================================
  {
    path: '/manager/profile',
    element: <ManagerProfile />,
    layout: 'default',
    role: 'manager',
  },
  {
    path: '/manager/live-orders',
    element: <LiveOrders />,
    layout: 'blank',
    role: 'manager',
  },
  {
    path: '/manager/print-qr/:orderId',
    element: <PrintQR />,
    layout: 'blank',
    role: 'manager',
  },

  {
    path: '/manager/delivery-partner',
    element: <DeliveryPartner />,
    layout: 'default',
    role: 'manager',
  },
  {
    path: '/manager/delivery-partner/add',
    element: <AddPartner />,
    layout: 'default',
    role: 'manager',
  },
  {
    path: '/manager/delivery-partner/details/:partnerId',
    element: <PartnerDetails />,
    layout: 'default',
    role: 'manager',
  },

  // SuperAdmin routes ==============================================================
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
  // categories 
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

  // type categories 
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

  // sub categories 
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
  // type categories 
  //   {
  //     path: '/unauthorized',
  //     element: <Unauthorized />,
  //     layout: 'default',
  //   },

  // Coupons

  {
    path: '/coupons',
    element: <DisplayCoupons />,
    layout: 'default',
    role: 'super-admin',
  },
  // {
  //   path: '/coupons/add',
  //   element: <AddCoupons />,
  //   layout: 'default',
  //   role: 'super-admin',
  // },
  // {
  //   path: '/coupons/edit',
  //   element: <EditCoupons />,
  //   layout: 'default',
  //   role: 'super-admin',
  // },

  // order 
  {
    path: '/order',
    element: <OrderDisplay />,
    layout: 'default',
    role: 'super-admin',
  },
];
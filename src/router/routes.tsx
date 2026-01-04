
import { lazy } from 'react';
import type { AppRoute } from './types';
import NotFoundPage from '../pages/NotFoundPage';
import UserLogin from '../pages/UserLogin';
import RazorpayTest from '../pages/Demo';
import EmployeeLogin from '../pages/EmployeeLogin';
import PrintQR from '../components/PrintQR';

const UserPrivacyPolicy = lazy(() => import('../pages/privacyPolicy/UserPrivacyPolicy'));
const DeliveryPartnerPrivacyPolicy = lazy(() => import('../pages/privacyPolicy/DeliveryPartnerPrivacyPolicy'));
const UserTermsAndCondition = lazy(() => import('../pages/privacyPolicy/UserTermsAndCondition'));
const StoreLogin = lazy(() => import('../pages/VendorLogin'));
const DeliveryPartnerTermsAndCondition = lazy(() => import('../pages/privacyPolicy/DeliveryPartnerTermsAndCondition'));
const DeleteAccount = lazy(() => import('../pages/privacyPolicy/DeleteAcount'));
const LayoutPage = lazy(() => import('../pages/privacyPolicy/LayoutPage'));
const Demo = lazy(() => import('../pages/Demo'));
const UserDashboard = lazy(() => import('../pages/user/pages/Dashboard'));
const AdminLogin = lazy(() => import('../pages/AdminLogin'));
const ManagerLogin = lazy(() => import('../pages/ManagerLogin'));
// const Unauthorized = lazy(() => import('../pages/Unauthorized')); // Create this page

export const commonRoutes: AppRoute[] = [
  {
    path: '/demo',
    element: <Demo />,
    layout: 'blank',
  },
  {
    path: '/',
    element: <UserDashboard />,
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
    path: '/employee-login',
    element: <EmployeeLogin />,
    layout: 'blank',
  },
  {
    path: '/manager-login',
    element: <EmployeeLogin />,
    layout: 'blank',
  },
  {
    path: '/store-login',
    element: <EmployeeLogin />,
    layout: 'blank',
  },
  {
    path: '/user-login',
    element: <UserLogin />,
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
  },
  {
    path: '/delete-account',
    element: <DeleteAccount />,
    layout: 'blank'
  },
  {
    path: '/landing-page',
    element: <LayoutPage />,
    layout: 'blank', // Custom prop used by your app to apply a specific layout or no layout
  },
  {
    path: '/demo',
    element: <RazorpayTest />,
    layout: 'blank', // Custom prop used by your app to apply a specific layout or no layout
  },
  {
    path: '/print-qr/:orderId',
    element: <PrintQR />,
    layout: 'blank',
    role: 'store',
  },

];
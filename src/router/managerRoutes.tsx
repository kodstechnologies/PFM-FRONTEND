
import { lazy } from 'react'; // Add Navigate import
import type { AppRoute } from './types';
import LiveOrders from '../pages/Vendor/LiveOrders';
import ManagerProfile from '../pages/Manager/Profile';
import PrintQR from '../components/PrintQR';
import { Navigate } from 'react-router-dom';
import OrderManagement from '../pages/Manager/OrderManagement';
import Inventory from '../pages/Manager/Inventory';
import InventoryTypes from '../pages/Manager/InventoryTypes';
import InventorySubCategories from '../pages/Manager/InventorySubCategories';
import EditPartner from '../pages/Manager/DeliveryPartner/EditPartner';

const AddPartner = lazy(() => import('../pages/Manager/DeliveryPartner/AddPartner'));
const PartnerDetails = lazy(() => import('../pages/Manager/DeliveryPartner/PartnerDetails'));
const DeliveryPartner = lazy(() => import('../pages/Manager/DeliveryPartner'));
const ManagerDashboard = lazy(() => import('../pages/Manager/Dashboard')); // Assume this component exists; create if not

export const managerRoutes: AppRoute[] = [
  {
    path: '/manager-dashboard',
    element: <ManagerDashboard />,
    layout: 'default',
    role: 'manager',
  },
  { 
    path: '/manager',
    element: <Navigate to="/manager-dashboard" replace />,
    layout: 'default',
    role: 'manager',
  },
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
  {
    path: '/manager/order-management',
    element: <OrderManagement />,
    layout: 'default',
    role: 'manager',
  },
  {
    path: '/manager/inventory',
    element: <Inventory />,
    layout: 'default',
    role: 'manager',
  },

  {
    path: '/manager/inventory/:categoryId/types',
    element: <InventoryTypes />,
    layout: 'default',
    role: 'manager',
  },
  {
    path: '/manager/inventory/type/:typeId/subcategories',
    element: <InventorySubCategories />,
    layout: 'default',
    role: 'manager',
  },
  {
    path: '/manager/delivery-partner/edit/:id',
    element: <EditPartner />,
    layout: 'default',
    role: 'manager',
  },
];
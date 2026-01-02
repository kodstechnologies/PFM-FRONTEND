import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface Props {
  allowedRole: 'super-admin' | 'manager' | 'store';
  children: ReactNode;
}

const STORE_ROLES = ['butcher', 'salesman', 'cleaner', 'accountant'];

const normalizeRole = (role?: string): 'super-admin' | 'manager' | 'store' | null => {
  if (!role) return null;

  const r = role.toLowerCase();

  if (r === 'super-admin') return 'super-admin';
  if (r === 'manager') return 'manager';
  if (STORE_ROLES.includes(r)) return 'store';

  return null;
};

const ProtectedRoute = ({ allowedRole, children }: Props) => {
  const location = useLocation();

  const superAdminUser = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
  const managerUser = JSON.parse(localStorage.getItem('managerUser') || '{}');
  const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');

  // detect logged-in user (priority based)
  const userRole =
    normalizeRole(superAdminUser.role) ||
    normalizeRole(managerUser.role) ||
    normalizeRole(storeUser.role);

  // ❌ No login
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // ✅ Correct role
  if (userRole === allowedRole) {
    return <>{children}</>;
  }

  // ⚠️ Role mismatch → redirect to correct dashboard
  switch (userRole) {
    case 'super-admin':
      return <Navigate to="/super-admin" replace />;
    case 'manager':
      return <Navigate to="/manager-dashboard" replace />;
    case 'store':
      return <Navigate to="/store" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;

// // src/components/ProtectedRoute.tsx
// import { Navigate } from 'react-router-dom';
// import { ReactNode } from 'react';

// interface Props {
//   allowedRole: string;
//   children: ReactNode;
// }

// const ProtectedRoute = ({ allowedRole, children }: Props) => {
//   // Check all user types in localStorage
//   const superAdminUser = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
//   const managerUser = JSON.parse(localStorage.getItem('managerUser') || '{}');
//   const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');

//   // console.log("🔐 ProtectedRoute Debug:");
//   // console.log("🔐 superAdminUser:", superAdminUser);
//   // console.log("🔐 managerUser:", managerUser);
//   // console.log("🔐 storeUser:", storeUser);
//   // console.log("🔐 allowedRole:", allowedRole);
//   // console.log("🔐 current pathname:", window.location.pathname);

//   // Determine which user is logged in based on the current path
//   let user = null;
//   let userRole = null;

//   // Check based on the current path to avoid conflicts
//   if (window.location.pathname.startsWith('/super-admin') || window.location.pathname.startsWith('/meet-center') || window.location.pathname.startsWith('/delivery-partner') || window.location.pathname.startsWith('/assign-orders') || window.location.pathname.startsWith('/notification') || window.location.pathname.startsWith('/categories')) {
//     if (superAdminUser.role === 'super-admin') {
//       user = superAdminUser;
//       userRole = superAdminUser.role;
//     }
//   } else if (window.location.pathname.startsWith('/manager')) {
//     if (managerUser.role === 'manager') {
//       user = managerUser;
//       userRole = managerUser.role;
//     }
//   } else if (window.location.pathname.startsWith('/store')) {
//     if (storeUser.role === 'store') {
//       user = storeUser;
//       userRole = storeUser.role;
//     }
//   } else {
//     // For dashboard routes, check all user types
//     if (superAdminUser.role === 'super-admin') {
//       user = superAdminUser;
//       userRole = superAdminUser.role;
//     } else if (managerUser.role === 'manager') {
//       user = managerUser;
//       userRole = managerUser.role;
//     } else if (storeUser.role === 'store') {
//       user = storeUser;
//       userRole = storeUser.role;
//     }
//   }

//   // console.log("🔐 Determined user:", user);
//   // console.log("🔐 Determined role:", userRole);

//   // If no user is logged in, redirect to login
//   if (!userRole) {
//     console.log("❌ No user role found, redirecting to login");
//     return <Navigate to="/" replace />;
//   }

//   if (userRole === allowedRole) {
//     // console.log("✅ Role match, rendering component");
//     return <>{children}</>;
//   }

//   // If user has a role but it doesn't match the allowed role, redirect to appropriate dashboard
//   console.log("⚠️ Role mismatch, redirecting to appropriate dashboard");
//   switch (userRole) {
//     case 'super-admin':
//       return <Navigate to="/super-admin" replace />;
//     case 'manager':
//       return <Navigate to="/manager-dashboard" replace />;
//     case 'store':
//       return <Navigate to="/store" replace />;
//     default:
//       return <Navigate to="/" replace />;
//   }
// };

// export default ProtectedRoute;


// // src/components/ProtectedRoute.tsx
// import { Navigate } from 'react-router-dom';
// import { ReactNode } from 'react';

// interface Props {
//   allowedRole: string;
//   children: ReactNode;
// }

// const ProtectedRoute = ({ allowedRole, children }: Props) => {
//   // Check all user types in localStorage
//   const superAdminUser = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
//   const managerUser = JSON.parse(localStorage.getItem('managerUser') || '{}');
//   const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');

//   // console.log("🔐 ProtectedRoute Debug:");
//   // console.log("🔐 superAdminUser:", superAdminUser);
//   // console.log("🔐 managerUser:", managerUser);
//   // console.log("🔐 storeUser:", storeUser);
//   // console.log("🔐 allowedRole:", allowedRole);
//   // console.log("🔐 current pathname:", window.location.pathname);

//   // Normalize role to lowercase for consistency
//   const normalizeRole = (role: string | undefined): string | null => {
//     if (!role) return null;
//     const lowerRole = role.toLowerCase();
//     if (lowerRole === 'super-admin' || lowerRole === 'manager' || lowerRole === 'store') {
//       return lowerRole;
//     }
//     return null;
//   };

//   // Determine which user is logged in based on the current path
//   let user = null;
//   let userRole = null;

//   // Check based on the current path to avoid conflicts
//   if (window.location.pathname.startsWith('/super-admin') || window.location.pathname.startsWith('/meet-center') || window.location.pathname.startsWith('/delivery-partner') || window.location.pathname.startsWith('/assign-orders') || window.location.pathname.startsWith('/notification') || window.location.pathname.startsWith('/categories')) {
//     userRole = normalizeRole(superAdminUser.role);
//     if (userRole === 'super-admin') {
//       user = superAdminUser;
//     }
//   } else if (window.location.pathname.startsWith('/manager')) {
//     userRole = normalizeRole(managerUser.role);
//     if (userRole === 'manager') {
//       user = managerUser;
//     }
//   } else if (window.location.pathname.startsWith('/store')) {
//     userRole = normalizeRole(storeUser.role);
//     if (userRole === 'store') {
//       user = storeUser;
//     }
//   } else {
//     // For dashboard routes, check all user types in priority order
//     userRole = normalizeRole(superAdminUser.role);
//     if (userRole === 'super-admin') {
//       user = superAdminUser;
//     } else {
//       userRole = normalizeRole(managerUser.role);
//       if (userRole === 'manager') {
//         user = managerUser;
//       } else {
//         userRole = normalizeRole(storeUser.role);
//         if (userRole === 'store') {
//           user = storeUser;
//         }
//       }
//     }
//   }

//   // console.log("🔐 Determined user:", user);
//   // console.log("🔐 Determined role:", userRole);

//   // If no user is logged in, redirect to login
//   if (!userRole) {
//     console.log("❌ No user role found, redirecting to login");
//     return <Navigate to="/" replace />;
//   }

//   // Normalize allowedRole for comparison
//   const normalizedAllowedRole = normalizeRole(allowedRole) || allowedRole.toLowerCase();

//   if (userRole === normalizedAllowedRole) {
//     // console.log("✅ Role match, rendering component");
//     return <>{children}</>;
//   }

//   // If user has a role but it doesn't match the allowed role, redirect to appropriate dashboard
//   console.log("⚠️ Role mismatch, redirecting to appropriate dashboard");
//   switch (userRole) {
//     case 'super-admin':
//       return <Navigate to="/super-admin" replace />;
//     case 'manager':
//       return <Navigate to="/manager-dashboard" replace />;
//     case 'store':
//       return <Navigate to="/store" replace />;
//     default:
//       return <Navigate to="/" replace />;
//   }
// };

// export default ProtectedRoute;

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

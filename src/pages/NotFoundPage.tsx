// // import { useNavigate, useLocation } from 'react-router-dom';
// // import { toast, ToastContainer } from 'react-toastify';
// // import { useEffect, useState } from 'react';
// // import 'react-toastify/dist/ReactToastify.css';

// // export default function NotFoundPage() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);

// //   const redirectByRole = () => {
// //     try {
// //       let role = null;
// //       const pathname = location.pathname.toLowerCase();

// //       // Detect role from URL
// //       if (pathname.startsWith('/super-admin')) {
// //         role = 'super-admin';
// //       } else if (pathname.startsWith('/delivery-partner') || pathname.startsWith('/store')) {
// //         role = 'store';
// //       } else if (pathname.startsWith('/manager')) {
// //         role = 'manager';
// //       }

// //       // Check role from storage
// //       const superAdminUser = localStorage.getItem('superAdminUser');
// //       const storeStaff = localStorage.getItem('storeStaff');
// //       const managerUser = localStorage.getItem('managerUser');

// //       if (superAdminUser && (!role || role === 'super-admin')) {
// //         try {
// //           const parsed = JSON.parse(superAdminUser);
// //           role = parsed.role || 'super-admin';
// //         } catch (e) {
// //           console.error('Error parsing superAdminUser:', e);
// //         }
// //       }
// //       if (storeStaff && (!role || role === 'store')) {
// //         role = 'store';
// //       }
// //       if (managerUser && (!role || role === 'manager')) {
// //         try {
// //           const parsed = JSON.parse(managerUser);
// //           role = parsed.role || 'manager';
// //         } catch (e) {
// //           console.error('Error parsing managerUser:', e);
// //         }
// //       }

// //       // Redirect based on role
// //       switch (role) {
// //         case 'store':
// //           navigate('/store/live-orders');
// //           toast.info('Redirecting to store dashboard.');
// //           break;
// //         case 'manager':
// //           navigate('/manager-dashboard');
// //           toast.info('Redirecting to manager dashboard.');
// //           break;
// //         case 'super-admin':
// //           navigate('/super-admin');
// //           toast.info('Redirecting to super admin dashboard.');
// //           break;
// //         default:
// //           navigate('/');
// //           toast.info('Redirecting to login page.');
// //           break;
// //       }
// //     } catch (error) {
// //       console.error('Error redirecting:', error);
// //       toast.error('Failed to redirect. Returning to login page.');
// //       navigate('/');
// //     }
// //   };

// //   useEffect(() => {
// //     const superAdminUser = localStorage.getItem('superAdminUser');
// //     const storeStaff = localStorage.getItem('storeStaff');
// //     const managerUser = localStorage.getItem('managerUser');

// //     if (superAdminUser || storeStaff || managerUser) {
// //       setIsLoggedIn(true); // User is logged in
// //     } else {
// //       navigate('/'); // Not logged in → go to login
// //     }
// //   }, [navigate]);

// //   if (!isLoggedIn) return null; // Prevent flashing before redirect

// //   return (
// //     <>
// //       <ToastContainer />
// //       <div className="flex flex-col items-center justify-center h-screen text-center">
// //         <h1 className="text-6xl font-bold text-gray-800">404</h1>
// //         <p className="mt-4 text-lg text-gray-600">Oops! Page not found.</p>
// //         <button
// //           onClick={redirectByRole}
// //           className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
// //         >
// //           Go Home
// //         </button>
// //       </div>
// //     </>
// //   );
// // }


// import { useNavigate, useLocation } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import { useEffect, useState } from 'react';
// import 'react-toastify/dist/ReactToastify.css';

// export default function NotFoundPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const redirectByRole = () => {
//     try {
//       let role = null;
//       const pathname = location.pathname.toLowerCase();

//       // Detect role from URL
//       if (pathname.startsWith('/super-admin')) {
//         role = 'super-admin';
//       } else if (pathname.startsWith('/delivery-partner') || pathname.startsWith('/store')) {
//         role = 'store';
//       } else if (pathname.startsWith('/manager')) {
//         role = 'manager';
//       }

//       // Check role from storage
//       const superAdminUser = localStorage.getItem('superAdminUser');
//       const storeStaff = localStorage.getItem('storeStaff');
//       const managerUser = localStorage.getItem('managerUser');

//       if (superAdminUser && (!role || role === 'super-admin')) {
//         try {
//           const parsed = JSON.parse(superAdminUser);
//           role = parsed.role || 'super-admin';
//         } catch (e) {
//           console.error('Error parsing superAdminUser:', e);
//         }
//       }
//       if (storeStaff && (!role || role === 'store')) {
//         role = 'store';
//       }
//       if (managerUser && (!role || role === 'manager')) {
//         try {
//           const parsed = JSON.parse(managerUser);
//           role = parsed.role || 'manager';
//         } catch (e) {
//           console.error('Error parsing managerUser:', e);
//         }
//       }

//       // Redirect based on role
//       switch (role) {
//         case 'store':
//           navigate('/store/live-orders');
//           toast.info('Redirecting to store dashboard.');
//           break;
//         case 'manager':
//           navigate('/manager-dashboard');
//           toast.info('Redirecting to manager dashboard.');
//           break;
//         case 'super-admin':
//           navigate('/super-admin');
//           toast.info('Redirecting to super admin dashboard.');
//           break;
//         default:
//           navigate('/');
//           toast.info('Redirecting to login page.');
//           break;
//       }
//     } catch (error) {
//       console.error('Error redirecting:', error);
//       toast.error('Failed to redirect. Returning to login page.');
//       navigate('/');
//     }
//   };

//   useEffect(() => {
//     const superAdminUser = localStorage.getItem('superAdminUser');
//     const storeStaff = localStorage.getItem('storeStaff');
//     const managerUser = localStorage.getItem('managerUser');

//     const pathname = location.pathname.toLowerCase();

//     // If URL is a login route, redirect to that login page immediately
//     if (pathname.startsWith('/admin-login')) {
//       navigate('/admin-login');
//       return;
//     }
//     if (pathname.startsWith('/store-login')) {
//       navigate('/store-login');
//       return;
//     }
//     if (pathname.startsWith('/manager-login')) {
//       navigate('/manager-login');
//       return;
//     }

//     // Just set login state for button logic
//     setIsLoggedIn(!!(superAdminUser || storeStaff || managerUser));
//   }, [navigate, location.pathname]);

//   return (
//     <>
//       <ToastContainer />
//       <div className="flex flex-col items-center justify-center h-screen text-center">
//         <h1 className="text-6xl font-bold text-gray-800">404</h1>
//         <p className="mt-4 text-lg text-gray-600">Oops! Page not found.</p>
//         <button
//           onClick={redirectByRole}
//           className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//         >
//           Go Home
//         </button>
//       </div>
//     </>
//   );
// }

import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#060818] px-4 py-6 sm:px-6 md:px-8">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 dark:text-white mb-4 animate__animated animate__fadeIn">
          404
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Sorry, the page you are looking for does not exist. Please check the URL or try again later.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
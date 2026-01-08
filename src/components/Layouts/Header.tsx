
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { IRootState } from '../../store';
// import { toggleRTL, toggleSidebar } from '../../store/themeConfigSlice';
// import { useTranslation } from 'react-i18next';
// import Dropdown from '../Dropdown';
// import IconMenu from '../Icon/IconMenu';
// import IconLogout from '../Icon/IconLogout';
// import { toast, ToastContainer } from 'react-toastify';

// import adminProfile from "../../assets/profile/priya.jpg";
// import managerProfile from "../../assets/profile/young-entrepreneur.jpg";
// import defaultProfile from "../../assets/profile/priya1.jpg";

// const STORE_ROLES = ['butcher', 'salesman', 'cleaner', 'accountant'];

// const normalizeRole = (role?: string): 'super-admin' | 'manager' | 'store' | null => {
//     if (!role) return null;
//     const r = role.toLowerCase();
//     if (r === 'super-admin') return 'super-admin';
//     if (r === 'manager') return 'manager';
//     if (STORE_ROLES.includes(r)) return 'store';
//     return null;
// };

// const Header = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { t } = useTranslation();

//     const superAdminUser = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
//     const managerUser = JSON.parse(localStorage.getItem('managerUser') || '{}');
//     const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');

//     // 🔐 Detect logged-in user (priority order)
//     let userRole =
//         normalizeRole(superAdminUser.role) ||
//         normalizeRole(managerUser.role) ||
//         normalizeRole(storeUser.role);

//     let user =
//         userRole === 'super-admin' ? superAdminUser :
//             userRole === 'manager' ? managerUser :
//                 userRole === 'store' ? storeUser :
//                     null;

//     if (!userRole || !user) return null;

//     // 🖼 Profile & URL
//     const profile =
//         userRole === 'super-admin' ? adminProfile :
//             userRole === 'manager' ? managerProfile :
//                 user.profile || defaultProfile;

//     const url =
//         userRole === 'super-admin' ? 'super-admin' :
//             userRole === 'manager' ? 'manager' :
//                 'store';

//     // 🚪 Logout
//     const handleLogout = () => {
//         if (!window.confirm("Are you sure you want to logout?")) return;

//         toast.success("Logout successful");

//         setTimeout(() => {
//             localStorage.clear();

//             const redirect =
//                 userRole === 'super-admin' ? '/admin-login' :
//                     userRole === 'manager' ? '/manager-login' :
//                         '/store-login';

//             navigate(redirect, { replace: true });
//         }, 1500);
//     };

//     // 🌍 RTL logic
//     const themeConfig = useSelector((state: IRootState) => state.themeConfig);
//     const isRtl = themeConfig.rtlClass === 'rtl';
//     const [flag, setFlag] = useState(themeConfig.locale);

//     const setLocale = (flag: string) => {
//         setFlag(flag);
//         dispatch(toggleRTL(flag.toLowerCase() === 'ae' ? 'rtl' : 'ltr'));
//     };

//     useEffect(() => {
//         const selector = document.querySelector(
//             `ul.horizontal-menu a[href="${location.pathname}"]`
//         );
//         selector?.classList.add('active');
//     }, [location]);

//     return (
//         <>
//             <ToastContainer />
//             <header className="z-40">
//                 <div className="shadow-sm bg-white px-5 py-2.5 flex items-center justify-between">

//                     {/* ☰ Sidebar toggle */}
//                     <button
//                         className="p-2 rounded-xl hover:bg-gray-100"
//                         onClick={() => dispatch(toggleSidebar())}
//                     >
//                         <IconMenu className="w-6 h-6" />
//                     </button>

//                     {/* 👤 Profile */}
//                     <Dropdown
//                         offset={[0, 8]}
//                         placement={isRtl ? "bottom-start" : "bottom-end"}
//                         btnClassName="relative"
//                         button={
//                             <img
//                                 src={profile}
//                                 className="w-9 h-9 rounded-full object-cover"
//                                 alt="profile"
//                             />
//                         }
//                     >
//                         <ul className="w-[230px] bg-white text-dark font-semibold">
//                             <li>
//                                 <Link
//                                     to={`/${url}/profile`}
//                                     className="flex items-center px-4 py-4 gap-3"
//                                 >
//                                     <img
//                                         src={profile}
//                                         className="w-10 h-10 rounded-md object-cover"
//                                         alt="profile"
//                                     />
//                                     <div>
//                                         <h4 className="text-base capitalize">{userRole}</h4>
//                                         <span className="text-sm opacity-70">Profile Details</span>
//                                     </div>
//                                 </Link>
//                             </li>

//                             <li className="border-t">
//                                 <button
//                                     onClick={handleLogout}
//                                     className="w-full text-left text-danger px-4 py-3"
//                                 >
//                                     <IconLogout className="inline w-4 h-4 mr-2 rotate-90" />
//                                     Sign Out
//                                 </button>
//                             </li>
//                         </ul>
//                     </Dropdown>
//                 </div>
//             </header>
//         </>
//     );
// };

// export default Header;


// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { IRootState } from '../../store';
// import { toggleRTL, toggleSidebar } from '../../store/themeConfigSlice';
// import { useTranslation } from 'react-i18next';
// import Dropdown from '../Dropdown';
// import IconMenu from '../Icon/IconMenu';
// import IconLogout from '../Icon/IconLogout';
// import { toast, ToastContainer } from 'react-toastify';

// const STORE_ROLES = ['butcher', 'salesman', 'cleaner', 'accountant'];

// const normalizeRole = (role?: string): 'super-admin' | 'manager' | 'store' | null => {
//     if (!role) return null;
//     const r = role.toLowerCase();
//     if (r === 'super-admin') return 'super-admin';
//     if (r === 'manager') return 'manager';
//     if (STORE_ROLES.includes(r)) return 'store';
//     return null;
// };

// const getInitial = (role: string): string => {
//     return role.charAt(0).toUpperCase();
// };

// const Header = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { t } = useTranslation();

//     const superAdminUser = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
//     const managerUser = JSON.parse(localStorage.getItem('managerUser') || '{}');
//     const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');

//     // 🔐 Detect logged-in user (priority order)
//     let userRole =
//         normalizeRole(superAdminUser.role) ||
//         normalizeRole(managerUser.role) ||
//         normalizeRole(storeUser.role);

//     let user =
//         userRole === 'super-admin' ? superAdminUser :
//             userRole === 'manager' ? managerUser :
//                 userRole === 'store' ? storeUser :
//                     null;

//     if (!userRole || !user) return null;

//     // 🚪 Logout
//     const handleLogout = () => {
//         if (!window.confirm("Are you sure you want to logout?")) return;

//         toast.success("Logout successful");

//         setTimeout(() => {
//             localStorage.clear();

//             const redirect =
//                 userRole === 'super-admin' ? '/admin-login' :
//                     userRole === 'manager' ? '/manager-login' :
//                         '/store-login';

//             navigate(redirect, { replace: true });
//         }, 1500);
//     };

//     // 🌍 RTL logic
//     const themeConfig = useSelector((state: IRootState) => state.themeConfig);
//     const isRtl = themeConfig.rtlClass === 'rtl';
//     const [flag, setFlag] = useState(themeConfig.locale);

//     const setLocale = (flag: string) => {
//         setFlag(flag);
//         dispatch(toggleRTL(flag.toLowerCase() === 'ae' ? 'rtl' : 'ltr'));
//     };

//     useEffect(() => {
//         const selector = document.querySelector(
//             `ul.horizontal-menu a[href="${location.pathname}"]`
//         );
//         selector?.classList.add('active');
//     }, [location]);

//     const avatarClass = "w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm";

//     return (
//         <>
//             <ToastContainer />
//             <header className="z-40">
//                 <div className="shadow-sm bg-white px-5 py-2.5 flex items-center justify-between">

//                     {/* ☰ Sidebar toggle */}
//                     <button
//                         className="p-2 rounded-xl hover:bg-gray-100"
//                         onClick={() => dispatch(toggleSidebar())}
//                     >
//                         <IconMenu className="w-6 h-6" />
//                     </button>

//                     {/* 👤 Profile */}
//                     <Dropdown
//                         offset={[0, 8]}
//                         placement={isRtl ? "bottom-start" : "bottom-end"}
//                         btnClassName="relative"
//                         button={
//                             <div className={avatarClass}>
//                                 {getInitial(userRole)}
//                             </div>
//                         }
//                     >
//                         <ul className="w-[230px] bg-white text-dark font-semibold z-50">
//                             <li>
//                                 <Link
//                                     to={`/${userRole}/profile`}
//                                     className="flex items-center px-4 py-4 gap-3"
//                                 >
//                                     <div className="w-10 h-10 rounded-md bg-blue-500 text-white flex items-center justify-center font-bold text-base">
//                                         {getInitial(userRole)}
//                                     </div>
//                                     <div>
//                                         <h4 className="text-base capitalize">{userRole}</h4>
//                                         <span className="text-sm opacity-70">Profile Details</span>
//                                     </div>
//                                 </Link>
//                             </li>

//                             <li className="border-t">
//                                 <button
//                                     onClick={handleLogout}
//                                     className="w-full text-left text-danger px-4 py-3"
//                                 >
//                                     <IconLogout className="inline w-4 h-4 mr-2 rotate-90" />
//                                     Sign Out
//                                 </button>
//                             </li>
//                         </ul>
//                     </Dropdown>
//                 </div>
//             </header>
//         </>
//     );
// };

// export default Header;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleRTL, toggleSidebar } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconLogout from '../Icon/IconLogout';
import { toast, ToastContainer } from 'react-toastify';

const STORE_ROLES = ['butcher', 'salesman', 'cleaner', 'accountant'];

const normalizeRole = (role?: string): 'super-admin' | 'manager' | 'store' | null => {
    if (!role) return null;
    const r = role.toLowerCase();
    if (r === 'super-admin') return 'super-admin';
    if (r === 'manager') return 'manager';
    if (STORE_ROLES.includes(r)) return 'store';
    return null;
};

const getInitial = (role: string): string => {
    return role.charAt(0).toUpperCase();
};

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const superAdminUser = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
    const managerUser = JSON.parse(localStorage.getItem('managerUser') || '{}');
    const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');

    // 🔐 Detect logged-in user (priority order)
    let userRole =
        normalizeRole(superAdminUser.role) ||
        normalizeRole(managerUser.role) ||
        normalizeRole(storeUser.role);

    let user =
        userRole === 'super-admin' ? superAdminUser :
            userRole === 'manager' ? managerUser :
                userRole === 'store' ? storeUser :
                    null;

    if (!userRole || !user) return null;

    // 🚪 Logout
    const handleLogout = () => {
        if (!window.confirm("Are you sure you want to logout?")) return;

        toast.success("Logout successful");

        setTimeout(() => {
            localStorage.clear();

            const redirect = "/";
            // userRole === 'super-admin' ? '/admin-login' :
            //     userRole === 'manager' ? '/manager-login' :
            //         '/store-login';

            navigate(redirect, { replace: true });
        }, 1500);
    };

    // 🌍 RTL logic
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const isRtl = themeConfig.rtlClass === 'rtl';
    const [flag, setFlag] = useState(themeConfig.locale);

    const setLocale = (flag: string) => {
        setFlag(flag);
        dispatch(toggleRTL(flag.toLowerCase() === 'ae' ? 'rtl' : 'ltr'));
    };

    useEffect(() => {
        const selector = document.querySelector(
            `ul.horizontal-menu a[href="${location.pathname}"]`
        );
        selector?.classList.add('active');
    }, [location]);

    const avatarClass = "w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm";

    return (
        <>
            <ToastContainer />
            <header className="z-[9999]">
                <div className="shadow-sm bg-white px-5 py-2.5 flex items-center justify-between">

                    {/* ☰ Sidebar toggle */}
                    <button
                        className="p-2 rounded-xl hover:bg-gray-100"
                        onClick={() => dispatch(toggleSidebar())}
                    >
                        <IconMenu className="w-6 h-6" />
                    </button>

                    {/* 👤 Profile */}
                    <Dropdown
                        offset={[0, 8]}
                        placement={isRtl ? "bottom-start" : "bottom-end"}
                        btnClassName="relative"
                        button={
                            <div className={avatarClass}>
                                {getInitial(userRole)}
                            </div>
                        }
                    >
                        <ul className="
    w-[230px]
    bg-gray-50
    text-dark
    font-semibold
    z-[9999]
    rounded-xl
    shadow-lg
    shadow-black/10
">

                            <li>
                                <Link
                                    to={`/${userRole}/profile`}
                                    className="flex items-center px-4 py-4 gap-3"
                                >
                                    <div className="w-10 h-10 rounded-md bg-blue-500 text-white flex items-center justify-center font-bold text-base">
                                        {getInitial(userRole)}
                                    </div>
                                    <div>
                                        <h4 className="text-base capitalize">{userRole}</h4>
                                        <span className="text-sm opacity-70">Profile Details</span>
                                    </div>
                                </Link>
                            </li>

                            <li className="border-t">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left text-danger px-4 py-3"
                                >
                                    <IconLogout className="inline w-4 h-4 mr-2 rotate-90" />
                                    Sign Out
                                </button>
                            </li>
                        </ul>
                    </Dropdown>
                </div>
            </header>
        </>
    );
};

export default Header;
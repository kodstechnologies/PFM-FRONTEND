import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleRTL, toggleTheme, toggleSidebar } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconLogout from '../Icon/IconLogout';
import adminProfile from "../../assets/profile/priya.jpg"
import managerProfile from "../../assets/profile/young-entrepreneur.jpg"
import { toast, ToastContainer } from 'react-toastify';
import profileImg from "../../assets/profile/priya1.jpg"
const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Check all user types in localStorage
    const superAdminUser = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
    const managerUser = JSON.parse(localStorage.getItem('managerUser') || '{}');
    const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');

    const path = window.location.pathname;


    // Determine which user is logged in based on the current path
    let user = null;
    let profile = null;
    let url = null;

    // Check based on the current path to avoid conflicts
    if (
        path.startsWith("/super-admin") ||
        path.startsWith("/meet-center") ||
        path.startsWith("/delivery-partner") ||
        path.startsWith("/assign-orders") ||
        path.startsWith("/notification") ||
        path.startsWith("/categories")
    ) {
        if (superAdminUser.role === "super-admin") {
            user = superAdminUser;
            profile = adminProfile;
            url = "super-admin";
        }
    } else if (path.startsWith("/manager") && managerUser.role === "manager") {
        user = managerUser;
        profile = managerProfile;
        url = "manager";
    } else if (path.startsWith("/store") && storeUser.role === "store") {
        user = storeUser;
        profile = storeUser.profile || adminProfile; // fallback image if store has no profile
        url = "store";
    } else {
        // Default dashboard check
        if (superAdminUser.role === "super-admin") {
            user = superAdminUser;
            profile = adminProfile;
            url = "super-admin";
        } else if (managerUser.role === "manager") {
            user = managerUser;
            profile = managerProfile;
            url = "manager";
        } else if (storeUser.role === "store") {
            user = storeUser;
            profile = storeUser.profile || adminProfile;
            url = "store";
        }
    }

    if (!user) return null; // No user logged in

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;
        console.log("logout");
        toast.success("Logout Successfull", {
            style: { width: window.innerWidth < 640 ? "250px" : "350px", }
        })

        setTimeout(() => {
            // Determine which user type to redirect to based on current path
            let redirectPath = '/';

            if (window.location.pathname.startsWith('/super-admin') || window.location.pathname.startsWith('/meet-center') || window.location.pathname.startsWith('/delivery-partner') || window.location.pathname.startsWith('/assign-orders') || window.location.pathname.startsWith('/notification') || window.location.pathname.startsWith('/categories')) {
                redirectPath = '/admin-login';
            } else if (window.location.pathname.startsWith('/manager')) {
                redirectPath = '/manager-login';
            } else if (window.location.pathname.startsWith('/store')) {
                redirectPath = '/store-login';
            }

            // Clear all user data
            localStorage.removeItem('superAdminUser');
            localStorage.removeItem('managerUser');
            localStorage.removeItem('storeUser');

            // Redirect to appropriate login page
            navigate(redirectPath);
        }, 2000)
    };
    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    function createMarkup(messages: any) {
        return { __html: messages };
    }
    const [messages, setMessages] = useState([
        {
            id: 1,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg g xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ]);

    const removeMessage = (value: number) => {
        setMessages(messages.filter((user) => user.id !== value));
    };

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong className="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong className="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
            time: '9h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong className="text-sm mr-1">Anna Morgan</strong>Upload a file',
            time: '9h Ago',
        },
    ]);

    const removeNotification = (value: number) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };

    const [search, setSearch] = useState(false);

    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    const { t } = useTranslation();
    const { pathname } = useLocation(); // e.g. "/super-admin/dashboard"
    const role = pathname.split("/")[1]; // "super-admin" or "manager"
    // const profile =
    //     role === "super-admin" ? adminProfile : managerProfile;

    // console.log("🚀 ~ Header ~ role:", role)

    return (
        <>
            <ToastContainer />
            <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
                <div className="shadow-sm">
                    <div className="relative bg-white flex w-full items-center px-5 py-2.5">
                        <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                            <button
                                type="button"
                                className="collapse-icon flex-none flex lg:hidden ltr:ml-2 rtl:mr-2 p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 transform hover:scale-105 transition-all duration-300"
                                onClick={() => {
                                    dispatch(toggleSidebar());
                                }}
                            >
                                <IconMenu className="w-6 h-6" />
                            </button>
                        </div>


                        <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                            <div className="sm:ltr:mr-auto sm:rtl:ml-auto">

                            </div>



                            <div className="dropdown shrink-0 flex">
                                <Dropdown
                                    offset={[0, 8]}
                                    placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                                    btnClassName="relative group block"
                                    button={
                                        <img
                                            className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                            src={profileImg}
                                            alt="admin profile"
                                        />
                                    }
                                >

                                    <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                        <li>
                                            <div className="flex items-center px-4 py-4">
                                                <Link to={`/${url}/profile`} className="flex">
                                                    <img
                                                        className="rounded-md w-10 h-10 object-cover"
                                                        src={profileImg}
                                                        alt="userProfile"
                                                    />
                                                    <div className="ltr:pl-4 rtl:pr-4 truncate">
                                                        <h4 className="text-base">Profile</h4>
                                                        {/* <h4 className="text-base">{user.name || "manager"}</h4> */}
                                                        <button
                                                            type="button"
                                                            className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                                                        >
                                                            Profile Details
                                                            {/* {user.email || "manager@example.com"} */}
                                                        </button>
                                                    </div>
                                                </Link>
                                            </div>
                                        </li>

                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <button
                                                onClick={handleLogout}
                                                className="text-danger !py-3 w-full text-left"
                                            >
                                                <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                                                Sign Out
                                            </button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                    </div>


                </div>
            </header>
        </>
    );
};

export default Header;

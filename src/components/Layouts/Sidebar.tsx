import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconArrowLeft from '../Icon/IconArrowLeft';
import IconArrowBackward from '../Icon/IconArrowBackward';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMinus from '../Icon/IconMinus';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconMenuMailbox from '../Icon/Menu/IconMenuMailbox';
import IconMenuTodo from '../Icon/Menu/IconMenuTodo';
import IconMenuNotes from '../Icon/Menu/IconMenuNotes';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import IconMenuElements from '../Icon/Menu/IconMenuElements';
import IconMenuCharts from '../Icon/Menu/IconMenuCharts';
import IconMenuWidgets from '../Icon/Menu/IconMenuWidgets';
import IconMenuFontIcons from '../Icon/Menu/IconMenuFontIcons';
import IconMenuDragAndDrop from '../Icon/Menu/IconMenuDragAndDrop';
import IconMenuTables from '../Icon/Menu/IconMenuTables';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconMenuAuthentication from '../Icon/Menu/IconMenuAuthentication';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddHomeIcon from '@mui/icons-material/AddHome';
import HandshakeIcon from '@mui/icons-material/Handshake';
import logoImg from "../../assets/logo/logo.png"
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import InventoryIcon from '@mui/icons-material/Inventory';
import GradingIcon from '@mui/icons-material/Grading';
import DashboardCustomizeSharpIcon from '@mui/icons-material/DashboardCustomizeSharp';
import BadgeIcon from '@mui/icons-material/Badge';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    // Check all user types in localStorage
    const superAdminUser = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
    const managerUser = JSON.parse(localStorage.getItem('managerUser') || '{}');
    const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');

    // Determine which user is logged in based on the current path
    let user: any = null;
    let userRole: string | null = null;

    // Check based on the current path to avoid conflicts
    if (window.location.pathname.startsWith('/super-admin') || window.location.pathname.startsWith('/meat-center') || window.location.pathname.startsWith('/delivery-partner') || window.location.pathname.startsWith('/assign-orders') || window.location.pathname.startsWith('/notification') || window.location.pathname.startsWith('/categories')) {
        if (superAdminUser.role === 'super-admin') {
            user = superAdminUser;
            userRole = superAdminUser.role;
        }
    } else if (window.location.pathname.startsWith('/manager')) {
        if (managerUser.role === 'manager') {
            user = managerUser;
            userRole = managerUser.role;
        }
    } else if (window.location.pathname.startsWith('/store')) {
        if (storeUser.role === 'store') {
            user = storeUser;
            userRole = storeUser.role;
        }
    } else {
        // For dashboard routes, check all user types
        if (superAdminUser.role === 'super-admin') {
            user = superAdminUser;
            userRole = superAdminUser.role;
        } else if (managerUser.role === 'manager') {
            user = managerUser;
            userRole = managerUser.role;
        } else if (storeUser.role === 'store') {
            user = storeUser;
            userRole = storeUser.role;
        }
    }

    // console.log("🚀 ~ Sidebar ~ user:", user);
    // console.log("🚀 ~ Sidebar ~ userRole:", userRole);
    // console.log("🚀 ~ Sidebar ~ current pathname:", window.location.pathname);

    const getRedirectPath = () => {
        switch (userRole) {
            case 'super-admin':
                return '/super-admin';
            case 'manager':
                return '/manager-dashboard';
            case 'store':
                return '/store';
            default:
                return '/';
        }
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="color_1  h-full  ">
                    <div className="flex justify-between items-center px-4 py-1 ">
                        <NavLink to={getRedirectPath()} className="main-logo flex items-center shrink-0">
                            <img className=" ml-[3rem] h-[11rem]  flex-none" src={logoImg} alt="logo" />
                            {/* <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('VRISTO')}</span> */}
                        </NavLink>

                        <button
                            type="button"
                            className="text-black collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconArrowBackward className="m-auto" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {userRole === 'super-admin' && (
                                <li className="nav-item">
                                    <ul>
                                        <li className="nav-item">
                                            {/* <NavLink to="/super-admin" className="group">
                                                <div className="flex items-center">
                                                    <DashboardCustomizeSharpIcon className="group-hover:!text-[#f47c7c] shrink-0 " />

                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] group-hover:text-gray-500 dark:group-hover:text-[#FE8601]">
                                                        {t('Dashboard')}
                                                    </span>

                                                </div>
                                            </NavLink> */}

                                            <NavLink to="/super-admin" className="group">
                                                <div className="flex items-center">
                                                    <DashboardCustomizeSharpIcon
                                                        className="!text-black group-hover:!text-[#f47c7c] shrink-0"
                                                    />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] group-hover:text-gray-500 dark:group-hover:text-[#FE8601]">
                                                        {t("Dashboard")}
                                                    </span>
                                                </div>
                                            </NavLink>

                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/meat-center" className="group">
                                                <div className="flex items-center">
                                                    <AddHomeIcon
                                                        className="!text-black group-hover:!text-[#f47c7c] shrink-0"
                                                    />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Meat Center')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/employe" className="group">
                                                <div className="flex items-center">
                                                    <BadgeIcon
                                                        className="!text-black group-hover:!text-[#f47c7c] shrink-0"
                                                    />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('All employee')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/text" className="group">
                                                <div className="flex items-center">
                                                    <TextFieldsIcon
                                                        className="!text-black group-hover:!text-[#f47c7c] shrink-0"
                                                    />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Home Text')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/time" className="group">
                                                <div className="flex items-center">
                                                    <AccessTimeIcon
                                                        className="!text-black group-hover:!text-[#f47c7c] shrink-0"
                                                    />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Time Context')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/deliveryCharges" className="group">
                                                <div className="flex items-center">

                                                    <LocalShippingIcon
                                                        className="!text-black group-hover:!text-[#f47c7c] shrink-0"
                                                    />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Delivery Charges')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/delivery-partner" className="group">
                                                <div className="flex items-center">
                                                    <HandshakeIcon className="!text-black group-hover:!text-[#f47c7c] shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Delivery Partner')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>

                                        <li className="nav-item">
                                            <NavLink to="/notification" className="group">
                                                <div className="flex items-center">
                                                    <NotificationsIcon className="!text-black group-hover:!text-[#f47c7c] shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Send Notification')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/categories" className="group">
                                                <div className="flex items-center">
                                                    <CategoryIcon className="!text-black group-hover:!text-[#f47c7c] shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Categories')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/Coupons" className="group">
                                                <div className="flex items-center">
                                                    <ConfirmationNumberIcon className="!text-black group-hover:!text-[#f47c7c] shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Coupons')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/order" className="group">
                                                <div className="flex items-center">
                                                    <GradingIcon className="!text-black group-hover:!text-[#f47c7c] shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Order')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                            )}

                            {userRole === 'manager' && (
                                <li className="nav-item">
                                    <ul>
                                        <li className="nav-item">
                                            <NavLink to="/manager-dashboard" className="group">
                                                <div className="flex items-center">
                                                    <DashboardIcon className="!text-black group-hover:!text-[#f47c7c] shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Manager Dashboard')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/manager/delivery-partner" className="group">
                                                <div className="flex items-center">
                                                    <HandshakeIcon className="!text-black group-hover:!text-[#f47c7c] shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Delivery Partner')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/manager/order-management" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuInvoice className="!text-black group-hover:!text-[#f47c7c] shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Order Management')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/manager/employee" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuInvoice className="!text-black group-hover:!text-[#f47c7c] shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Employee')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/manager/inventory" className="group">
                                                <div className="flex items-center">
                                                    <InventoryIcon className="!text-black group-hover:!text-[#f47c7c] shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t('Inventory')}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;

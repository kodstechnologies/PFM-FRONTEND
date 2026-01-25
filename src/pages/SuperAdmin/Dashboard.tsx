
import React, { useState, useEffect } from 'react';
import CustomPieChart from '../../components/pieChart/CustomPieChart';
import PlaceWiseSalesBarChart from '../../components/pieChart/PlaceWiseSalesBarChart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { callApi } from '../../util/admin_api';
import SalesByCategoryChart from '../../components/pieChart/CustomPieChart';
import { useNavigate } from "react-router-dom";


interface CardValues {
  totalRevenue: string;
  totalOrders: string;
  activePartners: string;
  newCustomers: string;
  totalStores: string;
  activeOrders: string;
}

interface PlaceData {
  place: string;
  total: number;
}

interface CardData {
  title: string;
  valueKey: keyof CardValues;
  color: string;
  bgColor: string;
  icon: JSX.Element;
  trend?: 'up' | 'down';
  trendValue?: string;
  description?: string;
}

interface ChartData {
  labels: string[];
  series: number[];
}

interface RecentActivity {
  id: string;
  type: 'order' | 'user' | 'store' | 'partner';
  message: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

const SuperAdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  // console.log("🚀 ~ SuperAdminDashboard ~ data:", data.totalCategories)

  const navigate = useNavigate();

  const cardValues: CardValues = {
    totalRevenue: data ? `₹${data.orders.totalRevenue.toLocaleString()}` : '--',
    totalOrders: data ? data.orders.deliveredCount.toLocaleString() : '--',
    activePartners: data ? data.deliveryPartnerStats.total.toString() : '--',
    newCustomers: data ? data.totalCustomers.toString() : '--',
    totalStores: data ? data.totalStores.toString() : '--',
    activeOrders: data ? data.orders.deliveredCount.toString() : '--',
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cardData: CardData[] = [
    {
      title: 'Total Revenue',
      valueKey: 'totalRevenue',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-[#E8A0BF] via-[#E8A0BF] to-[#E8A0BF]',
      icon: <CurrencyRupeeIcon sx={{ color: "white", fontSize: 28 }} />,
      trend: 'up',
      trendValue: '12.5%',
      description: 'vs last month'
    },
    {
      title: 'Active Delivery Partners',
      valueKey: 'activePartners',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-[#BA90C6] via-[#BA90C6] to-[#BA90C6]',
      icon: <PeopleIcon sx={{ color: "white", fontSize: 28 }} />,
      trend: 'down',
      trendValue: '2.1%',
      description: 'vs last month'
    },
    {
      title: 'Total Customers',
      valueKey: 'newCustomers',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-[#C0DBEA] via-[#C0DBEA] to-[#C0DBEA]',
      icon: <PersonAddIcon sx={{ color: "white", fontSize: 28 }} />,
      trend: 'up',
      trendValue: '15.7%',
      description: 'vs last month'
    },
    {
      title: 'Total Stores',
      valueKey: 'totalStores',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-[#A4BC92] via-[#A4BC92] to-[#A4BC92]',
      icon: <BusinessIcon sx={{ color: "white", fontSize: 28 }} />,
      trend: 'up',
      trendValue: '6.7%',
      description: 'vs last month'
    }
  ];
  const handleActivityClick = (activity: RecentActivity) => {
    if (activity.type === "user") {
      navigate("/users");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCartIcon className="w-5 h-5" />;
      case 'user': return <PersonAddIcon className="w-5 h-5" />;
      case 'store': return <BusinessIcon className="w-5 h-5" />;
      case 'partner': return <PeopleIcon className="w-5 h-5" />;
      default: return <NotificationsIcon className="w-5 h-5" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  interface DashboardData {
    orders: {
      totalRevenue: number;
      deliveredCount: number;
    };
    totalCustomers: number;
    totalStores: number;
    deliveryPartnerStats: {
      total: number;
      verified: number;
      pending: number;
    };
    latestCustomer: {
      _id: string;
      name: string;
      phone?: string; // 👈 added optional since you used it
      createdAt: string;
    };
    latestStore: {
      _id: string;
      name: string;
      createdAt: string;
    };
    latestDeliveryPartner: {
      _id: string;
      name: string;
      status: string;
      createdAt: string;
    };
    totalCategories: number;
    allCategoryNames: string[];
    locationWiseOrders: any[];
    categories?: {               // 👈 added this
      name: string;
      typeCategoryCount: number;
    }[];
  }

  type ApiResponse<T> = {
    success: boolean;
    message: T;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: ApiResponse<DashboardData> = await callApi({
          endpoint: '/admin/dashboard-api',
          method: 'GET',
        });

        // Set the message object to state
        setData(response.message);

        console.log('Dashboard data:', response.message);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();

  }, []);

  // console.log(data, "===============");
  type CategoryCount = {
    name: string;   // category name
    count: number;  // total subcategory count inside that category
  };
  const categoriesData: CategoryCount[] =
    data?.categories?.map((cat: { name: string; typeCategoryCount: number }) => ({
      name: cat.name,
      count: cat.typeCategoryCount,
    })) ?? [];



  // const categoriesData: CategoryCount[] = categoriesFromApi.map(cat => ({
  //   name: cat.name,
  //   count: cat.typeCategoryCount,
  // }));




  const recentActivities: RecentActivity[] = [
    {
      id: data?.latestCustomer?._id || '1',
      type: 'user',
      message: `New customer registration: ${data?.latestCustomer?.phone || 'N/A'}`,
      time: data?.latestCustomer?.createdAt
        ? new Date(data.latestCustomer.createdAt).toLocaleTimeString()
        : 'N/A',
      status: 'info',
    },
    {
      id: data?.latestStore?._id || '2',
      type: 'store',
      message: `new Store "${data?.latestStore?.name || 'N/A'}" `,
      time: data?.latestStore?.createdAt
        ? new Date(data.latestStore.createdAt).toLocaleTimeString()
        : 'N/A',
      status: 'success',
    },
    {
      id: data?.latestDeliveryPartner?._id || '3',
      type: 'partner',
      message: `new Delivery partner "${data?.latestDeliveryPartner?.name || 'N/A'}" status: ${data?.latestDeliveryPartner?.status || 'pending'}`,
      time: data?.latestDeliveryPartner?.createdAt
        ? new Date(data.latestDeliveryPartner.createdAt).toLocaleTimeString()
        : 'N/A',
      status: data?.latestDeliveryPartner?.status === 'verified' ? 'success' : 'warning',
    }
  ];

  // Map locationWiseOrders to PlaceData format for the chart
  const placeData: PlaceData[] = data?.locationWiseOrders?.map((item) => ({
    place: item.storeName,
    total: item.totalIncome
  })) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">{formatDate(currentTime)}</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent font-mono">
                  {formatTime(currentTime)}
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto py-8 px-8 bg-gray-50">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {cardData.map((card, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${card.bgColor}`}
              role="region"
              aria-label={card.title}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    {card.icon}
                  </div>
                  {/* {card.trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${card.trend === 'up' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
                      }`}>
                      {card.trend === 'up' ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
                      {card.trendValue}
                    </div>
                  )} */}
                </div>

                <div>
                  <p className="text-sm text-white/80 font-medium uppercase tracking-wide mb-1">
                    {card.title}
                  </p>
                  <h2 className={`text-2xl font-bold ${card.color} mb-1`}>
                    {cardValues[card.valueKey] ?? '--'}
                  </h2>
                  {card.description && (
                    <p className="text-xs text-white/70">{card.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* ============== */}
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pie Chart - Sales by Category (60%) */}
          <div className="lg:col-span-7 bg-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r text-black rounded-t-2xl shadow-inner">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                Sales by Category
              </h2>
              <p className="text-sm mt-1 text-white/80">Product category distribution</p>
            </div>
            {/* Chart */}
            <div className="p-4 flex justify-center items-center  ">
              <SalesByCategoryChart
                isDark={false}
                categories={categoriesData}
              />
            </div>
          </div>

          {/* Recent Activity (40%) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-20">Recent Activity</h2>

              <div className="flex flex-col gap-4">
                {recentActivities.map((activity, idx) => (
                  <div
                    key={activity.id}
                    className={`flex flex-col rounded-xl p-4 justify-between
            bg-white shadow-sm hover:shadow-md transition-shadow duration-300`}
                  >
                    {/* Top: Icon */}
                    <div
                      onClick={() => handleActivityClick(activity)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-md
              ${idx % 3 === 0
                          ? 'bg-pink-100 text-red-500'
                          : idx % 3 === 1
                            ? 'bg-blue-200 text-blue-500'
                            : 'bg-green-200 text-green-800'}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Message */}
                    <p className="text-sm font-semibold text-gray-800 mb-2 line-clamp-3">
                      {activity.message}
                    </p>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-auto">
                      <ScheduleIcon className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        <div className="lg:col-span-6 bg-gray-50 rounded-2xl shadow border border-gray-200 overflow-hidden mt-8">
          {/* Header */}
          <div className="p-6 text-black rounded-t-2xl shadow-inner">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Place-wise Total Orders
            </h2>
            <p className="text-sm mt-1 text-white/80">Order distribution across locations</p>
          </div>

          {/* Chart */}
          <div className="p-4">
            {/* <div className="h-full rounded-b-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"> */}
            <PlaceWiseSalesBarChart data={placeData} />
            {/* </div> */}
          </div>
        </div>


      </div>
    </div>
  );
};

export default SuperAdminDashboard;
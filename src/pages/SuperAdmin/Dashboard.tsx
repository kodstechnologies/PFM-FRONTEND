
import React, { useState, useEffect } from 'react';
import CustomPieChart from '../../components/pieChart/CustomPieChart';
import PlaceWiseSalesBarChart from '../../components/pieChart/PlaceWiseSalesBarChart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';


// Define interfaces for type safety
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
  const [cardValues] = useState<CardValues>({
    totalRevenue: '₹2,45,678',
    totalOrders: '12,456',
    activePartners: '89',
    newCustomers: '234',
    totalStores: '15',
    activeOrders: '1,234',
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const placeData: PlaceData[] = [
    { place: 'R R Nagar', total: 35000 },
    { place: 'Vijaynagar', total: 25000 },
    { place: 'K G Layout', total: 12000 },
    { place: 'Hebbal', total: 6000 },
    { place: 'Marathalli', total: 4000 },
  ];

  const chartData: ChartData = {
    series: [985, 737, 270],
    labels: ['Fish', 'Chicken', 'Egg'],
  };

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'order',
      message: 'New order #12345 received from R R Nagar store',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'user',
      message: 'New customer registration: John Doe',
      time: '5 minutes ago',
      status: 'info'
    },
    {
      id: '3',
      type: 'store',
      message: 'Store "Fresh Meats Plus" activated',
      time: '15 minutes ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'partner',
      message: 'Delivery partner verification pending',
      time: '1 hour ago',
      status: 'warning'
    }
  ];

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
      title: 'New Customers',
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

      <div className="max-w-7xl mx-auto px-6 py-8">
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
                  {card.trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      card.trend === 'up' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
                    }`}>
                      {card.trend === 'up' ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
                      {card.trendValue}
                    </div>
                  )}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
          {/* Charts Section */}
          <div className="xl:col-span-3 space-y-8">
            {/* Enhanced Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie Chart - Sales by Category */}
              <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Sales by Category
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Product category distribution</p>
                </div>
                                 <div className="p-6">
                   <div className="h-80">
                     <CustomPieChart
                       isDark={false}
                       labels={chartData.labels}
                       series={chartData.series}
                     />
                   </div>
                 </div>
              </div>

              {/* Bar Chart - Place-wise Sales */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Place-wise Total Orders
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Order distribution across locations</p>
                </div>
                                 <div className="p-10">
                   <div className="h-80">
                     <PlaceWiseSalesBarChart data={placeData} />
                   </div>
                 </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group">
                  <BusinessIcon className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-blue-800">Add Store</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 group">
                  <PeopleIcon className="w-8 h-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-emerald-800">Add Partner</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group">
                  <NotificationsIcon className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-purple-800">Send Alert</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 group">
                  <ScheduleIcon className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-orange-800">Schedule</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  Recent Activity
                </h2>
                <p className="text-sm text-gray-600 mt-1">Latest system updates</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 leading-tight">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <ScheduleIcon className="w-3 h-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  View All Activities
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                System Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backend API</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">File Storage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notifications</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
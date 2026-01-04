import React, { useState, useMemo, useEffect, useCallback } from 'react';
import CustomTable from '../../components/CustomTable';
import { API_CONFIG } from '../../config/api.config';

interface OrderData {
  _id: string;
  clientName: string;
  location: string;
  orderDetails: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  pickedUpBy?: string;
  status: string;
  amount: number;
  createdAt: string;
  phone: string;
  deliveryPartner?: {
    name: string;
    phone: string;
  };
  customer?: {
    name: string;
    phone: string;
  };
  store?: {
    name: string;
  };
}

interface DailyStats {
  date: string;
  totalOrders: number;
  delivered: number;
  totalRevenue: number;
}

interface OrderStats {
  totalOrders: number;
  delivered: number;
  inTransit: number;
  pickedUp: number;
  totalRevenue: number;
}

const OrderManagement: React.FC = () => {
  // State for data and UI
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchProgress, setFetchProgress] = useState<string>('');

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // State for calendar view
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');

  // Get storeId from localStorage managerUser
  const getStoreId = useCallback((): string | null => {
    try {
      const managerUser = localStorage.getItem('managerUser');
      if (managerUser) {
        const parsed = JSON.parse(managerUser);
        return parsed.storeId || null;
      }
    } catch (parseErr) {
      console.error('❌ Error parsing managerUser from localStorage:', parseErr);
    }
    return null;
  }, []);

  // Helper to build API URLs safely, now including storeId where needed
  const buildApiUrl = useCallback((endpoint: string, queryParams?: URLSearchParams, includeStoreId = false): string => {
    const storeId = getStoreId();
    if (includeStoreId && storeId) {
      // Replace :storeId placeholder in endpoint if present
      if (endpoint.includes(':storeId')) {
        endpoint = endpoint.replace(':storeId', storeId);
      } else {
        // Append storeId as a path param if endpoint expects it (e.g., ends with /:storeId)
        endpoint = endpoint.replace(/\/$/, '') + `/${storeId}`;
      }
    }

    let url = endpoint;
    if (url.startsWith('http')) {
      if (url.startsWith('http//')) {
        url = url.replace('http//', 'http://');
      } else if (url.startsWith('https//')) {
        url = url.replace('https//', 'https://');
      }
    } else {
      const base = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL : `${API_CONFIG.BASE_URL}/`;
      url = `${base}${url.startsWith('/') ? url.slice(1) : url}`;
    }
    if (queryParams && queryParams.toString()) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}${queryParams.toString()}`;
    }
    try {
      new URL(url);
      console.log('🔗 Built API URL:', url);
      return url;
    } catch (e) {
      console.error('❌ Invalid API URL generated:', url, e);
      throw new Error(`Invalid API URL: ${url}`);
    }
  }, [getStoreId]);

  // Fetch all orders from backend with pagination handling - using only the order-stats/:storeId endpoint
  const fetchAllOrders = useCallback(async () => {
    const storeId = getStoreId();
    if (!storeId) {
      setError('Store ID not found. Please log in as a manager.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setFetchProgress('Starting to fetch orders...');

      let token: string | null = localStorage.getItem('accessToken');
      if (!token) {
        try {
          const managerUser = localStorage.getItem('managerUser');
          if (managerUser) {
            const parsed = JSON.parse(managerUser);
            token = parsed.accessToken || null;
          }
        } catch (parseErr) {
          console.error('❌ Error parsing managerUser from localStorage:', parseErr);
          token = null;
        }
      }

      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      let allOrders: OrderData[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      const pageSize = 100;

      while (hasMorePages) {
        setFetchProgress(`Fetching page ${currentPage}...`);

        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: pageSize.toString()
        });
        // Use the single endpoint: assume API_CONFIG.ENDPOINTS.MANAGER.ORDER_STATS is '/api/manager/order-stats/:storeId'
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.ORDER_STATS, queryParams, true);

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (data.success && data.data && data.data.orders) {
          // Map populated fields to match interface (e.g., customer -> clientName, phone)
          const mappedOrders = data.data.orders.map((order: any) => ({
            ...order,
            clientName: order.customer?.name || 'Unknown',
            phone: order.customer?.phone || order.phone || 'N/A',
            storeName: order.store?.name || 'Unknown Store'
          }));
          allOrders = [...allOrders, ...mappedOrders];
          setFetchProgress(`Fetched ${allOrders.length} orders so far...`);

          // Check for pagination info from backend response
          const { totalPages, page: currentResponsePage } = data.data;
          if (totalPages && currentPage < totalPages) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
      }

      setOrders(allOrders);
      setFetchProgress('');
      console.log('✅ All orders fetched successfully:', allOrders.length, 'orders for store:', storeId);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch orders');
      setFetchProgress('');
    } finally {
      setIsLoading(false);
    }
  }, [buildApiUrl, getStoreId]);

  // Calculate daily statistics from orders
  const calculateDailyStats = useMemo(() => {
    const statsMap = new Map<string, DailyStats>();

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];

      if (!statsMap.has(orderDate)) {
        statsMap.set(orderDate, {
          date: orderDate,
          totalOrders: 0,
          delivered: 0,
          totalRevenue: 0
        });
      }

      const dayStats = statsMap.get(orderDate)!;
      dayStats.totalOrders += 1;
      dayStats.totalRevenue += order.amount || 0;

      if (order.status === 'delivered') {
        dayStats.delivered += 1;
      }
    });

    const dailyStatsArray = Array.from(statsMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return dailyStatsArray;
  }, [orders]);

  // Get orders for selected date range
  const getDateFilteredOrders = useMemo(() => {
    const selectedDateObj = new Date(selectedDate);

    switch (calendarView) {
      case 'day':
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === selectedDate;
        });

      case 'week':
        const startOfWeek = new Date(selectedDateObj);
        startOfWeek.setDate(selectedDateObj.getDate() - selectedDateObj.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfWeek && orderDate <= endOfWeek;
        });

      case 'month':
        const startOfMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), 1);
        const endOfMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth() + 1, 0);

        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfMonth && orderDate <= endOfMonth;
        });

      default:
        return orders;
    }
  }, [orders, selectedDate, calendarView]);

  // Load data on component mount - only fetch orders
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    let filtered = getDateFilteredOrders;

    if (statusFilter) {
      filtered = filtered.filter(order =>
        order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderDetails.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [getDateFilteredOrders, statusFilter, searchTerm]);

  // Calculate stats from filtered orders (client-side, based on all fetched orders for the store)
  const calculatedStats = useMemo(() => {
    const totalOrders = getDateFilteredOrders.length;
    const delivered = getDateFilteredOrders.filter(order => order.status === 'delivered').length;
    const inTransit = getDateFilteredOrders.filter(order => order.status === 'in_transit').length;
    const pickedUp = getDateFilteredOrders.filter(order => order.status === 'picked_up').length;
    const totalRevenue = getDateFilteredOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

    return { totalOrders, delivered, inTransit, pickedUp, totalRevenue };
  }, [getDateFilteredOrders]);

  // Get stats for selected date
  const selectedDateStats = useMemo(() => {
    return calculateDailyStats.find(stat => stat.date === selectedDate) || {
      date: selectedDate,
      totalOrders: 0,
      delivered: 0,
      totalRevenue: 0
    };
  }, [calculateDailyStats, selectedDate]);

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  // Map backend status to frontend display
  const mapBackendStatusToFrontend = (backendStatus: string): string => {
    switch (backendStatus) {
      case 'delivered':
        return 'Delivered';
      case 'in_transit':
        return 'In Transit';
      case 'picked_up':
        return 'Picked Up';
      case 'ready':
        return 'Ready for Pickup';
      case 'preparing':
        return 'Preparing';
      case 'pending':
      case 'confirmed':
        return 'Confirmed';
      default:
        return backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1);
    }
  };

  // Table columns configuration - enhanced to show all details including store and customer
  const columns = [
    {
      accessor: 'clientName',
      title: 'Client Details',
      sortable: true,
      render: (row: OrderData) => (
        <div>
          <div className="font-medium text-gray-900">{row.clientName}</div>
          <div className="text-sm text-gray-500">{row.phone}</div>
          {row.location && <div className="text-sm text-gray-500">{row.location}</div>}
        </div>
      )
    },
    {
      accessor: 'orderDetails',
      title: 'Order Details',
      sortable: false,
      render: (row: OrderData) => (
        <div className="max-w-xs">
          {row.orderDetails?.map((item, index) => (
            <div key={index} className="text-sm text-gray-600">
              {item.name} x{item.quantity} (₹{item.price * item.quantity})
            </div>
          )) || <span className="text-gray-400">No details</span>}
        </div>
      )
    },
    {
      accessor: 'status',
      title: 'Status',
      sortable: true,
      render: (row: OrderData) => {
        const status = mapBackendStatusToFrontend(row.status || 'pending');
        const statusColors = {
          'Delivered': 'bg-green-100 text-green-800',
          'In Transit': 'bg-blue-100 text-blue-800',
          'Picked Up': 'bg-yellow-100 text-yellow-800',
          'Ready for Pickup': 'bg-purple-100 text-purple-800',
          'Preparing': 'bg-orange-100 text-orange-800',
          'Confirmed': 'bg-gray-100 text-gray-800'
        };

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      }
    },
    {
      accessor: 'deliveryPartner',
      title: 'Delivery Partner',
      sortable: true,
      render: (row: OrderData) => (
        <div>
          {row.deliveryPartner ? (
            <>
              <div className="font-medium text-gray-900">{row.deliveryPartner.name}</div>
              <div className="text-sm text-gray-500">{row.deliveryPartner.phone}</div>
            </>
          ) : (
            <span className="text-gray-400">Not assigned</span>
          )}
        </div>
      )
    },
    {
      accessor: 'amount',
      title: 'Amount (₹)',
      sortable: true,
      render: (row: OrderData) => (
        <span className="font-semibold text-gray-900">₹{(row.amount || 0).toLocaleString()}</span>
      )
    },
    {
      accessor: 'createdAt',
      title: 'Date & Time',
      sortable: true,
      render: (row: OrderData) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      )
    },
    {
      accessor: 'store',
      title: 'Store',
      sortable: false,
      render: (row: OrderData) => (
        <div className="text-sm text-gray-900">{row.store?.name || 'N/A'}</div>
      )
    }
  ];

  // Refresh data
  const handleRefresh = () => {
    fetchAllOrders();
  };

  // Navigate to previous/next day
  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 mb-2">Loading orders...</div>
          {fetchProgress && (
            <div className="text-sm text-gray-500 max-w-md mx-auto">
              {fetchProgress}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const storeId = getStoreId();
  const storeName = orders.length > 0 ? orders[0]?.store?.name || 'Unknown Store' : 'Loading...';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Order Management - {storeName}</h1>
              <p className="text-gray-600">All orders for Store ID: {storeId} | Total Orders Fetched: {orders.length}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Refresh All Orders
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="flex items-center space-x-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by client, phone, location, or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-48 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 appearance-none cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="in_transit">In Transit</option>
                <option value="picked_up">Picked Up</option>
                <option value="ready">Ready for Pickup</option>
                <option value="preparing">Preparing</option>
                <option value="pending">Pending</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section - Optional, can be expanded */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Filter by Date</h2>
              <div className="flex items-center space-x-4">
                {/* Calendar View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {(['day', 'week', 'month'] as const).map((view) => (
                    <button
                      key={view}
                      onClick={() => setCalendarView(view)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${calendarView === view
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Date Navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateDate('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <button
                    onClick={() => navigateDate('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Date Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm font-medium text-blue-700 mb-1">Date</div>
                <div className="text-lg font-bold text-blue-900">
                  {formatDateDisplay(selectedDate)}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-1">Orders</div>
                <div className="text-lg font-bold text-green-900">
                  {selectedDateStats.totalOrders}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-sm font-medium text-purple-700 mb-1">Delivered</div>
                <div className="text-lg font-bold text-purple-900">
                  {selectedDateStats.delivered}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="text-sm font-medium text-orange-700 mb-1">Revenue</div>
                <div className="text-lg font-bold text-orange-900">
                  ₹{selectedDateStats.totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Based on filtered orders for the selected period */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* Total Orders Card */}
          <div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-4 border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setStatusFilter('')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Total Orders</p>
                  <p className="text-xl font-bold text-blue-900">{calculatedStats.totalOrders}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Delivered Card */}
          <div
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-4 border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setStatusFilter('delivered')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Delivered</p>
                  <p className="text-xl font-bold text-green-900">{calculatedStats.delivered}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* In Transit Card */}
          <div
            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md p-4 border border-amber-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setStatusFilter('in_transit')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">In Transit</p>
                  <p className="text-xl font-bold text-amber-900">{calculatedStats.inTransit}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Picked Up Card */}
          <div
            className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-md p-4 border border-teal-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setStatusFilter('picked_up')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Picked Up</p>
                  <p className="text-xl font-bold text-teal-900">{calculatedStats.pickedUp}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-4 border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Total Revenue</p>
                  <p className="text-xl font-bold text-purple-900">
                    ₹{calculatedStats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders for: {formatDateDisplay(selectedDate)} •
                Filters: {statusFilter || 'All'} | Search: {searchTerm || 'None'}
              </div>
            </div>
          </div>
          <CustomTable
            pageHeader={`All Orders for Store: ${storeName}`}
            data={filteredOrders}
            columns={columns}
            defaultSort={{ columnAccessor: 'createdAt', direction: 'desc' }}
            pageSizeOptions={[10, 25, 50, 100]}
            searchTerm={searchTerm} // Already handled in filteredOrders, but pass for table search if needed
          />
        </div>

        {/* No Orders State */}
        {!isLoading && filteredOrders.length === 0 && orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">No orders available for this store</div>
            <div className="text-gray-500 text-sm">Orders will appear here when customers place them</div>
          </div>
        )}
        {!isLoading && filteredOrders.length === 0 && orders.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">
              No orders match your current filters ({formatDateDisplay(selectedDate)})
            </div>
            <div className="text-gray-500 text-sm">Try adjusting date range, search, or status filter</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
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
}

interface OrderStats {
  totalOrders: number;
  delivered: number;
  inTransit: number;
  pickedUp: number;
  totalRevenue: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const OrderManagement: React.FC = () => {
  // State for data and UI
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    delivered: 0,
    inTransit: 0,
    pickedUp: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchProgress, setFetchProgress] = useState<string>('');
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch all orders from backend with pagination handling
  const fetchAllOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setFetchProgress('Starting to fetch orders...');

      // Get auth token
      const managerUser = localStorage.getItem('managerUser');
      const accessToken = localStorage.getItem('accessToken');
      const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);

      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      let allOrders: OrderData[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      const pageSize = 100; // Fetch more orders per page to reduce API calls

      // Fetch all pages of orders
      while (hasMorePages) {
        setFetchProgress(`Fetching page ${currentPage}...`);
        
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.ORDERS}?page=${currentPage}&limit=${pageSize}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data.orders) {
          allOrders = [...allOrders, ...data.data.orders];
          setFetchProgress(`Fetched ${allOrders.length} orders so far...`);
          
          // Check if there are more pages
          if (data.data.pagination && data.data.pagination.hasNextPage) {
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
      console.log('✅ All orders fetched successfully:', allOrders.length, 'orders');
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch orders');
      setFetchProgress('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch order statistics
  const fetchOrderStats = useCallback(async () => {
    try {
      const managerUser = localStorage.getItem('managerUser');
      const accessToken = localStorage.getItem('accessToken');
      const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);

      if (!token) return;

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.ORDER_STATS}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.stats) {
          setStats(data.data.stats);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchAllOrders();
    fetchOrderStats();
  }, [fetchAllOrders, fetchOrderStats]);

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Apply status filter only (search will be handled by CustomTable)
    if (statusFilter) {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filtered;
  }, [orders, statusFilter]);

  // Calculate stats from filtered orders
  const calculatedStats = useMemo(() => {
    const totalOrders = orders.length; // Use total orders since search is handled by table
    const delivered = orders.filter(order => order.status === 'delivered').length;
    const inTransit = orders.filter(order => order.status === 'in_transit').length;
    const pickedUp = orders.filter(order => order.status === 'picked_up').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

    return { totalOrders, delivered, inTransit, pickedUp, totalRevenue };
  }, [orders]);

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

  // Table columns configuration
  const columns = [
    // {
    //   accessor: '_id',
    //   title: 'Order ID',
    //   sortable: true,
    //   render: (row: OrderData) => (
    //     <span className="font-mono text-sm text-gray-600">#{row._id.slice(-8)}</span>
    //   )
    // },
    {
      accessor: 'clientName',
      title: 'Client Details',
      sortable: true,
      render: (row: OrderData) => (
        <div>
          <div className="font-medium text-gray-900">{row.clientName}</div>
          <div className="text-sm text-gray-500">{row.phone}</div>
        </div>
      )
    },
    {
      accessor: 'location',
      title: 'Location',
      sortable: true,
      render: (row: OrderData) => (
        <div className="max-w-xs">
          <div className="text-sm text-gray-900 truncate">{row.location}</div>
        </div>
      )
    },
    {
      accessor: 'orderDetails',
      title: 'Order Details',
      sortable: false,
      render: (row: OrderData) => (
        <div className="max-w-xs">
          {row.orderDetails.map((item, index) => (
            <div key={index} className="text-sm text-gray-600">
              {item.name} x{item.quantity}
            </div>
          ))}
        </div>
      )
    },
    {
      accessor: 'status',
      title: 'Status',
      sortable: true,
      render: (row: OrderData) => {
        const status = mapBackendStatusToFrontend(row.status);
        const statusColors = {
          'Delivered': 'bg-green-100 text-green-800',
          'In Transit': 'bg-blue-100 text-blue-800',
          'Picked Up': 'bg-yellow-100 text-yellow-800',
          'Ready for Pickup': 'bg-purple-100 text-purple-800',
          'Preparing': 'bg-orange-100 text-orange-800',
          'Confirmed': 'bg-gray-100 text-gray-800'
        };
        
        return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
        }`}>
            {status}
        </span>
        );
      }
    },
    {
      accessor: 'pickedUpBy',
      title: 'Picked Up By',
      sortable: true,
      render: (row: OrderData) => (
        <div>
          {row.deliveryPartner ? (
            <>
              <div className="font-medium text-gray-900">{row.deliveryPartner.name}</div>
              <div className="text-sm text-gray-500">{row.deliveryPartner.phone}</div>
            </>
          ) : (
            <span className="text-gray-400">Not picked up</span>
          )}
        </div>
      )
    },
    
    {
      accessor: 'amount',
      title: 'Amount (₹)',
      sortable: true,
      render: (row: OrderData) => (
        <span className="font-semibold text-gray-900">₹{row.amount}</span>
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
    }
  ];

  // Refresh data
  const handleRefresh = () => {
    fetchAllOrders();
    fetchOrderStats();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Order Management
            </h1>
            <p className="text-gray-600">
              Manage and track all customer orders with delivery details
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="flex items-center space-x-4">
            {/* Search Box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-72 pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300"
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

        {/* Stats Cards */}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
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
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <div className="flex items-center space-x-4">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="text-green-700 bg-transparent hover:bg-green-100 hover:text-green-800 px-3 py-1 rounded text-sm transition-all duration-200 ease-in-out flex items-center"
                title="Refresh Data"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          
          <CustomTable
            pageHeader="Order Management"
            data={filteredOrders}
            columns={columns}
            defaultSort={{ columnAccessor: '_id', direction: 'desc' }}
            pageSizeOptions={[5, 10, 15, 20, 25, 50]}
            searchTerm={searchTerm}
          />
        </div>

        {/* No Orders State */}
        {!isLoading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">
              {searchTerm || statusFilter ? 'No orders match your filters' : 'No orders available'}
            </div>
            <div className="text-gray-500 text-sm">
              {searchTerm || statusFilter ? 'Try adjusting your search or filter criteria' : 'Orders will appear here when customers place them'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;

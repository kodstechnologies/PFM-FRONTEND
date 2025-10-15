import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SocketService from '../../../services/socketService';
// import SocketService from '../../services/socketService';
import { API_CONFIG } from '../../../config/api.config';
// import { API_CONFIG } from '../../config/api.config';
import { toast, ToastContainer } from 'react-toastify';

interface OrderDetail {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  img?: string;
  unit?: string;
  weight?: string;
}

interface Order {
  id: string;
  items: number;
  total: number;
  time: string;
  status: 'new' | 'preparing' | 'awaiting-pickup' | 'picked-up';
  orderDetails?: OrderDetail[];
}

const LiveOrders2: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [storeInfo, setStoreInfo] = useState<{
    name: string;
    location: string;
    managerId: string;
  } | null>(null);

  const socketService = SocketService.getInstance();
  const isManager = window.location.pathname.includes('/manager/');
  const userRole = isManager ? 'manager' : 'store';
  const userId = isManager ? 'manager-tv-screen' : 'store-tv-screen';
  console.log("🚀 ~ LiveOrders2 ~ userId:", userId)
  let managerId = "manager-tv-screen"
  // Socket connection
  useEffect(() => {
    const connectSocket = () => {
      try {
        socketService.connect(userRole, userId);
        if (!isManager) {
          socketService.onNewOrder(() => fetchLiveOrders2());
          socketService.onOrderStatusChange(() => fetchLiveOrders2());
        }
      } catch (error) {
        console.error(`Failed to connect ${userRole} socket:`, error);
      }
    };

    connectSocket();

    return () => {
      if (!isManager) {
        socketService.offNewOrder();
        socketService.offOrderStatusChange();
      }
      socketService.disconnect();
    };
  }, [userRole, userId, isManager]);

  // Authentication check
  useEffect(() => {
    const managerUser = localStorage.getItem('managerUser');
    const storeUser = localStorage.getItem('storeUser');
    const accessToken = localStorage.getItem('accessToken');
    const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null) ||
      (storeUser ? JSON.parse(storeUser).accessToken : null);

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      if (isManager) {
        navigate('/manager-login');
      } else {
        navigate('/store-login');
      }
      return;
    }

    setIsAuthenticated(true);
    fetchLiveOrders2();
  }, [isManager, navigate]);

  // Normalize endpoint helper
  const normalizeEndpoint = (endpoint: string): string => {
    if (endpoint.startsWith('https//')) return endpoint.replace('https//', 'https://');
    if (endpoint.startsWith('http//')) return endpoint.replace('http//', 'http://');
    return endpoint;
  };

  const getFullUrl = (endpoint: string): string => {
    const normalized = normalizeEndpoint(endpoint);
    if (normalized.startsWith('http')) return normalized;
    const relativePath = normalized.startsWith('/') ? normalized : `/${normalized}`;
    return `${API_CONFIG.BASE_URL}${relativePath}`;
  };

  // Fetch live orders
  const fetchLiveOrders2 = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const managerUser = localStorage.getItem('managerUser');
      const storeUser = localStorage.getItem('storeUser');
      const accessToken = localStorage.getItem('accessToken');
      const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null) ||
        (storeUser ? JSON.parse(storeUser).accessToken : null);

      if (!token) {
        setError('Authentication required. Please log in.');
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const endpoint = isManager ? API_CONFIG.ENDPOINTS.MANAGER.LIVE_ORDERS : API_CONFIG.ENDPOINTS.STORE.ORDERS;
      const fullUrl = getFullUrl(endpoint);

      const response = await fetch(fullUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("🚀 ~ LiveOrders2 ~ response:", response)

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("🚀 ~ LiveOrders2 ~ data.data.details:", data.data.details.managerID)
          if (data.data.details) {
            setStoreInfo({
              name: data.data.details.name || (isManager ? 'Manager' : 'Store'),
              location: data.data.details.location || '',
              managerId: data.data.details.managerID || "manager id"
            });
          }
          // console.log("🚀 ~ LiveOrders2 ~ data.data.orders:===================", data.data)
          if (data.data.orders) {
            const transformedOrders: Order[] = data.data.orders.map((order: any) => ({
              id: order._id,
              items: order.orderDetails?.length || 0,
              total: order.amount || 0,
              time: new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
              status: mapBackendStatusToFrontend(order.status),
              orderDetails: order.orderDetails || []
            }));
            console.log("🚀 ~ LiveOrders2 ~ transformedOrders:", transformedOrders)
            setOrders(transformedOrders);
          } else {
            setOrders([]);
          }
        } else {
          setOrders([]);
        }
      } else {
        setError('Failed to fetch orders from server');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching live orders:', error);
      setError('Network error. Please check your connection.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [isManager]);

  // Fetch store info
  const fetchStoreInfo = useCallback(async () => {
    if (isManager) return;

    try {
      const storeUser = localStorage.getItem('storeUser');
      const accessToken = localStorage.getItem('accessToken');

      if (!storeUser || !accessToken) return;

      try {
        const parsedStoreUser = JSON.parse(storeUser);
        if (parsedStoreUser.storeName || parsedStoreUser.location) {
          setStoreInfo({
            name: parsedStoreUser.storeName || 'Store',
            location: parsedStoreUser.location || 'Location',
            managerId: parsedStoreUser.managerId || 'manager-tv-screen'
          });
        }
      } catch { }

      const response = await fetch(`${API_CONFIG.BASE_URL}/store/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });


      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setStoreInfo({
            name: data.data.name || 'Store',
            location: data.data.location || 'Location',
            managerId: data.data.managerId || 'manager-tv-screen'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching store info:', error);
    }
  }, [isManager]);

  useEffect(() => {
    fetchStoreInfo();
  }, [fetchStoreInfo]);

  // Status mapping
  const mapBackendStatusToFrontend = (backendStatus: string): Order['status'] => {
    switch (backendStatus) {
      case 'pending':
      case 'confirmed':
        return 'new';
      case 'preparing':
        return 'preparing';
      case 'ready':
        return 'awaiting-pickup';
      case 'picked_up':
      case 'in_transit':
        return 'picked-up';
      default:
        return 'new';
    }
  };

  // Refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      const managerUser = localStorage.getItem('managerUser');
      const storeUser = localStorage.getItem('storeUser');
      const accessToken = localStorage.getItem('accessToken');
      const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null) ||
        (storeUser ? JSON.parse(storeUser).accessToken : null);
      if (token) fetchLiveOrders2();
    }, 30000);

    return () => clearInterval(interval);
  }, [isManager, fetchLiveOrders2]);

  // Time update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'F11') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getOrdersByStatus = (status: Order['status']) => orders.filter(order => order.status === status);

  const moveOrderToNextStage = async (orderId: string) => {
    try {
      setError(null);

      const managerUser = localStorage.getItem('managerUser');
      const storeUser = localStorage.getItem('storeUser');
      const accessToken = localStorage.getItem('accessToken');
      const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null) ||
        (storeUser ? JSON.parse(storeUser).accessToken : null);

      if (!token) {
        setError('Authentication required for status update');
        return;
      }

      const order = orders.find(o => o.id === orderId);
      console.log("🚀 ~ moveOrderToNextStage ~ order:", order)
      if (!order) return;

      let newStatus: string;
      let newFrontendStatus: Order['status'];
      if (order.status === 'new') {
        newStatus = 'preparing';
        newFrontendStatus = 'preparing';
      } else if (order.status === 'preparing') {
        newStatus = 'ready';
        newFrontendStatus = 'awaiting-pickup';
      } else return;

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newFrontendStatus } : o));

      const endpoint = `${API_CONFIG.BASE_URL}/manager/orders/${orderId}/status`;
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, managerId: managerId })
      });

      if (!response.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: order.status } : o));
        const errorData = await response.json();
        setError(`Failed to update order status: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    }
  };

  const showQRCode = (orderId: string) => setShowQR(orderId);
  const hideQRCode = () => setShowQR(null);

  const confirmPickup = async (orderId: string) => {
    try {
      setError(null);

      const managerUser = localStorage.getItem('managerUser');
      const storeUser = localStorage.getItem('storeUser');
      const accessToken = localStorage.getItem('accessToken');
      const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null) ||
        (storeUser ? JSON.parse(storeUser).accessToken : null);

      if (!token) {
        setError('Authentication required for pickup confirmation');
        return;
      }

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'picked-up' } : o));

      const endpoint = `${API_CONFIG.BASE_URL}/manager/orders/${orderId}/status`;
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'picked_up', pickedUpBy: orderId })
      });

      if (!response.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'awaiting-pickup' } : o));
        const errorData = await response.json();
        setError(`Failed to confirm pickup: ${errorData.message || 'Unknown error'}`);
      } else {
        hideQRCode();
      }
    } catch (error) {
      console.error('Error confirming pickup:', error);
      setError('Failed to confirm pickup. Please try again.');
    }
  };

  const handleDeliveryBoyPickup = (orderId: string) => {
    console.log('📱 Delivery boy confirmed pickup for order:', orderId);
    confirmPickup(orderId);
  };

  const generateQRCode = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    const orderDetails = order?.orderDetails || [];
    const productSummary = orderDetails.length > 0
      ? `\n📦 Products: ${orderDetails.map(item => `${item.name} (${item.quantity})`).join(', ')}`
      : '';

    return `📱 Order: ${orderId}\n🛒 Pickup Code: ${orderId.slice(-4)}\n⏰ ${new Date().toLocaleTimeString()}\n🏪 Store: Priya Chicken - Indiranagar${productSummary}\n🔗 Scan to confirm pickup`;
  };

  const OrderCard: React.FC<{ order: Order; isHighlighted?: boolean }> = ({ order, isHighlighted = false }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleOrderClick = async () => {
      if (order.status !== 'awaiting-pickup' && !isUpdating) {
        setIsUpdating(true);
        try {
          await moveOrderToNextStage(order.id);
        } finally {
          setIsUpdating(false);
        }
      }
    };

    return (
      <div
        className={`max-w-[25rem] p-4 rounded-lg mb-3 transition-all duration-500 ease-in-out transform ${isHighlighted ? 'bg-red-600 shadow-lg' : 'bg-gray-700'
          } ${isManager && order.status !== 'awaiting-pickup' ? 'cursor-pointer hover:bg-gray-600 hover:scale-105' : ''}`}
        style={{
          transition: 'all 0.5s ease-in-out',
          willChange: 'transform, opacity'
        }}
      >
        <div className="text-white flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex-1">
            <div className="text-lg font-semibold mb-1">#{order.id}</div>
            <div className="text-sm opacity-90 mb-1">{order.items} items, ₹{order.total}</div>
            <div className="text-xs opacity-75 mb-2">{order.time}</div>

            {/* Display all products */}
            <div className="space-y-2">
              {order.orderDetails?.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 bg-gray-800 p-2 rounded">
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md border border-gray-600"
                      onError={(e) => (e.target as HTMLImageElement).src = '/placeholder-image.jpg'}
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs opacity-80">
                      Qty: {item.quantity} {item.unit || ''} {item.weight ? `(${item.weight})` : ''}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">₹{item.price}</div>
                </div>
              ))}
            </div>

            {/* Manager action / Update button */}
            {/* {(order.status === 'new' || order.status === 'preparing') && (
              <div className="mt-3">
                <button
                  onClick={handleOrderClick}
                  disabled={isUpdating}
                  className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center"
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </>
                  ) : order.status === 'new' ? 'Start Preparing' : 'Mark as Ready'}
                </button>
              </div>
            )} */}

            {order.status === 'picked-up' && (
              <div className="text-xs text-green-300 mt-2">✅ Picked up</div>
            )}
          </div>

          {/* QR button */}
          {/* {order.status === 'awaiting-pickup' && (
            <div className="ml-3 flex items-center mt-3 md:mt-0">
              <a
                href={`/${userRole}/print-qr/${order.id}?orderDetails=${encodeURIComponent(JSON.stringify(order.orderDetails || []))}`}
                target="_blank"
                rel="no-referrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center ml-2"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 8H5a3 3 0 00-3 3v4h4v4h12v-4h4v-4a3 3 0 00-3-3zM7 17h10v2H7v-2zm13-2H4v-4a1 1 0 011-1h14a1 1 0 011 1v4zM17 3H7v3h10V3z" />
                </svg>
                Print QR
              </a>
            </div>
          )} */}
        </div>
      </div>
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 px-6 py-6 shadow-lg border-b border-gray-600 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l-1.5-1.5M12 13v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m0 0a2 2 0 012-2h2a2 2 0 012 2m0 0V8a2 2 0 012-2h2a2 2 0 012 2v5m-8 0v2a2 2 0 002 2h2a2 2 0 002-2v-2m-8 0h16" />
            </svg>
            <div>
              <div className="text-2xl font-bold text-white">
                {storeInfo ? (storeInfo.location ? `${storeInfo.name} - ${storeInfo.location}` : storeInfo.name) : 'Live Orders'}
              </div>
              {/* <div className="text-sm text-gray-300">Real-time Order Dashboard</div> */}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isManager && (
              <button onClick={() => navigate('/manager-dashboard')} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-md hover:shadow-lg">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            )}
            <div className="text-xl font-mono bg-gray-700 px-3 py-1 rounded-lg shadow-md">{currentTime}</div>
            {isAuthenticated && (
              <button onClick={fetchLiveOrders2} disabled={isLoading} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-md hover:shadow-lg">
                <svg className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  toast.success("Logout Successful");
                  setTimeout(() => {
                    localStorage.removeItem('superAdminUser');
                    localStorage.removeItem('managerUser');
                    localStorage.removeItem('storeUser');
                    setIsAuthenticated(false);
                    setOrders([]);
                    if (isManager) navigate('/manager-login');
                    else navigate('/store-login');
                  }, 1500);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* QR Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code for Pickup</h3>
                <div className="bg-gray-100 p-6 rounded-lg mb-4">
                  <div className="flex justify-center mb-4">
                    <svg className="w-24 h-24 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 11h6v6H3v-6zm2 2v2h2v-2H5zm13-2H4v-4a1 1 0 011-1h14a1 1 0 011 1v4zM17 3H7v3h10V3z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600 font-mono whitespace-pre-line">
                    {generateQRCode(showQR)}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-4">Delivery boy should scan this QR code on their mobile device</div>
                <button onClick={hideQRCode} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded font-medium transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex h-screen">
          {!isAuthenticated && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-xl mb-4">🔐 Authentication Required</div>
                <div className="text-gray-500 text-sm mb-6">Please log in to view live orders</div>
                <button
                  onClick={() => isManager ? navigate('/manager-login') : navigate('/store-login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition-colors"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <>
              {isLoading && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <div className="text-xl text-gray-300">Loading orders...</div>
                  </div>
                </div>
              )}

              {!isLoading && error && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                    <button onClick={fetchLiveOrders2} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {!isLoading && !error && orders.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-xl mb-4">📭 No orders available</div>
                    <div className="text-gray-500 text-sm">Orders will appear here when they are created</div>
                  </div>
                </div>
              )}

              {!isLoading && !error && orders.length > 0 && (
                <>
                  <div className="flex-1 p-6 border-r border-gray-700 flex flex-col transition-all duration-500 ease-in-out order-column">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-yellow-400">
                        NEW ORDERS <span className="text-white ml-2">({getOrdersByStatus('new').length})</span>
                      </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="space-y-3 pr-2">
                        {getOrdersByStatus('new').map((order, index) => (
                          <OrderCard key={`${order.id}-${order.status}`} order={order} isHighlighted={index === 0} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6 border-r border-gray-700 flex flex-col transition-all duration-500 ease-in-out order-column">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-blue-400">
                        PREPARING <span className="text-white ml-2">({getOrdersByStatus('preparing').length})</span>
                      </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="space-y-3 pr-2">
                        {getOrdersByStatus('preparing').map((order) => (
                          <OrderCard key={`${order.id}-${order.status}`} order={order} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6 flex flex-col transition-all duration-500 ease-in-out order-column">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-green-400">
                        AWAITING PICKUP <span className="text-white ml-2">({getOrdersByStatus('awaiting-pickup').length})</span>
                      </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="space-y-3 pr-2">
                        {getOrdersByStatus('awaiting-pickup').map((order) => (
                          <OrderCard key={`${order.id}-${order.status}`} order={order} />
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(55, 65, 81, 0.3); border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #3B82F6, #1D4ED8); border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.3); }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #2563EB, #1E40AF); }
          .custom-scrollbar::-webkit-scrollbar-thumb:active { background: linear-gradient(180deg, #1D4ED8, #1E3A8A); }
          .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #3B82F6 rgba(55, 65, 81, 0.3); }
          .order-column { transition: all 0.5s ease-in-out; }
          .order-column:hover { background-color: rgba(55, 65, 81, 0.1); }
        `}</style>
      </div>
    </>
  );
};

export default LiveOrders2;
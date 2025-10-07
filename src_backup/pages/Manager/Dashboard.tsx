import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { managerService, ManagerProfile } from '../../services/managerService';

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [managerProfile, setManagerProfile] = useState<ManagerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        setLoading(true);
        
        // Check if we have the required authentication data
        const accessToken = localStorage.getItem('accessToken');
        const managerUser = localStorage.getItem('managerUser');
        
        console.log('🔍 Dashboard: Checking authentication data');
        console.log('🔍 Dashboard: Access token present:', !!accessToken);
        console.log('🔍 Dashboard: Manager user present:', !!managerUser);
        
        if (!accessToken || !managerUser) {
          console.log('No authentication data found, redirecting to login');
          localStorage.removeItem('managerUser');
          localStorage.removeItem('accessToken');
          navigate('/manager-login');
          return;
        }
        
        // Parse manager user to check if it's valid
        try {
          const parsedManagerUser = JSON.parse(managerUser);
          console.log('🔍 Dashboard: Manager user data:', parsedManagerUser);
          
          if (!parsedManagerUser.role || parsedManagerUser.role !== 'manager') {
            console.log('Invalid manager user data, redirecting to login');
            localStorage.removeItem('managerUser');
            localStorage.removeItem('accessToken');
            navigate('/manager-login');
            return;
          }
        } catch (parseError) {
          console.log('Error parsing manager user data, redirecting to login');
          localStorage.removeItem('managerUser');
          localStorage.removeItem('accessToken');
          navigate('/manager-login');
          return;
        }
        
        const profile = await managerService.getManagerProfile();
        setManagerProfile(profile);
      } catch (error: any) {
        console.error('Failed to fetch manager profile:', error);
        
        // If it's an authentication error (401) or no token found, redirect to login
        if (error.message?.includes('401') || 
            error.message?.includes('Unauthorized') || 
            error.message?.includes('No access token found')) {
          localStorage.removeItem('managerUser');
          localStorage.removeItem('accessToken');
          navigate('/manager-login');
          return;
        }
        
        // For other errors, just log them and continue
        // The dashboard will show with fallback text
      } finally {
        setLoading(false);
      }
    };

    fetchManagerProfile();
  }, [navigate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading manager profile...</p>
        </div>
      </div>
    );
  }

  const handleRetryProfile = () => {
    setLoading(true);
    managerService.getManagerProfile()
      .then(profile => {
        setManagerProfile(profile);
        setLoading(false);
      })
      .catch(error => {
        console.error('Retry failed:', error);
        setLoading(false);
      });
  };

  const handleDebugAuth = () => {
    const accessToken = localStorage.getItem('accessToken');
    const managerUser = localStorage.getItem('managerUser');
    
    console.log('🔍 Debug Authentication:');
    console.log('🔍 Access Token:', accessToken ? 'Present' : 'Missing');
    console.log('🔍 Manager User:', managerUser ? 'Present' : 'Missing');
    
    if (managerUser) {
      try {
        const parsed = JSON.parse(managerUser);
        console.log('🔍 Manager User Data:', parsed);
      } catch (e) {
        console.log('🔍 Error parsing manager user:', e);
      }
    }
    
    if (accessToken) {
      console.log('🔍 Token length:', accessToken.length);
      console.log('🔍 Token preview:', accessToken.substring(0, 20) + '...');
    }
    
    // Test the API call directly
    if (accessToken) {
      console.log('🔍 Testing API call directly...');
      fetch('http://localhost:8000/manager/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('🔍 Direct API Response Status:', response.status);
        console.log('🔍 Direct API Response Headers:', Object.fromEntries(response.headers.entries()));
        return response.text();
      })
      .then(text => {
        console.log('🔍 Direct API Response Body:', text);
      })
      .catch(error => {
        console.error('🔍 Direct API Call Error:', error);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Manager Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                {managerProfile ? (
                  <>
                    <span className="block text-sm font-medium text-blue-600 mt-1">
                      Welcome, {managerProfile.firstName} {managerProfile.lastName}
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">
                      📱 {managerProfile.phone} | 📍 {managerProfile.location}
                    </span>
                  </>
                ) : (
                  <div className="block text-sm text-gray-500 mt-1">
                    <span>Welcome to your dashboard</span>
                    <button 
                      onClick={handleRetryProfile}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                    >
                      Retry loading profile
                    </button>
                    <button 
                      onClick={handleDebugAuth}
                      className="ml-2 text-orange-600 hover:text-orange-800 underline text-xs"
                    >
                      Debug Auth
                    </button>
                  </div>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">{formatDate(currentDateTime)}</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent font-mono">{formatTime(currentDateTime)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Live Orders TV Screen */}
          <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="p-8 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Live Orders TV Screen</h2>
                    <p className="text-red-100 text-lg">Real-time order monitoring for stores</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-red-100">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Display orders in real-time</span>
                  </div>
                  <div className="flex items-center text-red-100">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Auto-updating status categories</span>
                  </div>
                  <div className="flex items-center text-red-100">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Full-screen store display</span>
                  </div>
                </div>

                <Link
                  to="/manager/live-orders"
                  className="inline-flex items-center bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Open TV Screen
                </Link>
              </div>
            </div>
          </div>

          {/* Order Management */}
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="p-8 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Order Management</h2>
                    <p className="text-blue-100 text-lg">Complete order lifecycle control</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-blue-100">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Update order statuses</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Track delivery progress</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>Manage customer requests</span>
                  </div>
                </div>

                <Link
                  to="/manager/order-management"
                  className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Manage Orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Analytics */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Analytics</h3>
                <p className="text-sm text-gray-600">Performance insights</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">View detailed sales reports, customer trends, and store performance metrics</p>
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300">
              View Analytics
            </button>
          </div>

          {/* Delivery Partners */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Delivery Partners</h3>
                <p className="text-sm text-gray-600">Manage couriers</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Track delivery partners, assign orders, and monitor delivery performance</p>
            <Link
              to="/manager/delivery-partner"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-300 inline-block text-center"
            >
              Manage Partners
            </Link>
          </div>

          {/* Store Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Store Settings</h3>
                <p className="text-sm text-gray-600">Configuration</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Configure store preferences, operating hours, and notification settings</p>
            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
              Configure
            </button>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-amber-800 mb-3">
                📺 TV Screen Instructions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-amber-700 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    Click "Open TV Screen" to view full-screen live orders
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    Designed for stores to monitor orders in real-time
                  </li>
                </ul>
                <ul className="text-amber-700 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    Orders auto-categorized by status
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    Screen updates automatically with current time
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StoreDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent mb-3">
            Store Management Panel
          </h1>
          {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to <span className="font-semibold text-red-600">Priya Fresh Meats</span> - Your comprehensive store operations dashboard
          </p> */}
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Stats Overview */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-gray-800">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Today</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Staff Online</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main Control Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Live Order Control */}
          <div className="group transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-400 rounded-full -mr-16 -mt-16 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-400 rounded-full -ml-12 -mb-12 opacity-20"></div>

              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-white bg-opacity-20 mr-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">Live Order TV Display</h2>
                </div>

                <p className="text-red-100 text-lg mb-6 leading-relaxed">
                  Monitor real-time customer orders on large screen displays. Perfect for kitchen staff and production teams to view incoming orders instantly with automatic updates.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-red-100">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Real-time order synchronization
                  </li>
                  <li className="flex items-center text-red-100">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-refresh every 30 seconds
                  </li>
                  <li className="flex items-center text-red-100">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Large, easy-to-read display
                  </li>
                </ul>

                <Link
                  to="/store/live-orders"
                  className="inline-flex items-center bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Launch Live Order Display
                </Link>
              </div>
            </div>
          </div>

          {/* Front Desk Control */}
          <div className="group transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full -mr-16 -mt-16 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full -ml-12 -mb-12 opacity-20"></div>

              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-white bg-opacity-20 mr-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">Front Desk Management</h2>
                </div>

                <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                  Complete order management system for front desk operations. Process orders, update status, handle customer queries, and manage daily store operations efficiently.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-blue-100">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Order processing & tracking
                  </li>
                  <li className="flex items-center text-blue-100">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Customer management
                  </li>
                  <li className="flex items-center text-blue-100">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Real-time status updates
                  </li>
                </ul>

                <Link
                  to="/store/front-desk"
                  className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Open Front Desk Panel
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-4 rounded-xl transition-colors duration-200 flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium">New Order</span>
            </button>

            <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-4 rounded-xl transition-colors duration-200 flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium">Reports</span>
            </button>

            <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-4 rounded-xl transition-colors duration-200 flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">Staff</span>
            </button>

            <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-4 rounded-xl transition-colors duration-200 flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium">Inventory</span>
            </button>
          </div>
        </div> */}

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Need help? Contact store support at <span className="text-blue-600 font-medium">support@priyafreshmeats.com</span> or call <span className="text-blue-600 font-medium">+91-9876543210</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
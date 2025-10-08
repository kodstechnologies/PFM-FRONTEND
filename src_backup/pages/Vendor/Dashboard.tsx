import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StoreDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Store Panel - Priya Fresh Meats
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Live Orders TV Screen */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">Live Orders TV Screen</h2>
              <p className="text-red-100 mb-4">
                Display real-time orders on TV screen for vendor stores
              </p>
              <Link
                to="/store/live-orders"
                className="inline-block bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Open TV Screen
              </Link>
            </div>

            {/* Order Management */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">Order Management</h2>
              <p className="text-blue-100 mb-4">
                Manage and update order statuses
              </p>
              <button className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Manage Orders
              </button>
            </div>

            {/* Analytics */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">Analytics</h2>
              <p className="text-green-100 mb-4">
                View sales and performance metrics
              </p>
              <button className="inline-block bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                View Analytics
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              📺 TV Screen Instructions
            </h3>
            <ul className="text-yellow-700 space-y-1">
              <li>• Click "Open TV Screen" to view the full-screen live orders display</li>
              <li>• The TV screen is designed for vendor stores to monitor orders in real-time</li>
              <li>• Orders are automatically categorized by status (New, Preparing, Awaiting Pickup)</li>
              <li>• The screen updates automatically and shows current time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard; 
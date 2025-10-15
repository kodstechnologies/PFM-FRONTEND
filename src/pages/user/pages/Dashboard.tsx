import React from 'react'
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const navigate = useNavigate();

    const handleAdminClick = () => {
        navigate('/admin-login');
    };

    const handleManagerClick = () => {
        navigate('/manager-login');
    };

    const handleStoreClick = () => {
        navigate('/store-login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full text-center">
                {/* Logo Section */}
                <div className="mb-12">
                    <div className="flex justify-center mb-6">
                        <img
                            src="/logo.png"
                            alt="Priya Fresh Meats Logo"
                            className="h-40 w-40 object-contain transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                    <div className="mb-4">

                        <h1 className="text-4xl md:text-5xl font-bold text-red-800 mb-4">
                            Priya Fresh Meats
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 mb-2">
                        Freshness Delivered to Your Doorstep
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full"></div>
                </div>

                {/* Welcome Section */}


                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={handleAdminClick}
                    >
                        <div className="text-3xl mb-4">👨‍💼</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Admin</h3>
                        <p className="text-gray-600">Access admin login</p>
                    </div>
                    <div
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={handleManagerClick}
                    >
                        <div className="text-3xl mb-4">👨‍💼</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Manager</h3>
                        <p className="text-gray-600">Access manager login</p>
                    </div>
                    <div
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={handleStoreClick}
                    >
                        <div className="text-3xl mb-4">🏪</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Store</h3>
                        <p className="text-gray-600">Access store login</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                        Welcome to PFM Dashboard
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        Your gateway to premium quality fresh meats and exceptional service.
                        Experience the finest selection of meat products delivered with care and precision.
                    </p>
                </div>
                {/* Footer Text */}
                <div className="mt-12 text-gray-500">
                    <p className="text-sm">
                        © 2025 Priya Fresh Meats. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
import React from 'react'
import { useNavigate } from 'react-router-dom';
import bg_img from "../../../../src/assets/bg/pfm_bg.png"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import StoreIcon from '@mui/icons-material/Store';

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
        <div
            className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
            style={{
                backgroundImage: `url(${bg_img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Animated Background Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Floating Animation Elements */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-red-400 rounded-full opacity-30 animate-float delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-orange-300 rounded-full opacity-25 animate-float delay-2000"></div>

            <div className="max-w-4xl w-full text-center relative z-10">
                {/* Logo Section */}
                <div className="mb-12">
                    <div className="flex justify-center mb-6">
                        <img
                            src="/logo.png"
                            alt="Priya Fresh Meats Logo"
                            className="h-40 w-40 object-contain transition-all duration-500 hover:scale-110 hover:rotate-3 drop-shadow-2xl"
                        />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                            Priya Fresh Meats
                        </h1>
                    </div>
                    <p className="text-lg text-white mb-2 drop-shadow-lg">
                        Freshness Delivered to Your Doorstep
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full shadow-lg"></div>
                </div>

                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Admin Card */}
                    <div
                        className="relative bg-white bg-opacity-10 rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 backdrop-blur-lg border border-white border-opacity-20 hover:border-opacity-40"
                        onClick={handleAdminClick}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex justify-center mb-4 transform transition-transform duration-300 hover:scale-125">
                                <AdminPanelSettingsIcon
                                    style={{ fontSize: 48 }}
                                    className="text-white"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">Admin</h3>
                            <p className="text-gray-200 drop-shadow-md">Access admin login</p>
                        </div>
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/0 via-red-500/10 to-orange-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Manager Card */}
                    <div
                        className="relative bg-white bg-opacity-10 rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 backdrop-blur-lg border border-white border-opacity-20 hover:border-opacity-40"
                        onClick={handleManagerClick}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex justify-center mb-4 transform transition-transform duration-300 hover:scale-125">
                                <ManageAccountsIcon
                                    style={{ fontSize: 48 }}
                                    className="text-white"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">Manager</h3>
                            <p className="text-gray-200 drop-shadow-md">Access manager login</p>
                        </div>
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-purple-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Store Card */}
                    <div
                        className="relative bg-white bg-opacity-10 rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 backdrop-blur-lg border border-white border-opacity-20 hover:border-opacity-40"
                        onClick={handleStoreClick}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex justify-center mb-4 transform transition-transform duration-300 hover:scale-125">
                                <StoreIcon
                                    style={{ fontSize: 48 }}
                                    className="text-white"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">Store</h3>
                            <p className="text-gray-200 drop-shadow-md">Access store login</p>
                        </div>
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/0 via-emerald-500/10 to-green-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="relative bg-white bg-opacity-10 rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-lg border border-white border-opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 drop-shadow-lg">
                            Welcome to PFM Dashboard
                        </h2>
                        <p className="text-gray-200 text-lg leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                            Your gateway to premium quality fresh meats and exceptional service.
                            Experience the finest selection of meat products delivered with care and precision.
                        </p>
                    </div>
                </div>

                {/* Footer Text */}
                <div className="mt-12 text-white drop-shadow-lg">
                    <p className="text-sm">
                        © 2025 Priya Fresh Meats. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Add custom animations to CSS */}
            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                .animate-float { 
                    animation: float 6s ease-in-out infinite; 
                }
                .delay-1000 { 
                    animation-delay: 1s; 
                }
                .delay-2000 { 
                    animation-delay: 2s; 
                }
                .hover\\:shadow-3xl:hover { 
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); 
                }
                `}
            </style>
        </div>
    )
}

export default UserDashboard
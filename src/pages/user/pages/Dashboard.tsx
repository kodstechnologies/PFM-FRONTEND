import React from 'react'

function UserDashboard() {
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
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                        Welcome to PFM Dashboard
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        Your gateway to premium quality fresh meats and exceptional service. 
                        Experience the finest selection of meat products delivered with care and precision.
                    </p>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="text-3xl mb-4">🥩</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Quality</h3>
                        <p className="text-gray-600">Hand-selected, fresh meats of the highest quality</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="text-3xl mb-4">🚚</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
                        <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="text-3xl mb-4">⭐</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Trusted Service</h3>
                        <p className="text-gray-600">Years of experience serving our community</p>
                    </div>
                </div>

                {/* Footer Text */}
                <div className="mt-12 text-gray-500">
                    <p className="text-sm">
                        © 2024 Priya Fresh Meats. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
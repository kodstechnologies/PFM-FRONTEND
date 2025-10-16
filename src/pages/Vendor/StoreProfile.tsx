import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callApi } from "../../util/admin_api";

const StoreProfile: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [storeData, setStoreData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStoreProfile();
    }, []);

    const fetchStoreProfile = async () => {
        try {
            setLoading(true);
            const storedUser = localStorage.getItem("storeUser");

            if (!storedUser) {
                console.error("No storeUser found in localStorage");
                throw new Error("No user data found");
            }

            const parsedUser = JSON.parse(storedUser);
            console.log("🚀 ~ fetchStoreProfile ~ parsedUser:", parsedUser)

            if (!parsedUser.id) {
                console.error("Store ID not found in storeUser");
                throw new Error("No store ID found");
            }

            const res = await callApi({
                endpoint: `/store/profile/${parsedUser.id}`,
                method: "GET",
            });
            console.log("🚀 ~ fetchStoreProfile ~ res:", res)

            const data = res?.data?.store || res?.store || res;

            if (!data) {
                throw new Error("Store data not found");
            }

            setStoreData(data);
        } catch (error) {
            console.error("Error fetching store profile:", error);
            toast.error("Failed to load profile data. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("storeUser");
        toast.success("Logged out successfully", {
            position: "top-right",
            autoClose: 2000,
        });
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center animate-fade-in">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-700 text-lg font-medium">Loading store profile...</p>
                    <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
                </div>
            </div>
        );
    }

    if (!storeData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center animate-slide-up">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
                    <p className="text-gray-600 mb-6">We couldn't load your store profile information.</p>
                    <div className="flex space-x-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 font-medium transform hover:scale-105"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={fetchStoreProfile}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium transform hover:scale-105"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const managerFullName = storeData.manager
        ? `${storeData.manager.firstName} ${storeData.manager.lastName}`
        : "N/A";
    const statusColor = storeData.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    const statusText = storeData.isActive ? "Active" : "Inactive";

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Header Section */}
                <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 relative z-10">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6 animate-slide-down">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition duration-300 group transform hover:scale-105"
                                >
                                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center group-hover:border-gray-300 transition duration-300 shadow-sm hover:shadow-md">
                                        <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                    </div>
                                    <span className="font-medium hidden sm:block">Back</span>
                                </button>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-10 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-full animate-pulse"></div>
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Store Profile</h1>
                                        <p className="text-gray-500 text-sm">Manage your store information</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className={`px-4 py-2 rounded-full ${statusColor} font-medium text-sm border animate-bounce-slow`}>
                                    {statusText}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Store Information Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/30 overflow-hidden group animate-slide-up delay-100">
                            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/10"></div>
                                <div className="flex items-center space-x-3 relative z-10">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Store Information</h2>
                                        <p className="text-blue-100 text-sm">Basic store details and contact information</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <InfoRow
                                    icon="🏪"
                                    label="Store Name"
                                    value={storeData.name}
                                />
                                <InfoRow
                                    icon="📍"
                                    label="Location"
                                    value={storeData.location}
                                />
                                <InfoRow
                                    icon="📞"
                                    label="Phone"
                                    value={storeData.phone}
                                />
                                <InfoRow
                                    icon="📮"
                                    label="Pincode"
                                    value={storeData.pincode}
                                />

                            </div>
                        </div>

                        {/* Manager Information Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/30 overflow-hidden group animate-slide-up delay-200">
                            <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 px-6 py-5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/10"></div>
                                <div className="flex items-center space-x-3 relative z-10">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Manager Information</h2>
                                        <p className="text-green-100 text-sm">Store manager details and contact</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <InfoRow
                                    icon="👤"
                                    label="Full Name"
                                    value={managerFullName}
                                />

                                <InfoRow
                                    icon="📞"
                                    label="Phone"
                                    value={storeData.manager?.phone || "N/A"}
                                />


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Reusable Info Row Component
const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sm border border-gray-200/30">
        <div className="flex items-center space-x-3 animate-fade-in-row">
            <span className="text-xl animate-bounce-slow">{icon}</span>
            <span className="font-medium text-gray-700">{label}</span>
        </div>
        <span className="font-semibold text-gray-900 text-right bg-white px-3 py-1 rounded-md shadow-sm">{value}</span>
    </div>
);

// Reusable Action Button Component
const ActionButton = ({ icon, title, description, onClick }: { icon: string; title: string; description: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 transform hover:scale-105 text-left group"
    >
        <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition duration-300">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
    </button>
);

export default StoreProfile;
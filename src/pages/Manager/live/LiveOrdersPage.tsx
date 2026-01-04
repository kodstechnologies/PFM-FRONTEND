

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react"; // Added for reload icon
import axios from "axios";
import OrderColumn from "./OrderColumn";
import { API_CONFIG } from "../../../config/api.config";

/* ================= TYPES ================= */
export type OrderStatus = "new" | "preparing" | "awaiting-pickup";

export interface OrderItem {
    name: string;
    quantity: number;
    unit?: "gram" | "pieces" | "pcs";
    weight?: string;
}

export interface Order {
    id: string;
    receiverName: string;
    items: number;
    time: string;
    status: OrderStatus;
    orderDetails: OrderItem[];
}

/* ================= CONSTANTS ================= */
const POLL_INTERVAL = 30000; // 30 seconds

/* ================= COMPONENT ================= */
const LiveOrdersPage: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [storeName, setStoreName] = useState<string>("Loading Store...");

    const isManager = true;

    /* ================= STORE ID ================= */
    const storeUser = localStorage.getItem("storeUser");
    const storeId = storeUser ? JSON.parse(storeUser)?.storeId : null;

    /* ================= STATUS NORMALIZER ================= */
    const normalizeStatus = useCallback((status: string): OrderStatus => {
        const value = status?.toLowerCase();

        if (value === "pending" || value === "confirmed") return "new";
        if (value === "preparing") return "preparing";
        if (value === "ready" || value === "picked_up") return "awaiting-pickup";

        return "new";
    }, []);

    /* ================= FETCH ORDERS ================= */
    const fetchOrders = useCallback(async () => {
        if (!storeId) {
            setError("Store not assigned");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("Authentication required");

            const res = await axios.get(
                `${API_CONFIG.BASE_URL}/store/orders/${storeId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const apiData = res.data?.data;
            const backendOrders = apiData?.orders || [];
            console.log("🚀 ~ LiveOrdersPage ~ backendOrders:", backendOrders);

            // ✅ Extract store name from API response
            setStoreName(apiData?.store?.name || "Unknown Store");

            const formatted: Order[] = backendOrders.map((order: any) => ({
                id: order._id,
                receiverName:
                    order.receiverName || order.recieverName || "Unknown",
                items: order.orderDetails?.length || 0,
                time: new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                status: normalizeStatus(order.status),
                orderDetails: (order.orderDetails || []).map((item: any) => ({
                    name: item.name || "Unknown Item",
                    quantity: item.quantity || 0,
                    unit: item.unit,
                    weight: item.weight,
                })),
            }));

            setOrders(formatted);
        } catch (err: any) {
            console.error("❌ Fetch failed:", err);
            setError(err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, [storeId, normalizeStatus]);

    /* ================= POLLING & INITIAL FETCH ================= */
    useEffect(() => {
        fetchOrders(); // Initial fetch (includes store name)
        const interval = setInterval(fetchOrders, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    /* ================= LOGOUT ================= */
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    /* ================= MANUAL RELOAD ================= */
    const handleReload = () => {
        fetchOrders();
    };

    /* ================= UPDATE STATUS ================= */
    const handleNext = useCallback(
        async (orderId: string, currentStatus: OrderStatus) => {
            try {
                setLoading(true);

                const token = localStorage.getItem("accessToken");
                if (!token) throw new Error("Authentication required");

                const nextStatus =
                    currentStatus === "new" ? "preparing" : "ready";

                const res = await axios.patch(
                    `${API_CONFIG.BASE_URL}/manager/orders/${orderId}/status`,
                    { status: nextStatus }, // ✅ BODY
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const updated = res.data?.data;
                console.log("🚀 ~ LiveOrdersPage ~ updated:", updated)

                if (!updated) throw new Error("Update failed");

                setOrders((prev) =>
                    prev.map((order) =>
                        order.id === updated._id
                            ? { ...order, status: normalizeStatus(updated.status) }
                            : order
                    )
                );
            } catch (err: any) {
                console.error("❌ Status update error:", err);
                alert(err.message || "Failed to update order");
            } finally {
                setLoading(false);
            }
        },
        [normalizeStatus]
    );
    /* ================= BACK ================= */
    const handleBack = () => {
        navigate(-1);
    };

    /* ================= FILTER ================= */
    const getOrdersByStatus = (status: OrderStatus) =>
        orders.filter((o) => o.status === status);

    /* ================= UI ================= */
    if (loading && orders.length === 0) {
        return (
            <div className="flex h-screen bg-gray-900 text-white items-center justify-center">
                Loading orders...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-900 text-white items-center justify-center flex-col">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-blue-600 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            {/* 🔹 TOP HEADER: Store Name + Reload + Logout */}
            <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        title="Go Back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="text-lg font-bold text-white">
                        📦 {storeName} Dashboard
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleReload}
                        disabled={loading}
                        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-1 text-sm"
                        title="Reload Orders"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Loading...' : 'Reload'}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* 🔹 ORDERS COLUMNS */}
            <div className="flex flex-1 overflow-hidden">
                <OrderColumn
                    title="NEW ORDERS"
                    orders={getOrdersByStatus("new")}
                    isManager={isManager}
                    onNext={handleNext}
                    loading={loading}
                />

                <OrderColumn
                    title="PREPARING"
                    orders={getOrdersByStatus("preparing")}
                    isManager={isManager}
                    onNext={handleNext}
                    loading={loading}
                />

                <OrderColumn
                    title="AWAITING PICKUP"
                    orders={getOrdersByStatus("awaiting-pickup")}
                    isManager={isManager}
                    onNext={handleNext}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default LiveOrdersPage;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import OrderColumn from "./OrderColumn";
// import { API_CONFIG } from "../../../config/api.config";

// /* ================= TYPES (LOCAL) ================= */

// export type OrderStatus = "new" | "preparing" | "awaiting-pickup";

// export interface OrderItem {
//     name: string;
//     quantity: number;   // raw quantity (e.g. 200)
//     unit?: "gram" | "pieces";
// }

// export interface Order {
//     id: string;
//     recieverName: string;
//     items: number;
//     time: string;
//     status: OrderStatus;
//     orderDetails: OrderItem[];
// }

// /* ================= COMPONENT ================= */

// const LiveOrdersPage: React.FC = () => {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const isManager = true;
//     const managerId = "manager-tv-screen";
//     const storeId = "69511be61a61a1a957623724";

//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     /* ================= STATUS NORMALIZER ================= */
//     const normalizeStatus = (status: string): OrderStatus => {
//         const value = status?.toLowerCase();

//         if (value === "new") return "new";
//         if (value === "preparing") return "preparing";
//         if (value === "ready") return "awaiting-pickup";

//         return "new";
//     };

//     /* ================= FETCH ORDERS ================= */
//     const fetchOrders = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             const token = localStorage.getItem("accessToken");

//             const res = await axios.get(
//                 `${API_CONFIG.BASE_URL}/store/orders/${storeId}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             // ✅ Correct backend path
//             const backendOrders = res.data?.data?.orders || [];

//             const formattedOrders: Order[] = backendOrders.map((order: any) => ({
//                 id: order._id,
//                 recieverName: order.recieverName,
//                 items: order.orderDetails?.length || 0,
//                 time: new Date(order.createdAt).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                 }),
//                 status: normalizeStatus(order.status),
//                 orderDetails: order.orderDetails.map((item: any) => ({
//                     name: item.name,
//                     quantity: item.quantity,
//                     unit: item.unit,
//                 })),
//             }));

//             setOrders(formattedOrders);
//         } catch (err) {
//             console.error("❌ Fetch orders failed:", err);
//             setError("Failed to load orders");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= UPDATE STATUS ================= */
//     const handleNext = async (orderId: string, currentStatus: OrderStatus) => {
//         try {
//             setLoading(true);

//             const token = localStorage.getItem("accessToken");

//             const nextStatus =
//                 currentStatus === "new"
//                     ? "preparing"
//                     : "ready";

//             const res = await axios.patch(
//                 `${API_CONFIG.BASE_URL}/manager/orders/${orderId}/status`,
//                 {
//                     status: nextStatus,
//                     managerId,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             const updated = res.data?.data;

//             setOrders(prev =>
//                 prev.map(order =>
//                     order.id === updated._id
//                         ? { ...order, status: normalizeStatus(updated.status) }
//                         : order
//                 )
//             );
//         } catch (err) {
//             console.error("❌ Status update failed:", err);
//             alert("Failed to update order status");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= FILTER ================= */
//     const getOrdersByStatus = (status: OrderStatus) =>
//         orders.filter(order => order.status === status);

//     /* ================= UI ================= */
//     return (
//         <div className="flex h-screen bg-gray-900 text-white">
//             <OrderColumn
//                 title="NEW ORDERS"
//                 orders={getOrdersByStatus("new")}
//                 isManager={isManager}
//                 onNext={handleNext}
//                 loading={loading}
//             />

//             <OrderColumn
//                 title="PREPARING"
//                 orders={getOrdersByStatus("preparing")}
//                 isManager={isManager}
//                 onNext={handleNext}
//                 loading={loading}
//             />

//             <OrderColumn
//                 title="AWAITING PICKUP"
//                 orders={getOrdersByStatus("awaiting-pickup")}
//                 isManager={isManager}
//                 onNext={handleNext}
//                 loading={loading}
//             />
//         </div>
//     );
// };

// export default LiveOrdersPage;


import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderColumn from "./OrderColumn";
import { API_CONFIG } from "../../../config/api.config";

/* ================= TYPES (LOCAL) ================= */

export type OrderStatus = "new" | "preparing" | "awaiting-pickup";

export interface OrderItem {
    name: string;
    quantity: number;   // raw quantity (e.g. 200)
    unit?: "gram" | "pieces";
}

export interface Order {
    id: string;
    receiverName: string;
    items: number;
    time: string;
    status: OrderStatus;
    orderDetails: OrderItem[];
}

/* ================= COMPONENT ================= */

const LiveOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isManager = true;
    const managerId = "manager-tv-screen";
    const storeId = "69511be61a61a1a957623724";

    useEffect(() => {
        fetchOrders();
    }, []);

    /* ================= STATUS NORMALIZER ================= */
    const normalizeStatus = (status: string): OrderStatus => {
        const value = status?.toLowerCase();

        if (value === "new") return "new";
        if (value === "preparing") return "preparing";
        if (value === "ready") return "awaiting-pickup";

        return "new";
    };

    /* ================= FETCH ORDERS ================= */
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("accessToken");

            const res = await axios.get(
                `${API_CONFIG.BASE_URL}/store/orders/${storeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // ✅ Correct backend path
            const backendOrders = res.data?.data?.orders || [];

            const formattedOrders: Order[] = backendOrders.map((order: any) => ({
                id: order._id,
                receiverName: order.recieverName,
                items: order.orderDetails?.length || 0,
                time: new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                status: normalizeStatus(order.status),
                orderDetails: order.orderDetails.map((item: any) => ({
                    name: item.name,
                    quantity: item.quantity,
                    unit: item.unit,
                })),
            }));

            setOrders(formattedOrders);
        } catch (err) {
            console.error("❌ Fetch orders failed:", err);
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UPDATE STATUS ================= */
    const handleNext = async (orderId: string, currentStatus: OrderStatus) => {
        try {
            setLoading(true);

            const token = localStorage.getItem("accessToken");

            const nextStatus =
                currentStatus === "new"
                    ? "preparing"
                    : "ready";

            const res = await axios.patch(
                `${API_CONFIG.BASE_URL}/manager/orders/${orderId}/status`,
                {
                    status: nextStatus,
                    managerId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updated = res.data?.data;

            setOrders(prev =>
                prev.map(order =>
                    order.id === updated._id
                        ? { ...order, status: normalizeStatus(updated.status) }
                        : order
                )
            );
        } catch (err) {
            console.error("❌ Status update failed:", err);
            alert("Failed to update order status");
        } finally {
            setLoading(false);
        }
    };

    /* ================= FILTER ================= */
    const getOrdersByStatus = (status: OrderStatus) =>
        orders.filter(order => order.status === status);

    /* ================= UI ================= */
    return (
        <div className="flex h-screen bg-gray-900 text-white">
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
    );
};

export default LiveOrdersPage;
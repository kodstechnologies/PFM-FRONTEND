
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle,
    Clock,
    Package,
    Truck,
    QrCode,
    ChevronRight,
    Info // Added Info icon for details trigger
} from "lucide-react";

/* ================= TYPES ================= */
export type OrderStatus = "new" | "preparing" | "awaiting-pickup";

export interface OrderItem {
    name: string;
    quantity: number;
    unit?: "gram" | "pieces" | "pcs" | "kg";
    weight?: string;
    price?: number; // Added for total calculation
}

export interface Order {
    id: string;
    receiverName: string;
    items: number;
    time: string;
    status: OrderStatus;
    orderDetails: OrderItem[];
    totalAmount?: number; // Added: Total order amount
    storeName?: string; // Added: Store name for details
    userPhone?: string; // Added: User contact if available
    createdAt?: string; // Added: Full timestamp for details
}

/* ================= PROPS ================= */
interface Props {
    order: Order;
    isManager: boolean;
    onNext: (orderId: string, currentStatus: OrderStatus) => void;
    loading: boolean;
    showNextButton?: boolean; // Added: Optional prop to control button visibility from parent
    showQRPrint?: boolean; // Added: Optional prop to control QR print visibility from parent
}

/* ================= HELPERS ================= */
const formatQuantity = (
    quantity: number,
    unit?: string,
    weight?: string
): string => {
    const normalizedUnit = unit?.toLowerCase().trim();
    if (normalizedUnit === "pieces" || normalizedUnit === "pcs") {
        const perItem = Number(weight || 1);
        return `${quantity * perItem} pcs`;
    }
    if (normalizedUnit === "gram") {
        const grams = Number(weight);
        return grams >= 1000 ? `${(grams / 1000).toFixed(1)} kg` : `${grams} g`;
    }
    if (normalizedUnit === "kg") {
        const kgPerItem = Number(weight || 1);
        return `${(quantity * kgPerItem).toFixed(1)} kg`;
    }
    return `${quantity}`;
};

const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
        case "new":
            return {
                color: "bg-blue-500",
                textColor: "text-blue-400",
                icon: <Clock className="w-3 h-3" />,
                label: "New Order",
                gradient: "from-blue-500/20 to-blue-600/10"
            };
        case "preparing":
            return {
                color: "bg-amber-500",
                textColor: "text-amber-400",
                icon: <Package className="w-3 h-3" />,
                label: "Preparing",
                gradient: "from-amber-500/20 to-amber-600/10"
            };
        case "awaiting-pickup":
            return {
                color: "bg-emerald-500",
                textColor: "text-emerald-400",
                icon: <Truck className="w-3 h-3" />,
                label: "Ready for Pickup",
                gradient: "from-emerald-500/20 to-emerald-600/10"
            };
    }
};

/* ================= DETAILS MODAL SUB-COMPONENT ================= */
const OrderDetailsModal: React.FC<{
    order: Order;
    onClose: () => void;
}> = ({ order, onClose }) => {
    const totalAmount =
        order.totalAmount ||
        order.orderDetails.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0
        );

    const fullDate = order.createdAt
        ? new Date(order.createdAt).toLocaleString()
        : order.time;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Order Details
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <span className="font-mono">#{order.id}</span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        {fullDate}
                    </div>
                </div>

                {/* User Info */}
                <div className="p-6">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5" />
                        Customer
                    </h3>

                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Name</span>
                            <span className="font-medium text-gray-900">
                                {order.receiverName}
                            </span>
                        </div>

                        {order.userPhone && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phone</span>
                                <span className="font-medium text-gray-900">
                                    {order.userPhone}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Store */}
                {order.storeName && (
                    <div className="px-6 pb-6">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                            <Truck className="w-5 h-5" />
                            Store
                        </h3>
                        <p className="text-sm text-gray-700">{order.storeName}</p>
                    </div>
                )}

                {/* Items */}
                <div className="px-6 pb-6">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                        <QrCode className="w-5 h-5" />
                        Order Summary
                    </h3>

                    <div className="space-y-3 text-sm">
                        {order.orderDetails.map((item, i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatQuantity(item.quantity, item.unit, item.weight)}
                                    </p>
                                </div>

                                {item.price && (
                                    <div className="font-semibold text-gray-900">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="mt-4 pt-4 border-t flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                        {order.items} item{order.items !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ================= MAIN COMPONENT ================= */
const MOrderCard: React.FC<Props> = ({
    order,
    isManager,
    onNext,
    loading,
    showNextButton = true, // Default to true if not provided
    showQRPrint = true, // Default to true if not provided
}) => {
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false); // State for modal
    const statusConfig = getStatusConfig(order.status);

    const handleCardClick = () => {
        if (order.status === "awaiting-pickup") {
            navigate(`/manager/print-qr/${order.id}`);
        }
    };

    const handleDetailsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDetails(true);
    };

    const isClickable = order.status === "awaiting-pickup";

    console.log("🚀 ~ OrderCard ~ print:", print)
    return (
        <>
            <div
                onClick={handleCardClick}
                className={`
        relative overflow-hidden rounded-xl transition-all duration-300
        ${isClickable
                        ? "cursor-pointer hover:scale-[1.02] active:scale-[0.99]"
                        : "hover:bg-gray-800/50"
                    }
        bg-gradient-to-br from-gray-900 to-gray-950
        border border-gray-800
        shadow-lg hover:shadow-xl
        group
      `}
            >
                {/* Status indicator bar */}
                <div
                    className={`
          absolute top-0 left-0 w-1 h-full
          ${statusConfig.color}
          ${isClickable ? "group-hover:opacity-80" : ""}
        `}
                />

                {/* Status badge + Details Icon */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <div
                        className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-full
            ${statusConfig.textColor} bg-gray-900/80
            border border-gray-700 backdrop-blur-sm
            text-xs font-medium
          `}
                    >
                        {statusConfig.icon}
                        {statusConfig.label}
                    </div>
                    {/* 🔹 Side Corner Icon for Details */}
                    <button
                        onClick={handleDetailsClick}
                        className="p-1.5 rounded-full bg-gray-800/50 hover:bg-gray-700/70 text-gray-400 hover:text-white transition-all group/info"
                        title="View full details"
                        aria-label="View order details"
                    >
                        <Info className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 pt-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                    {order.receiverName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {order.receiverName}
                                </h3>
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {order.time}
                                </p>
                            </div>
                        </div>

                        {isClickable && (
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        )}
                    </div>

                    {/* Items list */}
                    <div className="mb-4 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Package className="w-3 h-3" />
                            <span>{order.items} item{order.items > 1 ? 's' : ''}</span>
                        </div>

                        <div className="space-y-2">
                            {order.orderDetails.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {item.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-300 font-medium px-2.5 py-0.5 rounded-full bg-gray-800">
                                            {formatQuantity(item.quantity, item.unit, item.weight)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-gray-800">
                        {isManager && order.status !== "awaiting-pickup" && showNextButton ? (
                            <button
                                disabled={loading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNext(order.id, order.status);
                                }}
                                className={`
                w-full flex items-center justify-center gap-2
                px-4 py-2.5 rounded-lg
                text-sm font-medium
                transition-all duration-300
                ${loading
                                        ? "bg-gray-800 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-[0.98]"
                                    }
                text-white shadow-lg hover:shadow-xl
              `}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Move to Next Stage
                                    </>
                                )}
                            </button>
                        ) : order.status === "awaiting-pickup" && showQRPrint && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/manager/print-qr/${order.id}`, "_blank");
                                }}
                                className="flex items-center justify-between cursor-pointer
               hover:bg-gray-800/60 p-2 rounded-lg transition"
                            >
                                <div className="flex items-center gap-2 text-blue-400">
                                    <QrCode className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        Ready for QR Print
                                    </span>
                                </div>

                                <span className="text-xs text-gray-400 group-hover:text-blue-300 transition-colors">
                                    Tap to print →
                                </span>
                            </div>
                        )}

                    </div>
                </div>

                {/* Hover effect overlay */}
                {isClickable && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
            </div>

            {/* 🔹 DETAILS MODAL */}
            {showDetails && <OrderDetailsModal order={order} onClose={() => setShowDetails(false)} />}
        </>
    );
};

export default MOrderCard;
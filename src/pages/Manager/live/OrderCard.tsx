import React from "react";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

export type OrderStatus = "new" | "preparing" | "awaiting-pickup";

export interface OrderItem {
    name: string;
    quantity: number;
    unit?: string;
}

export interface Order {
    id: string;
    receiverName: string; // ✅ fixed spelling
    items: number;
    time: string;
    status: OrderStatus;
    orderDetails: OrderItem[];
}

/* ================= PROPS ================= */

interface Props {
    order: Order;
    isManager: boolean;
    onNext: (orderId: string, currentStatus: OrderStatus) => void;
    loading: boolean;
}

/* ================= HELPERS ================= */

const formatQuantity = (qty: number, unit?: string) => {
    const normalizedUnit = unit?.toLowerCase();

    // ✅ Gram → Kg conversion
    if (normalizedUnit?.includes("gram")) {
        if (qty >= 1000) {
            return `${(qty / 1000).toFixed(1)} kg`;
        }
        return `${qty} g`;
    }

    // ✅ Pieces
    if (
        normalizedUnit?.includes("piece") ||
        normalizedUnit?.includes("pcs")
    ) {
        return `${qty} pcs`;
    }

    return `${qty}`;
};

/* ================= COMPONENT ================= */

const OrderCard: React.FC<Props> = ({
    order,
    isManager,
    onNext,
    loading,
}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (order.status === "awaiting-pickup") {
            navigate(`/store/print-qr/${order.id}`);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className={`bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition
                ${order.status === "awaiting-pickup"
                    ? "cursor-pointer"
                    : "cursor-default"
                }
            `}
        >
            {/* Order ID */}
            <div className="text-sm font-semibold">#{order.id}</div>

            {/* Receiver Name */}
            <div className="text-xs text-gray-300 mt-1">
                {order.receiverName}
            </div>

            {/* Order Items */}
            <div className="mt-3 space-y-1 text-sm">
                {order.orderDetails.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between text-gray-200"
                    >
                        <span className="truncate">
                            {item.name} <span className="mx-1">*</span>
                        </span>
                        <span className="font-medium">
                            {formatQuantity(item.quantity, item.unit)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Manager Action */}
            {isManager && order.status !== "awaiting-pickup" && (
                <button
                    disabled={loading}
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext(order.id, order.status);
                    }}
                    className="mt-3 bg-green-600 hover:bg-green-700
                               disabled:opacity-50 px-3 py-1 rounded text-xs"
                >
                    {loading ? "Updating..." : "Next"}
                </button>
            )}

            {/* QR Hint */}
            {order.status === "awaiting-pickup" && (
                <div className="mt-3 text-xs text-blue-300">
                    Tap card to open QR
                </div>
            )}
        </div>
    );
};

export default OrderCard;

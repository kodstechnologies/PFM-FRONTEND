import React from "react";
import { Clock, Package, Truck, QrCode } from "lucide-react";

/* ================= TYPES ================= */

interface OrderItem {
  name: string;
  quantity: number;
  unit?: "gram" | "pieces" | "pcs" | "kg";
  weight?: string;
  price?: number;
}

interface Order {
  id: string;
  receiverName: string;
  items: number;
  time: string;
  orderDetails: OrderItem[];
  totalAmount?: number;
  storeName?: string;
  userPhone?: string;
  createdAt?: string;
}

/* ================= HELPERS ================= */

const formatQuantity = (
  quantity: number,
  unit?: string,
  weight?: string
): string => {
  const u = unit?.toLowerCase();

  if (u === "pcs" || u === "pieces") {
    return `${quantity} pcs`;
  }

  if (u === "gram") {
    const g = Number(weight || quantity);
    return g >= 1000 ? `${(g / 1000).toFixed(1)} kg` : `${g} g`;
  }

  if (u === "kg") {
    return `${quantity} kg`;
  }

  return `${quantity}`;
};

/* ================= COMPONENT ================= */

const OrderDetailsLightModal: React.FC<{
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

export default OrderDetailsLightModal;

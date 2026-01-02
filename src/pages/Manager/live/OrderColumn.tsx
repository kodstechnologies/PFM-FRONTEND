// import React from "react";
// import OrderCard from "./OrderCard";

// /* ================= TYPES (LOCAL) ================= */

// export type OrderStatus = "new" | "preparing" | "awaiting-pickup";

// export interface OrderItem {
//     name: string;
//     quantity: number;
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

// /* ================= PROPS ================= */

// interface Props {
//     title: string;
//     orders: Order[];
//     isManager: boolean;
//     onNext: (orderId: string, currentStatus: OrderStatus) => void;
//     loading: boolean;
// }

// /* ================= COMPONENT ================= */

// const OrderColumn: React.FC<Props> = ({
//     title,
//     orders,
//     isManager,
//     onNext,
//     loading,
// }) => {
//     return (
//         <div className="flex-1 p-6 border-r border-gray-700">
//             <h2 className="text-xl font-bold mb-4 select-none">
//                 {title} ({orders.length})
//             </h2>

//             <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)]">
//                 {orders.length === 0 ? (
//                     <div className="text-sm text-gray-500 text-center mt-6">
//                         No orders
//                     </div>
//                 ) : (
//                     orders.map(order => (
//                         <OrderCard
//                             key={order.id}
//                             order={order}
//                             isManager={isManager}
//                             onNext={onNext}
//                             loading={loading}
//                         />
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default OrderColumn;


import React from "react";
import OrderCard from "./OrderCard";

/* ================= TYPES (LOCAL) ================= */

export type OrderStatus = "new" | "preparing" | "awaiting-pickup";

export interface OrderItem {
    name: string;
    quantity: number;
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

/* ================= PROPS ================= */

interface Props {
    title: string;
    orders: Order[];
    isManager: boolean;
    onNext: (orderId: string, currentStatus: OrderStatus) => void;
    loading: boolean;
}

/* ================= COMPONENT ================= */

const OrderColumn: React.FC<Props> = ({
    title,
    orders,
    isManager,
    onNext,
    loading,
}) => {
    return (
        <div className="flex-1 p-6 border-r border-gray-700">
            <h2 className="text-xl font-bold mb-4 select-none">
                {title} ({orders.length})
            </h2>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)]">
                {orders.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center mt-6">
                        No orders
                    </div>
                ) : (
                    orders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            isManager={isManager}
                            onNext={onNext}
                            loading={loading}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderColumn;
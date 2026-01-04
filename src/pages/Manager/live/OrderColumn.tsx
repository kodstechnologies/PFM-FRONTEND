// // import React from "react";
// // import OrderCard from "./OrderCard"; // Adjust path as needed

// // /* ================= TYPES ================= */
// // export type OrderStatus = "new" | "preparing" | "awaiting-pickup";

// // export interface OrderItem {
// //     name: string;
// //     quantity: number;
// //     unit?: "gram" | "pieces" | "pcs";
// //     weight?: string; // For gram-based formatting
// // }

// // export interface Order {
// //     id: string;
// //     receiverName: string;
// //     items: number;
// //     time: string;
// //     status: OrderStatus;
// //     orderDetails: OrderItem[];
// // }

// // /* ================= PROPS ================= */
// // interface Props {
// //     title: string;
// //     orders: Order[];
// //     isManager: boolean;
// //     onNext: (orderId: string, currentStatus: OrderStatus) => void;
// //     loading: boolean;
// // }

// // /* ================= COMPONENT ================= */
// // const OrderColumn: React.FC<Props> = ({
// //     title,
// //     orders,
// //     isManager,
// //     onNext,
// //     loading,
// // }) => {
// //     return (
// //         <div className="flex-1 p-6 border-r border-gray-700 last:border-r-0 overflow-hidden">
// //             <h2 className="text-xl font-bold mb-4 select-none text-gray-200">
// //                 {title} ({orders.length})
// //             </h2>

// //             <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-600">
// //                 {loading && orders.length === 0 ? (
// //                     <div className="text-sm text-gray-500 text-center mt-6">Updating...</div>
// //                 ) : orders.length === 0 ? (
// //                     <div className="text-sm text-gray-500 text-center mt-6 italic">
// //                         No orders yet
// //                     </div>
// //                 ) : (
// //                     orders.map((order) => (
// //                         <OrderCard
// //                             key={order.id}
// //                             order={order}
// //                             isManager={isManager}
// //                             onNext={onNext}
// //                             loading={loading}
// //                         />
// //                     ))
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default OrderColumn;

// import React from "react";
// import OrderCard from "./OrderCard"; // Adjust path as needed

// /* ================= TYPES ================= */
// export type OrderStatus = "new" | "preparing" | "awaiting-pickup";

// export interface OrderItem {
//     name: string;
//     quantity: number;
//     unit?: "gram" | "pieces" | "pcs" | "kg";
//     weight?: string; // For gram-based formatting
// }

// export interface Order {
//     id: string;
//     receiverName: string;
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
//     showNextButton?: boolean; // Added: Optional prop to control button visibility
// }

// /* ================= COMPONENT ================= */
// const OrderColumn: React.FC<Props> = ({
//     title,
//     orders,
//     isManager,
//     onNext,
//     loading,
//     showNextButton,
// }) => {
//     return (
//         <div className="flex-1 p-6 border-r border-gray-700 last:border-r-0 overflow-hidden">
//             <h2 className="text-xl font-bold mb-4 select-none text-gray-200">
//                 {title} ({orders.length})
//             </h2>

//             <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-600">
//                 {loading && orders.length === 0 ? (
//                     <div className="text-sm text-gray-500 text-center mt-6">Updating...</div>
//                 ) : orders.length === 0 ? (
//                     <div className="text-sm text-gray-500 text-center mt-6 italic">
//                         No orders yet
//                     </div>
//                 ) : (
//                     orders.map((order) => (
//                         <OrderCard
//                             key={order.id}
//                             order={order}
//                             isManager={isManager}
//                             onNext={onNext}
//                             loading={loading}
//                             showNextButton={showNextButton}
//                         />
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default OrderColumn;

import React from "react";
import OrderCard from "./OrderCard"; // Adjust path as needed

/* ================= TYPES ================= */
export type OrderStatus = "new" | "preparing" | "awaiting-pickup";

export interface OrderItem {
    name: string;
    quantity: number;
    unit?: "gram" | "pieces" | "pcs" | "kg";
    weight?: string; // For gram-based formatting
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
    showNextButton?: boolean; // Added: Optional prop to control button visibility
    showQRPrint?: boolean; // Added: Optional prop to control QR print visibility
}

/* ================= COMPONENT ================= */
const OrderColumn: React.FC<Props> = ({
    title,
    orders,
    isManager,
    onNext,
    loading,
    showNextButton,
    showQRPrint,
}) => {
    return (
        <div className="flex-1 p-6 border-r border-gray-700 last:border-r-0 overflow-hidden">
            <h2 className="text-xl font-bold mb-4 select-none text-gray-200">
                {title} ({orders.length})
            </h2>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-600">
                {loading && orders.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center mt-6">Updating...</div>
                ) : orders.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center mt-6 italic">
                        No orders yet
                    </div>
                ) : (
                    orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            isManager={isManager}
                            onNext={onNext}
                            loading={loading}
                            showNextButton={showNextButton}
                            showQRPrint={showQRPrint}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderColumn;
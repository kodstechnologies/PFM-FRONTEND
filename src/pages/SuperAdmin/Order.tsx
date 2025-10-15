// import React, { useEffect, useState, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import { callApi } from '../../util/admin_api';

// // ------------------- TYPES -------------------
// interface OrderDetail {
//     _id: string;
//     name: string;
//     quantity: number;
//     price: number;
//     unit?: string;
//     weight?: string;
//     img?: string;
// }

// interface Store {
//     _id: string;
//     storeName: string;
//     location?: string;
//     phone?: string;
// }

// interface Manager {
//     managerName: string;
//     phone?: string;
//     img?: string;
// }

// interface DeliveryPartner {
//     deliveryPartnerName: string;
// }

// interface Order {
//     _id: string;
//     houseNo?: string;
//     userName?: string;
//     userLocation?: string;
//     userPincode?: string;
//     userPhoneNumber?: string;
//     totalAmount?: number;
//     createdAt?: string;
//     updatedAt?: string;
//     status?: string;
//     deliveryStatus?: string;
//     orderDetails?: OrderDetail[];
//     store?: Store | null;
//     manager?: Manager | null;
//     deliveryPartner?: DeliveryPartner | null;
// }

// interface ApiResponse {
//     statusCode: number;
//     success: boolean;
//     message: string;
//     data: {
//         orders?: Order[];
//         [key: string]: any;
//     };
//     orders?: Order[];
// }

// // Define possible status values
// type Status =
//     | 'pending'
//     | 'confirmed'
//     | 'preparing'
//     | 'ready'
//     | 'picked_up'
//     | 'in_transit'
//     | 'delivered'
//     | 'cancelled';

// // ------------------- COMPONENT -------------------
// const OrderDisplay: React.FC = () => {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//     const { status } = useParams<{ status?: Status }>();

//     // Get store user from localStorage
//     const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 console.log('Fetching orders...');

//                 const response: ApiResponse = await callApi({
//                     endpoint: '/admin/display-order',
//                     method: 'GET',
//                 });
//                 console.log('API Response:', response);

//                 // Extract orders directly
//                 const ordersData: Order[] = response.data?.orders ?? response.orders ?? (Array.isArray(response.data) ? response.data : []);

//                 setOrders(ordersData);
//             } catch (err: any) {
//                 const errorMessage = err.response?.data?.message || 'Failed to fetch orders. Please try again later.';
//                 setError(errorMessage);
//                 console.error('Error fetching orders:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, []);

//     // Memoize filtered orders based on status and store
//     const filteredOrders = useMemo(() => {
//         let result = orders;
//         // Filter by store if storeUser exists
//         if (storeUser._id) {
//             result = result.filter((order) => order.store?._id === storeUser._id);
//         }
//         // Filter by status if provided
//         if (status) {
//             result = result.filter((order) => order.status?.toLowerCase() === status.toLowerCase());
//         }
//         return result;
//     }, [orders, status, storeUser._id]);

//     // Memoize status colors with proper typing
//     const statusColors = useMemo<Record<Status, string>>(
//         () => ({
//             pending: '#ff9800',
//             confirmed: '#2196f3',
//             preparing: '#673ab7',
//             ready: '#4caf50',
//             picked_up: '#607d8b',
//             in_transit: '#ffeb3b',
//             delivered: '#8bc34a',
//             cancelled: '#f44336',
//         }),
//         []
//     );

//     const formatDate = (dateString?: string) => {
//         if (!dateString) return 'N/A';
//         return new Date(dateString).toLocaleString('en-US', {
//             dateStyle: 'medium',
//             timeStyle: 'short',
//         });
//     };

//     const getStatusColor = (status: string = 'pending') => {
//         return statusColors[status.toLowerCase() as Status] || '#9e9e9e';
//     };

//     // Debounced refresh handler
//     const handleRefresh = () => {
//         window.location.reload();
//     };

//     if (loading) {
//         return (
//             <div
//                 style={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     height: '50vh',
//                     fontSize: '1.2rem',
//                     color: '#666',
//                 }}
//                 role="status"
//                 aria-live="polite"
//             >
//                 <div>
//                     <div
//                         style={{
//                             textAlign: 'center',
//                             marginBottom: '15px',
//                         }}
//                     >
//                         <div
//                             style={{
//                                 width: '50px',
//                                 height: '50px',
//                                 border: '5px solid #f3f3f3',
//                                 borderTop: '5px solid #4CAF50',
//                                 borderRadius: '50%',
//                                 animation: 'spin 1s linear infinite',
//                                 margin: '0 auto',
//                             }}
//                         ></div>
//                     </div>
//                     Loading orders...
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div
//                 style={{
//                     padding: '20px',
//                     backgroundColor: '#ffebee',
//                     color: '#c62828',
//                     borderRadius: '8px',
//                     margin: '20px',
//                     textAlign: 'center',
//                 }}
//                 role="alert"
//             >
//                 <h3>Error Loading Orders</h3>
//                 <p>{error}</p>
//                 <button
//                     onClick={handleRefresh}
//                     style={{
//                         padding: '10px 20px',
//                         backgroundColor: '#c62828',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         marginTop: '10px',
//                     }}
//                     aria-label="Retry loading orders"
//                 >
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div
//             style={{
//                 fontFamily: 'Arial, sans-serif',
//                 minHeight: '100vh',
//                 padding: '20px',
//                 // backgroundColor: '#f5f5f5',
//             }}
//         >
//             <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
//                 <h1
//                     style={{
//                         color: '#333',
//                         borderBottom: '2px solid #4CAF50',
//                         paddingBottom: '12px',
//                         marginBottom: '30px',
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         fontSize: '1.8rem',
//                     }}
//                 >
//                     {status ? `${status.charAt(0).toUpperCase() + status.slice(1)} Orders` : 'Order Management'}
//                     <span style={{ fontSize: '1rem', color: '#666', fontWeight: 'normal' }}>
//                         {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
//                     </span>
//                 </h1>

//                 {!filteredOrders.length ? (
//                     <div
//                         style={{
//                             textAlign: 'center',
//                             padding: '60px',
//                             backgroundColor: 'white',
//                             borderRadius: '8px',
//                             boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                         }}
//                     >
//                         <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📦</div>
//                         <h2 style={{ color: '#555' }}>No Orders Found</h2>
//                         <p style={{ color: '#777', marginBottom: '30px' }}>
//                             There are no {status || ''} orders to display at this time.
//                         </p>
//                         <button
//                             onClick={handleRefresh}
//                             style={{
//                                 padding: '10px 25px',
//                                 backgroundColor: '#4CAF50',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '4px',
//                                 cursor: 'pointer',
//                                 fontSize: '1rem',
//                             }}
//                             aria-label="Refresh orders"
//                         >
//                             Refresh
//                         </button>
//                     </div>
//                 ) : (
//                     <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
//                         {/* Order List */}
//                         <div style={{ flex: '1', minWidth: '300px' }}>
//                             <h2 style={{ color: '#555', marginBottom: '15px', paddingLeft: '10px', fontSize: '1.4rem' }}>
//                                 All {status ? status.charAt(0).toUpperCase() + status.slice(1) : ''} Orders
//                             </h2>
//                             <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '10px' }}>
//                                 {filteredOrders.map((order) => (
//                                     <div
//                                         key={order._id}
//                                         style={{
//                                             backgroundColor: selectedOrder?._id === order._id ? '#e8f5e9' : 'white',
//                                             border: '1px solid #e0e0e0',
//                                             borderRadius: '8px',
//                                             padding: '15px',
//                                             marginBottom: '15px',
//                                             cursor: 'pointer',
//                                             transition: 'all 0.2s',
//                                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                                         }}
//                                         onClick={() => setSelectedOrder(order)}
//                                         onMouseEnter={(e) => {
//                                             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
//                                             e.currentTarget.style.transform = 'translateY(-2px)';
//                                         }}
//                                         onMouseLeave={(e) => {
//                                             e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
//                                             e.currentTarget.style.transform = 'translateY(0)';
//                                         }}
//                                         role="button"
//                                         tabIndex={0}
//                                         onKeyDown={(e) => {
//                                             if (e.key === 'Enter' || e.key === ' ') {
//                                                 setSelectedOrder(order);
//                                             }
//                                         }}
//                                         aria-label={`Select order ${order._id.slice(-6).toUpperCase()}`}
//                                     >
//                                         <div
//                                             style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//                                         >
//                                             <h3 style={{ margin: '0', color: '#333', fontSize: '1.1rem' }}>
//                                                 Order #{order._id.slice(-6).toUpperCase()}
//                                             </h3>
//                                             <span
//                                                 style={{
//                                                     backgroundColor: getStatusColor(order.status || 'pending'),
//                                                     color: 'white',
//                                                     padding: '4px 8px',
//                                                     borderRadius: '12px',
//                                                     fontSize: '0.8rem',
//                                                     fontWeight: 'bold',
//                                                 }}
//                                             >
//                                                 {order.status || 'Pending'}
//                                             </span>
//                                         </div>
//                                         <p style={{ margin: '8px 0', color: '#666' }}>
//                                             <strong>Customer:</strong> {order.userName ?? 'N/A'}
//                                         </p>
//                                         <p
//                                             style={{
//                                                 margin: '8px 0',
//                                                 color: order.store?.storeName === storeUser.name ? '#4CAF50' : '#666',
//                                                 maxWidth: '200px',
//                                                 whiteSpace: 'nowrap',
//                                                 overflow: 'hidden',
//                                                 textOverflow: 'ellipsis',
//                                             }}
//                                             title={order.store?.storeName ?? 'N/A'}
//                                         >
//                                             <strong>Store:</strong> {order.store?.storeName ?? 'N/A'}
//                                         </p>
//                                         <p style={{ margin: '8px 0', color: '#666' }}>
//                                             <strong>Total:</strong> ₹{order.totalAmount ?? 0}
//                                         </p>
//                                         <p style={{ margin: '8px 0', color: '#666' }}>
//                                             <strong>Items:</strong> {order.orderDetails?.length ?? 0}
//                                         </p>
//                                         <p style={{ margin: '8px 0', color: '#666', fontSize: '0.9rem' }}>
//                                             <strong>Created:</strong> {formatDate(order.createdAt)}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Order Details */}
//                         <div style={{ flex: '2', minWidth: '400px' }}>
//                             <h2 style={{ color: '#555', marginBottom: '15px', paddingLeft: '10px', fontSize: '1.4rem' }}>
//                                 Order Details
//                             </h2>
//                             {selectedOrder ? (
//                                 <div
//                                     style={{
//                                         backgroundColor: 'white',
//                                         border: '1px solid #e0e0e0',
//                                         borderRadius: '8px',
//                                         padding: '25px',
//                                         boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//                                         position: 'sticky',
//                                         top: '20px',
//                                     }}
//                                 >
//                                     <div
//                                         style={{
//                                             display: 'flex',
//                                             justifyContent: 'space-between',
//                                             alignItems: 'center',
//                                             marginBottom: '20px',
//                                             paddingBottom: '15px',
//                                             borderBottom: '1px solid #eee',
//                                         }}
//                                     >
//                                         <h2 style={{ margin: '0', color: '#333', fontSize: '1.6rem' }}>
//                                             Order #{selectedOrder._id.slice(-6).toUpperCase()}
//                                         </h2>
//                                         <span
//                                             style={{
//                                                 backgroundColor: getStatusColor(selectedOrder.status || 'pending'),
//                                                 color: 'white',
//                                                 padding: '6px 12px',
//                                                 borderRadius: '16px',
//                                                 fontSize: '0.9rem',
//                                                 fontWeight: 'bold',
//                                             }}
//                                         >
//                                             {selectedOrder.status || 'Pending'}
//                                         </span>
//                                     </div>

//                                     <div
//                                         style={{
//                                             display: 'grid',
//                                             gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//                                             gap: '20px',
//                                             marginBottom: '20px',
//                                         }}
//                                     >
//                                         <div>
//                                             <h3
//                                                 style={{
//                                                     color: '#555',
//                                                     borderBottom: '1px solid #eee',
//                                                     paddingBottom: '8px',
//                                                     fontSize: '1.2rem',
//                                                 }}
//                                             >
//                                                 Customer Information
//                                             </h3>
//                                             <p style={{ margin: '8px 0', color: '#666' }}>
//                                                 <strong>Name:</strong> {selectedOrder.userName ?? 'N/A'}
//                                             </p>
//                                             <p style={{ margin: '8px 0', color: '#666' }}>
//                                                 <strong>Phone:</strong> {selectedOrder.userPhoneNumber ?? 'N/A'}
//                                             </p>
//                                             <p
//                                                 style={{
//                                                     margin: '8px 0',
//                                                     color: selectedOrder.store?.storeName === storeUser.name ? '#4CAF50' : '#666',
//                                                     maxWidth: '250px',
//                                                     whiteSpace: 'nowrap',
//                                                     overflow: 'hidden',
//                                                     textOverflow: 'ellipsis',
//                                                 }}
//                                                 title={selectedOrder.store?.storeName ?? 'N/A'}
//                                             >
//                                                 <strong>Store:</strong> {selectedOrder.store?.storeName ?? 'N/A'}
//                                             </p>
//                                             <div style={{ marginTop: '10px' }}>
//                                                 <p style={{ margin: '8px 0', color: '#666' }}>
//                                                     <strong>Address:</strong>
//                                                 </p>
//                                                 <p style={{ margin: '8px 0', color: '#666' }}>
//                                                     {selectedOrder.houseNo ? `${selectedOrder.houseNo}, ` : ''}
//                                                     {selectedOrder.userLocation ?? 'N/A'}
//                                                     {selectedOrder.userPincode ? `, ${selectedOrder.userPincode}` : ''}
//                                                 </p>
//                                             </div>
//                                             <p style={{ margin: '8px 0', color: '#666' }}>
//                                                 <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount ?? 0}
//                                             </p>
//                                         </div>

//                                         <div>
//                                             <h3
//                                                 style={{
//                                                     color: '#555',
//                                                     borderBottom: '1px solid #eee',
//                                                     paddingBottom: '8px',
//                                                     fontSize: '1.2rem',
//                                                 }}
//                                             >
//                                                 Order Items
//                                             </h3>
//                                             {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 ? (
//                                                 <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
//                                                     {selectedOrder.orderDetails.map((item, index) => (
//                                                         <li
//                                                             key={index}
//                                                             style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}
//                                                         >
//                                                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
//                                                                 <span style={{ fontWeight: '500' }}>{item.name}</span>
//                                                                 <span style={{ fontWeight: 'bold' }}>
//                                                                     {item.quantity} {item.unit || ''} {item.weight ? `(${item.weight})` : ''} - ₹{item.price}
//                                                                 </span>
//                                                             </div>
//                                                             {item.img && (
//                                                                 <img
//                                                                     src={item.img}
//                                                                     alt={item.name}
//                                                                     style={{
//                                                                         width: '40px',
//                                                                         height: '40px',
//                                                                         objectFit: 'cover',
//                                                                         borderRadius: '4px',
//                                                                         marginTop: '4px'
//                                                                     }}
//                                                                     onError={(e) => {
//                                                                         e.currentTarget.style.display = 'none';
//                                                                     }}
//                                                                 />
//                                                             )}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             ) : (
//                                                 <p style={{ color: '#666' }}>No items in this order</p>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div
//                                         style={{
//                                             display: 'grid',
//                                             gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//                                             gap: '20px',
//                                             marginBottom: '20px',
//                                         }}
//                                     >
//                                         <div>
//                                             <h3
//                                                 style={{
//                                                     color: '#555',
//                                                     borderBottom: '1px solid #eee',
//                                                     paddingBottom: '8px',
//                                                     fontSize: '1.2rem',
//                                                 }}
//                                             >
//                                                 Order Summary
//                                             </h3>
//                                             <p style={{ margin: '8px 0', color: '#666' }}>
//                                                 <strong>Delivery Status:</strong> {selectedOrder.deliveryStatus ?? 'N/A'}
//                                             </p>
//                                             <p style={{ margin: '8px 0', color: '#666', fontSize: '0.9rem' }}>
//                                                 <strong>Created:</strong> {formatDate(selectedOrder.createdAt)}
//                                             </p>
//                                             {/* <p style={{ margin: '8px 0', color: '#666', fontSize: '0.9rem' }}>
//                                                 <strong>Updated:</strong> {formatDate(selectedOrder.updatedAt)}
//                                             </p> */}
//                                             {selectedOrder.manager && (
//                                                 <p style={{ margin: '8px 0', color: '#666' }}>
//                                                     <strong>Manager:</strong> {selectedOrder.manager.managerName} ({selectedOrder.manager.phone ?? 'N/A'})
//                                                 </p>
//                                             )}
//                                             {selectedOrder.deliveryPartner && (
//                                                 <p style={{ margin: '8px 0', color: '#666' }}>
//                                                     <strong>Delivery Partner:</strong> {selectedOrder.deliveryPartner.deliveryPartnerName}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div
//                                     style={{
//                                         textAlign: 'center',
//                                         padding: '40px',
//                                         backgroundColor: 'white',
//                                         borderRadius: '8px',
//                                         color: '#666',
//                                         border: '1px solid #e0e0e0',
//                                         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                                     }}
//                                 >
//                                     <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👆</div>
//                                     <p>Select an order from the list to view details</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <style>
//                 {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//             </style>
//         </div>
//     );
// };

// export default OrderDisplay;
import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { callApi } from '../../util/admin_api'
import { RefreshCw, User, MapPin, Phone, Package, IndianRupee, Truck } from 'lucide-react'

// Simple cn utility (classNames with Tailwind merge simulation)
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}

type Status =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'picked_up'
    | 'in_transit'
    | 'delivered'
    | 'cancelled'

interface OrderDetail {
    _id: string
    name: string
    quantity: number
    price: number
    unit?: string
    weight?: string
    img?: string
}

interface Store {
    _id: string
    storeName: string
    location?: string
    phone?: string
}

interface Manager {
    managerName: string
    phone?: string
    img?: string
}

interface DeliveryPartner {
    deliveryPartnerName: string
}

interface Order {
    _id: string
    houseNo?: string
    userName?: string
    userLocation?: string
    userPincode?: string
    userPhoneNumber?: string
    totalAmount?: number
    createdAt?: string
    updatedAt?: string
    status?: Status | string
    deliveryStatus?: string
    orderDetails?: OrderDetail[]
    store?: Store | null
    manager?: Manager | null
    deliveryPartner?: DeliveryPartner | null
}

function formatDate(dateString?: string) {
    if (!dateString) return 'N/A'
    try {
        return new Date(dateString).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
    } catch {
        return 'N/A'
    }
}

function Chip({
    children,
    variant = 'default',
    className,
}: {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error'
    className?: string
}) {
    const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold'
    const variants = {
        default: 'border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
        success: 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200',
        warning: 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
        error: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200',
    }

    return (
        <span className={cn(baseClasses, variants[variant], className)}>
            {children}
        </span>
    )
}

function InfoRow({
    label,
    value,
    icon: Icon,
    highlight = false,
}: {
    label: string
    value?: string | number
    icon?: React.ComponentType<{ className?: string }>
    highlight?: boolean
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-gray-500" />}
                <span className="text-sm font-medium text-gray-600">{label}:</span>
            </div>
            <span
                className={cn(
                    'text-sm text-gray-900',
                    highlight && 'font-semibold text-blue-600'
                )}
            >
                {value ?? 'N/A'}
            </span>
        </div>
    )
}

function OrderItemCard({ item, index }: { item: OrderDetail; index: number }) {
    return (
        <div
            className={cn(
                'flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800',
                index % 2 === 0 && 'bg-gray-50 dark:bg-gray-900/50'
            )}
        >
            <div className="flex items-center gap-3">
                {item.img ? (
                    <img
                        src={item.img}
                        alt={item.name}
                        className="size-12 rounded-md border border-gray-200 object-cover dark:border-gray-600"
                        onError={(e) => {
                            ; (e.currentTarget as HTMLImageElement).style.display = 'none'
                                ; (e.currentTarget as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-100 dark:bg-gray-700')
                        }}
                    />
                ) : (
                    <div className="size-12 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center dark:border-gray-600 dark:bg-gray-700">
                        <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                        {item.quantity} {item.unit || ''} {item.weight ? `(${item.weight})` : ''}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-gray-100">₹{item.price}</div>
            </div>
        </div>
    )
}

export default function OrderDisplay({ status }: { status?: string }) {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const { status: paramStatus } = useParams<{ status?: Status }>()

    // Use the passed status or paramStatus
    const currentStatus = status || paramStatus

    // Mimic original store filter behavior
    const storeUser =
        typeof window !== 'undefined'
            ? (JSON.parse(localStorage.getItem('storeUser') || '{}') as {
                _id?: string
                name?: string
            })
            : {}

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await callApi({
                    endpoint: '/admin/display-order',
                    method: 'GET',
                })

                // Extract orders directly
                const ordersData: Order[] = response.data?.orders ?? response.orders ?? (Array.isArray(response.data) ? response.data : [])

                setOrders(ordersData)
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch orders. Please try again later.'
                setError(errorMessage)
                console.error('Error fetching orders:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    const filteredOrders = useMemo(() => {
        let result = orders
        if (storeUser._id) {
            result = result.filter((o) => o.store?._id === storeUser._id)
        }
        if (currentStatus) {
            result = result.filter(
                (o) => (o.status || 'pending').toLowerCase() === currentStatus.toLowerCase()
            )
        }
        return result
    }, [orders, currentStatus, storeUser._id])

    const selectedOrder = filteredOrders.find((o) => o._id === selectedId) ?? null

    // Status variant mapping for chips
    const getStatusVariant = (status: string) => {
        const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
            pending: 'warning',
            confirmed: 'default',
            preparing: 'default',
            ready: 'success',
            picked_up: 'success',
            in_transit: 'warning',
            delivered: 'success',
            cancelled: 'error',
        }
        return variants[status.toLowerCase()] || 'default'
    }

    const handleRefresh = () => {
        // Re-fetch data
        const fetchOrders = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await callApi({
                    endpoint: '/admin/display-order',
                    method: 'GET',
                })

                const ordersData: Order[] = response.data?.orders ?? response.orders ?? (Array.isArray(response.data) ? response.data : [])

                setOrders(ordersData)
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch orders. Please try again later.'
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }

    if (loading) {
        return (
            <section className="space-y-6">
                <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-32 animate-pulse rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                        />
                    ))}
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section
                className="mx-auto w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"
                role="alert"
            >
                <div className="mb-3 text-3xl" aria-hidden>
                    ⚠️
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Error Loading Orders</h3>
                <p className="text-pretty text-sm text-gray-600 dark:text-gray-400">
                    Failed to fetch orders. Please try again later.
                </p>
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600"
                        aria-label="Retry loading orders"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-6">
            {/* Header */}
            <header className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-balance text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
                            {currentStatus
                                ? `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Orders`
                                : 'Order Management'}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Manage and track your orders efficiently
                        </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-800/50">
                        <div className="text-right">
                            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{filteredOrders.length}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                order{filteredOrders.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 active:scale-95 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                            aria-label="Refresh orders"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            {!filteredOrders.length ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 text-5xl opacity-70" aria-hidden>
                        📦
                    </div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No Orders Found</h2>
                    <p className="mx-auto mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">
                        {currentStatus
                            ? `There are no ${currentStatus} orders to display at this time.`
                            : 'No orders available in your store at the moment.'}
                    </p>
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 dark:border-gray-600 dark:bg-blue-600"
                        aria-label="Refresh orders"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh Orders
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Left: Order list */}
                    <div className="w-full md:w-5/12">
                        <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                <span className="h-5 w-1 rounded bg-blue-600" />
                                {currentStatus
                                    ? `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Orders`
                                    : 'All Orders'}
                            </h2>
                        </div>

                        <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                            <div className="flex flex-col gap-3">
                                {filteredOrders.map((order, idx) => (
                                    <button
                                        key={order._id}
                                        onClick={() => setSelectedId(order._id)}
                                        className={cn(
                                            'group relative w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-md',
                                            selectedId === order._id &&
                                            'ring-2 ring-blue-500 shadow-lg dark:ring-blue-500'
                                        )}
                                        aria-pressed={selectedId === order._id}
                                        aria-label={`Select order ${order._id.slice(-6).toUpperCase()}`}
                                        style={{
                                            animationDelay: `${idx * 50}ms`,
                                        }}
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-blue-500/60 to-indigo-500/60 opacity-70" aria-hidden />

                                        <div className="mb-2 flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </h3>
                                                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                            <Chip variant={getStatusVariant(order.status || 'pending')}>
                                                {order.status || 'Pending'}
                                            </Chip>
                                        </div>

                                        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        Customer:
                                                    </span>{' '}
                                                    {order.userName ?? 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        Store:
                                                    </span>{' '}
                                                    <span
                                                        className={cn(
                                                            order.store?.storeName === storeUser.name
                                                                ? 'font-semibold text-blue-600 dark:text-blue-400'
                                                                : 'text-gray-900 dark:text-gray-100'
                                                        )}
                                                    >
                                                        {order.store?.storeName ?? 'N/A'}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                    ₹{order.totalAmount ?? 0}
                                                </div>
                                                <div className="flex items-center justify-end gap-1 text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                    {(order.orderDetails?.length ?? 0)} item
                                                    {order.orderDetails?.length !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="w-full md:w-7/12">
                        <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                <span className="h-5 w-1 rounded bg-blue-600" />
                                Order Details
                            </h2>
                        </div>

                        {selectedOrder ? (
                            <div className="sticky top-5 animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                                {/* Header */}
                                <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            Order #{selectedOrder._id.slice(-6).toUpperCase()}
                                        </h3>
                                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                            Created: {formatDate(selectedOrder.createdAt)}
                                        </p>
                                    </div>
                                    <Chip variant={getStatusVariant(selectedOrder.status || 'pending')}>
                                        {selectedOrder.status || 'Pending'}
                                    </Chip>
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            <User className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            Customer Information
                                        </h4>
                                        <div className="space-y-3">
                                            <InfoRow label="Name" value={selectedOrder.userName} icon={User} />
                                            <InfoRow
                                                label="Phone"
                                                value={selectedOrder.userPhoneNumber}
                                                icon={Phone}
                                            />
                                            <InfoRow
                                                label="Store"
                                                value={selectedOrder.store?.storeName}
                                                highlight={selectedOrder.store?.storeName === storeUser.name}
                                                icon={MapPin}
                                            />
                                            <div>
                                                <InfoRow label="Address" value="" icon={MapPin} />
                                                <p className="ml-6 text-sm text-gray-600 dark:text-gray-400">
                                                    {selectedOrder.houseNo ? `${selectedOrder.houseNo}, ` : ''}
                                                    {selectedOrder.userLocation ?? 'N/A'}
                                                    {selectedOrder.userPincode
                                                        ? `, ${selectedOrder.userPincode}`
                                                        : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            <IndianRupee className="mr-2 inline h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            Order Summary
                                        </h4>
                                        <div className="space-y-3">
                                            <InfoRow
                                                label="Total Amount"
                                                value={`₹${selectedOrder.totalAmount ?? 0}`}
                                                icon={IndianRupee}
                                            />
                                            <InfoRow
                                                label="Delivery Status"
                                                value={selectedOrder.deliveryStatus}
                                                icon={Truck}
                                            />
                                            {selectedOrder.manager && (
                                                <InfoRow
                                                    label="Manager"
                                                    value={`${selectedOrder.manager.managerName} (${selectedOrder.manager.phone ?? 'N/A'})`}
                                                    icon={User}
                                                />
                                            )}
                                            {selectedOrder.deliveryPartner && (
                                                <InfoRow
                                                    label="Delivery Partner"
                                                    value={selectedOrder.deliveryPartner.deliveryPartnerName}
                                                    icon={Truck}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="mt-6 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        Order Items ({selectedOrder.orderDetails?.length ?? 0})
                                    </h4>
                                    {selectedOrder.orderDetails?.length ? (
                                        <div className="mt-3 flex flex-col gap-2">
                                            {selectedOrder.orderDetails.map((item, i) => (
                                                <OrderItemCard key={`${item._id}-${i}`} item={item} index={i} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-6 text-center text-sm italic text-gray-600 dark:text-gray-400">
                                            No items in this order
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="mb-4 text-5xl opacity-50" aria-hidden>
                                    👆
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Select an Order</h3>
                                <p className="mx-auto max-w-sm text-sm text-gray-600 dark:text-gray-400">
                                    Choose an order from the list to view detailed information.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
// // // import React, { useEffect } from "react";
// // // import { useParams } from "react-router-dom";
// // // import QRCodeView from "./QRCodeView";
// // // import { useQRCode } from "./hooks/useQRCode";
// // // import logo from "../../public/logo.png"
// // // useEffect(()=>{

// // // },[])

// // // const PrintQR: React.FC = () => {
// // //   const { orderId } = useParams<{ orderId: string }>();

// // //   if (!orderId) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // //         <p className="text-lg font-semibold text-gray-700">
// // //           No Order Found
// // //         </p>
// // //       </div>
// // //     );
// // //   }

// // //   const { qrPayload, pickupCode, loading, error } = useQRCode(orderId);

// // //   /* ================= STATES ================= */

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // //         <div className="animate-pulse text-lg font-medium text-gray-600">
// // //           Generating QR Code...
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // //         <div className="bg-white p-6 rounded-xl shadow text-center">
// // //           <p className="text-red-600 font-semibold">Something went wrong</p>
// // //           <p className="text-sm text-gray-600 mt-2">{error}</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   /* ================= UI ================= */

// // //   return (
// // //     <>
// // //       {/* ================= SCREEN PREVIEW ================= */}
// // //       <div className="screen-view min-h-screen bg-gray-100 flex items-center justify-center p-4 print:hidden">
// // //         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
// // //           <h2 className="text-2xl font-bold mb-1">Pickup QR</h2>
// // //           <p className="text-sm text-gray-500 mb-6">
// // //             Show this QR at the pickup counter
// // //           </p>

// // //           <div className="flex justify-center mb-5">
// // //             <QRCodeView value={qrPayload} size={300} />
// // //           </div>


// // //           <button
// // //             onClick={() => window.print()}
// // //             className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
// // //           >
// // //             Print QR
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* ================= PRINT VIEW ================= */}
// // //       <div className="print-only hidden print:block p-8">
// // //         <div className="max-w-[800px] mx-auto border ">
// // //           <img src={logo} alt="" style={{ height: "8rem" }} />
// // //           <h3>

// // //           </h3>
// // //           <p className="text-sm mb-4 text-gray-600">

// // //           </p>

// // //           <div className="flex justify-center mb-6">
// // //             <QRCodeView value={qrPayload} size={200} type="canvas" />
// // //           </div>


// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default PrintQR;


// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import QRCodeView from "./QRCodeView";
// // import { useQRCode } from "./hooks/useQRCode";
// // // import { API_CONFIG } from "../../../config/api.config";
// // import logo from "../../public/logo.png";
// // import axios from "axios";
// // import API_CONFIG from "../config/api.config";

// // /* ================= TYPES ================= */

// // interface StoreDetails {
// //   name: string;
// //   location: string;
// //   phone?: string;
// //   pincode?: string;
// // }

// // /* ================= COMPONENT ================= */

// // const PrintQR: React.FC = () => {
// //   const { orderId } = useParams<{ orderId: string }>();
// //   const [store, setStore] = useState<StoreDetails | null>(null);
// //   const [storeError, setStoreError] = useState<string | null>(null);

// //   /* ================= STORE ID FROM LOCAL STORAGE ================= */

// //   const storeUser = localStorage.getItem("storeUser");
// //   const storeId = storeUser ? JSON.parse(storeUser)?.storeId : null;

// //   /* ================= QR DATA ================= */

// //   const { qrPayload, pickupCode, loading, error } = useQRCode(orderId || "");

// //   /* ================= FETCH STORE DETAILS ================= */

// //   useEffect(() => {
// //     const fetchStoreDetails = async () => {
// //       if (!storeId) {
// //         setStoreError("Store not assigned");
// //         return;
// //       }

// //       try {
// //         const token = localStorage.getItem("accessToken");

// //         const res = await axios.get(
// //           `${API_CONFIG.BASE_URL}/store/details/${storeId}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }
// //         );
// //         console.log("🚀 ~ fetchStoreDetails ~ res:", res)

// //         setStore(res.data?.data?.store);
// //       } catch (err: any) {
// //         console.error("❌ Store fetch failed:", err);
// //         setStoreError("Failed to load store details");
// //       }
// //     };

// //     fetchStoreDetails();
// //   }, [storeId]);
// //   useEffect(() => {
// //     const fetchStoreDetails = async () => {
// //       if (!storeId) {
// //         setStoreError("Store not assigned");
// //         return;
// //       }

// //       try {
// //         const token = localStorage.getItem("accessToken");

// //         const res = await axios.get(
// //           `${API_CONFIG.BASE_URL}/order/details/${qrPayload}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }
// //         );
// //         console.log("🚀 ~ fetchStoreDetails ~ res:", res)

// //         setStore(res.data?.data?.store);
// //       } catch (err: any) {
// //         console.error("❌ Store fetch failed:", err);
// //         setStoreError("Failed to load store details");
// //       }
// //     };

// //     fetchStoreDetails();
// //   }, [storeId]);


// //   useEffect(()=>{

// //   })
// //   /* ================= VALIDATIONS ================= */

// //   if (!orderId) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //         <p className="text-lg font-semibold text-gray-700">
// //           No Order Found
// //         </p>
// //       </div>
// //     );
// //   }

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //         <div className="animate-pulse text-lg font-medium text-gray-600">
// //           Generating QR Code...
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //         <div className="bg-white p-6 rounded-xl shadow text-center">
// //           <p className="text-red-600 font-semibold">Something went wrong</p>
// //           <p className="text-sm text-gray-600 mt-2">{error}</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   /* ================= UI ================= */

// //   return (
// //     <>
// //       {/* ================= SCREEN VIEW ================= */}
// //       <div className="screen-view min-h-screen bg-gray-100 flex items-center justify-center p-4 print:hidden">
// //         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
// //           <h2 className="text-2xl font-bold mb-1">Pickup QR</h2>
// //           <p className="text-sm text-gray-500 mb-6">
// //             Show this QR at the pickup counter
// //           </p>

// //           <div className="flex justify-center mb-5">
// //             <QRCodeView value={qrPayload} size={300} />
// //           </div>

// //           <button
// //             onClick={() => window.print()}
// //             className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
// //           >
// //             Print QR
// //           </button>
// //         </div>
// //       </div>

// //       {/* ================= PRINT VIEW ================= */}
// //       <div className="print-only hidden print:block p-8">
// //         <div className="max-w-[800px] mx-auto border p-6 text-center">
// //           <img
// //             src={logo}
// //             alt="Store Logo"
// //             className="mx-auto mb-4"
// //             style={{ height: "6rem" }}
// //           />

// //           <h3 className="text-xl font-bold">
// //             {store?.name || "Store"}
// //           </h3>

// //           <p className="text-sm text-gray-600">
// //             {store?.location}
// //           </p>

// //           {store?.phone && (
// //             <p className="text-sm text-gray-600">
// //               Phone: {store.phone}
// //             </p>
// //           )}

// //           <p className="text-sm mt-2 font-medium">
// //             Order ID: #{orderId}
// //           </p>

// //           <div className="flex justify-center my-6">
// //             <QRCodeView value={qrPayload} size={200} type="canvas" />
// //           </div>

// //           <p className="text-sm font-semibold">
// //             Pickup Code: {pickupCode}
// //           </p>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default PrintQR;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import QRCodeView from "./QRCodeView";
// import { useQRCode } from "./hooks/useQRCode";
// import logo from "../../public/logo.png";
// import axios from "axios";
// import API_CONFIG from "../config/api.config";

// /* ================= TYPES ================= */

// interface StoreDetails {
//   name: string;
//   location: string;
//   phone?: string;
//   pincode?: string;
// }

// interface OrderItem {
//   name: string;
//   quantity: number;
//   unit: string;
//   weight: string;
//   price: number;
//   total: number;
//   img: string;
// }

// interface BillDetails {
//   itemTotal: number;
//   payableAmount: number;
// }

// interface DeliveryAddress {
//   name: string;
//   houseNo: string;
//   location: string;
//   pincode: string;
//   phone: string;
// }

// interface OrderDetails {
//   orderId: string;
//   status: string;
//   store: StoreDetails;
//   customer: {
//     name: string;
//     phone: string;
//     email: string;
//   };
//   deliveryPartner: any | null;
//   items: OrderItem[];
//   billDetails: BillDetails;
//   deliveryAddress: DeliveryAddress;
//   deliveryStatus: {
//     status: string;
//     rejectionReason: string | null;
//   };
//   timestamps: {
//     orderedAt: string;
//   };
// }

// /* ================= COMPONENT ================= */

// const PrintQR: React.FC = () => {
//   const { orderId } = useParams<{ orderId: string }>();
//   const [order, setOrder] = useState<OrderDetails | null>(null);
//   const [orderError, setOrderError] = useState<string | null>(null);

//   /* ================= QR DATA ================= */

//   const { qrPayload, pickupCode, loading, error } = useQRCode(orderId || "");

//   /* ================= FETCH ORDER DETAILS ================= */

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       if (!orderId) {
//         setOrderError("No order ID provided");
//         return;
//       }

//       try {
//         const token = localStorage.getItem("accessToken");

//         const res = await axios.get(
//           `${API_CONFIG.BASE_URL}/order/details/${orderId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("🚀 ~ fetchOrderDetails ~ res:", res);

//         if (res.data?.success) {
//           setOrder(res.data.data);
//         } else {
//           throw new Error(res.data?.message || "Failed to fetch order");
//         }
//       } catch (err: any) {
//         console.error("❌ Order fetch failed:", err);
//         setOrderError(err.response?.data?.message || "Failed to load order details");
//       }
//     };

//     fetchOrderDetails();
//   }, [orderId]);

//   /* ================= VALIDATIONS ================= */

//   if (!orderId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <p className="text-lg font-semibold text-gray-700">
//           No Order Found
//         </p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="animate-pulse text-lg font-medium text-gray-600">
//           Generating QR Code...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <p className="text-red-600 font-semibold">Something went wrong</p>
//           <p className="text-sm text-gray-600 mt-2">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (orderError || !order) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <p className="text-red-600 font-semibold">Failed to load order</p>
//           <p className="text-sm text-gray-600 mt-2">{orderError}</p>
//         </div>
//       </div>
//     );
//   }

//   /* ================= UI ================= */

//   return (
//     <>
//       {/* ================= SCREEN VIEW ================= */}
//       <div className="screen-view min-h-screen bg-gray-100 flex items-center justify-center p-4 print:hidden">
//         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
//           <h2 className="text-2xl font-bold mb-1">Pickup QR</h2>
//           <p className="text-sm text-gray-500 mb-6">
//             Show this QR at the pickup counter
//           </p>

//           <div className="flex justify-center mb-5">
//             <QRCodeView value={qrPayload} size={300} />
//           </div>

//           <button
//             onClick={() => window.print()}
//             className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
//           >
//             Print QR
//           </button>
//         </div>
//       </div>

//       {/* ================= PRINT VIEW ================= */}
//       <div className="print-only hidden print:block p-8">
//         <div className="bg-red-500 flex">
//           <img
//             src={logo}
//             alt="Store Logo"
//             className="mx-auto mb-4"
//             style={{ height: "8rem" }}
//           />
//           <h3 className="text-xl font-bold mb-2">
//             {order.store?.name || "Store"}
//           </h3>
//         </div>
//         <div className="max-w-[800px] mx-auto border p-6 text-center">



//           <p className="text-sm text-gray-600 mb-1">
//             {order.store?.location}
//           </p>

//           {order.store?.phone && (
//             <p className="text-sm text-gray-600 mb-4">
//               Phone: {order.store.phone}
//             </p>
//           )}

//           <p className="text-sm mt-2 font-medium">
//             Order ID: #{order.orderId}
//           </p>

//           <p className="text-sm text-gray-600">
//             Status: {order.status}
//           </p>

//           <p className="text-sm font-medium mt-2">
//             Ordered At: {new Date(order.timestamps.orderedAt).toLocaleString()}
//           </p>

//           {/* Customer Details */}
//           <div className="text-left mt-6 border-t pt-4">
//             <h4 className="text-lg font-semibold mb-2">Customer Details</h4>
//             <p><strong>Name:</strong> {order.customer.name}</p>
//             <p><strong>Phone:</strong> {order.customer.phone}</p>
//             {order.customer.email && <p><strong>Email:</strong> {order.customer.email}</p>}
//           </div>

//           {/* Delivery Address */}
//           <div className="text-left mt-4 border-t pt-4">
//             <h4 className="text-lg font-semibold mb-2">Delivery Address</h4>
//             <p>{order.deliveryAddress.houseNo}</p>
//             <p>{order.deliveryAddress.location}</p>
//             <p>Pincode: {order.deliveryAddress.pincode}</p>
//             <p><strong>Phone:</strong> {order.deliveryAddress.phone}</p>
//           </div>

//           {/* Items */}
//           <div className="text-left mt-4 border-t pt-4">
//             <h4 className="text-lg font-semibold mb-2">Order Items</h4>
//             {order.items.map((item, index) => (
//               <div key={index} className="mb-2">
//                 <p><strong>{item.name}</strong></p>
//                 <p className="text-sm text-gray-600">
//                   Qty: {item.quantity} {item.unit} | Weight: {item.weight} | Price: ₹{item.price} | Total: ₹{item.total}
//                 </p>
//                 {item.img && (
//                   <img
//                     src={item.img}
//                     alt={item.name}
//                     className="w-16 h-16 object-cover mt-1"
//                     style={{ maxWidth: "64px", maxHeight: "64px" }}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Bill Details */}
//           <div className="text-left mt-4 border-t pt-4">
//             <h4 className="text-lg font-semibold mb-2">Bill Summary</h4>
//             <p>Item Total: ₹{order.billDetails.itemTotal}</p>
//             <p><strong>Payable Amount: ₹{order.billDetails.payableAmount}</strong></p>
//           </div>

//           {/* Delivery Status */}
//           {order.deliveryStatus && (
//             <div className="text-left mt-4 border-t pt-4">
//               <h4 className="text-lg font-semibold mb-2">Delivery Status</h4>
//               <p>Status: {order.deliveryStatus.status}</p>
//               {order.deliveryStatus.rejectionReason && (
//                 <p className="text-red-600">Rejection Reason: {order.deliveryStatus.rejectionReason}</p>
//               )}
//             </div>
//           )}

//           <div className="flex justify-center my-6">
//             <QRCodeView value={qrPayload} size={200} type="canvas" />
//           </div>

//           <p className="text-sm font-semibold">
//             Pickup Code: {pickupCode}
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PrintQR;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCodeView from "./QRCodeView";
import { useQRCode } from "./hooks/useQRCode";
import logo from "../../public/logo.png";
import axios from "axios";
import API_CONFIG from "../config/api.config";

/* ================= TYPES ================= */

interface StoreDetails {
  name: string;
  location: string;
  phone?: string;
  pincode?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  unit: string;
  weight: string;
  price: number;
  total: number;
  img: string;
}

interface BillDetails {
  itemTotal: number;
  payableAmount: number;
}

interface DeliveryAddress {
  name: string;
  houseNo: string;
  location: string;
  pincode: string;
  phone: string;
}

interface ManagerDetails {
  name: string;
  phone: string;
  EmployeeeId: string;
}

interface OrderDetails {
  orderId: string;
  status: string;
  store: StoreDetails;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  deliveryPartner: any | null;
  items: OrderItem[];
  billDetails: BillDetails;
  deliveryAddress: DeliveryAddress;
  deliveryStatus: {
    status: string;
    rejectionReason: string | null;
    rejectionNotes?: any;
  };
  timestamps: {
    orderedAt: string;
    estimatedDeliveryTime?: any;
    pickedUpAt?: any;
    deliveredAt?: any;
  };
  manager: ManagerDetails;
}

/* ================= COMPONENT ================= */

const PrintQR: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  /* ================= QR DATA ================= */

  const { qrPayload, pickupCode, loading, error } = useQRCode(orderId || "");

  /* ================= FETCH ORDER DETAILS ================= */
  // const formatTotalQuantity = (
  //   quantity: number,
  //   unit?: string,
  //   weight?: number | string
  // ): string => {
  //   const q = Number(quantity || 0);
  //   const w = Number(weight || 0);
  //   const u = unit?.toLowerCase();

  //   // 🟢 PIECES
  //   if (u === "pieces" || u === "pcs") {
  //     return `${q} pcs`;
  //   }

  //   // 🟢 GRAMS
  //   if (u === "gram" || u === "g") {
  //     const totalGrams = q * w;

  //     if (totalGrams >= 1000) {
  //       return `${(totalGrams / 1000).toFixed(2)} kg`;
  //     }
  //     return `${totalGrams} g`;
  //   }

  //   // 🟢 KILOGRAM
  //   if (u === "kg" || u === "kilogram") {
  //     const totalKg = q * (w || 1);
  //     return `${totalKg.toFixed(2)} kg`;
  //   }

  //   // 🟡 FALLBACK
  //   return `${q} ${unit || ""}`;
  // };

  const formatTotalQuantity = (
    quantity: number,
    unit?: string,
    weight?: number | string
  ): string => {
    const q = Number(quantity || 0);
    const w = Number(weight || 0);
    const u = unit?.toLowerCase();

    // ❌ If quantity is 0 → show nothing
    if (q === 0) return "";

    // 🟢 PIECES
    if (u === "pieces" || u === "pcs") {
      return `${q} pcs`;
    }

    // 🟢 GRAMS
    if (u === "gram" || u === "g") {
      if (w === 0) return ""; // ❌ avoid "0 g"

      const totalGrams = q * w;

      if (totalGrams === 0) return "";

      if (totalGrams >= 1000) {
        return `${(totalGrams / 1000).toFixed(2)} kg`;
      }
      return `${totalGrams} g`;
    }

    // 🟢 KILOGRAM
    if (u === "kg" || u === "kilogram") {
      if (w === 0) return ""; // ❌ avoid "0 kg"

      const totalKg = q * w;

      if (totalKg === 0) return "";

      return `${totalKg.toFixed(2)} kg`;
    }

    // 🟡 FALLBACK
    return q ? `${q} ${unit || ""}` : "";
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setOrderError("No order ID provided");
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get(
          `${API_CONFIG.BASE_URL}/order/details/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("🚀 ~ fetchOrderDetails ~ res:", res);

        if (res.data?.success) {
          setOrder(res.data.data);
        } else {
          throw new Error(res.data?.message || "Failed to fetch order");
        }
      } catch (err: any) {
        console.error("❌ Order fetch failed:", err);
        setOrderError(err.response?.data?.message || "Failed to load order details");
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  /* ================= VALIDATIONS ================= */

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">
          No Order Found
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-lg font-medium text-gray-600">
          Generating QR Code...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-red-600 font-semibold">Something went wrong</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-red-600 font-semibold">Failed to load order</p>
          <p className="text-sm text-gray-600 mt-2">{orderError}</p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <>
      {/* ================= SCREEN VIEW ================= */}
      <div className="screen-view min-h-screen bg-gray-100 flex items-center justify-center p-4 print:hidden">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
          <h2 className="text-2xl font-bold mb-1">Pickup QR</h2>
          <p className="text-sm text-gray-500 mb-6">
            Show this QR at the pickup counter
          </p>

          <div className="flex justify-center mb-5">
            <QRCodeView value={qrPayload} size={300} />
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Print QR
          </button>
        </div>
      </div>

      {/* ================= PRINT VIEW ================= */}
      <div className="print-only hidden print:block">
        <div className="bg-white border rounded-lg p-5 flex items-start gap-6">

          {/* ================= LEFT : LOGO + QR ================= */}
          <div className="flex-shrink-0 w-[180px] flex flex-col items-center gap-3 border-r pr-4">
            <img
              src={logo}
              alt="Store Logo"
              className="h-[4.5rem] object-contain"
            />

            <QRCodeView value={qrPayload} size={150} type="canvas" />

            <p className="text-xs font-mono text-gray-600">
              Order ID: #{order.orderId}
            </p>
          </div>

          {/* ================= RIGHT : ALL DETAILS (MERGED) ================= */}
          <div className="flex-1 pl-2 text-sm">

            {/* Store Name */}
            <h3 className="text-xl font-bold mb-3 text-center">
              Store Name : {order?.store?.name ?? "Store"}
            </h3>

            {/* ================= CUSTOMER + MANAGER ================= */}
            <div className="border-t pt-3 grid grid-cols-2 gap-4">

              {/* Customer */}
              <div>
                <p className="font-semibold text-gray-700 mb-1">
                  Customer Name :
                  {/* </p> */}
                  {/* <p> */}
                  {" "} {order?.customer?.name}</p>
                {/* <p className="text-gray-600">
                  {order?.customer?.phone}
                </p> */}
              </div>

              {/* Manager */}
              {order?.manager?.EmployeeeId && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">
                    Store Manager :
                    {/* </p>
                  <p className="font-mono"> */}
                    {" "} {order.manager.EmployeeeId}
                  </p>
                </div>
              )}
            </div>

            {/* ================= ORDER ITEMS ================= */}
            <div className="border-t pt-3 mb-4">
              <h4 className="text-md font-semibold mb-2">
                Order Items
              </h4>

              {order?.items?.map((item, index) => {
                const totalQty = formatTotalQuantity(
                  item.quantity,
                  item.unit,
                  item.weight
                );

                if (!totalQty) return null;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded mb-2"
                  >
                    <span className="font-medium">
                      {item.name}
                    </span>
                    <span className="font-semibold text-gray-700">
                      {totalQty}
                    </span>
                  </div>
                );
              })}
            </div>



          </div>

        </div>



        {/* <div className="max-w-[800px] mx-auto border p-6 text-center"> */}

        {/* <p className="text-sm text-gray-600 mb-1">
            {order.store?.location}
          </p>

          {order.store?.phone && (
            <p className="text-sm text-gray-600 mb-4">
              Phone: {order.store.phone}
            </p>
          )}
 */}
        {/* Manager Details */}
        {/* <div className="text-left mt-4 border-t pt-4">
            <h4 className="text-lg font-semibold mb-2">Manager Details</h4>
            <p><strong>Name:</strong> {order.manager?.name}</p>
            <p><strong>Phone:</strong> {order.manager?.phone}</p>
            <p><strong>Employee ID:</strong> {order.manager?.EmployeeeId}</p>
          </div>

          <p className="text-sm mt-2 font-medium">
            Order ID: #{order.orderId}
          </p>

          <p className="text-sm text-gray-600">
            Status: {order.status}
          </p>

          <p className="text-sm font-medium mt-2">
            Ordered At: {new Date(order.timestamps.orderedAt).toLocaleString()}
          </p>

          {/* Customer Details */}
        {/* <div className="text-left mt-6 border-t pt-4">
            <h4 className="text-lg font-semibold mb-2">Customer Details</h4>
            <p><strong>Name:</strong> {order.customer.name}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
            {order.customer.email && <p><strong>Email:</strong> {order.customer.email}</p>}
          </div> */}

        {/* Delivery Address */}
        {/* <div className="text-left mt-4 border-t pt-4">
            <h4 className="text-lg font-semibold mb-2">Delivery Address</h4>
            <p>{order.deliveryAddress.houseNo}</p>
            <p>{order.deliveryAddress.location}</p>
            <p>Pincode: {order.deliveryAddress.pincode}</p>
            <p><strong>Phone:</strong> {order.deliveryAddress.phone}</p>
          </div> */}

        {/* Items */}
        {/* <div className="text-left mt-4 border-t pt-4">
            <h4 className="text-lg font-semibold mb-2">Order Items</h4>
            {order.items.map((item, index) => (
              <div key={index} className="mb-2">
                <p><strong>{item.name}</strong></p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} {item.unit} | Weight: {item.weight} | Price: ₹{item.price} | Total: ₹{item.total}
                </p>
                {item.img && (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 object-cover mt-1"
                    style={{ maxWidth: "64px", maxHeight: "64px" }}
                  />
                )}
              </div>
            ))}
          </div> */}

        {/* Bill Details */}
        {/* <div className="text-left mt-4 border-t pt-4">
            <h4 className="text-lg font-semibold mb-2">Bill Summary</h4>
            <p>Item Total: ₹{order.billDetails.itemTotal}</p>
            <p><strong>Payable Amount: ₹{order.billDetails.payableAmount}</strong></p>
          </div> */}

        {/* Delivery Status */}
        {/* {order.deliveryStatus && (
            <div className="text-left mt-4 border-t pt-4">
              <h4 className="text-lg font-semibold mb-2">Delivery Status</h4>
              <p>Status: {order.deliveryStatus.status}</p>
              {order.deliveryStatus.rejectionReason && (
                <p className="text-red-600">Rejection Reason: {order.deliveryStatus.rejectionReason}</p>
              )}
            </div>
          )} */}
        {/* 
          <div className="flex justify-center my-6">
            <QRCodeView value={qrPayload} size={200} type="canvas" />
          </div> */}

        {/* <p className="text-sm font-semibold">
            Pickup Code: {pickupCode}
          </p> */}
        {/* </div> */}
      </div>
    </>
  );
};

export default PrintQR;
// import axios from 'axios';
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

// // A lightweight print page that renders a QR via a public QR image API
// // and auto-triggers the print dialog when the image is ready.

// const PrintQR: React.FC = () => {
//   const BaseUrl = import.meta.env.VITE_API_URL; // ✅ use the value from .env
//   console.log("🚀 ~ PrintQR ~ BaseUrl:", BaseUrl)

//   const navigate = useNavigate();
//   const { orderId } = useParams<{ orderId: string }>();
//   const [searchParams] = useSearchParams();
//   const [isImageLoaded, setIsImageLoaded] = useState(false);
//   const hasPrintedRef = useRef(false);

//   // Get orderDetails from query parameters
//   const orderDetailsParam = searchParams.get('orderDetails');
//   const orderDetails = useMemo(() => {
//     if (orderDetailsParam) {
//       try {
//         return JSON.parse(decodeURIComponent(orderDetailsParam));
//       } catch (error) {
//         console.error('Error parsing orderDetails:', error);
//         return [];
//       }
//     }
//     return [];
//   }, [orderDetailsParam]);

//   // Extract product IDs from orderDetails
//   const productIds = useMemo(() => {
//     return orderDetails.map((item: any) => ({
//       id: item._id,
//       name: item.name,
//       quantity: item.quantity,
//       price: item.price
//     }));
//   }, [orderDetails]);

//   const qrPayload = useMemo(() => {
//     const id = orderId || '';
//     const payload = {
//       orderId: id,
//       pickupCode: id.slice(-4),
//       timestamp: new Date().toISOString(),
//       store: 'Priya Chicken - Indiranagar',
//       action: 'confirm-pickup',
//       url: `https://priyafreshmeats.com/pickup/${id}`,
//       // Include product IDs for better identification
//       productIds: productIds,
//       orderSummary: `Order #${id} - Ready for pickup`,
//       totalItems: productIds.length,
//       totalAmount: productIds.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
//     };
//     return JSON.stringify(payload);
//   }, [orderId, productIds]);

//   const qrImageUrl = useMemo(() => {
//     // Using a public QR generation API to avoid extra dependencies
//     // size parameter can be adjusted for print clarity
//     const size = 150; // large for print
//     const encoded = encodeURIComponent(qrPayload);
//     return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
//   }, [qrPayload]);

//   const [store_Name, setStore_Name] = useState("");

//   useEffect(() => {
//     const fetchStoreName = async () => {
//       try {
//         const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
//         setStore_Name(data.storeName);
//       } catch (err) {
//         console.error("Error fetching store name:", err);
//       }
//     };
//     fetchStoreName();
//   }, [orderId]);

//   console.log(store_Name, "store_Name===========");
//   const storeName = store_Name;
//   useEffect(() => {
//     if (isImageLoaded && !hasPrintedRef.current) {
//       // Delay slightly to ensure layout is complete
//       const t = setTimeout(() => {
//         window.print();
//         hasPrintedRef.current = true;
//       }, 150);
//       return () => clearTimeout(t);
//     }
//   }, [isImageLoaded]);

//   if (!orderId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white p-6">
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">No order provided</div>
//           <button
//             onClick={() => window.close()}
//             className="mt-2 px-4 py-2 bg-gray-800 text-white rounded"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white text-black flex items-center justify-center p-8">
//       <div className="w-full max-w-2xl">
//         <div className="flex items-center justify-between mb-6 print:hidden">
//           <div>
//             <div className="text-2xl font-bold">Pickup QR</div>
//             <div className="text-gray-600">Order #{orderId}</div>
//           </div>
//           <div className="space-x-3">
//             <button
//               onClick={() => window.print()}
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               Print
//             </button>
//             <button
//               onClick={() => window.close()}
//               className="px-4 py-2 bg-gray-800 text-white rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>

//         <div className="border border-gray-200 rounded-lg p-6">
//           <div className="text-center">
//             <div className="text-lg font-semibold mb-2">Priya Chicken - {storeName}</div>
//             <div className="text-sm text-gray-600 mb-6">Show this at pickup counter</div>
//             <img
//               src={qrImageUrl}
//               alt={`QR for Order ${orderId}`}
//               className="mx-auto w-[320px] h-[320px] md:w-[384px] md:h-[384px]"
//               onLoad={() => setIsImageLoaded(true)}
//             />
//             <div className="mt-6">
//               <div className="font-mono text-xl">Order: {orderId}</div>
//               <div className="text-gray-700">Pickup Code: {orderId.slice(-4)}</div>

//               {/* Display product information */}
//               {productIds.length > 0 && (
//                 <div className="mt-4 text-left">
//                   <div className="text-sm font-semibold text-gray-800 mb-2">Products:</div>
//                   <div className="space-y-1">
//                     {productIds.map((product: any, index: number) => (
//                       <div key={product.id} className="text-xs text-gray-600 flex justify-between">
//                         <span>{product.name} (Qty: {product.quantity})</span>
//                         <span className="font-mono">₹{product.price}</span>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-2 pt-2 border-t border-gray-200">
//                     <div className="text-sm font-semibold text-gray-800 flex justify-between">
//                       <span>Total Items: {productIds.length}</span>
//                       <span>Total: ₹{productIds.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>
//         {`
//           @media print {
//             .print\\:hidden { display: none !important; }
//             body, html { background: #ffffff; }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default PrintQR;


import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

type ProductItem = {
  id?: string;
  name?: string;
  quantity?: number;
  price?: number;
  total: number;
};


const PrintQR: React.FC = () => {
  const BaseUrl = import.meta.env.VITE_API_URL;
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const hasPrintedRef = useRef(false);
  const orderDetailsParam = searchParams.get('orderDetails');
  const orderDetails = useMemo(() => {
    if (orderDetailsParam) {
      try {
        return JSON.parse(decodeURIComponent(orderDetailsParam));
      } catch (error) {
        console.error('Error parsing orderDetails:', error);
        return [];
      }
    }
    return [];
  }, [orderDetailsParam]);


  const productItems: ProductItem[] = useMemo(() => {
    return orderDetails.map((item: any) => ({
      id: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));
  }, [orderDetails]);
  const totalAmount = useMemo(() => {
    return productItems.reduce((sum, item) => sum + item.total, 0);
  }, [productItems]);
  const qrPayload = useMemo(() => {
    const id = orderId || '';
    return JSON.stringify({
      orderId: id,
      pickupCode: id.slice(-4),
      timestamp: new Date().toISOString(),
      store: 'Priya Chicken',
      action: 'confirm-pickup',
      url: `https://priyafreshmeats.com/pickup/${id}`,
      productIds: productItems,
      orderSummary: `Order #${id} - Ready for pickup`,
      totalItems: productItems.length,
      totalAmount,
    });
  }, [orderId, productItems, totalAmount]);
  // High-resolution QR for sharp printing on thermal labels
  const qrImageUrl = useMemo(() => {
    const size = 450; // High density for clarity
    const encoded = encodeURIComponent(qrPayload);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&ecc=H`;
  }, [qrPayload]);
  const [store_Name, setStore_Name] = useState("");

  useEffect(() => {
    const fetchStoreName = async () => {
      if (!orderId) return;
      try {
        const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
        setStore_Name(data.storeName || 'Indiranagar');
      } catch (err) {
        console.error("Error fetching store name:", err);
        setStore_Name('Indiranagar');
      }
    };
    fetchStoreName();
  }, [orderId, BaseUrl]);
  const storeName = store_Name || 'Indiranagar';
  const pickupCode = orderId?.slice(-4) || '';
  useEffect(() => {
    if (isImageLoaded && !hasPrintedRef.current) {
      const timer = setTimeout(() => {
        window.print();
        hasPrintedRef.current = true;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isImageLoaded]);
  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No order provided</h2>
          <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded">
            Close
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Normal Screen View (Preview) */}
      <div className="screen-view min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6 print:hidden">
            <div>
              <h1 className="text-2xl font-bold">Pickup QR</h1>
              <p className="text-gray-600">Order #{orderId}</p>
            </div>
            <div className="space-x-4">
              <button onClick={() => window.print()} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
                Print
              </button>
              <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium">
                Close
              </button>
            </div>
          </div>
          <div className="text-center border-2 border-dashed border-gray-300 rounded-xl p-8">
            <h2 className="text-xl font-bold mb-2">Priya Chicken - {storeName}</h2>
            <p className="text-gray-600 mb-6">Show this at pickup counter</p>
            <img
              src={qrImageUrl}
              alt="QR Code"
              className="mx-auto rounded-lg shadow-md"
              style={{ width: '340px', height: '340px' }}
              onLoad={() => setIsImageLoaded(true)}
            />
            <div className="mt-8">
              <div className="text-2xl font-mono font-bold">Order: {orderId}</div>
              <div className="text-xl font-bold text-blue-600 mt-2">Pickup Code: {pickupCode}</div>
            </div>
            {productItems.length > 0 && (
              <div className="mt-8 bg-gray-50 rounded-lg p-5 text-left">
                <h3 className="font-bold mb-3">Order Items</h3>
                {productItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.total}</span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-4 font-bold flex justify-between">
                  <span>Total</span>
                  <span className="text-lg">₹{totalAmount}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Print-Only Layout: Full Page Display */}
      <div className="print-only">
        <div className="label-content">
          <div className="text-center">
            <div className="font-bold text-lg mb-2">PRIYA CHICKEN</div>
            <div className="text-md mb-4">{storeName.toUpperCase()}</div>
            <img
              src={qrImageUrl}
              alt="QR"
              className="qr-code"
              onLoad={() => setIsImageLoaded(true)}
            />
            <div className="mt-4">
              <div className="font-bold text-xl">ORDER: {orderId}</div>
              <div className="font-bold text-2xl tracking-wider text-blue-600">CODE: {pickupCode}</div>
            </div>
            {productItems.length > 0 && (
              <div className="text-sm mt-4 text-left px-4 max-w-2xl mx-auto">
                <h3 className="font-bold mb-3 text-lg">Order Items</h3>
                {productItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-1 border-b border-gray-300">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.total}</span>
                  </div>
                ))}
                <div className="border-t border-black mt-4 pt-3 font-bold flex justify-between text-lg">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style type="text/css">{`
        /* Hide print layout on screen */
        .print-only {
          display: none;
        }
        @media print {
          @page {
            size: A4;
            margin: 0.5in;
          }
          body, html {
            margin: 0;
            padding: 0;
            background: white;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          /* Hide screen view */
          .screen-view {
            display: none !important;
          }
          /* Show only print layout */
          .print-only {
            display: block !important;
          }
          .label-content {
            width: 100%;
            min-height: 100vh;
            padding: 1in;
            box-sizing: border-box;
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 12px;
            line-height: 1.3;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .qr-code {
            width: 300px;
            height: 300px;
            margin: 20px auto;
            display: block;
            image-rendering: crisp-edges;
            image-rendering: pixelated;
          }
        }
      `}</style>
    </>
  );
};

export default PrintQR;
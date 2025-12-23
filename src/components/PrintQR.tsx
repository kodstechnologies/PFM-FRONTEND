


// // import axios from 'axios';
// // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // import { useParams, useSearchParams } from 'react-router-dom';

// // type ProductItem = {
// //   id?: string;
// //   name?: string;
// //   quantity?: number;
// //   price?: number;
// //   total: number;
// // };

// // const PrintQR: React.FC = () => {
// //   const BaseUrl = import.meta.env.VITE_API_URL;
// //   const { orderId } = useParams<{ orderId: string }>();
// //   const [searchParams] = useSearchParams();
// //   const [isImageLoaded, setIsImageLoaded] = useState(false);
// //   const hasPrintedRef = useRef(false);
// //   const orderDetailsParam = searchParams.get('orderDetails');
// //   const orderDetails = useMemo(() => {
// //     if (orderDetailsParam) {
// //       try {
// //         return JSON.parse(decodeURIComponent(orderDetailsParam));
// //       } catch (error) {
// //         console.error('Error parsing orderDetails:', error);
// //         return [];
// //       }
// //     }
// //     return [];
// //   }, [orderDetailsParam]);

// //   const productItems: ProductItem[] = useMemo(() => {
// //     return orderDetails.map((item: any) => ({
// //       id: item._id,
// //       name: item.name,
// //       quantity: item.quantity,
// //       price: item.price,
// //       total: item.price * item.quantity,
// //     }));
// //   }, [orderDetails]);
// //   const totalAmount = useMemo(() => {
// //     return productItems.reduce((sum, item) => sum + item.total, 0);
// //   }, [productItems]);
// //   const qrPayload = useMemo(() => {
// //     const id = orderId || '';
// //     return JSON.stringify({
// //       orderId: id,
// //       pickupCode: id.slice(-4),
// //       timestamp: new Date().toISOString(),
// //       store: 'Priya Chicken',
// //       action: 'confirm-pickup',
// //       url: `https://priyafreshmeats.com/pickup/${id}`,
// //       productIds: productItems,
// //       orderSummary: `Order #${id} - Ready for pickup`,
// //       totalItems: productItems.length,
// //       totalAmount,
// //     });
// //   }, [orderId, productItems, totalAmount]);
// //   // High-resolution QR for sharp printing on thermal labels
// //   const qrImageUrl = useMemo(() => {
// //     const size = 450; // High density for clarity
// //     const encoded = encodeURIComponent(qrPayload);
// //     return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&ecc=H`;
// //   }, [qrPayload]);
// //   const [store_Name, setStore_Name] = useState("");

// //   useEffect(() => {
// //     const fetchStoreName = async () => {
// //       if (!orderId) return;
// //       try {
// //         const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
// //         setStore_Name(data.storeName || 'Indiranagar');
// //       } catch (err) {
// //         console.error("Error fetching store name:", err);
// //         setStore_Name('Indiranagar');
// //       }
// //     };
// //     fetchStoreName();
// //   }, [orderId, BaseUrl]);
// //   const storeName = store_Name || 'Indiranagar';
// //   const pickupCode = orderId?.slice(-4) || '';
// //   useEffect(() => {
// //     if (isImageLoaded && !hasPrintedRef.current) {
// //       const timer = setTimeout(() => {
// //         window.print();
// //         hasPrintedRef.current = true;
// //       }, 400);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [isImageLoaded]);
// //   if (!orderId) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-white">
// //         <div className="text-center">
// //           <h2 className="text-xl font-semibold mb-4">No order provided</h2>
// //           <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded">
// //             Close
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       {/* Normal Screen View (Preview) */}
// //       <div className="screen-view min-h-screen bg-gray-50 flex items-center justify-center p-8">
// //         <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
// //           <div className="flex justify-between items-center mb-6 print:hidden">
// //             <div>
// //               <h1 className="text-2xl font-bold">Pickup QR</h1>
// //               <p className="text-gray-600">Order #{orderId}</p>
// //             </div>
// //             <div className="space-x-4">
// //               <button onClick={() => window.print()} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
// //                 Print
// //               </button>
// //               <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium">
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //           <div className="text-center border-2 border-dashed border-gray-300 rounded-xl p-8">
// //             <h2 className="text-xl font-bold mb-2">Priya Chicken - {storeName}</h2>
// //             <p className="text-gray-600 mb-6">Show this at pickup counter</p>
// //             <img
// //               src={qrImageUrl}
// //               alt="QR Code"
// //               className="mx-auto rounded-lg shadow-md"
// //               style={{ width: '340px', height: '340px' }}
// //               onLoad={() => setIsImageLoaded(true)}
// //             />
// //             <div className="mt-8">
// //               <div className="text-2xl font-mono font-bold">Order: {orderId}</div>
// //               <div className="text-xl font-bold text-blue-600 mt-2">Pickup Code: {pickupCode}</div>
// //             </div>
// //             {productItems.length > 0 && (
// //               <div className="mt-8 bg-gray-50 rounded-lg p-5 text-left">
// //                 <h3 className="font-bold mb-3">Order Items</h3>
// //                 {productItems.map((item) => (
// //                   <div key={item.id} className="flex justify-between text-sm py-1">
// //                     <span>{item.name} × {item.quantity}</span>
// //                     <span className="font-medium">₹{item.total}</span>
// //                   </div>
// //                 ))}
// //                 <div className="border-t pt-3 mt-4 font-bold flex justify-between">
// //                   <span>Total</span>
// //                   <span className="text-lg">₹{totalAmount}</span>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //       {/* Print-Only Layout: Full Page Display */}
// //       <div className="print-only">
// //         <div className="label-content">
// //           <div className="text-center">
// //             <div className="font-bold text-lg mb-2">PRIYA CHICKEN</div>
// //             <div className="text-md mb-4">{storeName.toUpperCase()}</div>
// //             <img
// //               src={qrImageUrl}
// //               alt="QR"
// //               className="qr-code"
// //               onLoad={() => setIsImageLoaded(true)}
// //             />
// //             <div className="mt-4">
// //               <div className="font-bold text-xl">ORDER: {orderId}</div>
// //               <div className="font-bold text-2xl tracking-wider text-blue-600">CODE: {pickupCode}</div>
// //             </div>
// //             {productItems.length > 0 && (
// //               <div className="text-sm mt-4 text-left px-4 max-w-2xl mx-auto">
// //                 <h3 className="font-bold mb-3 text-lg">Order Items</h3>
// //                 {productItems.map((item) => (
// //                   <div key={item.id} className="flex justify-between py-1 border-b border-gray-300">
// //                     <span>{item.name} × {item.quantity}</span>
// //                     <span className="font-medium">₹{item.total}</span>
// //                   </div>
// //                 ))}
// //                 <div className="border-t border-black mt-4 pt-3 font-bold flex justify-between text-lg">
// //                   <span>Total</span>
// //                   <span>₹{totalAmount}</span>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //       <style type="text/css">{`
// //         /* Hide print layout on screen */
// //         .print-only {
// //           display: none;
// //         }
// //         @media print {
// //           @page {
// //             size: A4;
// //             margin: 0.5in;
// //           }
// //           body, html {
// //             margin: 0;
// //             padding: 0;
// //             background: white;
// //             print-color-adjust: exact;
// //             -webkit-print-color-adjust: exact;
// //           }
// //           /* Hide screen view */
// //           .screen-view {
// //             display: none !important;
// //           }
// //           /* Show only print layout */
// //           .print-only {
// //             display: block !important;
// //           }
// //           .label-content {
// //             width: 100%;
// //             min-height: 100vh;
// //             padding: 1in;
// //             box-sizing: border-box;
// //             font-family: 'Arial', 'Helvetica', sans-serif;
// //             font-size: 12px;
// //             line-height: 1.3;
// //             display: flex;
// //             flex-direction: column;
// //             align-items: center;
// //             justify-content: center;
// //           }
// //           .qr-code {
// //             width: 300px;
// //             height: 300px;
// //             margin: 20px auto;
// //             display: block;
// //             image-rendering: crisp-edges;
// //             image-rendering: pixelated;
// //           }
// //         }
// //       `}</style>
// //     </>
// //   );
// // };

// // export default PrintQR;

// import axios from 'axios';
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';

// type ProductItem = {
//   id?: string;
//   name?: string;
//   quantity?: number;
//   price?: number;
//   total: number;
// };

// const PrintQR: React.FC = () => {
//   const BaseUrl = import.meta.env.VITE_API_URL;
//   const { orderId } = useParams<{ orderId: string }>();
//   const [searchParams] = useSearchParams();
//   const [isImageLoaded, setIsImageLoaded] = useState(false);
//   const hasPrintedRef = useRef(false);
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

//   const productItems: ProductItem[] = useMemo(() => {
//     return orderDetails.map((item: any) => ({
//       id: item._id,
//       name: item.name,
//       quantity: item.quantity,
//       price: item.price,
//       total: item.price * item.quantity,
//     }));
//   }, [orderDetails]);
//   const totalAmount = useMemo(() => {
//     return productItems.reduce((sum, item) => sum + item.total, 0);
//   }, [productItems]);
//   const qrPayload = useMemo(() => {
//     const id = orderId || '';
//     return JSON.stringify({
//       orderId: id,
//       pickupCode: id.slice(-4),
//       timestamp: new Date().toISOString(),
//       store: 'Priya Chicken',
//       action: 'confirm-pickup',
//       url: `https://priyafreshmeats.com/pickup/${id}`,
//       productIds: productItems,
//       orderSummary: `Order #${id} - Ready for pickup`,
//       totalItems: productItems.length,
//       totalAmount,
//     });
//   }, [orderId, productItems, totalAmount]);
//   // High-resolution QR for sharp printing on thermal labels
//   const qrImageUrl = useMemo(() => {
//     const size = 450; // High density for clarity
//     const encoded = encodeURIComponent(qrPayload);
//     return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&ecc=H`;
//   }, [qrPayload]);
//   const [store_Name, setStore_Name] = useState("");

//   useEffect(() => {
//     const fetchStoreName = async () => {
//       if (!orderId) return;
//       try {
//         const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
//         setStore_Name(data.storeName || 'Indiranagar');
//       } catch (err) {
//         console.error("Error fetching store name:", err);
//         setStore_Name('Indiranagar');
//       }
//     };
//     fetchStoreName();
//   }, [orderId, BaseUrl]);
//   const storeName = store_Name || 'Indiranagar';
//   const pickupCode = orderId?.slice(-4) || '';
//   useEffect(() => {
//     if (isImageLoaded && !hasPrintedRef.current) {
//       const timer = setTimeout(() => {
//         window.print();
//         hasPrintedRef.current = true;
//       }, 400);
//       return () => clearTimeout(timer);
//     }
//   }, [isImageLoaded]);
//   if (!orderId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold mb-4">No order provided</h2>
//           <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded">
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Normal Screen View (Preview) */}
//       <div className="screen-view min-h-screen bg-gray-50 flex items-center justify-center p-8">
//         <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
//           <div className="flex justify-between items-center mb-6 print:hidden">
//             <div>
//               <h1 className="text-2xl font-bold">Pickup QR</h1>
//               <p className="text-gray-600">Order #{orderId}</p>
//             </div>
//             <div className="space-x-4">
//               <button onClick={() => window.print()} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
//                 Print
//               </button>
//               <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium">
//                 Close
//               </button>
//             </div>
//           </div>
//           <div className="text-center border-2 border-dashed border-gray-300 rounded-xl p-8">
//             <h2 className="text-xl font-bold mb-2">Priya Chicken - {storeName}</h2>
//             <p className="text-gray-600 mb-6">Show this at pickup counter</p>
//             <img
//               src={qrImageUrl}
//               alt="QR Code"
//               className="mx-auto rounded-lg shadow-md"
//               style={{ width: '340px', height: '340px' }}
//               onLoad={() => setIsImageLoaded(true)}
//             />
//             <div className="mt-8">
//               <div className="text-2xl font-mono font-bold">Order: {orderId}</div>
//               <div className="text-xl font-bold text-blue-600 mt-2">Pickup Code: {pickupCode}</div>
//             </div>
//             {productItems.length > 0 && (
//               <div className="mt-8 bg-gray-50 rounded-lg p-5 text-left">
//                 <h3 className="font-bold mb-3">Order Items</h3>
//                 {productItems.map((item) => (
//                   <div key={item.id} className="flex justify-between text-sm py-1">
//                     <span>{item.name} × {item.quantity}</span>
//                     <span className="font-medium">₹{item.total}</span>
//                   </div>
//                 ))}
//                 <div className="border-t pt-3 mt-4 font-bold flex justify-between">
//                   <span>Total</span>
//                   <span className="text-lg">₹{totalAmount}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Print-Only Layout: Full Page Display */}
//       <div className="print-only">
//         <div className="label-content">
//           <div className="text-center">
//             <div className="font-bold text-lg mb-2">PRIYA CHICKEN</div>
//             <div className="text-md mb-4">{storeName.toUpperCase()}</div>
//             <img
//               src={qrImageUrl}
//               alt="QR"
//               className="qr-code"
//               onLoad={() => setIsImageLoaded(true)}
//             />
//             <div className="mt-4">
//               <div className="font-bold text-xl">ORDER: {orderId}</div>
//               <div className="font-bold text-2xl tracking-wider text-blue-600">CODE: {pickupCode}</div>
//             </div>
//             {productItems.length > 0 && (
//               <div className="text-sm mt-4 text-left px-4 max-w-2xl mx-auto">
//                 <h3 className="font-bold mb-3 text-lg">Order Items</h3>
//                 {productItems.map((item) => (
//                   <div key={item.id} className="flex justify-between py-1 border-b border-gray-300">
//                     <span>{item.name} × {item.quantity}</span>
//                     <span className="font-medium">₹{item.total}</span>
//                   </div>
//                 ))}
//                 <div className="border-t border-black mt-4 pt-3 font-bold flex justify-between text-lg">
//                   <span>Total</span>
//                   <span>₹{totalAmount}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <style type="text/css">{`
//         /* Hide print layout on screen */
//         .print-only {
//           display: none;
//         }
//         @media print {
//           @page {
//             size: A4;
//             margin: 0.5in;
//           }
//           body, html {
//             margin: 0;
//             padding: 0;
//             background: white;
//             print-color-adjust: exact;
//             -webkit-print-color-adjust: exact;
//           }
//           /* Hide screen view */
//           .screen-view {
//             display: none !important;
//           }
//           /* Show only print layout */
//           .print-only {
//             display: block !important;
//           }
//           .label-content {
//             width: 100%;
//             min-height: 100vh;
//             padding: 1in;
//             box-sizing: border-box;
//             font-family: 'Arial', 'Helvetica', sans-serif;
//             font-size: 12px;
//             line-height: 1.3;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//           }
//           .qr-code {
//             width: 200px;
//             height: 200px;
//             margin: 20px auto;
//             display: block;
//             image-rendering: crisp-edges;
//             image-rendering: pixelated;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default PrintQR;

import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import logo from "../assets/logo/logo.png"

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
  const [recieverName, setRecieverName] = useState([]);
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
        setRecieverName(data.recieverName)
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
            <h2 className="text-xl font-bold mb-2">Priya Fresh Meats - {storeName}</h2>
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
      {/* Print-Only Layout: Compact Size */}
      <div className="print-only">
        <div className="label-content">
          <div className="text-center">
            {/* <div className="font-bold text-3xl mb-1 ">Priya Fresh Meats</div> */}
            <div className=' gap-[4rem] w-[70rem] flex justify-center '>
              <div>
                <img src={logo} alt="" className='h-[20rem]' />
              </div>
              <div className='flex flex-col items-start justify-center'>
                <h3 className=" font-bold text-4xl mb-2">Store Name : {storeName.toUpperCase()}</h3>
                <h3 className="font-bold text-3xl">ORDER: {orderId}</h3>
                <h3 className="font-bold text-3xl">Customer Name: {recieverName}</h3>
              </div>
            </div>

            <div className='flex gap-[6rem] w-screen  ml-[8rem]'>
              <div className=' '>
                <img
                  src={qrImageUrl}
                  alt="QR"
                  className="qr-code"
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>
              <div className="mt-2 flex flex-col justify-start items-start">


                <h3 className="font-bold text-3xl">Order Items</h3>
                {productItems.length > 0 && (
                  <div className="">
                    {productItems.map((item) => (
                      <div key={item.id} className="flex text-3xl justify-between py-0.5 border-gray-300 gap-[2rem]">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-medium">₹{item.total}</span>
                      </div>
                    ))}
                    {/* <div className="border-t border-black mt-2 pt-2 font-bold flex justify-between text-sm">
                      <span>Total</span>
                      <span>₹{totalAmount}</span>
                    </div> */}
                  </div>
                )}
                {/* <div className="font-bold text-sm">ORDER: {orderId}</div>
              <div className="font-bold text-sm">ORDER: {orderId}</div> */}
                {/* <div className="font-bold text-base tracking-wider text-blue-600">CODE: {pickupCode}</div> */}
              </div>
            </div>

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
            margin: 0.3in;
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
          backgroundcolor:"red"
            width: 100%;
            min-width: 8000px;
            margin: 0 auto;
            padding: 0.4in;
            box-sizing: border-box;
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 10px;
            line-height: 1.2;
          }
          .qr-code {
            width: 280px;
            height: 2
            80px;
            margin: 10px auto;
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
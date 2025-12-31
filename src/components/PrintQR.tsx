
// // // // // import axios from 'axios';
// // // // // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // // // // import { useParams, useSearchParams } from 'react-router-dom';
// // // // // import logo from "../assets/logo/logo.png"

// // // // // type ProductItem = {
// // // // //   id?: string;
// // // // //   name?: string;
// // // // //   quantity?: number;
// // // // //   price?: number;
// // // // //   total: number;
// // // // //   unit: number;
// // // // // };

// // // // // const PrintQR: React.FC = () => {
// // // // //   const BaseUrl = import.meta.env.VITE_API_URL;
// // // // //   const { orderId } = useParams<{ orderId: string }>();
// // // // //   const [searchParams] = useSearchParams();
// // // // //   const [isImageLoaded, setIsImageLoaded] = useState(false);
// // // // //   const hasPrintedRef = useRef(false);
// // // // //   const orderDetailsParam = searchParams.get('orderDetails');
// // // // //   const [recieverName, setRecieverName] = useState([]);
// // // // //   const orderDetails = useMemo(() => {
// // // // //     if (orderDetailsParam) {
// // // // //       try {
// // // // //         return JSON.parse(decodeURIComponent(orderDetailsParam));
// // // // //       } catch (error) {
// // // // //         console.error('Error parsing orderDetails:', error);
// // // // //         return [];
// // // // //       }
// // // // //     }
// // // // //     return [];
// // // // //   }, [orderDetailsParam]);
// // // // //   console.log("🚀 ~ PrintQR ~ orderDetails:", orderDetails)

// // // // //   const productItems: ProductItem[] = useMemo(() => {
// // // // //     return orderDetails.map((item: any) => ({
// // // // //       id: item._id,
// // // // //       name: item.name,
// // // // //       quantity: item.quantity,
// // // // //       price: item.price,
// // // // //       total: item.price * item.quantity,
// // // // //       unit: item.unit
// // // // //     }));
// // // // //   }, [orderDetails]);
// // // // //   const totalAmount = useMemo(() => {
// // // // //     return productItems.reduce((sum, item) => sum + item.total, 0);
// // // // //   }, [productItems]);
// // // // //   const qrPayload = useMemo(() => {
// // // // //     const id = orderId || '';
// // // // //     return JSON.stringify({
// // // // //       orderId: id,
// // // // //       pickupCode: id.slice(-4),
// // // // //       timestamp: new Date().toISOString(),
// // // // //       store: 'Priya Chicken',
// // // // //       action: 'confirm-pickup',
// // // // //       url: `https://priyafreshmeats.com/pickup/${id}`,
// // // // //       productIds: productItems,
// // // // //       orderSummary: `Order #${id} - Ready for pickup`,
// // // // //       totalItems: productItems.length,
// // // // //       totalAmount,
// // // // //     });
// // // // //   }, [orderId, productItems, totalAmount]);
// // // // //   // High-resolution QR for sharp printing on thermal labels
// // // // //   const qrImageUrl = useMemo(() => {
// // // // //     const size = 450; // High density for clarity
// // // // //     const encoded = encodeURIComponent(qrPayload);
// // // // //     return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&ecc=H`;
// // // // //   }, [qrPayload]);
// // // // //   const [store_Name, setStore_Name] = useState("");

// // // // //   useEffect(() => {
// // // // //     const fetchStoreName = async () => {
// // // // //       if (!orderId) return;
// // // // //       try {
// // // // //         const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
// // // // //         setStore_Name(data.storeName || 'Indiranagar');
// // // // //         setRecieverName(data.recieverName)
// // // // //       } catch (err) {
// // // // //         console.error("Error fetching store name:", err);
// // // // //         setStore_Name('Indiranagar');
// // // // //       }
// // // // //     };
// // // // //     fetchStoreName();
// // // // //   }, [orderId, BaseUrl]);
// // // // //   const storeName = store_Name || 'Indiranagar';
// // // // //   const pickupCode = orderId?.slice(-4) || '';
// // // // //   useEffect(() => {
// // // // //     if (isImageLoaded && !hasPrintedRef.current) {
// // // // //       const timer = setTimeout(() => {
// // // // //         window.print();
// // // // //         hasPrintedRef.current = true;
// // // // //       }, 400);
// // // // //       return () => clearTimeout(timer);
// // // // //     }
// // // // //   }, [isImageLoaded]);
// // // // //   if (!orderId) {
// // // // //     return (
// // // // //       <div className="min-h-screen flex items-center justify-center bg-white">
// // // // //         <div className="text-center">
// // // // //           <h2 className="text-xl font-semibold mb-4">No order provided</h2>
// // // // //           <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded">
// // // // //             Close
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <>
// // // // //       {/* Normal Screen View (Preview) */}
// // // // //       <div className="screen-view min-h-screen bg-gray-50 flex items-center justify-center p-8">
// // // // //         <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
// // // // //           <div className="flex justify-between items-center mb-6 print:hidden">
// // // // //             <div>
// // // // //               <h1 className="text-2xl font-bold">Pickup QR</h1>
// // // // //               <p className="text-gray-600">Order #{orderId}</p>
// // // // //             </div>
// // // // //             <div className="space-x-4">
// // // // //               <button onClick={() => window.print()} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
// // // // //                 Print
// // // // //               </button>
// // // // //               <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium">
// // // // //                 Close
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //           <div className="text-center border-2 border-dashed border-gray-300 rounded-xl p-8">
// // // // //             <h2 className="text-xl font-bold mb-2">Priya Fresh Meats - {storeName}</h2>
// // // // //             <p className="text-gray-600 mb-6">Show this at pickup counter</p>
// // // // //             <img
// // // // //               src={qrImageUrl}
// // // // //               alt="QR Code"
// // // // //               className="mx-auto rounded-lg shadow-md"
// // // // //               style={{ width: '340px', height: '340px' }}
// // // // //               onLoad={() => setIsImageLoaded(true)}
// // // // //             />
// // // // //             <div className="mt-8">
// // // // //               <div className="text-2xl font-mono font-bold">Order: {orderId}</div>
// // // // //               <div className="text-xl font-bold text-blue-600 mt-2">Pickup Code: {pickupCode}</div>
// // // // //             </div>
// // // // //             {productItems.length > 0 && (
// // // // //               <div className="mt-8 bg-gray-50 rounded-lg p-5 text-left">
// // // // //                 <h3 className="font-bold mb-3">Order Items</h3>
// // // // //                 {productItems.map((item) => (
// // // // //                   <div key={item.id} className="flex justify-between text-sm py-1">
// // // // //                     <span>{item.name} × {item.quantity}</span>
// // // // //                     <span className="font-medium">₹{item.total}</span>
// // // // //                   </div>
// // // // //                 ))}
// // // // //                 <div className="border-t pt-3 mt-4 font-bold flex justify-between">
// // // // //                   <span>Total</span>
// // // // //                   <span className="text-lg">₹{totalAmount}</span>
// // // // //                 </div>
// // // // //               </div>

// // // // //             )}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //       {/* Print-Only Layout: Compact Size */}
// // // // //       <div className="print-only m-0 p-0 ">
// // // // //         <div className="label-content">
// // // // //           <div className="text-center">
// // // // //             {/* <div className="font-bold text-3xl mb-1 ">Priya Fresh Meats</div> */}
// // // // //             <div className=' '>
// // // // //               <div>
// // // // //                 <div className='gap-[4rem] w-[70rem] flex  m-0 '>
// // // // //                   <div>
// // // // //                     <img src={logo} alt="" className='h-[20rem]' />
// // // // //                   </div>
// // // // //                   <div className='flex flex-col items-start justify-center'>
// // // // //                     <h3 className=" font-bold text-4xl mb-2">Store Name : {storeName.toUpperCase()}</h3>
// // // // //                     <h3 className="font-bold text-3xl">ORDER: {orderId}</h3>
// // // // //                     <h3 className="font-bold text-3xl">Customer Name: {recieverName}</h3>
// // // // //                   </div>
// // // // //                 </div>
// // // // //                 <div className='flex gap-[4rem] w-screen'>
// // // // //                   <div>
// // // // //                     <img
// // // // //                       src={qrImageUrl}
// // // // //                       alt="QR"
// // // // //                       className="qr-code"
// // // // //                       onLoad={() => setIsImageLoaded(true)}
// // // // //                     />

// // // // //                   </div>
// // // // //                   <div className="mt-2 flex flex-col justify-start items-start">

// // // // //                     <h3 className="font-bold text-3xl">Order Items</h3>
// // // // //                     {productItems.length > 0 && (
// // // // //                       <div className="">
// // // // //                         {productItems.map((item) => (
// // // // //                           <div key={item.id} className="flex text-3xl items-baseline  py-0.5 border-gray-300 gap-[2rem]">
// // // // //                             <span>{item.name} </span>
// // // // //                             <span> × </span>
// // // // //                             <span> {item.quantity} {item.unit}</span>
// // // // //                             {/* <span className="font-medium">₹{item.total}</span> */}
// // // // //                           </div>
// // // // //                         ))}
// // // // //                         {/* <div className="border-t border-black mt-2 pt-2 font-bold flex justify-between text-sm">
// // // // //                       <span>Total</span>
// // // // //                       <span>₹{totalAmount}</span>
// // // // //                     </div> */}
// // // // //                       </div>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 </div>

// // // // //               </div>

// // // // //             </div>




// // // // //             {/* <div className="font-bold text-sm">ORDER: {orderId}</div>
// // // // //               <div className="font-bold text-sm">ORDER: {orderId}</div> */}
// // // // //             {/* <div className="font-bold text-base tracking-wider text-blue-600">CODE: {pickupCode}</div> */}
// // // // //           </div>
// // // // //         </div>

// // // // //       </div>

// // // // //       <style type="text/css">{`
// // // // //         /* Hide print layout on screen */
// // // // //         .print-only {
// // // // //           display: none;
// // // // //         }
// // // // //         @media print {
// // // // //           @page {
// // // // //             size: A4;

// // // // //           }
// // // // //           body, html {
// // // // //             margin: 0;
// // // // //             padding: 0;
// // // // //             background: white;
// // // // //             print-color-adjust: exact;
// // // // //             -webkit-print-color-adjust: exact;
// // // // //           }
// // // // //           /* Hide screen view */
// // // // //           .screen-view {
// // // // //             display: none !important;
// // // // //           }
// // // // //           /* Show only print layout */
// // // // //           .print-only {
// // // // //             display: block !important;
// // // // //           }
// // // // //           .label-content {
// // // // //           backgroundcolor:"red"
// // // // //             width: 100%;
// // // // //             min-width: 8000px;


// // // // //             box-sizing: border-box;
// // // // //             font-family: 'Arial', 'Helvetica', sans-serif;
// // // // //             font-size: 10px;
// // // // //             line-height: 1.2;
// // // // //           }
// // // // //           .qr-code {
// // // // //             width: 400px;
// // // // //             height: 400px;


// // // // //             display: block;
// // // // //             image-rendering: crisp-edges;
// // // // //             image-rendering: pixelated;
// // // // //           }
// // // // //         }
// // // // //       `}</style>
// // // // //     </>
// // // // //   );
// // // // // };

// // // // // export default PrintQR;

// // // // // import axios from 'axios';
// // // // // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // // // // import { useParams, useSearchParams } from 'react-router-dom';
// // // // // import QRCode from 'qrcode.react'; // Added: Local QR generation
// // // // // import logo from "../assets/logo/logo.png"

// // // // // type ProductItem = {
// // // // //   id?: string;
// // // // //   name?: string;
// // // // //   quantity?: number;
// // // // //   price?: number;
// // // // //   total: number;
// // // // //   unit: number;
// // // // // };

// // // // // const PrintQR: React.FC = () => {
// // // // //   const BaseUrl = import.meta.env.VITE_API_URL;
// // // // //   const { orderId } = useParams<{ orderId: string }>();
// // // // //   const [searchParams] = useSearchParams();
// // // // //   const [isComponentReady, setIsComponentReady] = useState(false); // Changed: From image load to component ready
// // // // //   const hasPrintedRef = useRef(false);
// // // // //   const orderDetailsParam = searchParams.get('orderDetails');
// // // // //   const [recieverName, setRecieverName] = useState<string>(""); // Fixed: Initialize as string to avoid array issues
// // // // //   const orderDetails = useMemo(() => {
// // // // //     if (orderDetailsParam) {
// // // // //       try {
// // // // //         return JSON.parse(decodeURIComponent(orderDetailsParam));
// // // // //       } catch (error) {
// // // // //         console.error('Error parsing orderDetails:', error);
// // // // //         return [];
// // // // //       }
// // // // //     }
// // // // //     return [];
// // // // //   }, [orderDetailsParam]);
// // // // //   console.log("🚀 ~ PrintQR ~ orderDetails:", orderDetails)

// // // // //   const productItems: ProductItem[] = useMemo(() => {
// // // // //     return orderDetails.map((item: any) => ({
// // // // //       id: item._id,
// // // // //       name: item.name,
// // // // //       quantity: item.quantity,
// // // // //       price: item.price,
// // // // //       total: item.price * item.quantity,
// // // // //       unit: item.unit
// // // // //     }));
// // // // //   }, [orderDetails]);
// // // // //   const totalAmount = useMemo(() => {
// // // // //     return productItems.reduce((sum, item) => sum + item.total, 0);
// // // // //   }, [productItems]);
// // // // //   const qrPayload = useMemo(() => {
// // // // //     const id = orderId || '';
// // // // //     return JSON.stringify({
// // // // //       orderId: id,
// // // // //       pickupCode: id.slice(-4),
// // // // //       timestamp: new Date().toISOString(),
// // // // //       store: 'Priya Chicken',
// // // // //       action: 'confirm-pickup',
// // // // //       url: `https://priyafreshmeats.com/pickup/${id}`,
// // // // //       productIds: productItems,
// // // // //       orderSummary: `Order #${id} - Ready for pickup`,
// // // // //       totalItems: productItems.length,
// // // // //       totalAmount,
// // // // //     });
// // // // //   }, [orderId, productItems, totalAmount]);

// // // // //   // Removed: qrImageUrl - Now using local QRCode component

// // // // //   const [store_Name, setStore_Name] = useState("");

// // // // //   useEffect(() => {
// // // // //     const fetchStoreName = async () => {
// // // // //       if (!orderId) return;
// // // // //       try {
// // // // //         const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
// // // // //         setStore_Name(data.storeName || 'Indiranagar');
// // // // //         setRecieverName(data.recieverName || ''); // Fixed: Ensure string
// // // // //       } catch (err) {
// // // // //         console.error("Error fetching store name:", err);
// // // // //         setStore_Name('Indiranagar');
// // // // //       }
// // // // //     };
// // // // //     fetchStoreName();
// // // // //   }, [orderId, BaseUrl]);
// // // // //   const storeName = store_Name || 'Indiranagar';
// // // // //   const pickupCode = orderId?.slice(-4) || '';

// // // // //   // Changed: Auto-print after component is ready (QR renders synchronously)
// // // // //   useEffect(() => {
// // // // //     if (isComponentReady && !hasPrintedRef.current) {
// // // // //       const timer = setTimeout(() => {
// // // // //         window.print();
// // // // //         hasPrintedRef.current = true;
// // // // //       }, 400);
// // // // //       return () => clearTimeout(timer);
// // // // //     }
// // // // //   }, [isComponentReady]);

// // // // //   // Set ready after data loads
// // // // //   useEffect(() => {
// // // // //     if (orderId && productItems.length >= 0 && storeName) {
// // // // //       setIsComponentReady(true);
// // // // //     }
// // // // //   }, [orderId, productItems.length, storeName]);

// // // // //   if (!orderId) {
// // // // //     return (
// // // // //       <div className="min-h-screen flex items-center justify-center bg-white">
// // // // //         <div className="text-center">
// // // // //           <h2 className="text-xl font-semibold mb-4">No order provided</h2>
// // // // //           <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded">
// // // // //             Close
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   // Helper to render recieverName safely (in case it's array)
// // // // //   const renderRecieverName = () => {
// // // // //     if (Array.isArray(recieverName)) {
// // // // //       return recieverName.join(', ');
// // // // //     }
// // // // //     return recieverName;
// // // // //   };

// // // // //   return (
// // // // //     <>
// // // // //       {/* Normal Screen View (Preview) */}
// // // // //       <div className="screen-view min-h-screen bg-gray-50 flex items-center justify-center p-8">
// // // // //         <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
// // // // //           <div className="flex justify-between items-center mb-6 print:hidden">
// // // // //             <div>
// // // // //               <h1 className="text-2xl font-bold">Pickup QR</h1>
// // // // //               <p className="text-gray-600">Order #{orderId}</p>
// // // // //             </div>
// // // // //             <div className="space-x-4">
// // // // //               <button onClick={() => window.print()} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
// // // // //                 Print
// // // // //               </button>
// // // // //               <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium">
// // // // //                 Close
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //           <div className="text-center border-2 border-dashed border-gray-300 rounded-xl p-8">
// // // // //             <h2 className="text-xl font-bold mb-2">Priya Fresh Meats - {storeName}</h2>
// // // // //             <p className="text-gray-600 mb-6">Show this at pickup counter</p>
// // // // //             <QRCode // Changed: Local QR component
// // // // //               value={qrPayload}
// // // // //               size={340}
// // // // //               level="H" // High error correction for better reliability
// // // // //               className="mx-auto rounded-lg shadow-md"
// // // // //               style={{ display: 'block' }}
// // // // //             />
// // // // //             <div className="mt-8">
// // // // //               <div className="text-2xl font-mono font-bold">Order: {orderId}</div>
// // // // //               <div className="text-xl font-bold text-blue-600 mt-2">Pickup Code: {pickupCode}</div>
// // // // //             </div>
// // // // //             {productItems.length > 0 && (
// // // // //               <div className="mt-8 bg-gray-50 rounded-lg p-5 text-left">
// // // // //                 <h3 className="font-bold mb-3">Order Items</h3>
// // // // //                 {productItems.map((item) => (
// // // // //                   <div key={item.id} className="flex justify-between text-sm py-1">
// // // // //                     <span>{item.name} × {item.quantity}</span>
// // // // //                     <span className="font-medium">₹{item.total}</span>
// // // // //                   </div>
// // // // //                 ))}
// // // // //                 <div className="border-t pt-3 mt-4 font-bold flex justify-between">
// // // // //                   <span>Total</span>
// // // // //                   <span className="text-lg">₹{totalAmount}</span>
// // // // //                 </div>
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //       {/* Print-Only Layout: Compact Size for A4 */}
// // // // //       <div className="print-only m-0 p-0">
// // // // //         <div className="label-content">
// // // // //           <div className="text-center">
// // // // //             <div className='w-full flex flex-col md:flex-row gap-8 p-4'> {/* Fixed: Responsive, no overflow */}
// // // // //               <div className="flex-shrink-0">
// // // // //                 <img src={logo} alt="Logo" className='h-20 w-auto' /> {/* Fixed: Reasonable size */}
// // // // //               </div>
// // // // //               <div className='flex flex-col items-start justify-center flex-1'>
// // // // //                 <h3 className="font-bold text-2xl mb-2">Store Name: {storeName.toUpperCase()}</h3> {/* Reduced font */}
// // // // //                 <h3 className="font-bold text-xl">ORDER: {orderId}</h3>
// // // // //                 <h3 className="font-bold text-xl">Customer Name: {renderRecieverName()}</h3> {/* Safe render */}
// // // // //               </div>
// // // // //             </div>
// // // // //             <div className='flex flex-col md:flex-row gap-8 w-full p-4'> {/* Fixed: Responsive */}
// // // // //               <div className="flex-shrink-0">
// // // // //                 <QRCode // Changed: Local QR component
// // // // //                   value={qrPayload}
// // // // //                   size={300} // Adjusted for print fit
// // // // //                   level="H" // High error correction
// // // // //                   className="qr-code"
// // // // //                 />
// // // // //               </div>
// // // // //               <div className="flex flex-col justify-start items-start flex-1 mt-2">
// // // // //                 <h3 className="font-bold text-xl mb-4">Order Items</h3> {/* Reduced font */}
// // // // //                 {productItems.length > 0 && (
// // // // //                   <div className="">
// // // // //                     {productItems.map((item) => (
// // // // //                       <div key={item.id} className="flex items-baseline py-1 border-b border-gray-300 text-lg gap-4"> {/* Adjusted gap/font */}
// // // // //                         <span className="flex-1">{item.name}</span>
// // // // //                         <span>×</span>
// // // // //                         <span>{item.quantity} {item.unit}</span>
// // // // //                       </div>
// // // // //                     ))}
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       <style type="text/css">{`
// // // // //         /* Hide print layout on screen */
// // // // //         .print-only {
// // // // //           display: none;
// // // // //         }
// // // // //         @media print {
// // // // //           @page {
// // // // //             size: A4;
// // // // //             margin: 0.5in;
// // // // //           }
// // // // //           body, html {
// // // // //             margin: 0;
// // // // //             padding: 0;
// // // // //             background: white;
// // // // //             print-color-adjust: exact;
// // // // //             -webkit-print-color-adjust: exact;
// // // // //           }
// // // // //           /* Hide screen view */
// // // // //           .screen-view {
// // // // //             display: none !important;
// // // // //           }
// // // // //           /* Show only print layout */
// // // // //           .print-only {
// // // // //             display: block !important;
// // // // //           }
// // // // //           .label-content {
// // // // //             width: 100%; /* Fixed: No excessive min-width */
// // // // //             box-sizing: border-box;
// // // // //             font-family: 'Arial', 'Helvetica', sans-serif;
// // // // //             font-size: 12px;
// // // // //             line-height: 1.2;
// // // // //           }
// // // // //           .qr-code {
// // // // //             width: 300px !important; /* Ensure crisp print size */
// // // // //             height: 300px !important;
// // // // //             display: block;
// // // // //             image-rendering: crisp-edges;
// // // // //             image-rendering: pixelated;
// // // // //           }
// // // // //         }
// // // // //       `}</style>
// // // // //     </>
// // // // //   );
// // // // // };

// // // // // export default PrintQR;

// // // // import axios from 'axios';
// // // // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // // // import { useParams, useSearchParams } from 'react-router-dom';
// // // // import QRCode from 'qrcode.react';
// // // // import logo from "../assets/logo/logo.png";

// // // // type ProductItem = {
// // // //   id?: string;
// // // //   name?: string;
// // // //   quantity?: number;
// // // //   price?: number;
// // // //   total: number;
// // // //   unit?: string; // Added: unit as optional string for better typing
// // // // };

// // // // const PrintQR: React.FC = () => {
// // // //   const BaseUrl = import.meta.env.VITE_API_URL;
// // // //   const { orderId } = useParams<{ orderId: string }>();
// // // //   const [searchParams] = useSearchParams();
// // // //   const [isComponentReady, setIsComponentReady] = useState(false);
// // // //   const hasPrintedRef = useRef(false);
// // // //   const orderDetailsParam = searchParams.get('orderDetails');
// // // //   const [recieverName, setRecieverName] = useState<string>("");
// // // //   const orderDetails = useMemo(() => {
// // // //     if (orderDetailsParam) {
// // // //       try {
// // // //         return JSON.parse(decodeURIComponent(orderDetailsParam));
// // // //       } catch (error) {
// // // //         console.error('Error parsing orderDetails:', error);
// // // //         return [];
// // // //       }
// // // //     }
// // // //     return [];
// // // //   }, [orderDetailsParam]);

// // // //   const productItems: ProductItem[] = useMemo(() => {
// // // //     return orderDetails.map((item: any) => ({
// // // //       id: item._id,
// // // //       name: item.name,
// // // //       quantity: item.quantity,
// // // //       price: item.price,
// // // //       total: item.price * item.quantity,
// // // //       unit: item.unit || '', // Default to empty string if undefined
// // // //     }));
// // // //   }, [orderDetails]);

// // // //   const totalAmount = useMemo(() => {
// // // //     return productItems.reduce((sum, item) => sum + item.total, 0);
// // // //   }, [productItems]);

// // // //   const qrPayload = useMemo(() => {
// // // //     const id = orderId || '';
// // // //     return JSON.stringify({
// // // //       orderId: id,
// // // //       pickupCode: id.slice(-4),
// // // //       timestamp: new Date().toISOString(),
// // // //       store: 'Priya Chicken',
// // // //       action: 'confirm-pickup',
// // // //       url: `https://priyafreshmeats.com/pickup/${id}`,
// // // //       productIds: productItems.map(p => p.id), // Simplified: Just IDs to reduce payload size for better QR density
// // // //       orderSummary: `Order #${id} - Ready for pickup`,
// // // //       totalItems: productItems.length,
// // // //       totalAmount,
// // // //     });
// // // //   }, [orderId, productItems, totalAmount]);

// // // //   const [store_Name, setStore_Name] = useState("");

// // // //   useEffect(() => {
// // // //     const fetchStoreName = async () => {
// // // //       if (!orderId) return;
// // // //       try {
// // // //         const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
// // // //         setStore_Name(data.storeName || 'Indiranagar');
// // // //         setRecieverName(typeof data.recieverName === 'string' ? data.recieverName : Array.isArray(data.recieverName) ? data.recieverName.join(', ') : '');
// // // //       } catch (err) {
// // // //         console.error("Error fetching store name:", err);
// // // //         setStore_Name('Indiranagar');
// // // //       }
// // // //     };
// // // //     fetchStoreName();
// // // //   }, [orderId, BaseUrl]);

// // // //   const storeName = store_Name || 'Indiranagar';
// // // //   const pickupCode = orderId?.slice(-4) || '';

// // // //   useEffect(() => {
// // // //     if (isComponentReady && !hasPrintedRef.current) {
// // // //       const timer = setTimeout(() => {
// // // //         window.print();
// // // //         hasPrintedRef.current = true;
// // // //       }, 400);
// // // //       return () => clearTimeout(timer);
// // // //     }
// // // //   }, [isComponentReady]);

// // // //   // Set ready after all data loads (including API fetch)
// // // //   useEffect(() => {
// // // //     if (orderId && productItems.length >= 0 && storeName && recieverName !== undefined) {
// // // //       setIsComponentReady(true);
// // // //     }
// // // //   }, [orderId, productItems.length, storeName, recieverName]);

// // // //   if (!orderId) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-white">
// // // //         <div className="text-center">
// // // //           <h2 className="text-xl font-semibold mb-4">No order provided</h2>
// // // //           <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded">
// // // //             Close
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <>
// // // //       {/* Normal Screen View (Preview) */}
// // // //       <div className="screen-view min-h-screen bg-gray-50 flex items-center justify-center p-8">
// // // //         <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
// // // //           <div className="flex justify-between items-center mb-6 print:hidden">
// // // //             <div>
// // // //               <h1 className="text-2xl font-bold">Pickup QR</h1>
// // // //               <p className="text-gray-600">Order #{orderId}</p>
// // // //             </div>
// // // //             <div className="space-x-4">
// // // //               <button onClick={() => window.print()} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
// // // //                 Print
// // // //               </button>
// // // //               <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium">
// // // //                 Close
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //           <div className="text-center border-2 border-dashed border-gray-300 rounded-xl p-8">
// // // //             <h2 className="text-xl font-bold mb-2">Priya Fresh Meats - {storeName}</h2>
// // // //             <p className="text-gray-600 mb-6">Show this at pickup counter</p>
// // // //             <QRCode
// // // //               value={qrPayload}
// // // //               size={340}
// // // //               level="H"
// // // //               className="mx-auto rounded-lg shadow-md"
// // // //               style={{ display: 'block' }}
// // // //             />
// // // //             <div className="mt-8">
// // // //               <div className="text-2xl font-mono font-bold">Order: {orderId}</div>
// // // //               <div className="text-xl font-bold text-blue-600 mt-2">Pickup Code: {pickupCode}</div>
// // // //             </div>
// // // //             {productItems.length > 0 && (
// // // //               <div className="mt-8 bg-gray-50 rounded-lg p-5 text-left">
// // // //                 <h3 className="font-bold mb-3">Order Items</h3>
// // // //                 {productItems.map((item) => (
// // // //                   <div key={item.id} className="flex justify-between text-sm py-1">
// // // //                     <span>{item.name} × {item.quantity}</span>
// // // //                     <span className="font-medium">₹{item.total}</span>
// // // //                   </div>
// // // //                 ))}
// // // //                 <div className="border-t pt-3 mt-4 font-bold flex justify-between">
// // // //                   <span>Total</span>
// // // //                   <span className="text-lg">₹{totalAmount}</span>
// // // //                 </div>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Print-Only Layout: Optimized for A4/Label Printing */}
// // // //       <div className="print-only m-0 p-0">
// // // //         <div className="label-content">
// // // //           <div className="text-center p-4">
// // // //             {/* Header Row: Logo + Store/Order Info */}
// // // //             <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center mb-4 w-full">
// // // //               <div className="flex-shrink-0">
// // // //                 <img src={logo} alt="Logo" className="h-16 w-auto" />
// // // //               </div>
// // // //               <div className="flex-1 text-left">
// // // //                 <h3 className="font-bold text-xl uppercase tracking-wide">Store: {storeName}</h3>
// // // //                 <h3 className="font-bold text-lg">Order: {orderId}</h3>
// // // //                 <h3 className="font-bold text-lg">Customer: {recieverName || 'N/A'}</h3>
// // // //               </div>
// // // //             </div>

// // // //             {/* Content Row: QR + Items List */}
// // // //             <div className="flex flex-col lg:flex-row gap-6 w-full">
// // // //               <div className="flex-shrink-0 self-center">
// // // //                 <QRCode
// // // //                   value={qrPayload}
// // // //                   size={280} // Slightly smaller for better label fit
// // // //                   level="H"
// // // //                   className="qr-code"
// // // //                 />
// // // //               </div>
// // // //               <div className="flex-1">
// // // //                 <h3 className="font-bold text-lg mb-3 text-left">Order Items</h3>
// // // //                 {productItems.length > 0 ? (
// // // //                   <div className="space-y-1">
// // // //                     {productItems.map((item) => (
// // // //                       <div key={item.id} className="flex justify-between text-base border-b border-gray-300 py-1 last:border-b-0">
// // // //                         <span className="flex-1">{item.name}</span>
// // // //                         <span className="text-right">× {item.quantity} {item.unit}</span>
// // // //                       </div>
// // // //                     ))}
// // // //                     <div className="border-t mt-2 pt-2 font-bold text-lg flex justify-between">
// // // //                       <span>Total</span>
// // // //                       <span>₹{totalAmount}</span>
// // // //                     </div>
// // // //                   </div>
// // // //                 ) : (
// // // //                   <p className="text-sm text-gray-500">No items</p>
// // // //                 )}
// // // //               </div>
// // // //             </div>

// // // //             {/* Footer: Pickup Info */}
// // // //             <div className="mt-4 pt-2 border-t border-gray-300 text-center text-sm">
// // // //               <p>Pickup Code: {pickupCode}</p>
// // // //               <p className="text-xs">Scan QR to confirm pickup</p>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <style type="text/css">{`
// // // //         .print-only {
// // // //           display: none;
// // // //         }
// // // //         @media print {
// // // //           @page {
// // // //             size: A4 landscape; /* Changed: Landscape for better label fit */
// // // //             margin: 0.25in;
// // // //           }
// // // //           body, html {
// // // //             margin: 0;
// // // //             padding: 0;
// // // //             background: white;
// // // //             print-color-adjust: exact;
// // // //             -webkit-print-color-adjust: exact;
// // // //             font-size: 11px; /* Base font for print */
// // // //           }
// // // //           .screen-view {
// // // //             display: none !important;
// // // //           }
// // // //           .print-only {
// // // //             display: block !important;
// // // //           }
// // // //           .label-content {
// // // //             width: 100%;
// // // //             max-width: 100%;
// // // //             box-sizing: border-box;
// // // //             font-family: 'Arial', sans-serif;
// // // //             line-height: 1.3;
// // // //           }
// // // //           .qr-code {
// // // //             width: 280px !important;
// // // //             height: 280px !important;
// // // //             display: block;
// // // //             image-rendering: -webkit-optimize-contrast;
// // // //             image-rendering: crisp-edges;
// // // //           }
// // // //           /* Ensure no overflow in print */
// // // //           .print-only * {
// // // //             word-break: break-word;
// // // //             overflow-wrap: break-word;
// // // //           }
// // // //         }
// // // //         @media print and (max-width: 8.5in) { /* For smaller printers */
// // // //           @page {
// // // //             size: A4 portrait;
// // // //           }
// // // //           .label-content > div {
// // // //             flex-direction: column !important;
// // // //           }
// // // //         }
// // // //       `}</style>
// // // //     </>
// // // //   );
// // // // };

// // // // export default PrintQR;


// // // import axios from 'axios';
// // // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // // import { useParams, useSearchParams } from 'react-router-dom';
// // // import { QRCodeSVG } from 'qrcode.react'; // Fixed: Named import for SVG component (recommended)
// // // import logo from "../assets/logo/logo.png";

// // // type ProductItem = {
// // //   id?: string;
// // //   name?: string;
// // //   quantity?: number;
// // //   price?: number;
// // //   total: number;
// // //   unit?: string; // Added: unit as optional string for better typing
// // // };

// // // const PrintQR: React.FC = () => {
// // //   const BaseUrl = import.meta.env.VITE_API_URL;
// // //   const { orderId } = useParams<{ orderId: string }>();
// // //   const [searchParams] = useSearchParams();
// // //   const [isComponentReady, setIsComponentReady] = useState(false);
// // //   const hasPrintedRef = useRef(false);
// // //   const orderDetailsParam = searchParams.get('orderDetails');
// // //   const [recieverName, setRecieverName] = useState<string>("");
// // //   const orderDetails = useMemo(() => {
// // //     if (orderDetailsParam) {
// // //       try {
// // //         return JSON.parse(decodeURIComponent(orderDetailsParam));
// // //       } catch (error) {
// // //         console.error('Error parsing orderDetails:', error);
// // //         return [];
// // //       }
// // //     }
// // //     return [];
// // //   }, [orderDetailsParam]);

// // //   const productItems: ProductItem[] = useMemo(() => {
// // //     return orderDetails.map((item: any) => ({
// // //       id: item._id,
// // //       name: item.name,
// // //       quantity: item.quantity,
// // //       price: item.price,
// // //       total: item.price * item.quantity,
// // //       unit: item.unit || '', // Default to empty string if undefined
// // //     }));
// // //   }, [orderDetails]);

// // //   const totalAmount = useMemo(() => {
// // //     return productItems.reduce((sum, item) => sum + item.total, 0);
// // //   }, [productItems]);

// // //   const qrPayload = useMemo(() => {
// // //     const id = orderId || '';
// // //     return JSON.stringify({
// // //       orderId: id,
// // //       pickupCode: id.slice(-4),
// // //       timestamp: new Date().toISOString(),
// // //       store: 'Priya Chicken',
// // //       action: 'confirm-pickup',
// // //       url: `https://priyafreshmeats.com/pickup/${id}`,
// // //       productIds: productItems.map(p => p.id), // Simplified: Just IDs to reduce payload size for better QR density
// // //       orderSummary: `Order #${id} - Ready for pickup`,
// // //       totalItems: productItems.length,
// // //       totalAmount,
// // //     });
// // //   }, [orderId, productItems, totalAmount]);

// // //   const [store_Name, setStore_Name] = useState("");

// // //   useEffect(() => {
// // //     const fetchStoreName = async () => {
// // //       if (!orderId) return;
// // //       try {
// // //         const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
// // //         setStore_Name(data.storeName || 'Indiranagar');
// // //         setRecieverName(typeof data.recieverName === 'string' ? data.recieverName : Array.isArray(data.recieverName) ? data.recieverName.join(', ') : '');
// // //       } catch (err) {
// // //         console.error("Error fetching store name:", err);
// // //         setStore_Name('Indiranagar');
// // //       }
// // //     };
// // //     fetchStoreName();
// // //   }, [orderId, BaseUrl]);

// // //   const storeName = store_Name || 'Indiranagar';
// // //   const pickupCode = orderId?.slice(-4) || '';

// // //   useEffect(() => {
// // //     if (isComponentReady && !hasPrintedRef.current) {
// // //       const timer = setTimeout(() => {
// // //         window.print();
// // //         hasPrintedRef.current = true;
// // //       }, 400);
// // //       return () => clearTimeout(timer);
// // //     }
// // //   }, [isComponentReady]);

// // //   // Set ready after all data loads (including API fetch)
// // //   useEffect(() => {
// // //     if (orderId && productItems.length >= 0 && storeName && recieverName !== undefined) {
// // //       setIsComponentReady(true);
// // //     }
// // //   }, [orderId, productItems.length, storeName, recieverName]);

// // //   if (!orderId) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-white">
// // //         <div className="text-center">
// // //           <h2 className="text-xl font-semibold mb-4">No order provided</h2>
// // //           <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded">
// // //             Close
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //       {/* Normal Screen View (Preview) */}
// // //       <div className="screen-view min-h-screen bg-gray-50 flex items-center justify-center p-8">
// // //         <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
// // //           <div className="flex justify-between items-center mb-6 print:hidden">
// // //             <div>
// // //               <h1 className="text-2xl font-bold">Pickup QR</h1>
// // //               <p className="text-gray-600">Order #{orderId}</p>
// // //             </div>
// // //             <div className="space-x-4">
// // //               <button onClick={() => window.print()} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
// // //                 Print
// // //               </button>
// // //               <button onClick={() => window.close()} className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium">
// // //                 Close
// // //               </button>
// // //             </div>
// // //           </div>
// // //           <div className="text-center border-2 border-dashed border-gray-300 rounded-xl p-8">
// // //             <h2 className="text-xl font-bold mb-2">Priya Fresh Meats - {storeName}</h2>
// // //             <p className="text-gray-600 mb-6">Show this at pickup counter</p>
// // //             <QRCodeSVG // Fixed: Use QRCodeSVG
// // //               value={qrPayload}
// // //               size={340}
// // //               level="H"
// // //               className="mx-auto rounded-lg shadow-md"
// // //               style={{ display: 'block' }}
// // //             />
// // //             <div className="mt-8">
// // //               <div className="text-2xl font-mono font-bold">Order: {orderId}</div>
// // //               <div className="text-xl font-bold text-blue-600 mt-2">Pickup Code: {pickupCode}</div>
// // //             </div>
// // //             {productItems.length > 0 && (
// // //               <div className="mt-8 bg-gray-50 rounded-lg p-5 text-left">
// // //                 <h3 className="font-bold mb-3">Order Items</h3>
// // //                 {productItems.map((item) => (
// // //                   <div key={item.id} className="flex justify-between text-sm py-1">
// // //                     <span>{item.name} × {item.quantity}</span>
// // //                     <span className="font-medium">₹{item.total}</span>
// // //                   </div>
// // //                 ))}
// // //                 <div className="border-t pt-3 mt-4 font-bold flex justify-between">
// // //                   <span>Total</span>
// // //                   <span className="text-lg">₹{totalAmount}</span>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Print-Only Layout: Optimized for A4/Label Printing */}
// // //       <div className="print-only m-0 p-0">
// // //         <div className="label-content">
// // //           <div className="text-center p-4">
// // //             {/* Header Row: Logo + Store/Order Info */}
// // //             <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center mb-4 w-full">
// // //               <div className="flex-shrink-0">
// // //                 <img src={logo} alt="Logo" className="h-16 w-auto" />
// // //               </div>
// // //               <div className="flex-1 text-left">
// // //                 <h3 className="font-bold text-xl uppercase tracking-wide">Store: {storeName}</h3>
// // //                 <h3 className="font-bold text-lg">Order: {orderId}</h3>
// // //                 <h3 className="font-bold text-lg">Customer: {recieverName || 'N/A'}</h3>
// // //               </div>
// // //             </div>

// // //             {/* Content Row: QR + Items List */}
// // //             <div className="flex flex-col lg:flex-row gap-6 w-full">
// // //               <div className="flex-shrink-0 self-center">
// // //                 <QRCodeSVG // Fixed: Use QRCodeSVG
// // //                   value={qrPayload}
// // //                   size={280} // Slightly smaller for better label fit
// // //                   level="H"
// // //                   className="qr-code"
// // //                 />
// // //               </div>
// // //               <div className="flex-1">
// // //                 <h3 className="font-bold text-lg mb-3 text-left">Order Items</h3>
// // //                 {productItems.length > 0 ? (
// // //                   <div className="space-y-1">
// // //                     {productItems.map((item) => (
// // //                       <div key={item.id} className="flex justify-between text-base border-b border-gray-300 py-1 last:border-b-0">
// // //                         <span className="flex-1">{item.name}</span>
// // //                         <span className="text-right">× {item.quantity} {item.unit}</span>
// // //                       </div>
// // //                     ))}
// // //                     <div className="border-t mt-2 pt-2 font-bold text-lg flex justify-between">
// // //                       <span>Total</span>
// // //                       <span>₹{totalAmount}</span>
// // //                     </div>
// // //                   </div>
// // //                 ) : (
// // //                   <p className="text-sm text-gray-500">No items</p>
// // //                 )}
// // //               </div>
// // //             </div>

// // //             {/* Footer: Pickup Info */}
// // //             <div className="mt-4 pt-2 border-t border-gray-300 text-center text-sm">
// // //               <p>Pickup Code: {pickupCode}</p>
// // //               <p className="text-xs">Scan QR to confirm pickup</p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <style type="text/css">{`
// // //         .print-only {
// // //           display: none;
// // //         }
// // //         @media print {
// // //           @page {
// // //             size: A4 landscape; /* Changed: Landscape for better label fit */
// // //             margin: 0.25in;
// // //           }
// // //           body, html {
// // //             margin: 0;
// // //             padding: 0;
// // //             background: white;
// // //             print-color-adjust: exact;
// // //             -webkit-print-color-adjust: exact;
// // //             font-size: 11px; /* Base font for print */
// // //           }
// // //           .screen-view {
// // //             display: none !important;
// // //           }
// // //           .print-only {
// // //             display: block !important;
// // //           }
// // //           .label-content {
// // //             width: 100%;
// // //             max-width: 100%;
// // //             box-sizing: border-box;
// // //             font-family: 'Arial', sans-serif;
// // //             line-height: 1.3;
// // //           }
// // //           .qr-code {
// // //             width: 280px !important;
// // //             height: 280px !important;
// // //             display: block;
// // //             image-rendering: -webkit-optimize-contrast;
// // //             image-rendering: crisp-edges;
// // //           }
// // //           /* Ensure no overflow in print */
// // //           .print-only * {
// // //             word-break: break-word;
// // //             overflow-wrap: break-word;
// // //           }
// // //         }
// // //         @media print and (max-width: 8.5in) { /* For smaller printers */
// // //           @page {
// // //             size: A4 portrait;
// // //           }
// // //           .label-content > div {
// // //             flex-direction: column !important;
// // //           }
// // //         }
// // //       `}</style>
// // //     </>
// // //   );
// // // };

// // // export default PrintQR;

// // import axios from 'axios';
// // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // import { useParams, useSearchParams } from 'react-router-dom';
// // import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'; // Added: Both for screen (SVG scalable) and print (Canvas crisp)
// // import logo from "../assets/logo/logo.png";

// // type ProductItem = {
// //   id?: string;
// //   name?: string;
// //   quantity?: number;
// //   price?: number;
// //   total: number;
// //   unit?: string;
// // };

// // const PrintQR: React.FC = () => {
// //   const BaseUrl = import.meta.env.VITE_API_URL;
// //   const { orderId } = useParams<{ orderId: string }>();
// //   const [searchParams] = useSearchParams();
// //   const [isComponentReady, setIsComponentReady] = useState(false);
// //   const hasPrintedRef = useRef(false);
// //   const orderDetailsParam = searchParams.get('orderDetails');
// //   const [recieverName, setRecieverName] = useState<string>("");
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
// //       unit: item.unit || '',
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
// //       productIds: productItems.map(p => p.id),
// //       orderSummary: `Order #${id} - Ready for pickup`,
// //       totalItems: productItems.length,
// //       totalAmount,
// //     });
// //   }, [orderId, productItems, totalAmount]);

// //   const [store_Name, setStore_Name] = useState("");

// //   useEffect(() => {
// //     const fetchStoreName = async () => {
// //       if (!orderId) return;
// //       try {
// //         const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
// //         setStore_Name(data.storeName || 'Indiranagar');
// //         setRecieverName(typeof data.recieverName === 'string' ? data.recieverName : Array.isArray(data.recieverName) ? data.recieverName.join(', ') : '');
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
// //     if (isComponentReady && !hasPrintedRef.current) {
// //       const timer = setTimeout(() => {
// //         window.print();
// //         hasPrintedRef.current = true;
// //       }, 400);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [isComponentReady]);

// //   useEffect(() => {
// //     if (orderId && productItems.length >= 0 && storeName && recieverName !== undefined) {
// //       setIsComponentReady(true);
// //     }
// //   }, [orderId, productItems.length, storeName, recieverName]);

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
// //       {/* Normal Screen View (Preview) - Use SVG for scalability */}
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
// //             <h2 className="text-xl font-bold mb-2">Priya Fresh Meats - {storeName}</h2>
// //             <p className="text-gray-600 mb-6">Show this at pickup counter</p>
// //             <QRCodeSVG
// //               value={qrPayload}
// //               size={340}
// //               level="H"
// //               className="mx-auto rounded-lg shadow-md"
// //               style={{ display: 'block' }}
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

// //       {/* Print-Only Layout: Use Canvas for Crisp, High-Res Rendering */}
// //       <div className="print-only m-0 p-0">
// //         <div className="label-content">
// //           <div className="text-center p-4">
// //             {/* Header Row: Logo + Store/Order Info */}
// //             <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-4 w-full"> {/* Reduced gap for fit */}
// //               <div className="flex-shrink-0">
// //                 <img src={logo} alt="Logo" className="h-12 w-auto" /> {/* Slightly smaller logo */}
// //               </div>
// //               <div className="flex-1 text-left">
// //                 <h3 className="font-bold text-lg uppercase tracking-wide">Store: {storeName}</h3> {/* Smaller font */}
// //                 <h3 className="font-bold text-base">Order: {orderId}</h3>
// //                 <h3 className="font-bold text-base">Customer: {recieverName || 'N/A'}</h3>
// //               </div>
// //             </div>

// //             {/* Content Row: QR + Items List */}
// //             <div className="flex flex-col lg:flex-row gap-4 w-full"> {/* Reduced gap */}
// //               <div className="flex-shrink-0 self-center">
// //                 <QRCodeCanvas // Switched: Canvas for pixel-perfect, bold modules
// //                   value={qrPayload}
// //                   size={400} // Increased: Larger canvas for thicker modules (~19px per module)
// //                   level="M" // Balanced: Medium ECC for denser but still reliable QR
// //                   className="qr-code"
// //                   style={{ display: 'block' }}
// //                 />
// //               </div>
// //               <div className="flex-1 min-w-0"> {/* Added: min-w-0 to prevent overflow */}
// //                 <h3 className="font-bold text-base mb-2 text-left">Order Items</h3> {/* Smaller font */}
// //                 {productItems.length > 0 ? (
// //                   <div className="space-y-1">
// //                     {productItems.map((item, index) => (
// //                       <div key={item.id} className="flex justify-between text-sm border-b border-gray-300 py-0.5 last:border-b-0">
// //                         <span className="flex-1 truncate pr-2">{item.name}</span> {/* Added: truncate long names */}
// //                         <span className="text-right min-w-[80px]">× {item.quantity} {item.unit}</span>
// //                       </div>
// //                     ))}
// //                     <div className="border-t mt-1 pt-1 font-bold text-base flex justify-between">
// //                       <span>Total</span>
// //                       <span>₹{totalAmount}</span>
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <p className="text-xs text-gray-500">No items</p>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Footer: Pickup Info */}
// //             <div className="mt-2 pt-1 border-t border-gray-300 text-center text-xs"> {/* Smaller */}
// //               <p>Pickup Code: {pickupCode}</p>
// //               <p className="text-xxs">Scan QR to confirm pickup</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <style type="text/css">{`
// //         .print-only {
// //           display: none;
// //         }
// //         @media print {
// //           @page {
// //             size: A4 landscape;
// //             margin: 0.2in; /* Slightly smaller margin for fit */
// //           }
// //           body, html {
// //             margin: 0;
// //             padding: 0;
// //             background: white;
// //             print-color-adjust: exact;
// //             -webkit-print-color-adjust: exact;
// //             font-size: 10px; /* Smaller base for compact layout */
// //           }
// //           .screen-view {
// //             display: none !important;
// //           }
// //           .print-only {
// //             display: block !important;
// //           }
// //           .label-content {
// //             width: 100%;
// //             max-width: 100%;
// //             box-sizing: border-box;
// //             font-family: 'Arial', sans-serif;
// //             line-height: 1.2;
// //           }
// //           .qr-code {
// //             width: 300px !important; /* Display size: Scaled down from 400px canvas for fit, but high-res */
// //             height: 300px !important;
// //             display: block;
// //             image-rendering: pixelated !important; /* Crisp, no smoothing - makes modules bold/blocky */
// //             image-rendering: -webkit-optimize-contrast; /* Extra boldness on WebKit */
// //           }
// //           /* Ensure no overflow */
// //           .print-only * {
// //             word-break: break-word;
// //             overflow-wrap: break-word;
// //           }
// //           .text-xxs { font-size: 0.625rem; } /* Custom xs for footer */
// //         }
// //         @media print and (max-width: 8.5in) {
// //           @page {
// //             size: A4 portrait;
// //           }
// //           .label-content > div {
// //             flex-direction: column !important;
// //             gap: 2 !important;
// //           }
// //           .qr-code {
// //             width: 250px !important;
// //             height: 250px !important;
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
// import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
// import logo from "../assets/logo/logo.png";

// type ProductItem = {
//   id?: string;
//   name?: string;
//   quantity?: number;
//   price?: number;
//   total: number;
//   unit?: string;
// };

// const PrintQR: React.FC = () => {
//   const BaseUrl = import.meta.env.VITE_API_URL;
//   const { orderId } = useParams<{ orderId: string }>();
//   const [searchParams] = useSearchParams();
//   const [isComponentReady, setIsComponentReady] = useState(false);
//   const hasPrintedRef = useRef(false);
//   const orderDetailsParam = searchParams.get('orderDetails');
//   const [recieverName, setRecieverName] = useState<string>("");
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
//       unit: item.unit || '',
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
//       productIds: productItems.map(p => p.id),
//       orderSummary: `Order #${id} - Ready for pickup`,
//       totalItems: productItems.length,
//       totalAmount,
//     });
//   }, [orderId, productItems, totalAmount]);

//   const [store_Name, setStore_Name] = useState("");

//   useEffect(() => {
//     const fetchStoreName = async () => {
//       if (!orderId) return;
//       try {
//         const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
//         setStore_Name(data.storeName || 'Indiranagar');
//         setRecieverName(typeof data.recieverName === 'string' ? data.recieverName : Array.isArray(data.recieverName) ? data.recieverName.join(', ') : '');
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
//     if (isComponentReady && !hasPrintedRef.current) {
//       const timer = setTimeout(() => {
//         window.print();
//         hasPrintedRef.current = true;
//       }, 400);
//       return () => clearTimeout(timer);
//     }
//   }, [isComponentReady]);

//   useEffect(() => {
//     if (orderId && productItems.length >= 0 && storeName && recieverName !== undefined) {
//       setIsComponentReady(true);
//     }
//   }, [orderId, productItems.length, storeName, recieverName]);

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
//       {/* Normal Screen View (Preview) - Use SVG for scalability */}
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
//             <h2 className="text-xl font-bold mb-2">Priya Fresh Meats - {storeName}</h2>
//             <p className="text-gray-600 mb-6">Show this at pickup counter</p>
//             <QRCodeSVG
//               value={qrPayload}
//               size={340}
//               level="H"
//               className="mx-auto rounded-lg shadow-md"
//               style={{ display: 'block' }}
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

//       {/* Print-Only Layout: Use Canvas for Deeper, Bolder Lines */}
//       <div className="print-only m-0 p-0">
//         <div className="label-content">
//           <div className="text-center p-4">
//             {/* Header Row: Logo + Store/Order Info */}
//             <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center mb-3 w-full"> {/* Further reduced gap */}
//               <div className="flex-shrink-0">
//                 <img src={logo} alt="Logo" className="h-10 w-auto" /> {/* Smaller logo for space */}
//               </div>
//               <div className="flex-1 text-left">
//                 <h3 className="font-bold text-base uppercase tracking-wide">Store: {storeName}</h3> {/* Smaller */}
//                 <h3 className="font-bold text-sm">Order: {orderId}</h3>
//                 <h3 className="font-bold text-sm">Customer: {recieverName || 'N/A'}</h3>
//               </div>
//             </div>

//             {/* Content Row: QR + Items List */}
//             <div className="flex flex-col lg:flex-row gap-3 w-full"> {/* Reduced gap */}
//               <div className="flex-shrink-0 self-center">
//                 <QRCodeCanvas // Canvas for bold rendering
//                   value={qrPayload}
//                   size={600} // Increased: Even higher res (600px) for ~23px thick modules when scaled
//                   level="L" // Low ECC: Larger modules (less dense, bolder lines)
//                   className="qr-code"
//                   style={{ display: 'block' }}
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-bold text-sm mb-1 text-left">Order Items</h3> {/* Smaller */}
//                 {productItems.length > 0 ? (
//                   <div className="space-y-0.5"> {/* Tighter spacing */}
//                     {productItems.map((item, index) => (
//                       <div key={item.id} className="flex justify-between text-xs border-b border-gray-300 py-0.25 last:border-b-0">
//                         <span className="flex-1 truncate pr-1">{item.name}</span>
//                         <span className="text-right min-w-[60px]">× {item.quantity} {item.unit}</span>
//                       </div>
//                     ))}
//                     <div className="border-t mt-1 pt-1 font-bold text-sm flex justify-between">
//                       <span>Total</span>
//                       <span>₹{totalAmount}</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-xs text-gray-500">No items</p>
//                 )}
//               </div>
//             </div>

//             {/* Footer: Pickup Info */}
//             <div className="mt-1 pt-0.5 border-t border-gray-300 text-center text-xs"> {/* Tighter */}
//               <p>Pickup Code: {pickupCode}</p>
//               <p className="text-[10px]">Scan QR to confirm pickup</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style type="text/css">{`
//         .print-only {
//           display: none;
//         }
//         @media print {
//           @page {
//             size: A4 landscape;
//             margin: 0.15in; /* Minimal margin for max space */
//           }
//           body, html {
//             margin: 0;
//             padding: 0;
//             background: white;
//             print-color-adjust: exact;
//             -webkit-print-color-adjust: exact;
//             font-size: 9px; /* Even smaller base */
//           }
//           .screen-view {
//             display: none !important;
//           }
//           .print-only {
//             display: block !important;
//           }
//           .label-content {
//             width: 100%;
//             max-width: 100%;
//             box-sizing: border-box;
//             font-family: 'Arial', sans-serif;
//             line-height: 1.1; /* Tighter line height */
//           }
//           .qr-code {
//             width: 280px !important; /* Display: Scaled for fit, but high-res source = deep lines */
//             height: 280px !important;
//             display: block;
//             image-rendering: pixelated !important; /* Bold, no blur */
//             image-rendering: -webkit-optimize-contrast !important; /* Deeper contrast */
//             -webkit-font-smoothing: none; /* No smoothing */
//           }
//           /* No overflow */
//           .print-only * {
//             word-break: break-word;
//             overflow-wrap: break-word;
//           }
//         }
//         @media print and (max-width: 8.5in) {
//           @page {
//             size: A4 portrait;
//           }
//           .label-content > div {
//             flex-direction: column !important;
//             gap: 1 !important;
//           }
//           .qr-code {
//             width: 220px !important;
//             height: 220px !important;
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
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import logo from "../assets/logo/logo.png";

type ProductItem = {
  id?: string;
  name?: string;
  quantity?: number;
  price?: number;
  total: number;
  unit?: string;
};

const PrintQR: React.FC = () => {
  const BaseUrl = import.meta.env.VITE_API_URL;
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const [isComponentReady, setIsComponentReady] = useState(false);
  const hasPrintedRef = useRef(false);
  const orderDetailsParam = searchParams.get('orderDetails');
  const [recieverName, setRecieverName] = useState<string>("");
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
      unit: item.unit || '',
    }));
  }, [orderDetails]);

  const totalAmount = useMemo(() => {
    return productItems.reduce((sum, item) => sum + item.total, 0);
  }, [productItems]);

  // Simplified payload for lower QR version (larger modules/corners)
  const qrPayload = useMemo(() => {
    const id = orderId || '';
    return JSON.stringify({
      orderId: id,
      pickupCode: id.slice(-4),
      url: `https://priyafreshmeats.com/pickup/${id}`, // Minimal: Removed extras for smaller data → bigger corners
      store: 'Priya Chicken',
      action: 'confirm-pickup',
    });
  }, [orderId]);

  const [store_Name, setStore_Name] = useState("");

  useEffect(() => {
    const fetchStoreName = async () => {
      if (!orderId) return;
      try {
        const { data } = await axios.get(`${BaseUrl}/store/print-manager-name/${orderId}`);
        setStore_Name(data.storeName || 'Indiranagar');
        setRecieverName(typeof data.recieverName === 'string' ? data.recieverName : Array.isArray(data.recieverName) ? data.recieverName.join(', ') : '');
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
    if (isComponentReady && !hasPrintedRef.current) {
      const timer = setTimeout(() => {
        window.print();
        hasPrintedRef.current = true;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isComponentReady]);

  useEffect(() => {
    if (orderId && storeName && recieverName !== undefined) {
      setIsComponentReady(true);
    }
  }, [orderId, storeName, recieverName]);

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
      {/* Normal Screen View (Preview) - Use SVG for scalability */}
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
            <QRCodeSVG
              value={qrPayload}
              size={340}
              level="H"
              className="mx-auto rounded-lg shadow-md"
              style={{ display: 'block' }}
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

      {/* Print-Only Layout: Use Canvas for Deeper, Bigger Corner Boxes */}
      <div className="print-only m-0 p-0">
        <div className="label-content">
          <div className="text-center p-3"> {/* Tighter padding */}
            {/* Header Row: Logo + Store/Order Info */}
            <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center mb-2 w-full"> {/* Minimal gap */}
              <div className="flex-shrink-0">
                <img src={logo} alt="Logo" className="h-8 w-auto" /> {/* Even smaller logo */}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-sm uppercase tracking-wide">Store: {storeName}</h3>
                <h3 className="font-bold text-xs">Order: {orderId}</h3>
                <h3 className="font-bold text-xs">Customer: {recieverName || 'N/A'}</h3>
              </div>
            </div>

            {/* Content Row: QR + Items List */}
            <div className="flex flex-col lg:flex-row gap-2 w-full"> {/* Minimal gap */}
              <div className="flex-shrink-0 self-center">
                <QRCodeCanvas // Canvas for bold rendering
                  value={qrPayload}
                  size={800} // Increased: Ultra high-res (800px) for ~30px thick modules/corners
                  level="L" // Low ECC: Maximizes module size (bigger corners)
                  className="qr-code"
                  style={{ display: 'block' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs mb-1 text-left">Order Items</h3>
                {productItems.length > 0 ? (
                  <div className="space-y-0.25"> {/* Very tight */}
                    {productItems.map((item, index) => (
                      <div key={item.id} className="flex justify-between text-[10px] border-b border-gray-300 py-0.25 last:border-b-0">
                        <span className="flex-1 truncate pr-1">{item.name}</span>
                        <span className="text-right min-w-[50px]">× {item.quantity} {item.unit}</span>
                      </div>
                    ))}
                    <div className="border-t mt-0.5 pt-0.5 font-bold text-xs flex justify-between">
                      <span>Total</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[9px] text-gray-500">No items</p>
                )}
              </div>
            </div>

            {/* Footer: Pickup Info */}
            <div className="mt-1 pt-0.25 border-t border-gray-300 text-center text-[9px]"> {/* Tiny */}
              <p>Pickup Code: {pickupCode}</p>
              <p className="text-[8px]">Scan QR to confirm pickup</p>
            </div>
          </div>
        </div>
      </div>

      <style type="text/css">{`
        .print-only {
          display: none;
        }
        @media print {
          @page {
            size: A4 landscape;
            margin: 0.1in; /* Minimal margin */
          }
          body, html {
            margin: 0;
            padding: 0;
            background: white;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            font-size: 8px; /* Tiny base for ultra-compact */}
          }
          .screen-view {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .label-content {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
            line-height: 1.0; /* Ultra tight */
          }
          .qr-code {
            width: 300px !important; /* Display: Larger display size for bigger corners */
            height: 300px !important;
            display: block;
            image-rendering: pixelated !important;
            image-rendering: -webkit-optimize-contrast !important;
            -webkit-font-smoothing: none;
            filter: contrast(1.2) brightness(0.9); /* Deeper black for lines/corners */
          }
          /* No overflow */
          .print-only * {
            word-break: break-word;
            overflow-wrap: break-word;
          }
        }
        @media print and (max-width: 8.5in) {
          @page {
            size: A4 portrait;
          }
          .label-content > div {
            flex-direction: column !important;
            gap: 0.5 !important;
          }
          .qr-code {
            width: 250px !important;
            height: 250px !important;
          }
        }
      `}</style>
    </>
  );
};

export default PrintQR;
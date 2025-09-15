import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

// A lightweight print page that renders a QR via a public QR image API
// and auto-triggers the print dialog when the image is ready.

const PrintQR: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const hasPrintedRef = useRef(false);

  // Get orderDetails from query parameters
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

  // Extract product IDs from orderDetails
  const productIds = useMemo(() => {
    return orderDetails.map((item: any) => ({
      id: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));
  }, [orderDetails]);

  const qrPayload = useMemo(() => {
    const id = orderId || '';
    const payload = {
      orderId: id,
      pickupCode: id.slice(-4),
      timestamp: new Date().toISOString(),
      store: 'Priya Chicken - Indiranagar',
      action: 'confirm-pickup',
      url: `https://priyafreshmeats.com/pickup/${id}`,
      // Include product IDs for better identification
      productIds: productIds,
      orderSummary: `Order #${id} - Ready for pickup`,
      totalItems: productIds.length,
      totalAmount: productIds.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    };
    return JSON.stringify(payload);
  }, [orderId, productIds]);

  const qrImageUrl = useMemo(() => {
    // Using a public QR generation API to avoid extra dependencies
    // size parameter can be adjusted for print clarity
    const size = 512; // large for print
    const encoded = encodeURIComponent(qrPayload);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
  }, [qrPayload]);

  useEffect(() => {
    if (isImageLoaded && !hasPrintedRef.current) {
      // Delay slightly to ensure layout is complete
      const t = setTimeout(() => {
        window.print();
        hasPrintedRef.current = true;
      }, 150);
      return () => clearTimeout(t);
    }
  }, [isImageLoaded]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">No order provided</div>
          <button
            onClick={() => window.close()}
            className="mt-2 px-4 py-2 bg-gray-800 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div>
            <div className="text-2xl font-bold">Pickup QR</div>
            <div className="text-gray-600">Order #{orderId}</div>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Print
            </button>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-gray-800 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Priya Chicken - Indiranagar</div>
            <div className="text-sm text-gray-600 mb-6">Show this at pickup counter</div>
            <img
              src={qrImageUrl}
              alt={`QR for Order ${orderId}`}
              className="mx-auto w-[320px] h-[320px] md:w-[384px] md:h-[384px]"
              onLoad={() => setIsImageLoaded(true)}
            />
            <div className="mt-6">
              <div className="font-mono text-xl">Order: {orderId}</div>
              <div className="text-gray-700">Pickup Code: {orderId.slice(-4)}</div>
              
              {/* Display product information */}
              {productIds.length > 0 && (
                <div className="mt-4 text-left">
                  <div className="text-sm font-semibold text-gray-800 mb-2">Products:</div>
                  <div className="space-y-1">
                    {productIds.map((product: any, index: number) => (
                      <div key={product.id} className="text-xs text-gray-600 flex justify-between">
                        <span>{product.name} (Qty: {product.quantity})</span>
                        <span className="font-mono">₹{product.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-800 flex justify-between">
                      <span>Total Items: {productIds.length}</span>
                      <span>Total: ₹{productIds.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media print {
            .print\\:hidden { display: none !important; }
            body, html { background: #ffffff; }
          }
        `}
      </style>
    </div>
  );
};

export default PrintQR;

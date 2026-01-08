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
      <div className="print-only hidden print:block  "
      >
        <div className="flex flex-col justify-start items-center border w-[30rem] ">


          <img
            src={logo}
            alt="Store Logo"
            className="h-[4.5rem] object-contain"
          />
          <h3 className="text-xl font-bold mb-3 text-center">
            Store Name : {order?.store?.name ?? "Store"}
          </h3>

          <p className="text-xs font-mono text-gray-600">
            Order ID: #{order.orderId}
          </p>
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

          <QRCodeView value={qrPayload} size={150} type="canvas" />

          {/* ==================== */}
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
                {" "}
                <span className="font-semibold text-gray-700">
                  {totalQty}
                </span>
              </div>
            );
          })}
        </div>


      </div>




    </>
  );
};

export default PrintQR;
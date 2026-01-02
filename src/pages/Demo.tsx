import React, { useState } from "react";

/* ================= TYPES ================= */

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface InitiateResponse {
    success: boolean;
    message?: string;
    razorpayOrderId: string;
    paymentId: string;
    amount: number;
    currency: string;
    razorpayKeyId: string;
}

interface VerifyResponse {
    success: boolean;
    message: string;
    data?: {
        paymentId: string;
        orderId: string;
        order: any;
    };
}

interface CheckStatusResponse {
    success: boolean;
    message?: string;
    data: {
        paymentStatus: string;
        isFulfilled: boolean;
        orderId: string | null;
        razorpayPaymentId: string | null;
    };
}

/* ================= ORDER DATA FORM ================= */

interface OrderFormData {
    recieverName: string;
    phone: string;
    location: string;
    houseNo: string;
    pincode: string;
    latitude: number;
    longitude: number;
    deleveyFor: string;
    walletPoint: number;
    couponsId: string;
    totalAmount: number;
}

/* ================= COMPONENT ================= */

const RazorpayTest: React.FC = () => {
    // User ID (should come from auth context in real app)
    const [userId, setUserId] = useState<string>("");

    // Order form data
    const [formData, setFormData] = useState<OrderFormData>({
        recieverName: "John Doe",
        phone: "9876543210",
        location: "123, Main Street, Hyderabad",
        houseNo: "123",
        pincode: "500001",
        latitude: 17.385044,
        longitude: 78.486671,
        deleveyFor: "self",
        walletPoint: 0,
        couponsId: "",
        totalAmount: 500,
    });

    // State
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [razorpayOrderId, setRazorpayOrderId] = useState<string>("");
    const [statusData, setStatusData] = useState<CheckStatusResponse["data"] | null>(null);
    const [accessToken, setAccessToken] = useState<string>("");

    const BASE_URL = "http://localhost:8000";

    /* ================= HELPERS ================= */

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: ["latitude", "longitude", "walletPoint", "totalAmount"].includes(name)
                ? Number(value)
                : value,
        }));
    };

    /* ================= 1. INITIATE PAYMENT ================= */

    const handleInitiatePayment = async () => {
        if (!userId.trim()) {
            setMessage("❌ Please enter User ID");
            return;
        }

        if (!accessToken.trim()) {
            setMessage("❌ Please enter Access Token (JWT)");
            return;
        }

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            setMessage("❌ Razorpay SDK failed to load");
            return;
        }

        setLoading(true);
        setMessage("🔄 Initiating payment...");

        try {
            const response = await fetch(`${BASE_URL}/payments/initiate/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    ...formData,
                    couponsId: formData.couponsId || null,
                }),
            });

            const data: InitiateResponse = await response.json();

            if (!data.success) {
                setMessage(`❌ ${data.message || "Payment initiation failed"}`);
                setLoading(false);
                return;
            }

            setRazorpayOrderId(data.razorpayOrderId);
            setMessage(`✅ Payment initiated! Razorpay Order: ${data.razorpayOrderId}`);

            // Open Razorpay Checkout
            const options = {
                key: data.razorpayKeyId,
                amount: data.amount,
                currency: data.currency,
                order_id: data.razorpayOrderId,
                name: "Priya Fresh Meats",
                description: "Order Payment",
                handler: async (response: RazorpayResponse) => {
                    await handleVerifyPayment(response);
                },
                prefill: {
                    name: formData.recieverName,
                    contact: formData.phone,
                },
                theme: {
                    color: "#E53935",
                },
                modal: {
                    ondismiss: () => {
                        setMessage("❌ Payment cancelled by user");
                        setLoading(false);
                    },
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error("Initiate Error:", error);
            setMessage("❌ Error initiating payment");
            setLoading(false);
        }
    };

    /* ================= 2. VERIFY PAYMENT ================= */

    const handleVerifyPayment = async (response: RazorpayResponse) => {
        setMessage("🔄 Verifying payment...");

        try {
            const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(response),
            });

            const data: VerifyResponse = await verifyRes.json();

            if (data.success) {
                setMessage(`✅ ${data.message} | Order ID: ${data.data?.orderId || "N/A"}`);
                // Auto-check status
                await handleCheckStatus();
            } else {
                setMessage(`❌ ${data.message || "Verification failed"}`);
            }

        } catch (error) {
            console.error("Verify Error:", error);
            setMessage("❌ Error verifying payment");
        } finally {
            setLoading(false);
        }
    };

    /* ================= 3. CHECK STATUS ================= */

    const handleCheckStatus = async () => {
        if (!razorpayOrderId.trim()) {
            setMessage("❌ No Razorpay Order ID. Please initiate payment first.");
            return;
        }

        setMessage("🔄 Checking payment status...");

        try {
            const response = await fetch(`${BASE_URL}/payments/check/${razorpayOrderId}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            const data: CheckStatusResponse = await response.json();

            if (data.success) {
                setStatusData(data.data);
                setMessage(`✅ Status: ${data.data.paymentStatus} | Fulfilled: ${data.data.isFulfilled ? "Yes" : "No"}`);
            } else {
                setMessage(`❌ ${data.message || "Status check failed"}`);
            }

        } catch (error) {
            console.error("Status Error:", error);
            setMessage("❌ Error checking status");
        }
    };

    /* ================= UI ================= */

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ color: "#E53935", marginBottom: "1rem" }}>🧪 Razorpay Payment Test</h1>
            <p style={{ color: "#666", marginBottom: "2rem" }}>
                Test the new Razorpay payment flow with order data.
            </p>

            {/* Auth Section */}
            <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: "0 0 1rem 0" }}>🔐 Authentication</h3>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                    <input
                        type="text"
                        placeholder="User ID (MongoDB ObjectId)"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="text"
                        placeholder="Access Token (JWT from login)"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
            </div>

            {/* Order Details Form */}
            <div style={{ background: "#e3f2fd", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: "0 0 1rem 0" }}>📦 Order Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <input name="recieverName" placeholder="Receiver Name" value={formData.recieverName} onChange={handleInputChange} style={inputStyle} />
                    <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} />
                    <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
                    <input name="houseNo" placeholder="House No" value={formData.houseNo} onChange={handleInputChange} style={inputStyle} />
                    <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} style={inputStyle} />
                    <input name="latitude" type="number" placeholder="Latitude" value={formData.latitude} onChange={handleInputChange} style={inputStyle} />
                    <input name="longitude" type="number" placeholder="Longitude" value={formData.longitude} onChange={handleInputChange} style={inputStyle} />
                    <select name="deleveyFor" value={formData.deleveyFor} onChange={handleInputChange} style={inputStyle}>
                        <option value="self">Self</option>
                        <option value="other">Other</option>
                    </select>
                    <input name="walletPoint" type="number" placeholder="Wallet Points" value={formData.walletPoint} onChange={handleInputChange} style={inputStyle} />
                    <input name="couponsId" placeholder="Coupon ID (optional)" value={formData.couponsId} onChange={handleInputChange} style={inputStyle} />
                    <input name="totalAmount" type="number" placeholder="Total Amount (₹)" value={formData.totalAmount} onChange={handleInputChange} style={{ ...inputStyle, fontWeight: "bold" }} />
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                <button
                    onClick={handleInitiatePayment}
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        background: "#E53935",
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? "⏳ Processing..." : "1️⃣ Initiate & Pay"}
                </button>
                <button
                    onClick={handleCheckStatus}
                    disabled={!razorpayOrderId}
                    style={{
                        ...buttonStyle,
                        background: razorpayOrderId ? "#2196F3" : "#ccc",
                    }}
                >
                    2️⃣ Check Status
                </button>
            </div>

            {/* Message */}
            {message && (
                <div style={{
                    padding: "1rem",
                    borderRadius: "8px",
                    background: message.includes("✅") ? "#e8f5e9" : message.includes("❌") ? "#ffebee" : "#fff3e0",
                    marginBottom: "1rem",
                }}>
                    <strong>{message}</strong>
                </div>
            )}

            {/* Razorpay Order ID */}
            {razorpayOrderId && (
                <div style={{ padding: "0.5rem", background: "#f0f0f0", borderRadius: "4px", marginBottom: "1rem" }}>
                    <strong>Razorpay Order ID:</strong> <code>{razorpayOrderId}</code>
                </div>
            )}

            {/* Status Data */}
            {statusData && (
                <div style={{ padding: "1rem", background: "#e8f5e9", borderRadius: "8px" }}>
                    <h4 style={{ margin: "0 0 0.5rem 0" }}>📊 Payment Status</h4>
                    <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                        <li><strong>Status:</strong> {statusData.paymentStatus}</li>
                        <li><strong>Fulfilled:</strong> {statusData.isFulfilled ? "Yes ✅" : "No ❌"}</li>
                        <li><strong>Order ID:</strong> {statusData.orderId || "N/A"}</li>
                        <li><strong>Razorpay Payment ID:</strong> {statusData.razorpayPaymentId || "N/A"}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

/* ================= STYLES ================= */

const inputStyle: React.CSSProperties = {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
};

export default RazorpayTest;
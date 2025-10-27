import React, { useState } from "react";

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

const RazorpayTest: React.FC = () => {
    const [amount, setAmount] = useState<number>(100); // default amount in INR
    const [customerId, setCustomerId] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!customerId) {
            alert("Please enter Customer ID");
            return;
        }

        const res = await loadRazorpayScript();
        if (!res) {
            alert("Razorpay SDK failed to load");
            return;
        }

        try {
            // 1️⃣ Call backend to create Razorpay order
            const response = await fetch("http://localhost:8000/payments/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, id: customerId }),
            });

            const data = await response.json();

            if (!data.success) {
                setMessage("Payment initiation failed");
                return;
            }

            // 2️⃣ Open Razorpay checkout
            const options: any = {
                key: "rzp_test_R9sbSkX4NbwNms", // Replace with your key
                amount: data.amount,
                currency: data.currency,
                name: "Test Company",
                description: "Test Payment",
                order_id: data.orderId,
                handler: async function (response: RazorpayResponse) {
                    // 3️⃣ Send payment details to backend for verification
                    const verifyRes = await fetch("http://localhost:8000/payments/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    const verifyData = await verifyRes.json();
                    setMessage(verifyData.message || "Payment completed!");
                },
                prefill: {
                    name: "John Doe",
                    email: "john@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Razorpay Test Page</h2>
            <input
                type="text"
                placeholder="Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
            />
            <br />
            <input
                type="number"
                placeholder="Amount in INR"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
            />
            <br />
            <button onClick={handlePayment} style={{ padding: "0.5rem 1rem" }}>
                Pay Now
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RazorpayTest;

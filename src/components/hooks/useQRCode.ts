import { useMemo, useState } from "react"; // Added useState for future-proofing

export const useQRCode = (orderId?: string) => {
    const [loading, setLoading] = useState(false); // Placeholder for async validation
    const [error, setError] = useState<string | null>(null);

    const pickupCode = useMemo(
        () => orderId?.slice(-4) || "",
        [orderId]
    );

    const qrPayload = useMemo(() => {
        if (!orderId) return "";

        // Simulate async validation (remove if not needed)
        if (loading) return "";

        try {
            return JSON.stringify({
                orderId,
                pickupCode,
                url: `https://priyafreshmeats.com/pickup/${orderId}`,
                action: "confirm-pickup",
                timestamp: new Date().toISOString(), // Added: for audit trail
            });
        } catch (err) {
            setError("Invalid order data");
            return "";
        }
    }, [orderId, pickupCode, loading]);

    return {
        qrPayload,
        pickupCode,
        loading,
        error,
    };
};
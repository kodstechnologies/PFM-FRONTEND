import React, { useEffect, useState } from "react";
import { callApi } from "../../../util/admin_api";
// import callApi from "../../../util/admin_api";

const DeliveryChargesForm = () => {
    const [deliveryCharges, setDeliveryCharges] = useState(0);
    const [handlingCharges, setHandlingCharges] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    /* ================= FETCH EXISTING CHARGES ================= */
    useEffect(() => {
        let mounted = true;

        const fetchCharges = async () => {
            try {
                const res = await callApi({
                    endpoint: "/admin/delivery-charges",
                    method: "GET",
                });

                if (mounted && res?.success && res?.data) {
                    setDeliveryCharges(res.data.deliveryCharges ?? 0);
                    setHandlingCharges(res.data.handlingCharges ?? 0);
                }
            } catch (err: any) {
                console.error("Failed to load delivery charges", err);
                if (mounted) {
                    setError(
                        err?.response?.data?.message ||
                        err?.message ||
                        "Could not load current charges"
                    );
                }
            }
        };

        fetchCharges();
        return () => {
            mounted = false;
        };
    }, []);

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            await callApi({
                endpoint: "/admin/delivery-charges",
                method: "POST",
                data: {
                    deliveryCharges,
                    handlingCharges,
                },
            });

            setMessage("Delivery & handling charges updated successfully ✅");
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to save charges"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
                Delivery & Handling Charges
            </h2>

            {message && (
                <p className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded">
                    {message}
                </p>
            )}

            {error && (
                <p className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Delivery Charges (₹)
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={deliveryCharges}
                        onChange={(e) =>
                            setDeliveryCharges(Number(e.target.value) || 0)
                        }
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Handling Charges (₹)
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={handlingCharges}
                        onChange={(e) =>
                            setHandlingCharges(Number(e.target.value) || 0)
                        }
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white font-medium
                        ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                >
                    {loading ? "Saving..." : "Save Charges"}
                </button>
            </form>
        </div>
    );
};

export default DeliveryChargesForm;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMarquee: React.FC = () => {
    const [heading, setHeading] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate(); // ✅ add

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!heading.trim()) {
            setMessage("Heading is required");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            await axios.post(`${BASE_URL}/marquee`, {
                heading: heading.trim(),
            });

            // ✅ success → redirect
            navigate("/text");
        } catch (error: any) {
            setMessage(
                error?.response?.data?.message || "Failed to create marquee"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded space-y-4">
            <h2 className="text-lg font-semibold">Add Marquee</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    rows={3}
                    placeholder="Enter marquee text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    className="w-full border rounded p-2"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Add Marquee"}
                </button>
            </form>

            {message && (
                <p className="text-sm text-center text-red-500">
                    {message}
                </p>
            )}
        </div>
    );
};

export default AddMarquee;

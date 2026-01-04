import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTime: React.FC = () => {
    const [displayMinutes, setDisplayMinutes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!displayMinutes.trim()) {
            setError("Time is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await axios.post(`${BASE_URL}/time`, {
                displayMinutes: displayMinutes.trim(),
            });

            // ✅ Redirect after success
            navigate("/time");
        } catch (err: any) {
            setError(
                err?.response?.data?.message || "Failed to create time"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded space-y-4">
            <h2 className="text-lg font-semibold">Add Time</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Enter time (e.g. 10 mins)"
                    value={displayMinutes}
                    onChange={(e) => setDisplayMinutes(e.target.value)}
                    className="w-full border rounded p-2"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Add Time"}
                </button>
            </form>

            {error && (
                <p className="text-sm text-center text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AddTime;

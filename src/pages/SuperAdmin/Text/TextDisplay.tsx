import React, { useEffect, useState } from "react";
import axios from "axios";

/* ================= TYPES ================= */

interface MarqueeData {
    _id?: string;
    heading: string;
}

/* ================= COMPONENT ================= */

const TextDisplay: React.FC = () => {
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const BASE_URL = import.meta.env.VITE_API_URL;

    /* ================= FETCH ================= */

    const fetchText = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.get(`${BASE_URL}/marquee`);
            const data = res.data?.data;

            // ✅ If no data, show empty
            if (!data || data === "") {
                setText("");
            } else {
                setText(data.heading || "");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load text");
        } finally {
            setLoading(false);
        }
    };

    /* ================= INIT ================= */

    useEffect(() => {
        fetchText();
    }, []);

    /* ================= UI ================= */

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 text-gray-900 text-lg font-medium">
            {text || "No data found"}
        </div>
    );
};

export default TextDisplay;

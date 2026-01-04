// import React, { useEffect, useState } from "react";
// import axios from "axios";

// /* ================= TYPES ================= */

// interface TimeData {
//   _id?: string;
//   displayMinutes?: string;
// }

// /* ================= COMPONENT ================= */

// const TimeDisplay: React.FC = () => {
//   const [timeText, setTimeText] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const BASE_URL = import.meta.env.VITE_API_URL;

//   /* ================= FETCH ================= */

//   const fetchTime = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await axios.get(`${BASE_URL}/time`);
//       const data = res.data?.data;

//       // ✅ No data case
//       if (!data || data === "") {
//         setTimeText("");
//       } else {
//         setTimeText(data.displayMinutes || "");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load time");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= INIT ================= */

//   useEffect(() => {
//     fetchTime();
//   }, []);

//   /* ================= UI ================= */

//   if (loading) {
//     return <div className="p-4">Loading...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="p-4 text-lg font-medium text-gray-900">
//       {timeText || "No time available"}
//     </div>
//   );
// };

// export default TimeDisplay;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

interface TimeData {
  _id?: string;
  displayMinutes?: string;
}

/* ================= COMPONENT ================= */

const TimeDisplay: React.FC = () => {
  const [timeText, setTimeText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // ✅ for redirect

  /* ================= FETCH ================= */

  const fetchTime = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${BASE_URL}/time`);
      const data = res.data?.data;

      if (!data || data === "") {
        setTimeText("");
      } else {
        setTimeText(data.displayMinutes || "");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load time");
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    fetchTime();
  }, []);

  /* ================= UI ================= */

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {/* 🔹 Redirect Button */}
      <div className="text-right">
        <button
          onClick={() => navigate("/add/time")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Time
        </button>
      </div>

      {/* 🔹 Time Display */}
      <div className="text-lg font-medium text-gray-900">
        {timeText || "No time available"}
      </div>
    </div>
  );
};

export default TimeDisplay;

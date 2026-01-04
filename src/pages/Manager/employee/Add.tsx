// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { API_CONFIG } from "../../../config/api.config";

// const AddEmployee: React.FC = () => {
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [role, setRole] = useState("MANAGER");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const navigate = useNavigate();

//     // ✅ Store ID (can be dynamic later)
//     const storedUser = localStorage.getItem("managerUser");
//     const storeId = storedUser ? JSON.parse(storedUser)?.storeId : null;
//     console.log("🚀 ~ ViewEmployee ~ storeId:", storeId)

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!firstName || !phone || !role) {
//             setError("Required fields are missing");
//             return;
//         }

//         try {
//             setLoading(true);
//             setError("");

//             await axios.post(
//                 `${API_CONFIG.BASE_URL}/employee`,
//                 {
//                     firstName: firstName.trim(),
//                     lastName: lastName.trim(),
//                     phone: phone.trim(),
//                     role,
//                     storeId, // ✅ FIX: storeId sent
//                 },

//             );

//             // ✅ Success → redirect
//             navigate("/manager/employee");
//         } catch (err: any) {
//             setError(
//                 err?.response?.data?.message || "Failed to add employee"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto p-4 border rounded space-y-4">
//             <h2 className="text-lg font-semibold">Add Employee</h2>

//             <form onSubmit={handleSubmit} className="space-y-3">
//                 <input
//                     type="text"
//                     placeholder="First Name"
//                     value={firstName}
//                     onChange={(e) => setFirstName(e.target.value)}
//                     className="w-full border p-2 rounded"
//                 />

//                 <input
//                     type="text"
//                     placeholder="Last Name"
//                     value={lastName}
//                     onChange={(e) => setLastName(e.target.value)}
//                     className="w-full border p-2 rounded"
//                 />

//                 <input
//                     type="text"
//                     placeholder="Phone"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="w-full border p-2 rounded"
//                 />

//                 <select
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     className="w-full border p-2 rounded"
//                 >
//                     {/* <option value="MANAGER">MANAGER</option> */}
//                     <option value="BUTCHER">BUTCHER</option>
//                 </select>

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//                 >
//                     {loading ? "Saving..." : "Add Employee"}
//                 </button>
//             </form>

//             {error && (
//                 <p className="text-sm text-center text-red-500">
//                     {error}
//                 </p>
//             )}
//         </div>
//     );
// };

// export default AddEmployee;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../../config/api.config";

const AddEmployee: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("BUTCHER");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // ✅ Store ID (can be dynamic later)
    const storedUser = localStorage.getItem("managerUser");
    const storeId = storedUser ? JSON.parse(storedUser)?.storeId : null;
    console.log("🚀 ~ ViewEmployee ~ storeId:", storeId)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !phone || !role) {
            setError("Required fields are missing");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await axios.post(
                `${API_CONFIG.BASE_URL}/employee`,
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    phone: phone.trim(),
                    role,
                    storeId, // ✅ FIX: storeId sent
                },
            );

            // ✅ Success → redirect
            navigate("/manager/employee");
        } catch (err: any) {
            setError(
                err?.response?.data?.message || "Failed to add employee"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50  flex items-center justify-center">
            <div className="max-w-md w-full mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200 space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
                    <p className="text-sm text-gray-500">Fill in the details to onboard a new team member.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number (e.g., +1 123-456-7890)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role *
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
                        >
                            {/* <option value="MANAGER">Manager</option> */}
                            <option value="BUTCHER">Butcher</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Employee</span>
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700 text-center">
                            {error}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddEmployee;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// /* ================= TYPES ================= */

// interface Store {
//     _id: string;
//     name: string;
//     location: string;
//     phone: string;
//     pincode?: string;
//     lat?: number;
//     long?: number;
// }

// interface Employee {
//     _id: string;
//     EmployeeeId: string;
//     firstName: string;
//     lastName: string;
//     phone: string;
//     role: string;
//     isActive: boolean;
//     store: Store;
// }

// interface StoreUserLS {
//     id: string;
//     storeId: string;
//     phone: string;
//     role: string;
//     loginTime: string;
// }

// /* ================= COMPONENT ================= */

// const StoreProfile: React.FC = () => {
//     const navigate = useNavigate();
//     // const { id } = useParams<{ id: string }>(); // employeeId from URL

//     const [loading, setLoading] = useState(true);
//     const [employee, setEmployee] = useState<Employee | null>(null);
//     const [error, setError] = useState<string | null>(null);

//     /* ================= LOCAL STORAGE ================= */

//     const getStoreUser = () => {
//         try {
//             const raw = localStorage.getItem("storeUser");
//             return raw ? JSON.parse(raw) : null;
//         } catch (err) {
//             console.error("Invalid storeUser in localStorage");
//             return null;
//         }
//     };
//     const storeUser = getStoreUser();
//     const id = storeUser?.id;
//     console.log("Employee ID:", storeUser?.id);
//     console.log("Store ID:", storeUser?.storeId);

//     /* ================= FETCH PROFILE ================= */

//     useEffect(() => {
//         fetchProfile();
//     }, [id]);

//     const fetchProfile = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             const token = localStorage.getItem("accessToken");
//             if (!token) throw new Error("Unauthorized");

//             const res = await axios.get(
//                 `http://localhost:8000/store/profile/${id}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             const emp = res?.data?.data?.employee;
//             if (!emp) throw new Error("Employee data not found");

//             setEmployee(emp);
//         } catch (err: any) {
//             console.error("Profile fetch error:", err);
//             setError(err.message || "Failed to load profile");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= UI STATES ================= */

//     if (loading) {
//         return (
//             <div className="h-screen flex items-center justify-center bg-gray-100">
//                 Loading profile...
//             </div>
//         );
//     }

//     if (error || !employee) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
//                 <p className="text-red-600 mb-4">{error}</p>
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="px-4 py-2 bg-gray-700 text-white rounded"
//                 >
//                     Go Back
//                 </button>
//             </div>
//         );
//     }

//     const { store } = employee;

//     /* ================= UI ================= */

//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//             <div className="max-w-4xl mx-auto space-y-6">

//                 {/* HEADER */}
//                 <div className="flex justify-between items-center">
//                     <h1 className="text-2xl font-bold">Store Profile</h1>
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="px-4 py-2 bg-gray-700 text-white rounded"
//                     >
//                         Back
//                     </button>
//                 </div>

//                 {/* EMPLOYEE DETAILS */}
//                 <Card title="Employee Details">
//                     <Info label="Name" value={`${employee.firstName} ${employee.lastName}`} />
//                     <Info label="Employee ID" value={employee.EmployeeeId} />
//                     <Info label="Phone" value={employee.phone} />
//                     <Info label="Role" value={employee.role} />
//                     <Info label="Status" value={employee.isActive ? "Active" : "Inactive"} />
//                 </Card>

//                 {/* STORE DETAILS */}
//                 <Card title="Store Details">
//                     <Info label="Store Name" value={store.name} />
//                     <Info label="Phone" value={store.phone} />
//                     <Info label="Location" value={store.location} />
//                     <Info label="Pincode" value={store.pincode || "N/A"} />
//                     <Info label="Latitude" value={store.lat?.toString() || "N/A"} />
//                     <Info label="Longitude" value={store.long?.toString() || "N/A"} />
//                 </Card>



//             </div>
//         </div>
//     );
// };

// /* ================= REUSABLE COMPONENTS ================= */

// const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
//     <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-lg font-semibold mb-4">{title}</h2>
//         <div className="grid grid-cols-2 gap-4 text-sm">{children}</div>
//     </div>
// );

// const Info = ({ label, value }: { label: string; value: string }) => (
//     <div>
//         <p className="text-gray-500">{label}</p>
//         <p className="font-medium text-gray-800 break-all">{value}</p>
//     </div>
// );

// export default StoreProfile;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= TYPES ================= */

interface Store {
    _id: string;
    name: string;
    location: string;
    phone: string;
    pincode?: string;
    lat?: number;
    long?: number;
}

interface Employee {
    _id: string;
    EmployeeeId: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    isActive: boolean;
    store: Store;
}

interface StoreUserLS {
    id: string;
    storeId: string;
    phone: string;
    role: string;
    loginTime: string;
}

/* ================= COMPONENT ================= */

const StoreProfile: React.FC = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [error, setError] = useState<string | null>(null);

    /* ================= LOCAL STORAGE ================= */

    const getStoreUser = () => {
        try {
            const raw = localStorage.getItem("storeUser");
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            console.error("Invalid storeUser in localStorage");
            return null;
        }
    };
    const storeUser = getStoreUser();
    const id = storeUser?.id;
    console.log("Employee ID:", storeUser?.id);
    console.log("Store ID:", storeUser?.storeId);

    /* ================= FETCH PROFILE ================= */

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("Unauthorized");

            const res = await axios.get(
                `http://localhost:8000/store/profile/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const emp = res?.data?.data?.employee;
            if (!emp) throw new Error("Employee data not found");

            setEmployee(emp);
            toast.success("Profile loaded successfully!");
        } catch (err: any) {
            console.error("Profile fetch error:", err);
            setError(err.message || "Failed to load profile");
            toast.error("Failed to load profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("storeUser");
        localStorage.removeItem("accessToken");
        toast.success("Logged out successfully!");
        navigate("/login");
    };

    /* ================= UI STATES ================= */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-600 mb-4 text-lg">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 mr-2"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { store } = employee;
    const statusColor = employee.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    const statusText = employee.isActive ? "Active" : "Inactive";

    /* ================= UI ================= */

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Store Profile</h1>
                            <p className="text-gray-600">View and manage your store and employee details</p>
                        </div>
                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 flex items-center space-x-2"
                            >
                                <span>←</span>
                                <span>Back</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex items-center space-x-2"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* EMPLOYEE DETAILS */}
                        <Card title="👤 Employee Details" className="bg-gradient-to-r from-green-50 to-emerald-50">
                            <Info icon="👤" label="Full Name" value={`${employee.firstName} ${employee.lastName}`} />
                            <Info icon="🆔" label="Employee ID" value={employee.EmployeeeId} />
                            <Info icon="📱" label="Phone" value={employee.phone} />
                            <Info icon="💼" label="Role" value={employee.role} />
                            <Info icon="🔄" label="Status" value={statusText} statusColor={statusColor} />
                        </Card>

                        {/* STORE DETAILS */}
                        <Card title="🏪 Store Details" className="bg-gradient-to-r from-blue-50 to-indigo-50">
                            <Info icon="🏷️" label="Store Name" value={store.name} />
                            <Info icon="📞" label="Phone" value={store.phone} />
                            <Info icon="📍" label="Location" value={store.location} />
                            <Info icon="📮" label="Pincode" value={store.pincode || "N/A"} />
                            <Info icon="🌐" label="Latitude" value={store.lat?.toFixed(6) || "N/A"} />
                            <Info icon="🌐" label="Longitude" value={store.long?.toFixed(6) || "N/A"} />
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

/* ================= REUSABLE COMPONENTS ================= */

interface InfoProps {
    icon: string;
    label: string;
    value: string;
    statusColor?: string;
}

const Info: React.FC<InfoProps> = ({ icon, label, value, statusColor }) => (
    <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 group">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-sm font-medium capitalize">{label}</p>
            <p className={`font-semibold text-gray-900 break-all group-hover:text-blue-600 transition duration-300 ${statusColor ? statusColor : ''}`}>
                {value}
            </p>
        </div>
    </div>
);

const Card = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
    <div className={`rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className || ''}`}>
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                {title}
            </h2>
        </div>
        <div className="p-6 space-y-4">
            {children}
        </div>
    </div>
);

export default StoreProfile;
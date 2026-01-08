// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { callApi } from "../../../util/admin_api";

// /* ================= TYPES ================= */

// interface Employee {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     phone: string;
//     role: string;
//     isActive: boolean;
// }

// /* ================= COMPONENT ================= */

// const EditEmployee: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();

//     const [employee, setEmployee] = useState<Employee | null>(null);
//     const [loading, setLoading] = useState(false);

//     /* ================= FETCH ================= */

//     const fetchEmployee = async () => {
//         if (!id) return;

//         try {
//             setLoading(true);

//             const res = await callApi({
//                 method: "GET",
//                 endpoint: `/employee/${id}`,
//             });

//             console.log("🚀 Employee Fetch Response:", res.data);

//             setEmployee(res.data); // ✅ DIRECT OBJECT
//         } catch (err: any) {
//             console.error("Fetch employee error:", err);
//             toast.error("Unable to load employee");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= UPDATE ================= */

//     const updateEmployee = async () => {
//         if (!employee) return;

//         console.log("🚀 Sending update payload:", employee);

//         try {
//             setLoading(true);

//             const res = await callApi({
//                 method: "PATCH",
//                 endpoint: `/employee/${id}`,
//                 data: {
//                     firstName: employee.firstName,
//                     lastName: employee.lastName,
//                     phone: employee.phone,
//                     role: employee.role,
//                     isActive: employee.isActive,
//                 },
//             });

//             console.log("🚀 Update response:", res.data);

//             setEmployee(res.data); // ✅ DIRECT OBJECT
//             toast.success("Employee updated successfully");

//             setTimeout(() => {
//                 navigate("/manager/employee");
//             }, 1000);

//         } catch (err: any) {
//             console.error("Update employee error:", err);
//             toast.error("Update failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= INIT ================= */

//     useEffect(() => {
//         fetchEmployee();
//     }, [id]);

//     /* ================= UI ================= */

//     if (loading) return <div className="p-4">Loading...</div>;
//     if (!employee) return <div className="p-4">Employee not found</div>;

//     return (
//         <div className="max-w-xl p-4 space-y-4">
//             <h2 className="text-xl font-semibold">Edit Employee</h2>

//             <input
//                 className="w-full border p-2 rounded"
//                 value={employee.firstName}
//                 onChange={(e) =>
//                     setEmployee({ ...employee, firstName: e.target.value })
//                 }
//             />

//             <input
//                 className="w-full border p-2 rounded"
//                 value={employee.lastName}
//                 onChange={(e) =>
//                     setEmployee({ ...employee, lastName: e.target.value })
//                 }
//             />

//             <input
//                 className="w-full border p-2 rounded"
//                 value={employee.phone}
//                 onChange={(e) =>
//                     setEmployee({ ...employee, phone: e.target.value })
//                 }
//             />

//             <select
//                 className="w-full border p-2 rounded"
//                 value={employee.role}
//                 onChange={(e) =>
//                     setEmployee({ ...employee, role: e.target.value })
//                 }
//             >
//                 <option value="ACCOUNTANT">Accountant</option>
//                 <option value="BUTCHER">Butcher</option>
//                 <option value="SALESMAN">Salesman</option>
//                 <option value="CLEANER">Cleaner</option>
//             </select>

//             <label className="flex items-center gap-2">
//                 <input
//                     type="checkbox"
//                     checked={employee.isActive}
//                     onChange={(e) =>
//                         setEmployee({ ...employee, isActive: e.target.checked })
//                     }
//                 />
//                 Active
//             </label>

//             <button
//                 onClick={updateEmployee}
//                 disabled={loading}
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//             >
//                 {loading ? "Updating..." : "Update Employee"}
//             </button>
//         </div>
//     );
// };

// export default EditEmployee;


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { callApi } from "../../../util/admin_api";
import {
    User,
    Phone,
    Briefcase,
    ToggleLeft,
    ToggleRight,
    Save,
} from "lucide-react";

/* ================= TYPES ================= */

interface Employee {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    isActive: boolean;
}

/* ================= COMPONENT ================= */

const EditEmployee: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(false);

    /* ================= FETCH ================= */

    const fetchEmployee = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const res = await callApi({
                method: "GET",
                endpoint: `/employee/${id}`,
            });
            setEmployee(res.data);
        } catch {
            toast.error("Unable to load employee");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UPDATE ================= */

    const updateEmployee = async () => {
        if (!employee) return;

        try {
            setLoading(true);

            await callApi({
                method: "PATCH",
                endpoint: `/employee/${id}`,
                data: {
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    phone: employee.phone,
                    role: employee.role,
                    isActive: employee.isActive,
                },
            });

            toast.success("Employee updated successfully");
            setTimeout(() => navigate("/manager/employee"), 800);
        } catch {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    /* ================= INIT ================= */

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    /* ================= UI STATES ================= */

    if (loading && !employee) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-500">
                    Loading employee details...
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Employee not found
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <div className=" bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">Edit Employee</h2>
                    <p className="text-sm text-indigo-100 mt-1">
                        Update employee information and status
                    </p>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5">

                    {/* First Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={employee.firstName}
                                onChange={(e) =>
                                    setEmployee({
                                        ...employee,
                                        firstName: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={employee.lastName}
                                onChange={(e) =>
                                    setEmployee({
                                        ...employee,
                                        lastName: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <div className="relative mt-1">
                            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={employee.phone}
                                onChange={(e) =>
                                    setEmployee({
                                        ...employee,
                                        phone: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <div className="relative mt-1">
                            <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <select
                                className="w-full pl-10 pr-3 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                value={employee.role}
                                onChange={(e) =>
                                    setEmployee({
                                        ...employee,
                                        role: e.target.value,
                                    })
                                }
                            >
                                <option value="ACCOUNTANT">Accountant</option>
                                <option value="BUTCHER">Butcher</option>
                                <option value="SALESMAN">Salesman</option>
                                <option value="CLEANER">Cleaner</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Toggle */}
                    {/* <div className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3">
                        <div>
                            <p className="font-medium text-gray-700">Status</p>
                            <p className="text-sm text-gray-500">
                                {employee.isActive ? "Active employee" : "Inactive employee"}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setEmployee({
                                    ...employee,
                                    isActive: !employee.isActive,
                                })
                            }
                            className="text-blue-600"
                        >
                            {employee.isActive ? (
                                <ToggleRight size={36} />
                            ) : (
                                <ToggleLeft size={36} />
                            )}
                        </button>
                    </div> */}

                    {/* Actions */}
                    <button
                        onClick={updateEmployee}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-all"
                    >
                        <Save size={18} />
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditEmployee;

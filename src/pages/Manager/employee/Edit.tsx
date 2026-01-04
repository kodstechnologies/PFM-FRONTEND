


// // // // import React, { useEffect, useState } from "react";
// // // // import { useNavigate, useParams } from "react-router-dom";
// // // // import { toast } from "react-hot-toast";
// // // // import { callApi } from "../../../util/admin_api";

// // // // /* ================= TYPES ================= */

// // // // interface Employee {
// // // //     _id: string;
// // // //     firstName: string;
// // // //     lastName: string;
// // // //     phone: string;
// // // //     role: string;
// // // //     isActive: boolean;
// // // // }

// // // // /* ================= COMPONENT ================= */

// // // // const EditEmployee: React.FC = () => {
// // // //     const { id } = useParams<{ id: string }>();
// // // //     const navigate = useNavigate();

// // // //     const [employee, setEmployee] = useState<Employee | null>(null);
// // // //     const [loading, setLoading] = useState(false);

// // // //     /* ================= FETCH EMPLOYEE ================= */

// // // //     const fetchEmployee = async () => {
// // // //         if (!id) return;

// // // //         try {
// // // //             setLoading(true);

// // // //             const res = await callApi({
// // // //                 method: "GET",
// // // //                 endpoint: `/employee/${id}`,
// // // //             });

// // // //             console.log("🚀 Employee Fetch Response:", res);

// // // //             if (res?.data) {
// // // //                 setEmployee(res.data);
// // // //             } else {
// // // //                 throw new Error("Invalid response data");
// // // //             }
// // // //         } catch (err: any) {
// // // //             console.error("Fetch employee error:", err);
// // // //             toast.error(err.message || "Unable to load employee");
// // // //             // Optionally navigate back on error
// // // //             // navigate("/manager/employee");
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     /* ================= UPDATE EMPLOYEE ================= */

// // // //     const updateEmployee = async () => {
// // // //         if (!employee) return;

// // // //         try {
// // // //             setLoading(true);

// // // //             const res = await callApi({
// // // //                 method: "PATCH",
// // // //                 endpoint: `/employee/${id}`,
// // // //                 body: {
// // // //                     firstName: employee.firstName,
// // // //                     lastName: employee.lastName,
// // // //                     phone: employee.phone,
// // // //                     role: employee.role,
// // // //                     isActive: employee.isActive,
// // // //                 },
// // // //             });

// // // //             if (!res?.data?.success) {
// // // //                 throw new Error(res?.data?.message || "Update failed");
// // // //             }

// // // //             toast.success("Employee updated successfully");

// // // //             // ✅ Redirect after update
// // // //             navigate("/manager/employee");
// // // //         } catch (err: any) {
// // // //             console.error("Update employee error:", err);
// // // //             toast.error(err.message || "Update failed");
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     /* ================= INIT ================= */

// // // //     useEffect(() => {
// // // //         console.log("🚀 ~ EditEmployee ~ id:", id);
// // // //         if (id) {
// // // //             fetchEmployee();
// // // //         }
// // // //     }, [id]);

// // // //     /* ================= UI ================= */

// // // //     if (loading) {
// // // //         return <div className="p-4">Loading employee...</div>;
// // // //     }

// // // //     if (!employee) {
// // // //         return <div className="p-4">Employee not found or error loading data.</div>;
// // // //     }

// // // //     return (
// // // //         <div className="max-w-xl p-4 space-y-4">
// // // //             <h2 className="text-xl font-semibold">Edit Employee</h2>

// // // //             <input
// // // //                 type="text"
// // // //                 className="w-full border p-2 rounded"
// // // //                 placeholder="First Name"
// // // //                 value={employee.firstName}
// // // //                 onChange={(e) =>
// // // //                     setEmployee({ ...employee, firstName: e.target.value })
// // // //                 }
// // // //             />

// // // //             <input
// // // //                 type="text"
// // // //                 className="w-full border p-2 rounded"
// // // //                 placeholder="Last Name"
// // // //                 value={employee.lastName}
// // // //                 onChange={(e) =>
// // // //                     setEmployee({ ...employee, lastName: e.target.value })
// // // //                 }
// // // //             />

// // // //             <input
// // // //                 type="text"
// // // //                 className="w-full border p-2 rounded"
// // // //                 placeholder="Phone"
// // // //                 value={employee.phone}
// // // //                 onChange={(e) =>
// // // //                     setEmployee({ ...employee, phone: e.target.value })
// // // //                 }
// // // //             />

// // // //             <select
// // // //                 className="w-full border p-2 rounded"
// // // //                 value={employee.role}
// // // //                 onChange={(e) =>
// // // //                     setEmployee({ ...employee, role: e.target.value })
// // // //                 }
// // // //             >
// // // //                 <option value="ACCOUNTANT">Accountant</option>
// // // //                 <option value="BUTCHER">Butcher</option>
// // // //                 <option value="SALESMAN">Salesman</option>
// // // //                 <option value="CLEANER">Cleaner</option>
// // // //             </select>

// // // //             <label className="flex items-center gap-2">
// // // //                 <input
// // // //                     type="checkbox"
// // // //                     checked={employee.isActive}
// // // //                     onChange={(e) =>
// // // //                         setEmployee({ ...employee, isActive: e.target.checked })
// // // //                     }
// // // //                 />
// // // //                 Active
// // // //             </label>

// // // //             <button
// // // //                 onClick={updateEmployee}
// // // //                 disabled={loading}
// // // //                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
// // // //             >
// // // //                 {loading ? "Updating..." : "Update Employee"}
// // // //             </button>
// // // //         </div>
// // // //     );
// // // // };

// // // // export default EditEmployee;

// // // import React, { useEffect, useState } from "react";
// // // import { useNavigate, useParams } from "react-router-dom";
// // // import { toast } from "react-hot-toast";
// // // import { callApi } from "../../../util/admin_api";

// // // /* ================= TYPES ================= */

// // // interface Employee {
// // //     _id: string;
// // //     firstName: string;
// // //     lastName: string;
// // //     phone: string;
// // //     role: string;
// // //     isActive: boolean;
// // // }

// // // /* ================= COMPONENT ================= */

// // // const EditEmployee: React.FC = () => {
// // //     const { id } = useParams<{ id: string }>();
// // //     const navigate = useNavigate();

// // //     const [employee, setEmployee] = useState<Employee | null>(null);
// // //     const [loading, setLoading] = useState(false);

// // //     /* ================= FETCH EMPLOYEE ================= */

// // //     const fetchEmployee = async () => {
// // //         if (!id) return;

// // //         try {
// // //             setLoading(true);

// // //             const res = await callApi({
// // //                 method: "GET",
// // //                 endpoint: `/employee/${id}`,
// // //             });

// // //             console.log("🚀 Employee Fetch Response:", res);

// // //             if (res?.data) {
// // //                 setEmployee(res.data);
// // //             } else {
// // //                 throw new Error("Invalid response data");
// // //             }
// // //         } catch (err: any) {
// // //             console.error("Fetch employee error:", err);
// // //             toast.error(err.message || "Unable to load employee");
// // //             // Optionally navigate back on error
// // //             // navigate("/manager/employee");
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     /* ================= UPDATE EMPLOYEE ================= */

// // //     const updateEmployee = async () => {
// // //         if (!employee) return;

// // //         try {
// // //             setLoading(true);

// // //             const res = await callApi({
// // //                 method: "PATCH",
// // //                 endpoint: `/employee/${id}`,
// // //                 body: {
// // //                     firstName: employee.firstName,
// // //                     lastName: employee.lastName,
// // //                     phone: employee.phone,
// // //                     role: employee.role,
// // //                     isActive: employee.isActive,
// // //                 },
// // //             });

// // //             if (!res?.data?.success) {
// // //                 throw new Error(res?.data?.message || "Update failed");
// // //             }

// // //             toast.success("Employee updated successfully");

// // //             // ✅ Redirect after update
// // //             navigate("/manager/employee");
// // //         } catch (err: any) {
// // //             console.error("Update employee error:", err);
// // //             toast.error(err.message || "Update failed");
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     /* ================= INIT ================= */

// // //     useEffect(() => {
// // //         console.log("🚀 ~ EditEmployee ~ id:", id);
// // //         if (id) {
// // //             fetchEmployee();
// // //         }
// // //     }, [id]);

// // //     /* ================= UI ================= */

// // //     if (loading) {
// // //         return <div className="p-4">Loading employee...</div>;
// // //     }

// // //     if (!employee) {
// // //         return <div className="p-4">Employee not found or error loading data.</div>;
// // //     }

// // //     return (
// // //         <div className="max-w-xl p-4 space-y-4">
// // //             <h2 className="text-xl font-semibold">Edit Employee</h2>

// // //             <input
// // //                 type="text"
// // //                 className="w-full border p-2 rounded"
// // //                 placeholder="First Name"
// // //                 value={employee.firstName}
// // //                 onChange={(e) =>
// // //                     setEmployee({ ...employee, firstName: e.target.value })
// // //                 }
// // //             />

// // //             <input
// // //                 type="text"
// // //                 className="w-full border p-2 rounded"
// // //                 placeholder="Last Name"
// // //                 value={employee.lastName}
// // //                 onChange={(e) =>
// // //                     setEmployee({ ...employee, lastName: e.target.value })
// // //                 }
// // //             />

// // //             <input
// // //                 type="text"
// // //                 className="w-full border p-2 rounded"
// // //                 placeholder="Phone"
// // //                 value={employee.phone}
// // //                 onChange={(e) =>
// // //                     setEmployee({ ...employee, phone: e.target.value })
// // //                 }
// // //             />

// // //             <select
// // //                 className="w-full border p-2 rounded"
// // //                 value={employee.role}
// // //                 onChange={(e) =>
// // //                     setEmployee({ ...employee, role: e.target.value })
// // //                 }
// // //             >
// // //                 <option value="ACCOUNTANT">Accountant</option>
// // //                 <option value="BUTCHER">Butcher</option>
// // //                 <option value="SALESMAN">Salesman</option>
// // //                 <option value="CLEANER">Cleaner</option>
// // //             </select>

// // //             <label className="flex items-center gap-2">
// // //                 <input
// // //                     type="checkbox"
// // //                     checked={employee.isActive}
// // //                     onChange={(e) =>
// // //                         setEmployee({ ...employee, isActive: e.target.checked })
// // //                     }
// // //                 />
// // //                 Active
// // //             </label>

// // //             <button
// // //                 onClick={updateEmployee}
// // //                 disabled={loading}
// // //                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
// // //             >
// // //                 {loading ? "Updating..." : "Update Employee"}
// // //             </button>
// // //         </div>
// // //     );
// // // };

// // // export default EditEmployee;

// // import React, { useEffect, useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { toast } from "react-hot-toast";
// // import { callApi } from "../../../util/admin_api";

// // /* ================= TYPES ================= */

// // interface Employee {
// //     _id: string;
// //     firstName: string;
// //     lastName: string;
// //     phone: string;
// //     role: string;
// //     isActive: boolean;
// // }

// // /* ================= COMPONENT ================= */

// // const EditEmployee: React.FC = () => {
// //     const { id } = useParams<{ id: string }>();
// //     const navigate = useNavigate();

// //     const [employee, setEmployee] = useState<Employee | null>(null);
// //     const [loading, setLoading] = useState(false);

// //     /* ================= FETCH EMPLOYEE ================= */

// //     const fetchEmployee = async () => {
// //         if (!id) return;

// //         try {
// //             setLoading(true);

// //             const res = await fetch(`${callApi}/api/employee/${id}`, {
// //                 method: "GET",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     // Add auth header if needed, e.g., Authorization: `Bearer ${token}`
// //                 },
// //             });

// //             if (!res.ok) {
// //                 throw new Error(`HTTP error! status: ${res.status}`);
// //             }

// //             const data = await res.json();
// //             console.log("🚀 Employee Fetch Response:", data);

// //             if (data?.data) {
// //                 setEmployee(data.data);
// //             } else {
// //                 throw new Error("Invalid response data");
// //             }
// //         } catch (err: any) {
// //             console.error("Fetch employee error:", err);
// //             toast.error(err.message || "Unable to load employee");
// //             // Optionally navigate back on error
// //             // navigate("/manager/employee");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     /* ================= UPDATE EMPLOYEE ================= */

// //     const updateEmployee = async () => {
// //         if (!employee) return;

// //         try {
// //             setLoading(true);

// //             const res = await fetch(`/employee/${id}`, {
// //                 method: "PATCH",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     // Add auth header if needed, e.g., Authorization: `Bearer ${token}`
// //                 },
// //                 body: JSON.stringify({
// //                     firstName: employee.firstName,
// //                     lastName: employee.lastName,
// //                     phone: employee.phone,
// //                     role: employee.role,
// //                     isActive: employee.isActive,
// //                 }),
// //             });

// //             if (!res.ok) {
// //                 const errorData = await res.json();
// //                 throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
// //             }

// //             const data = await res.json();

// //             if (!data?.success) {
// //                 throw new Error(data?.message || "Update failed");
// //             }

// //             toast.success("Employee updated successfully");

// //             // ✅ Redirect after update
// //             navigate("/manager/employee");
// //         } catch (err: any) {
// //             console.error("Update employee error:", err);
// //             toast.error(err.message || "Update failed");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     /* ================= INIT ================= */

// //     useEffect(() => {
// //         console.log("🚀 ~ EditEmployee ~ id:", id);
// //         if (id) {
// //             fetchEmployee();
// //         }
// //     }, [id]);

// //     /* ================= UI ================= */

// //     if (loading) {
// //         return <div className="p-4">Loading employee...</div>;
// //     }

// //     if (!employee) {
// //         return <div className="p-4">Employee not found or error loading data.</div>;
// //     }

// //     return (
// //         <div className="max-w-xl p-4 space-y-4">
// //             <h2 className="text-xl font-semibold">Edit Employee</h2>

// //             <input
// //                 type="text"
// //                 className="w-full border p-2 rounded"
// //                 placeholder="First Name"
// //                 value={employee.firstName}
// //                 onChange={(e) =>
// //                     setEmployee({ ...employee, firstName: e.target.value })
// //                 }
// //             />

// //             <input
// //                 type="text"
// //                 className="w-full border p-2 rounded"
// //                 placeholder="Last Name"
// //                 value={employee.lastName}
// //                 onChange={(e) =>
// //                     setEmployee({ ...employee, lastName: e.target.value })
// //                 }
// //             />

// //             <input
// //                 type="text"
// //                 className="w-full border p-2 rounded"
// //                 placeholder="Phone"
// //                 value={employee.phone}
// //                 onChange={(e) =>
// //                     setEmployee({ ...employee, phone: e.target.value })
// //                 }
// //             />

// //             <select
// //                 className="w-full border p-2 rounded"
// //                 value={employee.role}
// //                 onChange={(e) =>
// //                     setEmployee({ ...employee, role: e.target.value })
// //                 }
// //             >
// //                 <option value="ACCOUNTANT">Accountant</option>
// //                 <option value="BUTCHER">Butcher</option>
// //                 <option value="SALESMAN">Salesman</option>
// //                 <option value="CLEANER">Cleaner</option>
// //             </select>

// //             <label className="flex items-center gap-2">
// //                 <input
// //                     type="checkbox"
// //                     checked={employee.isActive}
// //                     onChange={(e) =>
// //                         setEmployee({ ...employee, isActive: e.target.checked })
// //                     }
// //                 />
// //                 Active
// //             </label>

// //             <button
// //                 onClick={updateEmployee}
// //                 disabled={loading}
// //                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
// //             >
// //                 {loading ? "Updating..." : "Update Employee"}
// //             </button>
// //         </div>
// //     );
// // };

// // export default EditEmployee;

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

//     /* ================= FETCH EMPLOYEE ================= */

//     const fetchEmployee = async () => {
//         if (!id) return;

//         try {
//             setLoading(true);

//             const res = await callApi({
//                 method: "GET",
//                 endpoint: `/employee/${id}`,
//             });

//             console.log("🚀 Employee Fetch Response:", res);

//             if (res?.data) {
//                 setEmployee(res.data);
//             } else {
//                 throw new Error("Invalid response data");
//             }
//         } catch (err: any) {
//             console.error("Fetch employee error:", err);
//             toast.error(err.message || "Unable to load employee");
//             // Optionally navigate back on error
//             // navigate("/manager/employee");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= UPDATE EMPLOYEE ================= */

//     const updateEmployee = async () => {
//         if (!employee) return;

//         try {
//             setLoading(true);

//             const res = await callApi({
//                 method: "PATCH",
//                 endpoint: `/employee/${id}`,
//                 body: {
//                     firstName: employee.firstName,
//                     lastName: employee.lastName,
//                     phone: employee.phone,
//                     role: employee.role,
//                     isActive: employee.isActive,
//                 },
//             });

//             if (!res?.data?.success) {
//                 throw new Error(res?.data?.message || "Update failed");
//             }

//             toast.success("Employee updated successfully");

//             // ✅ Redirect after update
//             navigate("/manager/employee");
//         } catch (err: any) {
//             console.error("Update employee error:", err);
//             toast.error(err.message || "Update failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= INIT ================= */

//     useEffect(() => {
//         console.log("🚀 ~ EditEmployee ~ id:", id);
//         if (id) {
//             fetchEmployee();
//         }
//     }, [id]);

//     /* ================= UI ================= */

//     if (loading) {
//         return <div className="p-4">Loading employee...</div>;
//     }

//     if (!employee) {
//         return <div className="p-4">Employee not found or error loading data.</div>;
//     }

//     return (
//         <div className="max-w-xl p-4 space-y-4">
//             <h2 className="text-xl font-semibold">Edit Employee</h2>

//             <input
//                 type="text"
//                 className="w-full border p-2 rounded"
//                 placeholder="First Name"
//                 value={employee.firstName}
//                 onChange={(e) =>
//                     setEmployee({ ...employee, firstName: e.target.value })
//                 }
//             />

//             <input
//                 type="text"
//                 className="w-full border p-2 rounded"
//                 placeholder="Last Name"
//                 value={employee.lastName}
//                 onChange={(e) =>
//                     setEmployee({ ...employee, lastName: e.target.value })
//                 }
//             />

//             <input
//                 type="text"
//                 className="w-full border p-2 rounded"
//                 placeholder="Phone"
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
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
//             >
//                 {loading ? "Updating..." : "Update Employee"}
//             </button>
//         </div>
//     );
// };

// export default EditEmployee;

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

//     /* ================= FETCH EMPLOYEE ================= */

//     const fetchEmployee = async () => {
//         if (!id) return;

//         try {
//             setLoading(true);

//             const res = await callApi({
//                 method: "GET",
//                 endpoint: `/employee/${id}`,
//             });

//             console.log("🚀 Employee Fetch Response:", res);

//             if (res?.data) {
//                 setEmployee(res.data.data || res.data); // Handle if data is nested or direct
//             } else {
//                 throw new Error("Invalid response data");
//             }
//         } catch (err: any) {
//             console.error("Fetch employee error:", err);
//             toast.error(err.message || "Unable to load employee");
//             // Optionally navigate back on error
//             // navigate("/manager/employee");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= UPDATE EMPLOYEE ================= */

//     const updateEmployee = async () => {
//         console.log("🚀 ~ updateEmployee ~ employee:", employee)
//         if (!employee) return;

//         try {
//             setLoading(true);

//          const res = await callApi({
//     method: "PATCH",
//     endpoint: `/employee/${id}`,
//     data: {
//         firstName: employee.firstName,
//         lastName: employee.lastName,
//         phone: employee.phone,
//         role: employee.role,
//         isActive: employee.isActive,
//     },
// });


//             console.log("🚀 Update Employee Response:", res); // Debug log

//             if (!res?.data?.success) {
//                 throw new Error(res?.data?.message || "Update failed");
//             }

//             // ✅ Update local state with response data to reflect changes immediately
//             if (res?.data?.data) {
//                 setEmployee(res.data.data);
//             }

//             toast.success("Employee updated successfully");

//             // ✅ Optional: Delay navigate to see the update in UI
//             setTimeout(() => {
//                 navigate("/manager/employee");
//             }, 1500); // 1.5s delay to show success and updated form

//         } catch (err: any) {
//             console.error("Update employee error:", err);
//             toast.error(err.message || "Update failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= INIT ================= */

//     useEffect(() => {
//         console.log("🚀 ~ EditEmployee ~ id:", id);
//         if (id) {
//             fetchEmployee();
//         }
//     }, [id]);

//     /* ================= UI ================= */

//     if (loading) {
//         return <div className="p-4">Loading employee...</div>;
//     }

//     if (!employee) {
//         return <div className="p-4">Employee not found or error loading data.</div>;
//     }

//     return (
//         <div className="max-w-xl p-4 space-y-4">
//             <h2 className="text-xl font-semibold">Edit Employee</h2>

//             <input
//                 type="text"
//                 className="w-full border p-2 rounded"
//                 placeholder="First Name"
//                 value={employee.firstName}
//                 onChange={(e) =>
//                     setEmployee({ ...employee, firstName: e.target.value })
//                 }
//             />

//             <input
//                 type="text"
//                 className="w-full border p-2 rounded"
//                 placeholder="Last Name"
//                 value={employee.lastName}
//                 onChange={(e) =>
//                     setEmployee({ ...employee, lastName: e.target.value })
//                 }
//             />

//             <input
//                 type="text"
//                 className="w-full border p-2 rounded"
//                 placeholder="Phone"
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
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
//             >
//                 {loading ? "Updating..." : "Update Employee"}
//             </button>
//         </div>
//     );
// };
//                 console.log("🚀 ~ updateEmployee ~ body:", body)

// export default EditEmployee;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { callApi } from "../../../util/admin_api";

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

            console.log("🚀 Employee Fetch Response:", res.data);

            setEmployee(res.data); // ✅ DIRECT OBJECT
        } catch (err: any) {
            console.error("Fetch employee error:", err);
            toast.error("Unable to load employee");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UPDATE ================= */

    const updateEmployee = async () => {
        if (!employee) return;

        console.log("🚀 Sending update payload:", employee);

        try {
            setLoading(true);

            const res = await callApi({
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

            console.log("🚀 Update response:", res.data);

            setEmployee(res.data); // ✅ DIRECT OBJECT
            toast.success("Employee updated successfully");

            setTimeout(() => {
                navigate("/manager/employee");
            }, 1000);

        } catch (err: any) {
            console.error("Update employee error:", err);
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    /* ================= INIT ================= */

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    /* ================= UI ================= */

    if (loading) return <div className="p-4">Loading...</div>;
    if (!employee) return <div className="p-4">Employee not found</div>;

    return (
        <div className="max-w-xl p-4 space-y-4">
            <h2 className="text-xl font-semibold">Edit Employee</h2>

            <input
                className="w-full border p-2 rounded"
                value={employee.firstName}
                onChange={(e) =>
                    setEmployee({ ...employee, firstName: e.target.value })
                }
            />

            <input
                className="w-full border p-2 rounded"
                value={employee.lastName}
                onChange={(e) =>
                    setEmployee({ ...employee, lastName: e.target.value })
                }
            />

            <input
                className="w-full border p-2 rounded"
                value={employee.phone}
                onChange={(e) =>
                    setEmployee({ ...employee, phone: e.target.value })
                }
            />

            <select
                className="w-full border p-2 rounded"
                value={employee.role}
                onChange={(e) =>
                    setEmployee({ ...employee, role: e.target.value })
                }
            >
                <option value="ACCOUNTANT">Accountant</option>
                <option value="BUTCHER">Butcher</option>
                <option value="SALESMAN">Salesman</option>
                <option value="CLEANER">Cleaner</option>
            </select>

            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={employee.isActive}
                    onChange={(e) =>
                        setEmployee({ ...employee, isActive: e.target.checked })
                    }
                />
                Active
            </label>

            <button
                onClick={updateEmployee}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                {loading ? "Updating..." : "Update Employee"}
            </button>
        </div>
    );
};

export default EditEmployee;

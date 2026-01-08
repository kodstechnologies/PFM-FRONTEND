import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "../../../config/api.config";
import CustomTable from "../../../components/CustomTable"; // Adjust path as needed

/* ================= TYPES ================= */
interface Employee {
    _id: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    role?: string;
    isActive?: boolean;
    fullName?: string; // Computed field
    status?: string; // Computed field for sorting
}

interface Column {
    accessor: string;
    title: string;
    sortable?: boolean;
    hidden?: boolean;
    render?: (row: Employee, index: number) => React.ReactNode;
}

/* ================= COMPONENT ================= */
const ViewEmployee: React.FC = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ Get token safely
    const getToken = () => {
        const storedUser = localStorage.getItem("managerUser");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                return parsed.accessToken || localStorage.getItem("accessToken");
            } catch (e) {
                console.error("Error parsing managerUser:", e);
            }
        }
        return localStorage.getItem("accessToken");
    };

    const storedUser = localStorage.getItem("managerUser");
    const storeId = storedUser ? JSON.parse(storedUser)?.storeId : null;
    console.log("🚀 ~ ViewEmployee ~ storeId:", storeId)

    // Enrich employees with fullName and status for sorting
    const enrichedEmployees = useMemo(() =>
        employees.map(emp => ({
            ...emp,
            fullName: `${emp.firstName} ${emp.lastName || ''}`.trim(),
            status: emp.isActive ? 'Active' : 'Inactive'
        })),
        [employees]
    );

    /* ================= FETCH ================= */
    const fetchEmployees = async () => {
        const token = getToken();
        if (!token) {
            setError("Authentication required. Please log in.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            // Changed endpoint to include managers - assuming /manager/employees endpoint returns all roles including managers
            const res = await axios.get(
                `${API_CONFIG.BASE_URL}/employee/store/${storeId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: API_CONFIG.REQUEST_CONFIG.TIMEOUT,
                }
            );
            const data = res.data?.data;
            console.log("Fetched employees:", data); // Debug log to check roles
            if (Array.isArray(data)) {
                setEmployees(data);
            } else {
                setEmployees([]);
            }
        } catch (err: any) {
            console.error(err);
            setError(
                err?.response?.data?.message || "Failed to load employees"
            );
        } finally {
            setLoading(false);
        }
    };

    /* ================= HANDLERS ================= */
    const handleCreate = () => {
        navigate("/manager/employee/add");
    };

    const handleEdit = (employee: Employee) => {
        navigate(`/manager/employee/${employee._id}`);
    };

    /* ================= INIT ================= */
    useEffect(() => {
        fetchEmployees();
    }, []);

    /* ================= COLUMNS ================= */
    const columns: Column[] = [
        {
            accessor: "fullName",
            title: "Name",
            sortable: true,
            render: (row: Employee) => (
                <div className="font-medium">
                    {row.firstName} {row.lastName || ""}
                </div>
            ),
        },
        {
            accessor: "phone",
            title: "Phone",
            sortable: true,
            render: (row: Employee) => <div>{row.phone || "-"}</div>,
        },
        {
            accessor: "role",
            title: "Role",
            sortable: true,
            render: (row: Employee) => <div className="capitalize">{row.role || "-"}</div>,
        },
        // {
        //     accessor: "status",
        //     title: "Status",
        //     sortable: true,
        //     render: (row: Employee) => (
        //         <span
        //             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.isActive
        //                 ? "bg-green-100 text-green-800"
        //                 : "bg-red-100 text-red-800"
        //                 }`}
        //         >
        //             {row.isActive ? "Active" : "Inactive"}
        //         </span>
        //     ),
        // },
        {
            accessor: "actions",
            title: "Actions",
            sortable: false,
            render: (row: Employee) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        title="Edit Employee"
                    >
                        Edit
                    </button>
                </div>
            ),
        },
    ];

    /* ================= UI ================= */
    return (
        <div className="p-4">
            {loading && <div className="text-center py-4">Loading employees...</div>}
            {error && <div className="p-4 text-red-500 text-center">{error}</div>}
            {!loading && !error && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Employees</h2>
                        <button
                            onClick={handleCreate}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Create Employee
                        </button>
                    </div>
                    {enrichedEmployees.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No employees found.{" "}
                            <button
                                onClick={handleCreate}
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                Create one now
                            </button>
                        </div>
                    ) : (
                        <CustomTable
                            pageHeader="Employees List"
                            data={enrichedEmployees}
                            columns={columns}
                            defaultSort={{ columnAccessor: "fullName", direction: "asc" }}
                            pageSizeOptions={[10, 20, 50, 100]}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ViewEmployee;
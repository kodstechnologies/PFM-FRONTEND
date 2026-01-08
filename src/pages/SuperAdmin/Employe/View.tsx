// import React, { useState, useEffect, useMemo } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//     useReactTable,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     flexRender,
//     createColumnHelper,
//     type ColumnDef,
// } from "@tanstack/react-table"
// import NavigateBtn from "../../../components/button/NavigateBtn"
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// import AddIcon from "@mui/icons-material/Add"
// import VisibilityIcon from "@mui/icons-material/Visibility"
// import ModeEditIcon from "@mui/icons-material/ModeEdit"
// import SearchIcon from "@mui/icons-material/Search"
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
// import callApi from "../../../util/admin_api"
// import type { AxiosResponse } from "axios"
// import { toast, ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import Fuse from "fuse.js"

// type Store = {
//     _id?: string;
//     name: string;
//     location: string;
//     phone: string;
// };

// type Employee = {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     phone: string;
//     role: string;
//     isActive: boolean;
//     createdAt: string;
//     updatedAt: string;
//     employeeId: string;
//     store: Store;
// };

// interface ApiResponse<T> {
//     statusCode: number
//     success: boolean
//     message: string
//     data: T
//     meta: any | null
// }

// const columnHelper = createColumnHelper<Employee>()

// const ViewEmploye: React.FC = () => {
//     const [employeeData, setEmployeeData] = useState<{
//         allData: Employee[]
//         filteredData: Employee[]
//     }>({ allData: [], filteredData: [] })
//     const [globalFilter, setGlobalFilter] = useState("")
//     const [pagination, setPagination] = useState({
//         pageIndex: 0,
//         pageSize: 5,
//     })
//     const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([{ id: "createdAt", desc: true }])
//     const [loading, setLoading] = useState(true)
//     const PAGE_SIZES = [5, 10, 20, 30, 50]
//     const navigate = useNavigate()

//     useEffect(() => {
//         const fetchEmployees = async () => {
//             try {
//                 setLoading(true)
//                 const response: AxiosResponse<ApiResponse<Employee[]>> = await callApi({
//                     url: "/employee/store",
//                     method: "GET",
//                 })

//                 if (!response.data.success || !Array.isArray(response.data.data)) {
//                     throw new Error(response.data.message || "Invalid API response format")
//                 }

//                 setEmployeeData({ allData: response.data.data, filteredData: response.data.data })
//                 console.log("Fetched employees:", response.data.data)
//             } catch (error: unknown) {
//                 const errorMessage = error instanceof Error ? error.message : "Failed to fetch employees"
//                 console.error("Error fetching employees:", errorMessage)
//                 toast.error(errorMessage, {
//                     position: "top-right",
//                     autoClose: 3000,
//                 })
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchEmployees()
//     }, [])

//     // Fuzzy search implementation
//     const fuse = useMemo(
//         () =>
//             new Fuse(employeeData.allData, {
//                 keys: [
//                     { name: "firstName", getFn: (emp) => emp.firstName || "" },
//                     { name: "lastName", getFn: (emp) => emp.lastName || "" },
//                     "phone",
//                     "role",
//                     "employeeId",
//                     { name: "store", getFn: (emp) => emp.store?.name || "" },
//                 ],
//                 threshold: 0.3,
//             }),
//         [employeeData.allData],
//     )

//     // Update filteredData based on globalFilter
//     useEffect(() => {
//         if (!globalFilter) {
//             setEmployeeData((prev) => ({ ...prev, filteredData: prev.allData }))
//             console.log("No filter applied, using all data:", employeeData.allData)
//         } else {
//             try {
//                 const searchResults = fuse.search(globalFilter).map((result) => result.item)
//                 setEmployeeData((prev) => ({ ...prev, filteredData: searchResults }))
//                 console.log("Filtered data:", searchResults)
//             } catch (error) {
//                 console.error("Error in fuzzy search:", error)
//                 toast.error("Error filtering data.")
//                 setEmployeeData((prev) => ({ ...prev, filteredData: prev.allData }))
//             }
//         }
//     }, [globalFilter, fuse])

//     const handleView = (row: Employee) => {
//         try {
//             console.log("Viewing:", row)
//             navigate(`/employe/view/${row._id}`, {
//                 state: {
//                     id: row._id,
//                     firstName: row.firstName,
//                     lastName: row.lastName,
//                     phone: row.phone,
//                     role: row.role,
//                     employeeId: row.employeeId,
//                     store: row.store,
//                 },
//             })
//         } catch (error) {
//             console.error("Error navigating to view:", error)
//             toast.error("Failed to initiate view.")
//         }
//     }

//     const handleEdit = (row: Employee) => {
//         try {
//             console.log("Editing:", row)
//             navigate(`/employe/edit/${row._id}`, {
//                 state: {
//                     id: row._id,
//                     firstName: row.firstName,
//                     lastName: row.lastName,
//                     phone: row.phone,
//                     role: row.role,
//                     employeeId: row.employeeId,
//                     store: row.store,
//                 },
//             })
//         } catch (error) {
//             console.error("Error navigating to edit:", error)
//             toast.error("Failed to initiate edit.")
//         }
//     }

//     const handleDelete = async (row: Employee) => {
//         if (window.confirm(`Are you sure you want to delete ${row.firstName} ${row.lastName}?`)) {
//             try {
//                 const response: AxiosResponse<ApiResponse<unknown>> = await callApi({
//                     url: `/employe/${row._id}`,
//                     method: "DELETE",
//                 })

//                 if (!response.data.success) {
//                     throw new Error(response.data.message || "Failed to delete employee")
//                 }

//                 const employeeId = row._id
//                 setEmployeeData((prev) => ({
//                     allData: prev.allData.filter((emp) => emp._id !== employeeId),
//                     filteredData: prev.filteredData.filter((emp) => emp._id !== employeeId),
//                 }))
//                 toast.success(`${row.firstName} ${row.lastName} deleted successfully!`)
//             } catch (error: unknown) {
//                 const errorMessage = error instanceof Error ? error.message : "Failed to delete employee"
//                 console.error("Error deleting employee:", errorMessage)
//                 toast.error(errorMessage, {
//                     position: "top-right",
//                     autoClose: 3000,
//                 })
//             }
//         }
//     }

//     useEffect(() => {
//         setPagination((prev) => ({ ...prev, pageIndex: 0 }))
//     }, [globalFilter])

//     const columns = useMemo<ColumnDef<Employee, any>[]>(
//         () => [
//             columnHelper.accessor("firstName", {
//                 header: "Name",
//                 cell: (info) => (
//                     <div className="flex items-center">
//                         <span className="font-medium text-gray-900">
//                             {info.row.original.firstName} {info.row.original.lastName}
//                         </span>
//                     </div>
//                 ),
//                 size: 200,
//                 enableSorting: true,
//             }),
//             columnHelper.accessor("phone", {
//                 header: "Phone",
//                 cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
//                 size: 150,
//                 enableSorting: true,
//             }),
//             columnHelper.accessor("role", {
//                 header: "Role",
//                 cell: (info) => (
//                     <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
//                         {info.getValue()}
//                     </span>
//                 ),
//                 size: 120,
//                 enableSorting: true,
//             }),
//             columnHelper.accessor("isActive", {
//                 header: "Status",
//                 cell: (info) => (
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                         {info.getValue() ? 'Active' : 'Inactive'}
//                     </span>
//                 ),
//                 size: 120,
//                 enableSorting: true,
//             }),
//             columnHelper.accessor("store", {
//                 header: "Store",
//                 cell: (info) => <span className="text-gray-600">{info.getValue()?.name || 'N/A'}</span>,
//                 size: 200,
//                 enableSorting: true,
//             }),
//             columnHelper.accessor("employeeId", {
//                 header: "Employee ID",
//                 cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
//                 size: 150,
//                 enableSorting: true,
//             }),
//             columnHelper.accessor("createdAt", {
//                 header: "Created At",
//                 cell: (info) => (
//                     <span className="text-gray-600">
//                         {new Date(info.getValue()).toLocaleDateString()}
//                     </span>
//                 ),
//                 size: 150,
//                 enableSorting: true,
//             }),
//             columnHelper.accessor("updatedAt", {
//                 header: "Updated At",
//                 cell: (info) => (
//                     <span className="text-gray-600">
//                         {new Date(info.getValue()).toLocaleDateString()}
//                     </span>
//                 ),
//                 size: 150,
//                 enableSorting: true,
//             }),
//             {
//                 id: "actions",
//                 header: () => <div className="text-center w-full">Actions</div>,
//                 cell: ({ row }) => (
//                     <div className="flex justify-center gap-2">
//                         <button
//                             onClick={() => handleView(row.original)}
//                             className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors flex items-center"
//                             aria-label={`View ${row.original.firstName} ${row.original.lastName}`}
//                             title="View"
//                         >
//                             <VisibilityIcon fontSize="small" />
//                         </button>
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center"
//                             aria-label={`Edit ${row.original.firstName} ${row.original.lastName}`}
//                             title="Edit"
//                         >
//                             <ModeEditIcon fontSize="small" />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original)}
//                             className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center"
//                             aria-label={`Delete ${row.original.firstName} ${row.original.lastName}`}
//                             title="Delete"
//                         >
//                             <DeleteOutlineIcon fontSize="small" />
//                         </button>
//                     </div>
//                 ),
//                 size: 150,
//                 enableSorting: false,
//             },
//         ],
//         [],
//     )

//     const table = useReactTable<Employee>({
//         data: employeeData.filteredData,
//         columns,
//         state: { globalFilter, pagination, sorting },
//         onGlobalFilterChange: setGlobalFilter,
//         onPaginationChange: setPagination,
//         onSortingChange: setSorting,
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//     })

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 px-0 py-8 sm:px-6 lg:px-8">
//             <ToastContainer />
//             <div className="max-w-7xl mx-auto">
//                 {/* Header Section */}
//                 <div className="mb-8">
//                     <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
//                         <div className="flex items-center">

//                             <h1 className="text-2xl font-bold text-gray-800 text-left">Employees</h1>
//                         </div>
//                         <NavigateBtn
//                             to="/employe/add"
//                             label={
//                                 <span className="flex items-center gap-1 min-w-[10rem] ">
//                                     <AddIcon fontSize="small" />
//                                     <span>Add New Employee</span>
//                                 </span>
//                             }
//                         />
//                     </div>
//                 </div>

//                 {/* Card Container */}
//                 <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
//                     {/* Table Header */}
//                     <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-gray-100">
//                         <div className="relative flex-1">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <SearchIcon className="text-gray-400" style={{ fontSize: "1.2rem" }} />
//                             </div>
//                             <input
//                                 type="text"
//                                 placeholder="Search employees by name, phone, role, employee ID, or store..."
//                                 value={globalFilter}
//                                 onChange={(e) => setGlobalFilter(e.target.value)}
//                                 className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400"
//                             />
//                         </div>
//                     </div>

//                     {/* Table Section */}
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 {table.getHeaderGroups().map((headerGroup) => (
//                                     <tr key={headerGroup.id}>
//                                         {headerGroup.headers.map((header) => (
//                                             <th
//                                                 key={header.id}
//                                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                                                 style={{ width: header.getSize() }}
//                                                 onClick={header.column.getToggleSortingHandler()}
//                                             >
//                                                 <div className="flex items-center">
//                                                     {flexRender(header.column.columnDef.header, header.getContext())}
//                                                     {header.column.getCanSort() && (
//                                                         <span className="ml-1">
//                                                             {{
//                                                                 asc: "↑",
//                                                                 desc: "↓",
//                                                             }[header.column.getIsSorted() as string] ?? "↕"}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 ))}
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-100">
//                                 {table.getRowModel().rows.map((row) => (
//                                     <tr key={row.id} className="hover:bg-gray-50 transition-colors">
//                                         {row.getVisibleCells().map((cell) => (
//                                             <td key={cell.id} className="px-6 py-4">
//                                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                             </td>
//                                         ))}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Empty State */}
//                     {table.getRowModel().rows.length === 0 && (
//                         <div className="p-12 text-center">
//                             <div className="mx-auto max-w-md">
//                                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={1}
//                                         d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                     />
//                                 </svg>
//                                 <h3 className="mt-2 text-lg font-medium text-gray-900">No employees found</h3>
//                                 <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new employee.</p>
//                                 <div className="mt-6">
//                                     <NavigateBtn
//                                         to="/employe/add"
//                                         label="Add New Employee"
//                                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Pagination */}
//                     <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
//                         <div className="text-sm text-gray-500 mb-4 sm:mb-0">
//                             Showing{" "}
//                             <span className="font-medium">
//                                 {pagination.pageIndex * pagination.pageSize + 1}-{" "}
//                                 {Math.min((pagination.pageIndex + 1) * pagination.pageSize, employeeData.filteredData.length)}
//                             </span>{" "}
//                             of <span className="font-medium">{employeeData.filteredData.length}</span> employees
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <button
//                                 className="px-3.5 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
//                                 onClick={() => table.previousPage()}
//                                 disabled={!table.getCanPreviousPage()}
//                             >
//                                 Previous
//                             </button>
//                             <div className="flex gap-1">
//                                 {Array.from({ length: table.getPageCount() }, (_, i) => (
//                                     <button
//                                         key={i}
//                                         className={`px-3.5 py-1.5 border rounded-md text-sm font-medium ${pagination.pageIndex === i
//                                             ? "border-[#EF9F9F] text-[#F47C7C] bg-[#FFF2F2]"
//                                             : "border-gray-200 text-gray-700 hover:bg-gray-50"
//                                             }`}
//                                         onClick={() => table.setPageIndex(i)}
//                                     >
//                                         {i + 1}
//                                     </button>
//                                 ))}
//                             </div>
//                             <button
//                                 className="px-3.5 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
//                                 onClick={() => table.nextPage()}
//                                 disabled={!table.getCanNextPage()}
//                             >
//                                 Next
//                             </button>
//                             <select
//                                 value={table.getState().pagination.pageSize}
//                                 onChange={(e) => {
//                                     table.setPageSize(Number(e.target.value))
//                                 }}
//                                 className="px-2 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
//                             >
//                                 {PAGE_SIZES.map((pageSize) => (
//                                     <option key={pageSize} value={pageSize}>
//                                         Show {pageSize}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ViewEmploye
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    type ColumnDef,
} from "@tanstack/react-table"
import NavigateBtn from "../../../components/button/NavigateBtn"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from "@mui/icons-material/Add"
import VisibilityIcon from "@mui/icons-material/Visibility"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import SearchIcon from "@mui/icons-material/Search"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import callApi from "../../../util/admin_api"
import type { AxiosResponse } from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Fuse from "fuse.js"

type Store = {
    _id?: string;
    name: string;
    location: string;
    phone: string;
};

type Employee = {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    EmployeeeId: string;
    store: Store;
};

interface ApiResponse<T> {
    statusCode: number
    success: boolean
    message: string
    data: T
    meta: any | null
}

const columnHelper = createColumnHelper<Employee>()

const ViewEmploye: React.FC = () => {
    const [employeeData, setEmployeeData] = useState<{
        allData: Employee[]
        filteredData: Employee[]
    }>({ allData: [], filteredData: [] })
    const [globalFilter, setGlobalFilter] = useState("")
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    })
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([{ id: "createdAt", desc: true }])
    const [loading, setLoading] = useState(true)
    const PAGE_SIZES = [5, 10, 20, 30, 50]
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true)
                const response: AxiosResponse<ApiResponse<Employee[]>> = await callApi({
                    url: "/employee/store",
                    method: "GET",
                })

                if (!response.data.success || !Array.isArray(response.data.data)) {
                    throw new Error(response.data.message || "Invalid API response format")
                }

                setEmployeeData({ allData: response.data.data, filteredData: response.data.data })
                console.log("Fetched employees:", response.data.data)
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Failed to fetch employees"
                console.error("Error fetching employees:", errorMessage)
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 3000,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchEmployees()
    }, [])

    // Fuzzy search implementation
    const fuse = useMemo(
        () =>
            new Fuse(employeeData.allData, {
                keys: [
                    { name: "firstName", getFn: (emp) => emp.firstName || "" },
                    { name: "lastName", getFn: (emp) => emp.lastName || "" },
                    "phone",
                    "role",
                    "EmployeeeId",
                    { name: "store", getFn: (emp) => emp.store?.name || "" },
                ],
                threshold: 0.3,
            }),
        [employeeData.allData],
    )

    // Update filteredData based on globalFilter
    useEffect(() => {
        if (!globalFilter) {
            setEmployeeData((prev) => ({ ...prev, filteredData: prev.allData }))
            console.log("No filter applied, using all data:", employeeData.allData)
        } else {
            try {
                const searchResults = fuse.search(globalFilter).map((result) => result.item)
                setEmployeeData((prev) => ({ ...prev, filteredData: searchResults }))
                console.log("Filtered data:", searchResults)
            } catch (error) {
                console.error("Error in fuzzy search:", error)
                toast.error("Error filtering data.")
                setEmployeeData((prev) => ({ ...prev, filteredData: prev.allData }))
            }
        }
    }, [globalFilter, fuse])

    const handleView = (row: Employee) => {
        try {
            console.log("Viewing:", row)
            navigate(`/employe/view/${row._id}`, {
                state: {
                    id: row._id,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    phone: row.phone,
                    role: row.role,
                    EmployeeeId: row.EmployeeeId,
                    store: row.store,
                },
            })
        } catch (error) {
            console.error("Error navigating to view:", error)
            toast.error("Failed to initiate view.")
        }
    }

    const handleEdit = (row: Employee) => {
        try {
            console.log("Editing:", row)
            navigate(`/employe/edit/${row._id}`, {
                state: {
                    id: row._id,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    phone: row.phone,
                    role: row.role,
                    EmployeeeId: row.EmployeeeId,
                    store: row.store,
                },
            })
        } catch (error) {
            console.error("Error navigating to edit:", error)
            toast.error("Failed to initiate edit.")
        }
    }

    const handleDelete = async (row: Employee) => {
        if (window.confirm(`Are you sure you want to delete ${row.firstName} ${row.lastName}?`)) {
            try {
                const response: AxiosResponse<ApiResponse<unknown>> = await callApi({
                    url: `/employe/${row._id}`,
                    method: "DELETE",
                })

                if (!response.data.success) {
                    throw new Error(response.data.message || "Failed to delete employee")
                }

                const employeeId = row._id
                setEmployeeData((prev) => ({
                    allData: prev.allData.filter((emp) => emp._id !== employeeId),
                    filteredData: prev.filteredData.filter((emp) => emp._id !== employeeId),
                }))
                toast.success(`${row.firstName} ${row.lastName} deleted successfully!`)
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Failed to delete employee"
                console.error("Error deleting employee:", errorMessage)
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 3000,
                })
            }
        }
    }

    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }, [globalFilter])

    const columns = useMemo<ColumnDef<Employee, any>[]>(
        () => [
            columnHelper.accessor("firstName", {
                header: "Name",
                cell: (info) => (
                    <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                            {info.row.original.firstName} {info.row.original.lastName}
                        </span>
                    </div>
                ),
                size: 200,
                enableSorting: true,
            }),
            columnHelper.accessor("EmployeeeId", {
                header: "Employee ID",
                cell: (info) => (
                    <span className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                        {info.getValue()}
                    </span>
                ),
                size: 150,
                enableSorting: true,
            }),
            columnHelper.accessor("phone", {
                header: "Phone",
                cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
                size: 150,
                enableSorting: true,
            }),
            columnHelper.accessor("role", {
                header: "Role",
                cell: (info) => (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {info.getValue()}
                    </span>
                ),
                size: 120,
                enableSorting: true,
            }),
            // columnHelper.accessor("isActive", {
            //     header: "Status",
            //     cell: (info) => (
            //         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            //             }`}>
            //             {info.getValue() ? 'Active' : 'Inactive'}
            //         </span>
            //     ),
            //     size: 120,
            //     enableSorting: true,
            // }),
            columnHelper.accessor("store", {
                header: "Store",
                cell: (info) => <span className="text-gray-600">{info.getValue()?.name || 'N/A'}</span>,
                size: 200,
                enableSorting: true,
            }),
            columnHelper.accessor("createdAt", {
                header: "Created At",
                cell: (info) => (
                    <span className="text-gray-600">
                        {new Date(info.getValue()).toLocaleDateString()}
                    </span>
                ),
                size: 150,
                enableSorting: true,
            }),
            columnHelper.accessor("updatedAt", {
                header: "Updated At",
                cell: (info) => (
                    <span className="text-gray-600">
                        {new Date(info.getValue()).toLocaleDateString()}
                    </span>
                ),
                size: 150,
                enableSorting: true,
            }),
            {
                id: "actions",
                header: () => <div className="text-center w-full">Actions</div>,
                cell: ({ row }) => (
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => handleView(row.original)}
                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors flex items-center"
                            aria-label={`View ${row.original.firstName} ${row.original.lastName}`}
                            title="View"
                        >
                            <VisibilityIcon fontSize="small" />
                        </button>
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center"
                            aria-label={`Edit ${row.original.firstName} ${row.original.lastName}`}
                            title="Edit"
                        >
                            <ModeEditIcon fontSize="small" />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center"
                            aria-label={`Delete ${row.original.firstName} ${row.original.lastName}`}
                            title="Delete"
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </button>
                    </div>
                ),
                size: 150,
                enableSorting: false,
            },
        ],
        [],
    )

    const table = useReactTable<Employee>({
        data: employeeData.filteredData,
        columns,
        state: { globalFilter, pagination, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-0 py-8 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
                        <div className="flex items-center">

                            <h1 className="text-2xl font-bold text-gray-800 text-left">Employees</h1>
                        </div>
                        <NavigateBtn
                            to="/employe/add"
                            label={
                                <span className="flex items-center gap-1 min-w-[10rem] ">
                                    <AddIcon fontSize="small" />
                                    <span>Add New Employee</span>
                                </span>
                            }
                        />
                    </div>
                </div>

                {/* Card Container */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-gray-100">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="text-gray-400" style={{ fontSize: "1.2rem" }} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search employees by name, phone, role, employee ID, or store..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                                style={{ width: header.getSize() }}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <div className="flex items-center">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && (
                                                        <span className="ml-1">
                                                            {{
                                                                asc: "↑",
                                                                desc: "↓",
                                                            }[header.column.getIsSorted() as string] ?? "↕"}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {table.getRowModel().rows.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="mx-auto max-w-md">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No employees found</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new employee.</p>
                                <div className="mt-6">
                                    <NavigateBtn
                                        to="/employe/add"
                                        label="Add New Employee"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                            Showing{" "}
                            <span className="font-medium">
                                {pagination.pageIndex * pagination.pageSize + 1}-{" "}
                                {Math.min((pagination.pageIndex + 1) * pagination.pageSize, employeeData.filteredData.length)}
                            </span>{" "}
                            of <span className="font-medium">{employeeData.filteredData.length}</span> employees
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-3.5 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: table.getPageCount() }, (_, i) => (
                                    <button
                                        key={i}
                                        className={`px-3.5 py-1.5 border rounded-md text-sm font-medium ${pagination.pageIndex === i
                                            ? "border-[#EF9F9F] text-[#F47C7C] bg-[#FFF2F2]"
                                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        onClick={() => table.setPageIndex(i)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="px-3.5 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </button>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => {
                                    table.setPageSize(Number(e.target.value))
                                }}
                                className="px-2 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
                            >
                                {PAGE_SIZES.map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewEmploye
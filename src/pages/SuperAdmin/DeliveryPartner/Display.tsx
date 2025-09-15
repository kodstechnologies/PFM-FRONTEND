// import React, { useMemo, useState, useEffect } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
//   createColumnHelper,
//   ColumnDef,
// } from "@tanstack/react-table";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import VerifiedIcon from "@mui/icons-material/Verified";
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
// import ModeEditIcon from "@mui/icons-material/ModeEdit";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import Fuse from "fuse.js";
// import "react-toastify/dist/ReactToastify.css";
// import { callApi } from "../../../util/admin_api"; // ✅ your axios/fetch wrapper
// import NavigateBtn from "../../../components/button/NavigateBtn";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import AddIcon from "@mui/icons-material/Add";
// import SearchIcon from "@mui/icons-material/Search";

// // Match your Mongoose schema structure
// type DeliveryPartner = {
//   _id: string;
//   name: string;
//   phone: string;
//   status: "verified" | "pending";
//   overallDocumentStatus: "verified" | "pending" | "rejected";
//   store?: {
//     _id: string;
//     name: string;
//   };
// };

// const columnHelper = createColumnHelper<DeliveryPartner>();

// const StoreStaffDisplay: React.FC = () => {
//   const [data, setData] = useState<DeliveryPartner[]>([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
//   const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([
//     { id: "slNo", desc: false }, // Sort by serial number (ascending)
//   ]);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const PAGE_SIZES = [5, 10, 20, 30, 50];
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ Fetch from API
//   const fetchPartners = async (showLoading = false) => {
//     try {
//       if (showLoading) setIsRefreshing(true);

//       const response = await callApi({
//         endpoint: "/admin/delivery-partners?limit=-1",
//         method: "GET"
//       });
//       // console.log("🚀 ~ fetchPartners ~ response:", response)
//       // console.log("🚀 ~ fetchPartners ~ response.data:", response.data)
//       // console.log("🚀 ~ fetchPartners ~ deliveryPartners:", response.data?.deliveryPartners)

//       if (response.data?.deliveryPartners) {
//         // Keep data in original order (time-wise, as created)
//         setData(response.data.deliveryPartners);
//       } else {
//         console.warn("No deliveryPartners found in response");
//         setData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching delivery partners:", error);
//       toast.error("Failed to fetch delivery partners.");
//       setData([]);
//     } finally {
//       if (showLoading) setIsRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchPartners();
//   }, []);

//   // Refresh data when component becomes visible (when navigating back to page)
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (!document.hidden) {
//         fetchPartners();
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);

//   // Refresh data when navigating back to this page
//   useEffect(() => {
//     if (location.pathname === '/delivery-partner') {
//       fetchPartners();
//     }
//   }, [location.pathname]);

//   // Fuzzy search
//   const fuse = useMemo(
//     () =>
//       new Fuse(data, {
//         keys: ["_id", "name", "phone", "store.name"],
//         threshold: 0.3,
//       }),
//     [data]
//   );

//   const filteredData = useMemo(() => {
//     let result = data;
//     if (globalFilter) {
//       result = fuse.search(globalFilter).map((r: any) => r.item);
//     }
//     if (statusFilter) {
//       result = result.filter(
//         (item) =>
//           item.status.toLowerCase() === statusFilter.toLowerCase() ||
//           item.overallDocumentStatus.toLowerCase() ===
//           statusFilter.toLowerCase()
//       );
//     }
//     return result;
//   }, [data, globalFilter, statusFilter]);

//   const handleEdit = (row: DeliveryPartner) => {
//     try {
//       navigate(`/delivery-partner/edit/${row._id}`, { state: row });
//     } catch (error) {
//       console.error("Error navigating to edit:", error);
//       toast.error("Failed to initiate edit.");
//     }
//   };

//   const handleDelete = async (row: DeliveryPartner) => {
//     if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
//       try {
//         await callApi({ endpoint: `/admin/delivery-partners/${row._id}`, method: "DELETE" });
//         setData((prev) => prev.filter((partner) => partner._id !== row._id));
//         toast.success(`${row.name} deleted successfully!`);
//       } catch (error) {
//         console.error("Error deleting partner:", error);
//         toast.error("Failed to delete partner.");
//       }
//     }
//   };

//   // Reset pagination when filter changes
//   useEffect(() => {
//     setPagination((prev) => ({ ...prev, pageIndex: 0 }));
//   }, [globalFilter, statusFilter]);

//   // ✅ Define table columns
//   const columns = useMemo<ColumnDef<DeliveryPartner, any>[]>(
//     () => [
//       {
//         id: "slNo",
//         header: "SL NO.",
//         cell: ({ row }) => (
//           <span className="font-medium text-gray-600">
//             {row.index + 1}
//           </span>
//         ),
//         size: 80,
//         enableSorting: false, // Disable sorting for serial number
//       },
//       columnHelper.accessor("name", {
//         header: "Name",
//         cell: (info) => (
//           <span className="font-medium text-gray-800">{info.getValue()}</span>
//         ),
//         size: 200,
//       }),
//       columnHelper.accessor("phone", {
//         header: "Phone",
//         cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
//         size: 180,
//       }),
//       columnHelper.accessor("store", {
//         header: "Store Name",
//         cell: (info) => {
//           const store = info.getValue();
//           return (
//             <span className="text-gray-700 font-medium">
//               {store?.name || "No Store Assigned"}
//             </span>
//           );
//         },
//         size: 200,
//       }),
//       columnHelper.accessor("status", {
//         header: "Status",
//         cell: (info) => {
//           const value = info.getValue();
//           const isVerified = value === "verified";
//           return (
//             <div
//               className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${isVerified
//                 ? "bg-green-50 text-green-700"
//                 : "bg-yellow-50 text-yellow-700"
//                 }`}
//             >
//               {isVerified ? (
//                 <VerifiedIcon className="w-3 h-3 mr-1" />
//               ) : (
//                 <PendingActionsIcon className="w-3 h-3 mr-1" />
//               )}
//               {value}
//             </div>
//           );
//         },
//         size: 120,
//       }),
//       {
//         id: "actions",
//         header: "Actions",
//         cell: ({ row }) => (
//           <div className="flex justify-center gap-2">
//             <button
//               onClick={() => handleEdit(row.original)}
//               className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
//               title="Edit"
//             >
//               <ModeEditIcon fontSize="small" />
//             </button>
//             <button
//               onClick={() => handleDelete(row.original)}
//               className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
//               title="Delete"
//             >
//               <DeleteOutlineIcon fontSize="small" />
//             </button>
//           </div>
//         ),
//         size: 150,
//       },
//     ],
//     []
//   );

//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     state: { globalFilter, pagination, sorting },
//     onGlobalFilterChange: setGlobalFilter,
//     onPaginationChange: setPagination,
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     globalFilterFn: (row, columnId, filterValue) => {
//       const value = row.getValue(columnId);
//       return String(value).toLowerCase().includes(filterValue.toLowerCase());
//     },
//   });


//   return (
//     <div className="min-h-screen bg-gray-50 px-0 py-8 sm:px-6 lg:px-8">
//       <ToastContainer />
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
//             <div className='w-full'>
//               <h2 className="text-2xl font-bold text-gray-800">Delivery Partner</h2>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => fetchPartners(true)}
//                 disabled={isRefreshing}
//                 className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Refresh data"
//               >
//                 <svg
//                   className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
//               </button>
//               <NavigateBtn
//                 to="/delivery-partner/add"
//                 label={
//                   <span className="flex items-center gap-1 min-w-[8rem]">
//                     <AddIcon fontSize="small" />
//                     <span>Add New Staff</span>
//                   </span>
//                 }
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Card Container */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           {/* Filters Section */}
//           <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-gray-100">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <SearchIcon className="text-gray-400" style={{ fontSize: '1.2rem' }} />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by name, phone, or store..."
//                 value={globalFilter}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400"
//               />
//             </div>
//             <div className="relative w-full sm:w-48">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FilterListIcon className="text-gray-400" style={{ fontSize: '1.2rem' }} />
//               </div>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="pl-10 pr-8 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none transition bg-white"
//               >
//                 <option value="">All Statuses</option>
//                 <option value="Verified">Verified</option>
//                 <option value="Pending Docs">Pending </option>
//                 {/* <option value="Rejected">Rejected </option> */}
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//                 <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Table Section */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <tr key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <th
//                         key={header.id}
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                         style={{ width: header.getSize() }}
//                         onClick={header.column.getToggleSortingHandler()}
//                       >
//                         <div className="flex items-center">
//                           {flexRender(header.column.columnDef.header, header.getContext())}
//                           {header.column.getCanSort() && (
//                             <span className="ml-1">
//                               {{
//                                 asc: '↑',
//                                 desc: '↓',
//                               }[header.column.getIsSorted() as string] ?? '↕'}
//                             </span>
//                           )}
//                         </div>
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-100">
//                 {table.getRowModel().rows.map((row) => (
//                   <tr key={row.id} className="hover:bg-gray-50 transition-colors">
//                     {row.getVisibleCells().map((cell) => (
//                       <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//                 {table.getRowModel().rows.length === 0 && (
//                   <tr>
//                     <td colSpan={columns.length} className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         {/* Loader spinner */}
//                         <svg
//                           className="animate-spin w-10 h-10 text-indigo-500 mb-4"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                           ></path>
//                         </svg>
//                         <p className="text-sm text-gray-500">Loading staff members...</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}

//               </tbody>
//             </table>
//           </div>

//           {/* Footer Section */}
//           <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
//             <div className="text-sm text-gray-500 mb-4 sm:mb-0">
//               Showing{' '}
//               <span className="font-medium">
//                 {pagination.pageIndex * pagination.pageSize + 1}-
//                 {Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredData.length)}
//               </span>{' '}
//               of <span className="font-medium">{filteredData.length}</span> staff members
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 className="px-3.5 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 Previous
//               </button>
//               <div className="flex gap-1">
//                 {Array.from({ length: table.getPageCount() }, (_, i) => (
//                   <button
//                     key={i}
//                     className={`px-3.5 py-1.5 border rounded-md text-sm font-medium ${pagination.pageIndex === i
//                       ? 'border-[#EF9F9F] text-[#F47C7C] bg-[#FFF2F2]'
//                       : 'border-gray-200 text-gray-700 hover:bg-gray-50'
//                       }`}
//                     onClick={() => table.setPageIndex(i)}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 className="px-3.5 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//               >
//                 Next
//               </button>
//               <select
//                 value={table.getState().pagination.pageSize}
//                 onChange={(e) => {
//                   table.setPageSize(Number(e.target.value));
//                 }}
//                 className="px-2 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
//               >
//                 {PAGE_SIZES.map((pageSize) => (
//                   <option key={pageSize} value={pageSize}>
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StoreStaffDisplay;



import React, { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import VerifiedIcon from "@mui/icons-material/Verified";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Fuse from "fuse.js";
import "react-toastify/dist/ReactToastify.css";
import { callApi } from "../../../util/admin_api";
import NavigateBtn from "../../../components/button/NavigateBtn";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

type DeliveryPartner = {
  _id: string;
  name: string;
  phone: string;
  status: "verified" | "pending";
  overallDocumentStatus: "verified" | "pending" | "rejected";
  store?: {
    _id: string;
    name: string;
  };
};

const columnHelper = createColumnHelper<DeliveryPartner>();

const StoreStaffDisplay: React.FC = () => {
  const [data, setData] = useState<DeliveryPartner[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([
    { id: "slNo", desc: false },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const PAGE_SIZES = [5, 10, 20, 30, 50];
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch delivery partners
  const fetchPartners = async (showLoading = false) => {
    try {
      if (showLoading) setIsRefreshing(true);
      setIsLoading(true);

      const response = await callApi({
        endpoint: "/admin/delivery-partners?limit=-1",
        method: "GET"
      });

      if (response.data?.deliveryPartners) {
        setData(response.data.deliveryPartners);
      } else {
        console.warn("No deliveryPartners found in response");
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching delivery partners:", error);
      toast.error("Failed to fetch delivery partners.");
      setData([]);
    } finally {
      setIsLoading(false);
      if (showLoading) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Refresh data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPartners();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Refresh data when navigating back to this page
  useEffect(() => {
    if (location.pathname === '/delivery-partner') {
      fetchPartners();
    }
  }, [location.pathname]);

  // Fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: ["_id", "name", "phone", "store.name"],
        threshold: 0.3,
      }),
    [data]
  );

  const filteredData = useMemo(() => {
    let result = data;
    if (globalFilter) {
      result = fuse.search(globalFilter).map((r: any) => r.item);
    }
    if (statusFilter) {
      result = result.filter(
        (item) =>
          item.status.toLowerCase() === statusFilter.toLowerCase() ||
          item.overallDocumentStatus.toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }
    return result;
  }, [data, globalFilter, statusFilter, fuse]);

  const handleEdit = (row: DeliveryPartner) => {
    try {
      navigate(`/delivery-partner/edit/${row._id}`, { state: row });
    } catch (error) {
      console.error("Error navigating to edit:", error);
      toast.error("Failed to initiate edit.");
    }
  };

  const handleDelete = async (row: DeliveryPartner) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      try {
        await callApi({ endpoint: `/admin/delivery-partners/${row._id}`, method: "DELETE" });
        setData((prev) => prev.filter((partner) => partner._id !== row._id));
        toast.success(`${row.name} deleted successfully!`);
      } catch (error) {
        console.error("Error deleting partner:", error);
        toast.error("Failed to delete partner.");
      }
    }
  };

  // Reset pagination when filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [globalFilter, statusFilter]);

  // Define table columns
  const columns = useMemo<ColumnDef<DeliveryPartner, any>[]>(
    () => [
      {
        id: "slNo",
        header: "SL NO.",
        cell: ({ row }) => (
          <span className="font-medium text-gray-600">
            {pagination.pageIndex * pagination.pageSize + row.index + 1}
          </span>
        ),
        size: 80,
        enableSorting: false,
      },
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <span className="font-medium text-gray-800">{info.getValue()}</span>
        ),
        size: 200,
      }),
      columnHelper.accessor("phone", {
        header: "Phone",
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
        size: 180,
      }),
      columnHelper.accessor("store", {
        header: "Store Name",
        cell: (info) => {
          const store = info.getValue();
          return (
            <span className="text-gray-700 font-medium">
              {store?.name || "No Store Assigned"}
            </span>
          );
        },
        size: 200,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const isVerified = value === "verified";
          return (
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${isVerified
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
                }`}
            >
              {isVerified ? (
                <VerifiedIcon className="w-3 h-3 mr-1" />
              ) : (
                <PendingActionsIcon className="w-3 h-3 mr-1" />
              )}
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </div>
          );
        },
        size: 120,
      }),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Edit"
            >
              <ModeEditIcon fontSize="small" />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Delete"
            >
              <DeleteOutlineIcon fontSize="small" />
            </button>
          </div>
        ),
        size: 150,
      },
    ],
    [pagination]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, pagination, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Delivery Partners</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your delivery staff and their status</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => fetchPartners(true)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Refresh data"
              >
                <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <NavigateBtn
                to="/delivery-partner/add"
                label={
                  <span className="flex items-center gap-1">
                    <AddIcon fontSize="small" />
                    <span>Add New Staff</span>
                  </span>
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-gray-200">
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" style={{ fontSize: '1.2rem' }} />
              </div>
              <input
                type="text"
                placeholder="Search by name, phone, or store..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterListIcon className="text-gray-400" style={{ fontSize: '1.2rem' }} />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none transition bg-white"
              >
                <option value="">All Statuses</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
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
                                asc: '↑',
                                desc: '↓',
                              }[header.column.getIsSorted() as string] ?? '↕'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-sm text-gray-500">Loading delivery partners...</p>
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-gray-500 font-medium">No delivery partners found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {globalFilter || statusFilter ? 'Try adjusting your search or filter' : 'Get started by adding a new delivery partner'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          {!isLoading && filteredData.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                Showing{' '}
                <span className="font-medium">
                  {pagination.pageIndex * pagination.pageSize + 1}-
                  {Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredData.length)}
                </span>{' '}
                of <span className="font-medium">{filteredData.length}</span> delivery partners
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: table.getPageCount() }, (_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1.5 border rounded-md text-sm font-medium ${pagination.pageIndex === i
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      onClick={() => table.setPageIndex(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </button>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
                >
                  {PAGE_SIZES.map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreStaffDisplay;
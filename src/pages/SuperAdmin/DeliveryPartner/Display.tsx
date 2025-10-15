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
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
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
  status: boolean;
  overallDocumentStatus?: "verified" | "pending" | "rejected";
  store?: string | {
    _id: string;
    name: string;
  };
};

type FullDeliveryPartner = {
  documentStatus: {
    idProof: "verified" | "pending" | "rejected";
    addressProof: "verified" | "pending" | "rejected";
    panProof: "verified" | "pending" | "rejected";
    vehicleDocuments: "verified" | "pending" | "rejected";
    drivingLicense: "verified" | "pending" | "rejected";
    insuranceDocuments: "verified" | "pending" | "rejected";
  };
  _id: string;
  name: string;
  lastName: string;
  img: string | null;
  dob: string;
  guardianName: string;
  phone: string;
  emergencyContact: string;
  email: string;
  permanentAddress: string;
  currentAddress: string;
  pin: string;
  status: "verified" | "pending";
  bankAccountNumber: string;
  IFSCCode: string;
  accountHolderName: string;
  store: {
    _id: string;
    name: string;
  } | null;
  overallDocumentStatus: "verified" | "pending" | "rejected";
  isActive: boolean;
  assignedOrders: any[];
  totalDeliveries: number;
  totalAccepted: number;
  totalRejected: number;
  rating: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  age: number;
};

const columnHelper = createColumnHelper<DeliveryPartner>();

const StoreStaffDisplay: React.FC = () => {
  const capitalize = (str?: string): string => {
    if (!str || typeof str !== 'string') return 'Unknown';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const mapStatus = (status: any): string => {
    if (typeof status === 'boolean') {
      return status ? 'verified' : 'pending';
    } else if (typeof status === 'string') {
      return status;
    }
    return 'pending';
  };

  const [data, setData] = useState<DeliveryPartner[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([
    { id: "slNo", desc: false },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<FullDeliveryPartner | null>(null);

  const PAGE_SIZES = [5, 10, 20, 30, 50];
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch delivery partners
  const fetchPartners = async (showLoading = false) => {
    try {
      if (showLoading) setIsRefreshing(true);
      setIsLoading(true);

      const response = await callApi({
        endpoint: "/admin/delivery-partners",
        method: "GET"
      });

      if (response.success && response.data) {
        setData(response.data);
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
        keys: ["_id", "name", "phone", "store"],
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
        (item) => {
          const itemStatus = mapStatus(item.status);
          const docStatus = item.overallDocumentStatus ? item.overallDocumentStatus.toLowerCase() : '';
          return itemStatus.toLowerCase() === statusFilter.toLowerCase() ||
            docStatus === statusFilter.toLowerCase();
        }
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

  const handleView = async (row: DeliveryPartner) => {
    try {
      const response = await callApi({
        endpoint: `/admin/delivery-partners/${row._id}`,
        method: "GET"
      });
      if (response.success && response.data) {
        setSelectedPartner(response.data);
        setModalOpen(true);
      } else {
        toast.error("Failed to fetch partner details.");
      }
    } catch (error) {
      console.error("Error fetching partner details:", error);
      toast.error("Failed to fetch partner details.");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPartner(null);
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
          let storeName = '';
          if (typeof store === 'string') {
            storeName = store;
          } else if (store && typeof store === 'object' && store.name) {
            storeName = store.name;
          }
          return (
            <span className="text-gray-700 font-medium">
              {storeName || "No Store Assigned"}
            </span>
          );
        },
        size: 200,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const value = mapStatus(info.getValue());
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
              {capitalize(value)}
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
              onClick={() => handleView(row.original)}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              title="View"
            >
              <VisibilityIcon fontSize="small" />
            </button>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-50 text-green-700";
      case "pending": return "bg-yellow-50 text-yellow-700";
      case "rejected": return "bg-red-50 text-red-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <VerifiedIcon className="w-3 h-3 mr-1" />;
      case "pending": return <PendingActionsIcon className="w-3 h-3 mr-1" />;
      case "rejected": return <span className="w-3 h-3 mr-1">❌</span>;
      default: return null;
    }
  };

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

      {/* View Modal */}
      {modalOpen && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {selectedPartner.img ? (
                    <img
                      src={selectedPartner.img}
                      alt={`${selectedPartner.name} ${selectedPartner.lastName}`}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {selectedPartner.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{`${selectedPartner.name} ${selectedPartner.lastName}`}</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPartner.status)}`}>
                    {getStatusIcon(selectedPartner.status)}
                    {capitalize(selectedPartner.status)}
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <CloseIcon fontSize="medium" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedPartner.img && (
                    <div className="md:col-span-2 flex justify-center">
                      <img
                        src={selectedPartner.img}
                        alt={`${selectedPartner.name} ${selectedPartner.lastName}`}
                        className="w-48 h-48 object-cover rounded-xl shadow-lg ring-2 ring-gray-200"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                    <p className="text-gray-900 font-medium">{new Date(selectedPartner.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                    <p className="text-gray-900 font-medium">{selectedPartner.age}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Guardian Name</label>
                    <p className="text-gray-900 font-medium">{selectedPartner.guardianName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-gray-900 font-medium">{selectedPartner.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900 font-medium">{selectedPartner.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact</label>
                    <p className="text-gray-900 font-medium">{selectedPartner.emergencyContact}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Address Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Permanent Address</label>
                    <p className="text-gray-900 font-medium">{selectedPartner.permanentAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Current Address</label>
                    <p className="text-gray-900 font-medium">{selectedPartner.currentAddress}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">PIN Code</label>
                      <p className="text-gray-900 font-medium">{selectedPartner.pin}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Store</label>
                      <p className="text-gray-900 font-medium">{selectedPartner.store?.name || "No Store Assigned"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Information */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Bank Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Account Holder Name</label>
                    <p className="text-gray-900 font-medium">{selectedPartner.accountHolderName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Bank Account Number</label>
                    <p className="text-gray-900 font-medium">****{selectedPartner.bankAccountNumber?.slice(-4)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">IFSC Code</label>
                    <p className="text-gray-900 font-medium">{selectedPartner.IFSCCode}</p>
                  </div>
                </div>
              </div>

              {/* Document Status */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Document Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {Object.entries(selectedPartner.documentStatus).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(value)}`}>
                        {getStatusIcon(value)}
                        {capitalize(value)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Overall Document Status</label>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(selectedPartner.overallDocumentStatus)}`}>
                    {getStatusIcon(selectedPartner.overallDocumentStatus)}
                    {capitalize(selectedPartner.overallDocumentStatus)}
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                    <label className="block text-sm font-medium text-gray-500 mb-2">Total Deliveries</label>
                    <p className="text-2xl font-bold text-gray-900">{selectedPartner.totalDeliveries}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                    <label className="block text-sm font-medium text-gray-500 mb-2">Total Accepted</label>
                    <p className="text-2xl font-bold text-green-600">{selectedPartner.totalAccepted}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                    <label className="block text-sm font-medium text-gray-500 mb-2">Total Rejected</label>
                    <p className="text-2xl font-bold text-red-600">{selectedPartner.totalRejected}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                    <label className="block text-sm font-medium text-gray-500 mb-2">Rating</label>
                    <p className="text-2xl font-bold text-yellow-600">{selectedPartner.rating}/5</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-2">Is Active</label>
                      <p className={`text-sm font-medium ${selectedPartner.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedPartner.isActive ? '✅ Active' : '❌ Inactive'}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-2">Assigned Orders</label>
                      <p className="text-gray-900 font-medium">{selectedPartner.assignedOrders.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-2">Last Active</label>
                      <p className="text-gray-900 font-medium">{selectedPartner.lastActive ? new Date(selectedPartner.lastActive).toLocaleString() : 'Never'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-2">Created At</label>
                      <p className="text-gray-900 font-medium">{new Date(selectedPartner.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreStaffDisplay;
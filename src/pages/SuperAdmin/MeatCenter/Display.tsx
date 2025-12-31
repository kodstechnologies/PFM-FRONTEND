import type React from "react"
import { useMemo, useState, useEffect } from "react"
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
import AddIcon from "@mui/icons-material/Add"
import VisibilityIcon from "@mui/icons-material/Visibility"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import SearchIcon from "@mui/icons-material/Search"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { toast, ToastContainer } from "react-toastify"
import Fuse from "fuse.js"
import { useNavigate } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import callApi from "../../../util/admin_api"
import type { AxiosResponse } from "axios"

type Store = {
  id: string;
  name: string;
  location: string;
  manager: string;
  managerEmail: string;
  lat: number;
  long: number;
  phone: string;
  storePhone: string;
  pincode?: string;
  totalMembers?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
  meta: any | null
}

const columnHelper = createColumnHelper<Store>()

const MeatCenterDisplay: React.FC = () => {
  const [storeData, setStoreData] = useState<{
    allData: Store[]
    filteredData: Store[]
  }>({ allData: [], filteredData: [] })
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([{ id: "name", desc: false }])
  const [loading, setLoading] = useState(true)
  const PAGE_SIZES = [5, 10, 20, 30, 50]
  const navigate = useNavigate()

  // Fetch meat centers from API
  useEffect(() => {
    const fetchMeatCenters = async () => {
      console.log("Fetching meat centers...")
      try {
        setLoading(true)
        const response: AxiosResponse<ApiResponse<Store[]>> = await callApi({
          url: "/admin/meat-centers",
          method: "GET",
        })

        if (!response.data.success || !Array.isArray(response.data.data)) {
          throw new Error(response.data.message || "Invalid API response format")
        }

        // Map API response to Store type
        const formattedData: Store[] = response.data.data.map((store: any) => ({
          id: store._id,
          name: store.name,
          location: store.location,
          manager: store.manager ? `${store.manager.firstName} ${store.manager.lastName}` : "N/A",
          managerEmail: store.manager?.email || "",
          lat: store.lat,
          long: store.long,
          phone: store.manager?.phone || "",
          storePhone: store.phone,
          pincode: store.pincode,
          totalMembers: store.totalMembers || 0,
          isActive: store.isActive,
          createdAt: store.createdAt,
          updatedAt: store.updatedAt,
        }))

        setStoreData({ allData: formattedData, filteredData: formattedData })
        console.log("Fetched meat centers:", formattedData)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch meat centers"
        console.error("Error fetching meat centers:", errorMessage)
        toast.error(errorMessage, {
          toastId: "fetch-meat-centers-error",
          position: "top-right",
          autoClose: 3000,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMeatCenters()
  }, [])

  // Fuzzy search implementation
  const fuse = useMemo(
    () =>
      new Fuse(storeData.allData, {
        keys: [
          "name",
          "location",
          "lat",
          "long",
          "phone",
          "storePhone",
          "pincode",
          "totalMembers",
        ],
        threshold: 0.3,
      }),
    [storeData.allData],
  )

  // Update filteredData based on globalFilter
  useEffect(() => {
    if (!globalFilter) {
      setStoreData((prev) => ({ ...prev, filteredData: prev.allData }))
      console.log("No filter applied, using all data:", storeData.allData)
    } else {
      try {
        const searchResults = fuse.search(globalFilter).map((result) => result.item)
        setStoreData((prev) => ({ ...prev, filteredData: searchResults }))
        console.log("Filtered data:", searchResults)
      } catch (error) {
        console.error("Error in fuzzy search:", error)
        toast.error("Error filtering data.")
        setStoreData((prev) => ({ ...prev, filteredData: prev.allData }))
      }
    }
  }, [globalFilter, fuse])

  const handleView = (row: Store) => {
    try {
      console.log("Viewing:", row)
      const firstName = row.manager ? row.manager.split(" ")[0] : ""
      const lastName = row.manager ? row.manager.split(" ").slice(1).join(" ") : ""
      const managerName = row.manager || ""

      navigate(`/meat-center/view/${row.id}`, {
        state: {
          id: row.id,
          name: row.name,
          location: row.location,
          manager: managerName,
          managerEmail: row.managerEmail || "",
          firstName,
          lastName,
          lat: row.lat,
          long: row.long,
          phone: row.phone,
          storePhone: row.storePhone,
          pincode: row.pincode,
          totalMembers: row.totalMembers,
        },
      })
    } catch (error) {
      console.error("Error navigating to view:", error)
      toast.error("Failed to initiate view.")
    }
  }

  const handleEdit = (row: Store) => {
    try {
      console.log("Editing:", row)
      const firstName = row.manager ? row.manager.split(" ")[0] : ""
      const lastName = row.manager ? row.manager.split(" ").slice(1).join(" ") : ""
      const managerName = row.manager || ""

      navigate(`/meat-center/edit/${row.id}`, {
        state: {
          id: row.id,
          name: row.name,
          location: row.location,
          manager: managerName,
          managerEmail: row.managerEmail || "",
          firstName,
          lastName,
          lat: row.lat,
          long: row.long,
          phone: row.phone,
          storePhone: row.storePhone,
          pincode: row.pincode,
          totalMembers: row.totalMembers,
        },
      })
    } catch (error) {
      console.error("Error navigating to edit:", error)
      toast.error("Failed to initiate edit.")
    }
  }

  const handleDelete = async (row: Store) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      try {
        const response: AxiosResponse<ApiResponse<unknown>> = await callApi({
          url: `/admin/meat-centers/${row.id}`,
          method: "DELETE",
        })

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to delete meat center")
        }

        const storeId = row.id
        setStoreData((prev) => ({
          allData: prev.allData.filter((store) => store.id !== storeId),
          filteredData: prev.filteredData.filter((store) => store.id !== storeId),
        }))
        toast.success(`${row.name} deleted successfully!`)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete meat center"
        console.error("Error deleting meat center:", errorMessage)
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

  const columns = useMemo<ColumnDef<Store, any>[]>(
    () => [
      columnHelper.accessor("name", {
        header: "Store Name",
        cell: (info) => (
          <div className="flex items-center">
            <span className="font-medium text-gray-900">{info.getValue()}</span>
          </div>
        ),
        size: 250,
        enableSorting: true,
      }),
      columnHelper.accessor("location", {
        header: "Location",
        cell: (info) => (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-600">{info.getValue()}</span>
          </div>
        ),
        size: 300,
        enableSorting: true,
      }),
      columnHelper.accessor("storePhone", {
        header: "Phone",
        cell: (info) => (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-gray-600">{info.getValue()}</span>
          </div>
        ),
        size: 180,
        enableSorting: true,
      }),
      columnHelper.accessor("lat", {
        header: "Latitude",
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
        size: 120,
        enableSorting: true,
      }),
      columnHelper.accessor("long", {
        header: "Longitude",
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
        size: 120,
        enableSorting: true,
      }),
      columnHelper.accessor("pincode", {
        header: "Pincode",
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
        size: 100,
        enableSorting: true,
      }),
      columnHelper.accessor("totalMembers", {
        header: "Total Members",
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
        size: 120,
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
              aria-label={`View ${row.original.name}`}
              title="View"
            >
              <VisibilityIcon fontSize="small" />
            </button>
            <button
              onClick={() => handleEdit(row.original)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center"
              aria-label={`Edit ${row.original.name}`}
              title="Edit"
            >
              <ModeEditIcon fontSize="small" />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center"
              aria-label={`Delete ${row.original.name}`}
              title="Delete"
            >
              <DeleteOutlineIcon fontSize="small" />
            </button>
          </div>
        ),
        size: 200,
        enableSorting: false,
      },
    ],
    [],
  )

  const table = useReactTable<Store>({
    data: storeData.filteredData,
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

  // Debug table data
  useEffect(() => {
    console.log("Table row count:", table.getRowModel().rows.length)
    console.log("Table rows:", table.getRowModel().rows)
    console.log("Filtered data length:", storeData.filteredData.length)
  }, [table, storeData.filteredData])

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
            <div className="w-full">
              <h1 className="text-2xl font-bold text-gray-800 text-left">Meat Center</h1>
            </div>
            <NavigateBtn
              to="/meat-center/add"
              label={
                <span className="flex items-center gap-1 min-w-[10rem] ">
                  <AddIcon fontSize="small" />
                  <span>Add New Store</span>
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
                placeholder="Search stores by name, location, phone, lat, long, pincode, or total members..."
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
                <h3 className="mt-2 text-lg font-medium text-gray-900">No stores found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new store.</p>
                <div className="mt-6">
                  <NavigateBtn
                    to="/meat-center/add"
                    label="Add New Store"
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
                {Math.min((pagination.pageIndex + 1) * pagination.pageSize, storeData.filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{storeData.filteredData.length}</span> stores
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

export default MeatCenterDisplay
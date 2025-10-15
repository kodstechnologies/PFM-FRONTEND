import type React from "react"
import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import EventIcon from "@mui/icons-material/Event"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import callApi from "../../../util/admin_api"
import type { AxiosResponse } from "axios"
import { useNavigate } from "react-router-dom"

// Define API response type
interface ApiResponse<T> {
    statusCode: number
    success: boolean
    message: string
    data: T
    meta: any | null
}

interface Coupon {
    _id: string
    name: string
    code: string
    discount: number
    expiryDate: string
    createdAt: string
    updatedAt: string
    isExpired?: boolean
}

interface CouponForm {
    name: string
    discount: number
    expiryDate: string // DD-MM-YYYY:HH:mm (backend expects this)
    expiryDateLocal?: string // YYYY-MM-DDTHH:mm (for datetime-local input)
}

// Utility to validate DD-MM-YYYY:HH:mm format
const isValidCustomDate = (dateString: string): boolean => {
    const regex = /^(\d{2})-(\d{2})-(\d{4}):(\d{2}):(\d{2})$/
    if (!regex.test(dateString)) return false
    const [_, day, month, year, hours, minutes] = dateString.match(regex)!
    const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00.000Z`)
    return (
        !isNaN(date.getTime()) &&
        Number.parseInt(day) <= 31 &&
        Number.parseInt(month) <= 12 &&
        Number.parseInt(hours) <= 23 &&
        Number.parseInt(minutes) <= 59
    )
}

const toIndianTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
}

const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = date.getTime() - now.getTime()
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays < 0) {
        return `Expired ${Math.abs(diffInDays)} days ago`
    } else if (diffInDays === 0) {
        return "Expires today"
    } else if (diffInDays === 1) {
        return "Expires tomorrow"
    } else if (diffInDays <= 7) {
        return `Expires in ${diffInDays} days`
    } else {
        return `Expires in ${Math.ceil(diffInDays / 7)} weeks`
    }
}

// Utility to convert ISO 8601 to DD-MM-YYYY:HH:mm
const toCustomDate = (isoDate: string): string => {
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) return "Invalid Date"
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${day}-${month}-${year}:${hours}:${minutes}`
}

// Convert DD-MM-YYYY:HH:mm -> YYYY-MM-DDTHH:mm (for input)
const customToDatetimeLocal = (customDate: string): string => {
    const valid = isValidCustomDate(customDate)
    if (!valid) return ""
    const [day, month, year, hours, minutes] = customDate.split(/[-:]/)
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Convert YYYY-MM-DDTHH:mm -> DD-MM-YYYY:HH:mm (to store/send)
const datetimeLocalToCustom = (datetimeLocal: string): string => {
    console.log("🚀 ~ datetimeLocalToCustom ~ datetimeLocal:", datetimeLocal)
    if (!datetimeLocal) return ""
    const [datePart, timePart] = datetimeLocal.split("T")
    if (!datePart || !timePart) return ""
    const [year, month, day] = datePart.split("-")
    const [hours, minutes] = timePart.split(":")
    return `${day}-${month}-${year}:${hours}:${minutes}`
}

const CouponsList: React.FC = () => {
    const navigate = useNavigate()
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [loading, setLoading] = useState(true)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [form, setForm] = useState<CouponForm>({
        name: "",
        discount: 0,
        expiryDate: "",
        expiryDateLocal: "",
    })
    const [formLoading, setFormLoading] = useState(false)

    // Fetch coupons from API
    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        console.log("Fetching coupons...")
        try {
            setLoading(true)
            const response: AxiosResponse<ApiResponse<Coupon[]>> = await callApi({
                url: "/admin/coupons",
                method: "GET",
            })

            if (!response.data.success || !Array.isArray(response.data.data)) {
                throw new Error(response.data.message || "Invalid API response format")
            }

            // Add isExpired property to each coupon
            const couponsWithStatus = response.data.data.map((coupon) => ({
                ...coupon,
                isExpired: new Date(coupon.expiryDate) < new Date(),
            }))

            setCoupons(couponsWithStatus)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch coupons"
            console.error("Error fetching coupons:", errorMessage)
            toast.error(errorMessage, {
                toastId: "fetch-coupons-error",
                position: "top-right",
                autoClose: 3000,
            })
            if (errorMessage.includes("token") || errorMessage.includes("Unauthorized")) {
                localStorage.removeItem("superAdminUser")
                navigate("/admin/login")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, coupon: Coupon) => {
        setAnchorEl(event.currentTarget)
        setSelectedCoupon(coupon)
    }

    const handleClose = () => {
        setAnchorEl(null)
        setSelectedCoupon(null)
    }

    const handleCreateClick = () => {
        setForm({
            name: "",
            discount: 0,
            expiryDate: "",
            expiryDateLocal: "",
        })
        setCreateDialogOpen(true)
    }

    const handleEditClick = () => {
        if (selectedCoupon) {
            setForm({
                name: selectedCoupon.name,
                discount: selectedCoupon.discount,
                expiryDate: toCustomDate(selectedCoupon.expiryDate),
                expiryDateLocal: customToDatetimeLocal(toCustomDate(selectedCoupon.expiryDate)),
            })
            setEditDialogOpen(true)
        }
        handleClose()
    }

    const handleFormSubmit = async (isEdit = false) => {
        if (!form.name) {
            toast.error("Please enter a coupon name", {
                position: "top-right",
                autoClose: 3000,
            })
            return
        }

        if (form.discount < 0 || form.discount > 100) {
            toast.error("Discount must be between 0 and 100", {
                position: "top-right",
                autoClose: 3000,
            })
            return
        }

        if (!form.expiryDate || !isValidCustomDate(form.expiryDate)) {
            toast.error("Please enter a valid expiry date (DD-MM-YYYY:HH:mm)", {
                position: "top-right",
                autoClose: 3000,
            })
            return
        }

        try {
            setFormLoading(true)
            let response: AxiosResponse<ApiResponse<Coupon>>
            const payload = {
                name: form.name,
                discount: form.discount,
                expiryDate: form.expiryDate, // Send as DD-MM-YYYY:HH:mm
            }

            if (isEdit && selectedCoupon) {
                // Edit existing coupon - PATCH request
                response = await callApi({
                    url: `/admin/coupons/${selectedCoupon._id}`,
                    method: "PATCH",
                    data: payload,
                })
                console.log("🚀 ~ handleFormSubmit ~ edit response:", response)
            } else {
                // Create new coupon - POST request
                response = await callApi({
                    url: "/admin/coupons",
                    method: "POST",
                    data: payload,
                })
                console.log("🚀 ~ handleFormSubmit ~ create response:", response)
            }

            if (!response.data.success) {
                throw new Error(response.data.message || `Failed to ${isEdit ? "update" : "create"} coupon`)
            }

            toast.success(`Coupon ${isEdit ? "updated" : "created"} successfully!`, {
                position: "top-right",
                autoClose: 2000,
            })

            setEditDialogOpen(false)
            setCreateDialogOpen(false)
            fetchCoupons() // Refresh the list
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : `Failed to ${isEdit ? "update" : "create"} coupon`
            console.error(`Error ${isEdit ? "updating" : "creating"} coupon:`, errorMessage)
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            })
            if (errorMessage.includes("token") || errorMessage.includes("Unauthorized")) {
                localStorage.removeItem("superAdminUser")
                navigate("/admin/login")
            }
        } finally {
            setFormLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedCoupon) return

        const confirmDelete = window.confirm(`Are you sure you want to delete coupon "${selectedCoupon.name}"?`)

        if (!confirmDelete) return

        try {
            const response: AxiosResponse<ApiResponse<unknown>> = await callApi({
                url: `/admin/coupons/${selectedCoupon._id}`,
                method: "DELETE",
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to delete coupon")
            }

            setCoupons(coupons.filter((coupon) => coupon._id !== selectedCoupon._id))
            toast.success("Coupon deleted successfully!", {
                position: "top-right",
                autoClose: 2000,
            })
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to delete coupon"
            console.error("Error deleting coupon:", errorMessage)
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            })
            if (errorMessage.includes("token") || errorMessage.includes("Unauthorized")) {
                localStorage.removeItem("superAdminUser")
                navigate("/admin/login")
            }
        }

        handleClose()
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <CircularProgress size={48} className="text-amber-500" />
                    <Typography className="mt-4 text-gray-600">Loading coupons...</Typography>
                </div>
            </div>
        )
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ zIndex: 9999 }}
            />

            <Dialog
                open={editDialogOpen || createDialogOpen}
                onClose={() => {
                    setEditDialogOpen(false)
                    setCreateDialogOpen(false)
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    },
                }}
            >
                <DialogTitle className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                            <LocalOfferIcon className="text-white" />
                        </div>
                        <Typography variant="h6" className="font-semibold text-gray-800">
                            {editDialogOpen ? "Edit Coupon" : "Create New Coupon"}
                        </Typography>
                    </div>
                </DialogTitle>

                <DialogContent className="p-6">
                    <div className="space-y-6 mt-2">
                        <TextField
                            label="Coupon Name"
                            fullWidth
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    "&:hover fieldset": {
                                        borderColor: "#f59e0b",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#f59e0b",
                                    },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#f59e0b",
                                },
                            }}
                        />
                        <TextField
                            label="Discount (%)"
                            type="number"
                            fullWidth
                            value={form.discount}
                            onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                            inputProps={{ min: 0, max: 100 }}
                            required
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    "&:hover fieldset": {
                                        borderColor: "#f59e0b",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#f59e0b",
                                    },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#f59e0b",
                                },
                            }}
                        />
                        <TextField
                            label="Expiry Date & Time"
                            type="datetime-local"
                            fullWidth
                            value={form.expiryDateLocal}
                            onChange={(e) => {
                                const localVal = e.target.value
                                const customVal = datetimeLocalToCustom(localVal)
                                setForm({ ...form, expiryDateLocal: localVal, expiryDate: customVal })
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    "&:hover fieldset": {
                                        borderColor: "#f59e0b",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#f59e0b",
                                    },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#f59e0b",
                                },
                            }}
                        />
                    </div>
                </DialogContent>

                <DialogActions className="px-6 pb-6 bg-gray-50 gap-3">
                    <button
                        onClick={() => {
                            setEditDialogOpen(false)
                            setCreateDialogOpen(false)
                        }}
                        className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => handleFormSubmit(editDialogOpen)}
                        disabled={formLoading}
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                    >
                        {formLoading ? (
                            <div className="flex items-center gap-2">
                                <CircularProgress size={16} className="text-white" />
                                Processing...
                            </div>
                        ) : editDialogOpen ? (
                            "Update Coupon"
                        ) : (
                            "Create Coupon"
                        )}
                    </button>
                </DialogActions>
            </Dialog>

            <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-amber-50/30 to-orange-50/30 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupons Management</h1>
                        <p className="text-gray-600">Manage your discount coupons and promotional offers</p>
                    </div>
                    <button
                        onClick={handleCreateClick}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                        <AddIcon />
                        Create New Coupon
                    </button>
                </div>

                {coupons.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-amber-200 shadow-sm">
                        <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                            <LocalOfferIcon className="text-amber-600 text-4xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No coupons found</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Get started by creating your first coupon to offer discounts to your customers.
                        </p>
                        <button
                            onClick={handleCreateClick}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <AddIcon />
                            Create Your First Coupon
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {coupons.map((coupon) => (
                            <Card
                                key={coupon._id}
                                className={`relative h-full transition-all duration-300 hover:shadow-xl hover:scale-105 ${coupon.isExpired
                                    ? "bg-gradient-to-br from-gray-100 to-gray-200"
                                    : "bg-gradient-to-br from-white to-amber-50"
                                    }`}
                                sx={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    border: coupon.isExpired ? "2px solid #e5e7eb" : "2px solid #fbbf24",
                                    boxShadow: coupon.isExpired
                                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                                        : "0 10px 15px -3px rgba(251, 191, 36, 0.1), 0 4px 6px -2px rgba(251, 191, 36, 0.05)",
                                }}
                            >
                                {coupon.isExpired && (
                                    <div className="absolute top-4 left-4 z-10">
                                        {/* <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-md">
                                            EXPIRED
                                        </span> */}
                                    </div>
                                )}

                                {/* Action Menu */}
                                <div className="absolute top-4 right-4 z-10">
                                    <IconButton
                                        aria-label="more"
                                        aria-controls={`menu-${coupon._id}`}
                                        aria-haspopup="true"
                                        onClick={(e) => handleMenuClick(e, coupon)}
                                        size="small"
                                        sx={{
                                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                                            backdropFilter: "blur(10px)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255, 255, 255, 1)",
                                                transform: "scale(1.1)",
                                            },
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </div>

                                <CardContent className="p-6">
                                    <div className="mb-4">
                                        <Typography
                                            variant="h6"
                                            className={`font-bold mb-2 ${coupon.isExpired ? "text-gray-600" : "text-gray-900"}`}
                                        >
                                            {coupon.name}
                                        </Typography>
                                    </div>

                                    <div className="text-center mb-6">
                                        <Typography
                                            variant="h3"
                                            className={`font-black ${coupon.isExpired ? "text-gray-500" : "text-amber-600"}`}
                                        >
                                            {coupon.discount}%
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className={`font-semibold ${coupon.isExpired ? "text-gray-500" : "text-amber-700"}`}
                                        >
                                            OFF
                                        </Typography>
                                    </div>

                                    <div className="space-y-3">
                                        <div
                                            className={`flex items-start gap-3 p-3 rounded-lg ${coupon.isExpired ? "bg-gray-100" : "bg-amber-50"
                                                }`}
                                        >
                                            <AccessTimeIcon
                                                className={`mt-0.5 ${coupon.isExpired ? "text-gray-500" : "text-amber-600"}`}
                                                fontSize="small"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <Typography
                                                    variant="body2"
                                                    className={`font-medium ${coupon.isExpired ? "text-gray-700" : "text-amber-900"}`}
                                                >
                                                    {getRelativeTime(coupon.expiryDate)}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    className={`block ${coupon.isExpired ? "text-gray-500" : "text-amber-700"}`}
                                                >
                                                    {toIndianTime(coupon.expiryDate)} IST
                                                </Typography>
                                            </div>
                                        </div>

                                        <div
                                            className={`flex items-start gap-3 p-3 rounded-lg ${coupon.isExpired ? "bg-gray-100" : "bg-green-50"
                                                }`}
                                        >
                                            <EventIcon
                                                className={`mt-0.5 ${coupon.isExpired ? "text-gray-500" : "text-green-600"}`}
                                                fontSize="small"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <Typography
                                                    variant="body2"
                                                    className={`font-medium ${coupon.isExpired ? "text-gray-700" : "text-green-900"}`}
                                                >
                                                    Created
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    className={`block ${coupon.isExpired ? "text-gray-500" : "text-green-700"}`}
                                                >
                                                    {toIndianTime(coupon.createdAt)} IST
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Menu
                    id="coupon-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            width: "160px",
                            borderRadius: "12px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        },
                    }}
                >
                    <MenuItem
                        onClick={handleEditClick}
                        sx={{
                            "&:hover": {
                                backgroundColor: "#fef3c7",
                                color: "#92400e",
                            },
                        }}
                    >
                        <EditIcon fontSize="small" className="mr-3 text-amber-600" />
                        Edit Coupon
                    </MenuItem>

                    <MenuItem
                        onClick={handleDelete}
                        sx={{
                            color: "#dc2626",
                            "&:hover": {
                                backgroundColor: "#fef2f2",
                                color: "#dc2626",
                            },
                        }}
                    >
                        <DeleteIcon fontSize="small" className="mr-3" />
                        Delete Coupon
                    </MenuItem>
                </Menu>
            </div>
        </>
    )
}

export default CouponsList

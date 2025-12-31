import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import BadgeIcon from '@mui/icons-material/Badge'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import UpdateIcon from '@mui/icons-material/Update'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import callApi from "../../../util/admin_api"
import type { AxiosResponse } from "axios"
import { toast } from "react-toastify"

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
    storeId?: string;
};

interface ApiResponse<T> {
    statusCode: number
    success: boolean
    message: string
    data: T
    meta: any | null
}

const DisplayEmployee: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [data, setData] = useState<Employee | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            if (!id) {
                toast.error("Invalid employee ID")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const response: AxiosResponse<ApiResponse<Employee>> = await callApi({
                    url: `/employee/${id}`,
                    method: "GET",
                })

                if (!response.data.success) {
                    throw new Error(response.data.message || "Failed to fetch employee details")
                }

                setData(response.data.data)
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Failed to fetch employee details"
                console.error("Error fetching employee:", errorMessage)
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 3000,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchEmployeeDetails()
    }, [id])

    const getRoleBadgeColor = (role: string) => {
        const r = role.toLowerCase()
        if (r === 'manager') return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
        if (r === 'store' || r === 'butcher' || r === 'salesman' || r === 'cleaner' || r === 'accountant')
            return 'bg-gradient-to-r from-green-500 to-green-600 text-white'
        if (r === 'super-admin') return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
        return 'bg-gray-100 text-gray-800'
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <PersonIcon className="text-blue-600 text-2xl" />
                        </div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading employee details...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center px-4">
                <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CancelIcon className="text-red-600 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Employee Not Found</h3>
                    <p className="text-gray-500 mb-6">The requested employee could not be loaded or does not exist.</p>
                    <button
                        onClick={() => navigate('/employe')}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
                    >
                        <ArrowBackIcon />
                        Back to Employee List
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/employe')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors mb-4 group"
                    >
                        <ArrowBackIcon className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Employee List</span>
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Employee Details</h1>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 sticky top-6">
                            {/* Profile Header with Gradient */}
                            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 h-32 relative">
                                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-white">
                                                {getInitials(data.firstName, data.lastName)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="pt-16 pb-6 px-6 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {data.firstName} {data.lastName}
                                </h2>
                                <div className="inline-flex items-center justify-center gap-2 mb-4">
                                    <span className={`px-4 py-1.5 text-sm font-semibold rounded-full shadow-md ${getRoleBadgeColor(data.role)}`}>
                                        {data.role.toUpperCase()}
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    {data.isActive ? (
                                        <>
                                            <CheckCircleIcon className="text-green-500 text-xl" />
                                            <span className="text-green-600 font-semibold">Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <CancelIcon className="text-red-500 text-xl" />
                                            <span className="text-red-600 font-semibold">Inactive</span>
                                        </>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                {/* <div className="flex gap-2">
                                    <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                                        <EditIcon className="text-lg" />
                                        Edit
                                    </button>
                                    <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                                        <DeleteIcon className="text-lg" />
                                        Delete
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <PhoneIcon className="text-blue-600" />
                                </div>
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    {/* <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <PhoneIcon className="text-blue-600" />
                                    </div> */}
                                    <div className="flex-1">
                                        {/* <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number</p> */}
                                        <p className="text-gray-900 font-semibold text-lg">{data.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employee Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <BadgeIcon className="text-purple-600" />
                                </div>
                                Employee Information
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                    {/* <div className="flex items-center gap-3 mb-2"> */}
                                    {/* <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"> */}
                                    {/* <BadgeIcon className="text-purple-600 text-sm" /> */}
                                    {/* </div> */}
                                    {/* <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Employee ID</p> */}
                                    <p className="text-gray-900 font-bold text-xl ml-11">{data.EmployeeeId}</p>
                                    {/* </div> */}
                                </div>

                                {data.storeId && (
                                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                                </svg>
                                            </div>
                                            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Store ID</p>
                                        </div>
                                        <p className="text-gray-900 font-bold text-xl ml-11">{data.storeId}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline Information */}
                        {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                                    <CalendarTodayIcon className="text-cyan-600" />
                                </div>
                                Timeline
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CalendarTodayIcon className="text-cyan-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wide mb-1">Created At</p>
                                        <p className="text-gray-900 font-semibold text-lg">
                                            {new Date(data.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <UpdateIcon className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Last Updated</p>
                                        <p className="text-gray-900 font-semibold text-lg">
                                            {new Date(data.updatedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayEmployee
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
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
    employeeId: string;
};

interface ApiResponse<T> {
    statusCode: number
    success: boolean
    message: string
    data: T
    meta: any | null
}

const EditEmploye: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [data, setData] = useState<Employee | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        role: '',
        isActive: true,
    })

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

                const employee = response.data.data
                setData(employee)
                setFormData({
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    phone: employee.phone,
                    role: employee.role,
                    isActive: employee.isActive,
                })
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isActive' ? value === 'true' : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return

        try {
            setIsSubmitting(true)
            const response: AxiosResponse<ApiResponse<Employee>> = await callApi({
                url: `/employe/${id}`,
                method: "PATCH",
                data: formData,
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update employee")
            }

            toast.success("Employee updated successfully!")
            setData(response.data.data)
            navigate('/employe')
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update employee"
            console.error("Error updating employee:", errorMessage)
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Employee Not Found</h3>
                    <p className="mt-1 text-sm text-gray-500">The requested employee could not be loaded.</p>
                    <button
                        onClick={() => navigate('/employe')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/employe')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                    >
                        <ArrowBackIcon className="mr-1" />
                        Back to List
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
                </div>

                {/* Edit Form Card */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Edit {data.firstName} {data.lastName}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Role *
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Role</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="BUTCHER">Butcher</option>
                                    {/* Add more roles as needed */}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    id="isActive"
                                    name="isActive"
                                    value={formData.isActive.toString()}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Read-Only Information</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Employee ID:</span>
                                        <span className="font-medium">{data.employeeId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Created At:</span>
                                        <span>{new Date(data.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Last Updated:</span>
                                        <span>{new Date(data.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/employe')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <SaveIcon className="mr-2" />
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditEmploye
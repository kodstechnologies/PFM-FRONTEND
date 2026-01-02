// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// import SaveIcon from '@mui/icons-material/Save'
// import callApi from "../../../util/admin_api"
// import type { AxiosResponse } from "axios"
// import { toast } from "react-toastify"

// type EmployeeFormData = {
//     firstName: string;
//     lastName: string;
//     phone: string;
//     role: string;
//     isActive: boolean;
//     storeId?: string; // Optional if store selection is needed
// };

// interface ApiResponse<T> {
//     statusCode: number
//     success: boolean
//     message: string
//     data: T
//     meta: any | null
// }

// const AddEmploye: React.FC = () => {
//     const navigate = useNavigate()
//     const [formData, setFormData] = useState<EmployeeFormData>({
//         firstName: '',
//         lastName: '',
//         phone: '',
//         role: '',
//         isActive: true,
//         storeId: '', // If store selection is required
//     })
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [loading, setLoading] = useState(false) // For any async operations if needed

//     const roleOptions = [
//         { value: "MANAGER", label: "Manager" },
//         { value: "ACCOUNTANT", label: "Accountant" },
//         { value: "BUTCHER", label: "Butcher" },
//         { value: "SALESMAN", label: "Salesman" },
//         { value: "CLEANER", label: "Cleaner" },
//     ]

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target
//         setFormData(prev => ({
//             ...prev,
//             [name]: name === 'isActive' ? value === 'true' : value,
//         }))
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         // Basic validation
//         if (!formData.firstName || !formData.lastName || !formData.phone || !formData.role) {
//             toast.error("Please fill in all required fields")
//             return
//         }

//         try {
//             setIsSubmitting(true)
//             const response: AxiosResponse<ApiResponse<any>> = await callApi({
//                 url: "/employee",
//                 method: "POST",
//                 data: formData,
//             })

//             if (!response.data.success) {
//                 throw new Error(response.data.message || "Failed to create employee")
//             }

//             toast.success("Employee created successfully!")
//             navigate('/employe')
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : "Failed to create employee"
//             console.error("Error creating employee:", errorMessage)
//             toast.error(errorMessage, {
//                 position: "top-right",
//                 autoClose: 3000,
//             })
//         } finally {
//             setIsSubmitting(false)
//         }
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
//             <div className="max-w-2xl mx-auto">
//                 {/* Header */}
//                 <div className="flex items-center mb-6">
//                     <button
//                         onClick={() => navigate('/employe')}
//                         className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
//                     >
//                         <ArrowBackIcon className="mr-1" />
//                         Back to List
//                     </button>
//                     <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
//                 </div>

//                 {/* Add Form Card */}
//                 <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
//                     <form onSubmit={handleSubmit} className="p-6">
//                         <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                             Create Employee
//                         </h2>
//                         <div className="space-y-4">
//                             <div>
//                                 <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                                     First Name *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="firstName"
//                                     name="firstName"
//                                     value={formData.firstName}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Last Name *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="lastName"
//                                     name="lastName"
//                                     value={formData.lastName}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Phone *
//                                 </label>
//                                 <input
//                                     type="tel"
//                                     id="phone"
//                                     name="phone"
//                                     value={formData.phone}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Role *
//                                 </label>
//                                 <select
//                                     id="role"
//                                     name="role"
//                                     value={formData.role}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="">Select Role</option>
//                                     {roleOptions.map((option) => (
//                                         <option key={option.value} value={option.value}>
//                                             {option.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Status
//                                 </label>
//                                 <select
//                                     id="isActive"
//                                     name="isActive"
//                                     value={formData.isActive.toString()}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="true">Active</option>
//                                     <option value="false">Inactive</option>
//                                 </select>
//                             </div>

//                         </div>
//                         <div className="mt-8 flex justify-end space-x-3">
//                             <button
//                                 type="button"
//                                 onClick={() => navigate('/employe')}
//                                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                             >
//                                 <SaveIcon className="mr-2" />
//                                 {isSubmitting ? 'Creating...' : 'Create Employee'}
//                             </button>
//                         </div>
//                     </form>
//                 </div >
//             </div >
//         </div >
//     )
// }

// export default AddEmploye

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import callApi from "../../../util/admin_api"
import type { AxiosResponse } from "axios"
import { toast } from "react-toastify"

type EmployeeFormData = {
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    isActive: boolean;
    storeId: string; // Now required
};

interface ApiResponse<T> {
    statusCode: number
    success: boolean
    message: string
    data: T
    meta: any | null
}

type Store = {
    _id: string;
    name: string;
};

const AddEmploye: React.FC = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<EmployeeFormData>({
        firstName: '',
        lastName: '',
        phone: '',
        role: '',
        isActive: true,
        storeId: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [stores, setStores] = useState<Store[]>([])

    const roleOptions = [
        { value: "MANAGER", label: "Manager" },
        { value: "ACCOUNTANT", label: "Accountant" },
        { value: "BUTCHER", label: "Butcher" },
        { value: "SALESMAN", label: "Salesman" },
        { value: "CLEANER", label: "Cleaner" },
    ]

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true)
                const response: AxiosResponse<ApiResponse<Store[]>> = await callApi({
                    url: "/store/all-store-name",
                    method: "GET",
                })

                if (response.data.success) {
                    setStores(response.data.data)
                } else {
                    throw new Error(response.data.message || "Failed to fetch stores")
                }
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Failed to fetch stores"
                console.error("Error fetching stores:", errorMessage)
                toast.error(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchStores()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isActive' ? value === 'true' : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.role || !formData.storeId) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            setIsSubmitting(true)
            const response: AxiosResponse<ApiResponse<any>> = await callApi({
                url: "/employee",
                method: "POST",
                data: formData,
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to create employee")
            }

            toast.success("Employee created successfully!")
            navigate('/employe')
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create employee"
            console.error("Error creating employee:", errorMessage)
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setIsSubmitting(false)
        }
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
                    <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
                </div>

                {/* Add Form Card */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Create Employee
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
                                    {roleOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Store *
                                </label>
                                <select
                                    id="storeId"
                                    name="storeId"
                                    value={formData.storeId}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                >
                                    <option value="">
                                        {loading ? 'Loading stores...' : 'Select Store'}
                                    </option>
                                    {!loading && stores.map((store) => (
                                        <option key={store._id} value={store._id}>
                                            {store.name}
                                        </option>
                                    ))}
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
                                disabled={isSubmitting || loading}
                                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <SaveIcon className="mr-2" />
                                {isSubmitting ? 'Creating...' : 'Create Employee'}
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        </div >
    )
}

export default AddEmploye
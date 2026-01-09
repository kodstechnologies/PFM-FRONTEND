
// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// import SaveIcon from '@mui/icons-material/Save'
// import PersonIcon from '@mui/icons-material/Person'
// import PhoneIcon from '@mui/icons-material/Phone'
// import WorkIcon from '@mui/icons-material/Work'
// import StoreIcon from '@mui/icons-material/Store'
// import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
// import AssignmentIcon from '@mui/icons-material/Assignment'
// import EditIcon from '@mui/icons-material/Edit'
// import callApi from "../../../util/admin_api"
// import type { AxiosResponse } from "axios"
// import { toast } from "react-toastify"

// type Store = {
//     _id: string;
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
//     EmployeeeId: string;
//     store?: Store;
// };

// interface ApiResponse<T> {
//     statusCode: number
//     success: boolean
//     message: string
//     data: T
//     meta: any | null
// }

// const EditEmployee: React.FC = () => {
//     const { id } = useParams<{ id: string }>()
//     const navigate = useNavigate()
//     const [data, setData] = useState<Employee | null>(null)
//     const [loading, setLoading] = useState(true)
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [stores, setStores] = useState<Store[]>([])
//     const [storeLoading, setStoreLoading] = useState(false)
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         phone: '',
//         role: '',
//         isActive: true,
//         storeId: '',
//     })

//     const roleOptions = [
//         { value: "MANAGER", label: "Manager" },
//         { value: "ACCOUNTANT", label: "Accountant" },
//         { value: "BUTCHER", label: "Butcher" },
//         { value: "SALESMAN", label: "Salesman" },
//         { value: "CLEANER", label: "Cleaner" },
//     ]

//     useEffect(() => {
//         const fetchEmployeeDetails = async () => {
//             if (!id) {
//                 toast.error("Invalid employee ID")
//                 setLoading(false)
//                 return
//             }

//             try {
//                 setLoading(true)
//                 const response: AxiosResponse<ApiResponse<Employee>> = await callApi({
//                     url: `/employee/${id}`,
//                     method: "GET",
//                 })

//                 if (!response.data.success) {
//                     throw new Error(response.data.message || "Failed to fetch employee details")
//                 }

//                 const employee = response.data.data
//                 setData(employee)
//                 setFormData({
//                     firstName: employee.firstName,
//                     lastName: employee.lastName,
//                     phone: employee.phone,
//                     role: employee.role,
//                     isActive: employee.isActive,
//                     storeId: employee.store?._id || '',
//                 })
//             } catch (error: unknown) {
//                 const errorMessage = error instanceof Error ? error.message : "Failed to fetch employee details"
//                 console.error("Error fetching employee:", errorMessage)
//                 toast.error(errorMessage, {
//                     position: "top-right",
//                     autoClose: 3000,
//                 })
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchEmployeeDetails()
//     }, [id])

//     useEffect(() => {
//         const fetchStores = async () => {
//             try {
//                 setStoreLoading(true)
//                 const response: AxiosResponse<ApiResponse<Store[]>> = await callApi({
//                     url: "/store/all-store-name",
//                     method: "GET",
//                 })

//                 if (response.data.success) {
//                     setStores(response.data.data)
//                 } else {
//                     throw new Error(response.data.message || "Failed to fetch stores")
//                 }
//             } catch (error: unknown) {
//                 const errorMessage = error instanceof Error ? error.message : "Failed to fetch stores"
//                 console.error("Error fetching stores:", errorMessage)
//                 toast.error(errorMessage)
//             } finally {
//                 setStoreLoading(false)
//             }
//         }

//         fetchStores()
//     }, [])

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target
//         setFormData(prev => ({
//             ...prev,
//             [name]: name === 'isActive' ? value === 'true' : value,
//         }))
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!id) return

//         try {
//             setIsSubmitting(true)
//             const response: AxiosResponse<ApiResponse<Employee>> = await callApi({
//                 url: `/employee/${id}`,
//                 method: "PATCH",
//                 data: formData,
//             })

//             if (!response.data.success) {
//                 throw new Error(response.data.message || "Failed to update employee")
//             }

//             toast.success("Employee updated successfully!")
//             setData(response.data.data)
//             navigate('/employe')
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : "Failed to update employee"
//             console.error("Error updating employee:", errorMessage)
//             toast.error(errorMessage, {
//                 position: "top-right",
//                 autoClose: 3000,
//             })
//         } finally {
//             setIsSubmitting(false)
//         }
//     }

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                     <p className="text-gray-600">Loading employee details...</p>
//                 </div>
//             </div>
//         )
//     }

//     if (!data) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//                 <div className="text-center">
//                     <div className="text-red-500 text-6xl mb-4">⚠️</div>
//                     <h3 className="text-lg font-bold text-gray-900 mb-2">Employee Not Found</h3>
//                     <p className="text-gray-600 mb-6">The requested employee could not be loaded.</p>
//                     <button
//                         onClick={() => navigate('/employe')}
//                         className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2 mx-auto"
//                     >
//                         <ArrowBackIcon className="text-sm" />
//                         <span>Back to List</span>
//                     </button>
//                 </div>
//             </div>
//         )
//     }

//     const statusColor = formData.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

//     const storeOptions = storeLoading
//         ? [{ value: '', label: 'Loading stores...' }]
//         : [
//             { value: '', label: 'Select Store' },
//             ...stores.map(store => ({ value: store._id, label: store.name }))
//         ];

//     const readonlyItems = [
//         { label: "Employee ID", value: data.EmployeeeId },
//         { label: "Created At", value: new Date(data.createdAt).toLocaleDateString() },
//         { label: "Last Updated", value: new Date(data.updatedAt).toLocaleDateString() },
//     ];

//     if (data.store) {
//         readonlyItems.push(
//             { label: "Store Name", value: data.store.name },
//             { label: "Store Location", value: data.store.location },
//             { label: "Store Phone", value: data.store.phone }
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
//             <div className="max-w-2xl mx-auto">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900 mb-1">Edit Employee</h1>
//                         <p className="text-gray-600">Update details for {data.firstName} {data.lastName}</p>
//                     </div>
//                     <button
//                         onClick={() => navigate('/employe')}
//                         className="flex items-center text-gray-600 hover:text-gray-900 mt-4 sm:mt-0 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-300"
//                     >
//                         <ArrowBackIcon className="mr-2 text-sm" />
//                         Back to List
//                     </button>
//                 </div>

//                 {/* Edit Form Card */}
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//                     <form onSubmit={handleSubmit} className="p-6">
//                         <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
//                             <EditIcon className="text-3xl" />
//                             Edit Employee Details
//                         </h2>
//                         <div className="space-y-4">
//                             <InputField
//                                 icon={<PersonIcon />}
//                                 label="First Name"
//                                 id="firstName"
//                                 name="firstName"
//                                 type="text"
//                                 value={formData.firstName}
//                                 onChange={handleInputChange}
//                                 required
//                             />
//                             <InputField
//                                 icon={<PersonIcon />}
//                                 label="Last Name"
//                                 id="lastName"
//                                 name="lastName"
//                                 type="text"
//                                 value={formData.lastName}
//                                 onChange={handleInputChange}
//                                 required
//                             />
//                             <InputField
//                                 icon={<PhoneIcon />}
//                                 label="Phone"
//                                 id="phone"
//                                 name="phone"
//                                 type="tel"
//                                 value={formData.phone}
//                                 onChange={handleInputChange}
//                                 required
//                             />
//                             <SelectField
//                                 icon={<WorkIcon />}
//                                 label="Role"
//                                 id="role"
//                                 name="role"
//                                 value={formData.role}
//                                 onChange={handleInputChange}
//                                 required
//                                 options={[
//                                     { value: "", label: "Select Role" },
//                                     ...roleOptions.map(opt => ({ value: opt.value, label: opt.label }))
//                                 ]}
//                             />
//                             <SelectField
//                                 icon={<StoreIcon />}
//                                 label="Store"
//                                 id="storeId"
//                                 name="storeId"
//                                 value={formData.storeId}
//                                 onChange={handleInputChange}
//                                 required
//                                 disabled={storeLoading}
//                                 options={storeOptions}
//                             />
//                             {/* <SelectField
//                                 icon={<PowerSettingsNewIcon />}
//                                 label="Status"
//                                 id="isActive"
//                                 name="isActive"
//                                 value={formData.isActive.toString()}
//                                 onChange={handleInputChange}
//                                 options={[
//                                     { value: "true", label: "Active" },
//                                     { value: "false", label: "Inactive" }
//                                 ]}
//                                 statusColor={statusColor}
//                             /> */}
//                             {/* <ReadOnlySection
//                                 icon={<AssignmentIcon />}
//                                 title="Read-Only Information"
//                                 items={readonlyItems}
//                             /> */}
//                         </div>
//                         <div className="mt-8 flex justify-end space-x-3">
//                             <button
//                                 type="button"
//                                 onClick={() => navigate('/employe')}
//                                 className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className="flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-300"
//                             >
//                                 <SaveIcon className="mr-2 text-sm" />
//                                 {isSubmitting ? 'Saving...' : 'Save Changes'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     )
// }

// // Reusable Input Field Component
// interface InputFieldProps {
//     icon: React.ReactNode;
//     label: string;
//     id: string;
//     name: string;
//     type: string;
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     required?: boolean;
// }

// const InputField: React.FC<InputFieldProps> = ({ icon, label, id, name, type, value, onChange, required }) => (
//     <div className="relative">
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
//             <span className="text-xl flex-shrink-0">{icon}</span>
//             <span>{label}</span>
//             {required && <span className="text-red-500">*</span>}
//         </label>
//         <input
//             type={type}
//             id={id}
//             name={name}
//             value={value}
//             onChange={onChange}
//             required={required}
//             className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
//         />
//     </div>
// );

// // Reusable Select Field Component
// interface SelectFieldProps {
//     icon: React.ReactNode;
//     label: string;
//     id: string;
//     name: string;
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//     options: { value: string; label: string }[];
//     required?: boolean;
//     statusColor?: string;
//     disabled?: boolean;
// }

// const SelectField: React.FC<SelectFieldProps> = ({ icon, label, id, name, value, onChange, options, required, statusColor, disabled = false }) => (
//     <div className="relative">
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
//             <span className="text-xl flex-shrink-0">{icon}</span>
//             <span>{label}</span>
//             {required && <span className="text-red-500">*</span>}
//         </label>
//         <select
//             id={id}
//             name={name}
//             value={value}
//             onChange={onChange}
//             required={required}
//             disabled={disabled}
//             className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 disabled:opacity-50 ${statusColor || ''}`}
//         >
//             {options.map((option) => (
//                 <option key={option.value} value={option.value}>
//                     {option.label}
//                 </option>
//             ))}
//         </select>
//     </div>
// );

// // Reusable Read-Only Section Component
// interface ReadOnlyItem {
//     label: string;
//     value: string;
// }

// interface ReadOnlySectionProps {
//     icon: React.ReactNode;
//     title: string;
//     items: ReadOnlyItem[];
// }

// const ReadOnlySection: React.FC<ReadOnlySectionProps> = ({ icon, title, items }) => (
//     <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
//         <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
//             <span className="text-xl flex-shrink-0">{icon}</span>
//             <span>{title}</span>
//         </h3>
//         <div className="space-y-3 text-sm">
//             {items.map((item, index) => (
//                 <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
//                     <span className="text-gray-600">{item.label}:</span>
//                     <span className="font-medium text-gray-900">{item.value}</span>
//                 </div>
//             ))}
//         </div>
//     </div>
// );

// export default EditEmployee

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import WorkIcon from '@mui/icons-material/Work'
import StoreIcon from '@mui/icons-material/Store'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import AssignmentIcon from '@mui/icons-material/Assignment'
import EditIcon from '@mui/icons-material/Edit'
import callApi from "../../../util/admin_api"
import type { AxiosResponse } from "axios"
import { toast } from "react-toastify"

type Store = {
    _id: string;
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
    store?: Store;
    documentStatus: {
        idProof: string;
        addressProof: string;
        panProof: string;
    };
};

interface ApiResponse<T> {
    statusCode: number
    success: boolean
    message: string
    data: T
    meta: any | null
}

const EditEmployee: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [data, setData] = useState<Employee | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [stores, setStores] = useState<Store[]>([])
    const [storeLoading, setStoreLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        role: '',
        isActive: true,
        storeId: '',
        documentStatus: {
            idProof: 'pending',
            addressProof: 'pending',
            panProof: 'pending',
        },
    })

    const roleOptions = [
        { value: "MANAGER", label: "Manager" },
        { value: "ACCOUNTANT", label: "Accountant" },
        { value: "BUTCHER", label: "Butcher" },
        { value: "SALESMAN", label: "Salesman" },
        { value: "CLEANER", label: "Cleaner" },
    ]

    const documentStatusOptions = [
        { value: "", label: "Select Status" },
        { value: "verified", label: "Verified" },
        { value: "pending", label: "Pending" },
        { value: "rejected", label: "Rejected" },
    ]

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
                    storeId: employee.store?._id || '',
                    documentStatus: {
                        idProof: employee.documentStatus.idProof,
                        addressProof: employee.documentStatus.addressProof,
                        panProof: employee.documentStatus.panProof,
                    },
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

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setStoreLoading(true)
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
                setStoreLoading(false)
            }
        }

        fetchStores()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name.startsWith('documentStatus.')) {
            const field = name.split('.')[1] as keyof typeof formData.documentStatus
            setFormData(prev => ({
                ...prev,
                documentStatus: {
                    ...prev.documentStatus,
                    [field]: value,
                },
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'isActive' ? value === 'true' : value,
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return

        try {
            setIsSubmitting(true)
            const submitData = {
                ...formData,
                documentStatus: formData.documentStatus, // Ensure it's included
            }
            const response: AxiosResponse<ApiResponse<Employee>> = await callApi({
                url: `/employee/${id}`,
                method: "PATCH",
                data: submitData,
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading employee details...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Employee Not Found</h3>
                    <p className="text-gray-600 mb-6">The requested employee could not be loaded.</p>
                    <button
                        onClick={() => navigate('/employe')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2 mx-auto"
                    >
                        <ArrowBackIcon className="text-sm" />
                        <span>Back to List</span>
                    </button>
                </div>
            </div>
        )
    }

    const statusColor = formData.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

    const storeOptions = storeLoading
        ? [{ value: '', label: 'Loading stores...' }]
        : [
            { value: '', label: 'Select Store' },
            ...stores.map(store => ({ value: store._id, label: store.name }))
        ];

    const readonlyItems = [
        { label: "Employee ID", value: data.EmployeeeId },
        { label: "Created At", value: new Date(data.createdAt).toLocaleDateString() },
        { label: "Last Updated", value: new Date(data.updatedAt).toLocaleDateString() },
    ];

    if (data.store) {
        readonlyItems.push(
            { label: "Store Name", value: data.store.name },
            { label: "Store Location", value: data.store.location },
            { label: "Store Phone", value: data.store.phone }
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Edit Employee</h1>
                        <p className="text-gray-600">Update details for {data.firstName} {data.lastName}</p>
                    </div>
                    <button
                        onClick={() => navigate('/employe')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mt-4 sm:mt-0 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-300"
                    >
                        <ArrowBackIcon className="mr-2 text-sm" />
                        Back to List
                    </button>
                </div>

                {/* Edit Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                            <EditIcon className="text-3xl" />
                            Edit Employee Details
                        </h2>
                        <div className="space-y-4">
                            <InputField
                                icon={<PersonIcon />}
                                label="First Name"
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <InputField
                                icon={<PersonIcon />}
                                label="Last Name"
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                            <InputField
                                icon={<PhoneIcon />}
                                label="Phone"
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                            <SelectField
                                icon={<WorkIcon />}
                                label="Role"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                                options={[
                                    { value: "", label: "Select Role" },
                                    ...roleOptions.map(opt => ({ value: opt.value, label: opt.label }))
                                ]}
                            />
                            <SelectField
                                icon={<StoreIcon />}
                                label="Store"
                                id="storeId"
                                name="storeId"
                                value={formData.storeId}
                                onChange={handleInputChange}
                                required
                                disabled={storeLoading}
                                options={storeOptions}
                            />
                            <SelectField
                                icon={<PowerSettingsNewIcon />}
                                label="Status"
                                id="isActive"
                                name="isActive"
                                value={formData.isActive.toString()}
                                onChange={handleInputChange}
                                options={[
                                    { value: "true", label: "Active" },
                                    { value: "false", label: "Inactive" }
                                ]}
                                statusColor={statusColor}
                            />
                            {/* Document Status Section */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <AssignmentIcon className="text-2xl" />
                                    <span>Document Status</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField
                                        icon={<AssignmentIcon />}
                                        label="ID Proof"
                                        id="documentStatus.idProof"
                                        name="documentStatus.idProof"
                                        value={formData.documentStatus.idProof}
                                        onChange={handleInputChange}
                                        options={documentStatusOptions}
                                    />
                                    <SelectField
                                        icon={<AssignmentIcon />}
                                        label="Address Proof"
                                        id="documentStatus.addressProof"
                                        name="documentStatus.addressProof"
                                        value={formData.documentStatus.addressProof}
                                        onChange={handleInputChange}
                                        options={documentStatusOptions}
                                    />
                                    <SelectField
                                        icon={<AssignmentIcon />}
                                        label="PAN Proof"
                                        id="documentStatus.panProof"
                                        name="documentStatus.panProof"
                                        value={formData.documentStatus.panProof}
                                        onChange={handleInputChange}
                                        options={documentStatusOptions}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/employe')}
                                className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-300"
                            >
                                <SaveIcon className="mr-2 text-sm" />
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

// Reusable Input Field Component
interface InputFieldProps {
    icon: React.ReactNode;
    label: string;
    id: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ icon, label, id, name, type, value, onChange, required }) => (
    <div className="relative">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </span>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
        </div>
    </div>
);

// Reusable Select Field Component
interface SelectFieldProps {
    icon: React.ReactNode;
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    statusColor?: string;
    disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ icon, label, id, name, value, onChange, options, required, statusColor, disabled = false }) => (
    <div className="relative">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </span>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 disabled:opacity-50 ${statusColor || ''}`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

// Reusable Read-Only Section Component
interface ReadOnlyItem {
    label: string;
    value: string;
}

interface ReadOnlySectionProps {
    icon: React.ReactNode;
    title: string;
    items: ReadOnlyItem[];
}

const ReadOnlySection: React.FC<ReadOnlySectionProps> = ({ icon, title, items }) => (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <span>{title}</span>
        </h3>
        <div className="space-y-3 text-sm">
            {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <span className="text-gray-600">{item.label}:</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                </div>
            ))}
        </div>
    </div>
);

export default EditEmployee
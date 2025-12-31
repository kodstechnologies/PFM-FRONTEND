// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// import callApi from "../../../util/admin_api"
// import type { AxiosResponse } from "axios"
// import { toast } from "react-toastify"

// type Employee = {
//   employeeId: string;
//   id: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   role: string;
// };

// type StoreDetails = {
//   storeId: string;
//   name: string;
//   location: string;
//   phone: string;
//   lat: number;
//   long: number;
//   pincode: string;
//   isActive: boolean;
//   totalEmployees: number;
//   employees: Employee[];
// };

// const MeatCenterView: React.FC = () => {
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
//   const [data, setData] = useState<StoreDetails | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchStoreDetails = async () => {
//       if (!id) {
//         toast.error("Invalid store ID")
//         setLoading(false)
//         return
//       }

//       try {
//         setLoading(true)
//         const response: AxiosResponse<any> = await callApi({
//           url: `/admin/meat-centers/${id}`,
//           method: "GET",
//         })

//         // Assuming the API returns the full details in response.data.data
//         // Adapt based on actual API structure; here mimicking the provided backend mapping
//         const storeData = response.data.data
//         setData({
//           storeId: storeData.storeId || storeData._id,
//           name: storeData.name,
//           location: storeData.location,
//           phone: storeData.phone,
//           lat: storeData.lat,
//           long: storeData.long,
//           pincode: storeData.pincode,
//           isActive: storeData.isActive,
//           totalEmployees: storeData.totalEmployees || storeData.employees?.length || 0,
//           employees: storeData.employees || [],
//         })
//       } catch (error: unknown) {
//         const errorMessage = error instanceof Error ? error.message : "Failed to fetch meat center details"
//         console.error("Error fetching meat center:", errorMessage)
//         toast.error(errorMessage, {
//           position: "top-right",
//           autoClose: 3000,
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStoreDetails()
//   }, [id])

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   if (!data) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <h3 className="text-lg font-medium text-gray-900">Meat Center Not Found</h3>
//           <p className="mt-1 text-sm text-gray-500">The requested meat center could not be loaded.</p>
//           <button
//             onClick={() => navigate('/meat-center')}
//             className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//           >
//             Back to List
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center mb-6">
//           <button
//             onClick={() => navigate('/meat-center')}
//             className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
//           >
//             <ArrowBackIcon className="mr-1" />
//             Back to List
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">Meat Center Details</h1>
//         </div>

//         {/* Store Info Card */}
//         <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mb-8">
//           <div className="p-6">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-4">{data.name}</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <div className="space-y-3">
//                   <div className="flex items-center">
//                     <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Location</p>
//                       <p className="text-gray-900">{data.location}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Phone</p>
//                       <p className="text-gray-900">{data.phone}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Pincode</p>
//                       <p className="text-gray-900">{data.pincode}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Coordinates</p>
//                       <p className="text-gray-900">Lat: {data.lat}, Long: {data.long}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <div className="space-y-3">
//                   <div className="flex items-center">
//                     <div className={`w-2 h-2 rounded-full mr-3 ${data.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Status</p>
//                       <p className={`text-${data.isActive ? 'green' : 'red'}-600 font-medium`}>
//                         {data.isActive ? 'Active' : 'Inactive'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Total Employees</p>
//                       <p className="text-gray-900">{data.totalEmployees}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Employees Table Card */}
//         <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
//           <div className="p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Employees</h2>
//             {data.totalEmployees === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="text-lg">No employees assigned yet</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {data.employees.map((emp) => (
//                       <tr key={emp.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {emp.firstName} {emp.lastName}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.phone}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
//                             {emp.role}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.employeeId}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MeatCenterView

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import callApi from "../../../util/admin_api"
import type { AxiosResponse } from "axios"
import { toast } from "react-toastify"

type Employee = {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  phone: string;
  img: string | null;
};

type DeliveryPartner = {
  id: string;
  name: string;
  phone: string;
  status: string;
  documentStatus: string;
  rating: number;
  isActive: boolean;
  img: string;
};

type StoreDetails = {
  storeId: string;
  name: string;
  location: string;
  phone: string;
  pincode: string;
  // lat and long not available in new API; set to defaults or remove UI elements if needed
  lat: number;
  long: number;
  // isActive not available; set to default
  isActive: boolean;
  totalEmployees: number;
  employees: Employee[];
  totalDeliveryPartners: number;
  deliveryPartners: DeliveryPartner[];
};

const MeatCenterView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<StoreDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (!id) {
        toast.error("Invalid store ID")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response: AxiosResponse<any> = await callApi({
          url: `/employee/assign/${id}`, // Updated to new endpoint; adjust prefix if needed (e.g., /admin/employee/assign/${id})
          method: "GET",
        })

        // Adapt based on the provided API structure
        const apiData = response.data.data
        const storeData = apiData.store
        setData({
          storeId: storeData.id,
          name: storeData.name,
          location: storeData.location,
          phone: storeData.phone,
          pincode: storeData.pincode,
          lat: 0, // Placeholder; not in API response
          long: 0, // Placeholder; not in API response
          isActive: true, // Placeholder; not in API response
          totalEmployees: apiData.employees?.length || 0,
          employees: apiData.employees || [],
          totalDeliveryPartners: apiData.deliveryPartners?.length || 0,
          deliveryPartners: apiData.deliveryPartners || [],
        })
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch meat center details"
        console.error("Error fetching meat center:", errorMessage)
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStoreDetails()
  }, [id])

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
          <h3 className="text-lg font-medium text-gray-900">Meat Center Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested meat center could not be loaded.</p>
          <button
            onClick={() => navigate('/meat-center')}
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/meat-center')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowBackIcon className="mr-1" />
            Back to List
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Meat Center Details</h1>
        </div>

        {/* Store Info Card */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{data.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-900">{data.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{data.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pincode</p>
                      <p className="text-gray-900">{data.pincode}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Coordinates</p>
                      <p className="text-gray-900">Lat: {data.lat}, Long: {data.long}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${data.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className={`text-${data.isActive ? 'green' : 'red'}-600 font-medium`}>
                        {data.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Employees</p>
                      <p className="text-gray-900">{data.totalEmployees}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table Card */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Employees</h2>
            {data.totalEmployees === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">No employees assigned yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {emp.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {emp.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.employeeId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Partners Table Card */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Partners</h2>
            {data.totalDeliveryPartners === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">No delivery partners assigned yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.deliveryPartners.map((partner) => (
                      <tr key={partner.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {partner.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {partner.status} / {partner.documentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeatCenterView
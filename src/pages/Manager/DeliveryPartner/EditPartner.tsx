// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { API_CONFIG } from '../../../config/api.config';

// interface DeliveryPartner {
//     _id: string;
//     name: string;
//     phone: string;
//     status: 'verified' | 'pending';
//     documentStatus: {
//         idProof: 'verified' | 'pending' | 'rejected';
//         addressProof: 'verified' | 'pending' | 'rejected';
//         vehicleDocuments: 'verified' | 'pending' | 'rejected';
//         drivingLicense: 'verified' | 'pending' | 'rejected';
//         insuranceDocuments: 'verified' | 'pending' | 'rejected';
//     };
// }

// const EditPartner: React.FC = () => {
//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const { id } = useParams<{ id: string }>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [isFetching, setIsFetching] = useState(true);
//     const [error, setError] = useState('');

//     const [formData, setFormData] = useState<DeliveryPartner>({
//         _id: '',
//         name: '',
//         phone: '',
//         status: 'pending',
//         documentStatus: {
//             idProof: 'pending',
//             addressProof: 'pending',
//             vehicleDocuments: 'pending',
//             drivingLicense: 'pending',
//             insuranceDocuments: 'pending'
//         }
//     });

//     // Calculate overall status based on document verification
//     const calculateOverallStatus = (documentStatus: any) => {
//         const allVerified = Object.values(documentStatus).every(status => status === 'verified');
//         return allVerified ? 'verified' : 'pending';
//     };

//     // Fetch partner data from backend
//     const fetchPartnerData = useCallback(async () => {
//         if (!id) return;

//         try {
//             setIsFetching(true);
//             setError('');

//             // Get auth token
//             const managerUser = localStorage.getItem('managerUser');
//             const accessToken = localStorage.getItem('accessToken');
//             const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);

//             if (!token) {
//                 setError('Authentication required. Please log in.');
//                 return;
//             }

//             const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS}/${id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch partner data: ${response.status}`);
//             }

//             const data = await response.json();

//             if (data.success && data.data) {
//                 // Try to load UI-only stored document statuses if present
//                 let storedDocStatus = undefined as any;
//                 try {
//                     storedDocStatus = JSON.parse(localStorage.getItem(`dpDocumentStatus:${data.data._id}`) || 'null');
//                 } catch { }
//                 const effectiveDocStatus = storedDocStatus || data.data.documentStatus || {
//                     idProof: 'pending',
//                     addressProof: 'pending',
//                     vehicleDocuments: 'pending',
//                     drivingLicense: 'pending',
//                     insuranceDocuments: 'pending'
//                 };

//                 setFormData({
//                     _id: data.data._id,
//                     name: data.data.name,
//                     phone: data.data.phone,
//                     status: data.data.status,
//                     documentStatus: effectiveDocStatus
//                 });
//                 console.log('✅ Partner data fetched successfully:', data.data);
//             } else {
//                 throw new Error('No partner data found in response');
//             }
//         } catch (error) {
//             console.error('❌ Error fetching partner data:', error);
//             setError(error instanceof Error ? error.message : 'Failed to fetch partner data');
//         } finally {
//             setIsFetching(false);
//         }
//     }, [id]);

//     useEffect(() => {
//         fetchPartnerData();
//     }, [fetchPartnerData]);

//     const handleInputChange = (field: keyof DeliveryPartner, value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handleDocumentStatusChange = (documentType: string, status: 'verified' | 'pending' | 'rejected') => {
//         setFormData(prev => ({
//             ...prev,
//             documentStatus: {
//                 ...prev.documentStatus,
//                 [documentType]: status
//             }
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');

//         try {
//             // Get auth token
//             const managerUser = localStorage.getItem('managerUser');
//             const accessToken = localStorage.getItem('accessToken');
//             const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);

//             if (!token) {
//                 setError('Authentication required. Please log in.');
//                 return;
//             }

//             // Calculate overall status
//             const overallStatus = calculateOverallStatus(formData.documentStatus);

//             const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS}/${id}`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     name: formData.name,
//                     phone: formData.phone,
//                     status: overallStatus,
//                     documentStatus: formData.documentStatus
//                 })
//             });

//             if (!response.ok) {
//                 let message = 'Failed to update partner';
//                 try {
//                     const errorData = await response.json();
//                     message = errorData.message || message;
//                 } catch { }
//                 if (response.status === 409) {
//                     message = 'A partner with this phone number already exists. Please use a different number.';
//                 }
//                 throw new Error(message);
//             }

//             // Also persist per-document statuses in backend via bulk endpoint to update overallDocumentStatus
//             try {
//                 const documentsPayload = {
//                     documents: [
//                         { documentType: 'idProof', status: formData.documentStatus.idProof },
//                         { documentType: 'addressProof', status: formData.documentStatus.addressProof },
//                         { documentType: 'vehicleDocuments', status: formData.documentStatus.vehicleDocuments },
//                         { documentType: 'drivingLicense', status: formData.documentStatus.drivingLicense },
//                         { documentType: 'insuranceDocuments', status: formData.documentStatus.insuranceDocuments }
//                     ]
//                 };
//                 await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS}/${id}/documents/bulk`, {
//                     method: 'PATCH',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(documentsPayload)
//                 });
//             } catch { }

//             // Persist UI document status for future loads
//             try {
//                 localStorage.setItem(`dpDocumentStatus:${formData._id}`, JSON.stringify(formData.documentStatus));
//             } catch { }

//             console.log('✅ Partner updated successfully');
//             navigate('/manager/delivery-partner');
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to update partner');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
//                 <div className="max-w-2xl mx-auto">
//                     <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
//                         <div className="text-center">
//                             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <svg className="w-8 h-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
//                             <div className="text-red-700 mb-6">{error}</div>
//                             <button
//                                 onClick={() => navigate('/manager/delivery-partner')}
//                                 className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
//                             >
//                                 Back to List
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (isFetching) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
//                 <div className="max-w-2xl mx-auto">
//                     <div className="bg-white rounded-2xl shadow-xl p-8">
//                         <div className="text-center">
//                             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                             <div className="text-xl text-gray-600">Loading partner data...</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
//             {/* Header Section */}
//             <div className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="container mx-auto px-6 py-6">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
//                                 Edit Staff
//                             </h1>
//                             <p className="text-gray-600 mt-1">Update staff information and status</p>
//                         </div>
//                         <button
//                             onClick={() => navigate('/manager/delivery-partner')}
//                             className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center gap-2"
//                         >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                             </svg>
//                             Back to Staff
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="container mx-auto px-6 py-8">
//                 {/* Edit Form */}
//                 <div className="max-w-3xl mx-auto">
//                     <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
//                         {/* Form Header */}
//                         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
//                             <div className="flex items-center">
//                                 <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
//                                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                                     </svg>
//                                 </div>
//                                 <div>
//                                     <h2 className="text-2xl font-bold mb-1">Partner Information</h2>
//                                     <p className="text-blue-100">Update delivery partner details and verification status</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Form Content */}
//                         <div className="p-8">
//                             <form onSubmit={handleSubmit} className="space-y-8">
//                                 {/* First Row - Name and Phone Number */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     {/* Name Field */}
//                                     <div className="group">
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                             <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
//                                             Full Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             value={formData.name}
//                                             onChange={(e) => handleInputChange('name', e.target.value)}
//                                             className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white group-hover:border-gray-300"
//                                             placeholder="Enter full name"
//                                             required
//                                         />
//                                     </div>

//                                     {/* Phone Number Field */}
//                                     <div className="group">
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                             <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
//                                             Phone Number
//                                         </label>
//                                         <input
//                                             type="tel"
//                                             value={formData.phone}
//                                             onChange={(e) => handleInputChange('phone', e.target.value)}
//                                             className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 group-hover:bg-white group-hover:border-gray-300"
//                                             placeholder="+91 98765 43210"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Document Verification Fields */}
//                                 <div className="bg-gray-50 rounded-2xl shadow-inner p-6">
//                                     <h3 className="text-xl font-bold mb-4 text-gray-800">Document Verification Status</h3>
//                                     <p className="text-sm text-gray-600 mb-4">Set the verification status for each required document. Overall status will be automatically calculated.</p>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
//                                                 ID Proof
//                                             </label>
//                                             <select
//                                                 value={formData.documentStatus.idProof}
//                                                 onChange={(e) => handleDocumentStatusChange('idProof', e.target.value as 'verified' | 'pending' | 'rejected')}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
//                                             >
//                                                 <option value="pending">⏳ Pending</option>
//                                                 <option value="verified">✅ Verified</option>
//                                                 <option value="rejected">❌ Rejected</option>
//                                             </select>
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
//                                                 Address Proof
//                                             </label>
//                                             <select
//                                                 value={formData.documentStatus.addressProof}
//                                                 onChange={(e) => handleDocumentStatusChange('addressProof', e.target.value as 'verified' | 'pending' | 'rejected')}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
//                                             >
//                                                 <option value="pending">⏳ Pending</option>
//                                                 <option value="verified">✅ Verified</option>
//                                                 <option value="rejected">❌ Rejected</option>
//                                             </select>
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
//                                                 Vehicle Documents
//                                             </label>
//                                             <select
//                                                 value={formData.documentStatus.vehicleDocuments}
//                                                 onChange={(e) => handleDocumentStatusChange('vehicleDocuments', e.target.value as 'verified' | 'pending' | 'rejected')}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
//                                             >
//                                                 <option value="pending">⏳ Pending</option>
//                                                 <option value="verified">✅ Verified</option>
//                                                 <option value="rejected">❌ Rejected</option>
//                                             </select>
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
//                                                 Driving License
//                                             </label>
//                                             <select
//                                                 value={formData.documentStatus.drivingLicense}
//                                                 onChange={(e) => handleDocumentStatusChange('drivingLicense', e.target.value as 'verified' | 'pending' | 'rejected')}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
//                                             >
//                                                 <option value="pending">⏳ Pending</option>
//                                                 <option value="verified">✅ Verified</option>
//                                                 <option value="rejected">❌ Rejected</option>
//                                             </select>
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
//                                                 Insurance Documents
//                                             </label>
//                                             <select
//                                                 value={formData.documentStatus.insuranceDocuments}
//                                                 onChange={(e) => handleDocumentStatusChange('insuranceDocuments', e.target.value as 'verified' | 'pending' | 'rejected')}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
//                                             >
//                                                 <option value="pending">⏳ Pending</option>
//                                                 <option value="verified">✅ Verified</option>
//                                                 <option value="rejected">❌ Rejected</option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                     <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                                         <div className="flex items-center">
//                                             <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                             </svg>
//                                             <span className="text-sm text-blue-700">
//                                                 <strong>Note:</strong> Overall status will be "Verified" only when all documents are verified. If any document is pending or rejected, status will be "Pending".
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Submit Buttons */}
//                                 <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
//                                     <button
//                                         type="button"
//                                         onClick={() => navigate('/manager/delivery-partner')}
//                                         className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1"
//                                     >
//                                         Cancel Changes
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         disabled={isLoading}
//                                         className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                                     >
//                                         {isLoading ? (
//                                             <div className="flex items-center justify-center">
//                                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                 </svg>
//                                                 Submitting...
//                                             </div>
//                                         ) : (
//                                             <div className="flex items-center justify-center">
//                                                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                                 </svg>
//                                                 Submit
//                                             </div>
//                                         )}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditPartner;


import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_CONFIG } from '../../../config/api.config';

interface DeliveryPartner {
    _id: string;
    name: string;
    phone: string;
    status: 'verified' | 'pending';
    documentStatus: {
        idProof: 'verified' | 'pending' | 'rejected';
        addressProof: 'verified' | 'pending' | 'rejected';
        vehicleDocuments: 'verified' | 'pending' | 'rejected';
        drivingLicense: 'verified' | 'pending' | 'rejected';
        insuranceDocuments: 'verified' | 'pending' | 'rejected';
    };
}

const EditPartner: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<DeliveryPartner>({
        _id: '',
        name: '',
        phone: '',
        status: 'pending',
        documentStatus: {
            idProof: 'pending',
            addressProof: 'pending',
            vehicleDocuments: 'pending',
            drivingLicense: 'pending',
            insuranceDocuments: 'pending'
        }
    });

    // Calculate overall status based on document verification
    const calculateOverallStatus = (documentStatus: any) => {
        const allVerified = Object.values(documentStatus).every(status => status === 'verified');
        return allVerified ? 'verified' : 'pending';
    };

    // Fetch partner data from backend
    const fetchPartnerData = useCallback(async () => {
        if (!id) return;

        try {
            setIsFetching(true);
            setError('');

            // Get auth token
            const managerUser = localStorage.getItem('managerUser');
            const accessToken = localStorage.getItem('accessToken');
            const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);

            if (!token) {
                setError('Authentication required. Please log in.');
                return;
            }

            // Try backend API first, fall back to localStorage if 404
            try {
                // Fixed URL construction: Ensure endpoints start with '/' for relative paths
                const endpointPath = API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS.startsWith('/')
                    ? API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS
                    : `/${API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS}`;
                const url = `${API_CONFIG.BASE_URL}${endpointPath}/${id}`;

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        // Try to load UI-only stored document statuses if present
                        let storedDocStatus = undefined as any;
                        try {
                            storedDocStatus = JSON.parse(localStorage.getItem(`dpDocumentStatus:${data.data._id}`) || 'null');
                        } catch { }
                        const effectiveDocStatus = storedDocStatus || data.data.documentStatus || {
                            idProof: 'pending',
                            addressProof: 'pending',
                            vehicleDocuments: 'pending',
                            drivingLicense: 'pending',
                            insuranceDocuments: 'pending'
                        };

                        setFormData({
                            _id: data.data._id,
                            name: data.data.name,
                            phone: data.data.phone,
                            status: data.data.status,
                            documentStatus: effectiveDocStatus
                        });
                        console.log('✅ Partner data fetched from backend successfully:', data.data);
                        return; // Success, exit early
                    }
                }

                // If backend fails with 404, use localStorage fallback
                if (response.status === 404) {
                    console.log('⚠️ Backend endpoint not available, loading from localStorage');
                    const localKey = `delivery_partner_${id}`;
                    const localData = localStorage.getItem(localKey);
                    
                    if (localData) {
                        const parsedData = JSON.parse(localData);
                        setFormData(parsedData);
                        console.log('✅ Partner data loaded from localStorage:', parsedData);
                        return;
                    }
                    
                    // If no local data, create default data
                    const defaultData = {
                        _id: id,
                        name: 'Sample Partner',
                        phone: '+91 98765 43210',
                        status: 'pending' as const,
                        documentStatus: {
                            idProof: 'pending' as const,
                            addressProof: 'pending' as const,
                            vehicleDocuments: 'pending' as const,
                            drivingLicense: 'pending' as const,
                            insuranceDocuments: 'pending' as const
                        }
                    };
                    setFormData(defaultData);
                    console.log('✅ Using default partner data');
                    return;
                }

                // For other errors, throw them
                throw new Error(`Failed to fetch partner data: ${response.status}`);
                
            } catch (apiError: any) {
                // If it's a 404 or network error, use localStorage fallback
                if (apiError.message.includes('404') || apiError.message.includes('Failed to fetch')) {
                    console.log('⚠️ Backend unavailable, loading from localStorage');
                    const localKey = `delivery_partner_${id}`;
                    const localData = localStorage.getItem(localKey);
                    
                    if (localData) {
                        const parsedData = JSON.parse(localData);
                        setFormData(parsedData);
                        console.log('✅ Partner data loaded from localStorage:', parsedData);
                        return;
                    }
                    
                    // If no local data, create default data
                    const defaultData = {
                        _id: id,
                        name: 'Sample Partner',
                        phone: '+91 98765 43210',
                        status: 'pending' as const,
                        documentStatus: {
                            idProof: 'pending' as const,
                            addressProof: 'pending' as const,
                            vehicleDocuments: 'pending' as const,
                            drivingLicense: 'pending' as const,
                            insuranceDocuments: 'pending' as const
                        }
                    };
                    setFormData(defaultData);
                    console.log('✅ Using default partner data');
                    return;
                }
                
                // For other errors, throw them
                throw apiError;
            }
        } catch (error) {
            console.error('❌ Error fetching partner data:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch partner data');
        } finally {
            setIsFetching(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPartnerData();
    }, [fetchPartnerData]);

    const handleInputChange = (field: keyof DeliveryPartner, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDocumentStatusChange = (documentType: string, status: 'verified' | 'pending' | 'rejected') => {
        setFormData(prev => ({
            ...prev,
            documentStatus: {
                ...prev.documentStatus,
                [documentType]: status
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Get auth token
            const managerUser = localStorage.getItem('managerUser');
            const accessToken = localStorage.getItem('accessToken');
            const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);

            if (!token) {
                setError('Authentication required. Please log in.');
                return;
            }

            // Calculate overall status
            const overallStatus = calculateOverallStatus(formData.documentStatus);

            // Try backend API first, fall back to localStorage if 404
            try {
                // Fixed URL construction: Ensure endpoints start with '/' for relative paths
                const endpointPath = API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS.startsWith('/')
                    ? API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS
                    : `/${API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS}`;
                const url = `${API_CONFIG.BASE_URL}${endpointPath}/${id}`;

                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        phone: formData.phone,
                        status: overallStatus,
                        documentStatus: formData.documentStatus
                    })
                });

                if (response.ok) {
                    console.log('✅ Partner updated in backend successfully');
                    
                    // Also persist per-document statuses in backend via bulk endpoint to update overallDocumentStatus
                    try {
                        const bulkEndpoint = `${endpointPath}/${id}/documents/bulk`;
                        const bulkUrl = `${API_CONFIG.BASE_URL}${bulkEndpoint.startsWith('/') ? bulkEndpoint : `/${bulkEndpoint}`}`;

                        const documentsPayload = {
                            documents: [
                                { documentType: 'idProof', status: formData.documentStatus.idProof },
                                { documentType: 'addressProof', status: formData.documentStatus.addressProof },
                                { documentType: 'vehicleDocuments', status: formData.documentStatus.vehicleDocuments },
                                { documentType: 'drivingLicense', status: formData.documentStatus.drivingLicense },
                                { documentType: 'insuranceDocuments', status: formData.documentStatus.insuranceDocuments }
                            ]
                        };
                        await fetch(bulkUrl, {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(documentsPayload)
                        });
                    } catch { }

                    // Persist UI document status for future loads
                    try {
                        localStorage.setItem(`dpDocumentStatus:${formData._id}`, JSON.stringify(formData.documentStatus));
                    } catch { }

                    console.log('✅ Partner updated successfully');
                    navigate('/manager/delivery-partner');
                    return; // Success, exit early
                }

                // If backend fails with 404, save to localStorage
                if (response.status === 404) {
                    console.log('⚠️ Backend endpoint not available, saving to localStorage');
                    const localKey = `delivery_partner_${id}`;
                    const updatedData = {
                        ...formData,
                        status: overallStatus
                    };
                    localStorage.setItem(localKey, JSON.stringify(updatedData));
                    console.log('✅ Partner data saved to localStorage');
                    navigate('/manager/delivery-partner');
                    return;
                }

                // For other errors, throw them
                let message = 'Failed to update partner';
                try {
                    const errorData = await response.json();
                    message = errorData.message || message;
                } catch { }
                if (response.status === 409) {
                    message = 'A partner with this phone number already exists. Please use a different number.';
                }
                throw new Error(message);

            } catch (apiError: any) {
                // If it's a 404 or network error, save to localStorage
                if (apiError.message.includes('404') || apiError.message.includes('Failed to fetch')) {
                    console.log('⚠️ Backend unavailable, saving to localStorage');
                    const localKey = `delivery_partner_${id}`;
                    const updatedData = {
                        ...formData,
                        status: overallStatus
                    };
                    localStorage.setItem(localKey, JSON.stringify(updatedData));
                    console.log('✅ Partner data saved to localStorage');
                    navigate('/manager/delivery-partner');
                    return;
                }
                
                // For other errors, throw them
                throw apiError;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update partner');
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
                            <div className="text-red-700 mb-6">{error}</div>
                            <button
                                onClick={() => navigate('/manager/delivery-partner')}
                                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <div className="text-xl text-gray-600">Loading partner data...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                Edit Staff
                            </h1>
                            <p className="text-gray-600 mt-1">Update staff information and status</p>
                        </div>
                        <button
                            onClick={() => navigate('/manager/delivery-partner')}
                            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Staff
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Edit Form */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
                            <div className="flex items-center">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Partner Information</h2>
                                    <p className="text-blue-100">Update delivery partner details and verification status</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* First Row - Name and Phone Number */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white group-hover:border-gray-300"
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>

                                    {/* Phone Number Field */}
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 group-hover:bg-white group-hover:border-gray-300"
                                            placeholder="+91 98765 43210"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Document Verification Fields */}
                                <div className="bg-gray-50 rounded-2xl shadow-inner p-6">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Document Verification Status</h3>
                                    <p className="text-sm text-gray-600 mb-4">Set the verification status for each required document. Overall status will be automatically calculated.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                                ID Proof
                                            </label>
                                            <select
                                                value={formData.documentStatus.idProof}
                                                onChange={(e) => handleDocumentStatusChange('idProof', e.target.value as 'verified' | 'pending' | 'rejected')}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
                                            >
                                                <option value="pending">⏳ Pending</option>
                                                <option value="verified">✅ Verified</option>
                                                <option value="rejected">❌ Rejected</option>
                                            </select>
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                                Address Proof
                                            </label>
                                            <select
                                                value={formData.documentStatus.addressProof}
                                                onChange={(e) => handleDocumentStatusChange('addressProof', e.target.value as 'verified' | 'pending' | 'rejected')}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
                                            >
                                                <option value="pending">⏳ Pending</option>
                                                <option value="verified">✅ Verified</option>
                                                <option value="rejected">❌ Rejected</option>
                                            </select>
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                                Vehicle Documents
                                            </label>
                                            <select
                                                value={formData.documentStatus.vehicleDocuments}
                                                onChange={(e) => handleDocumentStatusChange('vehicleDocuments', e.target.value as 'verified' | 'pending' | 'rejected')}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
                                            >
                                                <option value="pending">⏳ Pending</option>
                                                <option value="verified">✅ Verified</option>
                                                <option value="rejected">❌ Rejected</option>
                                            </select>
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                                Driving License
                                            </label>
                                            <select
                                                value={formData.documentStatus.drivingLicense}
                                                onChange={(e) => handleDocumentStatusChange('drivingLicense', e.target.value as 'verified' | 'pending' | 'rejected')}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
                                            >
                                                <option value="pending">⏳ Pending</option>
                                                <option value="verified">✅ Verified</option>
                                                <option value="rejected">❌ Rejected</option>
                                            </select>
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                                Insurance Documents
                                            </label>
                                            <select
                                                value={formData.documentStatus.insuranceDocuments}
                                                onChange={(e) => handleDocumentStatusChange('insuranceDocuments', e.target.value as 'verified' | 'pending' | 'rejected')}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
                                            >
                                                <option value="pending">⏳ Pending</option>
                                                <option value="verified">✅ Verified</option>
                                                <option value="rejected">❌ Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm text-blue-700">
                                                <strong>Note:</strong> Overall status will be "Verified" only when all documents are verified. If any document is pending or rejected, status will be "Pending".
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/manager/delivery-partner')}
                                        className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        Cancel Changes
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Submit
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPartner;
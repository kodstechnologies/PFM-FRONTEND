// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { API_CONFIG } from '../../../config/api.config';

// interface DeliveryPartner {
//     _id: string;
//     name: string;
//     lastName?: string;
//     img?: string;
//     dob?: Date;
//     guardianName?: string;
//     age?: number;
//     phone: string;
//     emergencyContact?: string;
//     email?: string;
//     permanentAddress?: string;
//     currentAddress?: string;
//     pin?: string;
//     status: 'verified' | 'pending';
//     bankAccountNumber?: string;
//     IFSCCode?: string;
//     accountHolderName?: string;
//     documentStatus: {
//         idProof: 'verified' | 'pending' | 'rejected';
//         addressProof: 'verified' | 'pending' | 'rejected';
//         panProof: 'verified' | 'pending' | 'rejected';
//         vehicleDocuments: 'verified' | 'pending' | 'rejected';
//         drivingLicense: 'verified' | 'pending' | 'rejected';
//         insuranceDocuments: 'verified' | 'pending' | 'rejected';
//     };
//     verificationNotes?: {
//         idProof?: string;
//         addressProof?: string;
//         panProof?: string;
//         vehicleDocuments?: string;
//         drivingLicense?: string;
//         insuranceDocuments?: string;
//     };
//     overallDocumentStatus?: 'verified' | 'pending' | 'rejected';
//     isActive?: boolean;
//     assignedOrders?: string[];
//     totalDeliveries?: number;
//     totalAccepted?: number;
//     totalRejected?: number;
//     rating?: number;
//     lastActive?: Date;
// }

// const defaultDocumentStatus = {
//     idProof: 'pending' as const,
//     addressProof: 'pending' as const,
//     panProof: 'pending' as const,
//     vehicleDocuments: 'pending' as const,
//     drivingLicense: 'pending' as const,
//     insuranceDocuments: 'pending' as const,
// };

// const defaultFormData: Omit<DeliveryPartner, '_id'> = {
//     name: '',
//     lastName: '',
//     img: '',
//     dob: undefined,
//     guardianName: '',
//     age: 0,
//     phone: '',
//     emergencyContact: '',
//     email: '',
//     permanentAddress: '',
//     currentAddress: '',
//     pin: '',
//     status: 'pending',
//     bankAccountNumber: '',
//     IFSCCode: '',
//     accountHolderName: '',
//     documentStatus: defaultDocumentStatus,
//     verificationNotes: {},
//     overallDocumentStatus: 'pending',
//     isActive: true,
//     assignedOrders: [],
//     totalDeliveries: 0,
//     totalAccepted: 0,
//     totalRejected: 0,
//     rating: 0,
//     lastActive: new Date(),
// };

// const EditPartner: React.FC = () => {
//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const { id } = useParams<{ id: string }>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [isFetching, setIsFetching] = useState(true);
//     const [error, setError] = useState('');

//     const [formData, setFormData] = useState<DeliveryPartner>({
//         _id: '',
//         ...defaultFormData,
//     });
//     const [newImageFile, setNewImageFile] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);

//     // Normalize endpoint to handle cases where it might include full URL
//     const normalizeEndpoint = useCallback((endpoint: string, baseUrl: string): string => {
//         if (endpoint.startsWith('http')) {
//             // If it starts with the base URL, strip it to get relative path
//             if (endpoint.startsWith(baseUrl)) {
//                 return endpoint.slice(baseUrl.length);
//             }
//             // Otherwise, treat as full URL and return as is (but for consistency, we'll use relative here)
//             // For this app, assuming same base, so strip if possible
//             const relative = endpoint.replace(baseUrl, '');
//             return relative.startsWith('/') ? relative : `/${relative}`;
//         }
//         return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
//     }, []);

//     // Calculate overall document status based on document verification
//     const calculateOverallStatus = useCallback((documentStatus: DeliveryPartner['documentStatus']) => {
//         const statuses = Object.values(documentStatus);
//         if (statuses.some((s) => s === 'rejected')) {
//             return 'rejected';
//         } else if (statuses.every((s) => s === 'verified')) {
//             return 'verified';
//         } else {
//             return 'pending';
//         }
//     }, []);

//     // Calculate age from DOB
//     useEffect(() => {
//         if (formData.dob) {
//             const today = new Date();
//             const birthDate = new Date(formData.dob);
//             let age = today.getFullYear() - birthDate.getFullYear();
//             const m = today.getMonth() - birthDate.getMonth();
//             if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//                 age--;
//             }
//             setFormData((prev) => ({ ...prev, age }));
//         }
//     }, [formData.dob]);

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

//             let storedDocStatus: Partial<DeliveryPartner['documentStatus']> | undefined;
//             try {
//                 storedDocStatus = JSON.parse(localStorage.getItem(`dpDocumentStatus:${id}`) || '{}');
//             } catch { }

//             // Try backend API first
//             try {
//                 let partnersEndpoint = API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS;
//                 const endpointPath = "/manager/delivery-partners";
//                 const url = `${API_CONFIG.BASE_URL}${endpointPath}/${id}`;

//                 const response = await fetch(url, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.success && data.data) {
//                         const effectiveDocStatus = {
//                             ...defaultDocumentStatus,
//                             ...data.data.documentStatus,
//                             ...storedDocStatus,
//                         };

//                         const partnerData: DeliveryPartner = {
//                             _id: data.data._id,
//                             ...defaultFormData,
//                             ...data.data,
//                             documentStatus: effectiveDocStatus,
//                             dob: data.data.dob ? new Date(data.data.dob) : undefined,
//                             lastActive: data.data.lastActive ? new Date(data.data.lastActive) : new Date(),
//                         };

//                         setFormData(partnerData);
//                         setImagePreview(partnerData.img || null);
//                         console.log('✅ Partner data fetched from backend successfully:', data.data);
//                         return;
//                     }
//                 }

//                 if (response.status === 404) {
//                     throw new Error('404');
//                 }

//                 throw new Error(`Failed to fetch partner data: ${response.status}`);
//             } catch (apiError: any) {
//                 // Fallback to localStorage on 404 or network errors
//                 if (apiError.message.includes('404') || apiError.message.includes('Failed to fetch')) {
//                     console.log('⚠️ Backend unavailable, loading from localStorage');
//                     const localKey = `delivery_partner_${id}`;
//                     const localData = localStorage.getItem(localKey);

//                     if (localData) {
//                         const parsedData = JSON.parse(localData);
//                         const effectiveDocStatus = {
//                             ...defaultDocumentStatus,
//                             ...parsedData.documentStatus,
//                             ...storedDocStatus,
//                         };

//                         const partnerData: DeliveryPartner = {
//                             _id: id,
//                             ...defaultFormData,
//                             ...parsedData,
//                             documentStatus: effectiveDocStatus,
//                             dob: parsedData.dob ? new Date(parsedData.dob) : undefined,
//                             lastActive: parsedData.lastActive ? new Date(parsedData.lastActive) : new Date(),
//                         };

//                         setFormData(partnerData);
//                         setImagePreview(partnerData.img || null);
//                         console.log('✅ Partner data loaded from localStorage:', parsedData);
//                         return;
//                     }

//                     // Default data
//                     const defaultPartnerData: DeliveryPartner = {
//                         _id: id,
//                         name: 'Sample Partner',
//                         phone: '+91 98765 43210',
//                         ...defaultFormData,
//                         documentStatus: {
//                             ...defaultDocumentStatus,
//                             ...storedDocStatus,
//                         },
//                     };
//                     setFormData(defaultPartnerData);
//                     setImagePreview(defaultPartnerData.img || null);
//                     console.log('✅ Using default partner data');
//                     return;
//                 }

//                 throw apiError;
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

//     const handleInputChange = useCallback(
//         (field: keyof DeliveryPartner, value: string | Date | boolean | undefined) => {
//             setFormData((prev) => ({
//                 ...prev,
//                 [field]: value,
//             }));
//         },
//         []
//     );

//     const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setNewImageFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     }, []);

//     const handleDocumentStatusChange = useCallback(
//         (documentType: keyof DeliveryPartner['documentStatus'], status: 'verified' | 'pending' | 'rejected') => {
//             setFormData((prev) => ({
//                 ...prev,
//                 documentStatus: {
//                     ...prev.documentStatus,
//                     [documentType]: status,
//                 },
//             }));
//         },
//         []
//     );

//     const handleNotesChange = useCallback(
//         (documentType: string, note: string) => {
//             setFormData((prev) => ({
//                 ...prev,
//                 verificationNotes: {
//                     ...prev.verificationNotes,
//                     [documentType]: note,
//                 },
//             }));
//         },
//         []
//     );

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');

//         try {
//             const managerUser = localStorage.getItem('managerUser');
//             const accessToken = localStorage.getItem('accessToken');
//             const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);

//             if (!token) {
//                 setError('Authentication required. Please log in.');
//                 return;
//             }

//             // Calculate age
//             const today = new Date();
//             let age = 0;
//             if (formData.dob) {
//                 const birthDate = new Date(formData.dob);
//                 age = today.getFullYear() - birthDate.getFullYear();
//                 const monthDiff = today.getMonth() - birthDate.getMonth();
//                 if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//                     age--;
//                 }
//             }

//             const overallStatus = calculateOverallStatus(formData.documentStatus);

//             const formDataToSend = new FormData();
//             formDataToSend.append('name', formData.name);
//             formDataToSend.append('lastName', formData.lastName || '');
//             formDataToSend.append('dob', formData.dob ? formData.dob.toISOString() : '');
//             formDataToSend.append('age', age.toString());
//             formDataToSend.append('guardianName', formData.guardianName || '');
//             formDataToSend.append('phone', formData.phone);
//             formDataToSend.append('emergencyContact', formData.emergencyContact || '');
//             formDataToSend.append('email', formData.email || '');
//             formDataToSend.append('permanentAddress', formData.permanentAddress || '');
//             formDataToSend.append('currentAddress', formData.currentAddress || '');
//             formDataToSend.append('pin', formData.pin || '');
//             formDataToSend.append('status', formData.status);
//             formDataToSend.append('bankAccountNumber', formData.bankAccountNumber || '');
//             formDataToSend.append('IFSCCode', formData.IFSCCode || '');
//             formDataToSend.append('accountHolderName', formData.accountHolderName || '');
//             formDataToSend.append('documentStatus', JSON.stringify(formData.documentStatus));
//             formDataToSend.append('verificationNotes', JSON.stringify(formData.verificationNotes || {}));
//             formDataToSend.append('overallDocumentStatus', overallStatus);
//             formDataToSend.append('isActive', formData.isActive ? 'true' : 'false');

//             // Handle image
//             if (newImageFile) {
//                 formDataToSend.append('img', newImageFile);
//             } else {
//                 formDataToSend.append('img', formData.img || '');
//             }

//             // Log FormData for debugging
//             for (let [key, value] of formDataToSend.entries()) {
//                 console.log(key, value);
//             }

//             try {
//                 let partnersEndpoint = API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS;
//                 const endpointPath = normalizeEndpoint(partnersEndpoint, API_CONFIG.BASE_URL);
//                 const url = `${API_CONFIG.BASE_URL}${endpointPath}/${id}`;

//                 const response = await fetch(url, {
//                     method: 'PATCH',
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         // Do not set Content-Type; let browser set multipart/form-data with boundary
//                     },
//                     body: formDataToSend,
//                 });

//                 if (response.ok) {
//                     console.log('✅ Partner updated in backend successfully');

//                     try {
//                         localStorage.setItem(`dpDocumentStatus:${formData._id}`, JSON.stringify(formData.documentStatus));
//                     } catch { }

//                     console.log('✅ Partner updated successfully');
//                     navigate('/manager/delivery-partner');
//                     return;
//                 }

//                 if (response.status === 404) {
//                     throw new Error('404');
//                 }

//                 let message = 'Failed to update partner';
//                 try {
//                     const errorData = await response.json();
//                     message = errorData.message || message;
//                 } catch { }
//                 if (response.status === 409) {
//                     message = 'A partner with this phone number already exists. Please use a different number.';
//                 }
//                 throw new Error(message);
//             } catch (apiError: any) {
//                 if (apiError.message.includes('404') || apiError.message.includes('Failed to fetch')) {
//                     console.log('⚠️ Backend unavailable, saving to localStorage');
//                     const localKey = `delivery_partner_${id}`;
//                     const imgToSave = imagePreview || formData.img;
//                     const updatedData = {
//                         ...formData,
//                         img: imgToSave,
//                         dob: formData.dob ? formData.dob.toISOString() : undefined,
//                         age,
//                         overallDocumentStatus: overallStatus,
//                     };
//                     localStorage.setItem(localKey, JSON.stringify(updatedData));
//                     console.log('✅ Partner data saved to localStorage');
//                     navigate('/manager/delivery-partner');
//                     return;
//                 }

//                 throw apiError;
//             }
//         } catch (err) {
//             console.error('❌ Error updating partner:', err);
//             setError(err instanceof Error ? err.message : 'Failed to update partner');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const currentPreview = imagePreview || formData.img;

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
//                 <div className="max-w-2xl mx-auto">
//                     <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
//                         <div className="text-center">
//                             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <svg className="w-8 h-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
//                                     <path
//                                         fillRule="evenodd"
//                                         d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                                         clipRule="evenodd"
//                                     />
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
//                 <div className="max-w-4xl mx-auto">
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
//                                 {/* Personal Information */}
//                                 <div className="bg-gray-50 rounded-2xl p-6">
//                                     <h3 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
//                                                 First Name
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.name}
//                                                 onChange={(e) => handleInputChange('name', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="Enter first name"
//                                                 required
//                                             />
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
//                                                 Last Name
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.lastName || ''}
//                                                 onChange={(e) => handleInputChange('lastName', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="Enter last name"
//                                             />
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
//                                                 Date of Birth
//                                             </label>
//                                             <input
//                                                 type="date"
//                                                 value={formData.dob ? formData.dob.toISOString().split('T')[0] : ''}
//                                                 onChange={(e) => handleInputChange('dob', e.target.value ? new Date(e.target.value) : undefined)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                             />
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
//                                                 Age
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 value={formData.age || ''}
//                                                 readOnly
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
//                                             />
//                                         </div>
//                                         <div className="group md:col-span-2">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
//                                                 Guardian Name
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.guardianName || ''}
//                                                 onChange={(e) => handleInputChange('guardianName', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="Enter guardian name"
//                                             />
//                                         </div>
//                                         <div className="group md:col-span-2">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
//                                                 Profile Image
//                                             </label>
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={handleImageChange}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white group-hover:bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
//                                             />
//                                             {currentPreview && (
//                                                 <div className="mt-2">
//                                                     <img
//                                                         src={currentPreview}
//                                                         alt="Profile Preview"
//                                                         className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
//                                                     />
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Contact Information */}
//                                 <div className="bg-gray-50 rounded-2xl p-6">
//                                     <h3 className="text-xl font-bold mb-4 text-gray-800">Contact Information</h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
//                                                 Phone Number
//                                             </label>
//                                             <input
//                                                 type="tel"
//                                                 value={formData.phone}
//                                                 onChange={(e) => handleInputChange('phone', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="+91 98765 43210"
//                                                 required
//                                             />
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
//                                                 Emergency Contact
//                                             </label>
//                                             <input
//                                                 type="tel"
//                                                 value={formData.emergencyContact || ''}
//                                                 onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="+91 98765 43210"
//                                             />
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
//                                                 Email
//                                             </label>
//                                             <input
//                                                 type="email"
//                                                 value={formData.email || ''}
//                                                 onChange={(e) => handleInputChange('email', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="example@email.com"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Address Information */}
//                                 <div className="bg-gray-50 rounded-2xl p-6">
//                                     <h3 className="text-xl font-bold mb-4 text-gray-800">Address Information</h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="group md:col-span-2">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
//                                                 Permanent Address
//                                             </label>
//                                             <textarea
//                                                 value={formData.permanentAddress || ''}
//                                                 onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="Enter permanent address"
//                                                 rows={3}
//                                             />
//                                         </div>
//                                         <div className="group md:col-span-2">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
//                                                 Current Address
//                                             </label>
//                                             <textarea
//                                                 value={formData.currentAddress || ''}
//                                                 onChange={(e) => handleInputChange('currentAddress', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="Enter current address"
//                                                 rows={3}
//                                             />
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
//                                                 PIN Code
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.pin || ''}
//                                                 onChange={(e) => handleInputChange('pin', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="Enter PIN code"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Bank Details */}
//                                 <div className="bg-gray-50 rounded-2xl p-6">
//                                     <h3 className="text-xl font-bold mb-4 text-gray-800">Bank Details</h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
//                                                 Account Holder Name
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.accountHolderName || ''}
//                                                 onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="Enter account holder name"
//                                             />
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
//                                                 Bank Account Number
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.bankAccountNumber || ''}
//                                                 onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="Enter bank account number"
//                                             />
//                                         </div>
//                                         <div className="group">
//                                             <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                 <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
//                                                 IFSC Code
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.IFSCCode || ''}
//                                                 onChange={(e) => handleInputChange('IFSCCode', e.target.value)}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
//                                                 placeholder="Enter IFSC code"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Document Verification Fields */}
//                                 <div className="bg-gray-50 rounded-2xl shadow-inner p-6">
//                                     <h3 className="text-xl font-bold mb-4 text-gray-800">Document Verification Status</h3>
//                                     <p className="text-sm text-gray-600 mb-4">Set the verification status for each required document. Overall status will be automatically calculated.</p>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         {[
//                                             { key: 'idProof', label: 'ID Proof', color: 'blue' },
//                                             { key: 'addressProof', label: 'Address Proof', color: 'orange' },
//                                             { key: 'panProof', label: 'PAN Proof', color: 'yellow' },
//                                             { key: 'vehicleDocuments', label: 'Vehicle Documents', color: 'purple' },
//                                             { key: 'drivingLicense', label: 'Driving License', color: 'red' },
//                                             { key: 'insuranceDocuments', label: 'Insurance Documents', color: 'green' },
//                                         ].map(({ key, label, color }) => (
//                                             <div key={key} className="space-y-3">
//                                                 <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
//                                                     <div className={`w-2 h-2 bg-${color}-500 rounded-full mr-3`}></div>
//                                                     {label}
//                                                 </label>
//                                                 <select
//                                                     value={formData.documentStatus[key as keyof DeliveryPartner['documentStatus']]}
//                                                     onChange={(e) => handleDocumentStatusChange(key as keyof DeliveryPartner['documentStatus'], e.target.value as 'verified' | 'pending' | 'rejected')}
//                                                     className={`w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500 transition-all duration-300 bg-white`}
//                                                 >
//                                                     <option value="pending">⏳ Pending</option>
//                                                     <option value="verified">✅ Verified</option>
//                                                     <option value="rejected">❌ Rejected</option>
//                                                 </select>
//                                                 {/* <textarea
//                                                     value={formData.verificationNotes?.[key as keyof DeliveryPartner['verificationNotes']] || ''}
//                                                     onChange={(e) => handleNotesChange(key as string, e.target.value)}
//                                                     placeholder="Verification notes (optional)"
//                                                     className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-gray-300"
//                                                     rows={2}
//                                                 /> */}
//                                             </div>
//                                         ))}
//                                     </div>
//                                     <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center">
//                                                 <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                 </svg>
//                                                 <span className="text-sm text-blue-700">
//                                                     <strong>Overall Document Status:</strong> {calculateOverallStatus(formData.documentStatus)}
//                                                 </span>
//                                             </div>
//                                             <span className="text-sm text-blue-700">
//                                                 <strong>Note:</strong> Overall status is auto-calculated based on individual document statuses.
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
//                                                 <svg
//                                                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     fill="none"
//                                                     viewBox="0 0 24 24"
//                                                 >
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                     <path
//                                                         className="opacity-75"
//                                                         fill="currentColor"
//                                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                                     ></path>
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
    lastName?: string;
    img?: string;
    dob?: Date;
    guardianName?: string;
    age?: number;
    phone: string;
    emergencyContact?: string;
    email?: string;
    permanentAddress?: string;
    currentAddress?: string;
    pin?: string;
    status: 'verified' | 'pending';
    bankAccountNumber?: string;
    IFSCCode?: string;
    accountHolderName?: string;
    documentStatus: {
        idProof: 'verified' | 'pending' | 'rejected';
        addressProof: 'verified' | 'pending' | 'rejected';
        panProof: 'verified' | 'pending' | 'rejected';
        vehicleDocuments: 'verified' | 'pending' | 'rejected';
        drivingLicense: 'verified' | 'pending' | 'rejected';
        insuranceDocuments: 'verified' | 'pending' | 'rejected';
    };
    verificationNotes?: {
        idProof?: string;
        addressProof?: string;
        panProof?: string;
        vehicleDocuments?: string;
        drivingLicense?: string;
        insuranceDocuments?: string;
    };
    overallDocumentStatus?: 'verified' | 'pending' | 'rejected';
    isActive?: boolean;
    assignedOrders?: string[];
    totalDeliveries?: number;
    totalAccepted?: number;
    totalRejected?: number;
    rating?: number;
    lastActive?: Date;
}

const defaultDocumentStatus = {
    idProof: 'pending' as const,
    addressProof: 'pending' as const,
    panProof: 'pending' as const,
    vehicleDocuments: 'pending' as const,
    drivingLicense: 'pending' as const,
    insuranceDocuments: 'pending' as const,
};

const defaultFormData: Omit<DeliveryPartner, '_id'> = {
    name: '',
    lastName: '',
    img: '',
    dob: undefined,
    guardianName: '',
    age: 0,
    phone: '',
    emergencyContact: '',
    email: '',
    permanentAddress: '',
    currentAddress: '',
    pin: '',
    status: 'pending',
    bankAccountNumber: '',
    IFSCCode: '',
    accountHolderName: '',
    documentStatus: defaultDocumentStatus,
    verificationNotes: {},
    overallDocumentStatus: 'pending',
    isActive: true,
    assignedOrders: [],
    totalDeliveries: 0,
    totalAccepted: 0,
    totalRejected: 0,
    rating: 0,
    lastActive: new Date(),
};

const EditPartner: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<DeliveryPartner>({
        _id: '',
        ...defaultFormData,
    });
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Normalize endpoint to handle cases where it might include full URL
    const normalizeEndpoint = useCallback((endpoint: string, baseUrl: string): string => {
        if (endpoint.startsWith('http')) {
            // If it starts with the base URL, strip it to get relative path
            if (endpoint.startsWith(baseUrl)) {
                return endpoint.slice(baseUrl.length);
            }
            // Otherwise, treat as full URL and return as is (but for consistency, we'll use relative here)
            // For this app, assuming same base, so strip if possible
            const relative = endpoint.replace(baseUrl, '');
            return relative.startsWith('/') ? relative : `/${relative}`;
        }
        return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    }, []);

    // Calculate overall document status based on document verification
    const calculateOverallStatus = useCallback((documentStatus: DeliveryPartner['documentStatus']) => {
        const statuses = Object.values(documentStatus);
        if (statuses.some((s) => s === 'rejected')) {
            return 'rejected';
        } else if (statuses.every((s) => s === 'verified')) {
            return 'verified';
        } else {
            return 'pending';
        }
    }, []);

    // Calculate age from DOB
    useEffect(() => {
        if (formData.dob) {
            const today = new Date();
            const birthDate = new Date(formData.dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setFormData((prev) => ({ ...prev, age }));
        }
    }, [formData.dob]);

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

            let storedDocStatus: Partial<DeliveryPartner['documentStatus']> | undefined;
            try {
                storedDocStatus = JSON.parse(localStorage.getItem(`dpDocumentStatus:${id}`) || '{}');
            } catch { }

            // Try backend API first
            try {
                let partnersEndpoint = API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS;
                const endpointPath = "/manager/delivery-partners";
                const url = `${API_CONFIG.BASE_URL}${endpointPath}/${id}`;

                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        const effectiveDocStatus = {
                            ...defaultDocumentStatus,
                            ...data.data.documentStatus,
                            ...storedDocStatus,
                        };

                        const partnerData: DeliveryPartner = {
                            _id: data.data._id,
                            ...defaultFormData,
                            ...data.data,
                            documentStatus: effectiveDocStatus,
                            dob: data.data.dob ? new Date(data.data.dob) : undefined,
                            lastActive: data.data.lastActive ? new Date(data.data.lastActive) : new Date(),
                        };

                        setFormData(partnerData);
                        setImagePreview(partnerData.img || null);
                        console.log('✅ Partner data fetched from backend successfully:', data.data);
                        return;
                    }
                }

                if (response.status === 404) {
                    throw new Error('404');
                }

                throw new Error(`Failed to fetch partner data: ${response.status}`);
            } catch (apiError: any) {
                // Fallback to localStorage on 404 or network errors
                if (apiError.message.includes('404') || apiError.message.includes('Failed to fetch')) {
                    console.log('⚠️ Backend unavailable, loading from localStorage');
                    const localKey = `delivery_partner_${id}`;
                    const localData = localStorage.getItem(localKey);

                    if (localData) {
                        const parsedData = JSON.parse(localData);
                        const effectiveDocStatus = {
                            ...defaultDocumentStatus,
                            ...parsedData.documentStatus,
                            ...storedDocStatus,
                        };

                        const partnerData: DeliveryPartner = {
                            _id: id,
                            ...defaultFormData,
                            ...parsedData,
                            documentStatus: effectiveDocStatus,
                            dob: parsedData.dob ? new Date(parsedData.dob) : undefined,
                            lastActive: parsedData.lastActive ? new Date(parsedData.lastActive) : new Date(),
                        };

                        setFormData(partnerData);
                        setImagePreview(partnerData.img || null);
                        console.log('✅ Partner data loaded from localStorage:', parsedData);
                        return;
                    }

                    // Default data
                    const defaultPartnerData: DeliveryPartner = {
                        _id: id,
                        ...defaultFormData,
                        name: 'Sample Partner',
                        phone: '+91 98765 43210',
                        documentStatus: {
                            ...defaultDocumentStatus,
                            ...storedDocStatus,
                        },
                    };
                    setFormData(defaultPartnerData);
                    setImagePreview(defaultPartnerData.img || null);
                    console.log('✅ Using default partner data');
                    return;
                }

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

    const handleInputChange = useCallback(
        (field: keyof DeliveryPartner, value: string | Date | boolean | undefined) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleDocumentStatusChange = useCallback(
        (documentType: keyof DeliveryPartner['documentStatus'], status: 'verified' | 'pending' | 'rejected') => {
            setFormData((prev) => ({
                ...prev,
                documentStatus: {
                    ...prev.documentStatus,
                    [documentType]: status,
                },
            }));
        },
        []
    );

    const handleNotesChange = useCallback(
        (documentType: string, note: string) => {
            setFormData((prev) => ({
                ...prev,
                verificationNotes: {
                    ...prev.verificationNotes,
                    [documentType]: note,
                },
            }));
        },
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const managerUser = localStorage.getItem('managerUser');
            const accessToken = localStorage.getItem('accessToken');
            const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);

            if (!token) {
                setError('Authentication required. Please log in.');
                return;
            }

            // Calculate age
            const today = new Date();
            let age = 0;
            if (formData.dob) {
                const birthDate = new Date(formData.dob);
                age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
            }

            const overallStatus = calculateOverallStatus(formData.documentStatus);

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('lastName', formData.lastName || '');
            formDataToSend.append('dob', formData.dob ? formData.dob.toISOString() : '');
            formDataToSend.append('age', age.toString());
            formDataToSend.append('guardianName', formData.guardianName || '');
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('emergencyContact', formData.emergencyContact || '');
            formDataToSend.append('email', formData.email || '');
            formDataToSend.append('permanentAddress', formData.permanentAddress || '');
            formDataToSend.append('currentAddress', formData.currentAddress || '');
            formDataToSend.append('pin', formData.pin || '');
            formDataToSend.append('status', formData.status);
            formDataToSend.append('bankAccountNumber', formData.bankAccountNumber || '');
            formDataToSend.append('IFSCCode', formData.IFSCCode || '');
            formDataToSend.append('accountHolderName', formData.accountHolderName || '');
            formDataToSend.append('documentStatus', JSON.stringify(formData.documentStatus));
            formDataToSend.append('verificationNotes', JSON.stringify(formData.verificationNotes || {}));
            formDataToSend.append('overallDocumentStatus', overallStatus);
            formDataToSend.append('isActive', formData.isActive ? 'true' : 'false');

            // Handle image
            if (newImageFile) {
                formDataToSend.append('img', newImageFile);
            } else {
                formDataToSend.append('img', formData.img || '');
            }

            // Log FormData for debugging
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }

            try {
                let partnersEndpoint = API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS;
                const endpointPath = normalizeEndpoint(partnersEndpoint, API_CONFIG.BASE_URL);
                const url = `${API_CONFIG.BASE_URL}${endpointPath}/${id}`;

                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Do not set Content-Type; let browser set multipart/form-data with boundary
                    },
                    body: formDataToSend,
                });

                if (response.ok) {
                    console.log('✅ Partner updated in backend successfully');

                    try {
                        localStorage.setItem(`dpDocumentStatus:${formData._id}`, JSON.stringify(formData.documentStatus));
                    } catch { }

                    console.log('✅ Partner updated successfully');
                    navigate('/manager/delivery-partner');
                    return;
                }

                if (response.status === 404) {
                    throw new Error('404');
                }

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
                if (apiError.message.includes('404') || apiError.message.includes('Failed to fetch')) {
                    console.log('⚠️ Backend unavailable, saving to localStorage');
                    const localKey = `delivery_partner_${id}`;
                    const imgToSave = imagePreview || formData.img;
                    const updatedData = {
                        ...formData,
                        img: imgToSave,
                        dob: formData.dob ? formData.dob.toISOString() : undefined,
                        age,
                        overallDocumentStatus: overallStatus,
                    };
                    localStorage.setItem(localKey, JSON.stringify(updatedData));
                    console.log('✅ Partner data saved to localStorage');
                    navigate('/manager/delivery-partner');
                    return;
                }

                throw apiError;
            }
        } catch (err) {
            console.error('❌ Error updating partner:', err);
            setError(err instanceof Error ? err.message : 'Failed to update partner');
        } finally {
            setIsLoading(false);
        }
    };

    const currentPreview = imagePreview || formData.img;

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
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
                <div className="max-w-4xl mx-auto">
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
                                {/* Personal Information */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="Enter first name"
                                                required
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastName || ''}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.dob ? formData.dob.toISOString().split('T')[0] : ''}
                                                onChange={(e) => handleInputChange('dob', e.target.value ? new Date(e.target.value) : undefined)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.age || ''}
                                                readOnly
                                                className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="group md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                                                Guardian Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.guardianName || ''}
                                                onChange={(e) => handleInputChange('guardianName', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="Enter guardian name"
                                            />
                                        </div>
                                        <div className="group md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                                Profile Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white group-hover:bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                            />
                                            {currentPreview && (
                                                <div className="mt-2">
                                                    <img
                                                        src={currentPreview}
                                                        alt="Profile Preview"
                                                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="+91 98765 43210"
                                                required
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                                                Emergency Contact
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.emergencyContact || ''}
                                                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email || ''}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="example@email.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Address Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="group md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                                                Permanent Address
                                            </label>
                                            <textarea
                                                value={formData.permanentAddress || ''}
                                                onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="Enter permanent address"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="group md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                                                Current Address
                                            </label>
                                            <textarea
                                                value={formData.currentAddress || ''}
                                                onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="Enter current address"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                                                PIN Code
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.pin || ''}
                                                onChange={(e) => handleInputChange('pin', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="Enter PIN code"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Details */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Bank Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                                Account Holder Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.accountHolderName || ''}
                                                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="Enter account holder name"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                                Bank Account Number
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.bankAccountNumber || ''}
                                                onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="Enter bank account number"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                                IFSC Code
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.IFSCCode || ''}
                                                onChange={(e) => handleInputChange('IFSCCode', e.target.value)}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white group-hover:bg-gray-50"
                                                placeholder="Enter IFSC code"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Document Verification Fields */}
                                <div className="bg-gray-50 rounded-2xl shadow-inner p-6">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Document Verification Status</h3>
                                    <p className="text-sm text-gray-600 mb-4">Set the verification status for each required document. Overall status will be automatically calculated.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'idProof', label: 'ID Proof', color: 'blue' },
                                            { key: 'addressProof', label: 'Address Proof', color: 'orange' },
                                            { key: 'panProof', label: 'PAN Proof', color: 'yellow' },
                                            { key: 'vehicleDocuments', label: 'Vehicle Documents', color: 'purple' },
                                            { key: 'drivingLicense', label: 'Driving License', color: 'red' },
                                            { key: 'insuranceDocuments', label: 'Insurance Documents', color: 'green' },
                                        ].map(({ key, label, color }) => (
                                            <div key={key} className="space-y-3">
                                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                    <div className={`w-2 h-2 bg-${color}-500 rounded-full mr-3`}></div>
                                                    {label}
                                                </label>
                                                <select
                                                    value={formData.documentStatus[key as keyof DeliveryPartner['documentStatus']]}
                                                    onChange={(e) => handleDocumentStatusChange(key as keyof DeliveryPartner['documentStatus'], e.target.value as 'verified' | 'pending' | 'rejected')}
                                                    className={`w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500 transition-all duration-300 bg-white`}
                                                >
                                                    <option value="pending">⏳ Pending</option>
                                                    <option value="verified">✅ Verified</option>
                                                    <option value="rejected">❌ Rejected</option>
                                                </select>
                                                {/* <textarea
                                                    value={formData.verificationNotes?.[key as keyof DeliveryPartner['verificationNotes']] || ''}
                                                    onChange={(e) => handleNotesChange(key as string, e.target.value)}
                                                    placeholder="Verification notes (optional)"
                                                    className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-gray-300"
                                                    rows={2}
                                                /> */}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-blue-700">
                                                    <strong>Overall Document Status:</strong> {calculateOverallStatus(formData.documentStatus)}
                                                </span>
                                            </div>
                                            <span className="text-sm text-blue-700">
                                                <strong>Note:</strong> Overall status is auto-calculated based on individual document statuses.
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
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
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
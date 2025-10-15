// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler, RegisterOptions, FieldPath } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { API_CONFIG } from '../../../config/api.config';

// interface FormInputs {
//     name: string;
//     lastName: string;
//     dob: string;
//     guardianName: string;
//     phone: string;
//     emergencyContact: string;
//     email: string;
//     permanentAddress: string;
//     currentAddress: string;
//     pin: string;
//     bankAccountNumber: string;
//     IFSCCode: string;
//     accountHolderName: string;
//     img?: File;
// }

// interface DocumentStatus {
//     idProof: 'verified' | 'pending' | 'rejected';
//     addressProof: 'verified' | 'pending' | 'rejected';
//     panProof: 'verified' | 'pending' | 'rejected';
//     vehicleDocuments: 'verified' | 'pending' | 'rejected';
//     drivingLicense: 'verified' | 'pending' | 'rejected';
//     insuranceDocuments: 'verified' | 'pending' | 'rejected';
// }

// interface ManagerUser {
//     role: string;
//     phone: string;
//     id: string;
//     loginTime: string;
//     accessToken?: string;
// }

// type StatusType = 'verified' | 'pending' | 'rejected';

// const AddPartner: React.FC = () => {
//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
//         idProof: 'pending',
//         addressProof: 'pending',
//         panProof: 'pending',
//         vehicleDocuments: 'pending',
//         drivingLicense: 'pending',
//         insuranceDocuments: 'pending'
//     });
//     const [managerId, setManagerId] = useState<string | null>(null);

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         setValue,
//         reset,
//     } = useForm<FormInputs>({
//         defaultValues: {
//             name: '',
//             lastName: '',
//             dob: '',
//             guardianName: '',
//             phone: '',
//             emergencyContact: '',
//             email: '',
//             permanentAddress: '',
//             currentAddress: '',
//             pin: '',
//             bankAccountNumber: '',
//             IFSCCode: '',
//             accountHolderName: '',
//             img: undefined,
//         },
//     });

//     // Document status options
//     const documentOptions: Record<keyof DocumentStatus, { value: StatusType; label: string; icon: string }[]> = {
//         idProof: [
//             { value: 'pending', label: 'Pending', icon: '⏳' },
//             { value: 'verified', label: 'Verified', icon: '✅' },
//             { value: 'rejected', label: 'Rejected', icon: '❌' },
//         ],
//         addressProof: [
//             { value: 'pending', label: 'Pending', icon: '⏳' },
//             { value: 'verified', label: 'Verified', icon: '✅' },
//             { value: 'rejected', label: 'Rejected', icon: '❌' },
//         ],
//         panProof: [
//             { value: 'pending', label: 'Pending', icon: '⏳' },
//             { value: 'verified', label: 'Verified', icon: '✅' },
//             { value: 'rejected', label: 'Rejected', icon: '❌' },
//         ],
//         vehicleDocuments: [
//             { value: 'pending', label: 'Pending', icon: '⏳' },
//             { value: 'verified', label: 'Verified', icon: '✅' },
//             { value: 'rejected', label: 'Rejected', icon: '❌' },
//         ],
//         drivingLicense: [
//             { value: 'pending', label: 'Pending', icon: '⏳' },
//             { value: 'verified', label: 'Verified', icon: '✅' },
//             { value: 'rejected', label: 'Rejected', icon: '❌' },
//         ],
//         insuranceDocuments: [
//             { value: 'pending', label: 'Pending', icon: '⏳' },
//             { value: 'verified', label: 'Verified', icon: '✅' },
//             { value: 'rejected', label: 'Rejected', icon: '❌' },
//         ],
//     };

//     // Get manager data from localStorage
//     const getManagerData = (): ManagerUser | null => {
//         try {
//             const managerUser = localStorage.getItem('managerUser');
//             if (managerUser) {
//                 const parsed = JSON.parse(managerUser) as ManagerUser;
//                 console.log('👨‍💼 Manager data found:', parsed);
//                 return parsed;
//             }
//             return null;
//         } catch (error) {
//             console.error('❌ Error parsing manager data:', error);
//             return null;
//         }
//     };

//     // Get auth token
//     const getAuthToken = (): string | null => {
//         let token: string | null = localStorage.getItem('accessToken');
//         if (!token) {
//             const managerUser = getManagerData();
//             token = managerUser?.accessToken || null;
//         }
//         return token;
//     };

//     // Helper to build API URLs safely
//     const buildApiUrl = (endpoint: string, queryParams?: URLSearchParams): string => {
//         let url = endpoint;
//         if (url.match(/^https?:\/\//i)) {
//             url = url.replace(/^(https?):\/+/i, '$1://');
//         } else {
//             const base = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL.slice(0, -1) : API_CONFIG.BASE_URL;
//             url = `${base}/${url.startsWith('/') ? url.slice(1) : url}`;
//         }

//         if (queryParams && queryParams.toString()) {
//             const separator = url.includes('?') ? '&' : '?';
//             url += `${separator}${queryParams.toString()}`;
//         }

//         try {
//             new URL(url);
//             console.log('🔗 Built API URL:', url);
//             return url;
//         } catch (e) {
//             console.error('❌ Invalid API URL generated:', url, e);
//             throw new Error(`Invalid API URL: ${url}`);
//         }
//     };

//     // Calculate overall status based on document verification
//     const calculateOverallStatus = (docStatus: DocumentStatus): 'verified' | 'pending' => {
//         const allVerified = Object.values(docStatus).every(status => status === 'verified');
//         return allVerified ? 'verified' : 'pending';
//     };

//     // Handle image preview
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//             setValue('img' as const, file);
//         }
//     };

//     const handleDocumentStatusChange = (documentType: keyof DocumentStatus, status: StatusType) => {
//         setDocumentStatus(prev => ({
//             ...prev,
//             [documentType]: status
//         }));
//     };

//     // Set manager ID on component mount
//     useEffect(() => {
//         const managerData = getManagerData();
//         if (managerData) {
//             setManagerId(managerData.id);
//         }
//     }, []);

//     const onSubmit: SubmitHandler<FormInputs> = async (data) => {
//         setIsLoading(true);
//         setError('');

//         try {
//             const token = getAuthToken();
//             const managerData = getManagerData();
//             const currentManagerId = managerData?.id;

//             if (!token) {
//                 throw new Error('Authentication required. Please log in.');
//             }

//             if (!currentManagerId) {
//                 throw new Error('Manager ID not found. Please log in again.');
//             }

//             // Calculate overall status and age
//             const overallStatus = calculateOverallStatus(documentStatus);
//             const dob = new Date(data.dob);
//             const today = new Date();
//             let age = today.getFullYear() - dob.getFullYear();
//             const monthDiff = today.getMonth() - dob.getMonth();
//             if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//                 age--;
//             }

//             // Prepare payload
//             const payload: any = {
//                 name: data.name,
//                 lastName: data.lastName,
//                 dob: data.dob,
//                 age: age.toString(),
//                 guardianName: data.guardianName,
//                 phone: data.phone,
//                 emergencyContact: data.emergencyContact,
//                 email: data.email,
//                 permanentAddress: data.permanentAddress,
//                 currentAddress: data.currentAddress,
//                 pin: data.pin,
//                 bankAccountNumber: data.bankAccountNumber,
//                 IFSCCode: data.IFSCCode,
//                 accountHolderName: data.accountHolderName,
//                 status: overallStatus,
//                 documentStatus: documentStatus,
//             };

//             // Handle image as base64 if present
//             if (data.img) {
//                 const reader = new FileReader();
//                 reader.readAsDataURL(data.img);
//                 const base64Image = await new Promise<string>((resolve) => {
//                     reader.onload = () => resolve(reader.result as string);
//                 });
//                 payload.img = base64Image;
//             }

//             // Build URL with managerId query parameter
//             const queryParams = new URLSearchParams({
//                 managerId: currentManagerId
//             });
//             const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS, queryParams);

//             console.log("🚀 ~ Creating delivery partner with managerId:", currentManagerId);

//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(payload)
//             });

//             if (!response.ok) {
//                 let message = 'Failed to create partner';
//                 try {
//                     const errorData = await response.json();
//                     message = errorData.message || message;
//                 } catch { }
//                 if (response.status === 409) {
//                     message = 'A partner with this phone number already exists. Please use a different number.';
//                 }
//                 throw new Error(message);
//             }

//             const created = await response.json();
//             const createdId = created?.data?._id;

//             console.log('✅ Partner created successfully');
//             reset();
//             setImagePreview(null);
//             setDocumentStatus({
//                 idProof: 'pending',
//                 addressProof: 'pending',
//                 panProof: 'pending',
//                 vehicleDocuments: 'pending',
//                 drivingLicense: 'pending',
//                 insuranceDocuments: 'pending'
//             });
//             navigate('/manager/delivery-partner');
//         } catch (err) {
//             console.error('❌ Error creating partner:', err);
//             setError(err instanceof Error ? err.message : 'Failed to create partner');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Form field component for reusability
//     const FormField = <TFieldName extends FieldPath<FormInputs>>({
//         label,
//         name,
//         type = 'text',
//         placeholder,
//         required = false,
//         rows,
//         validation,
//         className = ''
//     }: {
//         label: string;
//         name: TFieldName;
//         type?: string;
//         placeholder?: string;
//         required?: boolean;
//         rows?: number;
//         validation?: RegisterOptions<FormInputs, TFieldName>;
//         className?: string;
//     }) => (
//         <div className={className}>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//                 {label} {required && <span className="text-red-500">*</span>}
//             </label>
//             {type === 'textarea' ? (
//                 <textarea
//                     {...register(name, validation)}
//                     rows={rows}
//                     className={`block w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-300 resize-none ${errors[name as keyof FormInputs] ? 'border-red-500' : 'border-gray-200'}`}
//                     placeholder={placeholder}
//                 />
//             ) : (
//                 <input
//                     type={type}
//                     {...register(name, validation)}
//                     className={`block w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-300 ${errors[name as keyof FormInputs] ? 'border-red-500' : 'border-gray-200'}`}
//                     placeholder={placeholder}
//                 />
//             )}
//             {errors[name as keyof FormInputs] && (
//                 <p className="mt-1 text-xs text-red-600" role="alert">
//                     {(errors[name as keyof FormInputs] as any)?.message}
//                 </p>
//             )}
//         </div>
//     );

//     // Document select component
//     const DocumentSelect = ({ documentType }: { documentType: keyof DocumentStatus }) => (
//         <div className="group">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//                 {documentType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//             </label>
//             <select
//                 value={documentStatus[documentType]}
//                 onChange={(e) => handleDocumentStatusChange(documentType, e.target.value as StatusType)}
//                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
//             >
//                 {documentOptions[documentType].map(option => (
//                     <option key={option.value} value={option.value}>
//                         {option.icon} {option.label}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
//             {/* Header Section */}
//             <div className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="container mx-auto px-6 py-6">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
//                                 Add New Delivery Partner
//                             </h1>
//                             <p className="text-gray-600 mt-1">Create a new delivery partner for your operations</p>
//                             {managerId && (
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     Manager ID: {managerId}
//                                 </p>
//                             )}
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

//             {/* Form Section */}
//             <div className="container mx-auto px-6 py-8">
//                 <div className="max-w-4xl mx-auto">
//                     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//                         {/* Error Display */}
//                         {error && (
//                             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//                                 <div className="flex">
//                                     <div className="flex-shrink-0">
//                                         <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <div className="ml-3">
//                                         <p className="text-sm text-red-800">{error}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//                             {/* Personal Information */}
//                             <section className="border-b border-gray-200 pb-6">
//                                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <FormField
//                                         label="First Name"
//                                         name="name"
//                                         required
//                                         placeholder="Enter first name"
//                                         validation={{
//                                             required: 'First name is required',
//                                             minLength: {
//                                                 value: 2,
//                                                 message: 'First name must be at least 2 characters',
//                                             },
//                                         }}
//                                     />
//                                     <FormField
//                                         label="Last Name"
//                                         name="lastName"
//                                         placeholder="Enter last name"
//                                         validation={{
//                                             minLength: {
//                                                 value: 2,
//                                                 message: 'Last name must be at least 2 characters',
//                                             },
//                                         }}
//                                     />
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                                     <FormField
//                                         label="Date of Birth"
//                                         name="dob"
//                                         type="date"
//                                         validation={{
//                                             validate: (value) => {
//                                                 if (!value) return true;
//                                                 const today = new Date();
//                                                 const dobDate = new Date(value);
//                                                 const age = today.getFullYear() - dobDate.getFullYear();
//                                                 const monthDiff = today.getMonth() - dobDate.getMonth();
//                                                 if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
//                                                     age--;
//                                                 }
//                                                 if (age < 18) {
//                                                     return 'Minimum age is 18 years';
//                                                 }
//                                                 return true;
//                                             },
//                                         }}
//                                     />
//                                     <FormField
//                                         label="Guardian Name"
//                                         name="guardianName"
//                                         placeholder="Enter guardian name"
//                                         validation={{
//                                             minLength: {
//                                                 value: 2,
//                                                 message: 'Guardian name must be at least 2 characters',
//                                             },
//                                         }}
//                                     />
//                                 </div>
//                             </section>

//                             {/* Contact Information */}
//                             <section className="border-b border-gray-200 pb-6">
//                                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <FormField
//                                         label="Phone Number"
//                                         name="phone"
//                                         type="tel"
//                                         required
//                                         placeholder="9876543210"
//                                         validation={{
//                                             required: 'Phone number is required',
//                                             pattern: {
//                                                 value: /^[6-9]\d{9}$/,
//                                                 message: 'Please enter a valid 10-digit phone number starting with 6-9'
//                                             }
//                                         }}
//                                     />
//                                     <FormField
//                                         label="Emergency Contact"
//                                         name="emergencyContact"
//                                         type="tel"
//                                         placeholder="9876543210"
//                                         validation={{
//                                             pattern: {
//                                                 value: /^[6-9]\d{9}$/,
//                                                 message: 'Please enter a valid 10-digit emergency contact number starting with 6-9'
//                                             }
//                                         }}
//                                     />
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                                     <FormField
//                                         label="Email"
//                                         name="email"
//                                         type="email"
//                                         required
//                                         placeholder="example@email.com"
//                                         validation={{
//                                             required: 'Email is required',
//                                             pattern: {
//                                                 value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                                                 message: 'Please enter a valid email address'
//                                             }
//                                         }}
//                                     />
//                                 </div>
//                             </section>

//                             {/* Address Information */}
//                             <section className="border-b border-gray-200 pb-6">
//                                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <FormField
//                                         label="Permanent Address"
//                                         name="permanentAddress"
//                                         type="textarea"
//                                         rows={3}
//                                         placeholder="Enter permanent address"
//                                         validation={{
//                                             minLength: {
//                                                 value: 10,
//                                                 message: 'Permanent address must be at least 10 characters',
//                                             },
//                                         }}
//                                     />
//                                     <FormField
//                                         label="Current Address"
//                                         name="currentAddress"
//                                         type="textarea"
//                                         rows={3}
//                                         placeholder="Enter current address"
//                                         validation={{
//                                             minLength: {
//                                                 value: 10,
//                                                 message: 'Current address must be at least 10 characters',
//                                             },
//                                         }}
//                                     />
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                                     <FormField
//                                         label="Pin Code"
//                                         name="pin"
//                                         placeholder="560078"
//                                         validation={{
//                                             pattern: {
//                                                 value: /^[1-9][0-9]{5}$/,
//                                                 message: 'Please enter a valid 6-digit pin code'
//                                             }
//                                         }}
//                                     />
//                                 </div>
//                             </section>

//                             {/* Bank Details */}
//                             <section className="border-b border-gray-200 pb-6">
//                                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Account Details</h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <FormField
//                                         label="Bank Account Number"
//                                         name="bankAccountNumber"
//                                         placeholder="Enter bank account number"
//                                         validation={{
//                                             minLength: {
//                                                 value: 9,
//                                                 message: 'Bank account number must be at least 9 digits',
//                                             },
//                                             pattern: {
//                                                 value: /^[0-9]{9,18}$/,
//                                                 message: 'Please enter a valid bank account number'
//                                             }
//                                         }}
//                                     />
//                                     <FormField
//                                         label="IFSC Code"
//                                         name="IFSCCode"
//                                         placeholder="SBIN0001234"
//                                         validation={{
//                                             pattern: {
//                                                 value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
//                                                 message: 'Please enter a valid IFSC code (e.g. SBIN0001234)'
//                                             }
//                                         }}
//                                     />
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                                     <FormField
//                                         label="Account Holder Name"
//                                         name="accountHolderName"
//                                         placeholder="Enter account holder name"
//                                         validation={{
//                                             minLength: {
//                                                 value: 2,
//                                                 message: 'Account holder name must be at least 2 characters',
//                                             },
//                                         }}
//                                     />
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Profile Image
//                                         </label>
//                                         <input
//                                             type="file"
//                                             accept="image/*"
//                                             onChange={handleImageChange}
//                                             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                                         />
//                                         {imagePreview && (
//                                             <div className="mt-2">
//                                                 <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </section>

//                             {/* Document Verification Fields */}
//                             <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//                                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Verification Status</h3>
//                                 <p className="text-sm text-gray-600 mb-4">Set the verification status for each required document. Overall status will be automatically calculated.</p>
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                     {Object.keys(documentStatus).map((key) => (
//                                         <DocumentSelect key={key} documentType={key as keyof DocumentStatus} />
//                                     ))}
//                                 </div>
//                                 <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                                     <div className="flex items-center">
//                                         <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         <span className="text-sm text-blue-700">
//                                             <strong>Note:</strong> Overall status will be "Verified" only when all documents are verified. If any document is pending or rejected, status will be "Pending".
//                                         </span>
//                                     </div>
//                                 </div>
//                             </section>

//                             {/* Submit Buttons */}
//                             <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
//                                 <button
//                                     type="button"
//                                     onClick={() => navigate('/manager/delivery-partner')}
//                                     className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={isLoading}
//                                     className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                                 >
//                                     {isLoading ? (
//                                         <div className="flex items-center justify-center">
//                                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             Submit...
//                                         </div>
//                                     ) : (
//                                         <div className="flex items-center justify-center">
//                                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                                             </svg>
//                                             Submit
//                                         </div>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddPartner;
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, RegisterOptions, FieldPath } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_CONFIG } from '../../../config/api.config';

interface FormInputs {
    name: string;
    lastName: string;
    dob: string;
    guardianName: string;
    phone: string;
    emergencyContact: string;
    email: string;
    permanentAddress: string;
    currentAddress: string;
    pin: string;
    bankAccountNumber: string;
    IFSCCode: string;
    accountHolderName: string;
    img?: File;
}

interface DocumentStatus {
    idProof: 'verified' | 'pending' | 'rejected';
    addressProof: 'verified' | 'pending' | 'rejected';
    panProof: 'verified' | 'pending' | 'rejected';
    vehicleDocuments: 'verified' | 'pending' | 'rejected';
    drivingLicense: 'verified' | 'pending' | 'rejected';
    insuranceDocuments: 'verified' | 'pending' | 'rejected';
}

interface ManagerUser {
    role: string;
    phone: string;
    id: string;
    loginTime: string;
    accessToken?: string;
}

type StatusType = 'verified' | 'pending' | 'rejected';

const AddPartner: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
        idProof: 'pending',
        addressProof: 'pending',
        panProof: 'pending',
        vehicleDocuments: 'pending',
        drivingLicense: 'pending',
        insuranceDocuments: 'pending'
    });
    const [managerId, setManagerId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<FormInputs>({
        defaultValues: {
            name: '',
            lastName: '',
            dob: '',
            guardianName: '',
            phone: '',
            emergencyContact: '',
            email: '',
            permanentAddress: '',
            currentAddress: '',
            pin: '',
            bankAccountNumber: '',
            IFSCCode: '',
            accountHolderName: '',
            img: undefined,
        },
    });

    // Document status options
    const documentOptions: Record<keyof DocumentStatus, { value: StatusType; label: string; icon: string }[]> = {
        idProof: [
            { value: 'pending', label: 'Pending', icon: '⏳' },
            { value: 'verified', label: 'Verified', icon: '✅' },
            { value: 'rejected', label: 'Rejected', icon: '❌' },
        ],
        addressProof: [
            { value: 'pending', label: 'Pending', icon: '⏳' },
            { value: 'verified', label: 'Verified', icon: '✅' },
            { value: 'rejected', label: 'Rejected', icon: '❌' },
        ],
        panProof: [
            { value: 'pending', label: 'Pending', icon: '⏳' },
            { value: 'verified', label: 'Verified', icon: '✅' },
            { value: 'rejected', label: 'Rejected', icon: '❌' },
        ],
        vehicleDocuments: [
            { value: 'pending', label: 'Pending', icon: '⏳' },
            { value: 'verified', label: 'Verified', icon: '✅' },
            { value: 'rejected', label: 'Rejected', icon: '❌' },
        ],
        drivingLicense: [
            { value: 'pending', label: 'Pending', icon: '⏳' },
            { value: 'verified', label: 'Verified', icon: '✅' },
            { value: 'rejected', label: 'Rejected', icon: '❌' },
        ],
        insuranceDocuments: [
            { value: 'pending', label: 'Pending', icon: '⏳' },
            { value: 'verified', label: 'Verified', icon: '✅' },
            { value: 'rejected', label: 'Rejected', icon: '❌' },
        ],
    };

    // Get manager data from localStorage
    const getManagerData = (): ManagerUser | null => {
        try {
            const managerUser = localStorage.getItem('managerUser');
            if (managerUser) {
                const parsed = JSON.parse(managerUser) as ManagerUser;
                console.log('👨‍💼 Manager data found:', parsed);
                return parsed;
            }
            return null;
        } catch (error) {
            console.error('❌ Error parsing manager data:', error);
            return null;
        }
    };

    // Get auth token
    const getAuthToken = (): string | null => {
        let token: string | null = localStorage.getItem('accessToken');
        if (!token) {
            const managerUser = getManagerData();
            token = managerUser?.accessToken || null;
        }
        return token;
    };

    // Helper to build API URLs safely
    const buildApiUrl = (endpoint: string, queryParams?: URLSearchParams): string => {
        let url = endpoint;
        if (url.match(/^https?:\/\//i)) {
            url = url.replace(/^(https?):\/+/i, '$1://');
        } else {
            const base = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL.slice(0, -1) : API_CONFIG.BASE_URL;
            url = `${base}/${url.startsWith('/') ? url.slice(1) : url}`;
        }

        if (queryParams && queryParams.toString()) {
            const separator = url.includes('?') ? '&' : '?';
            url += `${separator}${queryParams.toString()}`;
        }

        try {
            new URL(url);
            console.log('🔗 Built API URL:', url);
            return url;
        } catch (e) {
            console.error('❌ Invalid API URL generated:', url, e);
            throw new Error(`Invalid API URL: ${url}`);
        }
    };

    // Calculate overall status based on document verification
    const calculateOverallStatus = (docStatus: DocumentStatus): 'verified' | 'pending' => {
        const allVerified = Object.values(docStatus).every(status => status === 'verified');
        return allVerified ? 'verified' : 'pending';
    };

    // Handle image preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setValue('img' as const, file);
        }
    };

    const handleDocumentStatusChange = (documentType: keyof DocumentStatus, status: StatusType) => {
        setDocumentStatus(prev => ({
            ...prev,
            [documentType]: status
        }));
    };

    // Set manager ID on component mount
    useEffect(() => {
        const managerData = getManagerData();
        if (managerData) {
            setManagerId(managerData.id);
        }
    }, []);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsLoading(true);
        setError('');

        const managerData = getManagerData();
        const token = getAuthToken();
        const currentManagerId = managerData?.id;

        console.log('Token:', token);
        console.log('Manager ID:', currentManagerId);

        if (!token || !currentManagerId) {
            setError('Please log in to continue.');
            setIsLoading(false);
            return; // Early exit
        }

        try {
            // Calculate overall status and age
            const overallStatus = calculateOverallStatus(documentStatus);

            // Handle DOB - make it required or set default age
            if (!data.dob) {
                setError('Date of birth is required.');
                setIsLoading(false);
                return;
            }

            const dob = new Date(data.dob);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            if (age < 18) {
                setError('Minimum age is 18 years.');
                setIsLoading(false);
                return;
            }

            // Prepare FormData to send image as file
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('lastName', data.lastName);
            formData.append('dob', data.dob);
            formData.append('age', age.toString());
            formData.append('guardianName', data.guardianName);
            formData.append('phone', data.phone);
            formData.append('emergencyContact', data.emergencyContact || '');
            formData.append('email', data.email);
            formData.append('permanentAddress', data.permanentAddress);
            formData.append('currentAddress', data.currentAddress);
            formData.append('pin', data.pin);
            formData.append('bankAccountNumber', data.bankAccountNumber);
            formData.append('IFSCCode', data.IFSCCode);
            formData.append('accountHolderName', data.accountHolderName);
            formData.append('status', overallStatus);
            formData.append('documentStatus', JSON.stringify(documentStatus));

            // Append image file if present
            if (data.img) {
                formData.append('img', data.img);
            }

            // Log FormData for debugging
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            // Build URL with managerId query parameter
            const queryParams = new URLSearchParams({
                managerId: currentManagerId
            });
            const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS, queryParams);

            console.log("🚀 ~ Creating delivery partner with managerId:", currentManagerId);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Do not set Content-Type; let browser set multipart/form-data with boundary
                },
                body: formData
            });

            if (!response.ok) {
                let message = 'Failed to create partner';
                try {
                    const errorData = await response.json();
                    message = errorData.message || message;
                } catch { }
                if (response.status === 409) {
                    message = 'A partner with this phone number already exists. Please use a different number.';
                }
                console.error('Full response:', { status: response.status, body: await response.text() });
                throw new Error(message);
            }

            const created = await response.json();
            const createdId = created?.data?._id;

            console.log('✅ Partner created successfully');
            reset();
            setImagePreview(null);
            setDocumentStatus({
                idProof: 'pending',
                addressProof: 'pending',
                panProof: 'pending',
                vehicleDocuments: 'pending',
                drivingLicense: 'pending',
                insuranceDocuments: 'pending'
            });
            navigate('/manager/delivery-partner');
        } catch (err) {
            console.error('❌ Error creating partner:', err);
            setError(err instanceof Error ? err.message : 'Failed to create partner');
        } finally {
            setIsLoading(false);
        }
    };

    // Form field component for reusability
    const FormField = <TFieldName extends FieldPath<FormInputs>>({
        label,
        name,
        type = 'text',
        placeholder,
        required = false,
        rows,
        validation,
        className = ''
    }: {
        label: string;
        name: TFieldName;
        type?: string;
        placeholder?: string;
        required?: boolean;
        rows?: number;
        validation?: RegisterOptions<FormInputs, TFieldName>;
        className?: string;
    }) => (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {type === 'textarea' ? (
                <textarea
                    {...register(name, validation)}
                    rows={rows}
                    className={`block w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-300 resize-none ${errors[name as keyof FormInputs] ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type={type}
                    {...register(name, validation)}
                    className={`block w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-300 ${errors[name as keyof FormInputs] ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder={placeholder}
                />
            )}
            {errors[name as keyof FormInputs] && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                    {(errors[name as keyof FormInputs] as any)?.message}
                </p>
            )}
        </div>
    );

    // Document select component
    const DocumentSelect = ({ documentType }: { documentType: keyof DocumentStatus }) => (
        <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {documentType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            <select
                value={documentStatus[documentType]}
                onChange={(e) => handleDocumentStatusChange(documentType, e.target.value as StatusType)}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
            >
                {documentOptions[documentType].map(option => (
                    <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                Add New Delivery Partner
                            </h1>
                            <p className="text-gray-600 mt-1">Create a new delivery partner for your operations</p>
                            {managerId && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Manager ID: {managerId}
                                </p>
                            )}
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

            {/* Form Section */}
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Personal Information */}
                            <section className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="First Name"
                                        name="name"
                                        required
                                        placeholder="Enter first name"
                                        validation={{
                                            required: 'First name is required',
                                            minLength: {
                                                value: 2,
                                                message: 'First name must be at least 2 characters',
                                            },
                                        }}
                                    />
                                    <FormField
                                        label="Last Name"
                                        name="lastName"
                                        placeholder="Enter last name"
                                        validation={{
                                            minLength: {
                                                value: 2,
                                                message: 'Last name must be at least 2 characters',
                                            },
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <FormField
                                        label="Date of Birth"
                                        name="dob"
                                        type="date"
                                        required // Made required for consistency
                                        validation={{
                                            required: 'Date of birth is required',
                                            validate: (value) => {
                                                if (!value) return true;
                                                const today = new Date();
                                                const dobDate = new Date(value);
                                                let age = today.getFullYear() - dobDate.getFullYear();
                                                const monthDiff = today.getMonth() - dobDate.getMonth();
                                                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                                                    age--;
                                                }
                                                if (age < 18) {
                                                    return 'Minimum age is 18 years';
                                                }
                                                return true;
                                            },
                                        }}
                                    />
                                    <FormField
                                        label="Guardian Name"
                                        name="guardianName"
                                        placeholder="Enter guardian name"
                                        validation={{
                                            minLength: {
                                                value: 2,
                                                message: 'Guardian name must be at least 2 characters',
                                            },
                                        }}
                                    />
                                </div>
                            </section>

                            {/* Contact Information */}
                            <section className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        required
                                        placeholder="9876543210"
                                        validation={{
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^[6-9]\d{9}$/,
                                                message: 'Please enter a valid 10-digit phone number starting with 6-9'
                                            }
                                        }}
                                    />
                                    <FormField
                                        label="Emergency Contact"
                                        name="emergencyContact"
                                        type="tel"
                                        placeholder="9876543210"
                                        validation={{
                                            pattern: {
                                                value: /^[6-9]\d{9}$/,
                                                message: 'Please enter a valid 10-digit emergency contact number starting with 6-9'
                                            }
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <FormField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="example@email.com"
                                        validation={{
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: 'Please enter a valid email address'
                                            }
                                        }}
                                    />
                                </div>
                            </section>

                            {/* Address Information */}
                            <section className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Permanent Address"
                                        name="permanentAddress"
                                        type="textarea"
                                        rows={3}
                                        placeholder="Enter permanent address"
                                        validation={{
                                            minLength: {
                                                value: 10,
                                                message: 'Permanent address must be at least 10 characters',
                                            },
                                        }}
                                    />
                                    <FormField
                                        label="Current Address"
                                        name="currentAddress"
                                        type="textarea"
                                        rows={3}
                                        placeholder="Enter current address"
                                        validation={{
                                            minLength: {
                                                value: 10,
                                                message: 'Current address must be at least 10 characters',
                                            },
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <FormField
                                        label="Pin Code"
                                        name="pin"
                                        placeholder="560078"
                                        validation={{
                                            pattern: {
                                                value: /^[1-9][0-9]{5}$/,
                                                message: 'Please enter a valid 6-digit pin code'
                                            }
                                        }}
                                    />
                                </div>
                            </section>

                            {/* Bank Details */}
                            <section className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Account Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Bank Account Number"
                                        name="bankAccountNumber"
                                        placeholder="Enter bank account number"
                                        validation={{
                                            minLength: {
                                                value: 9,
                                                message: 'Bank account number must be at least 9 digits',
                                            },
                                            pattern: {
                                                value: /^[0-9]{9,18}$/,
                                                message: 'Please enter a valid bank account number'
                                            }
                                        }}
                                    />
                                    <FormField
                                        label="IFSC Code"
                                        name="IFSCCode"
                                        placeholder="SBIN0001234"
                                        validation={{
                                            pattern: {
                                                value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                                message: 'Please enter a valid IFSC code (e.g. SBIN0001234)'
                                            }
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <FormField
                                        label="Account Holder Name"
                                        name="accountHolderName"
                                        placeholder="Enter account holder name"
                                        validation={{
                                            minLength: {
                                                value: 2,
                                                message: 'Account holder name must be at least 2 characters',
                                            },
                                        }}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Profile Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>



                            {/* Submit Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate('/manager/delivery-partner')}
                                    className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submit...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
    );
};

export default AddPartner;
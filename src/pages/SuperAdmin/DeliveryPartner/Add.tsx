// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import NavigateBtn from '../../../components/button/NavigateBtn';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SubmitButton from '../../../components/button/SubmitBtn';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import ClearIcon from '@mui/icons-material/Clear';
// import { callApi } from '../../../util/admin_api';

// interface FormInputs {
//   name: string;
//   lastName: string;
//   dob: string;
//   guardianName: string;
//   phone: string;
//   emergencyContact: string;
//   email: string;
//   permanentAddress: string;
//   currentAddress: string;
//   pin: string;
//   bankAccountNumber: string;
//   IFSCCode: string;
//   accountHolderName: string;
//   storeId?: string;
//   img?: FileList;
// }

// interface Store {
//   _id: string;
//   name: string;
// }

// interface DocumentStatus {
//   idProof: 'verified' | 'pending' | 'rejected';
//   addressProof: 'verified' | 'pending' | 'rejected';
//   panProof: 'verified' | 'pending' | 'rejected';
//   vehicleDocuments: 'verified' | 'pending' | 'rejected';
//   drivingLicense: 'verified' | 'pending' | 'rejected';
//   insuranceDocuments: 'verified' | 'pending' | 'rejected';
// }

// const StoreStaffAdd: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     watch,
//     setValue,
//     reset,
//   } = useForm<FormInputs>({
//     defaultValues: {
//       name: '',
//       lastName: '',
//       dob: '',
//       guardianName: '',
//       phone: '',
//       emergencyContact: '',
//       email: '',
//       permanentAddress: '',
//       currentAddress: '',
//       pin: '',
//       bankAccountNumber: '',
//       IFSCCode: '',
//       accountHolderName: '',
//       storeId: '',
//     },
//   });

//   const [stores, setStores] = useState<Store[]>([]);
//   const [loadingStores, setLoadingStores] = useState(true);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isManager, setIsManager] = useState(false);
//   const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
//     idProof: 'pending',
//     addressProof: 'pending',
//     panProof: 'pending',
//     vehicleDocuments: 'pending',
//     drivingLicense: 'pending',
//     insuranceDocuments: 'pending',
//   });
//   const navigate = useNavigate();

//   const handleDocumentStatusChange = (key: keyof DocumentStatus, value: 'verified' | 'pending' | 'rejected') => {
//     setDocumentStatus(prev => ({ ...prev, [key]: value }));
//   };

//   // Check if user is manager
//   useEffect(() => {
//     const userRole = localStorage.getItem('userRole');
//     setIsManager(userRole === 'manager');
//   }, []);

//   // Fetch stores from API (only for super admin)
//   useEffect(() => {
//     if (isManager) return;

//     const fetchStores = async () => {
//       try {
//         setLoadingStores(true);
//         const response = await callApi({ endpoint: "/admin/all-store-name", method: "GET" });

//         let storesData: Store[] = [];

//         if (Array.isArray(response)) {
//           storesData = response;
//         } else if (response && Array.isArray(response.data)) {
//           storesData = response.data;
//         } else if (response && response.data && Array.isArray(response.data.data)) {
//           storesData = response.data.data;
//         }

//         console.log("Stores data:", storesData);
//         setStores(storesData);
//       } catch (error) {
//         console.error("Error fetching stores:", error);
//         toast.error("Failed to fetch stores.");
//       } finally {
//         setLoadingStores(false);
//       }
//     };

//     fetchStores();
//   }, [isManager]);

//   // Handle image preview
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//       setValue('img', { 0: file } as any);
//     }
//   };

//   // Calculate overall status based on document verification
//   const calculateOverallStatus = (docStatus: DocumentStatus): 'verified' | 'pending' => {
//     const allVerified = Object.values(docStatus).every(status => status === 'verified');
//     return allVerified ? 'verified' : 'pending';
//   };

//   const onSubmit: SubmitHandler<FormInputs> = async (data) => {
//     try {
//       console.log('Form Data:', data);
//       console.log('Document Status:', documentStatus);

//       // Calculate age from DOB
//       const dob = new Date(data.dob);
//       const today = new Date();
//       let age = today.getFullYear() - dob.getFullYear();
//       const monthDiff = today.getMonth() - dob.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//         age--;
//       }

//       // Calculate overall status
//       const overallStatus = calculateOverallStatus(documentStatus);

//       // Prepare the complete payload as JSON (not FormData)
//       const payload = {
//         name: data.name,
//         lastName: data.lastName,
//         dob: data.dob,
//         age: age.toString(),
//         guardianName: data.guardianName,
//         phone: data.phone,
//         emergencyContact: data.emergencyContact,
//         email: data.email,
//         permanentAddress: data.permanentAddress,
//         currentAddress: data.currentAddress,
//         pin: data.pin,
//         bankAccountNumber: data.bankAccountNumber,
//         IFSCCode: data.IFSCCode,
//         accountHolderName: data.accountHolderName,
//         status: overallStatus,
//         documentStatus: documentStatus, // This is the key - send the complete documentStatus object
//       };

//       // Add storeId for super admin
//       if (!isManager && data.storeId) {
//         payload.storeId = data.storeId;
//       }

//       console.log('Complete Payload:', payload);

//       // For manager, add managerId as query parameter
//       let endpoint = "/admin/delivery-partners";
//       if (isManager) {
//         const managerData = JSON.parse(localStorage.getItem('managerUser') || '{}');
//         const managerId = managerData.id;
//         if (managerId) {
//           endpoint = `/admin/delivery-partners?managerId=${managerId}`;
//         }
//       }

//       // Call API to add delivery partner with JSON payload
//       await callApi({
//         endpoint: endpoint,
//         method: "POST",
//         data: payload, // Send as JSON, not FormData
//         headers: {
//           'Content-Type': 'application/json',
//           // Remove multipart/form-data since we're sending JSON
//         }
//       });

//       toast.success('Delivery partner added successfully!');
//       reset();
//       setImagePreview(null);
//       setDocumentStatus({
//         idProof: 'pending',
//         addressProof: 'pending',
//         panProof: 'pending',
//         vehicleDocuments: 'pending',
//         drivingLicense: 'pending',
//         insuranceDocuments: 'pending',
//       });
//       setTimeout(() => {
//         navigate('/delivery-partner');
//       }, 2000);
//     } catch (error) {
//       console.error("Error adding delivery partner:", error);
//       toast.error("Failed to add delivery partner.");
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="bg-gradient-to-br px-0 py-8 sm:px-6 md:px-10 min-h-[60vh] max-w-[60rem] m-auto">
//         <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border">
//           {/* Header */}
//           <div className="mb-8 flex items-start justify-between">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Add New Delivery Partner
//             </h2>
//             <NavigateBtn
//               to="/delivery-partner"
//               label={
//                 <>
//                   <span className="hidden sm:flex items-center gap-1">
//                     <ArrowBackIcon fontSize="small" />
//                     <span>Back to Partners</span>
//                   </span>
//                   <span className="flex sm:hidden items-center gap-1">
//                     <ClearIcon fontSize="small" />
//                   </span>
//                 </>
//               }
//               className="text-sm"
//             />
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Personal Information */}
//             <div className="border-b border-gray-200 pb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     First Name *
//                   </label>
//                   <input
//                     id="name"
//                     type="text"
//                     {...register('name', {
//                       required: 'First name is required',
//                       minLength: {
//                         value: 2,
//                         message: 'First name must be at least 2 characters',
//                       },
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter first name"
//                   />
//                   {errors.name && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.name.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//                     Last Name *
//                   </label>
//                   <input
//                     id="lastName"
//                     type="text"
//                     {...register('lastName', {
//                       required: 'Last name is required',
//                       minLength: {
//                         value: 2,
//                         message: 'Last name must be at least 2 characters',
//                       },
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.lastName ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter last name"
//                   />
//                   {errors.lastName && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.lastName.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 <div>
//                   <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
//                     Date of Birth *
//                   </label>
//                   <input
//                     id="dob"
//                     type="date"
//                     {...register('dob', {
//                       required: 'Date of birth is required',
//                       validate: (value) => {
//                         const today = new Date();
//                         const dob = new Date(value);
//                         const age = today.getFullYear() - dob.getFullYear();
//                         const monthDiff = today.getMonth() - dob.getMonth();
//                         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//                           age--;
//                         }
//                         if (age < 18) {
//                           return 'Minimum age is 18 years';
//                         }
//                         return true;
//                       },
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.dob ? 'border-red-400' : 'border-gray-300'}`}
//                   />
//                   {errors.dob && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.dob.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-2">
//                     Guardian Name *
//                   </label>
//                   <input
//                     id="guardianName"
//                     type="text"
//                     {...register('guardianName', {
//                       required: 'Guardian name is required',
//                       minLength: {
//                         value: 2,
//                         message: 'Guardian name must be at least 2 characters',
//                       },
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.guardianName ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter guardian name"
//                   />
//                   {errors.guardianName && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.guardianName.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="border-b border-gray-200 pb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     id="phone"
//                     type="tel"
//                     {...register('phone', {
//                       required: 'Phone number is required',
//                       pattern: {
//                         value: /^[6-9]\d{9}$/,
//                         message: 'Please enter a valid 10-digit phone number starting with 6-9'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter phone number (e.g. 9876543210)"
//                   />
//                   {errors.phone && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.phone.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
//                     Emergency Contact *
//                   </label>
//                   <input
//                     id="emergencyContact"
//                     type="tel"
//                     {...register('emergencyContact', {
//                       required: 'Emergency contact is required',
//                       pattern: {
//                         value: /^[6-9]\d{9}$/,
//                         message: 'Please enter a valid 10-digit emergency contact number'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.emergencyContact ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter emergency contact number"
//                   />
//                   {errors.emergencyContact && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.emergencyContact.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                     Email *
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     {...register('email', {
//                       required: 'Email is required',
//                       pattern: {
//                         value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                         message: 'Please enter a valid email address'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter email address"
//                   />
//                   {errors.email && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 {!isManager && (
//                   <div>
//                     <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-2">
//                       Store *
//                     </label>
//                     {loadingStores ? (
//                       <div className="px-4 py-2 border border-gray-300 rounded-lg">
//                         <p className="text-gray-500">Loading stores...</p>
//                       </div>
//                     ) : stores && stores.length > 0 ? (
//                       <select
//                         id="storeId"
//                         {...register('storeId', {
//                           required: 'Please select a store',
//                         })}
//                         className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.storeId ? 'border-red-400' : 'border-gray-300'}`}
//                       >
//                         <option value="">Select a store</option>
//                         {stores.map((store) => (
//                           <option key={store._id} value={store._id}>
//                             {store.name}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="px-4 py-2 border border-gray-300 rounded-lg">
//                         <p className="text-gray-500">No stores available</p>
//                       </div>
//                     )}
//                     {errors.storeId && (
//                       <p className="mt-1 text-xs text-red-600" role="alert">
//                         {errors.storeId.message}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Address Information */}
//             <div className="border-b border-gray-200 pb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700 mb-2">
//                     Permanent Address *
//                   </label>
//                   <textarea
//                     id="permanentAddress"
//                     {...register('permanentAddress', {
//                       required: 'Permanent address is required',
//                       minLength: {
//                         value: 10,
//                         message: 'Permanent address must be at least 10 characters',
//                       },
//                     })}
//                     rows={3}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none ${errors.permanentAddress ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter permanent address"
//                   />
//                   {errors.permanentAddress && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.permanentAddress.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700 mb-2">
//                     Current Address *
//                   </label>
//                   <textarea
//                     id="currentAddress"
//                     {...register('currentAddress', {
//                       required: 'Current address is required',
//                       minLength: {
//                         value: 10,
//                         message: 'Current address must be at least 10 characters',
//                       },
//                     })}
//                     rows={3}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none ${errors.currentAddress ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter current address"
//                   />
//                   {errors.currentAddress && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.currentAddress.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 <div>
//                   <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
//                     Pin Code *
//                   </label>
//                   <input
//                     id="pin"
//                     type="text"
//                     {...register('pin', {
//                       required: 'Pin code is required',
//                       pattern: {
//                         value: /^[1-9][0-9]{5}$/,
//                         message: 'Please enter a valid 6-digit pin code'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.pin ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter pin code (e.g. 560078)"
//                   />
//                   {errors.pin && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.pin.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Bank Details */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Account Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 mb-2">
//                     Bank Account Number *
//                   </label>
//                   <input
//                     id="bankAccountNumber"
//                     type="text"
//                     {...register('bankAccountNumber', {
//                       required: 'Bank account number is required',
//                       minLength: {
//                         value: 9,
//                         message: 'Bank account number must be at least 9 digits',
//                       },
//                       pattern: {
//                         value: /^[0-9]{9,18}$/,
//                         message: 'Please enter a valid bank account number'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.bankAccountNumber ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter bank account number"
//                   />
//                   {errors.bankAccountNumber && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.bankAccountNumber.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="IFSCCode" className="block text-sm font-medium text-gray-700 mb-2">
//                     IFSC Code *
//                   </label>
//                   <input
//                     id="IFSCCode"
//                     type="text"
//                     {...register('IFSCCode', {
//                       required: 'IFSC code is required',
//                       pattern: {
//                         value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
//                         message: 'Please enter a valid IFSC code (e.g. SBIN0001234)'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.IFSCCode ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter IFSC code (e.g. SBIN0001234)"
//                   />
//                   {errors.IFSCCode && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.IFSCCode.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 <div>
//                   <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Holder Name *
//                   </label>
//                   <input
//                     id="accountHolderName"
//                     type="text"
//                     {...register('accountHolderName', {
//                       required: 'Account holder name is required',
//                       minLength: {
//                         value: 2,
//                         message: 'Account holder name must be at least 2 characters',
//                       },
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.accountHolderName ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter account holder name"
//                   />
//                   {errors.accountHolderName && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.accountHolderName.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Profile Image Upload - REMOVED FOR NOW since we're using JSON */}
//                 <div>
//                   <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-2">
//                     Profile Image (Currently disabled - use edit feature after creation)
//                   </label>
//                   <input
//                     id="img"
//                     type="file"
//                     accept="image/*"
//                     disabled
//                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-500 cursor-not-allowed opacity-50"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Image upload will be available in the edit feature after partner creation.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Document Verification Status */}
//             <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Verification Status</h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 Current Overall Status: <span className={`font-bold ${calculateOverallStatus(documentStatus) === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>
//                   {calculateOverallStatus(documentStatus).toUpperCase()}
//                 </span>
//               </p>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {Object.entries(documentStatus).map(([key, value]) => (
//                   <div key={key} className="group">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
//                     </label>
//                     <select
//                       value={value}
//                       onChange={(e) => handleDocumentStatusChange(key as keyof DocumentStatus, e.target.value as 'verified' | 'pending' | 'rejected')}
//                       className={`w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${value === 'verified' ? 'border-green-300 bg-green-50' :
//                         value === 'rejected' ? 'border-red-300 bg-red-50' :
//                           'border-gray-300 bg-white'
//                         }`}
//                     >
//                       <option value="pending">⏳ Pending</option>
//                       <option value="verified">✅ Verified</option>
//                       <option value="rejected">❌ Rejected</option>
//                     </select>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <span className="text-sm text-blue-700">
//                     <strong>Note:</strong> Overall status will be "Verified" only when all documents are verified. If any document is pending or rejected, status will be "Pending".
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center pt-4">
//               <SubmitButton
//                 label={isSubmitting ? "Adding..." : "Add Delivery Partner"}
//                 isSubmitting={isSubmitting}
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StoreStaffAdd;


// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import NavigateBtn from '../../../components/button/NavigateBtn';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SubmitButton from '../../../components/button/SubmitBtn';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import ClearIcon from '@mui/icons-material/Clear';
// import { callApi } from '../../../util/admin_api';

// interface FormInputs {
//   name: string;
//   lastName: string;
//   dob: string;
//   guardianName: string;
//   phone: string;
//   emergencyContact: string;
//   email: string;
//   permanentAddress: string;
//   currentAddress: string;
//   pin: string;
//   bankAccountNumber: string;
//   IFSCCode: string;
//   accountHolderName: string;
//   storeId?: string;
//   img?: FileList;
// }

// interface Store {
//   _id: string;
//   name: string;
// }

// interface DocumentStatus {
//   idProof: 'verified' | 'pending' | 'rejected';
//   addressProof: 'verified' | 'pending' | 'rejected';
//   panProof: 'verified' | 'pending' | 'rejected';
//   vehicleDocuments: 'verified' | 'pending' | 'rejected';
//   drivingLicense: 'verified' | 'pending' | 'rejected';
//   insuranceDocuments: 'verified' | 'pending' | 'rejected';
// }

// const StoreStaffAdd: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     watch,
//     setValue,
//     reset,
//   } = useForm<FormInputs>({
//     defaultValues: {
//       name: '',
//       lastName: '',
//       dob: '',
//       guardianName: '',
//       phone: '',
//       emergencyContact: '',
//       email: '',
//       permanentAddress: '',
//       currentAddress: '',
//       pin: '',
//       bankAccountNumber: '',
//       IFSCCode: '',
//       accountHolderName: '',
//       storeId: '',
//     },
//   });

//   const [stores, setStores] = useState<Store[]>([]);
//   const [loadingStores, setLoadingStores] = useState(true);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [isManager, setIsManager] = useState(false);
//   const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
//     idProof: 'pending',
//     addressProof: 'pending',
//     panProof: 'pending',
//     vehicleDocuments: 'pending',
//     drivingLicense: 'pending',
//     insuranceDocuments: 'pending',
//   });
//   const navigate = useNavigate();

//   const handleDocumentStatusChange = (key: keyof DocumentStatus, value: 'verified' | 'pending' | 'rejected') => {
//     setDocumentStatus(prev => ({ ...prev, [key]: value }));
//   };

//   // Check if user is manager
//   useEffect(() => {
//     const userRole = localStorage.getItem('userRole');
//     setIsManager(userRole === 'manager');
//   }, []);

//   // Fetch stores from API (only for super admin)
//   useEffect(() => {
//     if (isManager) return;

//     const fetchStores = async () => {
//       try {
//         setLoadingStores(true);
//         const response = await callApi({ endpoint: "/admin/all-store-name", method: "GET" });

//         let storesData: Store[] = [];

//         if (Array.isArray(response)) {
//           storesData = response;
//         } else if (response && Array.isArray(response.data)) {
//           storesData = response.data;
//         } else if (response && response.data && Array.isArray(response.data.data)) {
//           storesData = response.data.data;
//         }

//         console.log("Stores data:", storesData);
//         setStores(storesData);
//       } catch (error) {
//         console.error("Error fetching stores:", error);
//         toast.error("Failed to fetch stores.");
//       } finally {
//         setLoadingStores(false);
//       }
//     };

//     fetchStores();
//   }, [isManager]);

//   // Handle image preview and file selection
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         toast.error('Please select a valid image file');
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Image size should be less than 5MB');
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);

//       // Store the file for submission
//       setSelectedImage(file);
//       setValue('img', { 0: file } as any);

//       console.log('Image selected:', file.name, file.size, file.type);
//     }
//   };

//   // Remove selected image
//   const handleRemoveImage = () => {
//     setImagePreview(null);
//     setSelectedImage(null);
//     setValue('img', undefined);
//     // Reset file input
//     const fileInput = document.getElementById('img') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   };

//   // Calculate overall status based on document verification
//   const calculateOverallStatus = (docStatus: DocumentStatus): 'verified' | 'pending' => {
//     const allVerified = Object.values(docStatus).every(status => status === 'verified');
//     return allVerified ? 'verified' : 'pending';
//   };

//   const onSubmit: SubmitHandler<FormInputs> = async (data) => {
//     try {
//       console.log('Form Data:', data);
//       console.log('Document Status:', documentStatus);
//       console.log('Selected Image:', selectedImage);

//       // Calculate age from DOB
//       const dob = new Date(data.dob);
//       const today = new Date();
//       let age = today.getFullYear() - dob.getFullYear();
//       const monthDiff = today.getMonth() - dob.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//         age--;
//       }

//       // Calculate overall status
//       const overallStatus = calculateOverallStatus(documentStatus);

//       // Prepare FormData for submission
//       const formDataToSend = new FormData();

//       // Append all text fields
//       formDataToSend.append('name', data.name);
//       formDataToSend.append('lastName', data.lastName);
//       formDataToSend.append('dob', data.dob);
//       formDataToSend.append('age', age.toString());
//       formDataToSend.append('guardianName', data.guardianName);
//       formDataToSend.append('phone', data.phone);
//       formDataToSend.append('emergencyContact', data.emergencyContact);
//       formDataToSend.append('email', data.email);
//       formDataToSend.append('permanentAddress', data.permanentAddress);
//       formDataToSend.append('currentAddress', data.currentAddress);
//       formDataToSend.append('pin', data.pin);
//       formDataToSend.append('bankAccountNumber', data.bankAccountNumber);
//       formDataToSend.append('IFSCCode', data.IFSCCode);
//       formDataToSend.append('accountHolderName', data.accountHolderName);
//       formDataToSend.append('status', overallStatus);
//       formDataToSend.append('documentStatus', JSON.stringify(documentStatus));

//       // Add storeId for super admin
//       if (!isManager && data.storeId) {
//         formDataToSend.append('storeId', data.storeId);
//       }

//       // Append image if present - use the stored file directly
//       if (selectedImage) {
//         formDataToSend.append('img', selectedImage);
//         console.log('Appending image to FormData:', selectedImage.name);
//       }

//       // Log FormData contents for debugging
//       console.log('FormData contents:');
//       for (let [key, value] of formDataToSend.entries()) {
//         if (key === 'img') {
//           console.log(key, (value as File).name, (value as File).size, (value as File).type);
//         } else {
//           console.log(key, value);
//         }
//       }

//       // For manager, add managerId as query parameter
//       let endpoint = "/admin/delivery-partners";
//       if (isManager) {
//         const managerData = JSON.parse(localStorage.getItem('managerUser') || '{}');
//         const managerId = managerData.id;
//         if (managerId) {
//           endpoint = `/admin/delivery-partners?managerId=${managerId}`;
//         }
//       }

//       console.log('Making API call to:', endpoint);

//       // Call API to add delivery partner with FormData
//       const response = await callApi({
//         endpoint: endpoint,
//         method: "POST",
//         data: formDataToSend,
//         // Don't set Content-Type header - let the browser set it with boundary
//       });

//       console.log('API Response:', response);

//       if (response.success) {
//         toast.success('Delivery partner added successfully!');
//         reset();
//         setImagePreview(null);
//         setSelectedImage(null);
//         setDocumentStatus({
//           idProof: 'pending',
//           addressProof: 'pending',
//           panProof: 'pending',
//           vehicleDocuments: 'pending',
//           drivingLicense: 'pending',
//           insuranceDocuments: 'pending',
//         });
//         setTimeout(() => {
//           navigate('/delivery-partner');
//         }, 2000);
//       } else {
//         throw new Error(response.message || 'Failed to add delivery partner');
//       }
//     } catch (error) {
//       console.error("Error adding delivery partner:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to add delivery partner.");
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="bg-gradient-to-br px-0 py-8 sm:px-6 md:px-10 min-h-[60vh] max-w-[60rem] m-auto">
//         <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border">
//           {/* Header */}
//           <div className="mb-8 flex items-start justify-between">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Add New Delivery Partner
//             </h2>
//             <NavigateBtn
//               to="/delivery-partner"
//               label={
//                 <>
//                   <span className="hidden sm:flex items-center gap-1">
//                     <ArrowBackIcon fontSize="small" />
//                     <span>Back to Partners</span>
//                   </span>
//                   <span className="flex sm:hidden items-center gap-1">
//                     <ClearIcon fontSize="small" />
//                   </span>
//                 </>
//               }
//               className="text-sm"
//             />
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Personal Information */}
//             <div className="border-b border-gray-200 pb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     First Name *
//                   </label>
//                   <input
//                     id="name"
//                     type="text"
//                     {...register('name', {
//                       required: 'First name is required',
//                       minLength: {
//                         value: 2,
//                         message: 'First name must be at least 2 characters',
//                       },
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter first name"
//                   />
//                   {errors.name && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.name.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//                     Last Name *
//                   </label>
//                   <input
//                     id="lastName"
//                     type="text"
//                     {...register('lastName', {
//                       required: 'Last name is required',
//                       minLength: {
//                         value: 2,
//                         message: 'Last name must be at least 2 characters',
//                       },
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.lastName ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter last name"
//                   />
//                   {errors.lastName && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.lastName.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 <div>
//                   <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
//                     Date of Birth *
//                   </label>
//                   <input
//                     id="dob"
//                     type="date"
//                     {...register('dob', {
//                       required: 'Date of birth is required',
//                       validate: (value) => {
//                         const today = new Date();
//                         const dob = new Date(value);
//                         const age = today.getFullYear() - dob.getFullYear();
//                         const monthDiff = today.getMonth() - dob.getMonth();
//                         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//                           age--;
//                         }
//                         if (age < 18) {
//                           return 'Minimum age is 18 years';
//                         }
//                         return true;
//                       },
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.dob ? 'border-red-400' : 'border-gray-300'}`}
//                   />
//                   {errors.dob && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.dob.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-2">
//                     Guardian Name *
//                   </label>
//                   <input
//                     id="guardianName"
//                     type="text"
//                     {...register('guardianName', {
//                       required: 'Guardian name is required',
//                       minLength: {
//                         value: 2,
//                         message: 'Guardian name must be at least 2 characters',
//                       },
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.guardianName ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter guardian name"
//                   />
//                   {errors.guardianName && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.guardianName.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="border-b border-gray-200 pb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     id="phone"
//                     type="tel"
//                     {...register('phone', {
//                       required: 'Phone number is required',
//                       pattern: {
//                         value: /^[6-9]\d{9}$/,
//                         message: 'Please enter a valid 10-digit phone number starting with 6-9'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter phone number (e.g. 9876543210)"
//                   />
//                   {errors.phone && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.phone.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
//                     Emergency Contact *
//                   </label>
//                   <input
//                     id="emergencyContact"
//                     type="tel"
//                     {...register('emergencyContact', {
//                       required: 'Emergency contact is required',
//                       pattern: {
//                         value: /^[6-9]\d{9}$/,
//                         message: 'Please enter a valid 10-digit emergency contact number'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.emergencyContact ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter emergency contact number"
//                   />
//                   {errors.emergencyContact && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.emergencyContact.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                     Email *
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     {...register('email', {
//                       required: 'Email is required',
//                       pattern: {
//                         value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                         message: 'Please enter a valid email address'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter email address"
//                   />
//                   {errors.email && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 {!isManager && (
//                   <div>
//                     <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-2">
//                       Store *
//                     </label>
//                     {loadingStores ? (
//                       <div className="px-4 py-2 border border-gray-300 rounded-lg">
//                         <p className="text-gray-500">Loading stores...</p>
//                       </div>
//                     ) : stores && stores.length > 0 ? (
//                       <select
//                         id="storeId"
//                         {...register('storeId', {
//                           required: 'Please select a store',
//                         })}
//                         className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.storeId ? 'border-red-400' : 'border-gray-300'}`}
//                       >
//                         <option value="">Select a store</option>
//                         {stores.map((store) => (
//                           <option key={store._id} value={store._id}>
//                             {store.name}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="px-4 py-2 border border-gray-300 rounded-lg">
//                         <p className="text-gray-500">No stores available</p>
//                       </div>
//                     )}
//                     {errors.storeId && (
//                       <p className="mt-1 text-xs text-red-600" role="alert">
//                         {errors.storeId.message}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Address Information */}
//             <div className="border-b border-gray-200 pb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700 mb-2">
//                     Permanent Address *
//                   </label>
//                   <textarea
//                     id="permanentAddress"
//                     {...register('permanentAddress', {
//                       required: 'Permanent address is required',
//                       minLength: {
//                         value: 10,
//                         message: 'Permanent address must be at least 10 characters',
//                       },
//                     })}
//                     rows={3}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none ${errors.permanentAddress ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter permanent address"
//                   />
//                   {errors.permanentAddress && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.permanentAddress.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700 mb-2">
//                     Current Address *
//                   </label>
//                   <textarea
//                     id="currentAddress"
//                     {...register('currentAddress', {
//                       required: 'Current address is required',
//                       minLength: {
//                         value: 10,
//                         message: 'Current address must be at least 10 characters',
//                       },
//                     })}
//                     rows={3}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none ${errors.currentAddress ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter current address"
//                   />
//                   {errors.currentAddress && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.currentAddress.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 <div>
//                   <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
//                     Pin Code *
//                   </label>
//                   <input
//                     id="pin"
//                     type="text"
//                     {...register('pin', {
//                       required: 'Pin code is required',
//                       pattern: {
//                         value: /^[1-9][0-9]{5}$/,
//                         message: 'Please enter a valid 6-digit pin code'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.pin ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter pin code (e.g. 560078)"
//                   />
//                   {errors.pin && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.pin.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Bank Details */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Account Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 mb-2">
//                     Bank Account Number *
//                   </label>
//                   <input
//                     id="bankAccountNumber"
//                     type="text"
//                     {...register('bankAccountNumber', {
//                       required: 'Bank account number is required',
//                       minLength: {
//                         value: 9,
//                         message: 'Bank account number must be at least 9 digits',
//                       },
//                       pattern: {
//                         value: /^[0-9]{9,18}$/,
//                         message: 'Please enter a valid bank account number'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.bankAccountNumber ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter bank account number"
//                   />
//                   {errors.bankAccountNumber && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.bankAccountNumber.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="IFSCCode" className="block text-sm font-medium text-gray-700 mb-2">
//                     IFSC Code *
//                   </label>
//                   <input
//                     id="IFSCCode"
//                     type="text"
//                     {...register('IFSCCode', {
//                       required: 'IFSC code is required',
//                       pattern: {
//                         value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
//                         message: 'Please enter a valid IFSC code (e.g. SBIN0001234)'
//                       }
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.IFSCCode ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter IFSC code (e.g. SBIN0001234)"
//                   />
//                   {errors.IFSCCode && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.IFSCCode.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 <div>
//                   <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Holder Name *
//                   </label>
//                   <input
//                     id="accountHolderName"
//                     type="text"
//                     {...register('accountHolderName', {
//                       required: 'Account holder name is required',
//                       minLength: {
//                         value: 2,
//                         message: 'Account holder name must be at least 2 characters',
//                       },
//                     })}
//                     className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.accountHolderName ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter account holder name"
//                   />
//                   {errors.accountHolderName && (
//                     <p className="mt-1 text-xs text-red-600" role="alert">
//                       {errors.accountHolderName.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Enhanced Profile Image Upload */}
//                 <div>
//                   <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-2">
//                     Profile Image
//                   </label>
//                   <div className="space-y-3">
//                     <input
//                       id="img"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                     />

//                     {imagePreview && (
//                       <div className="relative inline-block">
//                         <img
//                           src={imagePreview}
//                           alt="Profile preview"
//                           className="w-32 h-32 object-cover rounded-lg border-2 border-blue-300 shadow-sm"
//                         />
//                         <button
//                           type="button"
//                           onClick={handleRemoveImage}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
//                         >
//                           ×
//                         </button>
//                         {selectedImage && (
//                           <div className="text-xs text-gray-500 mt-1">
//                             {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {!imagePreview && (
//                       <div className="text-xs text-gray-500">
//                         Recommended: Square image, max 5MB. JPG, PNG, or WebP formats.
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>



//             {/* Submit Button */}
//             <div className="flex justify-center pt-4">
//               <SubmitButton
//                 label={isSubmitting ? "Adding..." : "Add Delivery Partner"}
//                 isSubmitting={isSubmitting}
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StoreStaffAdd;

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import NavigateBtn from '../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubmitButton from '../../../components/button/SubmitBtn';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import { callApi } from '../../../util/admin_api';

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
  storeId?: string;
  img?: FileList;
}

interface Store {
  _id: string;
  name: string;
}

interface DocumentStatus {
  idProof: 'verified' | 'pending' | 'rejected';
  addressProof: 'verified' | 'pending' | 'rejected';
  panProof: 'verified' | 'pending' | 'rejected';
  vehicleDocuments: 'verified' | 'pending' | 'rejected';
  drivingLicense: 'verified' | 'pending' | 'rejected';
  insuranceDocuments: 'verified' | 'pending' | 'rejected';
}

const StoreStaffAdd: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
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
      storeId: '',
    },
  });

  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isManager, setIsManager] = useState(false);
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
    idProof: 'pending',
    addressProof: 'pending',
    panProof: 'pending',
    vehicleDocuments: 'pending',
    drivingLicense: 'pending',
    insuranceDocuments: 'pending',
  });
  const navigate = useNavigate();

  const handleDocumentStatusChange = (key: keyof DocumentStatus, value: 'verified' | 'pending' | 'rejected') => {
    setDocumentStatus(prev => ({ ...prev, [key]: value }));
  };

  // Check if user is manager
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsManager(userRole === 'manager');
  }, []);

  // Fetch stores from API (only for super admin)
  useEffect(() => {
    if (isManager) return;

    const fetchStores = async () => {
      try {
        setLoadingStores(true);
        const response = await callApi({ endpoint: "/admin/all-store-name", method: "GET" });

        let storesData: Store[] = [];

        if (Array.isArray(response)) {
          storesData = response;
        } else if (response && Array.isArray(response.data)) {
          storesData = response.data;
        } else if (response && response.data && Array.isArray(response.data.data)) {
          storesData = response.data.data;
        }

        console.log("Stores data:", storesData);
        setStores(storesData);
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast.error("Failed to fetch stores.");
      } finally {
        setLoadingStores(false);
      }
    };

    fetchStores();
  }, [isManager]);

  // Handle image preview and file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Store the file for submission
      setSelectedImage(file);
      setValue('img', { 0: file } as any);

      console.log('Image selected:', file.name, file.size, file.type);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
    setValue('img', undefined);
    // Reset file input
    const fileInput = document.getElementById('img') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Calculate overall status based on document verification
  const calculateOverallStatus = (docStatus: DocumentStatus): 'verified' | 'pending' => {
    const allVerified = Object.values(docStatus).every(status => status === 'verified');
    return allVerified ? 'verified' : 'pending';
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      console.log('Form Data:', data);
      console.log('Document Status:', documentStatus);
      console.log('Selected Image:', selectedImage);

      // Calculate age from DOB
      const dob = new Date(data.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      // Calculate overall status
      const overallStatus = calculateOverallStatus(documentStatus);

      // Prepare FormData for submission
      const formDataToSend = new FormData();

      // Append all text fields
      formDataToSend.append('name', data.name);
      formDataToSend.append('lastName', data.lastName);
      formDataToSend.append('dob', data.dob);
      formDataToSend.append('age', age.toString());
      formDataToSend.append('guardianName', data.guardianName);
      formDataToSend.append('phone', data.phone);
      formDataToSend.append('emergencyContact', data.emergencyContact);
      formDataToSend.append('email', data.email);
      formDataToSend.append('permanentAddress', data.permanentAddress);
      formDataToSend.append('currentAddress', data.currentAddress);
      formDataToSend.append('pin', data.pin);
      formDataToSend.append('bankAccountNumber', data.bankAccountNumber);
      formDataToSend.append('IFSCCode', data.IFSCCode);
      formDataToSend.append('accountHolderName', data.accountHolderName);
      formDataToSend.append('status', overallStatus);
      formDataToSend.append('documentStatus', JSON.stringify(documentStatus));

      // Add storeId for super admin
      if (!isManager && data.storeId) {
        formDataToSend.append('storeId', data.storeId);
      }

      // Append image if present - use the stored file directly
      if (selectedImage) {
        formDataToSend.append('img', selectedImage);
        console.log('Appending image to FormData:', selectedImage.name);
      }

      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        if (key === 'img') {
          console.log(key, (value as File).name, (value as File).size, (value as File).type);
        } else {
          console.log(key, value);
        }
      }

      // For manager, add managerId as query parameter
      let endpoint = "/admin/delivery-partners";
      if (isManager) {
        const managerData = JSON.parse(localStorage.getItem('managerUser') || '{}');
        const managerId = managerData.id;
        if (managerId) {
          endpoint = `/admin/delivery-partners?managerId=${managerId}`;
        }
      }

      console.log('Making API call to:', endpoint);

      // Call API to add delivery partner with FormData
      const response = await callApi({
        endpoint: endpoint,
        method: "POST",
        data: formDataToSend,
        // Don't set Content-Type header - let the browser set it with boundary
      });

      console.log('API Response:', response);

      if (response.success) {
        toast.success('Delivery partner added successfully!');
        reset();
        setImagePreview(null);
        setSelectedImage(null);
        setDocumentStatus({
          idProof: 'pending',
          addressProof: 'pending',
          panProof: 'pending',
          vehicleDocuments: 'pending',
          drivingLicense: 'pending',
          insuranceDocuments: 'pending',
        });
        setTimeout(() => {
          navigate('/delivery-partner');
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to add delivery partner');
      }
    } catch (error) {
      console.error("Error adding delivery partner:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add delivery partner.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-gradient-to-br px-0 py-8 sm:px-6 md:px-10 min-h-[60vh] max-w-[60rem] m-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Delivery Partner
            </h2>
            <NavigateBtn
              to="/delivery-partner"
              label={
                <>
                  <span className="hidden sm:flex items-center gap-1">
                    <ArrowBackIcon fontSize="small" />
                    <span>Back to Partners</span>
                  </span>
                  <span className="flex sm:hidden items-center gap-1">
                    <ClearIcon fontSize="small" />
                  </span>
                </>
              }
              className="text-sm"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter first name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.lastName ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    id="dob"
                    type="date"
                    {...register('dob', {
                      required: 'Date of birth is required',
                      validate: (value) => {
                        const today = new Date();
                        const dob = new Date(value);
                        let age = today.getFullYear() - dob.getFullYear();
                        const monthDiff = today.getMonth() - dob.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                          age--;
                        }
                        if (age < 18) {
                          return 'Minimum age is 18 years';
                        }
                        return true;
                      },
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.dob ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.dob && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.dob.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-2">
                    Guardian Name *
                  </label>
                  <input
                    id="guardianName"
                    type="text"
                    {...register('guardianName', {
                      required: 'Guardian name is required',
                      minLength: {
                        value: 2,
                        message: 'Guardian name must be at least 2 characters',
                      },
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.guardianName ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter guardian name"
                  />
                  {errors.guardianName && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.guardianName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Please enter a valid 10-digit phone number starting with 6-9'
                      }
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter phone number (e.g. 9876543210)"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact *
                  </label>
                  <input
                    id="emergencyContact"
                    type="tel"
                    {...register('emergencyContact', {
                      required: 'Emergency contact is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Please enter a valid 10-digit emergency contact number'
                      }
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.emergencyContact ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter emergency contact number"
                  />
                  {errors.emergencyContact && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.emergencyContact.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {!isManager && (
                  <div>
                    <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-2">
                      Store *
                    </label>
                    {loadingStores ? (
                      <div className="px-4 py-2 border border-gray-300 rounded-lg">
                        <p className="text-gray-500">Loading stores...</p>
                      </div>
                    ) : stores && stores.length > 0 ? (
                      <select
                        id="storeId"
                        {...register('storeId', {
                          required: 'Please select a store',
                        })}
                        className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.storeId ? 'border-red-400' : 'border-gray-300'}`}
                      >
                        <option value="">Select a store</option>
                        {stores.map((store) => (
                          <option key={store._id} value={store._id}>
                            {store.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-4 py-2 border border-gray-300 rounded-lg">
                        <p className="text-gray-500">No stores available</p>
                      </div>
                    )}
                    {errors.storeId && (
                      <p className="mt-1 text-xs text-red-600" role="alert">
                        {errors.storeId.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Permanent Address *
                  </label>
                  <textarea
                    id="permanentAddress"
                    {...register('permanentAddress', {
                      required: 'Permanent address is required',
                      minLength: {
                        value: 10,
                        message: 'Permanent address must be at least 10 characters',
                      },
                    })}
                    rows={3}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none ${errors.permanentAddress ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter permanent address"
                  />
                  {errors.permanentAddress && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.permanentAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Address *
                  </label>
                  <textarea
                    id="currentAddress"
                    {...register('currentAddress', {
                      required: 'Current address is required',
                      minLength: {
                        value: 10,
                        message: 'Current address must be at least 10 characters',
                      },
                    })}
                    rows={3}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none ${errors.currentAddress ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter current address"
                  />
                  {errors.currentAddress && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.currentAddress.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                    Pin Code *
                  </label>
                  <input
                    id="pin"
                    type="text"
                    {...register('pin', {
                      required: 'Pin code is required',
                      pattern: {
                        value: /^[1-9][0-9]{5}$/,
                        message: 'Please enter a valid 6-digit pin code'
                      }
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.pin ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter pin code (e.g. 560078)"
                  />
                  {errors.pin && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.pin.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Account Number *
                  </label>
                  <input
                    id="bankAccountNumber"
                    type="text"
                    {...register('bankAccountNumber', {
                      required: 'Bank account number is required',
                      minLength: {
                        value: 9,
                        message: 'Bank account number must be at least 9 digits',
                      },
                      pattern: {
                        value: /^[0-9]{9,18}$/,
                        message: 'Please enter a valid bank account number'
                      }
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.bankAccountNumber ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter bank account number"
                  />
                  {errors.bankAccountNumber && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.bankAccountNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="IFSCCode" className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code *
                  </label>
                  <input
                    id="IFSCCode"
                    type="text"
                    {...register('IFSCCode', {
                      required: 'IFSC code is required',
                      pattern: {
                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                        message: 'Please enter a valid IFSC code (e.g. SBIN0001234)'
                      }
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.IFSCCode ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter IFSC code (e.g. SBIN0001234)"
                  />
                  {errors.IFSCCode && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.IFSCCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    id="accountHolderName"
                    type="text"
                    {...register('accountHolderName', {
                      required: 'Account holder name is required',
                      minLength: {
                        value: 2,
                        message: 'Account holder name must be at least 2 characters',
                      },
                    })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.accountHolderName ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter account holder name"
                  />
                  {errors.accountHolderName && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.accountHolderName.message}
                    </p>
                  )}
                </div>

                {/* Enhanced Profile Image Upload */}
                <div>
                  <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="space-y-3">
                    <input
                      id="img"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />

                    {imagePreview && (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-blue-300 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                        {selectedImage && (
                          <div className="text-xs text-gray-500 mt-1">
                            {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
                          </div>
                        )}
                      </div>
                    )}

                    {!imagePreview && (
                      <div className="text-xs text-gray-500">
                        Recommended: Square image, max 5MB. JPG, PNG, or WebP formats.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>



            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <SubmitButton
                label={isSubmitting ? "Adding..." : "Add Delivery Partner"}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StoreStaffAdd;
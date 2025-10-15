// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { useLocation, useNavigate } from 'react-router-dom';
// import NavigateBtn from '../../../components/button/NavigateBtn';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SubmitButton from '../../../components/button/SubmitBtn';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import ClearIcon from '@mui/icons-material/Clear';
// import callApi from '../../../util/admin_api';

// interface DocumentStatus {
//   idProof: 'verified' | 'pending' | 'rejected';
//   addressProof: 'verified' | 'pending' | 'rejected';
//   panProof: 'verified' | 'pending' | 'rejected';
//   vehicleDocuments: 'verified' | 'pending' | 'rejected';
//   drivingLicense: 'verified' | 'pending' | 'rejected';
//   insuranceDocuments: 'verified' | 'pending' | 'rejected';
// }

// interface VerificationNotes {
//   idProof?: string;
//   addressProof?: string;
//   panProof?: string;
//   vehicleDocuments?: string;
//   drivingLicense?: string;
//   insuranceDocuments?: string;
// }

// interface FormInputs {
//   _id: string;
//   name: string;
//   lastName?: string;
//   dob?: string;
//   guardianName?: string;
//   age?: number;
//   phone: string;
//   emergencyContact?: string;
//   email?: string;
//   permanentAddress?: string;
//   currentAddress?: string;
//   pin?: string;
//   status: 'verified' | 'pending';
//   bankAccountNumber?: string;
//   IFSCCode?: string;
//   accountHolderName?: string;
//   storeId?: string;
//   documentStatus: DocumentStatus;
//   verificationNotes: VerificationNotes;
//   overallDocumentStatus?: 'verified' | 'pending' | 'rejected';
//   isActive?: boolean;
//   assignedOrders?: string[];
//   totalDeliveries?: number;
//   totalAccepted?: number;
//   totalRejected?: number;
//   rating?: number;
//   lastActive?: string;
// }

// interface Store {
//   _id: string;
//   name: string;
// }

// const DeliveryPartnerEdit: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [stores, setStores] = useState<Store[]>([]);
//   const [loadingStores, setLoadingStores] = useState(true);
//   const [isFetching, setIsFetching] = useState(true);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   // Get the delivery partner data from location state
//   const rawData = location.state as Partial<FormInputs> || {};
//   const initialId = rawData._id || '';

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     watch,
//     reset,
//   } = useForm<FormInputs>({
//     defaultValues: {
//       _id: initialId,
//       name: '',
//       lastName: '',
//       dob: '',
//       guardianName: '',
//       age: 0,
//       phone: '',
//       emergencyContact: '',
//       email: '',
//       permanentAddress: '',
//       currentAddress: '',
//       pin: '',
//       status: 'pending',
//       bankAccountNumber: '',
//       IFSCCode: '',
//       accountHolderName: '',
//       storeId: '',
//       documentStatus: {
//         idProof: 'pending',
//         addressProof: 'pending',
//         panProof: 'pending',
//         vehicleDocuments: 'pending',
//         drivingLicense: 'pending',
//         insuranceDocuments: 'pending',
//       },
//       verificationNotes: {},
//       overallDocumentStatus: 'pending',
//       isActive: true,
//       assignedOrders: [],
//       totalDeliveries: 0,
//       totalAccepted: 0,
//       totalRejected: 0,
//       rating: 0,
//       lastActive: '',
//     },
//   });

//   // Watch values for display
//   const watchedValues = watch();

//   // Watch DOB to calculate age
//   const dob = watch('dob');
//   useEffect(() => {
//     if (dob) {
//       const birthDate = new Date(dob);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const m = today.getMonth() - birthDate.getMonth();
//       if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//       }
//       setValue('age', age);
//     }
//   }, [dob, setValue]);

//   // Calculate overall document status
//   const calculateOverallStatus = (docStatus: DocumentStatus) => {
//     const statuses = Object.values(docStatus);
//     if (statuses.some(s => s === 'rejected')) return 'rejected';
//     if (statuses.every(s => s === 'verified')) return 'verified';
//     return 'pending';
//   };

//   const documentStatus = watch('documentStatus');
//   useEffect(() => {
//     const overall = calculateOverallStatus(documentStatus);
//     setValue('overallDocumentStatus', overall);
//   }, [documentStatus, setValue]);

//   // Handle image change
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedImage(file);
//       const previewUrl = URL.createObjectURL(file);
//       setImagePreview(previewUrl);
//     }
//   };

//   // Fetch full partner data
//   useEffect(() => {
//     const fetchPartnerData = async () => {
//       if (!initialId) {
//         setIsFetching(false);
//         return;
//       }

//       try {
//         setIsFetching(true);
//         const response = await callApi(`/admin/delivery-partners/${initialId}`, { method: 'GET' });
//         const data = response.data.data;
//         console.log("🚀 ~ fetchPartnerData ~ data:", data)

//         setValue('_id', data._id);
//         setValue('name', data.name || '');
//         setValue('lastName', data.lastName || '');
//         setValue('dob', data.dob ? new Date(data.dob).toISOString().split('T')[0] : '');
//         setValue('guardianName', data.guardianName || '');
//         setValue('age', data.age || 0);
//         setValue('phone', data.phone || '');
//         setValue('emergencyContact', data.emergencyContact || '');
//         setValue('email', data.email || '');
//         setValue('permanentAddress', data.permanentAddress || '');
//         setValue('currentAddress', data.currentAddress || '');
//         setValue('pin', data.pin || '');
//         setValue('status', data.status || 'pending');
//         setValue('bankAccountNumber', data.bankAccountNumber || '');
//         setValue('IFSCCode', data.IFSCCode || '');
//         setValue('accountHolderName', data.accountHolderName || '');
//         setValue('storeId', data.store?._id || data.store || '');
//         setValue('documentStatus', data.documentStatus || {
//           idProof: 'pending',
//           addressProof: 'pending',
//           panProof: 'pending',
//           vehicleDocuments: 'pending',
//           drivingLicense: 'pending',
//           insuranceDocuments: 'pending',
//         });
//         setValue('verificationNotes', data.verificationNotes || {});
//         setValue('overallDocumentStatus', data.overallDocumentStatus || 'pending');
//         setValue('isActive', data.isActive ?? true);
//         setValue('assignedOrders', data.assignedOrders || []);
//         setValue('totalDeliveries', data.totalDeliveries || 0);
//         setValue('totalAccepted', data.totalAccepted || 0);
//         setValue('totalRejected', data.totalRejected || 0);
//         setValue('rating', data.rating || 0);
//         setValue('lastActive', data.lastActive ? new Date(data.lastActive).toISOString().split('T')[0] : '');

//         // Set current image preview
//         setImagePreview(data.img || null);

//         // Recalculate age from dob
//         if (data.dob) {
//           const birthDate = new Date(data.dob);
//           const today = new Date();
//           let age = today.getFullYear() - birthDate.getFullYear();
//           const m = today.getMonth() - birthDate.getMonth();
//           if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//             age--;
//           }
//           setValue('age', age);
//         }
//       } catch (error) {
//         console.error('Error fetching delivery partner:', error);
//         toast.error('Failed to load delivery partner data.');
//       } finally {
//         setIsFetching(false);
//       }
//     };

//     fetchPartnerData();
//   }, [initialId, setValue]);

//   // Fetch stores
//   useEffect(() => {
//     const fetchStores = async () => {
//       try {
//         setLoadingStores(true);
//         const response = await callApi('/admin/stores', { method: 'GET' });
//         console.log("🚀 ~ fetchStores ~ response.data:", response.data);
//         setStores(response.data.stores || []);
//       } catch (error) {
//         console.error('Error fetching stores:', error);
//         toast.error('Failed to load stores.');
//       } finally {
//         setLoadingStores(false);
//       }
//     };

//     fetchStores();
//   }, []);

//   const onSubmit: SubmitHandler<FormInputs> = async (data) => {
//     try {
//       // Calculate overall status
//       const overallStatus = calculateOverallStatus(data.documentStatus);

//       const submitData = {
//         name: data.name,
//         lastName: data.lastName,
//         dob: data.dob,
//         guardianName: data.guardianName,
//         phone: data.phone,
//         emergencyContact: data.emergencyContact,
//         email: data.email,
//         permanentAddress: data.permanentAddress,
//         currentAddress: data.currentAddress,
//         pin: data.pin,
//         status: data.status,
//         bankAccountNumber: data.bankAccountNumber,
//         IFSCCode: data.IFSCCode,
//         accountHolderName: data.accountHolderName,
//         storeId: data.storeId,
//         documentStatus: data.documentStatus,
//         verificationNotes: data.verificationNotes,
//         overallDocumentStatus: overallStatus,
//         isActive: data.isActive,
//       };

//       let response;
//       if (selectedImage) {
//         const formData = new FormData();
//         Object.keys(submitData).forEach((key) => {
//           formData.append(key, submitData[key] as string);
//         });
//         formData.append('img', selectedImage);
//         response = await callApi(`/admin/delivery-partners/${data._id}`, {
//           method: "PATCH",
//           data: formData,
//         });
//       } else {
//         response = await callApi(`/admin/delivery-partners/${data._id}`, {
//           method: "PATCH",
//           data: submitData,
//         });
//       }
//       console.log("🚀 ~ onSubmit ~ response:", response);

//       toast.success('Delivery Partner updated successfully!');
//       setTimeout(() => {
//         navigate('/delivery-partner');
//       }, 2000);
//     } catch (error) {
//       console.error('Error updating delivery partner:', error);
//       toast.error('Failed to update delivery partner.');
//     }
//   };

//   if (isFetching) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-xl text-gray-600">Loading delivery partner data...</p>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <>
//       <ToastContainer />
//       <div className="flex items-center justify-center bg-gradient-to-br px-0 py-8 sm:px-6 lg:px-8 max-w-[40rem] m-auto">
//         <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border">
//           {/* Header */}
//           <div className="mb-8 flex items-center justify-between">
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
//               Edit Delivery Partner
//             </h2>
//             <NavigateBtn
//               to="/delivery-partner"
//               label={
//                 <>
//                   {/* Desktop / sm and up */}
//                   <span className="hidden sm:flex items-center gap-1">
//                     <ArrowBackIcon fontSize="small" />
//                     <span>Back to Delivery Partners</span>
//                   </span>

//                   {/* Mobile / below sm */}
//                   <span className="flex sm:hidden items-center gap-1">
//                     <ClearIcon fontSize="small" />
//                   </span>
//                 </>
//               }
//             />
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
//             {/* ID (hidden) */}
//             <input type="hidden" {...register('_id')} />

//             {/* Personal Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Name */}
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                     First Name
//                   </label>
//                   <input
//                     id="name"
//                     type="text"
//                     {...register('name', {
//                       required: 'First name is required',
//                       minLength: { value: 2, message: 'Name must be at least 2 characters' },
//                     })}
//                     className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter first name"
//                     aria-invalid={errors.name ? 'true' : 'false'}
//                   />
//                   {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
//                 </div>

//                 {/* Last Name */}
//                 <div>
//                   <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                     Last Name
//                   </label>
//                   <input
//                     id="lastName"
//                     type="text"
//                     {...register('lastName')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     placeholder="Enter last name"
//                   />
//                 </div>

//                 {/* DOB */}
//                 <div>
//                   <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
//                     Date of Birth
//                   </label>
//                   <input
//                     id="dob"
//                     type="date"
//                     {...register('dob')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                   />
//                 </div>

//                 {/* Age */}
//                 <div>
//                   <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
//                     Age
//                   </label>
//                   <input
//                     id="age"
//                     type="number"
//                     {...register('age')}
//                     readOnly
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
//                   />
//                 </div>

//                 {/* Guardian Name */}
//                 <div className="md:col-span-2">
//                   <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-1">
//                     Guardian Name
//                   </label>
//                   <input
//                     id="guardianName"
//                     type="text"
//                     {...register('guardianName')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     placeholder="Enter guardian name"
//                   />
//                 </div>

//                 {/* Profile Image */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Profile Image
//                   </label>
//                   {imagePreview && (
//                     <div className="mb-2">
//                       <img
//                         src={imagePreview}
//                         alt="Profile preview"
//                         className="w-32 h-32 object-cover rounded-lg"
//                       />
//                     </div>
//                   )}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {/* Phone */}
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                     Phone Number
//                   </label>
//                   <input
//                     id="phone"
//                     type="tel"
//                     {...register('phone', {
//                       required: 'Phone number is required',
//                       pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' },
//                     })}
//                     className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
//                     placeholder="Enter phone number (e.g. 9876543210)"
//                     aria-invalid={errors.phone ? 'true' : 'false'}
//                   />
//                   {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
//                 </div>

//                 {/* Emergency Contact */}
//                 <div>
//                   <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
//                     Emergency Contact
//                   </label>
//                   <input
//                     id="emergencyContact"
//                     type="tel"
//                     {...register('emergencyContact')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     placeholder="Enter emergency contact"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     {...register('email')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     placeholder="example@email.com"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Address Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">Address Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Permanent Address */}
//                 <div className="md:col-span-2">
//                   <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700 mb-1">
//                     Permanent Address
//                   </label>
//                   <textarea
//                     id="permanentAddress"
//                     {...register('permanentAddress')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     placeholder="Enter permanent address"
//                     rows={3}
//                   />
//                 </div>

//                 {/* Current Address */}
//                 <div className="md:col-span-2">
//                   <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700 mb-1">
//                     Current Address
//                   </label>
//                   <textarea
//                     id="currentAddress"
//                     {...register('currentAddress')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     placeholder="Enter current address"
//                     rows={3}
//                   />
//                 </div>

//                 {/* PIN */}
//                 <div>
//                   <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
//                     PIN Code
//                   </label>
//                   <input
//                     id="pin"
//                     type="text"
//                     {...register('pin')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     placeholder="Enter PIN code"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Bank Details */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">Bank Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">
//                     Account Holder Name
//                   </label>
//                   <input
//                     id="accountHolderName"
//                     type="text"
//                     {...register('accountHolderName')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     placeholder="Enter account holder name"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                     Bank Account Number
//                   </label>
//                   <input
//                     id="bankAccountNumber"
//                     type="text"
//                     {...register('bankAccountNumber')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     placeholder="Enter bank account number"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="IFSCCode" className="block text-sm font-medium text-gray-700 mb-1">
//                     IFSC Code
//                   </label>
//                   <input
//                     id="IFSCCode"
//                     type="text"
//                     {...register('IFSCCode')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     placeholder="Enter IFSC code"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Store Selection */}
//             <div>
//               <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                 Store
//               </label>
//               {loadingStores ? (
//                 <div className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg">
//                   <p className="text-gray-500">Loading stores...</p>
//                 </div>
//               ) : stores && stores.length > 0 ? (
//                 <select
//                   id="storeId"
//                   {...register('storeId')}
//                   className="block w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                 >
//                   <option value="">Select a store</option>
//                   {stores.map((store) => (
//                     <option key={store._id} value={store._id}>
//                       {store.name}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <div className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg">
//                   <p className="text-gray-500">No stores available</p>
//                 </div>
//               )}
//             </div>

//             {/* Document Verification */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">Document Verification Status</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {[
//                   { key: 'idProof', label: 'ID Proof' },
//                   { key: 'addressProof', label: 'Address Proof' },
//                   { key: 'panProof', label: 'PAN Proof' },
//                   { key: 'vehicleDocuments', label: 'Vehicle Documents' },
//                   { key: 'drivingLicense', label: 'Driving License' },
//                   { key: 'insuranceDocuments', label: 'Insurance Documents' },
//                 ].map(({ key, label }) => (
//                   <div key={key} className="space-y-2">
//                     <label htmlFor={`documentStatus.${key}`} className="block text-sm font-medium text-gray-700">
//                       {label}
//                     </label>
//                     <select
//                       id={`documentStatus.${key}`}
//                       {...register(`documentStatus.${key}` as const)}
//                       className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="verified">Verified</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                   </div>
//                 ))}
//               </div>
//               <div className="p-3 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-blue-700">
//                   Overall Document Status: <strong>{calculateOverallStatus(documentStatus)}</strong>
//                 </p>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center pt-4">
//               <SubmitButton
//                 label={isSubmitting ? "Submit..." : "Submit"}
//                 isSubmitting={isSubmitting}
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DeliveryPartnerEdit;

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigateBtn from '../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubmitButton from '../../../components/button/SubmitBtn';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';
import callApi from '../../../util/admin_api';

interface DocumentStatus {
  idProof: 'verified' | 'pending' | 'rejected';
  addressProof: 'verified' | 'pending' | 'rejected';
  panProof: 'verified' | 'pending' | 'rejected';
  vehicleDocuments: 'verified' | 'pending' | 'rejected';
  drivingLicense: 'verified' | 'pending' | 'rejected';
  insuranceDocuments: 'verified' | 'pending' | 'rejected';
}

interface VerificationNotes {
  idProof?: string;
  addressProof?: string;
  panProof?: string;
  vehicleDocuments?: string;
  drivingLicense?: string;
  insuranceDocuments?: string;
}

interface FormInputs {
  _id: string;
  name: string;
  lastName?: string;
  dob?: string;
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
  storeId?: string;
  documentStatus: DocumentStatus;
  verificationNotes: VerificationNotes;
  overallDocumentStatus?: 'verified' | 'pending' | 'rejected';
  isActive?: boolean;
  assignedOrders?: string[];
  totalDeliveries?: number;
  totalAccepted?: number;
  totalRejected?: number;
  rating?: number;
  lastActive?: string;
}

interface Store {
  _id: string;
  name: string;
}

type DocKey = 'idProof' | 'addressProof' | 'panProof' | 'vehicleDocuments' | 'drivingLicense' | 'insuranceDocuments';

const documentFields: { key: DocKey; label: string }[] = [
  { key: 'idProof', label: 'ID Proof' },
  { key: 'addressProof', label: 'Address Proof' },
  { key: 'panProof', label: 'PAN Proof' },
  { key: 'vehicleDocuments', label: 'Vehicle Documents' },
  { key: 'drivingLicense', label: 'Driving License' },
  { key: 'insuranceDocuments', label: 'Insurance Documents' },
];

const DeliveryPartnerEdit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Get the delivery partner data from location state
  const rawData = location.state as Partial<FormInputs> || {};
  const initialId = rawData._id || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      _id: initialId,
      name: '',
      lastName: '',
      dob: '',
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
      storeId: '',
      documentStatus: {
        idProof: 'pending',
        addressProof: 'pending',
        panProof: 'pending',
        vehicleDocuments: 'pending',
        drivingLicense: 'pending',
        insuranceDocuments: 'pending',
      },
      verificationNotes: {},
      overallDocumentStatus: 'pending',
      isActive: true,
      assignedOrders: [],
      totalDeliveries: 0,
      totalAccepted: 0,
      totalRejected: 0,
      rating: 0,
      lastActive: '',
    },
  });

  // Watch values for display
  const watchedValues = watch();

  // Watch DOB to calculate age
  const dob = watch('dob');
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setValue('age', age);
    }
  }, [dob, setValue]);

  // Calculate overall document status
  const calculateOverallStatus = (docStatus: DocumentStatus) => {
    const statuses = Object.values(docStatus);
    if (statuses.some(s => s === 'rejected')) return 'rejected';
    if (statuses.every(s => s === 'verified')) return 'verified';
    return 'pending';
  };

  const documentStatus = watch('documentStatus');
  useEffect(() => {
    const overall = calculateOverallStatus(documentStatus);
    setValue('overallDocumentStatus', overall);
  }, [documentStatus, setValue]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Fetch full partner data
  useEffect(() => {
    const fetchPartnerData = async () => {
      if (!initialId) {
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        const response = await callApi(`/admin/delivery-partners/${initialId}`, { method: 'GET' });
        const data = response.data.data;
        console.log("🚀 ~ fetchPartnerData ~ data:", data)

        setValue('_id', data._id);
        setValue('name', data.name || '');
        setValue('lastName', data.lastName || '');
        setValue('dob', data.dob ? new Date(data.dob).toISOString().split('T')[0] : '');
        setValue('guardianName', data.guardianName || '');
        setValue('age', data.age || 0);
        setValue('phone', data.phone || '');
        setValue('emergencyContact', data.emergencyContact || '');
        setValue('email', data.email || '');
        setValue('permanentAddress', data.permanentAddress || '');
        setValue('currentAddress', data.currentAddress || '');
        setValue('pin', data.pin || '');
        setValue('status', data.status || 'pending');
        setValue('bankAccountNumber', data.bankAccountNumber || '');
        setValue('IFSCCode', data.IFSCCode || '');
        setValue('accountHolderName', data.accountHolderName || '');
        setValue('storeId', data.store?._id || data.store || '');
        setValue('documentStatus', data.documentStatus || {
          idProof: 'pending',
          addressProof: 'pending',
          panProof: 'pending',
          vehicleDocuments: 'pending',
          drivingLicense: 'pending',
          insuranceDocuments: 'pending',
        });
        setValue('verificationNotes', data.verificationNotes || {});
        setValue('overallDocumentStatus', data.overallDocumentStatus || 'pending');
        setValue('isActive', data.isActive ?? true);
        setValue('assignedOrders', data.assignedOrders || []);
        setValue('totalDeliveries', data.totalDeliveries || 0);
        setValue('totalAccepted', data.totalAccepted || 0);
        setValue('totalRejected', data.totalRejected || 0);
        setValue('rating', data.rating || 0);
        setValue('lastActive', data.lastActive ? new Date(data.lastActive).toISOString().split('T')[0] : '');

        // Set current image preview
        setImagePreview(data.img || null);

        // Recalculate age from dob
        if (data.dob) {
          const birthDate = new Date(data.dob);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          setValue('age', age);
        }
      } catch (error) {
        console.error('Error fetching delivery partner:', error);
        toast.error('Failed to load delivery partner data.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchPartnerData();
  }, [initialId, setValue]);

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoadingStores(true);
        const response = await callApi('/admin/stores', { method: 'GET' });
        console.log("🚀 ~ fetchStores ~ response.data:", response.data);
        setStores(response.data.stores || []);
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Failed to load stores.');
      } finally {
        setLoadingStores(false);
      }
    };

    fetchStores();
  }, []);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      // Calculate overall status
      const overallStatus = calculateOverallStatus(data.documentStatus);

      const submitData = {
        name: data.name,
        lastName: data.lastName,
        dob: data.dob,
        guardianName: data.guardianName,
        phone: data.phone,
        emergencyContact: data.emergencyContact,
        email: data.email,
        permanentAddress: data.permanentAddress,
        currentAddress: data.currentAddress,
        pin: data.pin,
        status: data.status,
        bankAccountNumber: data.bankAccountNumber,
        IFSCCode: data.IFSCCode,
        accountHolderName: data.accountHolderName,
        storeId: data.storeId,
        documentStatus: data.documentStatus,
        verificationNotes: data.verificationNotes,
        overallDocumentStatus: overallStatus,
        isActive: data.isActive,
      };

      let response;
      if (selectedImage) {
        const formData = new FormData();
        for (const key in submitData) {
          const value = submitData[key as keyof typeof submitData];
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string);
          }
        }
        formData.append('img', selectedImage);
        response = await callApi(`/admin/delivery-partners/${data._id}`, {
          method: "PATCH",
          data: formData,
        });
      } else {
        response = await callApi(`/admin/delivery-partners/${data._id}`, {
          method: "PATCH",
          data: submitData,
        });
      }
      console.log("🚀 ~ onSubmit ~ response:", response);

      toast.success('Delivery Partner updated successfully!');
      setTimeout(() => {
        navigate('/delivery-partner');
      }, 2000);
    } catch (error) {
      console.error('Error updating delivery partner:', error);
      toast.error('Failed to update delivery partner.');
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading delivery partner data...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center bg-gradient-to-br px-0 py-8 sm:px-6 lg:px-8 max-w-[40rem] m-auto">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Edit Delivery Partner
            </h2>
            <NavigateBtn
              to="/delivery-partner"
              label={
                <>
                  {/* Desktop / sm and up */}
                  <span className="hidden sm:flex items-center gap-1">
                    <ArrowBackIcon fontSize="small" />
                    <span>Back to Delivery Partners</span>
                  </span>

                  {/* Mobile / below sm */}
                  <span className="flex sm:hidden items-center gap-1">
                    <ClearIcon fontSize="small" />
                  </span>
                </>
              }
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            {/* ID (hidden) */}
            <input type="hidden" {...register('_id')} />

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', {
                      required: 'First name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter first name"
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...register('lastName')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="Enter last name"
                  />
                </div>

                {/* DOB */}
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    {...register('dob')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  />
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    {...register('age')}
                    readOnly
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Guardian Name */}
                <div className="md:col-span-2">
                  <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-1">
                    Guardian Name
                  </label>
                  <input
                    id="guardianName"
                    type="text"
                    {...register('guardianName')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="Enter guardian name"
                  />
                </div>

                {/* Profile Image */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  {imagePreview && (
                    <div className="mb-2">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' },
                    })}
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter phone number (e.g. 9876543210)"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                </div>

                {/* Emergency Contact */}
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    id="emergencyContact"
                    type="tel"
                    {...register('emergencyContact')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="Enter emergency contact"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Permanent Address */}
                <div className="md:col-span-2">
                  <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Permanent Address
                  </label>
                  <textarea
                    id="permanentAddress"
                    {...register('permanentAddress')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="Enter permanent address"
                    rows={3}
                  />
                </div>

                {/* Current Address */}
                <div className="md:col-span-2">
                  <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Address
                  </label>
                  <textarea
                    id="currentAddress"
                    {...register('currentAddress')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="Enter current address"
                    rows={3}
                  />
                </div>

                {/* PIN */}
                <div>
                  <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    id="pin"
                    type="text"
                    {...register('pin')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="Enter PIN code"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    id="accountHolderName"
                    type="text"
                    {...register('accountHolderName')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="Enter account holder name"
                  />
                </div>
                <div>
                  <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    id="bankAccountNumber"
                    type="text"
                    {...register('bankAccountNumber')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="Enter bank account number"
                  />
                </div>
                <div>
                  <label htmlFor="IFSCCode" className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    id="IFSCCode"
                    type="text"
                    {...register('IFSCCode')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="Enter IFSC code"
                  />
                </div>
              </div>
            </div>

            {/* Store Selection */}
            <div>
              <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Store
              </label>
              {loadingStores ? (
                <div className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-gray-500">Loading stores...</p>
                </div>
              ) : stores && stores.length > 0 ? (
                <select
                  id="storeId"
                  {...register('storeId')}
                  className="block w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                >
                  <option value="">Select a store</option>
                  {stores.map((store) => (
                    <option key={store._id} value={store._id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-gray-500">No stores available</p>
                </div>
              )}
            </div>

            {/* Document Verification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Document Verification Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentFields.map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <label htmlFor={`documentStatus.${key}`} className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <select
                      id={`documentStatus.${key}`}
                      {...register(`documentStatus.${key}`)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Overall Document Status: <strong>{calculateOverallStatus(documentStatus)}</strong>
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <SubmitButton
                label={isSubmitting ? "Submit..." : "Submit"}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeliveryPartnerEdit;
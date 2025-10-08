// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import NavigateBtn from '../../../../../components/button/NavigateBtn';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { Button } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import ClearIcon from '@mui/icons-material/Clear';
// import callApi from '../../../../../util/admin_api';
// import { AxiosResponse } from 'axios';

// // Default image
// import defaultImg from '../../../../../assets/items/chicken leg piece.png';

// // Define API response type
// interface ApiResponse<T> {
//     statusCode: number;
//     success: boolean;
//     message: string;
//     data: T;
//     meta: any | null;
// }

// interface SubCategory {
//     _id: string;
//     name: string;
//     type: string[];
//     quality: string;
//     weight: string;
//     pieces: string;
//     serves: number;
//     totalEnergy: number;
//     carbohydrate: number;
//     fat: number;
//     protein: number;
//     description?: string;
//     img?: string;
//     price: number;
//     discount?: number; // Added discount field
// }

// interface FormInputs {
//     subCategoryName: string;
//     type: string;
//     quality: string;
//     weight: string;
//     pieces: string;
//     serves: string;
//     totalEnergy: string;
//     carbohydrate: string;
//     fat: string;
//     protein: string;
//     description: string;
//     subCategoryImage: FileList | null;
//     price: string;
//     discount: string; // Added discount field
// }

// interface UserData {
//     token?: string;
// }

// const SubCategoriesAdd: React.FC = () => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//         watch,
//         setValue,
//         reset,
//     } = useForm<FormInputs>({
//         defaultValues: {
//             subCategoryName: '',
//             type: '',
//             quality: '',
//             weight: '',
//             pieces: '',
//             serves: '',
//             totalEnergy: '',
//             carbohydrate: '',
//             fat: '',
//             protein: '',
//             description: '',
//             subCategoryImage: null,
//             price: '',
//             discount: '', // Default value for discount
//         },
//     });

//     const navigate = useNavigate();
//     const { id } = useParams<{ id: string }>();
//     const location = useLocation();
//     console.log("🚀 ~ SubCategoriesAdd ~ location:", location);
//     const [preview, setPreview] = useState<string | null>(null);
//     const [types, setTypes] = useState<string[]>([]);
//     const [inputValue, setInputValue] = useState<string>('');
//     const categoryId = id || (location.state as { categoryId?: string })?.categoryId;
//     console.log("🚀 ~ SubCategoriesAdd ~ categoryId:", categoryId);

//     // Watch file changes and set preview
//     const fileWatch = watch('subCategoryImage');
//     useEffect(() => {
//         if (fileWatch && fileWatch.length > 0) {
//             const file = fileWatch[0];
//             if (file.size > 5 * 1024 * 1024) {
//                 toast.error('Image size must be less than 5MB', {
//                     toastId: 'image-size-error',
//                     position: 'top-right',
//                     autoClose: 3000,
//                 });
//                 setValue('subCategoryImage', null);
//                 setPreview(null);
//                 return;
//             }
//             if (!file.type.startsWith('image/')) {
//                 toast.error('Please upload a valid image file', {
//                     toastId: 'image-type-error',
//                     position: 'top-right',
//                     autoClose: 3000,
//                 });
//                 setValue('subCategoryImage', null);
//                 setPreview(null);
//                 return;
//             }
//             const objectUrl = URL.createObjectURL(file);
//             setPreview(objectUrl);
//             return () => URL.revokeObjectURL(objectUrl);
//         } else {
//             setPreview(defaultImg);
//         }
//     }, [fileWatch, setValue]);

//     // Handle adding a type
//     const handleAddType = () => {
//         if (inputValue.trim()) {
//             setTypes((prev) => [...prev, inputValue.trim()]);
//             setInputValue('');
//             setValue('type', '');
//         }
//     };

//     // Handle removing a type
//     const handleRemoveType = (typeToRemove: string) => {
//         setTypes((prev) => prev.filter((type) => type !== typeToRemove));
//     };

//     const onSubmit: SubmitHandler<FormInputs> = async (data) => {
//         if (!data.subCategoryName.trim()) {
//             toast.error('Please enter a name', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (types.length === 0) {
//             toast.error('Please add at least one type', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!data.quality.trim()) {
//             toast.error('Please enter a quality', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!data.weight.trim()) {
//             toast.error('Please enter a weight', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!data.pieces.trim()) {
//             toast.error('Please enter the number of pieces', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!data.serves.trim()) {
//             toast.error('Please enter the number of serves', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!data.totalEnergy.trim()) {
//             toast.error('Please enter the total energy', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!data.carbohydrate.trim()) {
//             toast.error('Please enter the carbohydrate amount', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!data.fat.trim()) {
//             toast.error('Please enter the fat amount', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!data.protein.trim()) {
//             toast.error('Please enter the protein amount', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!data.price.trim()) {
//             toast.error('Please enter the price', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!data.discount.trim()) {
//             toast.error('Please enter the discount', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         if (!categoryId) {
//             toast.error('No category ID provided.', {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         try {
//             const userDataString = localStorage.getItem('superAdminUser');
//             const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
//             const token = userData.token;

//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }

//             const formData = new FormData();
//             formData.append('name', data.subCategoryName);
//             formData.append('type', JSON.stringify(types));
//             formData.append('quality', data.quality);
//             formData.append('weight', data.weight);
//             formData.append('pieces', data.pieces);
//             formData.append('serves', data.serves);
//             formData.append('totalEnergy', data.totalEnergy);
//             formData.append('carbohydrate', data.carbohydrate);
//             formData.append('fat', data.fat);
//             formData.append('protein', data.protein);
//             if (data.description) {
//                 formData.append('description', data.description);
//             }
//             if (data.subCategoryImage && data.subCategoryImage.length > 0) {
//                 formData.append('img', data.subCategoryImage[0]);
//             }
//             formData.append('price', data.price);
//             formData.append('discount', data.discount); // Add discount to form data

//             const response: AxiosResponse<ApiResponse<SubCategory>> = await callApi(
//                 `/admin/sub-product-categories/${categoryId}`,
//                 {
//                     method: 'POST',
//                     data: formData,
//                 }
//             );

//             if (!response.data.success) {
//                 throw new Error(response.data.message || 'Failed to add ');
//             }

//             toast.success(` "${data.subCategoryName}" added successfully!`, {
//                 toastId: 'add-sub-category-success',
//                 position: 'top-right',
//                 autoClose: 2000,
//                 onClose: () => navigate(`/sub/categories`, { state: { id: categoryId } }),
//             });
//             reset();
//             setTypes([]);
//             setPreview(null);
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'Failed to add ';
//             console.error('Error adding :', errorMessage);

//             toast.error(errorMessage, {
//                 toastId: 'add-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });

//             if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
//                 localStorage.removeItem('superAdminUser');
//                 navigate('/admin/login');
//             }
//         }
//     };

//     return (
//         <>
//             <ToastContainer
//                 position="top-right"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="light"
//                 style={{ zIndex: 9999 }}
//             />
//             <div className="bg-gradient-to-br px-0 py-8 sm:px-6 md:px-10 min-h-[60vh] min-w-[20rem] max-w-[40rem] m-auto">
//                 <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border">
//                     {/* Header */}
//                     <div className="mb-8 flex items-start justify-between">
//                         <h2 className="text-2xl font-bold text-gray-800">Add </h2>
//                         <NavigateBtn
//                             to={`/sub/categories`}
//                             state={{ id: categoryId }}
//                             label={
//                                 <>
//                                     {/* Desktop / sm and up */}
//                                     <span className="hidden sm:flex items-center gap-1">
//                                         <ArrowBackIcon fontSize="small" />
//                                         <span>Back to List</span>
//                                     </span>

//                                     {/* Mobile / below sm */}
//                                     <span className="flex sm:hidden items-center gap-1">
//                                         <ClearIcon fontSize="small" />
//                                     </span>
//                                 </>
//                             }
//                             className="text-sm"
//                         />
//                     </div>

//                     {/* Form */}
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                         {/*  Name */}
//                         <div>
//                             <label
//                                 htmlFor="subCategoryName"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Name *
//                             </label>
//                             <input
//                                 id="subCategoryName"
//                                 type="text"
//                                 {...register('subCategoryName', {
//                                     required: ' name is required',
//                                     minLength: { value: 2, message: 'Name must be at least 2 characters' },
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.subCategoryName ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter  name"
//                                 aria-invalid={errors.subCategoryName ? 'true' : 'false'}
//                             />
//                             {errors.subCategoryName && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.subCategoryName.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Types */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Types *
//                             </label>
//                             <div className="flex gap-2 mb-2">
//                                 <input
//                                     type="text"
//                                     {...register('type', {
//                                         required: 'Please add at least one type',
//                                     })}
//                                     value={inputValue}
//                                     onChange={(e) => setInputValue(e.target.value)}
//                                     placeholder="Add type..."
//                                     className="px-3 py-2 border rounded-lg flex-1"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={handleAddType}
//                                     className="px-3 py-2 bg-blue-500 text-white rounded-lg"
//                                 >
//                                     Add
//                                 </button>
//                             </div>
//                             {errors.type && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.type.message}
//                                 </p>
//                             )}
//                             <div className="flex flex-wrap gap-2">
//                                 {types.map((type) => (
//                                     <span
//                                         key={type}
//                                         className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1"
//                                     >
//                                         {type}
//                                         <button
//                                             type="button"
//                                             onClick={() => handleRemoveType(type)}
//                                             className="text-red-500 font-bold"
//                                         >
//                                             x
//                                         </button>
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Quality */}
//                         <div>
//                             <label
//                                 htmlFor="quality"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Quality *
//                             </label>
//                             <input
//                                 id="quality"
//                                 type="text"
//                                 {...register('quality', {
//                                     required: 'Quality is required',
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.quality ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter quality (e.g., Fresh)"
//                                 aria-invalid={errors.quality ? 'true' : 'false'}
//                             />
//                             {errors.quality && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.quality.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Weight */}
//                         <div>
//                             <label
//                                 htmlFor="weight"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Weight *
//                             </label>
//                             <input
//                                 id="weight"
//                                 type="text"
//                                 {...register('weight', {
//                                     required: 'Weight is required',
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.weight ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter weight (e.g., 500g)"
//                                 aria-invalid={errors.weight ? 'true' : 'false'}
//                             />
//                             {errors.weight && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.weight.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Pieces */}
//                         <div>
//                             <label
//                                 htmlFor="pieces"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Pieces *
//                             </label>
//                             <input
//                                 id="pieces"
//                                 type="text"
//                                 {...register('pieces', {
//                                     required: 'Pieces is required',
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.pieces ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter pieces (e.g., 5-6 slices)"
//                                 aria-invalid={errors.pieces ? 'true' : 'false'}
//                             />
//                             {errors.pieces && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.pieces.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Serves */}
//                         <div>
//                             <label
//                                 htmlFor="serves"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Serves *
//                             </label>
//                             <input
//                                 id="serves"
//                                 type="number"
//                                 {...register('serves', {
//                                     required: 'Serves is required',
//                                     min: { value: 1, message: 'Serves must be at least 1' },
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.serves ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter serves (e.g., 2)"
//                                 aria-invalid={errors.serves ? 'true' : 'false'}
//                             />
//                             {errors.serves && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.serves.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Total Energy */}
//                         <div>
//                             <label
//                                 htmlFor="totalEnergy"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Total Energy (kcal) *
//                             </label>
//                             <input
//                                 id="totalEnergy"
//                                 type="number"
//                                 {...register('totalEnergy', {
//                                     required: 'Total energy is required',
//                                     min: { value: 0, message: 'Total energy must be at least 0' },
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.totalEnergy ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter total energy (e.g., 380)"
//                                 aria-invalid={errors.totalEnergy ? 'true' : 'false'}
//                             />
//                             {errors.totalEnergy && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.totalEnergy.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Carbohydrate */}
//                         <div>
//                             <label
//                                 htmlFor="carbohydrate"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Carbohydrate (g) *
//                             </label>
//                             <input
//                                 id="carbohydrate"
//                                 type="number"
//                                 {...register('carbohydrate', {
//                                     required: 'Carbohydrate is required',
//                                     min: { value: 0, message: 'Carbohydrate must be at least 0' },
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.carbohydrate ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter carbohydrate (e.g., 0)"
//                                 aria-invalid={errors.carbohydrate ? 'true' : 'false'}
//                             />
//                             {errors.carbohydrate && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.carbohydrate.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Fat */}
//                         <div>
//                             <label
//                                 htmlFor="fat"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Fat (g) *
//                             </label>
//                             <input
//                                 id="fat"
//                                 type="number"
//                                 {...register('fat', {
//                                     required: 'Fat is required',
//                                     min: { value: 0, message: 'Fat must be at least 0' },
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.fat ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter fat (e.g., 12)"
//                                 aria-invalid={errors.fat ? 'true' : 'false'}
//                             />
//                             {errors.fat && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.fat.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Protein */}
//                         <div>
//                             <label
//                                 htmlFor="protein"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Protein (g) *
//                             </label>
//                             <input
//                                 id="protein"
//                                 type="number"
//                                 {...register('protein', {
//                                     required: 'Protein is required',
//                                     min: { value: 0, message: 'Protein must be at least 0' },
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.protein ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter protein (e.g., 42)"
//                                 aria-invalid={errors.protein ? 'true' : 'false'}
//                             />
//                             {errors.protein && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.protein.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Description */}
//                         <div>
//                             <label
//                                 htmlFor="description"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Description (Optional)
//                             </label>
//                             <textarea
//                                 id="description"
//                                 rows={3}
//                                 {...register('description')}
//                                 className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                                 placeholder="Enter  description"
//                             />
//                         </div>

//                         {/* Price */}
//                         <div>
//                             <label
//                                 htmlFor="price"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Price *
//                             </label>
//                             <input
//                                 id="price"
//                                 type="number"
//                                 {...register('price', {
//                                     required: 'Price is required',
//                                     min: { value: 0, message: 'Price must be at least 0' },
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.price ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter price (e.g., 350)"
//                                 aria-invalid={errors.price ? 'true' : 'false'}
//                             />
//                             {errors.price && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.price.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Discount */}
//                         <div>
//                             <label
//                                 htmlFor="discount"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Discount (%) *
//                             </label>
//                             <input
//                                 id="discount"
//                                 type="number"
//                                 {...register('discount', {
//                                     required: 'Discount is required',
//                                     min: { value: 0, message: 'Discount must be at least 0%' },
//                                     max: { value: 100, message: 'Discount cannot exceed 100%' },
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.discount ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                                 placeholder="Enter discount (e.g., 10)"
//                                 aria-invalid={errors.discount ? 'true' : 'false'}
//                             />
//                             {errors.discount && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.discount.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/*  Image Upload */}
//                         <div>
//                             <label
//                                 htmlFor="subCategoryImage"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Upload  Image (Optional)
//                             </label>
//                             <input
//                                 id="subCategoryImage"
//                                 type="file"
//                                 accept="image/*"
//                                 {...register('subCategoryImage')}
//                                 className={`block w-full px-3 py-2 border rounded-lg text-sm cursor-pointer focus:outline-none ${errors.subCategoryImage ? 'border-red-400' : 'border-gray-300'
//                                     }`}
//                             />
//                             {errors.subCategoryImage && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.subCategoryImage.message}
//                                 </p>
//                             )}

//                             {/* Image Preview */}
//                             {preview && (
//                                 <div className="mt-3">
//                                     <p className="text-sm text-gray-600 mb-1">Preview:</p>
//                                     <img
//                                         src={preview}
//                                         alt="Preview"
//                                         className="h-32 w-32 object-cover rounded border"
//                                     />
//                                 </div>
//                             )}
//                         </div>

//                         {/* Submit Button */}
//                         <div className="flex justify-center pt-4">
//                             <Button
//                                 type="submit"
//                                 variant="contained"
//                                 color="primary"
//                                 disabled={isSubmitting || !watch('subCategoryName').trim() || types.length === 0}
//                                 startIcon={<AddIcon />}
//                             >
//                                 {isSubmitting ? 'Adding...' : 'Add '}
//                             </Button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SubCategoriesAdd;

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import NavigateBtn from '../../../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import callApi from '../../../../../util/admin_api';
import { AxiosResponse } from 'axios';

// Define API response type
interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta: any | null;
}

interface SubCategory {
    _id: string;
    name: string;
    type: string[];
    quality: string;
    unit: string;
    serves: number;
    totalEnergy: number;
    carbohydrate: number;
    fat: number;
    protein: number;
    description: string;
    img?: string;
    price: number;
    discount: number;
}

interface FormInputs {
    subCategoryName: string;
    type: string;
    quality: string;
    description: string;
    unit: string;
    serves: string;
    totalEnergy: string;
    carbohydrate: string;
    fat: string;
    protein: string;
    subCategoryImage: FileList | null;
    price: string;
    discount: string;
}

interface UserData {
    token?: string;
}

const SubCategoriesAdd: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        reset,
    } = useForm<FormInputs>({
        defaultValues: {
            subCategoryName: '',
            type: '',
            quality: '',
            description: '',
            unit: 'kg',
            serves: '',
            totalEnergy: '',
            carbohydrate: '',
            fat: '',
            protein: '',
            subCategoryImage: null,
            price: '',
            discount: '',
        },
    });

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    console.log("🚀 ~ SubCategoriesAdd ~ location:", location)
    const [preview, setPreview] = useState<string | null>(null);
    const [types, setTypes] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const typeId = id || (location.state as { typeId?: string })?.typeId;
    console.log("🚀 ~ SubCategoriesAdd ~ categoryId:", typeId)

    // Watch file changes and set preview
    const fileWatch = watch('subCategoryImage');
    useEffect(() => {
        if (fileWatch && fileWatch.length > 0) {
            const file = fileWatch[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB', {
                    toastId: 'image-size-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                setValue('subCategoryImage', null);
                setPreview(null);
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file', {
                    toastId: 'image-type-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                setValue('subCategoryImage', null);
                setPreview(null);
                return;
            }
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [fileWatch, setValue]);

    // Handle adding a type
    const handleAddType = () => {
        if (inputValue.trim()) {
            setTypes((prev) => [...prev, inputValue.trim()]);
            setInputValue('');
            setValue('type', '');
        }
    };

    // Handle removing a type
    const handleRemoveType = (typeToRemove: string) => {
        setTypes((prev) => prev.filter((type) => type !== typeToRemove));
    };

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        if (!data.subCategoryName.trim()) {
            toast.error('Please enter a name', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (types.length === 0) {
            toast.error('Please add at least one type', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!data.quality.trim()) {
            toast.error('Please enter a quality', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!data.description.trim()) {
            toast.error('Please enter a description', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!data.unit) {
            toast.error('Please select a unit', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!data.serves.trim()) {
            toast.error('Please enter the number of serves', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!data.totalEnergy.trim()) {
            toast.error('Please enter the total energy', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!data.carbohydrate.trim()) {
            toast.error('Please enter the carbohydrate amount', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!data.fat.trim()) {
            toast.error('Please enter the fat amount', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!data.protein.trim()) {
            toast.error('Please enter the protein amount', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!data.price.trim()) {
            toast.error('Please enter the price', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!data.discount.trim()) {
            toast.error('Please enter the discount', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!typeId) {
            toast.error('No category ID provided.', {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        try {
            const userDataString = localStorage.getItem('superAdminUser');
            const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
            const token = userData.token;

            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }

            const formData = new FormData();
            formData.append('name', data.subCategoryName);
            formData.append('type', JSON.stringify(types));
            formData.append('quality', data.quality);
            formData.append('description', data.description);
            formData.append('unit', data.unit);
            formData.append('serves', data.serves);
            formData.append('totalEnergy', data.totalEnergy);
            formData.append('carbohydrate', data.carbohydrate);
            formData.append('fat', data.fat);
            formData.append('protein', data.protein);
            if (data.subCategoryImage && data.subCategoryImage.length > 0) {
                formData.append('img', data.subCategoryImage[0]);
            }
            formData.append('price', data.price);
            formData.append('discount', data.discount);

            const response: AxiosResponse<ApiResponse<SubCategory>> = await callApi(
                `/admin/sub-product-categories/${typeId}`,
                {
                    method: 'POST',
                    data: formData,
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to add subcategory');
            }

            toast.success(`"${data.subCategoryName}" added successfully!`, {
                toastId: 'add-sub-category-success',
                position: 'top-right',
                autoClose: 2000,
                onClose: () => navigate(`/sub/categories`, { state: { typeId: typeId } }),
            });
            reset();
            setTypes([]);
            setPreview(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add subcategory';
            console.error('Error adding subcategory:', errorMessage);

            toast.error(errorMessage, {
                toastId: 'add-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });

            if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
                localStorage.removeItem('superAdminUser');
                navigate('/admin/login');
            }
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ zIndex: 9999 }}
            />
            <div className="bg-gradient-to-br px-0 py-8 sm:px-6 md:px-10 min-h-[60vh] min-w-[20rem] max-w-[40rem] m-auto">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border">
                    {/* Header */}
                    <div className="mb-8 flex items-start justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Add Subcategory</h2>
                        <NavigateBtn
                            to={`/sub/categories`}
                            state={{ typeId: typeId }}
                            label={
                                <>
                                    <span className="hidden sm:flex items-center gap-1">
                                        <ArrowBackIcon fontSize="small" />
                                        <span>Back to List</span>
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
                        {/* Subcategory Name */}
                        <div>
                            <label
                                htmlFor="subCategoryName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Name *
                            </label>
                            <input
                                id="subCategoryName"
                                type="text"
                                {...register('subCategoryName', {
                                    required: 'Subcategory name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.subCategoryName ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter subcategory name"
                                aria-invalid={errors.subCategoryName ? 'true' : 'false'}
                            />
                            {errors.subCategoryName && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.subCategoryName.message}
                                </p>
                            )}
                        </div>

                        {/* Types */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Types *
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    {...register('type', {
                                        required: 'Please add at least one type',
                                    })}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Add type..."
                                    className="px-3 py-2 border rounded-lg flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddType}
                                    className="px-3 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    Add
                                </button>
                            </div>
                            {errors.type && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.type.message}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {types.map((type) => (
                                    <span
                                        key={type}
                                        className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1"
                                    >
                                        {type}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveType(type)}
                                            className="text-red-500 font-bold"
                                        >
                                            x
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Quality */}
                        <div>
                            <label
                                htmlFor="quality"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Quality *
                            </label>
                            <input
                                id="quality"
                                type="text"
                                {...register('quality', {
                                    required: 'Quality is required',
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.quality ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter quality (e.g., Fresh)"
                                aria-invalid={errors.quality ? 'true' : 'false'}
                            />
                            {errors.quality && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.quality.message}
                                </p>
                            )}
                        </div>

                        {/* Unit */}
                        <div>
                            <label
                                htmlFor="unit"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Unit *
                            </label>
                            <select
                                id="unit"
                                {...register('unit', {
                                    required: 'Unit is required',
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.unit ? 'border-red-400' : 'border-gray-300'}`}
                                aria-invalid={errors.unit ? 'true' : 'false'}
                            >
                                <option value="kg">Kilogram (kg)</option>
                                <option value="gram">Gram (g)</option>
                                <option value="pieces">Pieces</option>
                                <option value="mg">Milligram (mg)</option>
                            </select>
                            {errors.unit && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.unit.message}
                                </p>
                            )}
                        </div>

                        {/* Serves */}
                        <div>
                            <label
                                htmlFor="serves"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Serves *
                            </label>
                            <input
                                id="serves"
                                type="number"
                                {...register('serves', {
                                    required: 'Serves is required',
                                    min: { value: 1, message: 'Serves must be at least 1' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.serves ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter serves (e.g., 2)"
                                aria-invalid={errors.serves ? 'true' : 'false'}
                            />
                            {errors.serves && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.serves.message}
                                </p>
                            )}
                        </div>

                        {/* Total Energy */}
                        <div>
                            <label
                                htmlFor="totalEnergy"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Total Energy (kcal) *
                            </label>
                            <input
                                id="totalEnergy"
                                type="number"
                                {...register('totalEnergy', {
                                    required: 'Total energy is required',
                                    min: { value: 0, message: 'Total energy must be at least 0' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.totalEnergy ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter total energy (e.g., 380)"
                                aria-invalid={errors.totalEnergy ? 'true' : 'false'}
                            />
                            {errors.totalEnergy && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.totalEnergy.message}
                                </p>
                            )}
                        </div>

                        {/* Carbohydrate */}
                        <div>
                            <label
                                htmlFor="carbohydrate"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Carbohydrate (g) *
                            </label>
                            <input
                                id="carbohydrate"
                                type="number"
                                {...register('carbohydrate', {
                                    required: 'Carbohydrate is required',
                                    min: { value: 0, message: 'Carbohydrate must be at least 0' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.carbohydrate ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter carbohydrate (e.g., 0)"
                                aria-invalid={errors.carbohydrate ? 'true' : 'false'}
                            />
                            {errors.carbohydrate && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.carbohydrate.message}
                                </p>
                            )}
                        </div>

                        {/* Fat */}
                        <div>
                            <label
                                htmlFor="fat"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Fat (g) *
                            </label>
                            <input
                                id="fat"
                                type="number"
                                {...register('fat', {
                                    required: 'Fat is required',
                                    min: { value: 0, message: 'Fat must be at least 0' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.fat ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter fat (e.g., 12)"
                                aria-invalid={errors.fat ? 'true' : 'false'}
                            />
                            {errors.fat && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.fat.message}
                                </p>
                            )}
                        </div>

                        {/* Protein */}
                        <div>
                            <label
                                htmlFor="protein"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Protein (g) *
                            </label>
                            <input
                                id="protein"
                                type="number"
                                {...register('protein', {
                                    required: 'Protein is required',
                                    min: { value: 0, message: 'Protein must be at least 0' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.protein ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter protein (e.g., 42)"
                                aria-invalid={errors.protein ? 'true' : 'false'}
                            />
                            {errors.protein && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.protein.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Description *
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                {...register('description', {
                                    required: 'Description is required',
                                    minLength: { value: 5, message: 'Description must be at least 5 characters long' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.description ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter subcategory description"
                                aria-invalid={errors.description ? 'true' : 'false'}
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label
                                htmlFor="price"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Price *
                            </label>
                            <input
                                id="price"
                                type="number"
                                {...register('price', {
                                    required: 'Price is required',
                                    min: { value: 0, message: 'Price must be at least 0' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.price ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter price (e.g., 350)"
                                aria-invalid={errors.price ? 'true' : 'false'}
                            />
                            {errors.price && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>

                        {/* Discount */}
                        <div>
                            <label
                                htmlFor="discount"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Discount (%) *
                            </label>
                            <input
                                id="discount"
                                type="number"
                                {...register('discount', {
                                    required: 'Discount is required',
                                    min: { value: 0, message: 'Discount must be at least 0%' },
                                    max: { value: 100, message: 'Discount cannot exceed 100%' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.discount ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter discount (e.g., 10)"
                                aria-invalid={errors.discount ? 'true' : 'false'}
                            />
                            {errors.discount && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.discount.message}
                                </p>
                            )}
                        </div>

                        {/* Subcategory Image Upload */}
                        <div>
                            <label
                                htmlFor="subCategoryImage"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Upload Subcategory Image (Optional)
                            </label>
                            <input
                                id="subCategoryImage"
                                type="file"
                                accept="image/*"
                                {...register('subCategoryImage')}
                                className={`block w-full px-3 py-2 border rounded-lg text-sm cursor-pointer focus:outline-none ${errors.subCategoryImage ? 'border-red-400' : 'border-gray-300'}`}
                            />
                            {errors.subCategoryImage && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.subCategoryImage.message}
                                </p>
                            )}

                            {/* Image Preview */}
                            {preview && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-1">Preview:</p>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-32 w-32 object-cover rounded border"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || !watch('subCategoryName').trim() || types.length === 0}
                                startIcon={<AddIcon />}
                            >
                                {isSubmitting ? 'Adding...' : 'Add Subcategory'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SubCategoriesAdd;
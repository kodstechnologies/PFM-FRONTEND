// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import NavigateBtn from '../../../../components/button/NavigateBtn';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SubmitButton from '../../../../components/button/SubmitBtn';
// import { toast, ToastContainer } from 'react-toastify';
// import { useLocation, useNavigate } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import ClearIcon from '@mui/icons-material/Clear';
// import callApi from '../../../../util/admin_api';
// import { AxiosResponse } from 'axios';

// // Define API response type
// interface ApiResponse<T> {
//     statusCode: number;
//     success: boolean;
//     message: string;
//     data: T;
//     meta: any | null;
// }

// interface TypeCategory {
//     _id: string;
//     name: string;
//     img?: string; // Optional to reflect backend handling
//     description?: string;
// }

// interface FormInputs {
//     typeName: string;
//     typeImage: FileList | null;
// }

// const TypeCategoriesAdd: React.FC = () => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//         watch,
//         setValue,
//     } = useForm<FormInputs>({
//         defaultValues: {
//             typeName: '',
//             typeImage: null,
//         },
//     });

//     const navigate = useNavigate();
//     const [preview, setPreview] = useState<string | null>(null);
//     const location = useLocation();
//     console.log("🚀 ~ TypeCategoriesAdd ~ location:", location.state?.id);
//     const id = location.state?.id;

//     // Watch file changes and set preview
//     const fileWatch = watch('typeImage');
//     useEffect(() => {
//         if (fileWatch && fileWatch.length > 0) {
//             const file = fileWatch[0];
//             if (file.size > 5 * 1024 * 1024) {
//                 // 5MB limit
//                 toast.error('Image size must be less than 5MB', {
//                     toastId: 'image-size-error',
//                     position: 'top-right',
//                     autoClose: 3000,
//                 });
//                 setValue('typeImage', null);
//                 setPreview(null);
//                 return;
//             }
//             if (!file.type.startsWith('image/')) {
//                 toast.error('Please upload a valid image file', {
//                     toastId: 'image-type-error',
//                     position: 'top-right',
//                     autoClose: 3000,
//                 });
//                 setValue('typeImage', null);
//                 setPreview(null);
//                 return;
//             }
//             const objectUrl = URL.createObjectURL(file);
//             setPreview(objectUrl);
//             return () => URL.revokeObjectURL(objectUrl);
//         } else {
//             setPreview(null);
//         }
//     }, [fileWatch, setValue]);

//     const onSubmit: SubmitHandler<FormInputs> = async (data) => {
//         console.log("🚀 ~ onSubmit ~ data:", data);
//         if (!data.typeName.trim()) {
//             toast.error('Please enter a type category name', {
//                 toastId: 'add-type-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             return;
//         }

//         try {
//             const userData = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
//             const token = userData.token;
//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }

//             const formData = new FormData();
//             formData.append('name', data.typeName);
//             if (data.typeImage && data.typeImage.length > 0) {
//                 formData.append('img', data.typeImage[0]);
//                 console.log('🚀 ~ onSubmit ~ Image included:', data.typeImage[0].name);
//             } else {
//                 console.log('🚀 ~ onSubmit ~ No image provided');
//             }

//             console.log("🚀 ~ onSubmit ~ formData:", formData)
//             console.log('Adding type category:', { name: data.typeName, img: data.typeImage?.[0]?.name || 'none' });
//             const response: AxiosResponse<ApiResponse<TypeCategory>> = await callApi(
//                 `/admin/type-categories/${id}`,
//                 {
//                     method: 'POST',
//                     headers: { 'Authorization': `Bearer ${token}` }, // Ensure token is included
//                     data: formData,
//                 }
//             );
//             console.log('Add API response:', response);

//             if (!response.data.success) {
//                 throw new Error(response.data.message || 'Failed to add type category');
//             }

//             toast.success(`Type category ${data.typeName} added successfully!`, {
//                 toastId: 'add-type-category-success',
//                 position: 'top-right',
//                 autoClose: 2000,
//                 onClose: () => navigate('/type/categories', { state: { id } }),
//             });
//         } catch (error: any) {
//             console.error('Error adding type category:', error.message);
//             toast.error(error.message || 'Failed to add type category.', {
//                 toastId: 'add-type-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//             if (error.message.includes('token') || error.message.includes('Unauthorized')) {
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
//                         <h2 className="text-2xl font-bold text-gray-800">Add Type Category</h2>
//                         <NavigateBtn
//                             to="/type/categories"
//                             state={{ id: id }}
//                             label={
//                                 <>
//                                     {/* Desktop / sm and up */}
//                                     <span className="hidden sm:flex items-center gap-1">
//                                         <ArrowBackIcon fontSize="small" />
//                                         <span>Back to Type Categories</span>
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
//                         {/* Type Name */}
//                         <div>
//                             <label
//                                 htmlFor="typeName"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Type Category Name
//                             </label>
//                             <input
//                                 id="typeName"
//                                 type="text"
//                                 {...register('typeName', {
//                                     required: 'Type category name is required',
//                                     minLength: { value: 2, message: 'Name must be at least 2 characters' },
//                                 })}
//                                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.typeName ? 'border-red-400' : 'border-gray-300'}`}
//                                 placeholder="Enter type category name"
//                                 aria-invalid={errors.typeName ? 'true' : 'false'}
//                             />
//                             {errors.typeName && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.typeName.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Type Image Upload */}
//                         <div>
//                             <label
//                                 htmlFor="typeImage"
//                                 className="block text-sm font-medium text-gray-700 mb-1"
//                             >
//                                 Upload Type Category Image (Optional)
//                             </label>
//                             <input
//                                 id="typeImage"
//                                 type="file"
//                                 accept="image/*"
//                                 {...register('typeImage')}
//                                 className={`block w-full px-3 py-2 border rounded-lg text-sm cursor-pointer focus:outline-none ${errors.typeImage ? 'border-red-400' : 'border-gray-300'}`}
//                             />
//                             {errors.typeImage && (
//                                 <p className="mt-1 text-xs text-red-600" role="alert">
//                                     {errors.typeImage.message}
//                                 </p>
//                             )}

//                             {/* Image Preview */}
//                             {preview ? (
//                                 <div className="mt-3">
//                                     <p className="text-sm text-gray-600 mb-1">Preview:</p>
//                                     <img
//                                         src={preview}
//                                         alt="Preview"
//                                         className="h-32 w-32 object-cover rounded border"
//                                     />
//                                 </div>
//                             ) : (
//                                 <div className="mt-3">
//                                     <p className="text-sm text-gray-600 mb-1">Preview:</p>
//                                     <div className="h-32 w-32 flex items-center justify-center border rounded bg-gray-50 text-gray-500 text-sm">
//                                         No Image
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Submit Button */}
//                         <div className="flex justify-center pt-4">
//                             <SubmitButton
//                                 label={isSubmitting ? "Submitting..." : "Submit"}
//                                 isSubmitting={isSubmitting}
//                             />
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default TypeCategoriesAdd;

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavigateBtn from '../../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import callApi from '../../../../util/admin_api';
import { AxiosResponse } from 'axios';

// Define API response type
interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta: any | null;
}

interface TypeCategory {
    _id: string;
    name: string;
    img?: string; // Optional to reflect backend handling
    description?: string;
}

interface FormInputs {
    typeName: string;
    typeImage: FileList | null;
}

const TypeCategoriesAdd: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<FormInputs>({
        defaultValues: {
            typeName: '',
            typeImage: null,
        },
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { categoriesId } = useParams<{ categoriesId: string }>();
    const [preview, setPreview] = useState<string | null>(null);
    const categoryId = categoriesId || location.state?.id;

    // Watch file changes and set preview
    const fileWatch = watch('typeImage');
    useEffect(() => {
        if (fileWatch && fileWatch.length > 0) {
            const file = fileWatch[0];
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                toast.error('Image size must be less than 5MB', {
                    toastId: 'image-size-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                setValue('typeImage', null);
                setPreview(null);
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file', {
                    toastId: 'image-type-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                setValue('typeImage', null);
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

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        console.log("🚀 ~ onSubmit ~ data:", data);
        if (!data.typeName.trim()) {
            toast.error('Please enter a type category name', {
                toastId: 'add-type-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!categoryId) {
            toast.error('Category ID is missing. Please try again.', {
                toastId: 'missing-category-id-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        try {
            const userDataString = localStorage.getItem('superAdminUser');
            const userData = userDataString ? JSON.parse(userDataString) : {};
            const token = userData.token;
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }

            const formData = new FormData();
            formData.append('name', data.typeName);
            if (data.typeImage && data.typeImage.length > 0) {
                formData.append('img', data.typeImage[0]);
                console.log('🚀 ~ onSubmit ~ Image included:', data.typeImage[0].name);
            } else {
                console.log('🚀 ~ onSubmit ~ No image provided');
            }

            console.log("🚀 ~ onSubmit ~ formData:", formData)
            console.log('Adding type category:', { name: data.typeName, img: data.typeImage?.[0]?.name || 'none' });
            const response: AxiosResponse<ApiResponse<TypeCategory>> = await callApi(
                `/admin/type-categories/${categoryId}`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }, // Ensure token is included
                    data: formData,
                }
            );
            console.log('Add API response:', response);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to add type category');
            }

            toast.success(`Type category "${data.typeName}" added successfully!`, {
                toastId: 'add-type-category-success',
                position: 'top-right',
                autoClose: 2000,
                onClose: () => navigate(`/type/categories/${categoryId}`, { state: { id: categoryId } }),
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add type category';
            console.error('Error adding type category:', errorMessage);
            toast.error(errorMessage, {
                toastId: 'add-type-category-error',
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
                        <h2 className="text-2xl font-bold text-gray-800">Add Type Category</h2>
                        <NavigateBtn
                            to={`/type/categories/${categoryId}`}
                            state={{ id: categoryId }}
                            label={
                                <>
                                    {/* Desktop / sm and up */}
                                    <span className="hidden sm:flex items-center gap-1">
                                        <ArrowBackIcon fontSize="small" />
                                        <span>Back to Type Categories</span>
                                    </span>

                                    {/* Mobile / below sm */}
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
                        {/* Type Name */}
                        <div>
                            <label
                                htmlFor="typeName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Type Category Name *
                            </label>
                            <input
                                id="typeName"
                                type="text"
                                {...register('typeName', {
                                    required: 'Type category name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.typeName ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Enter type category name"
                                aria-invalid={errors.typeName ? 'true' : 'false'}
                            />
                            {errors.typeName && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.typeName.message}
                                </p>
                            )}
                        </div>

                        {/* Type Image Upload */}
                        <div>
                            <label
                                htmlFor="typeImage"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Upload Type Category Image (Optional)
                            </label>
                            <input
                                id="typeImage"
                                type="file"
                                accept="image/*"
                                {...register('typeImage')}
                                className={`block w-full px-3 py-2 border rounded-lg text-sm cursor-pointer focus:outline-none ${errors.typeImage ? 'border-red-400' : 'border-gray-300'}`}
                            />
                            {errors.typeImage && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.typeImage.message}
                                </p>
                            )}

                            {/* Image Preview */}
                            {preview ? (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-1">Preview:</p>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-32 w-32 object-cover rounded border"
                                    />
                                </div>
                            ) : (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-1">Preview:</p>
                                    <div className="h-32 w-32 flex items-center justify-center border rounded bg-gray-50 text-gray-500 text-sm">
                                        No Image Selected
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-white font-semibold transition flex items-center gap-2"
                            >
                                {isSubmitting ? 'Adding...' : 'Add Type Category'}
                                <AddIcon fontSize="small" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TypeCategoriesAdd;
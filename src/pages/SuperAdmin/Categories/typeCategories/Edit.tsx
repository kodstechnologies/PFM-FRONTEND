import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import NavigateBtn from '../../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubmitButton from '../../../../components/button/SubmitBtn';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';
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
    img: string;
    description?: string;
}

interface FormInputs {
    typeName: string;
    typeImage: FileList | null;
}

interface UserData {
    token?: string;
}

const TypeCategoriesEdit: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        reset,
    } = useForm<FormInputs>({
        defaultValues: {
            typeName: '',
            typeImage: null,
        },
    });

    const navigate = useNavigate();
    const [preview, setPreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const location = useLocation();
    console.log("🚀 ~ TypeCategoriesEdit ~ location:", location)
    const typeCategory = (location.state as { typeCategory?: TypeCategory })?.typeCategory;
    const id = typeCategory?._id || '';
    const categoriId = location.state?.id || '';

    // Fetch type category data if not provided via state
    useEffect(() => {
        const fetchTypeCategory = async () => {
            if (!id) {
                toast.error('No type category ID provided.', {
                    toastId: 'fetch-type-category-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate('/type/categories', { state: { id: categoriId } })
                return;
            }

            // If we already have the data from navigation state, use it
            if (typeCategory) {
                reset({
                    typeName: typeCategory.name,
                });
                setExistingImage(typeCategory.img);
                return;
            }

            try {
                const userDataString = localStorage.getItem('superAdminUser');
                const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
                const token = userData.token;

                if (!token) {
                    throw new Error('No authentication token found. Please log in.');
                }

                const response: AxiosResponse<ApiResponse<TypeCategory>> = await callApi(
                    `/admin/type-categories/single/${id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!response.data.success) {
                    throw new Error(response.data.message || 'Failed to fetch type category');
                }

                const categoryData = response.data.data;
                reset({
                    typeName: categoryData.name,
                });
                setExistingImage(categoryData.img);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch type category';
                console.error('Error fetching type category:', errorMessage);

                toast.error(errorMessage, {
                    toastId: 'fetch-type-category-error',
                    position: 'top-right',
                    autoClose: 3000,
                });

                if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
                    localStorage.removeItem('superAdminUser');
                    navigate('/admin/login');
                }
            }
        };

        fetchTypeCategory();
    }, [id, typeCategory, reset, navigate, categoriId]);

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
        if (!data.typeName.trim()) {
            toast.error('Please enter a type category name', {
                toastId: 'edit-type-category-error',
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
            formData.append('name', data.typeName);
            if (data.typeImage && data.typeImage.length > 0) {
                formData.append('img', data.typeImage[0]);
            }

            const response: AxiosResponse<ApiResponse<TypeCategory>> = await callApi(
                `/admin/type-categories/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: formData,
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to update type category');
            }

            toast.success(`Type category ${data.typeName} updated successfully!`, {
                toastId: 'edit-type-category-success',
                position: 'top-right',
                autoClose: 2000,
                onClose: () => navigate('/type/categories', { state: { id: categoriId } }),
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update type category';
            console.error('Error updating type category:', errorMessage);

            toast.error(errorMessage, {
                toastId: 'edit-type-category-error',
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
                        <h2 className="text-2xl font-bold text-gray-800">Edit Type Category</h2>
                        <NavigateBtn
                            to="/type/categories"
                            state={{ id: categoriId }}
                            label={
                                <>
                                    {/* Desktop / sm and up */}
                                    <span className="hidden sm:flex items-center gap-1">
                                        <ArrowBackIcon fontSize="small" />
                                        <span>Back to List</span>
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
                                Type Category Name
                            </label>
                            <input
                                id="typeName"
                                type="text"
                                {...register('typeName', {
                                    required: 'Type category name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.typeName ? 'border-red-400' : 'border-gray-300'
                                    }`}
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
                                Update Type Category Image (Optional)
                            </label>
                            <input
                                id="typeImage"
                                type="file"
                                accept="image/*"
                                {...register('typeImage')}
                                className={`block w-full px-3 py-2 border rounded-lg text-sm cursor-pointer focus:outline-none ${errors.typeImage ? 'border-red-400' : 'border-gray-300'
                                    }`}
                            />
                            {errors.typeImage && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.typeImage.message}
                                </p>
                            )}

                            {/* Single Image Preview */}
                            <div className="mt-3">
                                {(preview || existingImage) && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {preview ? "New Image Preview:" : "Current Image:"}
                                        </p>
                                        <img
                                            src={preview || existingImage || ''}
                                            alt={preview ? "Preview" : "Current"}
                                            className="h-32 w-32 object-cover rounded border"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <SubmitButton
                                label={isSubmitting ? 'Updating...' : 'Update Type Category'}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TypeCategoriesEdit;
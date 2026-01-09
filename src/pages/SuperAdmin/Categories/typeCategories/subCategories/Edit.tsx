import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import callApi from '../../../../../util/admin_api';
import { AxiosResponse } from 'axios';
import { CircularProgress } from '@mui/material';

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
    serves?: number;
    totalEnergy?: number;
    carbohydrate?: number;
    fat?: number;
    protein?: number;
    description: string;
    img?: string;
    price?: number;
    discount?: number;
    discountPrice?: number;
    bestSellers?: boolean;
    weight?: string;
    pieces?: string;
    quantity?: any[]; // From API example
    available?: boolean;
    isCommingSoon?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface FormInputs {
    subCategoryName: string;
    type: string;
    quality: string;
    unit: string;
    quantity: string;
    serves: string;
    totalEnergy: string;
    carbohydrate: string;
    fat: string;
    protein: string;
    description: string;
    subCategoryImage: FileList | null;
    price: string;
    discount: string;
    isCommingSoon: boolean;
    bestSellers: boolean;
    available: boolean;
}

interface UserData {
    token?: string;
}

// Utility function to normalize type tokens
const normalizeTypeTokens = (raw: any): string[] => {
    try {
        if (Array.isArray(raw)) {
            return raw.flatMap((item) => normalizeTypeTokens(item));
        }
        if (typeof raw === 'string') {
            const s = raw.trim();
            if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('"[') && s.endsWith(']"'))) {
                const parsed = JSON.parse(s.replace(/^"|"$/g, ''));
                return Array.isArray(parsed) ? normalizeTypeTokens(parsed) : [String(parsed)];
            }
            if (s.includes(',')) {
                return s.split(',').map((t) => t.trim()).filter(Boolean);
            }
            return [s];
        }
        if (raw == null) return [];
        return [String(raw)];
    } catch {
        return [String(raw)];
    }
};

const SubCategoriesEdit: React.FC = () => {
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
            unit: 'kg',
            quantity: '',
            serves: '',
            totalEnergy: '',
            carbohydrate: '',
            fat: '',
            protein: '',
            description: '',
            subCategoryImage: null,
            price: '',
            discount: '',
            isCommingSoon: false,
            bestSellers: false,
            available: true,
        },
    });

    const navigate = useNavigate();
    const { subCategoriesId: subCategoryId } = useParams<{ subCategoriesId: string }>();

    console.log("✅ subCategoryId:", subCategoryId);

    const location = useLocation();
    const [preview, setPreview] = useState<string | null>(null);
    const [types, setTypes] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [fetchedProduct, setFetchedProduct] = useState<SubCategory | null>(null);
    const typeId = location.state?.typeId;
    console.log("🚀 ~ SubCategoriesEdit ~ typeId:", typeId)
    const categoryId = location.state?.categoryId;
    console.log("🚀 ~ SubCategoriesEdit ~ categoryId:", categoryId)

    const watchedUnit = watch('unit');

    // Fetch subcategory details if not provided in state
    useEffect(() => {
        console.log("fkmkvnknkn");

        const fetchSubCategory = async () => {
            console.log("🚀 ~ fetchSubCategory ~ subCategoryId:", subCategoryId);

            if (!subCategoryId) {
                toast.error('No subcategory ID provided.', {
                    toastId: 'fetch-sub-category-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate('/sub-categories');
                return;
            }

            try {
                setLoading(true);
                const userDataString = localStorage.getItem('superAdminUser');
                const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
                const token = userData.token;
                if (!token) {
                    throw new Error('No authentication token found. Please log in.');
                }
                const response: AxiosResponse<ApiResponse<SubCategory>> = await callApi(
                    `/admin/sub-product-categories-details/${subCategoryId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                console.log("🚀 ~ fetchSubCategory ~ response:", response);
                if (!response.data.success) {
                    throw new Error(response.data.message || 'Failed to fetch subcategory');
                }
                const categoryData = response.data.data;
                console.log("🚀 ~ fetchSubCategory ~ categoryData:", categoryData)
                setFetchedProduct(categoryData);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subcategory';
                console.error('Error fetching subcategory:', errorMessage);
                toast.error(errorMessage, {
                    toastId: 'fetch-sub-category-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
                    localStorage.removeItem('superAdminUser');
                    navigate('/admin/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSubCategory();
    }, [subCategoryId, navigate]);

    // Initialize form with fetched product data
    useEffect(() => {
        if (fetchedProduct) {
            console.log("🚀 ~ Initialize form with product data:", fetchedProduct);
            setValue('subCategoryName', fetchedProduct.name || '');
            setValue('quality', fetchedProduct.quality || '');
            setValue('unit', fetchedProduct.unit || 'kg');
            const unitStr = (fetchedProduct.unit || '').toLowerCase();
            const isPieces = unitStr.includes('piece');
            setValue('quantity', isPieces ? (fetchedProduct.pieces ?? '').toString() : (fetchedProduct.weight ?? '').toString());
            setValue('serves', fetchedProduct.serves?.toString() || '');
            setValue('totalEnergy', fetchedProduct.totalEnergy?.toString() || '');
            setValue('carbohydrate', fetchedProduct.carbohydrate?.toString() || '');
            setValue('fat', fetchedProduct.fat?.toString() || '');
            setValue('protein', fetchedProduct.protein?.toString() || '');
            setValue('description', fetchedProduct.description || '');
            setValue('price', fetchedProduct.price?.toString() || '');
            setValue('discount', fetchedProduct.discount?.toString() || '');
            setValue('isCommingSoon', fetchedProduct.isCommingSoon || false);
            setValue('bestSellers', fetchedProduct.bestSellers || false);
            setValue('available', fetchedProduct.available || true);
            setTypes(normalizeTypeTokens(fetchedProduct.type) || []);
            setPreview(fetchedProduct.img && fetchedProduct.img.startsWith('http') ? fetchedProduct.img : null);
        }
    }, [fetchedProduct, setValue]);

    // Watch unit changes and adjust quantity validation/min
    useEffect(() => {
        if (watchedUnit) {
            const isPieces = watchedUnit.toLowerCase().includes('piece');
            const minValue = isPieces ? 1 : 0;
            const stepValue = 1; // Always whole numbers now

            // Dynamically update the quantity field validation
            setValue('quantity', (watch('quantity') || '').toString()); // Trigger re-render if needed

            // You can add dynamic validation here if needed, but for simplicity, we'll handle in input attributes
        }
    }, [watchedUnit, setValue, watch]);

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
        if (!subCategoryId) {
            toast.error('No subcategory ID provided.', {
                toastId: 'edit-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        // Validation
        const validations = [
            { condition: !data.subCategoryName.trim(), message: 'Please enter a subcategory name' },
            { condition: types.length === 0, message: 'Please add at least one type' },
            { condition: !data.quality.trim(), message: 'Please enter a quality' },
            { condition: !data.unit, message: 'Please select a unit' },
            { condition: !data.quantity.trim(), message: 'Please enter quantity' },
            { condition: !data.serves.trim(), message: 'Please enter the number of serves' },
            { condition: !data.totalEnergy.trim(), message: 'Please enter the total energy' },
            { condition: !data.carbohydrate.trim(), message: 'Please enter the carbohydrate amount' },
            { condition: !data.fat.trim(), message: 'Please enter the fat amount' },
            { condition: !data.protein.trim(), message: 'Please enter the protein amount' },
            { condition: !data.description.trim(), message: 'Please enter a description' },
            { condition: !data.price.trim(), message: 'Please enter the price' },
            { condition: !data.discount.trim(), message: 'Please enter the discount percentage' },
        ];
        for (const validation of validations) {
            if (validation.condition) {
                toast.error(validation.message, {
                    toastId: 'edit-sub-category-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }
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
            formData.append('unit', data.unit);
            if (data.quantity) {
                const unitStr = (data.unit || '').toLowerCase();
                if (unitStr.includes('piece')) {
                    formData.append('pieces', data.quantity);
                } else {
                    formData.append('weight', data.quantity);
                }
            }
            formData.append('serves', data.serves);
            formData.append('totalEnergy', data.totalEnergy);
            formData.append('carbohydrate', data.carbohydrate);
            formData.append('fat', data.fat);
            formData.append('protein', data.protein);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('discount', data.discount);
            formData.append('isCommingSoon', data.isCommingSoon.toString());
            formData.append('bestSellers', data.bestSellers.toString());
            formData.append('available', data.available.toString());
            if (data.subCategoryImage && data.subCategoryImage.length > 0) {
                formData.append('img', data.subCategoryImage[0]);
            }
            const response: AxiosResponse<ApiResponse<SubCategory>> = await callApi({
                url: `/admin/sub-product-categories/${subCategoryId}`,
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                data: formData,
            });
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to edit subcategory');
            }
            setFetchedProduct(response.data.data);
            toast.success(`Subcategory "${data.subCategoryName}" updated successfully!`, {
                toastId: 'edit-sub-category-success',
                position: 'top-right',
                autoClose: 2000,
                onClose: () => {
                    if (typeId) {
                        navigate(`/sub/categories/${typeId}`, { state: { typeId, categoryId } });
                    } else {
                        navigate(-1);
                    }
                },
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to edit subcategory';
            console.error('Error editing subcategory:', errorMessage);
            toast.error(errorMessage, {
                toastId: 'edit-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
                localStorage.removeItem('superAdminUser');
                navigate('/admin/login');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!fetchedProduct || !subCategoryId) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto max-w-md">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Subcategory not found</h3>
                    <p className="mt-1 text-sm text-gray-500">The subcategory you're looking for doesn't exist.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                        <h2 className="text-2xl font-bold text-gray-800">Edit Subcategory</h2>
                        <button
                            onClick={() => {
                                if (typeId) {
                                    navigate(`/sub/categories/${typeId}`, { state: { typeId, categoryId } });
                                } else {
                                    navigate(-1);
                                }
                            }}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                            <span className="hidden sm:flex items-center gap-1">
                                <ArrowBackIcon fontSize="small" />
                                <span>Back to List</span>
                            </span>
                            <span className="flex sm:hidden items-center gap-1">
                                <ClearIcon fontSize="small" />
                            </span>
                        </button>
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
                                    {...register('type')}
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
                                <option value="kg">kg</option>
                                <option value="gram">grams</option>
                                <option value="pieces">pieces</option>
                            </select>
                            {errors.unit && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.unit.message}
                                </p>
                            )}
                        </div>
                        {/* Quantity */}
                        <div>
                            <label
                                htmlFor="quantity"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                {(() => {
                                    switch (watchedUnit) {
                                        case 'pieces': return 'Pieces *';
                                        case 'kg': return 'Weight (kg) *';
                                        case 'gram': return 'Weight (g) *';
                                        default: return 'Quantity *';
                                    }
                                })()}
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                step={1}
                                min={watchedUnit?.toLowerCase().includes('piece') ? 1 : 0}
                                {...register('quantity', {
                                    required: 'Quantity is required',
                                    min: {
                                        value: watchedUnit?.toLowerCase().includes('piece') ? 1 : 0,
                                        message: watchedUnit?.toLowerCase().includes('piece') ? 'Pieces must be at least 1' : 'Quantity must be at least 0'
                                    },
                                    validate: (value) => {
                                        if (!Number.isInteger(Number(value))) {
                                            return 'Value must be a whole number';
                                        }
                                        return true;
                                    }
                                })}
                                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.quantity ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder={(() => {
                                    switch (watchedUnit) {
                                        case 'pieces': return 'Enter number of pieces (e.g., 5)';
                                        case 'kg': return 'Enter weight in kg (e.g., 1)';
                                        case 'gram': return 'Enter weight in g (e.g., 1000)';
                                        default: return 'Enter quantity (e.g., 1)';
                                    }
                                })()}
                                aria-invalid={errors.quantity ? 'true' : 'false'}
                            />
                            {errors.quantity && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.quantity.message}
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
                        {/* Coming Soon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Coming Soon
                            </label>
                            <input
                                type="checkbox"
                                {...register('isCommingSoon')}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                            />
                        </div>
                        {/* Best Sellers */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Best Sellers
                            </label>
                            <input
                                type="checkbox"
                                {...register('bestSellers')}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                            />
                        </div>
                        {/* Available */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Available
                            </label>
                            <input
                                type="checkbox"
                                {...register('available')}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                            />
                        </div> */}
                        {/* Subcategory Image Upload */}
                        <div>
                            <label
                                htmlFor="subCategoryImage"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Update Image (Optional)
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
                                    <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
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
                            <button
                                type="submit"
                                disabled={isSubmitting || !watch('subCategoryName').trim() || types.length === 0}
                                className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-semibold transition flex items-center gap-2"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Subcategory'}
                                <EditIcon fontSize="small" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SubCategoriesEdit;
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import callApi from '../../../../../util/admin_api';
import { AxiosResponse } from 'axios';

interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta: any | null;
}

interface SubCategory {
    _id: string;
    id: string;
    name: string;
    img?: string;
    description?: string;
    price?: number;
    discount?: number;
    discountPrice?: number;
    createdAt?: string;
    updatedAt?: string;
    unit?: string;
    weight?: string;
    pieces?: string;
    isBestSell?: boolean;
    bestSellers?: boolean;
}

interface UserData {
    token?: string;
}

const SubCategoriesDisplay: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const { id: paramId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const typeId = location.state?.typeId || paramId;
    const categoryId = location.state?.categoryId;

    // Extracted fetch function for reusability
    const fetchSubCategories = async () => {
        if (!typeId) {
            toast.error('Type ID is missing. Please try again.', {
                toastId: 'missing-type-id-error',
                position: 'top-right',
                autoClose: 3000,
            });
            navigate('/type/categories');
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
            const response: AxiosResponse<ApiResponse<{ subCategories: SubCategory[] }>> = await callApi(
                `/admin/sub-product-categories/${typeId}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.data.success || !Array.isArray(response.data.data.subCategories)) {
                throw new Error(response.data.message || 'Invalid API response format');
            }
            setSubCategories(
                response.data.data.subCategories.map((item) => ({
                    ...item,
                    isBestSell: item.isBestSell ?? false,
                }))
            );
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sub categories';
            toast.error(errorMessage, {
                toastId: 'fetch-sub-categories-error',
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

    useEffect(() => {
        fetchSubCategories();
    }, [navigate, typeId]);

    const handleEdit = (item: SubCategory) => {
        navigate(`/sub/categories/edit/${item.id}`, {
            state: { subCategory: item, typeId, categoryId },
        });
    };

    const handleView = (item: SubCategory) => {
        navigate(`/sub/categories/full-details/${item.id}`, {
            state: { subCategory: item, typeId, categoryId },
        });
    };

    const handleDelete = async (item: SubCategory) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);
        if (!confirmDelete) return;
        try {
            const userDataString = localStorage.getItem('superAdminUser');
            const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
            const token = userData.token;
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }
            const response: AxiosResponse<ApiResponse<unknown>> = await callApi(
                `/admin/sub-product-categories/${item.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to delete sub category');
            }
            // Reload the list after deletion
            await fetchSubCategories();
            toast.success('Sub category deleted successfully!', {
                toastId: 'delete-sub-category-success',
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete sub category';
            toast.error(errorMessage, {
                toastId: 'delete-sub-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
            if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
                localStorage.removeItem('superAdminUser');
                navigate('/admin/login');
            }
        }
    };

    const handleToggle = async (item: SubCategory) => {
        // Keep original value
        const originalBestSell = item.bestSellers;
        // Optimistic update
        setSubCategories((prev) =>
            prev.map((sc) =>
                sc.id === item.id ? { ...sc, bestSellers: !sc.bestSellers } : sc
            )
        );
        try {
            const userDataString = localStorage.getItem('superAdminUser');
            const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
            const token = userData.token;
            if (!token) throw new Error('No authentication token found. Please log in.');
            // API call
            const response: AxiosResponse<ApiResponse<{ bestSellers: boolean }>> = await callApi(
                `/admin/toggle-bestsell/${item.id}`,
                {
                    method: 'GET', // better than GET for updates
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!response.data.success) throw new Error(response.data.message || 'Failed to toggle best sell');
            // Sync state with backend response
            setSubCategories((prev) =>
                prev.map((sc) =>
                    sc.id === item.id ? { ...sc, bestSellers: response.data.data.bestSellers } : sc
                )
            );
            toast.success(
                `Sub category ${response.data.data.bestSellers ? 'marked as' : 'removed from'} best sell`,
                { toastId: `toggle-bestsell-${item.id}`, position: 'top-right', autoClose: 2000 }
            );
        } catch (error: unknown) {
            // Revert optimistic update
            setSubCategories((prev) =>
                prev.map((sc) =>
                    sc.id === item.id ? { ...sc, bestSellers: originalBestSell } : sc
                )
            );
            const errorMessage = error instanceof Error ? error.message : 'Failed to toggle best sell';
            toast.error(errorMessage, { toastId: `toggle-bestsell-error-${item.id}`, position: 'top-right', autoClose: 3000 });
            if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
                localStorage.removeItem('superAdminUser');
                navigate('/admin/login');
            }
        }
    };

    const openAdd = () => {
        navigate(`/sub/categories/add/${typeId}`, {
            state: { typeId, categoryId },
        });
    };

    const getSubCategoryImage = (subCategory: SubCategory): string | null => {
        if (subCategory.img && typeof subCategory.img === 'string' && subCategory.img.startsWith('http')) {
            return subCategory.img;
        }
        return null;
    };

    const getQuantity = (item: SubCategory): string => {
        const unitStr = (item.unit || '').toLowerCase();
        const isPiecesUnit = unitStr.includes('piece');
        const quantity = isPiecesUnit ? item.pieces ?? item.weight : item.weight;
        if (!quantity) return 'N/A';
        return isPiecesUnit
            ? `${quantity}pcs`
            : `${quantity}${unitStr.includes('kg') ? 'kg' : unitStr.includes('gram') ? 'gm' : unitStr.includes('liter') ? 'l' : ''}`;
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return subCategories;
        const term = search.toLowerCase();
        return subCategories.filter((s) => s.name?.toLowerCase().includes(term));
    }, [search, subCategories]);

    if (loading) {
        return (
            <div className="py-6 max-w-7xl mx-auto">
                <div className="mb-6 flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
                    <h1 className="text-2xl font-bold text-gray-800">Sub Categories</h1>
                    <button
                        onClick={openAdd}
                        className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition flex items-center"
                    >
                        <AddIcon fontSize="small" className="mr-2" />
                        Add
                    </button>
                </div>
                <div className="flex justify-center items-center h-64">
                    <CircularProgress className="text-rose-500" />
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
                className="z-[9999]"
            />
            <div className="py-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(`/type/categories/${categoryId}`, { state: { id: categoryId } })}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowBackIcon fontSize="small" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Sub Categories</h1>
                                <p className="text-sm text-gray-600">Manage sub categories for your products</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search subcategories..."
                                className="w-full sm:w-72 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            <button
                                onClick={openAdd}
                                className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition flex items-center"
                            >
                                <AddIcon fontSize="small" className="mr-2" />
                                Add
                            </button>
                        </div>
                    </div>
                </div>
                {filtered.length === 0 ? (
                    <Box className="text-center py-12">
                        <div className="mx-auto max-w-md">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No sub categories found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding your first sub category.</p>
                            <div className="mt-6">
                                <button
                                    onClick={openAdd}
                                    className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition"
                                >
                                    Add New Sub Category
                                </button>
                            </div>
                        </div>
                    </Box>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((item, index) => (
                            <div key={item._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative">
                                    <div className="w-full h-48 bg-gray-50 flex items-center justify-center">
                                        {getSubCategoryImage(item) ? (
                                            <img src={getSubCategoryImage(item)!} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-gray-500 text-sm">No Image</div>
                                        )}
                                    </div>
                                    {item.bestSellers && (
                                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                            Best Sell
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <span className="text-green-700 font-bold">₹{item.price ?? 'N/A'}</span>
                                            {item.discount && item.discount > 0 && (
                                                <span className="text-gray-400 line-through">₹{item.discountPrice ?? item.price}</span>
                                            )}
                                        </div>
                                        {item.discount && item.discount > 0 && (
                                            <span className="text-green-600 text-xs">Save {item.discount}%</span>
                                        )}
                                        <div className="text-xs">{getQuantity(item)}</div>
                                    </div>
                                    <div className="flex items-center gap-2 justify-between">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="View"
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </button>
                                            <button
                                                onClick={() => handleToggle(item)}
                                                className={`p-1 rounded ${item.bestSellers ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                                title={item.bestSellers ? 'Remove Best Sell' : 'Mark Best Sell'}
                                            >
                                                {item.bestSellers ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                title="Edit"
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default SubCategoriesDisplay;
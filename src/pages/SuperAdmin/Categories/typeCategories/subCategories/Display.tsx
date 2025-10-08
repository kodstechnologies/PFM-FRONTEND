import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
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

// Utility function to normalize type tokens
const normalizeTypeTokens = (raw: any): string[] => {
    if (!raw) return [];
    if (typeof raw === 'string') {
        const cleanText = raw
            .replace(/\\+/g, '')
            .replace(/"/g, '')
            .replace(/\[/g, '')
            .replace(/\]/g, '')
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0 && !s.match(/^[\[\]\\"]+$/));
        if (cleanText.length > 0) return cleanText;
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? normalizeTypeTokens(parsed) : [String(parsed)];
        } catch {
            return [raw];
        }
    }
    if (Array.isArray(raw)) {
        return raw.flatMap((item) => normalizeTypeTokens(item));
    }
    return [String(raw)];
};

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

interface FormState {
    name: string;
    quality: string;
    unit: string;
    weight: string;
    serves: string;
    totalEnergy: string;
    carbohydrate: string;
    fat: string;
    protein: string;
    description: string;
    price: string;
    discount: string;
    imgFile: File | null;
}

const SubCategoriesDisplay: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [selected, setSelected] = useState<SubCategory | null>(null);
    const [details, setDetails] = useState<any | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [typesText, setTypesText] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>({
        name: '',
        quality: '',
        unit: 'kg',
        weight: '',
        serves: '',
        totalEnergy: '',
        carbohydrate: '',
        fat: '',
        protein: '',
        description: '',
        price: '',
        discount: '',
        imgFile: null,
    });
    const [loading, setLoading] = useState(true);
    const { id: paramId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const typeId = location.state?.typeId || paramId;
    const categoryId = location.state?.categoryId;

    useEffect(() => {
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

        fetchSubCategories();
    }, [navigate, typeId]);

    const handleEdit = (item: SubCategory) => {
        navigate(`/sub/categories/edit`, {
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

            setSubCategories((prev) => prev.filter((sc) => sc.id !== item.id));
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


    const getSubCategoryImage = (subCategory: SubCategory): string | null => {
        if (subCategory.img && typeof subCategory.img === 'string' && subCategory.img.startsWith('http')) {
            return subCategory.img;
        }
        return null;
    };

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'Invalid Date';
        }
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

    const loadDetails = async (id: string) => {
        try {
            setDetailsLoading(true);
            const userDataString = localStorage.getItem('superAdminUser');
            const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
            const token = userData.token;
            if (!token) throw new Error('No authentication token found. Please log in.');

            const res: AxiosResponse<ApiResponse<any>> = await callApi({
                url: `/admin/sub-product-categories-details/${id}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch details');
            const d = res.data.data;
            setDetails(d);
            setPreviewImage(d.img && d.img.startsWith('http') ? d.img : null);
            const unitStr = (d?.unit || '').toString().toLowerCase();
            const piecesLike = unitStr.includes('piece');
            setForm({
                name: d.name || '',
                quality: d.quality || '',
                unit: d.unit || 'kg',
                weight: String(piecesLike ? (d.pieces ?? d.number ?? d.weight ?? '') : d.weight ?? ''),
                serves: String(d.serves ?? ''),
                totalEnergy: String(d.totalEnergy ?? ''),
                carbohydrate: String(d.carbohydrate ?? ''),
                fat: String(d.fat ?? ''),
                protein: String(d.protein ?? ''),
                description: d.description || '',
                price: String(d.price ?? ''),
                discount: String(d.discount ?? ''),
                imgFile: null,
            });
            const normalizedTypes = normalizeTypeTokens(d.type);
            setTypesText(normalizedTypes.join(', '));
        } catch (err: any) {
            toast.error(err?.message || 'Failed to load details', {
                toastId: `load-details-error-${id}`,
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setDetailsLoading(false);
        }
    };

    const openView = (item: SubCategory) => {
        setSelected(item);
        setViewOpen(true);
        loadDetails(item.id);
    };

    const openEdit = (item: SubCategory) => {
        setSelected(item);
        setEditOpen(true);
        loadDetails(item.id);
    };

    const openAdd = () => {
        setTypesText('');
        setPreviewImage(null);
        setForm({
            name: '',
            quality: '',
            unit: 'kg',
            weight: '',
            serves: '',
            totalEnergy: '',
            carbohydrate: '',
            fat: '',
            protein: '',
            description: '',
            price: '',
            discount: '',
            imgFile: null,
        });
        setSearch('');
        setAddOpen(true);
    };

    const submitEdit = async () => {
        if (!selected) return;
        try {
            setDetailsLoading(true);
            const userDataString = localStorage.getItem('superAdminUser');
            const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
            const token = userData.token;
            if (!token) throw new Error('No authentication token found. Please log in.');

            const types = typesText.split(',').map((t) => t.trim()).filter(Boolean);
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('type', JSON.stringify(types));
            formData.append('quality', form.quality);
            formData.append('unit', form.unit);
            if (form.weight) {
                const unitStr = (form.unit || '').toLowerCase();
                if (unitStr.includes('piece')) {
                    formData.append('pieces', form.weight);
                } else {
                    formData.append('weight', form.weight);
                }
            }
            if (form.serves) formData.append('serves', form.serves);
            formData.append('totalEnergy', form.totalEnergy || '0');
            formData.append('carbohydrate', form.carbohydrate || '0');
            formData.append('fat', form.fat || '0');
            formData.append('protein', form.protein || '0');
            formData.append('description', form.description);
            formData.append('price', form.price);
            formData.append('discount', form.discount || '0');
            if (form.imgFile) formData.append('img', form.imgFile);

            const res: AxiosResponse<ApiResponse<any>> = await callApi({
                url: `/admin/sub-product-categories/${selected.id}`,
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                data: formData,
            });

            if (!res.data.success) throw new Error(res.data.message || 'Failed to update');

            toast.success('Sub category updated', {
                toastId: `update-subcategory-${selected.id}`,
                position: 'top-right',
                autoClose: 2000,
            });
            setSubCategories((prev) =>
                prev.map((sc) =>
                    sc.id === selected.id
                        ? {
                            ...sc,
                            name: form.name || sc.name,
                            price: Number(form.price) || sc.price,
                            discount: Number(form.discount) || 0,
                            discountPrice: res.data.data?.discountPrice ?? sc.discountPrice,
                            img: res.data.data?.img || sc.img,
                            description: form.description || sc.description,
                            unit: form.unit || sc.unit,
                            weight: form.unit.toLowerCase().includes('piece') ? undefined : form.weight || sc.weight,
                            pieces: form.unit.toLowerCase().includes('piece') ? form.weight || sc.pieces : undefined,
                            updatedAt: new Date().toISOString(),
                        }
                        : sc
                )
            );
            setEditOpen(false);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update', {
                toastId: `update-subcategory-error-${selected.id}`,
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setDetailsLoading(false);
        }
    };

    const submitAdd = async () => {
        try {
            setDetailsLoading(true);
            const userDataString = localStorage.getItem('superAdminUser');
            const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
            const token = userData.token;
            if (!token) throw new Error('No authentication token found. Please log in.');
            if (!form.name.trim()) throw new Error('Subcategory name is required');
            if (!typeId) throw new Error('Type ID is missing');

            const types = typesText.split(',').map((t) => t.trim()).filter(Boolean);
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('type', JSON.stringify(types));
            formData.append('quality', form.quality);
            formData.append('unit', form.unit);
            if (form.weight) {
                const unitStr = (form.unit || '').toLowerCase();
                if (unitStr.includes('piece')) formData.append('pieces', form.weight);
                else formData.append('weight', form.weight);
            }
            if (form.serves) formData.append('serves', form.serves);
            formData.append('totalEnergy', form.totalEnergy || '0');
            formData.append('carbohydrate', form.carbohydrate || '0');
            formData.append('fat', form.fat || '0');
            formData.append('protein', form.protein || '0');
            formData.append('description', form.description);
            formData.append('price', form.price);
            formData.append('discount', form.discount || '0');
            if (form.imgFile) formData.append('img', form.imgFile);

            const res: AxiosResponse<ApiResponse<any>> = await callApi(
                `/admin/sub-product-categories/${typeId}`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    data: formData,
                }
            );

            if (!res.data.success) throw new Error(res.data.message || 'Failed to add');

            const newSubCategory: SubCategory = {
                _id: res.data.data?._id || Math.random().toString(36).slice(2),
                id: res.data.data?.id || res.data.data?._id || Math.random().toString(36).slice(2),
                name: form.name,
                img: res.data.data?.img || undefined,
                description: form.description || undefined,
                price: Number(form.price) || undefined,
                discount: Number(form.discount) || 0,
                discountPrice: res.data.data?.discountPrice || undefined,
                unit: form.unit || undefined,
                weight: form.unit.toLowerCase().includes('piece') ? undefined : form.weight || undefined,
                pieces: form.unit.toLowerCase().includes('piece') ? form.weight || undefined : undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isBestSell: false,
            };

            setSubCategories((prev) => [newSubCategory, ...prev]);
            toast.success('Sub category added', {
                toastId: `add-subcategory-${newSubCategory.id}`,
                position: 'top-right',
                autoClose: 2000,
            });
            setAddOpen(false);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to add', {
                toastId: 'add-subcategory-error',
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setDetailsLoading(false);
        }
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return subCategories;
        const term = search.toLowerCase();
        return subCategories.filter((s) => s.name?.toLowerCase().includes(term));
    }, [search, subCategories]);

    useEffect(() => {
        if (form.imgFile) {
            setPreviewImage(URL.createObjectURL(form.imgFile));
        } else if (details?.img && details.img.startsWith('http')) {
            setPreviewImage(details.img);
        } else {
            setPreviewImage(null);
        }
    }, [form.imgFile, details]);

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
                                onClick={() => navigate('/type/categories', { state: { id: categoryId } })}
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
                    <div className="overflow-x-auto border rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Price</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filtered.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-md overflow-hidden border bg-gray-50">
                                                {getSubCategoryImage(item) ? (
                                                    <img src={getSubCategoryImage(item)!} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <span className="text-green-700 font-bold">₹{item.price ?? 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <span className="text-green-700 font-bold">
                                                ₹{item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price ?? 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-center">
                                                <button
                                                    onClick={() => openView(item)}
                                                    className="inline-flex items-center gap-1 border rounded px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleToggle(item)}
                                                    className={`inline-flex items-center gap-1 border rounded px-3 py-1.5 text-xs transition-colors ${item.bestSellers ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-600 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    {item.bestSellers ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                                                    <span className="w-20">{item.bestSellers ? 'Best Sell' : 'Mark Best Sell'}</span>
                                                </button>
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="inline-flex items-center gap-1 border rounded px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 transition-colors"
                                                >
                                                    <EditIcon fontSize="small" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    className="inline-flex items-center gap-1 border rounded px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Dialog */}
            <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle className="bg-gradient-to-r from-rose-500 to-red-400 text-white">Sub Category Details</DialogTitle>
                <DialogContent dividers className="py-4">
                    {detailsLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <CircularProgress className="text-rose-500" />
                        </div>
                    ) : details ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <div className="w-full aspect-square border rounded-lg overflow-hidden bg-gray-50">
                                        {previewImage ? (
                                            <img src={previewImage} alt={details.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
                                        )}
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500 text-center">Image Preview</div>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="text-xl font-semibold">{details.name}</div>
                                        {details.discount && details.discount > 0 ? (
                                            <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 border border-green-200">
                                                {details.discount}% OFF
                                            </span>
                                        ) : null}
                                    </div>
                                    {details.type && (
                                        <div className="flex flex-wrap gap-2">
                                            {normalizeTypeTokens(details.type).map((t: string, i: number) => (
                                                <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {details.quality}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {details.discount && details.discount > 0 && details.discountPrice ? (
                                                <>
                                                    <span className="text-green-700 font-bold">₹{details.discountPrice}</span>
                                                    <span className="text-gray-400 line-through">₹{details.price}</span>
                                                </>
                                            ) : (
                                                <span className="text-green-700 font-bold">₹{details.price ?? 'N/A'}</span>
                                            )}
                                        </div>
                                    </div>
                                    {details.description && <div className="text-sm text-gray-700">{details.description}</div>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                                        {details.unit && (
                                            <div>
                                                <span className="font-medium">Unit:</span> {details.unit}
                                            </div>
                                        )}
                                        {(() => {
                                            const unitStr = (details?.unit || '').toString().toLowerCase();
                                            const isPiecesUnit = unitStr.includes('piece');
                                            const w = (details as any).weight;
                                            if (isPiecesUnit || typeof w === 'undefined' || String(w) === '') return null;
                                            let suffix = '';
                                            if (unitStr.includes('kg')) suffix = 'kg';
                                            else if (unitStr.includes('gram')) suffix = 'gm';
                                            else if (unitStr.includes('liter')) suffix = 'l';
                                            return (
                                                <div>
                                                    <span className="font-medium">Quantity:</span> {`${w}${suffix ? suffix : ''}`}
                                                </div>
                                            );
                                        })()}
                                        {(() => {
                                            const n = (details as any).number ?? (details as any).pieces ?? (details as any).weight;
                                            const isPiecesUnit = typeof details.unit === 'string' && details.unit.toLowerCase().includes('piece');
                                            return isPiecesUnit && n !== undefined && n !== null && String(n) !== '' ? (
                                                <div>
                                                    <span className="font-medium">Quantity:</span> {`${n}pcs`}
                                                </div>
                                            ) : null;
                                        })()}
                                        {typeof details.serves !== 'undefined' && (
                                            <div>
                                                <span className="font-medium">Serves:</span> {details.serves}
                                            </div>
                                        )}
                                        {typeof details.totalEnergy !== 'undefined' && (
                                            <div>
                                                <span className="font-medium">Energy:</span> {details.totalEnergy} kcal
                                            </div>
                                        )}
                                        {typeof details.carbohydrate !== 'undefined' && (
                                            <div>
                                                <span className="font-medium">Carbs:</span> {details.carbohydrate} g
                                            </div>
                                        )}
                                        {typeof details.fat !== 'undefined' && (
                                            <div>
                                                <span className="font-medium">Fat:</span> {details.fat} g
                                            </div>
                                        )}
                                        {typeof details.protein !== 'undefined' && (
                                            <div>
                                                <span className="font-medium">Protein:</span> {details.protein} g
                                            </div>
                                        )}
                                        {typeof details.discount !== 'undefined' && (
                                            <div>
                                                <span className="font-medium">Discount:</span> {details.discount}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {typeof details.totalEnergy !== 'undefined' && (
                                            <div className="bg-blue-50 rounded p-3 text-center">
                                                <div className="text-base font-semibold text-blue-700">{details.totalEnergy} kcal</div>
                                                <div className="text-xs text-blue-700/80">Total Energy</div>
                                            </div>
                                        )}
                                        {typeof details.carbohydrate !== 'undefined' && (
                                            <div className="bg-green-50 rounded p-3 text-center">
                                                <div className="text-base font-semibold text-green-700">{details.carbohydrate} g</div>
                                                <div className="text-xs text-green-700/80">Carbohydrates</div>
                                            </div>
                                        )}
                                        {typeof details.fat !== 'undefined' && (
                                            <div className="bg-yellow-50 rounded p-3 text-center">
                                                <div className="text-base font-semibold text-yellow-700">{details.fat} g</div>
                                                <div className="text-xs text-yellow-700/80">Fat</div>
                                            </div>
                                        )}
                                        {typeof details.protein !== 'undefined' && (
                                            <div className="bg-purple-50 rounded p-3 text-center">
                                                <div className="text-base font-semibold text-purple-700">{details.protein} g</div>
                                                <div className="text-xs text-purple-700/80">Protein</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">No details found.</div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setViewOpen(false)}
                        className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle className="bg-gradient-to-r from-rose-500 to-red-400 text-white">Edit Sub Category</DialogTitle>
                <DialogContent dividers className="py-4">
                    {detailsLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <CircularProgress className="text-rose-500" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    size="small"
                                    label="Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    size="small"
                                    label="Quality"
                                    value={form.quality}
                                    onChange={(e) => setForm({ ...form, quality: e.target.value })}
                                    fullWidth
                                />
                                <Select
                                    size="small"
                                    label="Unit"
                                    value={form.unit}
                                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                    fullWidth
                                >
                                    <MenuItem value="kg">kg</MenuItem>
                                    <MenuItem value="gram">grams</MenuItem>
                                    <MenuItem value="pieces">pieces</MenuItem>
                                    <MenuItem value="liters">liters</MenuItem>
                                </Select>
                                <TextField
                                    size="small"
                                    label="Quantity"
                                    value={form.weight}
                                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    size="small"
                                    type="number"
                                    label="Serves"
                                    value={form.serves}
                                    onChange={(e) => setForm({ ...form, serves: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    size="small"
                                    type="number"
                                    label="Total Energy"
                                    value={form.totalEnergy}
                                    onChange={(e) => setForm({ ...form, totalEnergy: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    size="small"
                                    type="number"
                                    label="Carbohydrate (g)"
                                    value={form.carbohydrate}
                                    onChange={(e) => setForm({ ...form, carbohydrate: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    size="small"
                                    type="number"
                                    label="Fat (g)"
                                    value={form.fat}
                                    onChange={(e) => setForm({ ...form, fat: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    size="small"
                                    type="number"
                                    label="Protein (g)"
                                    value={form.protein}
                                    onChange={(e) => setForm({ ...form, protein: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    size="small"
                                    type="number"
                                    label="Price"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    size="small"
                                    type="number"
                                    label="Discount (%)"
                                    value={form.discount}
                                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                    fullWidth
                                />
                            </div>
                            <TextField
                                size="small"
                                label="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                fullWidth
                                multiline
                                rows={3}
                            />
                            <TextField
                                size="small"
                                label="Types (comma separated)"
                                value={typesText}
                                onChange={(e) => setTypesText(e.target.value)}
                                fullWidth
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Update Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                                        setForm({ ...form, imgFile: file });
                                        setPreviewImage(file ? URL.createObjectURL(file) : details?.img && details.img.startsWith('http') ? details.img : null);
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-20 h-20 object-cover border rounded" />
                                    ) : (
                                        <div className="w-20 h-20 flex items-center justify-center border rounded bg-gray-50 text-gray-500 text-sm">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </div>
                            {selected && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-500 pt-2 border-t">
                                    {selected.createdAt && (
                                        <div className="flex flex-col">
                                            <span className="font-medium">Created:</span>
                                            <span>{formatDate(selected.createdAt)}</span>
                                        </div>
                                    )}
                                    {selected.updatedAt && (
                                        <div className="flex flex-col">
                                            <span className="font-medium">Last Updated:</span>
                                            <span>{formatDate(selected.updatedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setEditOpen(false)}
                        disabled={detailsLoading}
                        className="px-4 py-2 rounded text-gray-600 font-semibold border border-gray-300 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={submitEdit}
                        disabled={detailsLoading}
                        className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition"
                        startIcon={detailsLoading ? <CircularProgress size={16} className="text-white" /> : null}
                    >
                        {detailsLoading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Dialog */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle className="bg-gradient-to-r from-rose-500 to-red-400 text-white">Add Sub Category</DialogTitle>
                <DialogContent dividers className="py-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField
                                size="small"
                                label="Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                size="small"
                                label="Quality"
                                value={form.quality}
                                onChange={(e) => setForm({ ...form, quality: e.target.value })}
                                fullWidth
                            />
                            <Select
                                size="small"
                                label="Unit"
                                value={form.unit}
                                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value="kg">kg</MenuItem>
                                <MenuItem value="gram">grams</MenuItem>
                                <MenuItem value="pieces">pieces</MenuItem>
                                <MenuItem value="liters">liters</MenuItem>
                            </Select>
                            <TextField
                                size="small"
                                type="number"
                                label="Quantity"
                                value={form.weight}
                                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                size="small"
                                type="number"
                                label="Serves"
                                value={form.serves}
                                onChange={(e) => setForm({ ...form, serves: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                size="small"
                                type="number"
                                label="Total Energy"
                                value={form.totalEnergy}
                                onChange={(e) => setForm({ ...form, totalEnergy: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                size="small"
                                type="number"
                                label="Carbohydrate (g)"
                                value={form.carbohydrate}
                                onChange={(e) => setForm({ ...form, carbohydrate: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                size="small"
                                type="number"
                                label="Fat (g)"
                                value={form.fat}
                                onChange={(e) => setForm({ ...form, fat: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                size="small"
                                type="number"
                                label="Protein (g)"
                                value={form.protein}
                                onChange={(e) => setForm({ ...form, protein: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                size="small"
                                type="number"
                                label="Price"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                size="small"
                                type="number"
                                label="Discount (%)"
                                value={form.discount}
                                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                fullWidth
                            />
                        </div>
                        <TextField
                            size="small"
                            label="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            size="small"
                            label="Types (comma separated)"
                            value={typesText}
                            onChange={(e) => setTypesText(e.target.value)}
                            fullWidth
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                                    setForm({ ...form, imgFile: file });
                                    setPreviewImage(file ? URL.createObjectURL(file) : null);
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <div className="mt-2">
                                <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-20 h-20 object-cover border rounded" />
                                ) : (
                                    <div className="w-20 h-20 flex items-center justify-center border rounded bg-gray-50 text-gray-500 text-sm">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setAddOpen(false)}
                        disabled={detailsLoading}
                        className="px-4 py-2 rounded text-gray-600 font-semibold border border-gray-300 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={submitAdd}
                        disabled={detailsLoading}
                        className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition"
                        startIcon={detailsLoading ? <CircularProgress size={16} className="text-white" /> : null}
                    >
                        {detailsLoading ? 'Adding...' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SubCategoriesDisplay;

// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import StarIcon from '@mui/icons-material/Star';
// import StarBorderIcon from '@mui/icons-material/StarBorder';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import callApi from '../../../../../util/admin_api';
// import { AxiosResponse } from 'axios';

// // Utility function to normalize type tokens
// const normalizeTypeTokens = (raw: any): string[] => {
//     if (!raw) return [];
//     if (typeof raw === 'string') {
//         const cleanText = raw
//             .replace(/\\+/g, '')
//             .replace(/"/g, '')
//             .replace(/\[/g, '')
//             .replace(/\]/g, '')
//             .split(',')
//             .map((s) => s.trim())
//             .filter((s) => s.length > 0 && !s.match(/^[\[\]\\"]+$/));
//         if (cleanText.length > 0) return cleanText;
//         try {
//             const parsed = JSON.parse(raw);
//             return Array.isArray(parsed) ? normalizeTypeTokens(parsed) : [String(parsed)];
//         } catch {
//             return [raw];
//         }
//     }
//     if (Array.isArray(raw)) {
//         return raw.flatMap((item) => normalizeTypeTokens(item));
//     }
//     return [String(raw)];
// };

// interface ApiResponse<T> {
//     statusCode: number;
//     success: boolean;
//     message: string;
//     data: T;
//     meta: any | null;
// }

// interface SubCategory {
//     _id: string;
//     id: string;
//     name: string;
//     img?: string;
//     description?: string;
//     price?: number;
//     discount?: number;
//     discountPrice?: number;
//     createdAt?: string;
//     updatedAt?: string;
//     unit?: string;
//     weight?: string;
//     pieces?: string;
//     isBestSell?: boolean;
//     bestSellers?: boolean;
// }

// interface UserData {
//     token?: string;
// }

// interface FormState {
//     name: string;
//     quality: string;
//     unit: string;
//     weight: string;
//     serves: string;
//     totalEnergy: string;
//     carbohydrate: string;
//     fat: string;
//     protein: string;
//     description: string;
//     price: string;
//     discount: string;
//     imgFile: File | null;
// }

// const SubCategoriesDisplay: React.FC = () => {
//     const [search, setSearch] = useState<string>('');
//     const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//     const [viewOpen, setViewOpen] = useState(false);
//     const [editOpen, setEditOpen] = useState(false);
//     const [addOpen, setAddOpen] = useState(false);
//     const [selected, setSelected] = useState<SubCategory | null>(null);
//     const [details, setDetails] = useState<any | null>(null);
//     const [detailsLoading, setDetailsLoading] = useState(false);
//     const [typesText, setTypesText] = useState<string>('');
//     const [previewImage, setPreviewImage] = useState<string | null>(null);
//     const [form, setForm] = useState<FormState>({
//         name: '',
//         quality: '',
//         unit: 'kg',
//         weight: '',
//         serves: '',
//         totalEnergy: '',
//         carbohydrate: '',
//         fat: '',
//         protein: '',
//         description: '',
//         price: '',
//         discount: '',
//         imgFile: null,
//     });
//     const [loading, setLoading] = useState(true);
//     const { id: paramId } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const typeId = location.state?.typeId || paramId;
//     const categoryId = location.state?.categoryId;

//     useEffect(() => {
//         const fetchSubCategories = async () => {
//             if (!typeId) {
//                 toast.error('Type ID is missing. Please try again.', {
//                     toastId: 'missing-type-id-error',
//                     position: 'top-right',
//                     autoClose: 3000,
//                 });
//                 navigate('/type/categories');
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 const userDataString = localStorage.getItem('superAdminUser');
//                 const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
//                 const token = userData.token;

//                 if (!token) {
//                     throw new Error('No authentication token found. Please log in.');
//                 }

//                 const response: AxiosResponse<ApiResponse<{ subCategories: SubCategory[] }>> = await callApi(
//                     `/admin/sub-product-categories/${typeId}`,
//                     {
//                         method: 'GET',
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 if (!response.data.success || !Array.isArray(response.data.data.subCategories)) {
//                     throw new Error(response.data.message || 'Invalid API response format');
//                 }

//                 setSubCategories(
//                     response.data.data.subCategories.map((item) => ({
//                         ...item,
//                         isBestSell: item.isBestSell ?? false,
//                     }))
//                 );
//             } catch (error: unknown) {
//                 const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sub categories';
//                 toast.error(errorMessage, {
//                     toastId: 'fetch-sub-categories-error',
//                     position: 'top-right',
//                     autoClose: 3000,
//                 });

//                 if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
//                     localStorage.removeItem('superAdminUser');
//                     navigate('/admin/login');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSubCategories();
//     }, [navigate, typeId]);

//     const handleEdit = (item: SubCategory) => {
//         navigate(`/sub/categories/edit`, {
//             state: { subCategory: item, typeId, categoryId },
//         });
//     };

//     const handleDelete = async (item: SubCategory) => {
//         const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);
//         if (!confirmDelete) return;

//         try {
//             const userDataString = localStorage.getItem('superAdminUser');
//             const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
//             const token = userData.token;

//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }

//             const response: AxiosResponse<ApiResponse<unknown>> = await callApi(
//                 `/admin/sub-product-categories/${item.id}`,
//                 {
//                     method: 'DELETE',
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             if (!response.data.success) {
//                 throw new Error(response.data.message || 'Failed to delete sub category');
//             }

//             setSubCategories((prev) => prev.filter((sc) => sc.id !== item.id));
//             toast.success('Sub category deleted successfully!', {
//                 toastId: 'delete-sub-category-success',
//                 position: 'top-right',
//                 autoClose: 2000,
//             });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'Failed to delete sub category';
//             toast.error(errorMessage, {
//                 toastId: 'delete-sub-category-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });

//             if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
//                 localStorage.removeItem('superAdminUser');
//                 navigate('/admin/login');
//             }
//         }
//     };

//     const handleToggle = async (item: SubCategory) => {
//         // Keep original value
//         const originalBestSell = item.bestSellers;

//         // Optimistic update
//         setSubCategories((prev) =>
//             prev.map((sc) =>
//                 sc.id === item.id ? { ...sc, bestSellers: !sc.bestSellers } : sc
//             )
//         );

//         try {
//             const userDataString = localStorage.getItem('superAdminUser');
//             const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
//             const token = userData.token;

//             if (!token) throw new Error('No authentication token found. Please log in.');

//             // API call
//             const response: AxiosResponse<ApiResponse<{ bestSellers: boolean }>> = await callApi(
//                 `/admin/toggle-bestsell/${item.id}`,
//                 {
//                     method: 'GET', // better than GET for updates
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );

//             if (!response.data.success) throw new Error(response.data.message || 'Failed to toggle best sell');

//             // Sync state with backend response
//             setSubCategories((prev) =>
//                 prev.map((sc) =>
//                     sc.id === item.id ? { ...sc, bestSellers: response.data.data.bestSellers } : sc
//                 )
//             );

//             toast.success(
//                 `Sub category ${response.data.data.bestSellers ? 'marked as' : 'removed from'} best sell`,
//                 { toastId: `toggle-bestsell-${item.id}`, position: 'top-right', autoClose: 2000 }
//             );
//         } catch (error: unknown) {
//             // Revert optimistic update
//             setSubCategories((prev) =>
//                 prev.map((sc) =>
//                     sc.id === item.id ? { ...sc, bestSellers: originalBestSell } : sc
//                 )
//             );

//             const errorMessage = error instanceof Error ? error.message : 'Failed to toggle best sell';
//             toast.error(errorMessage, { toastId: `toggle-bestsell-error-${item.id}`, position: 'top-right', autoClose: 3000 });

//             if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
//                 localStorage.removeItem('superAdminUser');
//                 navigate('/admin/login');
//             }
//         }
//     };


//     const getSubCategoryImage = (subCategory: SubCategory): string | null => {
//         if (subCategory.img && typeof subCategory.img === 'string' && subCategory.img.startsWith('http')) {
//             return subCategory.img;
//         }
//         return null;
//     };

//     const formatDate = (dateString: string | undefined): string => {
//         if (!dateString) return 'N/A';
//         try {
//             const date = new Date(dateString);
//             return date.toLocaleString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//             });
//         } catch {
//             return 'Invalid Date';
//         }
//     };

//     const getQuantity = (item: SubCategory): string => {
//         const unitStr = (item.unit || '').toLowerCase();
//         const isPiecesUnit = unitStr.includes('piece');
//         const quantity = isPiecesUnit ? item.pieces ?? item.weight : item.weight;
//         if (!quantity) return 'N/A';
//         return isPiecesUnit
//             ? `${quantity}pcs`
//             : `${quantity}${unitStr.includes('kg') ? 'kg' : unitStr.includes('gram') ? 'gm' : unitStr.includes('liter') ? 'l' : ''}`;
//     };

//     const loadDetails = async (id: string) => {
//         try {
//             setDetailsLoading(true);
//             const userDataString = localStorage.getItem('superAdminUser');
//             const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
//             const token = userData.token;
//             if (!token) throw new Error('No authentication token found. Please log in.');

//             const res: AxiosResponse<ApiResponse<any>> = await callApi({
//                 url: `/admin/sub-product-categories-details/${id}`,
//                 method: 'GET',
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch details');
//             const d = res.data.data;
//             setDetails(d);
//             setPreviewImage(d.img && d.img.startsWith('http') ? d.img : null);
//             const unitStr = (d?.unit || '').toString().toLowerCase();
//             const piecesLike = unitStr.includes('piece');
//             setForm({
//                 name: d.name || '',
//                 quality: d.quality || '',
//                 unit: d.unit || 'kg',
//                 weight: String(piecesLike ? (d.pieces ?? d.number ?? d.weight ?? '') : d.weight ?? ''),
//                 serves: String(d.serves ?? ''),
//                 totalEnergy: String(d.totalEnergy ?? ''),
//                 carbohydrate: String(d.carbohydrate ?? ''),
//                 fat: String(d.fat ?? ''),
//                 protein: String(d.protein ?? ''),
//                 description: d.description || '',
//                 price: String(d.price ?? ''),
//                 discount: String(d.discount ?? ''),
//                 imgFile: null,
//             });
//             const normalizedTypes = normalizeTypeTokens(d.type);
//             setTypesText(normalizedTypes.join(', '));
//         } catch (err: any) {
//             toast.error(err?.message || 'Failed to load details', {
//                 toastId: `load-details-error-${id}`,
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//         } finally {
//             setDetailsLoading(false);
//         }
//     };

//     const openView = (item: SubCategory) => {
//         setSelected(item);
//         setViewOpen(true);
//         loadDetails(item.id);
//     };

//     const openEdit = (item: SubCategory) => {
//         setSelected(item);
//         setEditOpen(true);
//         loadDetails(item.id);
//     };

//     const openAdd = () => {
//         setTypesText('');
//         setPreviewImage(null);
//         setForm({
//             name: '',
//             quality: '',
//             unit: 'kg',
//             weight: '',
//             serves: '',
//             totalEnergy: '',
//             carbohydrate: '',
//             fat: '',
//             protein: '',
//             description: '',
//             price: '',
//             discount: '',
//             imgFile: null,
//         });
//         setSearch('');
//         setAddOpen(true);
//     };

//     const submitEdit = async () => {
//         if (!selected) return;
//         try {
//             setDetailsLoading(true);
//             const userDataString = localStorage.getItem('superAdminUser');
//             const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
//             const token = userData.token;
//             if (!token) throw new Error('No authentication token found. Please log in.');

//             const types = typesText.split(',').map((t) => t.trim()).filter(Boolean);
//             if (types.length === 0) throw new Error('At least one type is required');
//             const formData = new FormData();
//             formData.append('name', form.name);
//             formData.append('type', JSON.stringify(types));
//             formData.append('quality', form.quality);
//             formData.append('unit', form.unit);
//             if (form.weight) {
//                 const unitStr = (form.unit || '').toLowerCase();
//                 if (unitStr.includes('piece')) {
//                     formData.append('pieces', form.weight);
//                 } else {
//                     formData.append('weight', form.weight);
//                 }
//             }
//             if (form.serves) formData.append('serves', form.serves);
//             formData.append('totalEnergy', form.totalEnergy || '0');
//             formData.append('carbohydrate', form.carbohydrate || '0');
//             formData.append('fat', form.fat || '0');
//             formData.append('protein', form.protein || '0');
//             formData.append('description', form.description);
//             formData.append('price', form.price);
//             formData.append('discount', form.discount || '0');
//             if (form.imgFile) formData.append('img', form.imgFile);

//             const res: AxiosResponse<ApiResponse<any>> = await callApi({
//                 url: `/admin/sub-product-categories/${selected.id}`,
//                 method: 'PATCH',
//                 headers: { Authorization: `Bearer ${token}` },
//                 data: formData,
//             });

//             if (!res.data.success) throw new Error(res.data.message || 'Failed to update');

//             toast.success('Sub category updated', {
//                 toastId: `update-subcategory-${selected.id}`,
//                 position: 'top-right',
//                 autoClose: 2000,
//             });
//             setSubCategories((prev) =>
//                 prev.map((sc) =>
//                     sc.id === selected.id
//                         ? {
//                             ...sc,
//                             name: form.name || sc.name,
//                             price: Number(form.price) || sc.price,
//                             discount: Number(form.discount) || 0,
//                             discountPrice: res.data.data?.discountPrice ?? sc.discountPrice,
//                             img: res.data.data?.img || sc.img,
//                             description: form.description || sc.description,
//                             unit: form.unit || sc.unit,
//                             weight: form.unit.toLowerCase().includes('piece') ? undefined : form.weight || sc.weight,
//                             pieces: form.unit.toLowerCase().includes('piece') ? form.weight || sc.pieces : undefined,
//                             updatedAt: new Date().toISOString(),
//                         }
//                         : sc
//                 )
//             );
//             setEditOpen(false);
//         } catch (err: any) {
//             toast.error(err?.message || 'Failed to update', {
//                 toastId: `update-subcategory-error-${selected.id}`,
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//         } finally {
//             setDetailsLoading(false);
//         }
//     };

//     const submitAdd = async () => {
//         try {
//             setDetailsLoading(true);
//             const userDataString = localStorage.getItem('superAdminUser');
//             const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
//             const token = userData.token;
//             if (!token) throw new Error('No authentication token found. Please log in.');
//             if (!form.name.trim()) throw new Error('Subcategory name is required');
//             if (!typeId) throw new Error('Type ID is missing');

//             const types = typesText.split(',').map((t) => t.trim()).filter(Boolean);
//             if (types.length === 0) throw new Error('At least one type is required (comma-separated)');
//             const formData = new FormData();
//             formData.append('name', form.name);
//             formData.append('type', JSON.stringify(types));
//             formData.append('quality', form.quality);
//             formData.append('unit', form.unit);
//             if (form.weight) {
//                 const unitStr = (form.unit || '').toLowerCase();
//                 if (unitStr.includes('piece')) formData.append('pieces', form.weight);
//                 else formData.append('weight', form.weight);
//             }
//             if (form.serves) formData.append('serves', form.serves);
//             formData.append('totalEnergy', form.totalEnergy || '0');
//             formData.append('carbohydrate', form.carbohydrate || '0');
//             formData.append('fat', form.fat || '0');
//             formData.append('protein', form.protein || '0');
//             formData.append('description', form.description);
//             formData.append('price', form.price);
//             formData.append('discount', form.discount || '0');
//             if (form.imgFile) formData.append('img', form.imgFile);

//             const res: AxiosResponse<ApiResponse<any>> = await callApi(
//                 `/admin/sub-product-categories/${typeId}`,
//                 {
//                     method: 'POST',
//                     headers: { Authorization: `Bearer ${token}` },
//                     data: formData,
//                 }
//             );

//             if (!res.data.success) throw new Error(res.data.message || 'Failed to add');

//             const newSubCategory: SubCategory = {
//                 _id: res.data.data?._id || Math.random().toString(36).slice(2),
//                 id: res.data.data?.id || res.data.data?._id || Math.random().toString(36).slice(2),
//                 name: form.name,
//                 img: res.data.data?.img || undefined,
//                 description: form.description || undefined,
//                 price: Number(form.price) || undefined,
//                 discount: Number(form.discount) || 0,
//                 discountPrice: res.data.data?.discountPrice || undefined,
//                 unit: form.unit || undefined,
//                 weight: form.unit.toLowerCase().includes('piece') ? undefined : form.weight || undefined,
//                 pieces: form.unit.toLowerCase().includes('piece') ? form.weight || undefined : undefined,
//                 createdAt: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//                 isBestSell: false,
//             };

//             setSubCategories((prev) => [newSubCategory, ...prev]);
//             toast.success('Sub category added', {
//                 toastId: `add-subcategory-${newSubCategory.id}`,
//                 position: 'top-right',
//                 autoClose: 2000,
//             });
//             setAddOpen(false);
//         } catch (err: any) {
//             toast.error(err?.message || 'Failed to add', {
//                 toastId: 'add-subcategory-error',
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
//         } finally {
//             setDetailsLoading(false);
//         }
//     };

//     const filtered = useMemo(() => {
//         if (!search.trim()) return subCategories;
//         const term = search.toLowerCase();
//         return subCategories.filter((s) => s.name?.toLowerCase().includes(term));
//     }, [search, subCategories]);

//     useEffect(() => {
//         if (form.imgFile) {
//             setPreviewImage(URL.createObjectURL(form.imgFile));
//         } else if (details?.img && details.img.startsWith('http')) {
//             setPreviewImage(details.img);
//         } else {
//             setPreviewImage(null);
//         }
//     }, [form.imgFile, details]);

//     if (loading) {
//         return (
//             <div className="py-6 max-w-7xl mx-auto">
//                 <div className="mb-6 flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
//                     <h1 className="text-2xl font-bold text-gray-800">Sub Categories</h1>
//                     <button
//                         onClick={openAdd}
//                         className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition flex items-center"
//                     >
//                         <AddIcon fontSize="small" className="mr-2" />
//                         Add
//                     </button>
//                 </div>
//                 <div className="flex justify-center items-center h-64">
//                     <CircularProgress className="text-rose-500" />
//                 </div>
//             </div>
//         );
//     }

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
//                 className="z-[9999]"
//             />
//             <div className="py-6 max-w-7xl mx-auto">
//                 <div className="mb-8">
//                     <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
//                         <div className="flex items-center gap-4">
//                             <button
//                                 onClick={() => navigate('/type/categories', { state: { id: categoryId } })}
//                                 className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
//                             >
//                                 <ArrowBackIcon fontSize="small" />
//                             </button>
//                             <div>
//                                 <h1 className="text-2xl font-bold text-gray-800">Sub Categories</h1>
//                                 <p className="text-sm text-gray-600">Manage sub categories for your products</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-3 w-full sm:w-auto">
//                             <input
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 placeholder="Search subcategories..."
//                                 className="w-full sm:w-72 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
//                             />
//                             <button
//                                 onClick={openAdd}
//                                 className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition flex items-center"
//                             >
//                                 <AddIcon fontSize="small" className="mr-2" />
//                                 Add
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {filtered.length === 0 ? (
//                     <Box className="text-center py-12">
//                         <div className="mx-auto max-w-md">
//                             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={1}
//                                     d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                 />
//                             </svg>
//                             <h3 className="mt-2 text-lg font-medium text-gray-900">No sub categories found</h3>
//                             <p className="mt-1 text-sm text-gray-500">Get started by adding your first sub category.</p>
//                             <div className="mt-6">
//                                 <button
//                                     onClick={openAdd}
//                                     className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition"
//                                 >
//                                     Add New Sub Category
//                                 </button>
//                             </div>
//                         </div>
//                     </Box>
//                 ) : (
//                     <div className="overflow-x-auto border rounded-lg shadow-sm">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL No.</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Price</th>
//                                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {filtered.map((item, index) => (
//                                     <tr key={item._id} className="hover:bg-gray-50 transition-colors">
//                                         <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
//                                         <td className="px-6 py-4">
//                                             <div className="w-12 h-12 rounded-md overflow-hidden border bg-gray-50">
//                                                 {getSubCategoryImage(item) ? (
//                                                     <img src={getSubCategoryImage(item)!} alt={item.name} className="w-full h-full object-cover" />
//                                                 ) : (
//                                                     <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
//                                                 )}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
//                                         <td className="px-6 py-4 text-sm text-gray-500">
//                                             <span className="text-green-700 font-bold">₹{item.price ?? 'N/A'}</span>
//                                         </td>
//                                         <td className="px-6 py-4 text-sm text-gray-500">
//                                             <span className="text-green-700 font-bold">
//                                                 ₹{item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price ?? 'N/A'}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <div className="flex items-center gap-2 justify-center">
//                                                 <button
//                                                     onClick={() => openView(item)}
//                                                     className="inline-flex items-center gap-1 border rounded px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 transition-colors"
//                                                 >
//                                                     <VisibilityIcon fontSize="small" />
//                                                     View
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleToggle(item)}
//                                                     className={`inline-flex items-center gap-1 border rounded px-3 py-1.5 text-xs transition-colors ${item.bestSellers ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-600 hover:bg-blue-50'
//                                                         }`}
//                                                 >
//                                                     {item.bestSellers ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
//                                                     <span className="w-20">{item.bestSellers ? 'Best Sell' : 'Mark Best Sell'}</span>
//                                                 </button>
//                                                 <button
//                                                     onClick={() => openEdit(item)}
//                                                     className="inline-flex items-center gap-1 border rounded px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 transition-colors"
//                                                 >
//                                                     <EditIcon fontSize="small" />
//                                                     Edit
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDelete(item)}
//                                                     className="inline-flex items-center gap-1 border rounded px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
//                                                 >
//                                                     <DeleteIcon fontSize="small" />
//                                                     Delete
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* View Dialog */}
//             <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
//                 <DialogTitle className="bg-gradient-to-r from-rose-500 to-red-400 text-white">Sub Category Details</DialogTitle>
//                 <DialogContent dividers className="py-4">
//                     {detailsLoading ? (
//                         <div className="flex justify-center items-center py-10">
//                             <CircularProgress className="text-rose-500" />
//                         </div>
//                     ) : details ? (
//                         <div className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                 <div className="md:col-span-1">
//                                     <div className="w-full aspect-square border rounded-lg overflow-hidden bg-gray-50">
//                                         {previewImage ? (
//                                             <img src={previewImage} alt={details.name} className="w-full h-full object-contain" />
//                                         ) : (
//                                             <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
//                                         )}
//                                     </div>
//                                     <div className="mt-3 text-xs text-gray-500 text-center">Image Preview</div>
//                                 </div>
//                                 <div className="md:col-span-2 space-y-3">
//                                     <div className="flex items-start justify-between gap-2">
//                                         <div className="text-xl font-semibold">{details.name}</div>
//                                         {details.discount && details.discount > 0 ? (
//                                             <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 border border-green-200">
//                                                 {details.discount}% OFF
//                                             </span>
//                                         ) : null}
//                                     </div>
//                                     {details.type && (
//                                         <div className="flex flex-wrap gap-2">
//                                             {normalizeTypeTokens(details.type).map((t: string, i: number) => (
//                                                 <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">
//                                                     {t}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     )}
//                                     <div className="flex items-center gap-3">
//                                         <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
//                                             {details.quality}
//                                         </span>
//                                         <div className="flex items-center gap-2">
//                                             {details.discount && details.discount > 0 && details.discountPrice ? (
//                                                 <>
//                                                     <span className="text-green-700 font-bold">₹{details.discountPrice}</span>
//                                                     <span className="text-gray-400 line-through">₹{details.price}</span>
//                                                 </>
//                                             ) : (
//                                                 <span className="text-green-700 font-bold">₹{details.price ?? 'N/A'}</span>
//                                             )}
//                                         </div>
//                                     </div>
//                                     {details.description && <div className="text-sm text-gray-700">{details.description}</div>}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
//                                         {details.unit && (
//                                             <div>
//                                                 <span className="font-medium">Unit:</span> {details.unit}
//                                             </div>
//                                         )}
//                                         {(() => {
//                                             const unitStr = (details?.unit || '').toString().toLowerCase();
//                                             const isPiecesUnit = unitStr.includes('piece');
//                                             const w = (details as any).weight;
//                                             if (isPiecesUnit || typeof w === 'undefined' || String(w) === '') return null;
//                                             let suffix = '';
//                                             if (unitStr.includes('kg')) suffix = 'kg';
//                                             else if (unitStr.includes('gram')) suffix = 'gm';
//                                             else if (unitStr.includes('liter')) suffix = 'l';
//                                             return (
//                                                 <div>
//                                                     <span className="font-medium">Quantity:</span> {`${w}${suffix ? suffix : ''}`}
//                                                 </div>
//                                             );
//                                         })()}
//                                         {(() => {
//                                             const n = (details as any).number ?? (details as any).pieces ?? (details as any).weight;
//                                             const isPiecesUnit = typeof details.unit === 'string' && details.unit.toLowerCase().includes('piece');
//                                             return isPiecesUnit && n !== undefined && n !== null && String(n) !== '' ? (
//                                                 <div>
//                                                     <span className="font-medium">Quantity:</span> {`${n}pcs`}
//                                                 </div>
//                                             ) : null;
//                                         })()}
//                                         {typeof details.serves !== 'undefined' && (
//                                             <div>
//                                                 <span className="font-medium">Serves:</span> {details.serves}
//                                             </div>
//                                         )}
//                                         {typeof details.totalEnergy !== 'undefined' && (
//                                             <div>
//                                                 <span className="font-medium">Energy:</span> {details.totalEnergy} kcal
//                                             </div>
//                                         )}
//                                         {typeof details.carbohydrate !== 'undefined' && (
//                                             <div>
//                                                 <span className="font-medium">Carbs:</span> {details.carbohydrate} g
//                                             </div>
//                                         )}
//                                         {typeof details.fat !== 'undefined' && (
//                                             <div>
//                                                 <span className="font-medium">Fat:</span> {details.fat} g
//                                             </div>
//                                         )}
//                                         {typeof details.protein !== 'undefined' && (
//                                             <div>
//                                                 <span className="font-medium">Protein:</span> {details.protein} g
//                                             </div>
//                                         )}
//                                         {typeof details.discount !== 'undefined' && (
//                                             <div>
//                                                 <span className="font-medium">Discount:</span> {details.discount}%
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                                         {typeof details.totalEnergy !== 'undefined' && (
//                                             <div className="bg-blue-50 rounded p-3 text-center">
//                                                 <div className="text-base font-semibold text-blue-700">{details.totalEnergy} kcal</div>
//                                                 <div className="text-xs text-blue-700/80">Total Energy</div>
//                                             </div>
//                                         )}
//                                         {typeof details.carbohydrate !== 'undefined' && (
//                                             <div className="bg-green-50 rounded p-3 text-center">
//                                                 <div className="text-base font-semibold text-green-700">{details.carbohydrate} g</div>
//                                                 <div className="text-xs text-green-700/80">Carbohydrates</div>
//                                             </div>
//                                         )}
//                                         {typeof details.fat !== 'undefined' && (
//                                             <div className="bg-yellow-50 rounded p-3 text-center">
//                                                 <div className="text-base font-semibold text-yellow-700">{details.fat} g</div>
//                                                 <div className="text-xs text-yellow-700/80">Fat</div>
//                                             </div>
//                                         )}
//                                         {typeof details.protein !== 'undefined' && (
//                                             <div className="bg-purple-50 rounded p-3 text-center">
//                                                 <div className="text-base font-semibold text-purple-700">{details.protein} g</div>
//                                                 <div className="text-xs text-purple-700/80">Protein</div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="text-sm text-gray-500">No details found.</div>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         onClick={() => setViewOpen(false)}
//                         className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition"
//                     >
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Edit Dialog */}
//             <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
//                 <DialogTitle className="bg-gradient-to-r from-rose-500 to-red-400 text-white">Edit Sub Category</DialogTitle>
//                 <DialogContent dividers className="py-4">
//                     {detailsLoading ? (
//                         <div className="flex justify-center items-center py-10">
//                             <CircularProgress className="text-rose-500" />
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <TextField
//                                     size="small"
//                                     label="Name"
//                                     value={form.name}
//                                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                                     fullWidth
//                                 />
//                                 <TextField
//                                     size="small"
//                                     label="Quality"
//                                     value={form.quality}
//                                     onChange={(e) => setForm({ ...form, quality: e.target.value })}
//                                     fullWidth
//                                 />
//                                 <Select
//                                     size="small"
//                                     label="Unit"
//                                     value={form.unit}
//                                     onChange={(e) => setForm({ ...form, unit: e.target.value })}
//                                     fullWidth
//                                 >
//                                     <MenuItem value="kg">kg</MenuItem>
//                                     <MenuItem value="gram">grams</MenuItem>
//                                     <MenuItem value="pieces">pieces</MenuItem>
//                                     <MenuItem value="liters">liters</MenuItem>
//                                 </Select>
//                                 <TextField
//                                     size="small"
//                                     label="Quantity"
//                                     value={form.weight}
//                                     onChange={(e) => setForm({ ...form, weight: e.target.value })}
//                                     fullWidth
//                                 />
//                                 <TextField
//                                     size="small"
//                                     type="number"
//                                     label="Serves"
//                                     value={form.serves}
//                                     onChange={(e) => setForm({ ...form, serves: e.target.value })}
//                                     fullWidth
//                                 />
//                                 <TextField
//                                     size="small"
//                                     type="number"
//                                     label="Total Energy"
//                                     value={form.totalEnergy}
//                                     onChange={(e) => setForm({ ...form, totalEnergy: e.target.value })}
//                                     fullWidth
//                                 />
//                                 <TextField
//                                     size="small"
//                                     type="number"
//                                     label="Carbohydrate (g)"
//                                     value={form.carbohydrate}
//                                     onChange={(e) => setForm({ ...form, carbohydrate: e.target.value })}
//                                     fullWidth
//                                 />
//                                 <TextField
//                                     size="small"
//                                     type="number"
//                                     label="Fat (g)"
//                                     value={form.fat}
//                                     onChange={(e) => setForm({ ...form, fat: e.target.value })}
//                                     fullWidth
//                                 />
//                                 <TextField
//                                     size="small"
//                                     type="number"
//                                     label="Protein (g)"
//                                     value={form.protein}
//                                     onChange={(e) => setForm({ ...form, protein: e.target.value })}
//                                     fullWidth
//                                 />
//                                 <TextField
//                                     size="small"
//                                     type="number"
//                                     label="Price"
//                                     value={form.price}
//                                     onChange={(e) => setForm({ ...form, price: e.target.value })}
//                                     fullWidth
//                                 />
//                                 <TextField
//                                     size="small"
//                                     type="number"
//                                     label="Discount (%)"
//                                     value={form.discount}
//                                     onChange={(e) => setForm({ ...form, discount: e.target.value })}
//                                     fullWidth
//                                 />
//                             </div>
//                             <TextField
//                                 size="small"
//                                 label="Description"
//                                 value={form.description}
//                                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                                 fullWidth
//                                 multiline
//                                 rows={3}
//                             />
//                             <TextField
//                                 size="small"
//                                 label="Types (comma separated)"
//                                 value={typesText}
//                                 onChange={(e) => setTypesText(e.target.value)}
//                                 fullWidth
//                                 helperText="Enter multiple types separated by commas (e.g., veg, spicy, gluten-free)"
//                             />
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Update Image (Optional)</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => {
//                                         const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
//                                         setForm({ ...form, imgFile: file });
//                                         setPreviewImage(file ? URL.createObjectURL(file) : details?.img && details.img.startsWith('http') ? details.img : null);
//                                     }}
//                                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                                 />
//                                 <div className="mt-2">
//                                     <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
//                                     {previewImage ? (
//                                         <img src={previewImage} alt="Preview" className="w-20 h-20 object-cover border rounded" />
//                                     ) : (
//                                         <div className="w-20 h-20 flex items-center justify-center border rounded bg-gray-50 text-gray-500 text-sm">
//                                             No Image
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                             {selected && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-500 pt-2 border-t">
//                                     {selected.createdAt && (
//                                         <div className="flex flex-col">
//                                             <span className="font-medium">Created:</span>
//                                             <span>{formatDate(selected.createdAt)}</span>
//                                         </div>
//                                     )}
//                                     {selected.updatedAt && (
//                                         <div className="flex flex-col">
//                                             <span className="font-medium">Last Updated:</span>
//                                             <span>{formatDate(selected.updatedAt)}</span>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         onClick={() => setEditOpen(false)}
//                         disabled={detailsLoading}
//                         className="px-4 py-2 rounded text-gray-600 font-semibold border border-gray-300 hover:bg-gray-50 transition"
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         onClick={submitEdit}
//                         disabled={detailsLoading}
//                         className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition"
//                         startIcon={detailsLoading ? <CircularProgress size={16} className="text-white" /> : null}
//                     >
//                         {detailsLoading ? 'Saving...' : 'Save'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Add Dialog */}
//             <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
//                 <DialogTitle className="bg-gradient-to-r from-rose-500 to-red-400 text-white">Add Sub Category</DialogTitle>
//                 <DialogContent dividers className="py-4">
//                     <div className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <TextField
//                                 size="small"
//                                 label="Name"
//                                 value={form.name}
//                                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                                 fullWidth
//                                 required
//                             />
//                             <TextField
//                                 size="small"
//                                 label="Quality"
//                                 value={form.quality}
//                                 onChange={(e) => setForm({ ...form, quality: e.target.value })}
//                                 fullWidth
//                             />
//                             <Select
//                                 size="small"
//                                 label="Unit"
//                                 value={form.unit}
//                                 onChange={(e) => setForm({ ...form, unit: e.target.value })}
//                                 fullWidth
//                                 required
//                             >
//                                 <MenuItem value="kg">kg</MenuItem>
//                                 <MenuItem value="gram">grams</MenuItem>
//                                 <MenuItem value="pieces">pieces</MenuItem>
//                                 <MenuItem value="liters">liters</MenuItem>
//                             </Select>
//                             <TextField
//                                 size="small"
//                                 type="number"
//                                 label="Quantity"
//                                 value={form.weight}
//                                 onChange={(e) => setForm({ ...form, weight: e.target.value })}
//                                 fullWidth
//                             />
//                             <TextField
//                                 size="small"
//                                 type="number"
//                                 label="Serves"
//                                 value={form.serves}
//                                 onChange={(e) => setForm({ ...form, serves: e.target.value })}
//                                 fullWidth
//                                 required
//                             />
//                             <TextField
//                                 size="small"
//                                 type="number"
//                                 label="Total Energy"
//                                 value={form.totalEnergy}
//                                 onChange={(e) => setForm({ ...form, totalEnergy: e.target.value })}
//                                 fullWidth
//                                 required
//                             />
//                             <TextField
//                                 size="small"
//                                 type="number"
//                                 label="Carbohydrate (g)"
//                                 value={form.carbohydrate}
//                                 onChange={(e) => setForm({ ...form, carbohydrate: e.target.value })}
//                                 fullWidth
//                             />
//                             <TextField
//                                 size="small"
//                                 type="number"
//                                 label="Fat (g)"
//                                 value={form.fat}
//                                 onChange={(e) => setForm({ ...form, fat: e.target.value })}
//                                 fullWidth
//                             />
//                             <TextField
//                                 size="small"
//                                 type="number"
//                                 label="Protein (g)"
//                                 value={form.protein}
//                                 onChange={(e) => setForm({ ...form, protein: e.target.value })}
//                                 fullWidth
//                             />
//                             <TextField
//                                 size="small"
//                                 type="number"
//                                 label="Price"
//                                 value={form.price}
//                                 onChange={(e) => setForm({ ...form, price: e.target.value })}
//                                 fullWidth
//                                 required
//                             />
//                             <TextField
//                                 size="small"
//                                 type="number"
//                                 label="Discount (%)"
//                                 value={form.discount}
//                                 onChange={(e) => setForm({ ...form, discount: e.target.value })}
//                                 fullWidth
//                             />
//                         </div>
//                         <TextField
//                             size="small"
//                             label="Description"
//                             value={form.description}
//                             onChange={(e) => setForm({ ...form, description: e.target.value })}
//                             fullWidth
//                             multiline
//                             rows={3}
//                             required
//                         />
//                         <TextField
//                             size="small"
//                             label="Types (comma separated)"
//                             value={typesText}
//                             onChange={(e) => setTypesText(e.target.value)}
//                             fullWidth
//                             required
//                             helperText="Enter multiple types separated by commas (e.g., veg, spicy, gluten-free)"
//                         />
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image (Optional)</label>
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => {
//                                     const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
//                                     setForm({ ...form, imgFile: file });
//                                     setPreviewImage(file ? URL.createObjectURL(file) : null);
//                                 }}
//                                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                             />
//                             <div className="mt-2">
//                                 <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
//                                 {previewImage ? (
//                                     <img src={previewImage} alt="Preview" className="w-20 h-20 object-cover border rounded" />
//                                 ) : (
//                                     <div className="w-20 h-20 flex items-center justify-center border rounded bg-gray-50 text-gray-500 text-sm">
//                                         No Image
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         onClick={() => setAddOpen(false)}
//                         disabled={detailsLoading}
//                         className="px-4 py-2 rounded text-gray-600 font-semibold border border-gray-300 hover:bg-gray-50 transition"
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         onClick={submitAdd}
//                         disabled={detailsLoading}
//                         className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 px-4 py-2 rounded text-white font-semibold transition"
//                         startIcon={detailsLoading ? <CircularProgress size={16} className="text-white" /> : null}
//                     >
//                         {detailsLoading ? 'Adding...' : 'Add'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// };

// export default SubCategoriesDisplay;
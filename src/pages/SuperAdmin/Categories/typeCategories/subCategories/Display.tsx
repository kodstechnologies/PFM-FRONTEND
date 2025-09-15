import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import callApi from '../../../../../util/admin_api';
import { AxiosResponse } from 'axios';
// import NavigateBtn from '../../../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


// Default image
import defaultImg from '../../../../../assets/items/chicken leg piece.png';

// Utility function to normalize type tokens - enhanced to handle deeply corrupted data
const normalizeTypeTokens = (raw: any): string[] => {
    if (!raw) return [];

    // Handle deeply corrupted strings like the one in the image
    if (typeof raw === 'string') {
        // Try to extract clean text from corrupted JSON strings
        const cleanText = raw
            .replace(/\\+/g, '') // Remove all backslashes
            .replace(/"/g, '') // Remove all quotes
            .replace(/\[/g, '') // Remove all opening brackets
            .replace(/\]/g, '') // Remove all closing brackets
            .split(',') // Split by comma
            .map(s => s.trim()) // Trim whitespace
            .filter(s => s.length > 0 && !s.match(/^[\[\]\\"]+$/)); // Filter out pure symbols

        if (cleanText.length > 0) {
            return cleanText;
        }

        // Fallback to JSON parsing
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
    img?: string;
    description?: string;
    id: string;
    price?: number;
    discount?: number;
    discountPrice?: number;
}

interface UserData {
    token?: string;
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
    const [form, setForm] = useState({
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
        imgFile: null as File | null,
    });
    const [loading, setLoading] = useState(true);
    const { id: paramId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    console.log("🚀 ~ SubCategoriesDisplay ~ location:", location)
    const typeId = location.state?.typeId || paramId; // This is the type ID for API calls
    const categoryId = location.state?.categoryId; // This is the category ID for navigation back
    // const id = typeId; // Keep the existing logic for API calls

    // Fetch sub categories from API
    useEffect(() => {
        const fetchSubCategories = async () => {
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
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!response.data.success || !Array.isArray(response.data.data.subCategories)) {
                    throw new Error(response.data.message || 'Invalid API response format');
                }

                setSubCategories(response.data.data.subCategories);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sub categories';
                console.error('Error fetching sub categories:', errorMessage);

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
            state: { subCategory: item, typeId: typeId },
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
                `/admin/sub-product-categories/${item.id}`, // ✅ using id
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to delete sub category');
            }

            // ✅ remove deleted item from state immediately
            setSubCategories((prev) => prev.filter((sc) => sc.id !== item.id));

            toast.success('Sub category deleted successfully!', {
                toastId: 'delete-sub-category-success',
                position: 'top-right',
                autoClose: 2000,
            });

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete sub category';
            console.error('Error deleting sub category:', errorMessage);

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


    const getSubCategoryImage = (subCategory: SubCategory): string => {
        if (subCategory.img && typeof subCategory.img === 'string' && subCategory.img.startsWith('http')) {
            return subCategory.img;
        }
        return defaultImg;
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
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch details');
            const d = res.data.data;
            setDetails(d);
            const unitStr = (d?.unit || '').toString().toLowerCase();
            const piecesLike = unitStr.includes('piece');
            setForm({
                name: d.name || '',
                quality: d.quality || '',
                unit: d.unit || 'kg',
                weight: String(piecesLike ? (d.pieces ?? d.number ?? d.weight ?? '') : (d.weight ?? '')),
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
            // Debug: log the raw type data
            console.log('Raw type data:', d.type);
            const normalizedTypes = normalizeTypeTokens(d.type);
            console.log('Normalized types:', normalizedTypes);
            setTypesText(normalizedTypes.join(', '));
        } catch (err: any) {
            toast.error(err?.message || 'Failed to load details');
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
        setForm({
            name: '', quality: '', unit: 'kg', weight: '', serves: '', totalEnergy: '', carbohydrate: '', fat: '', protein: '', description: '', price: '', discount: '', imgFile: null,
        });
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

            const types = typesText
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('type', JSON.stringify(types));
            formData.append('quality', form.quality);
            formData.append('unit', form.unit);
            // Interpret weight as count when unit is pieces
            if (form.weight) {
                const unitStr = (form.unit || '').toLowerCase();
                if (unitStr.includes('piece')) {
                    formData.append('pieces', form.weight);
                } else formData.append('weight', form.weight);
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
                headers: { 'Authorization': `Bearer ${token}` },
                data: formData,
            });
            if (res) {
                window.location.reload(); // reloads the full page
            }
            if (!res.data.success) throw new Error(res.data.message || 'Failed to update');

            toast.success('Sub category updated');

            // Refresh list item in table minimally
            setSubCategories((prev) => prev.map((sc) => sc.id === selected.id ? {
                ...sc,
                name: form.name || sc.name,
                price: Number(form.price) || sc.price,
                discount: Number(form.discount) || 0,
                discountPrice: res.data.data?.discountPrice ?? sc.discountPrice,
            } : sc));
            setEditOpen(false);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update');
        } finally {
            setDetailsLoading(false);
        }
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return subCategories;
        const term = search.toLowerCase();
        return subCategories.filter((s) => s.name?.toLowerCase().includes(term));
    }, [search, subCategories]);

    if (loading) {
        return (
            <div className="py-6">
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
                        <div className="w-full">
                            <h1 className="text-2xl font-bold text-gray-800">Sub Categories</h1>
                        </div>
                        <button onClick={() => openAdd()} className="inline-flex items-center gap-1 px-3 py-2 border rounded text-sm text-blue-600 hover:bg-blue-50">
                            <AddIcon fontSize="small" />
                            <span>Add</span>
                        </button>
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <CircularProgress sx={{ color: '#F47C7C' }} />
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
            <div className="py-6">
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
                                className="w-full sm:w-72 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={() => openAdd()} className="inline-flex items-center gap-1 px-3 py-2 border rounded text-sm text-blue-600 hover:bg-blue-50">
                                <AddIcon fontSize="small" />
                                <span>Add</span>
                            </button>
                        </div>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <Box className="text-center py-12">
                        <div className="mx-auto max-w-md">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No sub categories found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by adding your first sub category.
                            </p>
                            <div className="mt-6">
                                <button onClick={() => openAdd()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm">
                                    Add New Sub Category
                                </button>
                            </div>
                        </div>
                    </Box>
                ) : (
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL No.</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filtered.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="w-12 h-12 rounded-md overflow-hidden border bg-gray-50">
                                                <img src={getSubCategoryImage(item)} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openView(item)} className="inline-flex items-center gap-1 border rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
                                                    <VisibilityIcon fontSize="small" />
                                                    <span>View</span>
                                                </button>
                                                <button onClick={() => openEdit(item)} className="inline-flex items-center gap-1 border rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
                                                    <EditIcon fontSize="small" />
                                                    <span>Edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(item)} className="inline-flex items-center gap-1 border rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
                                                    <DeleteIcon fontSize="small" />
                                                    <span>Delete</span>
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
                <DialogTitle>Sub Category Details</DialogTitle>
                <DialogContent dividers>
                    {detailsLoading ? (
                        <div className="flex justify-center items-center py-10"><CircularProgress /></div>
                    ) : details ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <div className="w-full aspect-square border rounded-lg overflow-hidden bg-gray-50">
                                        <img src={(details && (details.img || defaultImg)) as string} alt={(details && details.name) || ''} className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="text-xl font-semibold">{details.name}</div>
                                        {details.discount && details.discount > 0 ? (
                                            <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 border border-green-200">{details.discount}% OFF</span>
                                        ) : null}
                                    </div>

                                    {details.type && (
                                        <div className="flex flex-wrap gap-2">
                                            {(() => {
                                                console.log('View dialog - Raw type data:', details.type);
                                                const normalized = normalizeTypeTokens(details.type);
                                                console.log('View dialog - Normalized types:', normalized);
                                                return normalized.map((t: string, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">{t}</span>
                                                ));
                                            })()}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{details.quality}</span>
                                        <div className="flex items-center gap-2">
                                            {details.discount && details.discount > 0 && details.discountPrice ? (
                                                <>
                                                    <span className="text-green-700 font-bold">₹{details.discountPrice}</span>
                                                    <span className="text-gray-400 line-through">₹{details.price}</span>
                                                </>
                                            ) : (
                                                <span className="text-green-700 font-bold">₹{details.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    {details.description && (
                                        <div className="text-sm text-gray-700">{details.description}</div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                                        {details.unit && <div><span className="font-medium">Unit:</span> {details.unit}</div>}
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
                                                <div><span className="font-medium">Quantity:</span> {`${w}${suffix ? suffix : ''}`}</div>
                                            );
                                        })()}
                                        {(() => {
                                            const n = (details as any).number ?? (details as any).pieces ?? (details as any).weight;
                                            const isPiecesUnit = typeof details.unit === 'string' && details.unit.toLowerCase().includes('piece');
                                            return (isPiecesUnit && n !== undefined && n !== null && String(n) !== '') ? (
                                                <div><span className="font-medium">Quantity:</span> {`${n}pcs`}</div>
                                            ) : null;
                                        })()}
                                        {typeof details.serves !== 'undefined' && <div><span className="font-medium">Serves:</span> {details.serves}</div>}
                                        {typeof details.totalEnergy !== 'undefined' && <div><span className="font-medium">Energy:</span> {details.totalEnergy} kcal</div>}
                                        {typeof details.carbohydrate !== 'undefined' && <div><span className="font-medium">Carbs:</span> {details.carbohydrate} g</div>}
                                        {typeof details.fat !== 'undefined' && <div><span className="font-medium">Fat:</span> {details.fat} g</div>}
                                        {typeof details.protein !== 'undefined' && <div><span className="font-medium">Protein:</span> {details.protein} g</div>}
                                        {typeof details.discount !== 'undefined' && <div><span className="font-medium">Discount:</span> {details.discount}%</div>}
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-500 pt-2">
                                        {details.createdAt && <div>Created: {new Date(details.createdAt).toLocaleDateString()}</div>}
                                        {details.updatedAt && <div>Updated: {new Date(details.updatedAt).toLocaleDateString()}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">No details found.</div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Sub Category</DialogTitle>
                <DialogContent dividers>
                    {detailsLoading ? (
                        <div className="flex justify-center items-center py-10"><CircularProgress /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField size="small" label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <TextField size="small" label="Quality" value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} />
                            <TextField
                                size="small"
                                select
                                SelectProps={{ native: true }}
                                label="Unit"
                                value={form.unit}
                                onChange={(e) => setForm({ ...form, unit: (e.target as HTMLInputElement).value })}
                            >
                                <option value="kg">kg</option>
                                <option value="gram">grams</option>
                                <option value="pieces">pieces</option>
                                <option value="liters">liters</option>
                            </TextField>
                            <TextField size="small" label="Quantity" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                            <TextField size="small" type="number" label="Serves" value={form.serves} onChange={(e) => setForm({ ...form, serves: e.target.value })} />
                            <TextField size="small" type="number" label="Total Energy" value={form.totalEnergy} onChange={(e) => setForm({ ...form, totalEnergy: e.target.value })} />
                            <TextField size="small" type="number" label="Carbohydrate (g)" value={form.carbohydrate} onChange={(e) => setForm({ ...form, carbohydrate: e.target.value })} />
                            <TextField size="small" type="number" label="Fat (g)" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} />
                            <TextField size="small" type="number" label="Protein (g)" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
                            <TextField size="small" type="number" label="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                            <TextField size="small" type="number" label="Discount (%)" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                            <div className="md:col-span-2">
                                <TextField size="small" label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
                            </div>
                            <div className="md:col-span-2">
                                <TextField size="small" label="Types (comma separated)" value={typesText} onChange={(e) => setTypesText(e.target.value)} fullWidth />
                            </div>
                            <div className="md:col-span-2">
                                <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, imgFile: e.target.files && e.target.files[0] ? e.target.files[0] : null })} />
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} disabled={detailsLoading}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={submitEdit}
                        disabled={detailsLoading}
                        startIcon={detailsLoading ? <CircularProgress size={16} /> : null}
                    >
                        {detailsLoading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Dialog */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add Sub Category</DialogTitle>
                <DialogContent dividers>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField size="small" label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <TextField size="small" label="Quality" value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} />
                        <TextField
                            size="small"
                            select
                            SelectProps={{ native: true }}
                            label="Unit"
                            value={form.unit}
                            onChange={(e) => setForm({ ...form, unit: (e.target as HTMLInputElement).value })}
                        >
                            <option value="kg">kg</option>
                            <option value="gram">grams</option>
                            <option value="pieces">pieces</option>
                            <option value="liters">liters</option>
                        </TextField>
                        <TextField size="small" type="number" label="Quantity" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                        <TextField size="small" type="number" label="Serves" value={form.serves} onChange={(e) => setForm({ ...form, serves: e.target.value })} />
                        <TextField size="small" type="number" label="Total Energy" value={form.totalEnergy} onChange={(e) => setForm({ ...form, totalEnergy: e.target.value })} />
                        <TextField size="small" type="number" label="Carbohydrate (g)" value={form.carbohydrate} onChange={(e) => setForm({ ...form, carbohydrate: e.target.value })} />
                        <TextField size="small" type="number" label="Fat (g)" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} />
                        <TextField size="small" type="number" label="Protein (g)" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
                        <TextField size="small" type="number" label="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                        <TextField size="small" type="number" label="Discount (%)" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                        <div className="md:col-span-2">
                            <TextField size="small" label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
                        </div>
                        <div className="md:col-span-2">
                            <TextField size="small" label="Types (comma separated)" value={typesText} onChange={(e) => setTypesText(e.target.value)} fullWidth />
                        </div>
                        <div className="md:col-span-2">
                            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, imgFile: e.target.files && e.target.files[0] ? e.target.files[0] : null })} />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)} disabled={detailsLoading}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            try {
                                setDetailsLoading(true);
                                const userDataString = localStorage.getItem('superAdminUser');
                                const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
                                const token = userData.token;
                                if (!token) throw new Error('No authentication token found. Please log in.');
                                const types = typesText.split(',').map((t) => t.trim()).filter(Boolean);
                                const fd = new FormData();
                                fd.append('name', form.name);
                                fd.append('type', JSON.stringify(types));
                                fd.append('quality', form.quality);
                                fd.append('unit', form.unit);
                                if (form.weight) {
                                    const unitStr2 = (form.unit || '').toLowerCase();
                                    if (unitStr2.includes('piece')) fd.append('pieces', form.weight);
                                    else fd.append('weight', form.weight);
                                }
                                if (form.serves) fd.append('serves', form.serves);
                                fd.append('totalEnergy', form.totalEnergy || '0');
                                fd.append('carbohydrate', form.carbohydrate || '0');
                                fd.append('fat', form.fat || '0');
                                fd.append('protein', form.protein || '0');
                                fd.append('description', form.description);
                                fd.append('price', form.price);
                                fd.append('discount', form.discount || '0');
                                if (form.imgFile) fd.append('img', form.imgFile);
                                const res: AxiosResponse<ApiResponse<any>> = await callApi(
                                    `/admin/sub-product-categories/${typeId}`,
                                    { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, data: fd }
                                );
                                if (!res.data.success) throw new Error(res.data.message || 'Failed to add');
                                toast.success('Sub category added');
                                // Optimistically add to list
                                setSubCategories((prev) => [{
                                    _id: res.data.data?._id || Math.random().toString(36).slice(2),
                                    id: res.data.data?.id || res.data.data?._id || Math.random().toString(36).slice(2),
                                    name: form.name,
                                    img: res.data.data?.img,
                                    description: form.description,
                                    price: Number(form.price) || undefined,
                                    discount: Number(form.discount) || 0,
                                    discountPrice: res.data.data?.discountPrice,
                                }, ...prev]);
                                setAddOpen(false);
                            } catch (err: any) {
                                toast.error(err?.message || 'Failed to add');
                            } finally {
                                setDetailsLoading(false);
                            }
                        }}
                        disabled={detailsLoading}
                        startIcon={detailsLoading ? <CircularProgress size={16} /> : null}
                    >
                        {detailsLoading ? 'Adding...' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SubCategoriesDisplay;
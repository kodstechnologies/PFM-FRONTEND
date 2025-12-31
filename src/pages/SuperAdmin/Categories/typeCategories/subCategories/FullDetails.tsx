import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Chip,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    Divider,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ScaleIcon from '@mui/icons-material/Scale';
import EggIcon from '@mui/icons-material/Egg';
import DiscountIcon from '@mui/icons-material/Discount';
import StoreIcon from '@mui/icons-material/Store';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
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

interface ProductDetails {
    id?: string;
    bestSellers: boolean;
    _id: string;
    name: string;
    type: string[];
    quality: string;
    description: string;
    weight?: string;
    pieces?: string;
    serves: number;
    totalEnergy: number;
    carbohydrate: number;
    fat: number;
    protein: number;
    price: number;
    discount: number;
    discountPrice: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    img?: string;
    unit?: string;
}

interface Store {
    _id: string;
    name: string;
    // Add other store fields as needed
}

interface StockInfo {
    subCategoriId: string;
    storeId: string;
    available: boolean;
    count: number;
    kg: number;
}

interface UserData {
    token?: string;
}

// Utility function to normalize type tokens (same as used in manager section)
const normalizeTypeTokens = (raw: any): string[] => {
    // Accept arrays, JSON-stringified arrays, comma-separated strings, or single strings
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

const FullDetails: React.FC = () => {
    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [storesLoading, setStoresLoading] = useState(true);
    const [stockLoading, setStockLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<'count' | 'kg'>('count');
    const [tempValue, setTempValue] = useState(0);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the product ID from either URL params or location state
    const productId = id || location.state?.subCategory?.id || location.state?.subCategory?._id;

    // Handle editing toggle
    const handleEditToggle = () => {
        if (editing) {
            setEditing(false);
        } else {
            if (stockInfo) {
                // Default to product's unit if available
                const defaultUnit = product?.unit === 'kg' ? 'kg' : 'count';
                setSelectedUnit(defaultUnit);
                setTempValue(defaultUnit === 'kg' ? stockInfo.kg : stockInfo.count);
            }
            setEditing(true);
        }
    };

    // Handle cancel edit
    const handleCancel = () => {
        if (stockInfo) {
            const defaultUnit = product?.unit === 'kg' ? 'kg' : 'count';
            setSelectedUnit(defaultUnit);
            setTempValue(defaultUnit === 'kg' ? stockInfo.kg : stockInfo.count);
        }
        setEditing(false);
    };

    // Handle unit change
    const handleUnitChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newUnit = event.target.value as 'count' | 'kg';
        setSelectedUnit(newUnit);
        if (stockInfo) {
            setTempValue(newUnit === 'kg' ? stockInfo.kg : stockInfo.count);
        }
    };

    // Handle save update
    const handleSave = async () => {
        if (!productId || !selectedStore || stockInfo === null) return;

        // Validate: value should be >= 0
        if (tempValue < 0) {
            toast.error('Value cannot be negative', {
                toastId: 'validation-error',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        let updateData: { count?: number } | { kg?: number } = {};

        if (selectedUnit === 'count') {
            updateData = { count: tempValue };
        } else {
            updateData = { kg: tempValue };
        }

        try {
            setUpdating(true);
            const userDataString = localStorage.getItem('superAdminUser');
            const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
            const token = userData.token;

            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }

            const response: AxiosResponse<ApiResponse<StockInfo>> = await callApi({
                url: `/admin/store-products/${productId}/${selectedStore._id}`,
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: updateData
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to update stock');
            }

            console.log('🚀 ~ handleSave ~ updated stock data:', response.data.data);
            setStockInfo(response.data.data);
            setEditing(false);
            toast.success('Stock updated successfully', {
                toastId: 'update-stock-success',
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update stock';
            console.error('Error updating stock:', errorMessage);

            toast.error(errorMessage, {
                toastId: 'update-stock-error',
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setUpdating(false);
        }
    };

    // Fetch product details from API
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productId) {
                toast.error('Product ID is required');
                navigate(-1);
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

                const response: AxiosResponse<ApiResponse<ProductDetails>> = await callApi({
                    url: `/admin/sub-product-categories-details/${productId}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.data.success) {
                    throw new Error(response.data.message || 'Failed to fetch product details');
                }

                console.log('🚀 ~ fetchProductDetails ~ product data:', response.data.data);
                setProduct(response.data.data);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product details';
                console.error('Error fetching product details:', errorMessage);

                toast.error(errorMessage, {
                    toastId: 'fetch-product-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [navigate, productId]);

    // Fetch all stores
    useEffect(() => {
        const fetchStores = async () => {
            try {
                setStoresLoading(true);
                const userDataString = localStorage.getItem('superAdminUser');
                const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
                const token = userData.token;

                if (!token) {
                    throw new Error('No authentication token found. Please log in.');
                }

                const response: AxiosResponse<ApiResponse<Store[]>> = await callApi({
                    url: `/admin/all-store-name`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.data.success) {
                    throw new Error(response.data.message || 'Failed to fetch stores');
                }

                console.log('🚀 ~ fetchStores ~ stores data:', response.data.data);
                setStores(response.data.data);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stores';
                console.error('Error fetching stores:', errorMessage);

                toast.error(errorMessage, {
                    toastId: 'fetch-stores-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
            } finally {
                setStoresLoading(false);
            }
        };

        fetchStores();
    }, [navigate]);

    // Fetch stock info when selectedStore changes
    useEffect(() => {
        const fetchStockInfo = async () => {
            if (!productId || !selectedStore) {
                setStockInfo(null);
                setEditing(false);
                return;
            }

            try {
                setStockLoading(true);
                const userDataString = localStorage.getItem('superAdminUser');
                const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
                const token = userData.token;

                if (!token) {
                    throw new Error('No authentication token found. Please log in.');
                }

                const response: AxiosResponse<ApiResponse<StockInfo>> = await callApi({
                    url: `/admin/store-products/${productId}/${selectedStore._id}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.data.success) {
                    throw new Error(response.data.message || 'Failed to fetch stock info');
                }

                console.log('🚀 ~ fetchStockInfo ~ stock data:', response.data.data);
                setStockInfo(response.data.data);
                const defaultUnit = product?.unit === 'kg' ? 'kg' : 'count';
                setSelectedUnit(defaultUnit);
                setTempValue(defaultUnit === 'kg' ? response.data.data.kg : response.data.data.count);
                setEditing(false);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stock info';
                console.error('Error fetching stock info:', errorMessage);

                toast.error(errorMessage, {
                    toastId: 'fetch-stock-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                setStockInfo(null);
            } finally {
                setStockLoading(false);
            }
        };

        fetchStockInfo();
    }, [selectedStore, productId, navigate, product]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
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
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Product not found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        The product you're looking for doesn't exist.
                    </p>
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

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header with back button */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <IconButton
                            onClick={() => navigate(-1)}
                            className="mr-2 bg-gray-100 hover:bg-gray-200"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" className="font-bold text-gray-800">
                            Product Details
                        </Typography>
                    </div>
                </div>

                <Card className="shadow-lg rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                        {/* Product Header */}
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                                {product.img && product.img.startsWith('http') ? (
                                    <img
                                        src={product.img}
                                        alt={product.name}
                                        className="w-64 h-64 object-contain rounded-lg border"
                                    />
                                ) : (
                                    <div className="w-64 h-64 bg-gray-100 rounded-lg border flex items-center justify-center">
                                        <Typography variant="body2" className="text-gray-500">No Image</Typography>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-grow">
                                <div className="flex items-start justify-between mb-4">
                                    <Typography variant="h4" className="font-bold text-gray-800">
                                        {product.name}
                                    </Typography>

                                    <div className="flex items-center gap-2">
                                        {product.bestSellers && (
                                            <Chip
                                                icon={<StarIcon />}
                                                label="Best Seller"
                                                color="warning"
                                                variant="filled"
                                            />
                                        )}

                                        {product.discount > 0 && (
                                            <Chip
                                                icon={<DiscountIcon />}
                                                label={`${product.discount}% OFF`}
                                                color="success"
                                                variant="filled"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {normalizeTypeTokens(product.type).map((type, index) => (
                                        <Chip
                                            key={index}
                                            label={type}
                                            variant="outlined"
                                            color="primary"
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <Chip
                                        icon={<EggIcon />}
                                        label={product.quality}
                                        color="success"
                                        variant="outlined"
                                    />

                                    {/* Price display with discount if applicable */}
                                    <div className="flex items-center gap-2">
                                        {product.discount > 0 ? (
                                            <>
                                                <Typography variant="h5" className="text-green-600 font-bold">
                                                    ₹{product.discountPrice}
                                                </Typography>
                                                <Typography variant="body1" className="text-gray-400 line-through">
                                                    ₹{product.price}
                                                </Typography>
                                                <Chip
                                                    label={`Save ${product.discount}%`}
                                                    color="success"
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </>
                                        ) : (
                                            <Typography variant="h5" className="text-green-600 font-bold">
                                                ₹{product.price}
                                            </Typography>
                                        )}
                                    </div>
                                </div>

                                <Typography variant="body1" className="text-gray-600 mb-4">
                                    {product.description}
                                </Typography>

                                {/* Product Specifications */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <ScaleIcon className="text-gray-500" />
                                        <Typography variant="body2">
                                            <span className="font-semibold">Unit:</span> {product.unit || 'N/A'}
                                        </Typography>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <ScaleIcon className="text-gray-500" />
                                        <Typography variant="body2">
                                            <span className="font-semibold">Weight:</span> {product.weight || 'N/A'}
                                        </Typography>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <RestaurantIcon className="text-gray-500" />
                                        <Typography variant="body2">
                                            <span className="font-semibold">Pieces:</span> {product.pieces || 'N/A'}
                                        </Typography>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FitnessCenterIcon className="text-gray-500" />
                                        <Typography variant="body2">
                                            <span className="font-semibold">Serves:</span> {product.serves} people
                                        </Typography>
                                    </div>

                                    {product.discount > 0 && (
                                        <div className="flex items-center gap-2">
                                            <DiscountIcon className="text-gray-500" />
                                            <Typography variant="body2">
                                                <span className="font-semibold">Discount:</span> {product.discount}%
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Divider className="my-6" />

                        {/* Nutrition Information */}
                        <div className="mb-6">
                            <Typography variant="h5" className="font-bold mb-4 flex items-center gap-2">
                                <LocalFireDepartmentIcon className="text-orange-500" />
                                Nutrition Information
                            </Typography>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <Typography variant="h6" className="font-bold text-blue-700">
                                        {product.totalEnergy}kcal
                                    </Typography>
                                    <Typography variant="body2" className="text-blue-600">
                                        Total Energy
                                    </Typography>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <Typography variant="h6" className="font-bold text-green-700">
                                        {product.carbohydrate}g
                                    </Typography>
                                    <Typography variant="body2" className="text-green-600">
                                        Carbohydrates
                                    </Typography>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                    <Typography variant="h6" className="font-bold text-yellow-700">
                                        {product.fat}g
                                    </Typography>
                                    <Typography variant="body2" className="text-yellow-600">
                                        Fat
                                    </Typography>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                    <Typography variant="h6" className="font-bold text-purple-700">
                                        {product.protein}g
                                    </Typography>
                                    <Typography variant="body2" className="text-purple-600">
                                        Protein
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <Divider className="my-6" />

                        {/* Additional Information */}
                        <div className="mb-6">
                            <Typography variant="h5" className="font-bold mb-4">
                                Additional Information
                            </Typography>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
                                <div>
                                    <Typography variant="body2" className="text-gray-600">
                                        <span className="font-semibold">Created:</span> {new Date(product.createdAt).toLocaleDateString()}
                                    </Typography>
                                </div>

                                <div>
                                    <Typography variant="body2" className="text-gray-600">
                                        <span className="font-semibold">Last Updated:</span> {new Date(product.updatedAt).toLocaleDateString()}
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <Divider className="my-6" />

                        {/* Available Stores */}
                        <div className="mb-6">
                            <Typography variant="h5" className="font-bold mb-4 flex items-center gap-2">
                                <StoreIcon className="text-blue-500" />
                                Available Stores
                            </Typography>

                            {storesLoading ? (
                                <div className="flex justify-center py-8">
                                    <CircularProgress size={24} />
                                </div>
                            ) : stores.length === 0 ? (
                                <Typography variant="body2" className="text-gray-500 text-center py-8">
                                    No stores available.
                                </Typography>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {stores.map((store) => (
                                        <Chip
                                            key={store._id}
                                            label={store.name}
                                            onClick={() => setSelectedStore(store)}
                                            clickable
                                            color={selectedStore?._id === store._id ? "primary" : "default"}
                                            variant={selectedStore?._id === store._id ? "filled" : "outlined"}
                                            className="cursor-pointer hover:bg-primary-50"
                                            size="medium"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stock Information for Selected Store */}
                        {selectedStore && (
                            <div>
                                <Divider className="my-6" />
                                <Typography variant="h5" className="font-bold mb-4 flex items-center gap-2">
                                    <StoreIcon className="text-blue-500" />
                                    Stock in {selectedStore.name}
                                </Typography>
                                {stockLoading ? (
                                    <div className="flex justify-center py-8">
                                        <CircularProgress size={24} />
                                    </div>
                                ) : stockInfo ? (
                                    <Card className="p-4">
                                        {editing ? (
                                            <div>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} sm={3}>
                                                        <FormControl fullWidth size="small">
                                                            <InputLabel>Unit</InputLabel>
                                                            <Select
                                                                value={selectedUnit}
                                                                label="Unit"
                                                                onChange={handleUnitChange}
                                                            >
                                                                <MenuItem value="count">Count</MenuItem>
                                                                <MenuItem value="kg">KG</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={5}>
                                                        <TextField
                                                            fullWidth
                                                            label={selectedUnit === 'count' ? 'Count' : 'KG'}
                                                            type="number"
                                                            step={selectedUnit === 'kg' ? '0.01' : '1'}
                                                            value={tempValue}
                                                            onChange={(e) => setTempValue(Number(e.target.value) || 0)}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<SaveIcon />}
                                                            onClick={handleSave}
                                                            disabled={updating}
                                                            color="primary"
                                                            size="small"
                                                            fullWidth
                                                        >
                                                            {updating ? <CircularProgress size={16} /> : 'Save'}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<CancelIcon />}
                                                    onClick={handleCancel}
                                                    disabled={updating}
                                                    color="secondary"
                                                    size="small"
                                                    style={{ marginTop: '8px' }}
                                                    fullWidth
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                {stockInfo.available ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {stockInfo.kg > 0 && (
                                                            <div className="flex items-center gap-2">
                                                                <Typography variant="body1" className="font-semibold">
                                                                    KG:
                                                                </Typography>
                                                                <Typography variant="body1" className="text-green-600">
                                                                    {stockInfo.kg}
                                                                </Typography>
                                                            </div>
                                                        )}
                                                        {stockInfo.count > 0 && (
                                                            <div className="flex items-center gap-2">
                                                                <Typography variant="body1" className="font-semibold">
                                                                    Count:
                                                                </Typography>
                                                                <Typography variant="body1" className="text-green-600">
                                                                    {stockInfo.count}
                                                                </Typography>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4">
                                                        <Typography variant="body2" className="text-red-500">
                                                            No stock available for this store
                                                        </Typography>
                                                    </div>
                                                )}
                                                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                                                    <IconButton
                                                        onClick={handleEditToggle}
                                                        color="primary"
                                                        title="Edit Stock"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                ) : (
                                    <Typography variant="body2" className="text-gray-500 text-center py-8">
                                        Failed to load stock information.
                                    </Typography>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default FullDetails;
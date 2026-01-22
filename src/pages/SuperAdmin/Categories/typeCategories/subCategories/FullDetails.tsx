import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Chip,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    IconButton,
    Divider,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    Alert,
    Skeleton
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
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
    console.log("🚀 ~ FullDetails ~ location:", location)
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
    const handleUnitChange = (event: SelectChangeEvent<'count' | 'kg'>) => {
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
        // For count, ensure it's a whole number
        if (selectedUnit === 'count' && !Number.isInteger(tempValue)) {
            toast.error('Count must be a whole number', {
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
            // Override available based on actual values to ensure correct display
            const updatedStock = { ...response.data.data, available: response.data.data.count > 0 || response.data.data.kg > 0 };
            setStockInfo(updatedStock);
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
    }, []);
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
                // Override available based on actual values to ensure correct display
                const fetchedStock = { ...response.data.data, available: response.data.data.count > 0 || response.data.data.kg > 0 };
                setStockInfo(fetchedStock);
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
    }, [selectedStore, productId, product]);
    if (loading) {
        return (
            <Box className="flex justify-center items-center h-64">
                <CircularProgress />
            </Box>
        );
    }
    if (!product) {
        return (
            <Box className="text-center py-12">
                <Box className="mx-auto max-w-md">
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
                    <Typography variant="h6" className="mt-2 font-medium text-gray-900">
                        Product not found
                    </Typography>
                    <Typography variant="body2" className="mt-1 text-gray-500">
                        The product you're looking for doesn't exist.
                    </Typography>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="contained"
                        className="mt-6 bg-blue-600 hover:bg-blue-700"
                    >
                        Go Back
                    </Button>
                </Box>
            </Box>
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
            <Box className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <Box className="flex items-center justify-between mb-6">
                    <Box className="flex items-center gap-3">
                        <IconButton
                            onClick={() => navigate(-1)}
                            size="large"
                            className="bg-gray-100 hover:bg-gray-200"
                        >
                            <ArrowBackIcon fontSize="medium" />
                        </IconButton>
                        <Typography variant="h4" component="h1" className="font-bold text-gray-900">
                            Product Details
                        </Typography>
                    </Box>
                </Box>
                {/* Main Product Card */}
                <Card className="shadow-xl rounded-2xl overflow-hidden mb-8">
                    <CardContent className="p-6 lg:p-8">
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                            {/* Image Section */}
                            <Box sx={{ flex: { xs: 'none', md: 1 }, display: 'flex', justifyContent: 'center' }}>
                                {product.img && product.img.startsWith('http') ? (
                                    <Box
                                        component="img"
                                        src={product.img}
                                        alt={product.name}
                                        sx={{ width: '100%', maxWidth: 'xs', height: 256, objectFit: 'cover', borderRadius: 2, boxShadow: 3 }}
                                    />
                                ) : (
                                    <Box sx={{ width: '100%', maxWidth: 'xs', height: 256, bgcolor: 'grey.100', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 3 }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No Image Available
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            {/* Product Info Section */}
                            <Box sx={{ flex: 1 }}>
                                <Stack spacing={3}>
                                    {/* Title and Badges */}
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', pr: 2 }}>
                                            {product.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {product.bestSellers && (
                                                <Chip
                                                    icon={<StarIcon sx={{ color: 'warning.main' }} />}
                                                    label="Best Seller"
                                                    color="warning"
                                                    variant="filled"
                                                    size="medium"
                                                />
                                            )}
                                            {product.discount > 0 && (
                                                <Chip
                                                    icon={<DiscountIcon sx={{ color: 'success.main' }} />}
                                                    label={`${product.discount}% OFF`}
                                                    color="success"
                                                    variant="filled"
                                                    size="medium"
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                    {/* Types */}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {normalizeTypeTokens(product.type).map((type, index) => (
                                            <Chip
                                                key={index}
                                                label={type}
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                    {/* Quality and Price */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Chip
                                            icon={<EggIcon sx={{ color: 'success.main' }} />}
                                            label={product.quality}
                                            color="success"
                                            variant="outlined"
                                            size="medium"
                                        />
                                        <Box sx={{ textAlign: 'right' }}>
                                            {product.discount > 0 ? (
                                                <>
                                                    <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                                        ₹{product.discountPrice.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                                                        ₹{product.price.toFixed(2)}
                                                    </Typography>
                                                    <Chip label={`Save ${product.discount}%`} color="success" size="small" />
                                                </>
                                            ) : (
                                                <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                                    ₹{product.price.toFixed(2)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    {/* Description */}
                                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: '1.7' }}>
                                        {product.description}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>
                        {/* Specifications */}
                        <Divider sx={{ my: 4 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                            <ScaleIcon sx={{ color: 'primary.main' }} />
                            Specifications
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} flexWrap="wrap">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Unit:</strong> {product.unit || 'N/A'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Weight:</strong> {product.weight || 'N/A'} {product.unit === 'gram' ? 'g' : product.unit === 'kg' ? 'kg' : ''}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Pieces:</strong> {product.pieces || 'N/A'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Serves:</strong> {product.serves} people
                            </Typography>
                        </Stack>
                        {/* Nutrition */}
                        <Divider sx={{ my: 4 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                            <LocalFireDepartmentIcon sx={{ color: 'orange.500' }} />
                            Nutrition Information (per serving)
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, flexWrap: 'wrap' }}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'blue.50', flex: { xs: 'none', sm: 1 } }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'blue.700' }}>
                                    {product.totalEnergy} kcal
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'blue.600', mt: 0.5 }}>
                                    Total Energy
                                </Typography>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'green.50', flex: { xs: 'none', sm: 1 } }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'green.700' }}>
                                    {product.carbohydrate}g
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'green.600', mt: 0.5 }}>
                                    Carbohydrates
                                </Typography>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'yellow.50', flex: { xs: 'none', sm: 1 } }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'yellow.700' }}>
                                    {product.fat}g
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'yellow.600', mt: 0.5 }}>
                                    Fat
                                </Typography>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'purple.50', flex: { xs: 'none', sm: 1 } }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'purple.700' }}>
                                    {product.protein}g
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'purple.600', mt: 0.5 }}>
                                    Protein
                                </Typography>
                            </Card>
                        </Box>
                        {/* Timestamps */}
                        <Divider sx={{ my: 4 }} />
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
                {/* Stores Selection */}
                <Card className="shadow-xl rounded-2xl mb-8">
                    <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                            <StoreIcon sx={{ color: 'primary.main' }} />
                            Available Stores
                        </Typography>
                        {storesLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                <CircularProgress size={32} />
                            </Box>
                        ) : stores.length === 0 ? (
                            <Alert severity="info">
                                No stores available.
                            </Alert>
                        ) : (
                            <FormControl fullWidth size="small">
                                <InputLabel>Select Store</InputLabel>
                                <Select
                                    value={selectedStore?._id || ''}
                                    label="Select Store"
                                    onChange={(e) => {
                                        const storeId = e.target.value;
                                        const store = stores.find(s => s._id === storeId);
                                        setSelectedStore(store || null);
                                    }}
                                >
                                    {stores.map((store) => (
                                        <MenuItem key={store._id} value={store._id}>
                                            {store.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </CardContent>
                </Card>
                {/* Stock Management */}
                {selectedStore && (
                    <Card className="shadow-xl rounded-2xl">
                        <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                                <StoreIcon sx={{ color: 'primary.main' }} />
                                Stock in {selectedStore.name}
                            </Typography>
                            {stockLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                    <CircularProgress size={32} />
                                </Box>
                            ) : stockInfo ? (
                                <Box>
                                    {editing ? (
                                        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-end', gap: 1 }}>
                                            <FormControl sx={{ flex: { xs: '1 1 100%', sm: 1 }, minWidth: { xs: '100%', sm: 120 } }} size="small">
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
                                            <TextField
                                                sx={{ flex: { xs: '1 1 100%', sm: 1 }, minWidth: { xs: '100%', sm: 120 } }}
                                                label={selectedUnit === 'count' ? 'Count' : 'KG'}
                                                type="number"
                                                value={tempValue}
                                                onChange={(e) => setTempValue(Number(e.target.value) || 0)}
                                                variant="outlined"
                                                size="small"
                                                inputProps={{
                                                    step: selectedUnit === 'count' ? 1 : 0.1,
                                                    min: 0
                                                }}
                                            />
                                            <Stack direction="row" spacing={1} sx={{ flex: { xs: '1 1 100%', sm: 'auto' }, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<CancelIcon />}
                                                    onClick={handleCancel}
                                                    disabled={updating}
                                                    size="small"
                                                    sx={{ flex: 1, minWidth: { xs: 'auto', sm: 100 } }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    startIcon={<SaveIcon />}
                                                    disabled={updating || tempValue < 0 || (selectedUnit === 'count' && !Number.isInteger(tempValue))}
                                                    size="small"
                                                    sx={{ flex: 1, minWidth: { xs: 'auto', sm: 100 } }}
                                                >
                                                    {updating ? <CircularProgress size={16} /> : 'Save'}
                                                </Button>
                                            </Stack>
                                        </Box>
                                    ) : (
                                        <Box>
                                            {(stockInfo.count > 0 || stockInfo.kg > 0) ? (
                                                <Box sx={{ bgcolor: 'green.50', p: 2, borderRadius: 1, mb: 2 }}>
                                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                                                        {stockInfo.kg > 0 && (
                                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'green.700' }}>
                                                                KG Available: {stockInfo.kg}
                                                            </Typography>
                                                        )}
                                                        {stockInfo.count > 0 && (
                                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'green.700' }}>
                                                                Count Available: {stockInfo.count}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Alert severity="warning" sx={{ mb: 2 }}>
                                                    No stock available for this store.
                                                </Alert>
                                            )}
                                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                                <IconButton
                                                    onClick={handleEditToggle}
                                                    color="primary"
                                                    size="large"
                                                    title="Edit Stock"
                                                >
                                                    <EditIcon fontSize="medium" />
                                                </IconButton>
                                            </CardActions>
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                <Alert severity="error">
                                    Failed to load stock information.
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                )}
            </Box>
        </>
    );
};
export default FullDetails;
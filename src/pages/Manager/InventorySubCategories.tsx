import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CircularProgress, Alert, Avatar, IconButton, TextField, Chip, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Save as SaveIcon, WarningAmber as WarningIcon, Visibility as VisibilityIcon, Star as StarIcon, LocalFireDepartment as LocalFireDepartmentIcon, Restaurant as RestaurantIcon, FitnessCenter as FitnessCenterIcon, Scale as ScaleIcon, Egg as EggIcon, Discount as DiscountIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import API_CONFIG from '../../config/api.config';

interface Product {
    _id: string; name: string; img?: string; quantity: number; price: number; discount: number; discountPrice: number; type: any; weight: string; pieces: string; serves: number; totalEnergy: number; carbohydrate: number; fat: number; protein: number; description: string; bestSellers: boolean; quality: string; unit: string; createdAt: string; updatedAt: string;
}
interface TypePayload { _id: string; name: string; subCategories: Product[] }
interface ApiResponse<T> { statusCode: number; success: boolean; message: string; data: T; meta: any | null }

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

const InventorySubCategories: React.FC = () => {
    const { typeId } = useParams<{ typeId: string }>();
    const navigate = useNavigate();
    const [typeCat, setTypeCat] = useState<TypePayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<string | null>(null); // productId saving indicator
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    useEffect(() => { fetchData(); }, [typeId]);

    const fetchData = async () => {
        if (!typeId) return;
        try {
            setLoading(true); setError(null);
            const accessToken = localStorage.getItem('accessToken');
            const managerUser = localStorage.getItem('managerUser');
            const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);
            if (!token) { setError('Authentication required. Please log in.'); return; }

            const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.INVENTORY_TYPE_CATEGORY}/${typeId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Failed to fetch sub categories');
            const data: ApiResponse<TypePayload> = await res.json();

            // Normalize quantity per current manager so UI works with a numeric quantity
            let currentManagerId: string | null = null;
            try {
                if (managerUser) {
                    const parsed = JSON.parse(managerUser);
                    currentManagerId = parsed?._id || parsed?.id || null;
                }
            } catch {}

            const normalized = data.data ? {
                ...data.data,
                subCategories: (data.data.subCategories || []).map((p: any) => {
                    const qArr = Array.isArray(p.quantity) ? p.quantity : [];
                    const managerEntry = currentManagerId ? qArr.find((q: any) => String(q.managerId) === String(currentManagerId)) : null;
                    const numericQty = managerEntry?.count ?? qArr[0]?.count ?? 0;
                    console.log("🚀 ~ Product data:", p.name, "unit:", p.unit, "full product:", p);
                    return { ...p, quantity: numericQty } as Product;
                })
            } : null;

            setTypeCat(normalized);
        } catch (e: any) {
            setError(e.message || 'Failed to load');
        } finally { setLoading(false); }
    };

    const setLocalQuantity = (productId: string, newQty: number) => {
        setTypeCat(prev => prev ? {
            ...prev,
            subCategories: prev.subCategories.map(p => p._id === productId ? { ...p, quantity: newQty } : p)
        } : prev);
    };

    const saveQuantity = async (productId: string, newQty: number) => {
        try {
            setSaving(productId);
            const accessToken = localStorage.getItem('accessToken');
            const managerUser = localStorage.getItem('managerUser');
            const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);
            if (!token) { setError('Authentication required. Please log in.'); return; }

            const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.INVENTORY_PRODUCT_QUANTITY}/${productId}/quantity`, {
                method: 'PATCH', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: newQty })
            });
            if (!res.ok) throw new Error('Failed to update quantity');
        } catch (e: any) {
            setError(e.message || 'Failed to update quantity');
        } finally {
            setSaving(null);
        }
    };

    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
        setDetailsModalOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleBackToTypes = () => {
        // Navigate back to the types page for the current category
        // We need to get the category ID from the type category data
        if (typeCat) {
            // Extract category ID from the URL path or navigate back one step
            navigate(-1); // Go back one step in browser history
        } else {
            // Fallback to main inventory if no data
            navigate('/manager/inventory');
        }
    };

    if (loading) return (<div className="flex justify-center items-center h-64"><CircularProgress /></div>);
    if (error) return (<Alert severity="error" className="m-4">{error}</Alert>);
    if (!typeCat) return null;

    return (
        <div className="p-6">
            {/* Header with back button */}
            <div className="flex items-center mb-6">
                <IconButton
                    onClick={handleBackToTypes}
                    className="mr-2 bg-gray-100 hover:bg-gray-200"
                >
                    <ArrowBackIcon />
                </IconButton>
                <div>
                    <Typography variant="h4">Sub Categories</Typography>
                    <Typography variant="body2" color="textSecondary">Manage sub categories for your products</Typography>
                </div>
            </div>

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' } }}>
                {typeCat.subCategories?.map((p) => {
                    console.log("🚀 ~ Raw type data for", p.name, ":", p.type);
                    const tokens = normalizeTypeTokens(p.type);
                    console.log("🚀 ~ Normalized tokens for", p.name, ":", tokens);
                    const basePrice = Number(p.price) || 0;
                    const finalPrice = p.discount && basePrice > 0 
                        ? (Number(p.discountPrice) > 0 ? Number(p.discountPrice) : basePrice - (basePrice * Number(p.discount) / 100))
                        : basePrice;
                    return (
                        <Card key={p._id} className="hover:shadow-md transition-shadow">
                            <CardContent>
                                <div className="flex items-start gap-3">
                                    <Avatar variant="rounded" src={p.img || ''} alt={p.name} sx={{ width: 72, height: 72 }} />
                                    <div className="flex-1 min-w-0">
                                        <Typography variant="subtitle1" className="truncate max-w-[14rem]">{p.name}</Typography>
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {tokens.slice(0, 3).map((t, i) => (<Chip key={i} label={t} size="small" variant="outlined" />))}
                                        </div>
                                        <div className="mt-2">
                                            <Typography variant="body2" fontWeight="medium">
                                                {p.discount && basePrice > 0 ? `₹${finalPrice}` : `₹${basePrice}`}
                                            </Typography>
                                            {/* Updated condition: only show strikethrough if discount is a positive number AND finalPrice is less than basePrice */}
                                            {Number(p.discount) > 0 && basePrice > finalPrice && (
                                                <Typography variant="caption" color="textSecondary" className="line-through">₹{basePrice}</Typography>
                                            )}
                                            <div className="mt-1">
                                                <Typography variant="caption" color="textSecondary">
                                                    Current: {Number(p.quantity) || 0} {p.unit || 'kg'}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Tooltip title="Decrease"><span><IconButton size="small" onClick={() => { const current = Number(p.quantity) || 0; const v = Math.max(0, current - 1); setLocalQuantity(p._id, v); saveQuantity(p._id, v); }} disabled={(Number(p.quantity) || 0) <= 0}><RemoveIcon /></IconButton></span></Tooltip>
                                        <div className="flex items-center gap-1">
                                            <TextField size="small" type="number" value={Number(p.quantity) || 0} onChange={(e) => { const v = Math.max(0, Number(e.target.value || 0)); setLocalQuantity(p._id, v); }} inputProps={{ min: 0, style: { width: 60, textAlign: 'center' } }} />
                                            <span className="text-xs text-gray-500 font-medium">{p.unit || 'kg'}</span>
                                        </div>
                                        <Tooltip title="Increase"><IconButton size="small" onClick={() => { const current = Number(p.quantity) || 0; const v = current + 1; setLocalQuantity(p._id, v); saveQuantity(p._id, v); }}><AddIcon /></IconButton></Tooltip>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Tooltip title="View Details"><span><IconButton size="small" color="info" onClick={() => handleViewDetails(p)}><VisibilityIcon /></IconButton></span></Tooltip>
                                        <Tooltip title="Save"><span><IconButton size="small" color="primary" onClick={() => saveQuantity(p._id, Math.max(0, Number(p.quantity) || 0))} disabled={saving === p._id}><SaveIcon /></IconButton></span></Tooltip>
                                    </div>
                                </div>

                                {(p.quantity === 0 || p.quantity < 10) && (
                                    <Box className="mt-3 flex items-center gap-2">
                                        <WarningIcon color={p.quantity === 0 ? 'error' : 'warning'} fontSize="small" />
                                        <Typography variant="caption" color={p.quantity === 0 ? 'error' : 'warning'}>
                                            {p.quantity === 0 ? 'Out of stock' : 'Low stock, consider restocking'}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {/* Product Details Modal */}
            <Dialog 
                open={detailsModalOpen} 
                onClose={handleCloseDetails} 
                maxWidth="md" 
                fullWidth
                className="product-details-modal"
            >
                {selectedProduct && (
                    <>
                        <DialogTitle className="flex items-center justify-between">
                            <Typography variant="h5" className="font-bold text-gray-800">
                                Product Details
                            </Typography>
                            <IconButton onClick={handleCloseDetails} size="small">
                                <span className="sr-only">Close</span>
                                ×
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <div className="max-w-4xl mx-auto">
                                {/* Product Header */}
                                <div className="flex flex-col md:flex-row gap-6 mb-6">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={selectedProduct.img || ''}
                                            alt={selectedProduct.name}
                                            className="w-64 h-64 object-contain rounded-lg border"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-grow">
                                        <div className="flex items-start justify-between mb-4">
                                            <Typography variant="h4" className="font-bold text-gray-800">
                                                {selectedProduct.name}
                                            </Typography>

                                            {selectedProduct.bestSellers && (
                                                <Chip
                                                    icon={<StarIcon />}
                                                    label="Best Seller"
                                                    color="warning"
                                                    variant="filled"
                                                    className="ml-2"
                                                />
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {(() => {
                                                console.log('View dialog - Raw type data:', selectedProduct.type);
                                                const normalized = normalizeTypeTokens(selectedProduct.type);
                                                console.log('View dialog - Normalized types:', normalized);
                                                return normalized.map((type, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={type}
                                                        variant="outlined"
                                                        color="primary"
                                                    />
                                                ));
                                            })()}
                                        </div>

                                        {/* Promotional Badges */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {selectedProduct.discount && selectedProduct.discount > 0 && (
                                                <Chip
                                                    icon={<DiscountIcon />}
                                                    label={`${selectedProduct.discount}% OFF`}
                                                    color="success"
                                                    variant="filled"
                                                />
                                            )}
                                        </div>

                                        {/* Price and Status */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <Typography variant="body2" color="textSecondary">Good</Typography>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Typography variant="h6" className="font-bold text-green-600">
                                                    ₹{selectedProduct.discount && Number(selectedProduct.price) > 0 
                                                        ? (Number(selectedProduct.discountPrice) > 0 ? Number(selectedProduct.discountPrice) : Number(selectedProduct.price) - (Number(selectedProduct.price) * Number(selectedProduct.discount) / 100))
                                                        : Number(selectedProduct.price)}
                                                </Typography>
                                                {selectedProduct.discount && Number(selectedProduct.price) > 0 && (
                                                    <Typography variant="body2" color="textSecondary" className="line-through">
                                                        ₹{selectedProduct.price}
                                                    </Typography>
                                                )}
                                                {selectedProduct.discount && selectedProduct.discount > 0 && (
                                                    <Chip
                                                        label={`Save ${selectedProduct.discount}%`}
                                                        color="success"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {selectedProduct.description && (
                                            <Typography variant="body1" className="text-gray-700 mb-4">
                                                {selectedProduct.description}
                                            </Typography>
                                        )}

                                        {/* Key Attributes */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="flex items-center gap-2">
                                                <ScaleIcon color="action" />
                                                <div>
                                                    <Typography variant="body2" className="font-semibold">Unit</Typography>
                                                    <Typography variant="body2" color="textSecondary">{selectedProduct.unit || 'kg'}</Typography>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <RestaurantIcon color="action" />
                                                <div>
                                                    <Typography variant="body2" className="font-semibold">Pieces</Typography>
                                                    <Typography variant="body2" color="textSecondary">{selectedProduct.pieces}</Typography>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FitnessCenterIcon color="action" />
                                                <div>
                                                    <Typography variant="body2" className="font-semibold">Serves</Typography>
                                                    <Typography variant="body2" color="textSecondary">{selectedProduct.serves} people</Typography>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DiscountIcon color="action" />
                                                <div>
                                                    <Typography variant="body2" className="font-semibold">Discount</Typography>
                                                    <Typography variant="body2" color="textSecondary">{selectedProduct.discount || 0}%</Typography>
                                                </div>
                                            </div>
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
                                                {selectedProduct.totalEnergy || 0}kcal
                                            </Typography>
                                            <Typography variant="body2" className="text-blue-600">
                                                Total Energy
                                            </Typography>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg text-center">
                                            <Typography variant="h6" className="font-bold text-green-700">
                                                {selectedProduct.carbohydrate || 0}g
                                            </Typography>
                                            <Typography variant="body2" className="text-green-600">
                                                Carbohydrates
                                            </Typography>
                                        </div>

                                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                            <Typography variant="h6" className="font-bold text-yellow-700">
                                                {selectedProduct.fat || 0}g
                                            </Typography>
                                            <Typography variant="body2" className="text-yellow-600">
                                                Fat
                                            </Typography>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                                            <Typography variant="h6" className="font-bold text-purple-700">
                                                {selectedProduct.protein || 0}g
                                            </Typography>
                                            <Typography variant="body2" className="text-purple-600">
                                                Protein
                                            </Typography>
                                        </div>
                                    </div>
                                </div>

                                <Divider className="my-6" />

                                {/* Additional Information */}
                                <div>
                                    <Typography variant="h5" className="font-bold mb-4">
                                        Additional Information
                                    </Typography>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
                                        <div>
                                            <Typography variant="body2" className="text-gray-600">
                                                <span className="font-semibold">Created:</span> {new Date(selectedProduct.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </div>

                                        <div>
                                            <Typography variant="body2" className="text-gray-600">
                                                <span className="font-semibold">Last Updated:</span> {new Date(selectedProduct.updatedAt).toLocaleDateString()}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDetails} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default InventorySubCategories;

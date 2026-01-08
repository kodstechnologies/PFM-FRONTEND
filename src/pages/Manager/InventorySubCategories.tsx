
// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, CardContent, Typography, Box, CircularProgress, Alert, Avatar, IconButton, TextField, Chip, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
// import { Add as AddIcon, Remove as RemoveIcon, Save as SaveIcon, WarningAmber as WarningIcon, Visibility as VisibilityIcon, Star as StarIcon, LocalFireDepartment as LocalFireDepartmentIcon, Restaurant as RestaurantIcon, FitnessCenter as FitnessCenterIcon, Scale as ScaleIcon, Discount as DiscountIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// import API_CONFIG from '../../config/api.config';

// interface Product {
//     _id: string; name: string; img?: string; quantity: number; price: number; discount: number; discountPrice: number; type: any; weight: string; pieces: string; serves: number; totalEnergy: number; carbohydrate: number; fat: number; protein: number; description: string; bestSellers: boolean; quality: string; unit: string; createdAt: string; updatedAt: string;
// }
// interface TypePayload { _id: string; name: string; subCategories: Product[] }
// interface ApiResponse<T> { statusCode: number; success: boolean; message: string; data: T; meta: any | null }

// const normalizeTypeTokens = (raw: any): string[] => {
//     if (!raw) return [];

//     if (typeof raw === 'string') {
//         const cleanText = raw
//             .replace(/\\+/g, '')
//             .replace(/"/g, '')
//             .replace(/\[/g, '')
//             .replace(/\]/g, '')
//             .split(',')
//             .map(s => s.trim())
//             .filter(s => s.length > 0 && !s.match(/^[\[\]\\"]+$/));

//         if (cleanText.length > 0) {
//             return cleanText;
//         }

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

// const InventorySubCategories: React.FC = () => {
//     const { typeId } = useParams<{ typeId: string }>();
//     const navigate = useNavigate();
//     const [typeCat, setTypeCat] = useState<TypePayload | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [saving, setSaving] = useState<string | null>(null);
//     const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//     const [detailsModalOpen, setDetailsModalOpen] = useState(false);

//     const buildApiUrl = useCallback((endpoint: string, ...pathParts: string[]): string => {
//         let url = endpoint;
//         if (url.startsWith('http')) {
//             if (url.startsWith('http//')) {
//                 url = url.replace('http//', 'http://');
//             } else if (url.startsWith('https//')) {
//                 url = url.replace('https//', 'https://');
//             }
//         } else {
//             const base = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL : `${API_CONFIG.BASE_URL}/`;
//             url = `${base}${url.startsWith('/') ? url.slice(1) : url}`;
//         }
//         if (pathParts.length > 0) {
//             const separator = url.endsWith('/') ? '' : '/';
//             url += `${separator}${pathParts.join('/')}`;
//         }
//         try {
//             new URL(url);
//             return url;
//         } catch (e) {
//             console.error('❌ Invalid API URL generated:', url, e);
//             throw new Error(`Invalid API URL: ${url}`);
//         }
//     }, []);

//     const handleAuthError = useCallback((status: number, errorText: string) => {
//         if (status === 401 || errorText.includes('Invalid or expired token')) {
//             localStorage.removeItem('accessToken');
//             localStorage.removeItem('managerUser');
//             navigate('/manager/login', { replace: true });
//             return true;
//         }
//         return false;
//     }, [navigate]);

//     useEffect(() => { fetchData(); }, [typeId]);

//     const fetchData = async () => {
//         if (!typeId) return;
//         try {
//             setLoading(true);
//             setError(null);

//             let token: string | null = localStorage.getItem('accessToken');
//             if (!token) {
//                 try {
//                     const managerUser = localStorage.getItem('managerUser');
//                     if (managerUser) {
//                         const parsed = JSON.parse(managerUser);
//                         token = parsed.accessToken || null;
//                     }
//                 } catch (parseErr) {
//                     console.error('❌ Error parsing managerUser from localStorage:', parseErr);
//                     token = null;
//                 }
//             }

//             if (!token) {
//                 setError('Authentication required. Please log in.');
//                 navigate('/manager/login', { replace: true });
//                 return;
//             }

//             const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.INVENTORY_TYPE_CATEGORY, typeId);
//             const res = await fetch(url, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             if (!res.ok) {
//                 const errorText = await res.text();
//                 if (handleAuthError(res.status, errorText)) return;
//                 throw new Error(`Failed to fetch sub categories: ${res.status} - ${errorText}`);
//             }
//             const data: ApiResponse<TypePayload> = await res.json();

//             let currentManagerId: string | null = null;
//             try {
//                 const managerUser = localStorage.getItem('managerUser');
//                 if (managerUser) {
//                     const parsed = JSON.parse(managerUser);
//                     currentManagerId = parsed?._id || parsed?.id || null;
//                 }
//             } catch { }

//             const normalized = data.data ? {
//                 ...data.data,
//                 subCategories: (data.data.subCategories || []).map((p: any) => {
//                     const qArr = Array.isArray(p.quantity) ? p.quantity : [];
//                     const managerEntry = currentManagerId ? qArr.find((q: any) => String(q.managerId) === String(currentManagerId)) : null;
//                     const unit = (p.unit || 'kg').toLowerCase();
//                     let numericQty = 0;

//                     if (managerEntry) {
//                         if (unit === 'pieces' || unit === 'piece') {
//                             numericQty = managerEntry.count ?? 0;
//                         } else {
//                             numericQty = managerEntry.kg ?? 0;
//                         }
//                     } else {
//                         const first = qArr[0];
//                         if (first) {
//                             if (unit === 'pieces' || unit === 'piece') {
//                                 numericQty = first.count ?? 0;
//                             } else {
//                                 numericQty = first.kg ?? 0;
//                             }
//                         }
//                     }

//                     const localKey = `product_quantity_${p._id}`;
//                     const localQuantityStr = localStorage.getItem(localKey);
//                     if (localQuantityStr !== null) {
//                         numericQty = Number(localQuantityStr);
//                     }

//                     return { ...p, quantity: numericQty } as Product;
//                 })
//             } : null;

//             setTypeCat(normalized);
//         } catch (e: any) {
//             console.error('❌ Error fetching sub categories:', e);
//             setError(e.message || 'Failed to load');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const setLocalQuantity = useCallback((productId: string, newQty: number) => {
//         const localKey = `product_quantity_${productId}`;
//         localStorage.setItem(localKey, newQty.toString());
//         setTypeCat(prev => prev ? {
//             ...prev,
//             subCategories: prev.subCategories.map(p => p._id === productId ? { ...p, quantity: newQty } : p)
//         } : prev);
//     }, []);

//     const saveQuantity = useCallback(async (productId: string, newQty: number) => {
//         try {
//             setSaving(productId);

//             let token: string | null = localStorage.getItem('accessToken');
//             if (!token) {
//                 try {
//                     const managerUser = localStorage.getItem('managerUser');
//                     if (managerUser) {
//                         const parsed = JSON.parse(managerUser);
//                         token = parsed.accessToken || null;
//                     }
//                 } catch (parseErr) {
//                     console.error('❌ Error parsing managerUser for saveQuantity:', parseErr);
//                     token = null;
//                 }
//             }

//             if (!token) {
//                 setError('Authentication required. Please log in.');
//                 navigate('/manager/login', { replace: true });
//                 return;
//             }

//             let currentManagerId: string | null = null;
//             try {
//                 const managerUser = localStorage.getItem('managerUser');
//                 if (managerUser) {
//                     const parsed = JSON.parse(managerUser);
//                     currentManagerId = parsed?._id || parsed?.id || null;
//                 }
//             } catch { }

//             if (!currentManagerId) {
//                 setError('Manager ID not found. Please log in again.');
//                 navigate('/manager/login', { replace: true });
//                 return;
//             }

//             if (!typeId) {
//                 setError('Invalid type ID.');
//                 return;
//             }

//             const product = typeCat?.subCategories.find(p => p._id === productId);
//             if (!product) {
//                 setError('Product not found.');
//                 return;
//             }
//             const unit = (product.unit || 'kg').toLowerCase();
//             let backendValue = newQty;

//             const isPieces = unit === 'pieces' || unit === 'piece';
//             const body = {
//                 count: isPieces ? backendValue : 0,
//                 kg: isPieces ? 0 : backendValue
//             };

//             const url = buildApiUrl('/manager/inventory/type-category', typeId, productId);
//             const res = await fetch(url, {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(body)
//             });

//             if (!res.ok) {
//                 const errorText = await res.text();
//                 if (handleAuthError(res.status, errorText)) return;
//                 throw new Error(`Failed to update quantity: ${res.status} - ${errorText}`);
//             }
//         } catch (e: any) {
//             console.error('❌ Error saving quantity:', e);
//             setError(e.message || 'Failed to update quantity');
//         } finally {
//             setSaving(null);
//         }
//     }, [buildApiUrl, typeId, typeCat, handleAuthError, navigate]);

//     const handleViewDetails = useCallback((product: Product) => {
//         setSelectedProduct(product);
//         setDetailsModalOpen(true);
//     }, []);

//     const handleCloseDetails = useCallback(() => {
//         setDetailsModalOpen(false);
//         setSelectedProduct(null);
//     }, []);

//     const handleBackToTypes = useCallback(() => {
//         if (typeCat) {
//             navigate(-1);
//         } else {
//             navigate('/manager/inventory');
//         }
//     }, [typeCat, navigate]);

//     if (loading) return (<div className="flex justify-center items-center h-64"><CircularProgress /></div>);
//     if (error) return (<Alert severity="error" className="m-4">{error}</Alert>);
//     if (!typeCat) return null;

//     return (
//         <div className="p-6">
//             <div className="flex items-center mb-6">
//                 <IconButton
//                     onClick={handleBackToTypes}
//                     className="mr-2 bg-gray-100 hover:bg-gray-200"
//                 >
//                     <ArrowBackIcon />
//                 </IconButton>
//                 <div>
//                     <Typography variant="h4">Sub Categories</Typography>
//                     <Typography variant="body2" color="textSecondary">Manage sub categories for your products</Typography>
//                 </div>
//             </div>

//             <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' } }}>
//                 {typeCat.subCategories?.map((p) => {
//                     const tokens = normalizeTypeTokens(p.type);
//                     const basePrice = Number(p.price) || 0;
//                     const finalPrice = p.discount && basePrice > 0
//                         ? (Number(p.discountPrice) > 0 ? Number(p.discountPrice) : basePrice - (basePrice * Number(p.discount) / 100))
//                         : basePrice;
//                     const unit = (p.unit || 'kg').toLowerCase();
//                     const qty = Number(p.quantity) || 0;
//                     let inputUnit = unit === 'pieces' ? 'pcs' : 'kg';
//                     let currentDisplay = `${qty} ${inputUnit}`;
//                     return (
//                         <Card key={p._id} className="hover:shadow-md transition-shadow">
//                             <CardContent>
//                                 <div className="flex items-start gap-3">
//                                     <Avatar variant="rounded" src={p.img || ''} alt={p.name} sx={{ width: 72, height: 72 }} />
//                                     <div className="flex-1 min-w-0">
//                                         <Typography variant="subtitle1" className="truncate max-w-[14rem]">{p.name}</Typography>
//                                         <div className="mt-1 flex flex-wrap gap-1">
//                                             {tokens.slice(0, 3).map((t, i) => (<Chip key={i} label={t} size="small" variant="outlined" />))}
//                                         </div>
//                                         <div className="mt-2">
//                                             <Typography variant="body2" fontWeight="medium">
//                                                 {p.discount && basePrice > 0 ? `₹${finalPrice}` : `₹${basePrice}`}
//                                             </Typography>
//                                             {Number(p.discount) > 0 && basePrice > finalPrice && (
//                                                 <Typography variant="caption" color="textSecondary" className="line-through">₹{basePrice}</Typography>
//                                             )}
//                                             <div className="mt-1">
//                                                 <Typography variant="caption" color="textSecondary">
//                                                     Current: {currentDisplay}
//                                                 </Typography>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="mt-4 flex items-center justify-between">
//                                     <div className="flex items-center gap-1">
//                                         <Tooltip title="Decrease"><IconButton size="small" onClick={() => { const current = Number(p.quantity) || 0; const v = Math.max(0, current - 1); setLocalQuantity(p._id, v); saveQuantity(p._id, v); }} disabled={(Number(p.quantity) || 0) <= 0}><RemoveIcon /></IconButton></Tooltip>
//                                         <div className="flex items-center gap-1">
//                                             <TextField size="small" type="number" value={Number(p.quantity) || 0} onChange={(e) => { const v = Math.max(0, Number(e.target.value || 0)); setLocalQuantity(p._id, v); saveQuantity(p._id, v); }} inputProps={{ min: 0, style: { width: 60, textAlign: 'center' } }} />
//                                             <span className="text-xs text-gray-500 font-medium">{inputUnit}</span>
//                                         </div>
//                                         <Tooltip title="Increase"><IconButton size="small" onClick={() => { const current = Number(p.quantity) || 0; const v = current + 1; setLocalQuantity(p._id, v); saveQuantity(p._id, v); }}><AddIcon /></IconButton></Tooltip>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                         <Tooltip title="View Details"><IconButton size="small" color="info" onClick={() => handleViewDetails(p)}><VisibilityIcon /></IconButton></Tooltip>
//                                         <Tooltip title="Save"><IconButton size="small" color="primary" onClick={() => saveQuantity(p._id, Math.max(0, Number(p.quantity) || 0))} disabled={saving === p._id}><SaveIcon /></IconButton></Tooltip>
//                                     </div>
//                                 </div>

//                                 {(p.quantity === 0 || p.quantity < 10) && (
//                                     <Box className="mt-3 flex items-center gap-2">
//                                         <WarningIcon color={p.quantity === 0 ? 'error' : 'warning'} fontSize="small" />
//                                         <Typography variant="caption" color={p.quantity === 0 ? 'error' : 'warning'}>
//                                             {p.quantity === 0 ? 'Out of stock' : 'Low stock, consider restocking'}
//                                         </Typography>
//                                     </Box>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     );
//                 })}
//             </Box>

//             <Dialog
//                 open={detailsModalOpen}
//                 onClose={handleCloseDetails}
//                 maxWidth="md"
//                 fullWidth
//                 className="product-details-modal"
//             >
//                 {selectedProduct && (
//                     <>
//                         <DialogTitle className="flex items-center justify-between">
//                             <Typography variant="h5" className="font-bold text-gray-800">
//                                 Product Details
//                             </Typography>
//                             <IconButton onClick={handleCloseDetails} size="small">
//                                 <span className="sr-only">Close</span>
//                                 ×
//                             </IconButton>
//                         </DialogTitle>
//                         <DialogContent>
//                             <div className="max-w-4xl mx-auto">
//                                 <div className="flex flex-col md:flex-row gap-6 mb-6">
//                                     <div className="flex-shrink-0">
//                                         <img
//                                             src={selectedProduct.img || ''}
//                                             alt={selectedProduct.name}
//                                             className="w-64 h-64 object-contain rounded-lg border"
//                                         />
//                                     </div>

//                                     <div className="flex-grow">
//                                         <div className="flex items-start justify-between mb-4">
//                                             <Typography variant="h4" className="font-bold text-gray-800">
//                                                 {selectedProduct.name}
//                                             </Typography>

//                                             {selectedProduct.bestSellers && (
//                                                 <Chip
//                                                     icon={<StarIcon />}
//                                                     label="Best Seller"
//                                                     color="warning"
//                                                     variant="filled"
//                                                     className="ml-2"
//                                                 />
//                                             )}
//                                         </div>

//                                         <div className="flex flex-wrap gap-2 mb-4">
//                                             {(() => {
//                                                 const normalized = normalizeTypeTokens(selectedProduct.type);
//                                                 return normalized.map((type, index) => (
//                                                     <Chip
//                                                         key={index}
//                                                         label={type}
//                                                         variant="outlined"
//                                                         color="primary"
//                                                     />
//                                                 ));
//                                             })()}
//                                         </div>

//                                         <div className="flex flex-wrap gap-2 mb-4">
//                                             {selectedProduct.discount && selectedProduct.discount > 0 && (
//                                                 <Chip
//                                                     icon={<DiscountIcon />}
//                                                     label={`${selectedProduct.discount}% OFF`}
//                                                     color="success"
//                                                     variant="filled"
//                                                 />
//                                             )}
//                                         </div>


//                                         {selectedProduct.description && (
//                                             <Typography variant="body1" className="text-gray-700 mb-4">
//                                                 {selectedProduct.description}
//                                             </Typography>
//                                         )}

//                                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                             <div className="flex items-center gap-2">
//                                                 <ScaleIcon color="action" />
//                                                 <div>
//                                                     <Typography variant="body2" className="font-semibold">Unit</Typography>
//                                                     <Typography variant="body2" color="textSecondary">{selectedProduct.unit || 'kg'}</Typography>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <RestaurantIcon color="action" />
//                                                 <div>
//                                                     <Typography variant="body2" className="font-semibold">Pieces</Typography>
//                                                     <Typography variant="body2" color="textSecondary">{selectedProduct.pieces}</Typography>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <FitnessCenterIcon color="action" />
//                                                 <div>
//                                                     <Typography variant="body2" className="font-semibold">Serves</Typography>
//                                                     <Typography variant="body2" color="textSecondary">{selectedProduct.serves} people</Typography>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <DiscountIcon color="action" />
//                                                 <div>
//                                                     <Typography variant="body2" className="font-semibold">Discount</Typography>
//                                                     <Typography variant="body2" color="textSecondary">{selectedProduct.discount || 0}%</Typography>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <Divider className="my-6" />

//                                 <div className="mb-6">
//                                     <Typography variant="h5" className="font-bold mb-4 flex items-center gap-2">
//                                         <LocalFireDepartmentIcon className="text-orange-500" />
//                                         Nutrition Information
//                                     </Typography>

//                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                         <div className="bg-blue-50 p-4 rounded-lg text-center">
//                                             <Typography variant="h6" className="font-bold text-blue-700">
//                                                 {selectedProduct.totalEnergy || 0}kcal
//                                             </Typography>
//                                             <Typography variant="body2" className="text-blue-600">
//                                                 Total Energy
//                                             </Typography>
//                                         </div>

//                                         <div className="bg-green-50 p-4 rounded-lg text-center">
//                                             <Typography variant="h6" className="font-bold text-green-700">
//                                                 {selectedProduct.carbohydrate || 0}g
//                                             </Typography>
//                                             <Typography variant="body2" className="text-green-600">
//                                                 Carbohydrates
//                                             </Typography>
//                                         </div>

//                                         <div className="bg-yellow-50 p-4 rounded-lg text-center">
//                                             <Typography variant="h6" className="font-bold text-yellow-700">
//                                                 {selectedProduct.fat || 0}g
//                                             </Typography>
//                                             <Typography variant="body2" className="text-yellow-600">
//                                                 Fat
//                                             </Typography>
//                                         </div>

//                                         <div className="bg-purple-50 p-4 rounded-lg text-center">
//                                             <Typography variant="h6" className="font-bold text-purple-700">
//                                                 {selectedProduct.protein || 0}g
//                                             </Typography>
//                                             <Typography variant="body2" className="text-purple-600">
//                                                 Protein
//                                             </Typography>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <Divider className="my-6" />

//                                 <div>
//                                     <Typography variant="h5" className="font-bold mb-4">
//                                         Additional Information
//                                     </Typography>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
//                                         <div>
//                                             <Typography variant="body2" className="text-gray-600">
//                                                 <span className="font-semibold">Created:</span> {new Date(selectedProduct.createdAt).toLocaleDateString()}
//                                             </Typography>
//                                         </div>

//                                         <div>
//                                             <Typography variant="body2" className="text-gray-600">
//                                                 <span className="font-semibold">Last Updated:</span> {new Date(selectedProduct.updatedAt).toLocaleDateString()}
//                                             </Typography>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={handleCloseDetails} color="primary">
//                                 Close
//                             </Button>
//                         </DialogActions>
//                     </>
//                 )}
//             </Dialog>
//         </div>
//     );
// };

// export default InventorySubCategories;

// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, CardContent, Typography, Box, CircularProgress, Alert, Avatar, IconButton, TextField, Chip, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
// import { Add as AddIcon, Remove as RemoveIcon, Save as SaveIcon, WarningAmber as WarningIcon, Visibility as VisibilityIcon, Star as StarIcon, LocalFireDepartment as LocalFireDepartmentIcon, Restaurant as RestaurantIcon, FitnessCenter as FitnessCenterIcon, Scale as ScaleIcon, Discount as DiscountIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// import API_CONFIG from '../../config/api.config';

// interface Product {
//     _id: string; name: string; img?: string; quantity: number; price: number; discount: number; discountPrice: number; type: any; weight: string; pieces: string; serves: number; totalEnergy: number; carbohydrate: number; fat: number; protein: number; description: string; bestSellers: boolean; quality: string; unit: string; createdAt: string; updatedAt: string;
// }
// interface TypePayload { _id: string; name: string; subCategories: Product[] }
// interface ApiResponse<T> { statusCode: number; success: boolean; message: string; data: T; meta: any | null }

// const normalizeTypeTokens = (raw: any): string[] => {
//     if (!raw) return [];

//     if (typeof raw === 'string') {
//         const cleanText = raw
//             .replace(/\\+/g, '')
//             .replace(/"/g, '')
//             .replace(/\[/g, '')
//             .replace(/\]/g, '')
//             .split(',')
//             .map(s => s.trim())
//             .filter(s => s.length > 0 && !s.match(/^[\[\]\\"]+$/));

//         if (cleanText.length > 0) {
//             return cleanText;
//         }

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

// const InventorySubCategories: React.FC = () => {
//     const { typeId } = useParams<{ typeId: string }>();
//     const navigate = useNavigate();
//     const [typeCat, setTypeCat] = useState<TypePayload | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [saving, setSaving] = useState<string | null>(null);
//     const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//     const [detailsModalOpen, setDetailsModalOpen] = useState(false);

//     const buildApiUrl = useCallback((endpoint: string, ...pathParts: string[]): string => {
//         let url = endpoint;
//         if (url.startsWith('http')) {
//             if (url.startsWith('http//')) {
//                 url = url.replace('http//', 'http://');
//             } else if (url.startsWith('https//')) {
//                 url = url.replace('https//', 'https://');
//             }
//         } else {
//             const base = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL : `${API_CONFIG.BASE_URL}/`;
//             url = `${base}${url.startsWith('/') ? url.slice(1) : url}`;
//         }
//         if (pathParts.length > 0) {
//             const separator = url.endsWith('/') ? '' : '/';
//             url += `${separator}${pathParts.join('/')}`;
//         }
//         try {
//             new URL(url);
//             return url;
//         } catch (e) {
//             console.error('❌ Invalid API URL generated:', url, e);
//             throw new Error(`Invalid API URL: ${url}`);
//         }
//     }, []);

//     const handleAuthError = useCallback((status: number, errorText: string) => {
//         if (status === 401 || errorText.includes('Invalid or expired token')) {
//             localStorage.removeItem('accessToken');
//             localStorage.removeItem('managerUser');
//             navigate('/manager/login', { replace: true });
//             return true;
//         }
//         return false;
//     }, [navigate]);

//     useEffect(() => { fetchData(); }, [typeId]);

//     const fetchData = async () => {
//         if (!typeId) return;
//         try {
//             setLoading(true);
//             setError(null);

//             let token: string | null = localStorage.getItem('accessToken');
//             if (!token) {
//                 try {
//                     const managerUser = localStorage.getItem('managerUser');
//                     if (managerUser) {
//                         const parsed = JSON.parse(managerUser);
//                         token = parsed.accessToken || null;
//                     }
//                 } catch (parseErr) {
//                     console.error('❌ Error parsing managerUser from localStorage:', parseErr);
//                     token = null;
//                 }
//             }

//             if (!token) {
//                 setError('Authentication required. Please log in.');
//                 navigate('/manager/login', { replace: true });
//                 return;
//             }

//             const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.INVENTORY_TYPE_CATEGORY, typeId);
//             const res = await fetch(url, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             if (!res.ok) {
//                 const errorText = await res.text();
//                 if (handleAuthError(res.status, errorText)) return;
//                 throw new Error(`Failed to fetch sub categories: ${res.status} - ${errorText}`);
//             }
//             const data: ApiResponse<TypePayload> = await res.json();

//             let currentManagerId: string | null = null;
//             try {
//                 const managerUser = localStorage.getItem('managerUser');
//                 if (managerUser) {
//                     const parsed = JSON.parse(managerUser);
//                     currentManagerId = parsed?._id || parsed?.id || null;
//                 }
//             } catch { }

//             const normalized = data.data ? {
//                 ...data.data,
//                 subCategories: (data.data.subCategories || []).map((p: any) => {
//                     const qArr = Array.isArray(p.quantity) ? p.quantity : [];
//                     const managerEntry = currentManagerId ? qArr.find((q: any) => String(q.managerId) === String(currentManagerId)) : null;
//                     const unit = (p.unit || 'kg').toLowerCase();
//                     let numericQty = 0;

//                     if (managerEntry) {
//                         if (unit === 'pieces' || unit === 'piece') {
//                             numericQty = managerEntry.count ?? 0;
//                         } else {
//                             numericQty = managerEntry.kg ?? 0;
//                         }
//                     } else {
//                         const first = qArr[0];
//                         if (first) {
//                             if (unit === 'pieces' || unit === 'piece') {
//                                 numericQty = first.count ?? 0;
//                             } else {
//                                 numericQty = first.kg ?? 0;
//                             }
//                         }
//                     }

//                     const localKey = `product_quantity_${p._id}`;
//                     const localQuantityStr = localStorage.getItem(localKey);
//                     if (localQuantityStr !== null) {
//                         numericQty = Number(localQuantityStr);
//                     }

//                     return { ...p, quantity: numericQty } as Product;
//                 })
//             } : null;

//             setTypeCat(normalized);
//         } catch (e: any) {
//             console.error('❌ Error fetching sub categories:', e);
//             setError(e.message || 'Failed to load');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const setLocalQuantity = useCallback((productId: string, newQty: number) => {
//         const localKey = `product_quantity_${productId}`;
//         localStorage.setItem(localKey, newQty.toString());
//         setTypeCat(prev => prev ? {
//             ...prev,
//             subCategories: prev.subCategories.map(p => p._id === productId ? { ...p, quantity: newQty } : p)
//         } : prev);
//     }, []);

//     const saveQuantity = useCallback(async (productId: string, newQty: number) => {
//         try {
//             setSaving(productId);

//             let token: string | null = localStorage.getItem('accessToken');
//             if (!token) {
//                 try {
//                     const managerUser = localStorage.getItem('managerUser');
//                     if (managerUser) {
//                         const parsed = JSON.parse(managerUser);
//                         token = parsed.accessToken || null;
//                     }
//                 } catch (parseErr) {
//                     console.error('❌ Error parsing managerUser for saveQuantity:', parseErr);
//                     token = null;
//                 }
//             }

//             if (!token) {
//                 setError('Authentication required. Please log in.');
//                 navigate('/manager/login', { replace: true });
//                 return;
//             }

//             let currentManagerId: string | null = null;
//             try {
//                 const managerUser = localStorage.getItem('managerUser');
//                 if (managerUser) {
//                     const parsed = JSON.parse(managerUser);
//                     currentManagerId = parsed?._id || parsed?.id || null;
//                 }
//             } catch { }

//             if (!currentManagerId) {
//                 setError('Manager ID not found. Please log in again.');
//                 navigate('/manager/login', { replace: true });
//                 return;
//             }

//             if (!typeId) {
//                 setError('Invalid type ID.');
//                 return;
//             }

//             const product = typeCat?.subCategories.find(p => p._id === productId);
//             if (!product) {
//                 setError('Product not found.');
//                 return;
//             }
//             const unit = (product.unit || 'kg').toLowerCase();
//             let backendValue = newQty;

//             const isPieces = unit === 'pieces' || unit === 'piece';
//             const body = {
//                 managerId: currentManagerId,
//                 count: isPieces ? backendValue : 0,
//                 kg: isPieces ? 0 : backendValue
//             };

//             const url = buildApiUrl('/manager/inventory/type-category', typeId, productId);
//             const res = await fetch(url, {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(body)
//             });

//             if (!res.ok) {
//                 const errorText = await res.text();
//                 if (handleAuthError(res.status, errorText)) return;
//                 throw new Error(`Failed to update quantity: ${res.status} - ${errorText}`);
//             }
//         } catch (e: any) {
//             console.error('❌ Error saving quantity:', e);
//             setError(e.message || 'Failed to update quantity');
//         } finally {
//             setSaving(null);
//         }
//     }, [buildApiUrl, typeId, typeCat, handleAuthError, navigate]);

//     const handleViewDetails = useCallback((product: Product) => {
//         setSelectedProduct(product);
//         setDetailsModalOpen(true);
//     }, []);

//     const handleCloseDetails = useCallback(() => {
//         setDetailsModalOpen(false);
//         setSelectedProduct(null);
//     }, []);

//     const handleBackToTypes = useCallback(() => {
//         if (typeCat) {
//             navigate(-1);
//         } else {
//             navigate('/manager/inventory');
//         }
//     }, [typeCat, navigate]);

//     if (loading) return (<div className="flex justify-center items-center h-64"><CircularProgress /></div>);
//     if (error) return (<Alert severity="error" className="m-4">{error}</Alert>);
//     if (!typeCat) return null;

//     return (
//         <div className="p-6">
//             <div className="flex items-center mb-6">
//                 <IconButton
//                     onClick={handleBackToTypes}
//                     className="mr-2 bg-gray-100 hover:bg-gray-200"
//                 >
//                     <ArrowBackIcon />
//                 </IconButton>
//                 <div>
//                     <Typography variant="h4">Sub Categories</Typography>
//                     <Typography variant="body2" color="textSecondary">Manage sub categories for your products</Typography>
//                 </div>
//             </div>

//             <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' } }}>
//                 {typeCat.subCategories?.map((p) => {
//                     const tokens = normalizeTypeTokens(p.type);
//                     const basePrice = Number(p.price) || 0;
//                     const finalPrice = p.discount && basePrice > 0
//                         ? (Number(p.discountPrice) > 0 ? Number(p.discountPrice) : basePrice - (basePrice * Number(p.discount) / 100))
//                         : basePrice;
//                     const unit = (p.unit || 'kg').toLowerCase();
//                     const qty = Number(p.quantity) || 0;
//                     let inputUnit = unit === 'pieces' ? 'pcs' : 'kg';
//                     let currentDisplay = `${qty} ${inputUnit}`;
//                     return (
//                         <Card key={p._id} className="hover:shadow-md transition-shadow">
//                             <CardContent>
//                                 <div className="flex items-start gap-3">
//                                     <Avatar variant="rounded" src={p.img || ''} alt={p.name} sx={{ width: 72, height: 72 }} />
//                                     <div className="flex-1 min-w-0">
//                                         <Typography variant="subtitle1" className="truncate max-w-[14rem]">{p.name}</Typography>
//                                         <div className="mt-1 flex flex-wrap gap-1">
//                                             {tokens.slice(0, 3).map((t, i) => (<Chip key={i} label={t} size="small" variant="outlined" />))}
//                                         </div>
//                                         <div className="mt-2">
//                                             <Typography variant="body2" fontWeight="medium">
//                                                 {p.discount && basePrice > 0 ? `₹${finalPrice}` : `₹${basePrice}`}
//                                             </Typography>
//                                             {Number(p.discount) > 0 && basePrice > finalPrice && (
//                                                 <Typography variant="caption" color="textSecondary" className="line-through">₹{basePrice}</Typography>
//                                             )}
//                                             <div className="mt-1">
//                                                 <Typography variant="caption" color="textSecondary">
//                                                     Current: {currentDisplay}
//                                                 </Typography>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="mt-4 flex items-center justify-between">
//                                     <div className="flex items-center gap-1">
//                                         <Tooltip title="Decrease"><IconButton size="small" onClick={() => { const current = Number(p.quantity) || 0; const v = Math.max(0, current - 1); setLocalQuantity(p._id, v); saveQuantity(p._id, v); }} disabled={(Number(p.quantity) || 0) <= 0}><RemoveIcon /></IconButton></Tooltip>
//                                         <div className="flex items-center gap-1">
//                                             <TextField size="small" type="number" value={Number(p.quantity) || 0} onChange={(e) => { const v = Math.max(0, Number(e.target.value || 0)); setLocalQuantity(p._id, v); saveQuantity(p._id, v); }} inputProps={{ min: 0, style: { width: 60, textAlign: 'center' } }} />
//                                             <span className="text-xs text-gray-500 font-medium">{inputUnit}</span>
//                                         </div>
//                                         <Tooltip title="Increase"><IconButton size="small" onClick={() => { const current = Number(p.quantity) || 0; const v = current + 1; setLocalQuantity(p._id, v); saveQuantity(p._id, v); }}><AddIcon /></IconButton></Tooltip>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                         <Tooltip title="View Details"><IconButton size="small" color="info" onClick={() => handleViewDetails(p)}><VisibilityIcon /></IconButton></Tooltip>
//                                         <Tooltip title="Save"><IconButton size="small" color="primary" onClick={() => saveQuantity(p._id, Math.max(0, Number(p.quantity) || 0))} disabled={saving === p._id}><SaveIcon /></IconButton></Tooltip>
//                                     </div>
//                                 </div>

//                                 {(p.quantity === 0 || p.quantity < 10) && (
//                                     <Box className="mt-3 flex items-center gap-2">
//                                         <WarningIcon color={p.quantity === 0 ? 'error' : 'warning'} fontSize="small" />
//                                         <Typography variant="caption" color={p.quantity === 0 ? 'error' : 'warning'}>
//                                             {p.quantity === 0 ? 'Out of stock' : 'Low stock, consider restocking'}
//                                         </Typography>
//                                     </Box>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     );
//                 })}
//             </Box>

//             <Dialog
//                 open={detailsModalOpen}
//                 onClose={handleCloseDetails}
//                 maxWidth="md"
//                 fullWidth
//                 className="product-details-modal"
//             >
//                 {selectedProduct && (
//                     <>
//                         <DialogTitle className="flex items-center justify-between">
//                             <Typography variant="h5" className="font-bold text-gray-800">
//                                 Product Details
//                             </Typography>
//                             <IconButton onClick={handleCloseDetails} size="small">
//                                 <span className="sr-only">Close</span>
//                                 ×
//                             </IconButton>
//                         </DialogTitle>
//                         <DialogContent>
//                             <div className="max-w-4xl mx-auto">
//                                 <div className="flex flex-col md:flex-row gap-6 mb-6">
//                                     <div className="flex-shrink-0">
//                                         <img
//                                             src={selectedProduct.img || ''}
//                                             alt={selectedProduct.name}
//                                             className="w-64 h-64 object-contain rounded-lg border"
//                                         />
//                                     </div>

//                                     <div className="flex-grow">
//                                         <div className="flex items-start justify-between mb-4">
//                                             <Typography variant="h4" className="font-bold text-gray-800">
//                                                 {selectedProduct.name}
//                                             </Typography>

//                                             {selectedProduct.bestSellers && (
//                                                 <Chip
//                                                     icon={<StarIcon />}
//                                                     label="Best Seller"
//                                                     color="warning"
//                                                     variant="filled"
//                                                     className="ml-2"
//                                                 />
//                                             )}
//                                         </div>

//                                         <div className="flex flex-wrap gap-2 mb-4">
//                                             {(() => {
//                                                 const normalized = normalizeTypeTokens(selectedProduct.type);
//                                                 return normalized.map((type, index) => (
//                                                     <Chip
//                                                         key={index}
//                                                         label={type}
//                                                         variant="outlined"
//                                                         color="primary"
//                                                     />
//                                                 ));
//                                             })()}
//                                         </div>

//                                         <div className="flex flex-wrap gap-2 mb-4">
//                                             {selectedProduct.discount && selectedProduct.discount > 0 && (
//                                                 <Chip
//                                                     icon={<DiscountIcon />}
//                                                     label={`${selectedProduct.discount}% OFF`}
//                                                     color="success"
//                                                     variant="filled"
//                                                 />
//                                             )}
//                                         </div>


//                                         {selectedProduct.description && (
//                                             <Typography variant="body1" className="text-gray-700 mb-4">
//                                                 {selectedProduct.description}
//                                             </Typography>
//                                         )}

//                                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                             <div className="flex items-center gap-2">
//                                                 <ScaleIcon color="action" />
//                                                 <div>
//                                                     <Typography variant="body2" className="font-semibold">Unit</Typography>
//                                                     <Typography variant="body2" color="textSecondary">{selectedProduct.unit || 'kg'}</Typography>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <RestaurantIcon color="action" />
//                                                 <div>
//                                                     <Typography variant="body2" className="font-semibold">Pieces</Typography>
//                                                     <Typography variant="body2" color="textSecondary">{selectedProduct.pieces}</Typography>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <FitnessCenterIcon color="action" />
//                                                 <div>
//                                                     <Typography variant="body2" className="font-semibold">Serves</Typography>
//                                                     <Typography variant="body2" color="textSecondary">{selectedProduct.serves} people</Typography>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <DiscountIcon color="action" />
//                                                 <div>
//                                                     <Typography variant="body2" className="font-semibold">Discount</Typography>
//                                                     <Typography variant="body2" color="textSecondary">{selectedProduct.discount || 0}%</Typography>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <Divider className="my-6" />

//                                 <div className="mb-6">
//                                     <Typography variant="h5" className="font-bold mb-4 flex items-center gap-2">
//                                         <LocalFireDepartmentIcon className="text-orange-500" />
//                                         Nutrition Information
//                                     </Typography>

//                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                         <div className="bg-blue-50 p-4 rounded-lg text-center">
//                                             <Typography variant="h6" className="font-bold text-blue-700">
//                                                 {selectedProduct.totalEnergy || 0}kcal
//                                             </Typography>
//                                             <Typography variant="body2" className="text-blue-600">
//                                                 Total Energy
//                                             </Typography>
//                                         </div>

//                                         <div className="bg-green-50 p-4 rounded-lg text-center">
//                                             <Typography variant="h6" className="font-bold text-green-700">
//                                                 {selectedProduct.carbohydrate || 0}g
//                                             </Typography>
//                                             <Typography variant="body2" className="text-green-600">
//                                                 Carbohydrates
//                                             </Typography>
//                                         </div>

//                                         <div className="bg-yellow-50 p-4 rounded-lg text-center">
//                                             <Typography variant="h6" className="font-bold text-yellow-700">
//                                                 {selectedProduct.fat || 0}g
//                                             </Typography>
//                                             <Typography variant="body2" className="text-yellow-600">
//                                                 Fat
//                                             </Typography>
//                                         </div>

//                                         <div className="bg-purple-50 p-4 rounded-lg text-center">
//                                             <Typography variant="h6" className="font-bold text-purple-700">
//                                                 {selectedProduct.protein || 0}g
//                                             </Typography>
//                                             <Typography variant="body2" className="text-purple-600">
//                                                 Protein
//                                             </Typography>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <Divider className="my-6" />

//                                 <div>
//                                     <Typography variant="h5" className="font-bold mb-4">
//                                         Additional Information
//                                     </Typography>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
//                                         <div>
//                                             <Typography variant="body2" className="text-gray-600">
//                                                 <span className="font-semibold">Created:</span> {new Date(selectedProduct.createdAt).toLocaleDateString()}
//                                             </Typography>
//                                         </div>

//                                         <div>
//                                             <Typography variant="body2" className="text-gray-600">
//                                                 <span className="font-semibold">Last Updated:</span> {new Date(selectedProduct.updatedAt).toLocaleDateString()}
//                                             </Typography>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={handleCloseDetails} color="primary">
//                                 Close
//                             </Button>
//                         </DialogActions>
//                     </>
//                 )}
//             </Dialog>
//         </div>
//     );
// };

// export default InventorySubCategories;

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CircularProgress, Alert, Avatar, IconButton, TextField, Chip, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Save as SaveIcon, WarningAmber as WarningIcon, Visibility as VisibilityIcon, Star as StarIcon, LocalFireDepartment as LocalFireDepartmentIcon, Restaurant as RestaurantIcon, FitnessCenter as FitnessCenterIcon, Scale as ScaleIcon, Discount as DiscountIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import API_CONFIG from '../../config/api.config';

interface Product {
    _id: string; name: string; img?: string; quantity: number; price: number; discount: number; discountPrice: number; type: any; weight: string; pieces: string; serves: number; totalEnergy: number; carbohydrate: number; fat: number; protein: number; description: string; bestSellers: boolean; quality: string; unit: string; createdAt: string; updatedAt: string;
}
interface TypePayload { _id: string; name: string; subCategories: Product[] }
interface ApiResponse<T> { statusCode: number; success: boolean; message: string; data: T; meta: any | null }

const normalizeTypeTokens = (raw: any): string[] => {
    if (!raw) return [];

    if (typeof raw === 'string') {
        const cleanText = raw
            .replace(/\\+/g, '')
            .replace(/"/g, '')
            .replace(/\[/g, '')
            .replace(/\]/g, '')
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.match(/^[\[\]\\"]+$/));

        if (cleanText.length > 0) {
            return cleanText;
        }

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
    const [saving, setSaving] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    const buildApiUrl = useCallback((endpoint: string, ...pathParts: string[]): string => {
        let url = endpoint;
        if (url.startsWith('http')) {
            if (url.startsWith('http//')) {
                url = url.replace('http//', 'http://');
            } else if (url.startsWith('https//')) {
                url = url.replace('https//', 'https://');
            }
        } else {
            const base = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL : `${API_CONFIG.BASE_URL}/`;
            url = `${base}${url.startsWith('/') ? url.slice(1) : url}`;
        }
        if (pathParts.length > 0) {
            const separator = url.endsWith('/') ? '' : '/';
            url += `${separator}${pathParts.join('/')}`;
        }
        try {
            new URL(url);
            return url;
        } catch (e) {
            console.error('❌ Invalid API URL generated:', url, e);
            throw new Error(`Invalid API URL: ${url}`);
        }
    }, []);

    const handleAuthError = useCallback((status: number, errorText: string) => {
        if (status === 401 || errorText.includes('Invalid or expired token')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('managerUser');
            navigate('/manager/login', { replace: true });
            return true;
        }
        return false;
    }, [navigate]);

    useEffect(() => { fetchData(); }, [typeId]);

    const fetchData = async () => {
        if (!typeId) return;
        try {
            setLoading(true);
            setError(null);

            let token: string | null = localStorage.getItem('accessToken');
            if (!token) {
                try {
                    const managerUser = localStorage.getItem('managerUser');
                    if (managerUser) {
                        const parsed = JSON.parse(managerUser);
                        token = parsed.accessToken || null;
                    }
                } catch (parseErr) {
                    console.error('❌ Error parsing managerUser from localStorage:', parseErr);
                    token = null;
                }
            }

            if (!token) {
                setError('Authentication required. Please log in.');
                navigate('/manager/login', { replace: true });
                return;
            }

            const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.INVENTORY_TYPE_CATEGORY, typeId);
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                const errorText = await res.text();
                if (handleAuthError(res.status, errorText)) return;
                throw new Error(`Failed to fetch sub categories: ${res.status} - ${errorText}`);
            }
            const data: ApiResponse<TypePayload> = await res.json();

            let currentManagerId: string | null = null;
            try {
                const managerUser = localStorage.getItem('managerUser');
                if (managerUser) {
                    const parsed = JSON.parse(managerUser);
                    currentManagerId = parsed?._id || parsed?.id || null;
                }
            } catch { }

            const normalized = data.data ? {
                ...data.data,
                subCategories: (data.data.subCategories || []).map((p: any) => {
                    const qArr = Array.isArray(p.quantity) ? p.quantity : [];
                    const managerEntry = currentManagerId ? qArr.find((q: any) => String(q.managerId) === String(currentManagerId)) : null;
                    const unit = (p.unit || 'kg').toLowerCase();
                    let numericQty = 0;

                    if (managerEntry) {
                        if (unit === 'pieces' || unit === 'piece') {
                            numericQty = managerEntry.count ?? 0;
                        } else {
                            numericQty = managerEntry.kg ?? 0;
                        }
                    } else {
                        const first = qArr[0];
                        if (first) {
                            if (unit === 'pieces' || unit === 'piece') {
                                numericQty = first.count ?? 0;
                            } else {
                                numericQty = first.kg ?? 0;
                            }
                        }
                    }

                    const localKey = `product_quantity_${p._id}`;
                    const localQuantityStr = localStorage.getItem(localKey);
                    if (localQuantityStr !== null) {
                        numericQty = Number(localQuantityStr);
                    }

                    return { ...p, quantity: numericQty } as Product;
                })
            } : null;

            setTypeCat(normalized);
        } catch (e: any) {
            console.error('❌ Error fetching sub categories:', e);
            setError(e.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    };

    const setLocalQuantity = useCallback((productId: string, newQty: number) => {
        const localKey = `product_quantity_${productId}`;
        localStorage.setItem(localKey, newQty.toString());
        setTypeCat(prev => prev ? {
            ...prev,
            subCategories: prev.subCategories.map(p => p._id === productId ? { ...p, quantity: newQty } : p)
        } : prev);
    }, []);

    const saveQuantity = useCallback(async (productId: string, newQty: number) => {
        try {
            setSaving(productId);

            let token: string | null = localStorage.getItem('accessToken');
            if (!token) {
                try {
                    const managerUser = localStorage.getItem('managerUser');
                    if (managerUser) {
                        const parsed = JSON.parse(managerUser);
                        token = parsed.accessToken || null;
                    }
                } catch (parseErr) {
                    console.error('❌ Error parsing managerUser for saveQuantity:', parseErr);
                    token = null;
                }
            }

            if (!token) {
                setError('Authentication required. Please log in.');
                navigate('/manager/login', { replace: true });
                return;
            }

            let currentManagerId: string | null = null;
            try {
                const managerUser = localStorage.getItem('managerUser');
                if (managerUser) {
                    const parsed = JSON.parse(managerUser);
                    currentManagerId = parsed?._id || parsed?.id || null;
                }
            } catch { }

            if (!currentManagerId) {
                setError('Manager ID not found. Please log in again.');
                navigate('/manager/login', { replace: true });
                return;
            }

            if (!typeId) {
                setError('Invalid type ID.');
                return;
            }
            const managerUserRaw = localStorage.getItem("managerUser");

            let storeID = null;

            if (managerUserRaw) {
                const managerUser = JSON.parse(managerUserRaw);
                storeID = managerUser.storeId;
            }

            console.log("🚀 ~ InventorySubCategories ~ storeID ======:", storeID);

            const product = typeCat?.subCategories.find(p => p._id === productId);
            if (!product) {
                setError('Product not found.');
                return;
            }
            const unit = (product.unit || 'kg').toLowerCase();
            let backendValue = newQty;

            const isPieces = unit === 'pieces' || unit === 'piece';
            const body = {
                managerId: currentManagerId,
                count: isPieces ? backendValue : 0,
                kg: isPieces ? 0 : backendValue
            };

            const url = buildApiUrl('/manager/inventory/type-category', storeID, productId);
            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const errorText = await res.text();
                if (handleAuthError(res.status, errorText)) return;
                throw new Error(`Failed to update quantity: ${res.status} - ${errorText}`);
            }
        } catch (e: any) {
            console.error('❌ Error saving quantity:', e);
            setError(e.message || 'Failed to update quantity');
        } finally {
            setSaving(null);
        }
    }, [buildApiUrl, typeId, typeCat, handleAuthError, navigate]);

    const handleViewDetails = useCallback((product: Product) => {
        setSelectedProduct(product);
        setDetailsModalOpen(true);
    }, []);

    const handleCloseDetails = useCallback(() => {
        setDetailsModalOpen(false);
        setSelectedProduct(null);
    }, []);

    const handleBackToTypes = useCallback(() => {
        if (typeCat) {
            navigate(-1);
        } else {
            navigate('/manager/inventory');
        }
    }, [typeCat, navigate]);

    if (loading) return (<div className="flex justify-center items-center h-64"><CircularProgress /></div>);
    if (error) return (<Alert severity="error" className="m-4">{error}</Alert>);
    if (!typeCat) return null;

    return (
        <div className="p-6">
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
                    const tokens = normalizeTypeTokens(p.type);
                    const basePrice = Number(p.price) || 0;
                    const finalPrice = p.discount && basePrice > 0
                        ? (Number(p.discountPrice) > 0 ? Number(p.discountPrice) : basePrice - (basePrice * Number(p.discount) / 100))
                        : basePrice;
                    const unit = (p.unit || 'kg').toLowerCase();
                    const qty = Number(p.quantity) || 0;
                    let inputUnit = unit === 'pieces' ? 'pcs' : 'kg';
                    let currentDisplay = `${qty} ${inputUnit}`;
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
                                            {Number(p.discount) > 0 && basePrice > finalPrice && (
                                                <Typography variant="caption" color="textSecondary" className="line-through">₹{basePrice}</Typography>
                                            )}
                                            <div className="mt-1">
                                                <Typography variant="caption" color="textSecondary">
                                                    Current: {currentDisplay}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Tooltip title="Decrease"><IconButton size="small" onClick={() => { const current = Number(p.quantity) || 0; const v = Math.max(0, current - 1); setLocalQuantity(p._id, v); saveQuantity(p._id, v); }} disabled={(Number(p.quantity) || 0) <= 0}><RemoveIcon /></IconButton></Tooltip>
                                        <div className="flex items-center gap-1">
                                            <TextField size="small" type="number" value={Number(p.quantity) || 0} onChange={(e) => { const v = Math.max(0, Number(e.target.value || 0)); setLocalQuantity(p._id, v); saveQuantity(p._id, v); }} inputProps={{ min: 0, style: { width: 60, textAlign: 'center' } }} />
                                            <span className="text-xs text-gray-500 font-medium">{inputUnit}</span>
                                        </div>
                                        <Tooltip title="Increase"><IconButton size="small" onClick={() => { const current = Number(p.quantity) || 0; const v = current + 1; setLocalQuantity(p._id, v); saveQuantity(p._id, v); }}><AddIcon /></IconButton></Tooltip>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Tooltip title="View Details"><IconButton size="small" color="info" onClick={() => handleViewDetails(p)}><VisibilityIcon /></IconButton></Tooltip>
                                        <Tooltip title="Save"><IconButton size="small" color="primary" onClick={() => saveQuantity(p._id, Math.max(0, Number(p.quantity) || 0))} disabled={saving === p._id}><SaveIcon /></IconButton></Tooltip>
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
                                <div className="flex flex-col md:flex-row gap-6 mb-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={selectedProduct.img || ''}
                                            alt={selectedProduct.name}
                                            className="w-64 h-64 object-contain rounded-lg border"
                                        />
                                    </div>

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
                                                const normalized = normalizeTypeTokens(selectedProduct.type);
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


                                        {selectedProduct.description && (
                                            <Typography variant="body1" className="text-gray-700 mb-4">
                                                {selectedProduct.description}
                                            </Typography>
                                        )}

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
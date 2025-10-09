// import React, { useEffect, useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { Card, CardContent, Typography, Box, CircularProgress, Alert, Avatar, Button, IconButton } from '@mui/material';
// import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// import API_CONFIG from '../../config/api.config';

// interface TypeCategory { _id: string; name: string; img?: string }
// interface CategoryPayload { _id: string; name: string; typeCategories: TypeCategory[] }
// interface ApiResponse<T> { statusCode: number; success: boolean; message: string; data: T; meta: any | null }

// const InventoryTypes: React.FC = () => {
//     const { categoryId } = useParams<{ categoryId: string }>();
//     const navigate = useNavigate();
//     const [category, setCategory] = useState<CategoryPayload | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => { fetchData(); }, [categoryId]);

//     const fetchData = async () => {
//         if (!categoryId) return;
//         try {
//             setLoading(true); setError(null);
//             const accessToken = localStorage.getItem('accessToken');
//             const managerUser = localStorage.getItem('managerUser');
//             const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);
//             if (!token) { setError('Authentication required. Please log in.'); return; }

//             const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.INVENTORY_CATEGORY}/${categoryId}`, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             if (!res.ok) throw new Error('Failed to fetch type categories');
//             const data: ApiResponse<CategoryPayload> = await res.json();
//             setCategory(data.data || null);
//         } catch (e: any) {
//             setError(e.message || 'Failed to load');
//         } finally { setLoading(false); }
//     };

//     const handleBackToInventory = () => {
//         // Navigate back to the main inventory page
//         navigate('/manager/inventory');
//     };

//     if (loading) return (<div className="flex justify-center items-center h-64"><CircularProgress /></div>);
//     if (error) return (<Alert severity="error" className="m-4">{error}</Alert>);
//     if (!category) return null;

//     return (
//         <div className="p-6">
//             {/* Header with back button */}
//             <div className="flex items-center mb-6">
//                 <IconButton
//                     onClick={handleBackToInventory}
//                     className="mr-2 bg-gray-100 hover:bg-gray-200"
//                 >
//                     <ArrowBackIcon />
//                 </IconButton>
//                 <div>
//                     <Typography variant="h4">Type Categories</Typography>
//                     <Typography variant="body2" color="textSecondary">Select a type category to view sub categories</Typography>
//                 </div>
//             </div>

//             <Box sx={{
//                 display: 'grid', gap: 3,
//                 gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
//                 '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
//                 '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
//                 '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
//             }}>
//                 {category.typeCategories?.map((type) => (
//                     <Card key={type._id} className="hover:shadow-md transition-shadow">
//                         <CardContent className="flex flex-col items-center">
//                             <Avatar src={type.img || ''} alt={type.name} sx={{ width: 96, height: 96, mb: 2 }} />
//                             <Typography variant="h6" className="text-center">{type.name}</Typography>
//                             <Button className="mt-3" variant="outlined" component={Link} to={`/manager/inventory/type/${type._id}/subcategories`}>
//                                 View Sub Categories
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </Box>
//         </div>
//     );
// };

// export default InventoryTypes;


import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CircularProgress, Alert, Avatar, Button, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import API_CONFIG from '../../config/api.config';

interface TypeCategory { _id: string; name: string; img?: string }
interface CategoryPayload { _id: string; name: string; typeCategories: TypeCategory[] }
interface ApiResponse<T> { statusCode: number; success: boolean; message: string; data: T; meta: any | null }

const InventoryTypes: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<CategoryPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper to build API URLs safely (handles relative/absolute endpoints, avoids double concat)
    const buildApiUrl = useCallback((endpoint: string, ...pathParts: string[]): string => {
        let url = endpoint;
        // If endpoint is absolute (starts with http(s)), use as-is but fix common typos like missing ':'
        if (url.startsWith('http')) {
            if (url.startsWith('http//')) {
                url = url.replace('http//', 'http://');  // Fix typo for http
            } else if (url.startsWith('https//')) {
                url = url.replace('https//', 'https://');  // Fix the exact typo seen in logs
            }
        } else {
            // Relative: prepend BASE_URL
            const base = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL : `${API_CONFIG.BASE_URL}/`;
            url = `${base}${url.startsWith('/') ? url.slice(1) : url}`;
        }
        // Append path parts if provided
        if (pathParts.length > 0) {
            const separator = url.endsWith('/') ? '' : '/';
            url += `${separator}${pathParts.join('/')}`;
        }
        // Validate URL
        try {
            new URL(url);
            console.log('🔗 Built API URL:', url);  // Debug: Confirm correct URL
            return url;
        } catch (e) {
            console.error('❌ Invalid API URL generated:', url, e);
            throw new Error(`Invalid API URL: ${url}`);
        }
    }, []);

    useEffect(() => { fetchData(); }, [categoryId]);

    const fetchData = async () => {
        if (!categoryId) return;
        try {
            setLoading(true);
            setError(null);

            // Get auth token (with safer parsing)
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
                return;
            }

            const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.INVENTORY_CATEGORY, categoryId);
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch type categories: ${res.status} - ${errorText}`);
            }
            const data: ApiResponse<CategoryPayload> = await res.json();
            setCategory(data.data || null);
            console.log('✅ Type categories fetched successfully:', data.data);
        } catch (e: any) {
            console.error('❌ Error fetching type categories:', e);
            setError(e.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToInventory = () => {
        // Navigate back to the main inventory page
        navigate('/manager/inventory');
    };

    if (loading) return (<div className="flex justify-center items-center h-64"><CircularProgress /></div>);
    if (error) return (<Alert severity="error" className="m-4">{error}</Alert>);
    if (!category) return null;

    return (
        <div className="p-6">
            {/* Header with back button */}
            <div className="flex items-center mb-6">
                <IconButton
                    onClick={handleBackToInventory}
                    className="mr-2 bg-gray-100 hover:bg-gray-200"
                >
                    <ArrowBackIcon />
                </IconButton>
                <div>
                    <Typography variant="h4">Type Categories</Typography>
                    <Typography variant="body2" color="textSecondary">Select a type category to view sub categories</Typography>
                </div>
            </div>

            <Box sx={{
                display: 'grid', gap: 3,
                gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
                '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
                '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
            }}>
                {category.typeCategories?.map((type) => (
                    <Card key={type._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="flex flex-col items-center">
                            <Avatar src={type.img || ''} alt={type.name} sx={{ width: 96, height: 96, mb: 2 }} />
                            <Typography variant="h6" className="text-center">{type.name}</Typography>
                            <Button className="mt-3" variant="outlined" component={Link} to={`/manager/inventory/type/${type._id}/subcategories`}>
                                View Sub Categories
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </div>
    );
};

export default InventoryTypes;
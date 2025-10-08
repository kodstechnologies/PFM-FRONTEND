import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CircularProgress, Alert, Avatar, Button } from '@mui/material';
import API_CONFIG from '../../config/api.config';

interface TypeCategory { _id: string; name: string; img?: string; }
interface Category { _id: string; name: string; img?: string; typeCategories: TypeCategory[] }
interface ApiResponse<T> { statusCode: number; success: boolean; message: string; data: T; meta: any | null }

const Inventory: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const managerUser = localStorage.getItem('managerUser');
            const accessToken = localStorage.getItem('accessToken');
            const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);
            if (!token) { setError('Authentication required. Please log in.'); return; }

            const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.INVENTORY}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data: ApiResponse<Category[]> = await res.json();
            setCategories(data.data || []);
        } catch (e: any) {
            setError(e.message || 'Failed to load');
        } finally { setLoading(false); }
    };

    if (loading) return (<div className="flex justify-center items-center h-64"><CircularProgress /></div>);
    if (error) return (<Alert severity="error" className="m-4">{error}</Alert>);

    return (
        <div className="p-6">
            <div className="mb-6">
                <Typography variant="h4">Product Categories</Typography>
                <Typography variant="body2" color="textSecondary">Select a category to view type categories</Typography>
            </div>

            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Typography variant="subtitle1" className="mt-2">No categories found</Typography>
                </div>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                    gap: 3,
                    '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
                    '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
                    '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
                }}>
                    {categories.map((cat) => (
                        <Card key={cat._id} className="hover:shadow-md transition-shadow">
                            <CardContent className="flex flex-col items-center">
                                <Avatar src={cat.img || ''} alt={cat.name} sx={{ width: 96, height: 96, mb: 2 }} />
                                <Typography variant="h6" className="text-center">{cat.name}</Typography>
                                <Button
                                    className="mt-3"
                                    variant="outlined"
                                    component={Link}
                                    to={`/manager/inventory/${cat._id}/types`}
                                >
                                    View Type Categories
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </div>
    );
};

export default Inventory;

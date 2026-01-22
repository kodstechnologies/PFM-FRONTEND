import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IconButton, Menu, MenuItem, Card, CardContent, Typography, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import callApi from '../../../../util/admin_api';
import { AxiosResponse } from 'axios';
import NavigateBtn from '../../../../components/button/NavigateBtn';
// Define API response type
interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta: any | null;
}
interface TypeCategory {
    _id: string;
    name: string;
    img?: string;
    description?: string;
}
interface UserData {
    token?: string;
}
const TypeCategoriesDisplay: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedItem, setSelectedItem] = useState<TypeCategory | null>(null);
    const [typeCategories, setTypeCategories] = useState<TypeCategory[]>([]);
    const [filteredTypeCategories, setFilteredTypeCategories] = useState<TypeCategory[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { categoriesId: id } = useParams<{ categoriesId: string }>();
    console.log("🚀 ~ TypeCategoriesDisplay ~ location:", location);
    console.log('🚀 ~ TypeCategoriesDisplay ~ id from params:', id);
    // Fetch type categories from API
    useEffect(() => {
        const fetchTypeCategories = async () => {
            if (!id) {
                toast.error('Category ID is missing. Please try again.', {
                    toastId: 'missing-category-id-error',
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate('/categories');
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
                const response: AxiosResponse<ApiResponse<TypeCategory[]>> = await callApi(
                    `/admin/type-categories/${id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (!response.data.success || !Array.isArray(response.data.data)) {
                    throw new Error(response.data.message || 'Failed to fetch type categories');
                }
                setTypeCategories(response.data.data);
                setFilteredTypeCategories(response.data.data);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch type categories';
                console.error('Error fetching type categories:', errorMessage);
                toast.error(errorMessage, {
                    toastId: 'fetch-type-categories-error',
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
        fetchTypeCategories();
    }, [navigate, id]);
    // Handle search input change
    useEffect(() => {
        const filtered = typeCategories.filter((category) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredTypeCategories(filtered);
    }, [searchQuery, typeCategories]);
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: TypeCategory) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    };
    const handleEdit = () => {
        if (selectedItem) {
            navigate(`/type/categories/edit/${selectedItem._id}`, {
                state: { typeCategory: selectedItem, categoryId: id }
            });
        }
        handleClose();
    };
    const handleDelete = async () => {
        if (!selectedItem) return;
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${selectedItem.name}"?`
        );
        if (!confirmDelete) return;
        try {
            const userDataString = localStorage.getItem('superAdminUser');
            const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
            const token = userData.token;
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }
            const response: AxiosResponse<ApiResponse<any>> = await callApi(
                `/admin/type-categories/${selectedItem._id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to delete type category');
            }
            setTypeCategories((prev) => prev.filter((item) => item._id !== selectedItem._id));
            setFilteredTypeCategories((prev) => prev.filter((item) => item._id !== selectedItem._id));
            toast.success('Type category deleted successfully!', {
                toastId: 'delete-type-category-success',
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete type category';
            console.error('Error deleting type category:', errorMessage);
            toast.error(errorMessage, {
                toastId: 'delete-type-category-error',
                position: 'top-right',
                autoClose: 3000,
            });
        }
        handleClose();
    };
    const getTypeCategoryImage = (typeCategory: TypeCategory): string | undefined => {
        // Use the MongoDB image if available and valid
        if (typeCategory.img && typeof typeCategory.img === 'string' && typeCategory.img.startsWith('http')) {
            return typeCategory.img;
        }
        // Return undefined instead of a default image
        return undefined;
    };
    if (loading) {
        return (
            <div className="py-6">
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
                        <div className="w-full">
                            <h1 className="text-2xl font-bold text-gray-800">Type Categories</h1>
                        </div>
                        <NavigateBtn
                            to={`/type/categories/add/${id}`}
                            state={{ categoryId: id }}
                            label={
                                <span className="flex items-center gap-1 w-[12rem]">
                                    <AddIcon fontSize="small" />
                                    <span>Add New Type Category</span>
                                </span>
                            }
                        />
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F47C7C]"></div>
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
                                onClick={() => navigate('/categories')}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowBackIcon fontSize="small" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Type Categories</h1>
                                <p className="text-sm text-gray-600">Select a type category to view sub categories</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <TextField
                                label="Search Type Categories"
                                variant="outlined"
                                size="small"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64"
                                placeholder="Search by name or description"
                            />
                            <NavigateBtn
                                to={`/type/categories/add/${id}`}
                                state={{ categoryId: id }}
                                label={
                                    <span className="flex items-center gap-1 w-[12rem]">
                                        <AddIcon fontSize="small" />
                                        <span>Add New Type Category</span>
                                    </span>
                                }
                            />
                        </div>
                    </div>
                </div>
                {filteredTypeCategories.length === 0 ? (
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
                            <h3 className="mt-2 text-lg font-medium text-gray-900">
                                {searchQuery ? 'No matching type categories found' : 'No type categories found'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchQuery
                                    ? 'Try adjusting your search terms.'
                                    : 'Get started by adding your first type category.'}
                            </p>
                            <div className="mt-6">
                                <NavigateBtn
                                    to={`/type/categories/add/${id}`}
                                    state={{ categoryId: id }}
                                    label="Add New Type Category"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredTypeCategories.map((item) => (
                            <Card key={item._id} className="relative hover:shadow-lg transition-shadow">
                                <div className="absolute top-2 right-2">
                                    <IconButton
                                        aria-label="more"
                                        aria-controls={`menu-${item._id}`}
                                        aria-haspopup="true"
                                        onClick={(e) => handleMenuClick(e, item)}
                                        size="small"
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </div>
                                <Link
                                    to={`/sub/categories/${item._id}`}
                                    state={{ typeId: item._id, categoryId: id }}
                                >
                                    <CardContent className="flex flex-col items-center p-4">
                                        <div className="w-32 h-32 mb-4 flex items-center justify-center">
                                            {getTypeCategoryImage(item) ? (
                                                <img
                                                    src={getTypeCategoryImage(item)}
                                                    alt={item.name}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center border rounded bg-gray-50 text-gray-500 text-sm">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <Typography variant="h6" className="text-center font-medium">
                                            {item.name}
                                        </Typography>
                                        {item.description && (
                                            <Typography variant="body2" className="text-center text-gray-600 mt-2">
                                                {item.description}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
                <Menu
                    id="type-category-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            width: '120px',
                        },
                    }}
                >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete} className="text-red-500">
                        Delete
                    </MenuItem>
                </Menu>
            </div>
        </>
    );
};
export default TypeCategoriesDisplay;
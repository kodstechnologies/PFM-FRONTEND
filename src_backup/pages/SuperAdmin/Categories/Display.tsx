
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { IconButton, Menu, MenuItem, Card, CardContent, Typography } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import NavigateBtn from '../../../components/button/NavigateBtn';
// import AddIcon from '@mui/icons-material/Add';
// import { toast, ToastContainer } from 'react-toastify';
// import callApi from '../../../util/admin_api';
// import { AxiosResponse } from 'axios';

// // Default image (use a single fallback image if specific imports are unavailable)

// // Define API response type
// interface ApiResponse<T> {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: T;
//   meta: any | null;
// }

// interface CategoryItem {
//   _id: string;
//   name: string;
//   img?: string;
//   description?: string;
//   status?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// const DisplayCategories: React.FC = () => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
//   const [categories, setCategories] = useState<CategoryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         const userData = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
//         const token = userData.token;
//         if (!token) {
//           throw new Error('No authentication token found. Please log in.');
//         }

//         const response: AxiosResponse<ApiResponse<CategoryItem[]>> = await callApi('/admin/product-categories', {
//           method: 'GET',
//         });

//         if (!response.data.success || !Array.isArray(response.data.data)) {
//           throw new Error(response.data.message || 'Invalid API response format');
//         }

//         console.log('Categories data:', response.data.data);
//         setCategories(response.data.data);
//       } catch (error: any) {
//         console.error('Error fetching categories:', error.message);
//         toast.error(error.message || 'Failed to fetch categories.');
//         if (error.message.includes('token') || error.message.includes('Unauthorized')) {
//           localStorage.removeItem('superAdminUser');
//           navigate('/admin/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, [navigate]);

//   const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: CategoryItem) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedItem(item);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setSelectedItem(null);
//   };

//   const handleEdit = () => {
//     if (selectedItem) {
//       console.log('Navigating to edit:', selectedItem);
//       navigate(`/categories/edit`, {
//         state: { category: selectedItem },
//       });
//     }
//     handleClose();
//   };

//   const handleDelete = async () => {
//     if (!selectedItem) return;

//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete "${selectedItem.name}"?`
//     );

//     if (!confirmDelete) return;

//     try {
//       const userData = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
//       const token = userData.token;
//       if (!token) {
//         throw new Error('No authentication token found. Please log in.');
//       }

//       const response: AxiosResponse<ApiResponse<any>> = await callApi(`/admin/product-categories/${selectedItem._id}`, {
//         method: 'DELETE',
//       });

//       if (!response.data.success) {
//         throw new Error(response.data.message || 'Failed to delete category');
//       }

//       setCategories((prev) => prev.filter((item) => item._id !== selectedItem._id));
//       toast.success('Product category deleted successfully!', {
//         toastId: 'delete-category-success',
//       });
//     } catch (error: any) {
//       console.error('Error deleting category:', error.message);
//       toast.error(error.message || 'Failed to delete category.');
//       if (error.message.includes('token') || error.message.includes('Unauthorized')) {
//         localStorage.removeItem('superAdminUser');
//         navigate('/admin/login');
//       }
//     }

//     handleClose();
//   };

//   const getCategoryImage = (category: CategoryItem) => {
//     // Use the MongoDB image if available and valid
//     if (category.img && typeof category.img === 'string' && category.img.startsWith('http')) {
//       return category.img;
//     }

//     // Fallback to default image
//     return defaultImg;
//   };

//   if (loading) {
//     return (
//       <div className="py-6">
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
//             <div className="w-full">
//               <h1 className="text-2xl font-bold text-gray-800">Product Categories</h1>
//             </div>
//             <NavigateBtn
//               to="/categories/add"
//               label={
//                 <span className="flex items-center gap-1 w-[12rem]">
//                   <AddIcon fontSize="small" />
//                   <span>Add New Category</span>
//                 </span>
//               }
//             />
//           </div>
//         </div>
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F47C7C]"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer />
//       <div className="py-6">
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
//             <div className="w-full">
//               <h1 className="text-2xl font-bold text-gray-800">Product Categories</h1>
//             </div>
//             <NavigateBtn
//               to="/categories/add"
//               label={
//                 <span className="flex items-center gap-1 w-[12rem]">
//                   <AddIcon fontSize="small" />
//                   <span>Add New Category</span>
//                 </span>
//               }
//             />
//           </div>
//         </div>

//         {categories.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="mx-auto max-w-md">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1}
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">No categories found</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Get started by adding your first product category.
//               </p>
//               <div className="mt-6">
//                 <NavigateBtn
//                   to="/categories/add"
//                   label="Add New Category"
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
//                 />
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//             {categories.map((item) => (

//               <Card key={item._id} className="relative hover:shadow-lg transition-shadow">
//                 <div className="absolute top-2 right-2">
//                   <IconButton
//                     aria-label="more"
//                     aria-controls={`menu-${item._id}`}
//                     aria-haspopup="true"
//                     onClick={(e) => handleMenuClick(e, item)}
//                     size="small"
//                   >
//                     <MoreVertIcon />
//                   </IconButton>
//                 </div>
//                 <Link to={`/type/categories`}
//                   state={{ id: item._id }}>
//                   <CardContent className="flex flex-col items-center p-4 bg-gradient-to-r">
//                     <div className="w-32 h-32 mb-4 flex items-center justify-center">
//                       <img
//                         src={getCategoryImage(item)}
//                         alt={item.name}
//                         className="max-w-full max-h-full object-contain"
//                       />
//                     </div>
//                     <Typography variant="h6" className="text-center font-medium">
//                       {item.name}
//                     </Typography>
//                     {item.description && (
//                       <Typography variant="body2" className="text-center text-gray-600 mt-2">
//                         {item.description}
//                       </Typography>
//                     )}
//                   </CardContent>
//                 </Link>
//               </Card>
//             ))}
//           </div>
//         )}

//         <Menu
//           id="category-menu"
//           anchorEl={anchorEl}
//           keepMounted
//           open={Boolean(anchorEl)}
//           onClose={handleClose}
//           PaperProps={{
//             style: {
//               width: '120px',
//             },
//           }}
//         >
//           <MenuItem onClick={handleEdit}>Edit</MenuItem>
//           <MenuItem onClick={handleDelete} className="text-red-500">
//             Delete
//           </MenuItem>
//         </Menu>
//       </div>
//     </>
//   );
// };

// export default DisplayCategories;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem, Card, CardContent, Typography, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NavigateBtn from '../../../components/button/NavigateBtn';
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from 'react-toastify';
import callApi from '../../../util/admin_api';
import { AxiosResponse } from 'axios';

// Default image (use a single fallback image if specific imports are unavailable)
const defaultImg = '/path/to/default/image.jpg';

// Define API response type
interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta: any | null;
}

interface CategoryItem {
  _id: string;
  name: string;
  img?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const DisplayCategories: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
        const token = userData.token;
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response: AxiosResponse<ApiResponse<CategoryItem[]>> = await callApi('/admin/product-categories', {
          method: 'GET',
        });

        if (!response.data.success || !Array.isArray(response.data.data)) {
          throw new Error(response.data.message || 'Invalid API response format');
        }

        console.log('Categories data:', response.data.data);
        setCategories(response.data.data);
        setFilteredCategories(response.data.data);
      } catch (error: any) {
        console.error('Error fetching categories:', error.message);
        toast.error(error.message || 'Failed to fetch categories.');
        if (error.message.includes('token') || error.message.includes('Unauthorized')) {
          localStorage.removeItem('superAdminUser');
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  // Handle search input change
  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: CategoryItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleEdit = () => {
    if (selectedItem) {
      console.log('Navigating to edit:', selectedItem);
      navigate(`/categories/edit`, {
        state: { category: selectedItem },
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
      const userData = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
      const token = userData.token;
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response: AxiosResponse<ApiResponse<any>> = await callApi(`/admin/product-categories/${selectedItem._id}`, {
        method: 'DELETE',
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete category');
      }

      setCategories((prev) => prev.filter((item) => item._id !== selectedItem._id));
      toast.success('Product category deleted successfully!', {
        toastId: 'delete-category-success',
      });
    } catch (error: any) {
      console.error('Error deleting category:', error.message);
      toast.error(error.message || 'Failed to delete category.');
      if (error.message.includes('token') || error.message.includes('Unauthorized')) {
        localStorage.removeItem('superAdminUser');
        navigate('/admin/login');
      }
    }

    handleClose();
  };

  const getCategoryImage = (category: CategoryItem) => {
    if (category.img && typeof category.img === 'string' && category.img.startsWith('http')) {
      return category.img;
    }
    return defaultImg;
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
            <div className="w-full">
              <h1 className="text-2xl font-bold text-gray-800">Product Categories</h1>
            </div>
            <NavigateBtn
              to="/categories/add"
              label={
                <span className="flex items-center gap-1 w-[12rem]">
                  <AddIcon fontSize="small" />
                  <span>Add New Category</span>
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
      <ToastContainer />
      <div className="py-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5">
            <div className="w-full">
              <h1 className="text-2xl font-bold text-gray-800">Product Categories</h1>
            </div>
            <div className="flex gap-4">
              <TextField
                label="Search Categories"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64"
                placeholder="Search by name or description"
              />
              <NavigateBtn
                to="/categories/add"
                label={
                  <span className="flex items-center gap-1 w-[10rem]">
                    <AddIcon fontSize="small" />
                    <span>Add New Category</span>
                  </span>
                }
              />
            </div>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
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
                {searchQuery ? 'No matching categories found' : 'No categories found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search terms.'
                  : 'Get started by adding your first product category.'}
              </p>
              <div className="mt-6">
                <NavigateBtn
                  to="/categories/add"
                  label="Add New Category"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCategories.map((item) => (
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
                <Link to={`/type/categories`} state={{ id: item._id }}>
                  <CardContent className="flex flex-col items-center p-4 bg-gradient-to-r">
                    <div className="w-32 h-32 mb-4 flex items-center justify-center">
                      <img
                        src={getCategoryImage(item)}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                      />
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
          id="category-menu"
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

export default DisplayCategories;
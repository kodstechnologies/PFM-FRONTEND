

// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import NavigateBtn from '../../../components/button/NavigateBtn';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SubmitButton from '../../../components/button/SubmitBtn';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import ClearIcon from '@mui/icons-material/Clear';
// import callApi from '../../../util/admin_api';
// import { AxiosResponse } from 'axios';

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
//   img: string;
//   description?: string;
// }

// interface FormInputs {
//   productName: string;
//   productImage: FileList | null;
// }

// const EditCategory: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();
//   console.log("🚀 ~ EditCategory ~ location:", location)
//   const navigate = useNavigate();
//   const category = location.state?.category as CategoryItem | undefined;
//   const [categoryData, setCategoryData] = useState<CategoryItem | null>(category || null);
//   const [preview, setPreview] = useState<string | null>(category?.img || null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     watch,
//     setValue,
//   } = useForm<FormInputs>({
//     defaultValues: {
//       productName: category?.name || '',
//       productImage: null,
//     },
//   });

//   // Watch file changes and set preview
//   const fileWatch = watch('productImage');
//   useEffect(() => {
//     if (fileWatch && fileWatch.length > 0) {
//       const file = fileWatch[0];
//       if (file.size > 5 * 1024 * 1024) {
//         // 5MB limit
//         toast.error('Image size must be less than 5MB', {
//           toastId: 'image-size-error',
//           position: 'top-right',
//           autoClose: 3000,
//         });
//         setValue('productImage', null);
//         setPreview(categoryData?.img || null);
//         return;
//       }
//       if (!file.type.startsWith('image/')) {
//         toast.error('Please upload a valid image file', {
//           toastId: 'image-type-error',
//           position: 'top-right',
//           autoClose: 3000,
//         });
//         setValue('productImage', null);
//         setPreview(categoryData?.img || null);
//         return;
//       }
//       const objectUrl = URL.createObjectURL(file);
//       setPreview(objectUrl);
//       return () => URL.revokeObjectURL(objectUrl);
//     }
//   }, [fileWatch, setValue, categoryData]);

//   const onSubmit: SubmitHandler<FormInputs> = async (data) => {
//     if (!data.productName.trim()) {
//       toast.error('Please enter a category name', {
//         toastId: 'edit-category-error',
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       return;
//     }

//     try {
//       const userData = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
//       const token = userData.token;
//       if (!token) {
//         throw new Error('No authentication token found. Please log in.');
//       }

//       const formData = new FormData();
//       formData.append('name', data.productName);
//       if (data.productImage && data.productImage.length > 0) {
//         formData.append('img', data.productImage[0]);
//       }

//       console.log('Updating category:', { id, name: data.productName, img: data.productImage?.[0] });
//       const response: AxiosResponse<ApiResponse<CategoryItem>> = await callApi(
//         `/admin/product-categories/${category?._id}`,
//         {
//           method: 'PATCH',
//           data: formData,
//         }
//       );
//       console.log('Update API response:', response);

//       if (!response.data.success) {
//         throw new Error(response.data.message || 'Failed to update category');
//       }

//       toast.success(`Category ${data.productName} updated successfully!`, {
//         toastId: 'edit-category-success',
//         position: 'top-right',
//         autoClose: 2000,
//         onClose: () => navigate('/categories'),
//       });
//     } catch (error: any) {
//       console.error('Error updating category:', error.message);
//       toast.error(error.message || 'Failed to update category.', {
//         toastId: 'edit-category-error',
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       if (error.message.includes('token') || error.message.includes('Unauthorized')) {
//         localStorage.removeItem('superAdminUser');
//         navigate('/admin/login');
//       }
//     }
//   };

//   if (!categoryData) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p>No category data found. Please go back and try again.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//         style={{ zIndex: 9999 }}
//       />
//       <div className="bg-gradient-to-br px-0 py-8 sm:px-6 md:px-10 min-h-[60vh] min-w-[20rem] max-w-[40rem] m-auto">
//         <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border">
//           {/* Header */}
//           <div className="mb-8 flex items-start justify-between">
//             <h2 className="text-2xl font-bold text-gray-800">Edit : {categoryData.name}</h2>
//             <NavigateBtn
//               to="/categories"
//               label={
//                 <>
//                   {/* Desktop / sm and up */}
//                   <span className="hidden sm:flex items-center gap-1">
//                     <ArrowBackIcon fontSize="small" />
//                     <span>Back to Categories</span>
//                   </span>

//                   {/* Mobile / below sm */}
//                   <span className="flex sm:hidden items-center gap-1">
//                     <ClearIcon fontSize="small" />
//                   </span>
//                 </>
//               }
//               className="text-sm"
//             />
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Product Name */}
//             <div>
//               <label
//                 htmlFor="productName"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Product Name
//               </label>
//               <input
//                 id="productName"
//                 type="text"
//                 {...register('productName', {
//                   required: 'Product name is required',
//                   minLength: { value: 2, message: 'Name must be at least 2 characters' },
//                 })}
//                 className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.productName ? 'border-red-400' : 'border-gray-300'
//                   }`}
//                 placeholder="Enter product name"
//                 aria-invalid={errors.productName ? 'true' : 'false'}
//               />
//               {errors.productName && (
//                 <p className="mt-1 text-xs text-red-600" role="alert">
//                   {errors.productName.message}
//                 </p>
//               )}
//             </div>

//             {/* Product Image Upload */}
//             <div>
//               <label
//                 htmlFor="productImage"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Upload Product Image
//               </label>
//               <input
//                 id="productImage"
//                 type="file"
//                 accept="image/*"
//                 {...register('productImage')}
//                 className={`block w-full px-3 py-2 border rounded-lg text-sm cursor-pointer focus:outline-none ${errors.productImage ? 'border-red-400' : 'border-gray-300'
//                   }`}
//               />
//               {errors.productImage && (
//                 <p className="mt-1 text-xs text-red-600" role="alert">
//                   {errors.productImage.message}
//                 </p>
//               )}

//               {/* Image Preview */}
//               {preview && (
//                 <div className="mt-3">
//                   <p className="text-sm text-gray-600 mb-1">Preview:</p>
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className="h-32 w-32 object-cover rounded border"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center pt-4">
//               <SubmitButton
//                 label={isSubmitting ? 'Updating...' : 'Update Category'}
//                 isSubmitting={isSubmitting}
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditCategory;

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import NavigateBtn from '../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import callApi from '../../../util/admin_api';
import { AxiosResponse } from 'axios';

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
}

interface FormInputs {
  categoryName: string;
  categoryImage: FileList | null;
}

interface UserData {
  token?: string;
}

const EditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category as CategoryItem | undefined;
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      categoryName: category?.name || '',
      categoryImage: null,
    },
  });

  // Initialize preview with existing image
  useEffect(() => {
    if (category?.img && category.img.startsWith('http')) {
      setPreview(category.img);
    }
  }, [category]);

  // Watch file changes and set preview
  const fileWatch = watch('categoryImage');
  useEffect(() => {
    if (fileWatch && fileWatch.length > 0) {
      const file = fileWatch[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error('Image size must be less than 5MB', {
          toastId: 'image-size-error',
          position: 'top-right',
          autoClose: 3000,
        });
        setValue('categoryImage', null);
        setPreview(category?.img || null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file', {
          toastId: 'image-type-error',
          position: 'top-right',
          autoClose: 3000,
        });
        setValue('categoryImage', null);
        setPreview(category?.img || null);
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [fileWatch, setValue, category]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!id && !category?._id) {
      toast.error('No category ID provided.', {
        toastId: 'edit-category-error',
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (!data.categoryName.trim()) {
      toast.error('Please enter a category name', {
        toastId: 'edit-category-error',
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      const userDataString = localStorage.getItem('superAdminUser');
      const userData: UserData = userDataString ? JSON.parse(userDataString) : {};
      const token = userData.token;
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const categoryId = id || category?._id;
      const formData = new FormData();
      formData.append('name', data.categoryName);
      if (data.categoryImage && data.categoryImage.length > 0) {
        formData.append('img', data.categoryImage[0]);
      }

      const response: AxiosResponse<ApiResponse<CategoryItem>> = await callApi(
        `/admin/product-categories/${categoryId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: formData,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update category');
      }

      toast.success(`Category "${data.categoryName}" updated successfully!`, {
        toastId: 'edit-category-success',
        position: 'top-right',
        autoClose: 2000,
        onClose: () => navigate('/categories'),
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
      console.error('Error updating category:', errorMessage);
      toast.error(errorMessage, {
        toastId: 'edit-category-error',
        position: 'top-right',
        autoClose: 3000,
      });
      if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
        localStorage.removeItem('superAdminUser');
        navigate('/admin/login');
      }
    }
  };

  if (!category && !id) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Category not found</h3>
          <p className="mt-1 text-sm text-gray-500">The category you're looking for doesn't exist.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/categories')}
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
      <div className="bg-gradient-to-br px-0 py-8 sm:px-6 md:px-10 min-h-[60vh] min-w-[20rem] max-w-[40rem] m-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Edit Product Category</h2>
            <NavigateBtn
              to="/categories"
              label={
                <>
                  {/* Desktop / sm and up */}
                  <span className="hidden sm:flex items-center gap-1">
                    <ArrowBackIcon fontSize="small" />
                    <span>Back to Categories</span>
                  </span>

                  {/* Mobile / below sm */}
                  <span className="flex sm:hidden items-center gap-1">
                    <ClearIcon fontSize="small" />
                  </span>
                </>
              }
              className="text-sm"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Name */}
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category Name *
              </label>
              <input
                id="categoryName"
                type="text"
                {...register('categoryName', {
                  required: 'Category name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.categoryName ? 'border-red-400' : 'border-gray-300'
                  }`}
                placeholder="Enter category name"
                aria-invalid={errors.categoryName ? 'true' : 'false'}
              />
              {errors.categoryName && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.categoryName.message}
                </p>
              )}
            </div>

            {/* Category Image Upload */}
            <div>
              <label
                htmlFor="categoryImage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Update Category Image (Optional)
              </label>
              <input
                id="categoryImage"
                type="file"
                accept="image/*"
                {...register('categoryImage')}
                className={`block w-full px-3 py-2 border rounded-lg text-sm cursor-pointer focus:outline-none ${errors.categoryImage ? 'border-red-400' : 'border-gray-300'
                  }`}
              />
              {errors.categoryImage && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.categoryImage.message}
                </p>
              )}

              {/* Image Preview */}
              {preview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-white font-semibold transition flex items-center gap-2"
              >
                {isSubmitting ? 'Updating...' : 'Update Category'}
                <EditIcon fontSize="small" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
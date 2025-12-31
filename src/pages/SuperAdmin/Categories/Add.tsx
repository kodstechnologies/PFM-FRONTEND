// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import NavigateBtn from '../../../components/button/NavigateBtn';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SubmitButton from '../../../components/button/SubmitBtn';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
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
// }

// interface FormInputs {
//   productName: string;
//   productImage: FileList | null;
// }

// const AddCategories: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     watch,
//     setValue,
//   } = useForm<FormInputs>({
//     defaultValues: {
//       productName: '',
//       productImage: null,
//     },
//   });

//   const navigate = useNavigate();
//   const [preview, setPreview] = useState<string | null>(null);

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
//         setPreview(null);
//         return;
//       }
//       if (!file.type.startsWith('image/')) {
//         toast.error('Please upload a valid image file', {
//           toastId: 'image-type-error',
//           position: 'top-right',
//           autoClose: 3000,
//         });
//         setValue('productImage', null);
//         setPreview(null);
//         return;
//       }
//       const objectUrl = URL.createObjectURL(file);
//       setPreview(objectUrl);
//       return () => URL.revokeObjectURL(objectUrl);
//     } else {
//       setPreview(null);
//     }
//   }, [fileWatch, setValue]);

//   const onSubmit: SubmitHandler<FormInputs> = async (data) => {
//     if (!data.productName.trim()) {
//       toast.error('Please enter a category name', {
//         toastId: 'add-category-error',
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       return;
//     }

//     if (!data.productImage || data.productImage.length === 0) {
//       toast.error('Please upload a product image', {
//         toastId: 'add-category-error',
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
//       formData.append('img', data.productImage[0]);

//       console.log('Adding category:', { name: data.productName, img: data.productImage[0] });
//       const response: AxiosResponse<ApiResponse<CategoryItem>> = await callApi('/admin/product-categories', {
//         method: 'POST',
//         data: formData,
//       });
//       console.log('Add API response:', response);

//       if (!response.data.success) {
//         throw new Error(response.data.message || 'Failed to add category');
//       }

//       toast.success(`Category ${data.productName} added successfully!`, {
//         toastId: 'add-category-success',
//         position: 'top-right',
//         autoClose: 2000,
//         onClose: () => navigate('/categories'),
//       });
//     } catch (error: any) {
//       console.error('Error adding category:', error.message);
//       toast.error(error.message || 'Failed to add category.', {
//         toastId: 'add-category-error',
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       if (error.message.includes('token') || error.message.includes('Unauthorized')) {
//         localStorage.removeItem('superAdminUser');
//         navigate('/admin/login');
//       }
//     }
//   };

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
//             <h2 className="text-2xl font-bold text-gray-800">Add Product Category</h2>
//             <NavigateBtn
//               to="/categories"
//               label={
//                 <>
//                   {/* Desktop / sm and up */}
//                   <span className="hidden sm:flex items-center gap-1">
//                     <ArrowBackIcon fontSize="small" />
//                     <span>Back to Category</span>
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
//                 {...register('productImage', { required: 'Product image is required' })}
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
//                 label={isSubmitting ? "Submitting..." : "Submit"}
//                 isSubmitting={isSubmitting}
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddCategories;


import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import NavigateBtn from '../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
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
  img: string;
}

interface FormInputs {
  categoryName: string;
  categoryImage: FileList | null;
}

const AddCategories: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      categoryName: '',
      categoryImage: null,
    },
  });

  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

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
        setPreview(null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file', {
          toastId: 'image-type-error',
          position: 'top-right',
          autoClose: 3000,
        });
        setValue('categoryImage', null);
        setPreview(null);
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [fileWatch, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!data.categoryName.trim()) {
      toast.error('Please enter a category name', {
        toastId: 'add-category-error',
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (!data.categoryImage || data.categoryImage.length === 0) {
      toast.error('Please upload a category image', {
        toastId: 'add-category-error',
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      const userDataString = localStorage.getItem('superAdminUser');
      const userData = userDataString ? JSON.parse(userDataString) : {};
      const token = userData.token;
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const formData = new FormData();
      formData.append('name', data.categoryName);
      formData.append('img', data.categoryImage[0]);

      const response: AxiosResponse<ApiResponse<CategoryItem>> = await callApi(
        '/admin/product-categories',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: formData,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add category');
      }

      toast.success(`Category "${data.categoryName}" added successfully!`, {
        toastId: 'add-category-success',
        position: 'top-right',
        autoClose: 2000,
        onClose: () => navigate('/categories'),
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add category';
      console.error('Error adding category:', errorMessage);
      toast.error(errorMessage, {
        toastId: 'add-category-error',
        position: 'top-right',
        autoClose: 3000,
      });
      if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
        localStorage.removeItem('superAdminUser');
        navigate('/admin/login');
      }
    }
  };

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
            <h2 className="text-2xl font-bold text-gray-800">Add Product Category</h2>
            <NavigateBtn
              to="/categories"
              label={
                <>
                  {/* Desktop / sm and up */}
                  <span className="hidden sm:flex items-center gap-1">
                    <ArrowBackIcon fontSize="small" />
                    <span>Back to Category</span>
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
                Upload Category Image *
              </label>
              <input
                id="categoryImage"
                type="file"
                accept="image/*"
                {...register('categoryImage', { required: 'Category image is required' })}
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
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
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
                disabled={isSubmitting || !watch('categoryName').trim()}
                className="bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-white font-semibold transition flex items-center gap-2"
              >
                {isSubmitting ? 'Adding...' : 'Add Category'}
                <AddIcon fontSize="small" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCategories;
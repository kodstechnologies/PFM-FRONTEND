// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import NavigateBtn from '../../../components/button/NavigateBtn';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SubmitButton from '../../../components/button/SubmitBtn';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import ClearIcon from "@mui/icons-material/Clear";

// interface CategoryItem {
//   id: number;
//   name: string;
//   image: string;
//   description?: string;
// }

// interface FormInputs {
//   productName: string;
//   productImage: FileList | null;
// }

// const EditCategory: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const category = location.state?.category as CategoryItem | undefined;

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

//   const [preview, setPreview] = useState<string | null>(category?.image || null);

//   // Pre-populate form with category data
//   useEffect(() => {
//     if (category) {
//       setValue('productName', category.name);
//       setPreview(category.image || null);
//     }
//   }, [category, setValue]);

//   const onSubmit: SubmitHandler<FormInputs> = (data) => {
//     if (!data.productName.trim()) {
//       toast.error('Please enter a category name', {
//         toastId: 'edit-category-error',
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       return;
//     }

//     console.log('Updating category:', {
//       id,
//       name: data.productName,
//       image: data.productImage?.[0] || category?.image,
//     });

//     toast.success(`Category ${data.productName} updated successfully!`, {
//       toastId: 'edit-category-success',
//       position: 'top-right',
//       autoClose: 2000,
//       onClose: () => navigate('/categories'),
//     });
//   };

//   // Watch file changes and set preview
//   const fileWatch = watch('productImage');
//   useEffect(() => {
//     if (fileWatch && fileWatch.length > 0) {
//       const file = fileWatch[0];
//       const objectUrl = URL.createObjectURL(file);
//       setPreview(objectUrl);

//       return () => URL.revokeObjectURL(objectUrl);
//     }
//   }, [fileWatch]);

//   if (!category) {
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
//             <h2 className="text-2xl font-bold text-gray-800">Edit Product Category :{id}</h2>
//             <NavigateBtn
//               to="/categories"
//               label={
//                 <>
//                   {/* Desktop / sm and up */}
//                   <span className="hidden sm:flex items-center gap-1">
//                     <ArrowBackIcon fontSize="small" />
//                     <span>Back to List</span>
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
import NavigateBtn from '../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubmitButton from '../../../components/button/SubmitBtn';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';
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
  description?: string;
}

interface FormInputs {
  productName: string;
  productImage: FileList | null;
}

const EditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  console.log("🚀 ~ EditCategory ~ location:", location)
  const navigate = useNavigate();
  const category = location.state?.category as CategoryItem | undefined;
  const [categoryData, setCategoryData] = useState<CategoryItem | null>(category || null);
  const [preview, setPreview] = useState<string | null>(category?.img || null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      productName: category?.name || '',
      productImage: null,
    },
  });

  // Watch file changes and set preview
  const fileWatch = watch('productImage');
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
        setValue('productImage', null);
        setPreview(categoryData?.img || null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file', {
          toastId: 'image-type-error',
          position: 'top-right',
          autoClose: 3000,
        });
        setValue('productImage', null);
        setPreview(categoryData?.img || null);
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [fileWatch, setValue, categoryData]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!data.productName.trim()) {
      toast.error('Please enter a category name', {
        toastId: 'edit-category-error',
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
      const token = userData.token;
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const formData = new FormData();
      formData.append('name', data.productName);
      if (data.productImage && data.productImage.length > 0) {
        formData.append('img', data.productImage[0]);
      }

      console.log('Updating category:', { id, name: data.productName, img: data.productImage?.[0] });
      const response: AxiosResponse<ApiResponse<CategoryItem>> = await callApi(
        `/admin/product-categories/${category?._id}`,
        {
          method: 'PATCH',
          data: formData,
        }
      );
      console.log('Update API response:', response);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update category');
      }

      toast.success(`Category ${data.productName} updated successfully!`, {
        toastId: 'edit-category-success',
        position: 'top-right',
        autoClose: 2000,
        onClose: () => navigate('/categories'),
      });
    } catch (error: any) {
      console.error('Error updating category:', error.message);
      toast.error(error.message || 'Failed to update category.', {
        toastId: 'edit-category-error',
        position: 'top-right',
        autoClose: 3000,
      });
      if (error.message.includes('token') || error.message.includes('Unauthorized')) {
        localStorage.removeItem('superAdminUser');
        navigate('/admin/login');
      }
    }
  };

  if (!categoryData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No category data found. Please go back and try again.</p>
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
            <h2 className="text-2xl font-bold text-gray-800">Edit : {categoryData.name}</h2>
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
            {/* Product Name */}
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                {...register('productName', {
                  required: 'Product name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.productName ? 'border-red-400' : 'border-gray-300'
                  }`}
                placeholder="Enter product name"
                aria-invalid={errors.productName ? 'true' : 'false'}
              />
              {errors.productName && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.productName.message}
                </p>
              )}
            </div>

            {/* Product Image Upload */}
            <div>
              <label
                htmlFor="productImage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Product Image
              </label>
              <input
                id="productImage"
                type="file"
                accept="image/*"
                {...register('productImage')}
                className={`block w-full px-3 py-2 border rounded-lg text-sm cursor-pointer focus:outline-none ${errors.productImage ? 'border-red-400' : 'border-gray-300'
                  }`}
              />
              {errors.productImage && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.productImage.message}
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
              <SubmitButton
                label={isSubmitting ? 'Updating...' : 'Update Category'}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
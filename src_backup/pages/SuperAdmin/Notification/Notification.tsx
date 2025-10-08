// import React from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import NavigateBtn from '../../../components/button/NavigateBtn';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SubmitButton from '../../../components/button/SubmitBtn';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import ClearIcon from "@mui/icons-material/Clear";


// interface FormInputs {
//   title: string;
//   body: string;
// }

// const Notification: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<FormInputs>({
//     defaultValues: {
//       title: '',
//       body: '',
//     },
//   });

//   const navigate = useNavigate();

//   const onSubmit: SubmitHandler<FormInputs> = (data) => {
//     console.log('Form Data:', data);
//     toast.success('Notification sent successfully!');
//     setTimeout(() => {
//       navigate('/super-admin');
//     }, 2000);
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="flex items-center justify-center bg-gradient-to-br to-gray-200 px-0 py-8 sm:px-6 lg:px-8 max-w-[40rem] m-auto">
//         <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border">
//           {/* Header */}
//           <div className="mb-6 sm:mb-8 flex sm:flex-row items-start justify-between gap-4">
//             {/* <div className="flex flex-col sm:flex-row md:items-center items-end sm:justify-between gap-5"> */}
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-800 w-full mb-4">
//               Send Notification
//             </h2>
//             <NavigateBtn
//               to="/super-admin"
//               label={
//                 <>
//                   {/* Desktop / sm and up */}
//                   <span className="hidden sm:flex items-center gap-1 min-w-[7rem]">
//                     <ArrowBackIcon fontSize="small" />
//                     <span>Back to List</span>
//                   </span>

//                   {/* Mobile / below sm */}
//                   <span className="flex sm:hidden items-center gap-1 min-w-[1rem]">
//                     <ClearIcon fontSize="small" />
//                     {/* <span>Back</span> */}
//                   </span>
//                 </>
//               }
//             // className="text-sm font-medium text-blue-600 hover:text-blue-800"
//             />
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
//             {/* Title */}
//             <div>
//               <label
//                 htmlFor="title"
//                 className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
//               >
//                 Title
//               </label>
//               <input
//                 id="title"
//                 type="text"
//                 {...register('title', {
//                   required: 'Title is required',
//                   minLength: {
//                     value: 2,
//                     message: 'Title must be at least 2 characters',
//                   },
//                 })}
//                 className={`block w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.title ? 'border-red-400' : 'border-gray-300'
//                   }`}
//                 placeholder="Enter title"
//                 aria-invalid={errors.title ? 'true' : 'false'}
//               />
//               {errors.title && (
//                 <p className="mt-1 text-xs text-red-600" role="alert">
//                   {errors.title.message}
//                 </p>
//               )}
//             </div>

//             {/* Body */}
//             <div>
//               <label
//                 htmlFor="body"
//                 className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
//               >
//                 Body
//               </label>
//               <textarea
//                 id="body"
//                 {...register('body', {
//                   required: 'Body is required',
//                   minLength: {
//                     value: 2,
//                     message: 'Body must be at least 2 characters',
//                   },
//                 })}
//                 className={`block w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.body ? 'border-red-400' : 'border-gray-300'
//                   }`}
//                 placeholder="Enter body"
//                 aria-invalid={errors.body ? 'true' : 'false'}
//                 rows={4}
//               />
//               {errors.body && (
//                 <p className="mt-1 text-xs text-red-600" role="alert">
//                   {errors.body.message}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center pt-4">
//               <SubmitButton
//                 label="Submit"
//                 isSubmitting={isSubmitting}
//               // className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Notification;


import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import NavigateBtn from '../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubmitButton from '../../../components/button/SubmitBtn';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ClearIcon from "@mui/icons-material/Clear";
import { callApi } from '../../../util/admin_api'; // Adjust the path as needed

interface FormInputs {
  title: string;
  body: string;
}

const Notification: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      title: '',
      body: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      // Call the API to send notification
      await callApi({
        endpoint: '/admin/send-notification-customer',
        method: 'POST',
        data: {
          title: data.title,
          body: data.body
        }
      });

      toast.success('Notification sent successfully!');
      reset(); // Clear the form

      setTimeout(() => {
        navigate('/super-admin');
      }, 2000);
    } catch (error: any) {
      console.error('Failed to send notification:', error);

      // Show appropriate error message
      const errorMessage = error.response?.data?.message || 'Failed to send notification';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center bg-gradient-to-br to-gray-200 px-0 py-8 sm:px-6 lg:px-8 max-w-[40rem] m-auto">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex sm:flex-row items-start justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 w-full mb-4">
              Send Notification
            </h2>
            <NavigateBtn
              to="/super-admin"
              label={
                <>
                  <span className="hidden sm:flex items-center gap-1 min-w-[15rem]">
                    <ArrowBackIcon fontSize="small" />
                    <span>Back to Dashboard</span>
                  </span>
                  <span className="flex sm:hidden items-center gap-1 min-w-[1rem]">
                    <ClearIcon fontSize="small" />
                  </span>
                </>
              }
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 2,
                    message: 'Title must be at least 2 characters',
                  },
                })}
                className={`block w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.title ? 'border-red-400' : 'border-gray-300'
                  }`}
                placeholder="Enter title"
                aria-invalid={errors.title ? 'true' : 'false'}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Body */}
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Body
              </label>
              <textarea
                id="body"
                {...register('body', {
                  required: 'Body is required',
                  minLength: {
                    value: 2,
                    message: 'Body must be at least 2 characters',
                  },
                })}
                className={`block w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.body ? 'border-red-400' : 'border-gray-300'
                  }`}
                placeholder="Enter body"
                aria-invalid={errors.body ? 'true' : 'false'}
                rows={4}
              />
              {errors.body && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.body.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <SubmitButton
                label={isSubmitting ? "Submitting..." : "Submit"}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Notification;
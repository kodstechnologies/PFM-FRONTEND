import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigateBtn from '../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubmitButton from '../../../components/button/SubmitBtn';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';
import callApi from '../../../util/admin_api';

interface FormInputs {
  _id: string;
  name: string;
  phone: string;
  storeId: string;
  status: 'verified' | 'pending' | 'rejected';
}

interface Store {
  _id: string;
  name: string;
}

const DeliveryPartnerEdit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  // Get the delivery partner data from location state
  const { _id, name, phone, storeId, status } = (location.state as FormInputs) || {
    _id: '',
    name: '',
    phone: '',
    storeId: '',
    status: 'pending' as 'verified' | 'pending' | 'rejected',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      _id,
      name,
      phone,
      storeId,
      status,
    },
  });

  // Fetch stores from API
  // useEffect(() => {
  //   const fetchStores = async () => {
  //     try {
  //       setLoadingStores(true);
  //       const response = await callApi("/admin/all-store-name", { method: "GET" });

  //       // Handle different possible response structures
  //       let storesData: Store[] = [];

  //       if (Array.isArray(response)) {
  //         // If response is directly an array
  //         storesData = response;
  //       } else if (response && Array.isArray(response.data)) {
  //         // If response has a data property that is an array
  //         storesData = response.data;
  //       } else if (response && response.data && Array.isArray(response.data.data)) {
  //         // If response has nested data structure
  //         storesData = response.data.data;
  //       }

  //       console.log("Stores data:", storesData);
  //       setStores(storesData);
  //     } catch (error) {
  //       console.error("Error fetching stores:", error);
  //       toast.error("Failed to fetch stores.");
  //     } finally {
  //       setLoadingStores(false);
  //     }
  //   };

  //   fetchStores();
  // }, []);

  // Set the storeId value when stores are loaded
  useEffect(() => {
    if (storeId && stores.length > 0) {
      setValue('storeId', storeId);
    }
  }, [storeId, stores, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      // Call API to update delivery partner
      const reasponse = await callApi(`/admin/update-delevery-partners/${data._id}`, {
        method: "PATCH",
        data: {
          name: data.name,
          phone: data.phone,
          storeId: data.storeId,
          status: data.status
        }
      });
      console.log("🚀 ~ onSubmit ~ reasponse:", reasponse)

      toast.success('Delivery Partner updated successfully!');
      setTimeout(() => {
        navigate('/delivery-partner');
      }, 2000);
    } catch (error) {
      console.error('Error updating delivery partner:', error);
      toast.error('Failed to update delivery partner.');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center bg-gradient-to-br px-0 py-8 sm:px-6 lg:px-8 max-w-[40rem] m-auto">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Edit Delivery Partner
            </h2>
            <NavigateBtn
              to="/delivery-partner"
              label={
                <>
                  {/* Desktop / sm and up */}
                  <span className="hidden sm:flex items-center gap-1">
                    <ArrowBackIcon fontSize="small" />
                    <span>Back to Staff</span>
                  </span>

                  {/* Mobile / below sm */}
                  <span className="flex sm:hidden items-center gap-1">
                    <ClearIcon fontSize="small" />
                    {/* <span>Back</span> */}
                  </span>
                </>
              }
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            {/* ID (hidden) */}
            <input type="hidden" {...register('_id')} />

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                className={`block w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.name ? 'border-red-400' : 'border-gray-300'
                  }`}
                placeholder="Enter name"
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number'
                  }
                })}
                className={`block w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.phone ? 'border-red-400' : 'border-gray-300'
                  }`}
                placeholder="Enter phone number (e.g. 9876543210)"
                aria-invalid={errors.phone ? 'true' : 'false'}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Store Selection Dropdown */}
            {/* <div>
              <label
                htmlFor="storeId"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Store
              </label>
              {loadingStores ? (
                <div className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-gray-500">Loading stores...</p>
                </div>
              ) : stores && stores.length > 0 ? (
                <select
                  id="storeId"
                  {...register('storeId', {
                    required: 'Please select a store',
                  })}
                  className={`block w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.storeId ? 'border-red-400' : 'border-gray-300'
                    }`}
                  aria-invalid={errors.storeId ? 'true' : 'false'}
                >
                  <option value="">Select a store</option>
                  {stores.map((store) => (
                    <option key={store._id} value={store._id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-gray-500">No stores available</p>
                </div>
              )}
              {errors.storeId && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.storeId.message}
                </p>
              )}
            </div> */}

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Status
              </label>
              <select
                id="status"
                {...register('status', {
                  required: 'Status is required',
                })}
                className={`block w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.status ? 'border-red-400' : 'border-gray-300'
                  }`}
                aria-invalid={errors.status ? 'true' : 'false'}
              >
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                {/* <option value="rejected">Rejected</option> */}
              </select>
              {errors.status && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <SubmitButton
                label={isSubmitting ? "Submit..." : "Submit"}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeliveryPartnerEdit;
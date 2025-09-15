import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import NavigateBtn from '../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubmitButton from '../../../components/button/SubmitBtn';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import { callApi } from '../../../util/admin_api';

interface FormInputs {
  name: string;
  phone: string;
  storeId: string;
}

interface Store {
  _id: string;
  name: string;
}

const StoreStaffAdd: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      phone: '',
      storeId: '',
    },
  });

  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const navigate = useNavigate();

  // Fetch stores from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoadingStores(true);
        const response = await callApi({ endpoint: "/admin/all-store-name", method: "GET" });

        // Handle different possible response structures
        let storesData: Store[] = [];

        if (Array.isArray(response)) {
          // If response is directly an array
          storesData = response;
        } else if (response && Array.isArray(response.data)) {
          // If response has a data property that is an array
          storesData = response.data;
        } else if (response && response.data && Array.isArray(response.data.data)) {
          // If response has nested data structure
          storesData = response.data.data;
        }

        console.log("Stores data:", storesData);
        setStores(storesData);
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast.error("Failed to fetch stores.");
      } finally {
        setLoadingStores(false);
      }
    };

    fetchStores();
  }, []);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      console.log('Form Data:', data);

      // Call API to add delivery partner
      await callApi({
        endpoint: "/admin/delivery-partners",
        method: "POST",
        data: data
      });

      toast.success('Delivery partner added successfully!');
      setTimeout(() => {
        navigate('/delivery-partner');
      }, 2000);
    } catch (error) {
      console.error("Error adding delivery partner:", error);
      toast.error("Failed to add delivery partner.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-gradient-to-br px-0 py-8 sm:px-6 md:px-10 min-h-[60vh] max-w-[40rem] m-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Staff
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
              className="text-sm"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Delivery Partner Name
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
                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition mb-2 ${errors.name ? 'border-red-400' : 'border-gray-300'
                  }`}
                placeholder="Enter delivery partner name"
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
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
                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.phone ? 'border-red-400' : 'border-gray-300'
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
            <div>
              <label
                htmlFor="storeId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Store
              </label>
              {loadingStores ? (
                <div className="px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-gray-500">Loading stores...</p>
                </div>
              ) : stores && stores.length > 0 ? (
                <select
                  id="storeId"
                  {...register('storeId', {
                    required: 'Please select a store',
                  })}
                  className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.storeId ? 'border-red-400' : 'border-gray-300'
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
                <div className="px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-gray-500">No stores available</p>
                </div>
              )}
              {errors.storeId && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.storeId.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <SubmitButton
                label={isSubmitting ? "Adding..." : "Submit"}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StoreStaffAdd;
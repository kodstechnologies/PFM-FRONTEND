import React, { useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import NavigateBtn from '../../../components/button/NavigateBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubmitButton from '../../../components/button/SubmitBtn';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import callApi from '../../../util/admin_api';
import type { AxiosResponse } from 'axios';

interface FormInputs {
  name: string;
  location: string;
  managerFirstName: string;
  managerLastName: string;
  // managerEmail: string;
  managerPhone: string;
  storePhone: string;
  latitude: string;
  longitude: string;
  pincode: string;
  products: {
    chicken: boolean;
    mutton: boolean;
    pork: boolean;
    fish: boolean;
    meat: boolean;
  };
}

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta: any | null;
}

const MeatCenterEdit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {
    id: '',
    name: '',
    location: '',
    manager: '',
    lat: '',
    long: '',
    pincode: '',
    products: {
      chicken: false,
      mutton: false,
      pork: false,
      fish: false,
      meat: false,
    },
  };

  const defaultValues = useMemo(() => {
    const [firstName = '', lastName = ''] = state.manager ? state.manager.split(' ') : ['', ''];
    return {
      name: state.name || '',
      location: state.location || '',
      managerFirstName: firstName,
      managerLastName: lastName,
      managerEmail: state.managerEmail || '',
      managerPhone: state.phone || '',
      storePhone: state.storePhone || '',
      latitude: state.lat ? String(state.lat) : '',
      longitude: state.long ? String(state.long) : '',
      pincode: state.pincode || '',
      products: {
        chicken: state.products?.chicken || false,
        mutton: state.products?.mutton || false,
        pork: state.products?.pork || false,
        fish: state.products?.fish || false,
        meat: state.products?.meat || false,
      },
    };
  }, [state]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormInputs>({ defaultValues });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    console.log('Form Data:', data);
    try {
      const response: AxiosResponse<ApiResponse<any>> = await callApi({
        url: `/admin/meat-centers/${state.id}`,
        method: 'PATCH',
        data: {
          storeName: data.name,
          location: data.location,
          managerFirstName: data.managerFirstName,
          managerLastName: data.managerLastName,
          // managerEmail: data.managerEmail,
          managerPhone: data.managerPhone,
          storePhone: data.storePhone,
          latitude: data.latitude,
          longitude: data.longitude,
          pincode: data.pincode,
          products: data.products,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update meat center');
      }

      toast.success('Store updated successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/meat-center');
      }, 2000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update meat center';
      console.error('Error updating meat center:', errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleProductChange = (product: keyof FormInputs['products']) => {
    setValue(`products.${product}`, !watch(`products.${product}`));
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-gradient-to-br px-0 py-8 sm:px-6 md:px-10 min-h-[60vh]">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {state.name ? 'Edit Store' : 'Add New Store'}
            </h2>
            <NavigateBtn
              to="/meat-center"
              label={
                <>
                  {/* Desktop / sm and up */}
                  <span className="hidden sm:flex items-center gap-1">
                    <ArrowBackIcon fontSize="small" />
                    <span>Back to Meat Center</span>
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
            {/* Store Name & Manager Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Store Name *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: 'Store name is required',
                    minLength: {
                      value: 2,
                      message: 'Store name must be at least 2 characters',
                    },
                  })}
                  className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="Enter store name"
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Manager First Name */}
              <div>
                <label
                  htmlFor="managerFirstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Manager First Name *
                </label>
                <input
                  id="managerFirstName"
                  type="text"
                  {...register('managerFirstName', {
                    required: 'Manager first name is required',
                    minLength: {
                      value: 2,
                      message: 'Manager first name must be at least 2 characters',
                    },
                  })}
                  className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.managerFirstName ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="Enter manager first name"
                  aria-invalid={errors.managerFirstName ? 'true' : 'false'}
                />
                {errors.managerFirstName && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.managerFirstName.message}
                  </p>
                )}
              </div>

              {/* Manager Last Name */}
              <div>
                <label
                  htmlFor="managerLastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Manager Last Name *
                </label>
                <input
                  id="managerLastName"
                  type="text"
                  {...register('managerLastName', {
                    required: 'Manager last name is required',
                    minLength: {
                      value: 2,
                      message: 'Manager last name must be at least 2 characters',
                    },
                  })}
                  className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.managerLastName ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="Enter manager last name"
                  aria-invalid={errors.managerLastName ? 'true' : 'false'}
                />
                {errors.managerLastName && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.managerLastName.message}
                  </p>
                )}
              </div>

              {/* Manager Email */}
              {/* <div>
                <label
                  htmlFor="managerEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Manager Email *
                </label>
                <input
                  id="managerEmail"
                  type="email"
                  {...register('managerEmail', {
                    required: 'Manager email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.managerEmail ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="Enter manager email"
                  aria-invalid={errors.managerEmail ? 'true' : 'false'}
                />
                {errors.managerEmail && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.managerEmail.message}
                  </p>
                )}
              </div> */}

              {/* Manager Phone */}
              <div>
                <label
                  htmlFor="managerPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Manager Phone *
                </label>
                <input
                  id="managerPhone"
                  type="text"
                  {...register('managerPhone', {
                    required: 'Manager phone is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter a valid 10-digit phone number',
                    },
                  })}
                  className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.managerPhone ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="Enter manager phone number"
                  aria-invalid={errors.managerPhone ? 'true' : 'false'}
                />
                {errors.managerPhone && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.managerPhone.message}
                  </p>
                )}
              </div>

              {/* Store Phone */}
              <div>
                <label
                  htmlFor="storePhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Store Phone *
                </label>
                <input
                  id="storePhone"
                  type="text"
                  {...register('storePhone', {
                    required: 'Store phone is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter a valid 10-digit phone number',
                    },
                  })}
                  className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.storePhone ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="Enter store phone number"
                  aria-invalid={errors.storePhone ? 'true' : 'false'}
                />
                {errors.storePhone && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.storePhone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location *
              </label>
              <textarea
                id="location"
                rows={4}
                {...register('location', {
                  required: 'Location is required',
                  minLength: {
                    value: 2,
                    message: 'Location must be at least 2 characters',
                  },
                })}
                className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none ${errors.location ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Enter location address"
                aria-invalid={errors.location ? 'true' : 'false'}
              />
              {errors.location && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Latitude, Longitude & Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Latitude *
                </label>
                <input
                  id="latitude"
                  type="text"
                  {...register('latitude', {
                    required: 'Latitude is required',
                    pattern: {
                      value: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,6})?$/,
                      message: 'Enter valid latitude (-90 to 90)',
                    },
                  })}
                  className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.latitude ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="e.g. 12.345678"
                  aria-invalid={errors.latitude ? 'true' : 'false'}
                />
                {errors.latitude && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Longitude *
                </label>
                <input
                  id="longitude"
                  type="text"
                  {...register('longitude', {
                    required: 'Longitude is required',
                    pattern: {
                      value: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,6})?$/,
                      message: 'Enter valid longitude (-180 to 180)',
                    },
                  })}
                  className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.longitude ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="e.g. 98.765432"
                  aria-invalid={errors.longitude ? 'true' : 'false'}
                />
                {errors.longitude && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.longitude.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pincode *
                </label>
                <input
                  id="pincode"
                  type="text"
                  {...register('pincode', {
                    required: 'Pincode is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Enter a valid 6-digit pincode',
                    },
                  })}
                  className={`block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors.pincode ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="Enter pincode"
                  aria-invalid={errors.pincode ? 'true' : 'false'}
                />
                {errors.pincode && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.pincode.message}
                  </p>
                )}
              </div>
            </div>

            {/* Products */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Products *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={watch('products.chicken')}
                    onChange={() => handleProductChange('chicken')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Chicken</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={watch('products.mutton')}
                    onChange={() => handleProductChange('mutton')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Mutton</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={watch('products.pork')}
                    onChange={() => handleProductChange('pork')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Pork</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={watch('products.fish')}
                    onChange={() => handleProductChange('fish')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Fish</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={watch('products.meat')}
                    onChange={() => handleProductChange('meat')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Meat</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <SubmitButton
                label={state.name ? 'Submit' : 'Submit ..'}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MeatCenterEdit;
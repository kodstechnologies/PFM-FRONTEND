// import React, { useState, useEffect } from "react";
// import profile from "../../assets/profile/young-entrepreneur.jpg";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { managerService } from "../../services/managerService";
// import type { ManagerProfile } from "../../services/managerService";
// import { FiMapPin, FiPhone, FiMail, FiHome, FiUser, FiShoppingBag, FiPackage, FiTruck, FiEdit } from "react-icons/fi";

// interface ProfileData {
//   firstName: string;
//   lastName: string;
//   email?: string;
//   location: string;
//   userLocation?: string;
//   storeName: string;
//   storeLocation: string;
//   phone: string;
//   address?: string;
//   pincode?: string;
// }

// const ManagerProfile: React.FC = () => {
//   const [profileImage, setProfileImage] = useState<string>(profile);
//   const [loading, setLoading] = useState<boolean>(true);

//   const [profileData, setProfileData] = useState<ProfileData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     location: "",
//     userLocation: "",
//     storeName: "",
//     storeLocation: "",
//     phone: "",
//     address: "",
//     pincode: "",
//   });

//   const navigate = useNavigate();

//   // Fetch manager profile data on component mount
//   useEffect(() => {
//     fetchManagerProfile();
//   }, []);

//   const fetchManagerProfile = async () => {
//     try {
//       setLoading(true);
//       const managerProfile: ManagerProfile = await managerService.getManagerProfile();

//       // Map backend data to frontend format
//       setProfileData({
//         firstName: managerProfile.firstName || "",
//         lastName: managerProfile.lastName || "",
//         email: "", // Email not available in manager model
//         location: managerProfile.location || "",
//         userLocation: managerProfile.location || "", // Using location as userLocation
//         storeName: managerProfile.storeName || managerProfile.store?.name || "",
//         storeLocation: managerProfile.storeLocation || managerProfile.store?.location || "",
//         phone: managerProfile.phone || "",
//         address: managerProfile.location || "", // Using location as address
//         pincode: managerProfile.pincode || "",
//       });

//       // Set profile image if available
//       if (managerProfile.img) {
//         setProfileImage(managerProfile.img);
//       }
//     } catch (error) {
//       console.error('Error fetching manager profile:', error);
//       toast.error("Failed to load profile data. Please try again.", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
//           <div className="flex flex-col items-center justify-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mb-4"></div>
//             <h3 className="text-lg font-medium text-gray-700">Loading your profile...</h3>
//             <p className="text-gray-500 mt-2">Please wait a moment</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer />
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//         <div className="max-w-6xl mx-auto">
//           {/* Profile Header */}
//           <div className="bg-white rounded-xl shadow-lg p-6 mb-6 overflow-hidden relative">
//             <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-bl-full"></div>

//             <div className="flex flex-col md:flex-row items-center relative z-10">
//               {/* Profile Image */}
//               <div className="relative mb-4 md:mb-0 md:mr-8">
//                 <div className="relative">
//                   <img
//                     src={profileImage}
//                     alt="Manager Profile"
//                     className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
//                   />
//                   <button className="absolute bottom-2 right-2 bg-[#6366F1] p-2 rounded-full text-white shadow-md hover:bg-[#4F46E5] transition-colors">
//                     <FiEdit size={16} />
//                   </button>
//                 </div>
//               </div>

//               {/* Profile Info */}
//               <div className="flex-1 text-center md:text-left">
//                 <h1 className="text-3xl font-bold text-gray-800">
//                   {profileData.firstName} {profileData.lastName}
//                 </h1>
//                 <div className="inline-flex items-center mt-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                   Store Manager
//                 </div>

//                 <div className="flex flex-wrap items-center mt-4 gap-4">
//                   <div className="flex items-center text-gray-600">
//                     <FiMapPin className="mr-1 text-indigo-500" />
//                     <span>{profileData.location}</span>
//                   </div>
//                   <div className="flex items-center text-gray-600">
//                     <FiPhone className="mr-1 text-indigo-500" />
//                     <span>{profileData.phone}</span>
//                   </div>
//                   {profileData.email && (
//                     <div className="flex items-center text-gray-600">
//                       <FiMail className="mr-1 text-indigo-500" />
//                       <span>{profileData.email}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>


//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Personal Information Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
//               <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
//                 <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
//                   <FiUser size={20} />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
//               </div>

//               <div className="space-y-5">
//                 <div className="flex flex-col md:flex-row gap-4">
//                   <div className="flex-1">
//                     <label className="block text-xs font-medium text-gray-500 uppercase mb-1">First Name</label>
//                     <p className="text-gray-800 font-medium">{profileData.firstName}</p>
//                   </div>

//                   <div className="flex-1">
//                     <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Last Name</label>
//                     <p className="text-gray-800 font-medium">{profileData.lastName}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
//                   <div className="flex items-center text-gray-800">
//                     <FiMail className="mr-2 text-indigo-500" size={16} />
//                     <span>{profileData.email || "Not available"}</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Phone</label>
//                   <div className="flex items-center text-gray-800">
//                     <FiPhone className="mr-2 text-indigo-500" size={16} />
//                     <span>{profileData.phone}</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Address</label>
//                   <div className="flex items-center text-gray-800">
//                     <FiHome className="mr-2 text-indigo-500" size={16} />
//                     <span>{profileData.location}</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Pincode</label>
//                   <p className="text-gray-800">{profileData.pincode || "Not set"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Store Information Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
//               <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
//                 <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
//                   <FiShoppingBag size={20} />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-800">Store Information</h2>
//               </div>

//               <div className="space-y-5">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Store Name</label>
//                   <p className="text-gray-800 font-medium text-lg">{profileData.storeName}</p>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Store Location</label>
//                   <div className="flex items-center text-gray-800">
//                     <FiMapPin className="mr-2 text-purple-500" size={16} />
//                     <span>{profileData.storeLocation}</span>
//                   </div>
//                 </div>

//                 <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
//                   <h3 className="font-medium text-gray-700 mb-2">Store Performance</h3>
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>Monthly Revenue</span>
//                     <span className="font-medium text-green-600">+12.5%</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-gray-600 mt-2">
//                     <span>Customer Satisfaction</span>
//                     <span className="font-medium text-green-600">94%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Quick Actions Card */}
//           <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <button
//                 onClick={() => navigate('/manager/order-management')}
//                 className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
//               >
//                 <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 mb-2">
//                   <FiPackage size={20} />
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">Order Management</span>
//               </button>

//               <button
//                 onClick={() => navigate('/manager/inventory')}
//                 className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
//               >
//                 <div className="p-2 bg-purple-100 rounded-full text-purple-600 mb-2">
//                   <FiShoppingBag size={20} />
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">View Inventory</span>
//               </button>

//               <button
//                 onClick={() => navigate('/manager/delivery-partner')}
//                 className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
//               >
//                 <div className="p-2 bg-blue-100 rounded-full text-blue-600 mb-2">
//                   <FiTruck size={20} />
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">Staff Management</span>
//               </button>

//               <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
//                 <div className="p-2 bg-green-100 rounded-full text-green-600 mb-2">
//                   <FiMapPin size={20} />
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">Store Analytics</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ManagerProfile;
import React, { useState, useEffect } from "react";
import profile from "../../assets/profile/young-entrepreneur.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { managerService } from "../../services/managerService";
import type { ManagerProfile } from "../../services/managerService";
import {
  Edit,
  LocationOn,
  Phone,
  Email,
  Home,
  Person,
  ShoppingBag,
  Inventory,
  LocalShipping,
} from "@mui/icons-material";

interface ProfileData {
  firstName: string;
  lastName: string;
  email?: string;
  location: string;
  userLocation?: string;
  storeName: string;
  storeLocation: string;
  phone: string;
  address?: string;
  pincode?: string;
}

const ManagerProfile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string>(profile);
  const [loading, setLoading] = useState<boolean>(true);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    userLocation: "",
    storeName: "",
    storeLocation: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const navigate = useNavigate();

  // Fetch manager profile data on component mount
  useEffect(() => {
    fetchManagerProfile();
  }, []);

  const fetchManagerProfile = async () => {
    try {
      setLoading(true);
      const managerProfile: ManagerProfile = await managerService.getManagerProfile();

      // Map backend data to frontend format
      setProfileData({
        firstName: managerProfile.firstName || "",
        lastName: managerProfile.lastName || "",
        email: "", // Email not available in manager model
        location: managerProfile.location || "",
        userLocation: managerProfile.location || "", // Using location as userLocation
        storeName: managerProfile.storeName || managerProfile.store?.name || "",
        storeLocation: managerProfile.storeLocation || managerProfile.store?.location || "",
        phone: managerProfile.phone || "",
        address: managerProfile.location || "", // Using location as address
        pincode: managerProfile.pincode || "",
      });

      // Set profile image if available
      if (managerProfile.img) {
        setProfileImage(managerProfile.img);
      }
    } catch (error) {
      console.error("Error fetching manager profile:", error);
      toast.error("Failed to load profile data. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mb-4"></div>
            <h3 className="text-lg font-medium text-gray-700">Loading your profile...</h3>
            <p className="text-gray-500 mt-2">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-bl-full"></div>

            <div className="flex flex-col md:flex-row items-center relative z-10">
              {/* Profile Image */}
              <div className="relative mb-4 md:mb-0 md:mr-8">
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Manager Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <button
                    className="absolute bottom-2 right-2 bg-[#6366F1] p-2 rounded-full text-white shadow-md hover:bg-[#4F46E5] transition-colors"
                    aria-label="Edit profile image"
                  >
                    <Edit fontSize="small" />
                  </button>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <div className="inline-flex items-center mt-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  Store Manager
                </div>

                <div className="flex flex-wrap items-center mt-4 gap-4">
                  <div className="flex items-center text-gray-600">
                    <LocationOn className="mr-1 text-indigo-500" fontSize="small" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="mr-1 text-indigo-500" fontSize="small" />
                    <span>{profileData.phone}</span>
                  </div>
                  {profileData.email && (
                    <div className="flex items-center text-gray-600">
                      <Email className="mr-1 text-indigo-500" fontSize="small" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
              <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
                  <Person fontSize="medium" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">First Name</label>
                    <p className="text-gray-800 font-medium">{profileData.firstName}</p>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Last Name</label>
                    <p className="text-gray-800 font-medium">{profileData.lastName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
                  <div className="flex items-center text-gray-800">
                    <Email className="mr-2 text-indigo-500" fontSize="small" />
                    <span>{profileData.email || "Not available"}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Phone</label>
                  <div className="flex items-center text-gray-800">
                    <Phone className="mr-2 text-indigo-500" fontSize="small" />
                    <span>{profileData.phone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Address</label>
                  <div className="flex items-center text-gray-800">
                    <Home className="mr-2 text-indigo-500" fontSize="small" />
                    <span>{profileData.location}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Pincode</label>
                  <p className="text-gray-800">{profileData.pincode || "Not set"}</p>
                </div>
              </div>
            </div>

            {/* Store Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
              <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                  <ShoppingBag fontSize="medium" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Store Information</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Store Name</label>
                  <p className="text-gray-800 font-medium text-lg">{profileData.storeName}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Store Location</label>
                  <div className="flex items-center text-gray-800">
                    <LocationOn className="mr-2 text-purple-500" fontSize="small" />
                    <span>{profileData.storeLocation}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-gray-700 mb-2">Store Performance</h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Monthly Revenue</span>
                    <span className="font-medium text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Customer Satisfaction</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/manager/order-management")}
                className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                aria-label="Order Management"
              >
                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 mb-2">
                  <Inventory fontSize="medium" />
                </div>
                <span className="text-sm font-medium text-gray-700">Order Management</span>
              </button>

              <button
                onClick={() => navigate("/manager/inventory")}
                className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                aria-label="View Inventory"
              >
                <div className="p-2 bg-purple-100 rounded-full text-purple-600 mb-2">
                  <ShoppingBag fontSize="medium" />
                </div>
                <span className="text-sm font-medium text-gray-700">View Inventory</span>
              </button>

              <button
                onClick={() => navigate("/manager/delivery-partner")}
                className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                aria-label="Staff Management"
              >
                <div className="p-2 bg-blue-100 rounded-full text-blue-600 mb-2">
                  <LocalShipping fontSize="medium" />
                </div>
                <span className="text-sm font-medium text-gray-700">Staff Management</span>
              </button>

              <button
                className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                aria-label="Store Analytics"
              >
                <div className="p-2 bg-green-100 rounded-full text-green-600 mb-2">
                  <LocationOn fontSize="medium" />
                </div>
                <span className="text-sm font-medium text-gray-700">Store Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerProfile;
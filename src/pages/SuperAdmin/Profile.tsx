// import React, { useState, useRef, useEffect } from "react";
// import profile from "../../assets/profile/priya.jpg";
// import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { callApi } from "../../util/admin_api";

// interface ProfileData {
//     firstName: string;
//     lastName: string;
//     email: string;
//     // location: string;
//     phone: string;
//     img?: string;
// }

// interface AdminTokenPayload extends JwtPayload {
//     userId: string; // Matches your JWT payload key
//     role?: string;
//     name?: string;
//     loginTime?: string;
//     iat?: number;
//     exp?: number;
// }

// interface JwtPayload {
//     userId: string; // Base structure for JWT payload
//     [key: string]: any; // Allow additional fields
// }

// const Profile: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");
//     const [editMode, setEditMode] = useState<boolean>(false);
//     const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
//     const [profileImage, setProfileImage] = useState<string>(profile);
//     const [passwordData, setPasswordData] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });
//     const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
//     const [loading, setLoading] = useState<boolean>(false);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const navigate = useNavigate();

//     const [profileData, setProfileData] = useState<ProfileData>({
//         firstName: "",
//         lastName: "",
//         email: "",
//         // location: "",
//         phone: "",
//     });

//     useEffect(() => {
//         fetchProfileData();
//     }, []);

//     const getAdminIdFromToken = (token: string | null): string | null => {
//         if (!token) return null;

//         try {
//             const decoded = jwtDecode<AdminTokenPayload>(token);
//             return decoded.userId || null; // Extract userId from token
//         } catch (err) {
//             console.error("Invalid token:", err);
//             return null;
//         }
//     };

//     const fetchProfileData = async () => {
//         try {
//             setLoading(true);
//             const userDataString = localStorage.getItem("superAdminUser");
//             if (!userDataString) {
//                 toast.error("No user data found. Please log in.");
//                 navigate("/login");
//                 return;
//             }

//             const userData = JSON.parse(userDataString);
//             const token = userData.token;
//             const adminId = getAdminIdFromToken(token);

//             if (!token || !adminId) {
//                 toast.error("No valid access token or admin ID found. Please log in.");
//                 navigate("/login");
//                 return;
//             }

//             const response = await callApi({
//                 endpoint: "/admin/profile",
//                 method: "GET",
//             });
//             console.log("🚀 ~ fetchProfileData ~ response:", response)

//             // Fix: Access response.data directly instead of response.data.data
//             if (response.data) {
//                 const adminData = response.data;
//                 setProfileData({
//                     firstName: adminData.firstName || "",
//                     lastName: adminData.lastName || "",
//                     email: adminData.email || "",
//                     // location: adminData.location || "",
//                     phone: adminData.phone || "",
//                 });

//                 if (adminData.img) {
//                     setProfileImage(adminData.img);
//                 }
//             }
//         } catch (error) {
//             console.error("Error fetching profile data:", error);
//             toast.error("Failed to fetch profile data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setProfileData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setPasswordData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleSave = async () => {
//         if (!profileData.firstName || !profileData.lastName || !profileData.email) {
//             alert("Please fill all required fields");
//             return;
//         }

//         try {
//             setLoading(true);
//             const userDataString = localStorage.getItem("superAdminUser");
//             if (!userDataString) return;

//             const userData = JSON.parse(userDataString);
//             const token = userData.token;
//             const adminId = getAdminIdFromToken(token);

//             if (!token || !adminId) return;

//             const formData = new FormData();
//             formData.append("firstName", profileData.firstName);
//             formData.append("lastName", profileData.lastName);
//             formData.append("email", profileData.email);
//             formData.append("phone", profileData.phone);
//             if (fileInputRef.current?.files?.[0]) {
//                 formData.append("img", fileInputRef.current.files[0]); // attach image
//             }

//             const response = await axios.patch(
//                 `${process.env.REACT_APP_API_URL}/admin/update-profile`,
//                 formData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "multipart/form-data",
//                         "Admin-ID": adminId,
//                     },
//                 }
//             );

//             if (response.data?.data) {
//                 setProfileData(response.data.data);
//                 if (response.data.data.img) setProfileImage(response.data.data.img);
//                 toast.success("Profile updated successfully");
//                 setEditMode(false);
//             }
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to update profile");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const handlePasswordSave = async () => {
//         if (passwordData.newPassword !== passwordData.confirmPassword) {
//             alert("New passwords don't match!");
//             return;
//         }
//         if (passwordData.newPassword.length < 8) {
//             alert("New password must be at least 8 characters long.");
//             return;
//         }

//         try {
//             setLoading(true);
//             const userDataString = localStorage.getItem("superAdminUser");
//             if (!userDataString) {
//                 toast.error("No user data found. Please log in.");
//                 navigate("/login");
//                 return;
//             }

//             const userData = JSON.parse(userDataString);
//             const token = userData.token;
//             const adminId = getAdminIdFromToken(token);

//             if (!token || !adminId) {
//                 toast.error("No valid access token or admin ID found. Please log in.");
//                 navigate("/login");
//                 return;
//             }

//             const response = await callApi({
//                 endpoint: "/admin/change-password",
//                 method: "PATCH",
//                 data: {
//                     currentPassword: passwordData.currentPassword,
//                     newPassword: passwordData.newPassword,
//                 },
//                 config: {
//                     headers: {
//                         "Admin-ID": adminId, // custom header still included
//                     },
//                 },
//             });

//             if (response.data) {
//                 setShowPasswordFields(false);
//                 setPasswordData({
//                     currentPassword: "",
//                     newPassword: "",
//                     confirmPassword: "",
//                 });
//                 toast.success("Password changed successfully", {
//                     position: "top-right",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                 });
//             }
//         } catch (error: any) {
//             console.error("Error changing password:", error);
//             if (error.response?.data?.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error("Failed to change password");
//             }
//         } finally {
//             setLoading(false);
//             setShowPasswordFields(false)
//         }
//     };

//     const handleDeleteAccount = async () => {
//         if (deleteConfirmText !== "DELETE") {
//             alert("Please type 'DELETE' to confirm");
//             return;
//         }

//         try {
//             setLoading(true);
//             const userDataString = localStorage.getItem("superAdminUser");
//             if (!userDataString) {
//                 toast.error("No user data found. Please log in.");
//                 navigate("/login");
//                 return;
//             }

//             const userData = JSON.parse(userDataString);
//             const token = userData.token;
//             const adminId = getAdminIdFromToken(token);

//             if (!token || !adminId) {
//                 toast.error("No valid access token or admin ID found. Please log in.");
//                 navigate("/login");
//                 return;
//             }

//             await callApi({
//                 endpoint: "/admin/delete-account",
//                 method: "DELETE",
//                 config: {
//                     headers: {
//                         "Admin-ID": adminId, // custom header
//                         // Authorization header is already added automatically by the interceptor
//                     },
//                 },
//             });

//             setShowDeleteConfirm(false);
//             setDeleteConfirmText("");

//             toast.success("Admin deleted successfully", {
//                 position: "top-right",
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//             });

//             setTimeout(() => {
//                 localStorage.removeItem("superAdminUser"); // Clear superAdminUser
//                 navigate("/");
//             }, 3000);
//         } catch (error) {
//             console.error("Error deleting account:", error);
//             toast.error("Failed to delete account");
//             setLoading(false);
//         }
//     };

//     const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];

//             if (!file.type.startsWith("image/")) {
//                 alert("Please upload a valid image file.");
//                 return;
//             }
//             if (file.size > 5 * 1024 * 1024) {
//                 alert("Image size must be less than 5MB.");
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 const userDataString = localStorage.getItem("superAdminUser");
//                 if (!userDataString) {
//                     toast.error("No user data found. Please log in.");
//                     navigate("/login");
//                     return;
//                 }

//                 const userData = JSON.parse(userDataString);
//                 const token = userData.token;
//                 const adminId = getAdminIdFromToken(token);

//                 if (!token || !adminId) {
//                     toast.error("No valid access token or admin ID found. Please log in.");
//                     navigate("/login");
//                     return;
//                 }

//                 const formData = new FormData();
//                 formData.append("image", file);

//                 const response = await axios.patch(
//                     `${import.meta.env.VITE_API_URL}/admin/update-profile`,
//                     formData,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             "Content-Type": "multipart/form-data",
//                             "Admin-ID": adminId,
//                         },
//                     }
//                 );


//                 if (response.data && response.data.data && response.data.data.img) {
//                     setProfileImage(response.data.data.img);
//                     toast.success("Profile image updated successfully");
//                 }
//             } catch (error) {
//                 console.error("Error uploading image:", error);
//                 toast.error("Failed to update profile image");
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     const triggerFileInput = () => {
//         fileInputRef.current?.click();
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C7C]"></div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <ToastContainer />
//             <div className="max-w-6xl mx-auto p-4">
//                 {/* Profile Header */}
//                 <div className="bg-white rounded-lg shadow p-6 mb-6">
//                     <div className="flex flex-col md:flex-row items-center">
//                         {/* Profile Image */}
//                         <div className="relative mb-4 md:mb-0 md:mr-6">
//                             <img
//                                 src={profileImage}
//                                 alt="Profile"
//                                 className="w-32 h-32 rounded-full border-4 border-[#FFF2F2] object-cover"
//                             />
//                             {editMode && (
//                                 <>
//                                     <div
//                                         onClick={triggerFileInput}
//                                         className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center cursor-pointer"
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-6 w-6 text-white"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                                             />
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                                             />
//                                         </svg>
//                                     </div>
//                                     <input
//                                         type="file"
//                                         ref={fileInputRef}
//                                         onChange={handleImageChange}
//                                         accept="image/*"
//                                         className="hidden"
//                                     />
//                                 </>
//                             )}
//                         </div>

//                         {/* Profile Info */}
//                         <div className="flex-1 text-center md:text-left">
//                             {editMode ? (
//                                 <div className="space-y-2 flex flex-col">
//                                     <input
//                                         type="text"
//                                         name="firstName"
//                                         value={profileData.firstName}
//                                         onChange={handleInputChange}
//                                         className="text-2xl font-semibold border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none text-center md:text-left"
//                                     />
//                                     <input
//                                         type="text"
//                                         name="location"
//                                         value={profileData.email}
//                                         onChange={handleInputChange}
//                                         className="text-gray-500 border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none w-full text-center md:text-left"
//                                     />
//                                 </div>
//                             ) : (
//                                 <>
//                                     <h1 className="text-2xl font-semibold">
//                                         {profileData.firstName} {profileData.lastName}
//                                     </h1>
//                                     {/* <p className="text-gray-500">ID: {getAdminIdFromToken(JSON.parse(localStorage.getItem("superAdminUser") || '{}').token) || "Not available"}</p> */}
//                                     <p className="text-gray-500">{profileData.email}</p>
//                                     {/* <p className="text-gray-500">{profileData.location}</p> */}
//                                 </>
//                             )}
//                         </div>

//                         {/* Edit Button */}
//                         <div className="mt-4 md:mt-0">
//                             {editMode ? (
//                                 <div className="flex space-x-2">
//                                     <button
//                                         onClick={handleSave}
//                                         disabled={loading}
//                                         className="bg-[#F47C7C] text-white rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-[#EF9F9F] transition disabled:opacity-50"
//                                     >
//                                         Save Changes
//                                     </button>
//                                     <button
//                                         onClick={() => setEditMode(false)}
//                                         disabled={loading}
//                                         className="bg-gray-200 rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-gray-300 transition disabled:opacity-50"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <button
//                                     onClick={() => setEditMode(true)}
//                                     className="bg-[#F47C7C] text-white rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-[#EF9F9F] transition"
//                                 >
//                                     Edit Profile
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                     {/* Left Column - Navigation */}
//                     <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
//                         <div className="space-y-1">
//                             <button
//                                 onClick={() => setActiveTab("personal")}
//                                 className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "personal" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"}`}
//                             >
//                                 Personal Information
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab("security")}
//                                 className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "security" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"}`}
//                             >
//                                 Security
//                             </button>
//                         </div>
//                     </div>

//                     {/* Right Column - Content */}
//                     <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
//                         {activeTab === "personal" && (
//                             <>
//                                 <h2 className="text-xl font-semibold mb-6 text-[#F47C7C]">Personal Information</h2>
//                                 <div className="space-y-4">
//                                     {/* Admin ID (Read-only) */}
//                                     {/* <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">Admin ID</label>
//                                         <p className="text-gray-800">{getAdminIdFromToken(JSON.parse(localStorage.getItem("superAdminUser") || '{}').token) || "Not available"}</p>
//                                     </div> */}

//                                     {/* First Name */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
//                                         {editMode ? (
//                                             <input
//                                                 type="text"
//                                                 name="firstName"
//                                                 value={profileData.firstName}
//                                                 onChange={handleInputChange}
//                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-800">{profileData.firstName}</p>
//                                         )}
//                                     </div>

//                                     {/* Last Name */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
//                                         {editMode ? (
//                                             <input
//                                                 type="text"
//                                                 name="lastName"
//                                                 value={profileData.lastName}
//                                                 onChange={handleInputChange}
//                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-800">{profileData.lastName}</p>
//                                         )}
//                                     </div>

//                                     {/* Email */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
//                                         {editMode ? (
//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={profileData.email}
//                                                 onChange={handleInputChange}
//                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-800">{profileData.email}</p>
//                                         )}
//                                     </div>

//                                     {/* Phone */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
//                                         {editMode ? (
//                                             <input
//                                                 type="tel"
//                                                 name="phone"
//                                                 value={profileData.phone}
//                                                 onChange={handleInputChange}
//                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-800">{profileData.phone}</p>
//                                         )}
//                                     </div>

//                                     {/* Location */}
//                                     {/* <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
//                                         {editMode ? (
//                                             <input
//                                                 type="text"
//                                                 name="location"
//                                                 value={profileData.location}
//                                                 onChange={handleInputChange}
//                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-800">{profileData.location}</p>
//                                         )}
//                                     </div> */}
//                                 </div>
//                             </>
//                         )}

//                         {activeTab === "security" && (
//                             <>
//                                 <h2 className="text-xl font-semibold mb-6 text-[#F47C7C]">Security Settings</h2>
//                                 <div className="space-y-6">
//                                     <div className="border border-gray-200 rounded-lg p-4">
//                                         <h3 className="font-medium mb-3">Change Password</h3>
//                                         {!showPasswordFields ? (
//                                             <button
//                                                 onClick={() => setShowPasswordFields(true)}
//                                                 className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition"
//                                             >
//                                                 Change Password
//                                             </button>
//                                         ) : (
//                                             <>
//                                                 <div className="space-y-3">
//                                                     <div>
//                                                         <label className="block text-sm text-gray-500 mb-1">Current Password</label>
//                                                         <input
//                                                             type="password"
//                                                             name="currentPassword"
//                                                             value={passwordData.currentPassword}
//                                                             onChange={handlePasswordChange}
//                                                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
//                                                             placeholder="Enter current password"
//                                                         />
//                                                     </div>
//                                                     <div>
//                                                         <label className="block text-sm text-gray-500 mb-1">New Password</label>
//                                                         <input
//                                                             type="password"
//                                                             name="newPassword"
//                                                             value={passwordData.newPassword}
//                                                             onChange={handlePasswordChange}
//                                                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
//                                                             placeholder="Enter new password"
//                                                         />
//                                                     </div>
//                                                     <div>
//                                                         <label className="block text-sm text-gray-500 mb-1">Confirm New Password</label>
//                                                         <input
//                                                             type="password"
//                                                             name="confirmPassword"
//                                                             value={passwordData.confirmPassword}
//                                                             onChange={handlePasswordChange}
//                                                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
//                                                             placeholder="Confirm new password"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex space-x-2 mt-4">
//                                                     <button
//                                                         onClick={handlePasswordSave}
//                                                         disabled={loading}
//                                                         className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition disabled:opacity-50"
//                                                     >
//                                                         Update Password
//                                                     </button>
//                                                     <button
//                                                         onClick={() => {
//                                                             setShowPasswordFields(false);
//                                                             setPasswordData({
//                                                                 currentPassword: "",
//                                                                 newPassword: "",
//                                                                 confirmPassword: "",
//                                                             });
//                                                         }}
//                                                         className="bg-gray-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 transition"
//                                                     >
//                                                         Cancel
//                                                     </button>
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>

//                                     <div className="border border-[#FAD4D4] rounded-lg p-4 bg-[#FFF2F2]">
//                                         <h3 className="font-medium mb-3 text-[#F47C7C]">Delete Account</h3>
//                                         {!showDeleteConfirm ? (
//                                             <>
//                                                 <p className="text-sm text-[#F47C7C] mb-4">
//                                                     Once you delete your account, there is no going back. Please be certain.
//                                                 </p>
//                                                 <button
//                                                     onClick={() => setShowDeleteConfirm(true)}
//                                                     className="border border-[#F47C7C] text-[#F47C7C] rounded-md px-4 py-2 text-sm font-medium hover:bg-[#F47C7C] hover:text-white transition"
//                                                 >
//                                                     Delete Account
//                                                 </button>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <p className="text-sm text-[#F47C7C] mb-4">
//                                                     Please confirm by typing 'DELETE' to proceed with account deletion.
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     value={deleteConfirmText}
//                                                     onChange={(e) => setDeleteConfirmText(e.target.value)}
//                                                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C] mb-4"
//                                                     placeholder="Type DELETE to confirm"
//                                                 />
//                                                 <div className="flex space-x-2">
//                                                     <button
//                                                         onClick={handleDeleteAccount}
//                                                         disabled={loading}
//                                                         className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition disabled:opacity-50"
//                                                     >
//                                                         Confirm Delete
//                                                     </button>
//                                                     <button
//                                                         onClick={() => {
//                                                             setShowDeleteConfirm(false);
//                                                             setDeleteConfirmText("");
//                                                         }}
//                                                         className="bg-gray-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 transition"
//                                                     >
//                                                         Cancel
//                                                     </button>
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Profile;


import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { callApi } from "../../util/admin_api";

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    img?: string;
}

interface AdminTokenPayload extends JwtPayload {
    userId: string;
    role?: string;
    name?: string;
    loginTime?: string;
    iat?: number;
    exp?: number;
}

interface JwtPayload {
    userId: string;
    [key: string]: any;
}

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | null>(null); // Changed to null initially
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        fetchProfileData();
    }, []);

    // Extract admin ID from JWT token
    const getAdminIdFromToken = (token: string | null): string | null => {
        if (!token) return null;
        try {
            const decoded = jwtDecode<AdminTokenPayload>(token);
            return decoded.userId || null;
        } catch (err) {
            console.error("Invalid token:", err);
            return null;
        }
    };

    // Fetch profile data from the server
    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const userDataString = localStorage.getItem("superAdminUser");
            if (!userDataString) {
                toast.error("No user data found. Please log in.");
                navigate("/login");
                return;
            }

            const userData = JSON.parse(userDataString);
            const token = userData.token;
            const adminId = getAdminIdFromToken(token);

            if (!token || !adminId) {
                toast.error("No valid access token or admin ID found. Please log in.");
                navigate("/login");
                return;
            }

            const response = await callApi({
                endpoint: "/admin/profile",
                method: "GET",
            });

            if (response.data) {
                const adminData = response.data;
                setProfileData({
                    firstName: adminData.firstName || "",
                    lastName: adminData.lastName || "",
                    email: adminData.email || "",
                    phone: adminData.phone || "",
                });
                if (adminData.img) setProfileImage(adminData.img); // Only set image if it exists
            }
        } catch (error: any) {
            console.error("Error fetching profile data:", error);
            toast.error(error.response?.data?.message || "Failed to fetch profile data");
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes for profile data
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle password input changes
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image upload without compression
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file (JPEG, PNG, GIF).");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB.");
            return;
        }

        try {
            setImageLoading(true);

            const userDataString = localStorage.getItem("superAdminUser");
            if (!userDataString) {
                toast.error("No user data found. Please log in.");
                navigate("/login");
                return;
            }

            const { token } = JSON.parse(userDataString);
            const adminId = getAdminIdFromToken(token);

            if (!token || !adminId) {
                toast.error("No valid access token or admin ID found. Please log in.");
                navigate("/login");
                return;
            }

            const formData = new FormData();
            formData.append("image", file);

            // ✅ Use PATCH to your backend URL
            const response = await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/admin/update-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                        "Admin-ID": adminId,
                    },
                }
            );

            if (response.data?.data?.img) {
                setProfileImage(response.data.data.img);
                toast.success("Profile image updated successfully");
            }
        } catch (err: any) {
            console.error("Error uploading image:", err);
            toast.error(err.response?.data?.message || "Failed to update profile image");
        } finally {
            setImageLoading(false);
        }
    };

    // Handle profile save with optional image upload
    const handleSave = async () => {
        if (!profileData.firstName || !profileData.lastName || !profileData.email) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);
            const userDataString = localStorage.getItem("superAdminUser");
            if (!userDataString) {
                toast.error("No user data found. Please log in.");
                navigate("/login");
                return;
            }

            const userData = JSON.parse(userDataString);
            const token = userData.token;
            const adminId = getAdminIdFromToken(token);

            if (!token || !adminId) {
                toast.error("No valid access token or admin ID found. Please log in.");
                navigate("/login");
                return;
            }

            const formData = new FormData();
            formData.append("firstName", profileData.firstName);
            formData.append("lastName", profileData.lastName);
            formData.append("email", profileData.email);
            formData.append("phone", profileData.phone);
            if (fileInputRef.current?.files?.[0]) {
                formData.append("image", fileInputRef.current.files[0]); // Use raw file
            }

            const response = await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/admin/update-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                        "Admin-ID": adminId,
                    },
                }
            );

            if (response.data?.data) {
                setProfileData(response.data.data);
                if (response.data.data.img) {
                    setProfileImage(response.data.data.img);
                } else {
                    setProfileImage(null); // Clear image if backend returns no img
                }
                toast.success("Profile updated successfully");
                setEditMode(false);
            }
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    // Handle password change
    const handlePasswordSave = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords don't match!");
            return;
        }
        if (passwordData.newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long.");
            return;
        }

        try {
            setLoading(true);
            const userDataString = localStorage.getItem("superAdminUser");
            if (!userDataString) {
                toast.error("No user data found. Please log in.");
                navigate("/login");
                return;
            }

            const userData = JSON.parse(userDataString);
            const token = userData.token;
            const adminId = getAdminIdFromToken(token);

            if (!token || !adminId) {
                toast.error("No valid access token or admin ID found. Please log in.");
                navigate("/login");
                return;
            }

            const response = await callApi({
                endpoint: "/admin/change-password",
                method: "PATCH",
                data: {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                config: {
                    headers: {
                        "Admin-ID": adminId,
                    },
                },
            });

            if (response.data) {
                setShowPasswordFields(false);
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                toast.success("Password changed successfully");
            }
        } catch (error: any) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "DELETE") {
            toast.error("Please type 'DELETE' to confirm");
            return;
        }

        try {
            setLoading(true);
            const userDataString = localStorage.getItem("superAdminUser");
            if (!userDataString) {
                toast.error("No user data found. Please log in.");
                navigate("/login");
                return;
            }

            const userData = JSON.parse(userDataString);
            const token = userData.token;
            const adminId = getAdminIdFromToken(token);

            if (!token || !adminId) {
                toast.error("No valid access token or admin ID found. Please log in.");
                navigate("/login");
                return;
            }

            await callApi({
                endpoint: "/admin/delete-account",
                method: "DELETE",
                config: {
                    headers: {
                        "Admin-ID": adminId,
                    },
                },
            });

            setShowDeleteConfirm(false);
            setDeleteConfirmText("");
            toast.success("Account deleted successfully");
            setTimeout(() => {
                localStorage.removeItem("superAdminUser");
                navigate("/");
            }, 3000);
        } catch (error: any) {
            console.error("Error deleting account:", error);
            toast.error(error.response?.data?.message || "Failed to delete account");
        } finally {
            setLoading(false);
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C7C]"></div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-6xl mx-auto p-4">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center">
                        {/* Profile Image */}
                        <div className="relative mb-4 md:mb-0 md:mr-6">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-[#FFF2F2] object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-[#FFF2F2] bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">No Image</span>
                                </div>
                            )}
                            {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                                </div>
                            )}
                            {editMode && !imageLoading && (
                                <>
                                    <div
                                        onClick={triggerFileInput}
                                        className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center cursor-pointer"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/jpeg,image/png,image/gif"
                                        className="hidden"
                                    />
                                </>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            {editMode ? (
                                <div className="space-y-2 flex flex-col">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleInputChange}
                                        className="text-2xl font-semibold border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none text-center md:text-left"
                                        placeholder="First Name"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        className="text-gray-500 border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none w-full text-center md:text-left"
                                        placeholder="Email"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-semibold">
                                        {profileData.firstName} {profileData.lastName}
                                    </h1>
                                    <p className="text-gray-500">{profileData.email}</p>
                                </>
                            )}
                        </div>

                        {/* Edit Button */}
                        <div className="mt-4 md:mt-0">
                            {editMode ? (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="bg-[#F47C7C] text-white rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-[#EF9F9F] transition disabled:opacity-50"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            fetchProfileData(); // Reset to original data
                                        }}
                                        disabled={loading}
                                        className="bg-gray-200 rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-gray-300 transition disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="bg-[#F47C7C] text-white rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-[#EF9F9F] transition"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Column - Navigation */}
                    <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
                        <div className="space-y-1">
                            <button
                                onClick={() => setActiveTab("personal")}
                                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "personal" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"
                                    }`}
                            >
                                Personal Information
                            </button>
                            <button
                                onClick={() => setActiveTab("security")}
                                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "security" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"
                                    }`}
                            >
                                Security
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
                        {activeTab === "personal" && (
                            <>
                                <h2 className="text-xl font-semibold mb-6 text-[#F47C7C]">Personal Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={profileData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
                                                placeholder="First Name"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profileData.firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={profileData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
                                                placeholder="Last Name"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profileData.lastName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                        {editMode ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
                                                placeholder="Email"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profileData.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                                        {editMode ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
                                                placeholder="Phone Number"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profileData.phone || "Not provided"}</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "security" && (
                            <>
                                <h2 className="text-xl font-semibold mb-6 text-[#F47C7C]">Security Settings</h2>
                                <div className="space-y-6">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-medium mb-3">Change Password</h3>
                                        {!showPasswordFields ? (
                                            <button
                                                onClick={() => setShowPasswordFields(true)}
                                                className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition"
                                            >
                                                Change Password
                                            </button>
                                        ) : (
                                            <>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm text-gray-500 mb-1">Current Password</label>
                                                        <input
                                                            type="password"
                                                            name="currentPassword"
                                                            value={passwordData.currentPassword}
                                                            onChange={handlePasswordChange}
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
                                                            placeholder="Enter current password"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-500 mb-1">New Password</label>
                                                        <input
                                                            type="password"
                                                            name="newPassword"
                                                            value={passwordData.newPassword}
                                                            onChange={handlePasswordChange}
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
                                                            placeholder="Enter new password"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-500 mb-1">Confirm New Password</label>
                                                        <input
                                                            type="password"
                                                            name="confirmPassword"
                                                            value={passwordData.confirmPassword}
                                                            onChange={handlePasswordChange}
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
                                                            placeholder="Confirm new password"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 mt-4">
                                                    <button
                                                        onClick={handlePasswordSave}
                                                        disabled={loading}
                                                        className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition disabled:opacity-50"
                                                    >
                                                        Update Password
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowPasswordFields(false);
                                                            setPasswordData({
                                                                currentPassword: "",
                                                                newPassword: "",
                                                                confirmPassword: "",
                                                            });
                                                        }}
                                                        className="bg-gray-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="border border-[#FAD4D4] rounded-lg p-4 bg-[#FFF2F2]">
                                        <h3 className="font-medium mb-3 text-[#F47C7C]">Delete Account</h3>
                                        {!showDeleteConfirm ? (
                                            <>
                                                <p className="text-sm text-[#F47C7C] mb-4">
                                                    Once you delete your account, there is no going back. Please be certain.
                                                </p>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="border border-[#F47C7C] text-[#F47C7C] rounded-md px-4 py-2 text-sm font-medium hover:bg-[#F47C7C] hover:text-white transition"
                                                >
                                                    Delete Account
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm text-[#F47C7C] mb-4">
                                                    Please confirm by typing 'DELETE' to proceed with account deletion.
                                                </p>
                                                <input
                                                    type="text"
                                                    value={deleteConfirmText}
                                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C] mb-4"
                                                    placeholder="Type DELETE to confirm"
                                                />
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={handleDeleteAccount}
                                                        disabled={loading}
                                                        className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition disabled:opacity-50"
                                                    >
                                                        Confirm Delete
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowDeleteConfirm(false);
                                                            setDeleteConfirmText("");
                                                        }}
                                                        className="bg-gray-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
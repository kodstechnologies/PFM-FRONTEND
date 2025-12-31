// // // import React, { useState, useRef, useEffect } from "react";
// // // import { toast, ToastContainer } from "react-toastify";
// // // import "react-toastify/dist/ReactToastify.css";
// // // import { useNavigate } from "react-router-dom";
// // // import axios from "axios";
// // // import { jwtDecode } from "jwt-decode";
// // // import { callApi } from "../../util/admin_api";

// // // interface ProfileData {
// // //     firstName: string;
// // //     lastName: string;
// // //     email: string;
// // //     phone: string;
// // //     img?: string;
// // // }

// // // interface AdminTokenPayload extends JwtPayload {
// // //     userId: string;
// // //     role?: string;
// // //     name?: string;
// // //     loginTime?: string;
// // //     iat?: number;
// // //     exp?: number;
// // // }

// // // interface JwtPayload {
// // //     userId: string;
// // //     [key: string]: any;
// // // }

// // // const Profile: React.FC = () => {
// // //     const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");
// // //     const [editMode, setEditMode] = useState<boolean>(false);
// // //     const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
// // //     const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
// // //     const [profileImage, setProfileImage] = useState<string | null>(null); // Changed to null initially
// // //     const [imageLoading, setImageLoading] = useState<boolean>(false);
// // //     const [loading, setLoading] = useState<boolean>(false);
// // //     const [passwordData, setPasswordData] = useState({
// // //         currentPassword: "",
// // //         newPassword: "",
// // //         confirmPassword: "",
// // //     });
// // //     const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
// // //     const fileInputRef = useRef<HTMLInputElement>(null);
// // //     const navigate = useNavigate();

// // //     const [profileData, setProfileData] = useState<ProfileData>({
// // //         firstName: "",
// // //         lastName: "",
// // //         email: "",
// // //         phone: "",
// // //     });

// // //     useEffect(() => {
// // //         fetchProfileData();
// // //     }, []);

// // //     // Extract admin ID from JWT token
// // //     const getAdminIdFromToken = (token: string | null): string | null => {
// // //         if (!token) return null;
// // //         try {
// // //             const decoded = jwtDecode<AdminTokenPayload>(token);
// // //             return decoded.userId || null;
// // //         } catch (err) {
// // //             console.error("Invalid token:", err);
// // //             return null;
// // //         }
// // //     };

// // //     // Fetch profile data from the server
// // //     const fetchProfileData = async () => {
// // //         try {
// // //             setLoading(true);
// // //             const userDataString = localStorage.getItem("superAdminUser");
// // //             if (!userDataString) {
// // //                 toast.error("No user data found. Please log in.");
// // //                 navigate("/login");
// // //                 return;
// // //             }

// // //             const userData = JSON.parse(userDataString);
// // //             const token = userData.token;
// // //             const adminId = getAdminIdFromToken(token);

// // //             if (!token || !adminId) {
// // //                 toast.error("No valid access token or admin ID found. Please log in.");
// // //                 navigate("/login");
// // //                 return;
// // //             }

// // //             const response = await callApi({
// // //                 endpoint: "/admin/profile",
// // //                 method: "GET",
// // //             });

// // //             if (response.data) {
// // //                 const adminData = response.data;
// // //                 setProfileData({
// // //                     firstName: adminData.firstName || "",
// // //                     lastName: adminData.lastName || "",
// // //                     email: adminData.email || "",
// // //                     phone: adminData.phone || "",
// // //                 });
// // //                 if (adminData.img) setProfileImage(adminData.img); // Only set image if it exists
// // //             }
// // //         } catch (error: any) {
// // //             console.error("Error fetching profile data:", error);
// // //             toast.error(error.response?.data?.message || "Failed to fetch profile data");
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     // Handle input changes for profile data
// // //     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //         const { name, value } = e.target;
// // //         setProfileData((prev) => ({ ...prev, [name]: value }));
// // //     };

// // //     // Handle password input changes
// // //     const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //         const { name, value } = e.target;
// // //         setPasswordData((prev) => ({ ...prev, [name]: value }));
// // //     };

// // //     // Handle image upload without compression
// // //     const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// // //         if (!e.target.files || !e.target.files[0]) return;

// // //         const file = e.target.files[0];

// // //         if (!file.type.startsWith("image/")) {
// // //             toast.error("Please upload a valid image file (JPEG, PNG, GIF).");
// // //             return;
// // //         }

// // //         if (file.size > 5 * 1024 * 1024) {
// // //             toast.error("Image size must be less than 5MB.");
// // //             return;
// // //         }

// // //         try {
// // //             setImageLoading(true);

// // //             const userDataString = localStorage.getItem("superAdminUser");
// // //             if (!userDataString) {
// // //                 toast.error("No user data found. Please log in.");
// // //                 navigate("/login");
// // //                 return;
// // //             }

// // //             const { token } = JSON.parse(userDataString);
// // //             const adminId = getAdminIdFromToken(token);

// // //             if (!token || !adminId) {
// // //                 toast.error("No valid access token or admin ID found. Please log in.");
// // //                 navigate("/login");
// // //                 return;
// // //             }

// // //             const formData = new FormData();
// // //             formData.append("image", file);

// // //             // ✅ Use PATCH to your backend URL
// // //             const response = await axios.patch(
// // //                 `${import.meta.env.VITE_API_BASE_URL}/admin/update-profile`,
// // //                 formData,
// // //                 {
// // //                     headers: {
// // //                         Authorization: `Bearer ${token}`,
// // //                         "Content-Type": "multipart/form-data",
// // //                         "Admin-ID": adminId,
// // //                     },
// // //                 }
// // //             );

// // //             if (response.data?.data?.img) {
// // //                 setProfileImage(response.data.data.img);
// // //                 toast.success("Profile image updated successfully");
// // //             }
// // //         } catch (err: any) {
// // //             console.error("Error uploading image:", err);
// // //             toast.error(err.response?.data?.message || "Failed to update profile image");
// // //         } finally {
// // //             setImageLoading(false);
// // //         }
// // //     };

// // //     // Handle profile save with optional image upload
// // //     const handleSave = async () => {
// // //         if (!profileData.firstName || !profileData.lastName || !profileData.email) {
// // //             toast.error("Please fill all required fields");
// // //             return;
// // //         }

// // //         try {
// // //             setLoading(true);
// // //             const userDataString = localStorage.getItem("superAdminUser");
// // //             if (!userDataString) {
// // //                 toast.error("No user data found. Please log in.");
// // //                 navigate("/login");
// // //                 return;
// // //             }

// // //             const userData = JSON.parse(userDataString);
// // //             const token = userData.token;
// // //             const adminId = getAdminIdFromToken(token);

// // //             if (!token || !adminId) {
// // //                 toast.error("No valid access token or admin ID found. Please log in.");
// // //                 navigate("/login");
// // //                 return;
// // //             }

// // //             const formData = new FormData();
// // //             formData.append("firstName", profileData.firstName);
// // //             formData.append("lastName", profileData.lastName);
// // //             formData.append("email", profileData.email);
// // //             formData.append("phone", profileData.phone);
// // //             if (fileInputRef.current?.files?.[0]) {
// // //                 formData.append("image", fileInputRef.current.files[0]); // Use raw file
// // //             }

// // //             const response = await axios.patch(
// // //                 `${import.meta.env.VITE_API_BASE_URL}/admin/update-profile`,
// // //                 formData,
// // //                 {
// // //                     headers: {
// // //                         Authorization: `Bearer ${token}`,
// // //                         "Content-Type": "multipart/form-data",
// // //                         "Admin-ID": adminId,
// // //                     },
// // //                 }
// // //             );

// // //             if (response.data?.data) {
// // //                 setProfileData(response.data.data);
// // //                 if (response.data.data.img) {
// // //                     setProfileImage(response.data.data.img);
// // //                 } else {
// // //                     setProfileImage(null); // Clear image if backend returns no img
// // //                 }
// // //                 toast.success("Profile updated successfully");
// // //                 setEditMode(false);
// // //             }
// // //         } catch (error: any) {
// // //             console.error("Error updating profile:", error);
// // //             toast.error(error.response?.data?.message || "Failed to update profile");
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     // Handle password change
// // //     const handlePasswordSave = async () => {
// // //         if (passwordData.newPassword !== passwordData.confirmPassword) {
// // //             toast.error("New passwords don't match!");
// // //             return;
// // //         }
// // //         if (passwordData.newPassword.length < 8) {
// // //             toast.error("New password must be at least 8 characters long.");
// // //             return;
// // //         }

// // //         try {
// // //             setLoading(true);
// // //             const userDataString = localStorage.getItem("superAdminUser");
// // //             if (!userDataString) {
// // //                 toast.error("No user data found. Please log in.");
// // //                 navigate("/login");
// // //                 return;
// // //             }

// // //             const userData = JSON.parse(userDataString);
// // //             const token = userData.token;
// // //             const adminId = getAdminIdFromToken(token);

// // //             if (!token || !adminId) {
// // //                 toast.error("No valid access token or admin ID found. Please log in.");
// // //                 navigate("/login");
// // //                 return;
// // //             }

// // //             const response = await callApi({
// // //                 endpoint: "/admin/change-password",
// // //                 method: "PATCH",
// // //                 data: {
// // //                     currentPassword: passwordData.currentPassword,
// // //                     newPassword: passwordData.newPassword,
// // //                 },
// // //                 config: {
// // //                     headers: {
// // //                         "Admin-ID": adminId,
// // //                     },
// // //                 },
// // //             });

// // //             if (response.data) {
// // //                 setShowPasswordFields(false);
// // //                 setPasswordData({
// // //                     currentPassword: "",
// // //                     newPassword: "",
// // //                     confirmPassword: "",
// // //                 });
// // //                 toast.success("Password changed successfully");
// // //             }
// // //         } catch (error: any) {
// // //             console.error("Error changing password:", error);
// // //             toast.error(error.response?.data?.message || "Failed to change password");
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     // Handle account deletion
// // //     const handleDeleteAccount = async () => {
// // //         if (deleteConfirmText !== "DELETE") {
// // //             toast.error("Please type 'DELETE' to confirm");
// // //             return;
// // //         }

// // //         try {
// // //             setLoading(true);
// // //             const userDataString = localStorage.getItem("superAdminUser");
// // //             if (!userDataString) {
// // //                 toast.error("No user data found. Please log in.");
// // //                 navigate("/login");
// // //                 return;
// // //             }

// // //             const userData = JSON.parse(userDataString);
// // //             const token = userData.token;
// // //             const adminId = getAdminIdFromToken(token);

// // //             if (!token || !adminId) {
// // //                 toast.error("No valid access token or admin ID found. Please log in.");
// // //                 navigate("/login");
// // //                 return;
// // //             }

// // //             await callApi({
// // //                 endpoint: "/admin/delete-account",
// // //                 method: "DELETE",
// // //                 config: {
// // //                     headers: {
// // //                         "Admin-ID": adminId,
// // //                     },
// // //                 },
// // //             });

// // //             setShowDeleteConfirm(false);
// // //             setDeleteConfirmText("");
// // //             toast.success("Account deleted successfully");
// // //             setTimeout(() => {
// // //                 localStorage.removeItem("superAdminUser");
// // //                 navigate("/");
// // //             }, 3000);
// // //         } catch (error: any) {
// // //             console.error("Error deleting account:", error);
// // //             toast.error(error.response?.data?.message || "Failed to delete account");
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     // Trigger file input click
// // //     const triggerFileInput = () => {
// // //         fileInputRef.current?.click();
// // //     };

// // //     if (loading) {
// // //         return (
// // //             <div className="flex justify-center items-center h-64">
// // //                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C7C]"></div>
// // //             </div>
// // //         );
// // //     }

// // //     return (
// // //         <>
// // //             <ToastContainer position="top-right" autoClose={3000} />
// // //             <div className="max-w-6xl mx-auto p-4">
// // //                 {/* Profile Header */}
// // //                 <div className="bg-white rounded-lg shadow p-6 mb-6">
// // //                     <div className="flex flex-col md:flex-row items-center">
// // //                         {/* Profile Image */}
// // //                         <div className="relative mb-4 md:mb-0 md:mr-6">
// // //                             {profileImage ? (
// // //                                 <img
// // //                                     src={profileImage}
// // //                                     alt="Profile"
// // //                                     className="w-32 h-32 rounded-full border-4 border-[#FFF2F2] object-cover"
// // //                                 />
// // //                             ) : (
// // //                                 <div className="w-32 h-32 rounded-full border-4 border-[#FFF2F2] bg-gray-200 flex items-center justify-center">
// // //                                     <span className="text-gray-500 text-sm">No Image</span>
// // //                                 </div>
// // //                             )}
// // //                             {imageLoading && (
// // //                                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
// // //                                     <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
// // //                                 </div>
// // //                             )}
// // //                             {editMode && !imageLoading && (
// // //                                 <>
// // //                                     <div
// // //                                         onClick={triggerFileInput}
// // //                                         className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center cursor-pointer"
// // //                                     >
// // //                                         <svg
// // //                                             xmlns="http://www.w3.org/2000/svg"
// // //                                             className="h-6 w-6 text-white"
// // //                                             fill="none"
// // //                                             viewBox="0 0 24 24"
// // //                                             stroke="currentColor"
// // //                                         >
// // //                                             <path
// // //                                                 strokeLinecap="round"
// // //                                                 strokeLinejoin="round"
// // //                                                 strokeWidth={2}
// // //                                                 d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
// // //                                             />
// // //                                             <path
// // //                                                 strokeLinecap="round"
// // //                                                 strokeLinejoin="round"
// // //                                                 strokeWidth={2}
// // //                                                 d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
// // //                                             />
// // //                                         </svg>
// // //                                     </div>
// // //                                     <input
// // //                                         type="file"
// // //                                         ref={fileInputRef}
// // //                                         onChange={handleImageChange}
// // //                                         accept="image/jpeg,image/png,image/gif"
// // //                                         className="hidden"
// // //                                     />
// // //                                 </>
// // //                             )}
// // //                         </div>

// // //                         {/* Profile Info */}
// // //                         <div className="flex-1 text-center md:text-left">
// // //                             {editMode ? (
// // //                                 <div className="space-y-2 flex flex-col">
// // //                                     <input
// // //                                         type="text"
// // //                                         name="firstName"
// // //                                         value={profileData.firstName}
// // //                                         onChange={handleInputChange}
// // //                                         className="text-2xl font-semibold border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none text-center md:text-left"
// // //                                         placeholder="First Name"
// // //                                     />
// // //                                     <input
// // //                                         type="email"
// // //                                         name="email"
// // //                                         value={profileData.email}
// // //                                         onChange={handleInputChange}
// // //                                         className="text-gray-500 border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none w-full text-center md:text-left"
// // //                                         placeholder="Email"
// // //                                     />
// // //                                 </div>
// // //                             ) : (
// // //                                 <>
// // //                                     <h1 className="text-2xl font-semibold">
// // //                                         {profileData.firstName} {profileData.lastName}
// // //                                     </h1>
// // //                                     <p className="text-gray-500">{profileData.email}</p>
// // //                                 </>
// // //                             )}
// // //                         </div>

// // //                         {/* Edit Button */}
// // //                         <div className="mt-4 md:mt-0">
// // //                             {editMode ? (
// // //                                 <div className="flex space-x-2">
// // //                                     <button
// // //                                         onClick={handleSave}
// // //                                         disabled={loading}
// // //                                         className="bg-[#F47C7C] text-white rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-[#EF9F9F] transition disabled:opacity-50"
// // //                                     >
// // //                                         Save Changes
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             setEditMode(false);
// // //                                             fetchProfileData(); // Reset to original data
// // //                                         }}
// // //                                         disabled={loading}
// // //                                         className="bg-gray-200 rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-gray-300 transition disabled:opacity-50"
// // //                                     >
// // //                                         Cancel
// // //                                     </button>
// // //                                 </div>
// // //                             ) : (
// // //                                 <button
// // //                                     onClick={() => setEditMode(true)}
// // //                                     className="bg-[#F47C7C] text-white rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-[#EF9F9F] transition"
// // //                                 >
// // //                                     Edit Profile
// // //                                 </button>
// // //                             )}
// // //                         </div>
// // //                     </div>
// // //                 </div>

// // //                 {/* Main Content */}
// // //                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// // //                     {/* Left Column - Navigation */}
// // //                     <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
// // //                         <div className="space-y-1">
// // //                             <button
// // //                                 onClick={() => setActiveTab("personal")}
// // //                                 className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "personal" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"
// // //                                     }`}
// // //                             >
// // //                                 Personal Information
// // //                             </button>
// // //                             <button
// // //                                 onClick={() => setActiveTab("security")}
// // //                                 className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "security" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"
// // //                                     }`}
// // //                             >
// // //                                 Security
// // //                             </button>
// // //                         </div>
// // //                     </div>

// // //                     {/* Right Column - Content */}
// // //                     <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
// // //                         {activeTab === "personal" && (
// // //                             <>
// // //                                 <h2 className="text-xl font-semibold mb-6 text-[#F47C7C]">Personal Information</h2>
// // //                                 <div className="space-y-4">
// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
// // //                                         {editMode ? (
// // //                                             <input
// // //                                                 type="text"
// // //                                                 name="firstName"
// // //                                                 value={profileData.firstName}
// // //                                                 onChange={handleInputChange}
// // //                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
// // //                                                 placeholder="First Name"
// // //                                             />
// // //                                         ) : (
// // //                                             <p className="text-gray-800">{profileData.firstName}</p>
// // //                                         )}
// // //                                     </div>
// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
// // //                                         {editMode ? (
// // //                                             <input
// // //                                                 type="text"
// // //                                                 name="lastName"
// // //                                                 value={profileData.lastName}
// // //                                                 onChange={handleInputChange}
// // //                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
// // //                                                 placeholder="Last Name"
// // //                                             />
// // //                                         ) : (
// // //                                             <p className="text-gray-800">{profileData.lastName}</p>
// // //                                         )}
// // //                                     </div>
// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
// // //                                         {editMode ? (
// // //                                             <input
// // //                                                 type="email"
// // //                                                 name="email"
// // //                                                 value={profileData.email}
// // //                                                 onChange={handleInputChange}
// // //                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
// // //                                                 placeholder="Email"
// // //                                             />
// // //                                         ) : (
// // //                                             <p className="text-gray-800">{profileData.email}</p>
// // //                                         )}
// // //                                     </div>
// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
// // //                                         {editMode ? (
// // //                                             <input
// // //                                                 type="tel"
// // //                                                 name="phone"
// // //                                                 value={profileData.phone}
// // //                                                 onChange={handleInputChange}
// // //                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
// // //                                                 placeholder="Phone Number"
// // //                                             />
// // //                                         ) : (
// // //                                             <p className="text-gray-800">{profileData.phone || "Not provided"}</p>
// // //                                         )}
// // //                                     </div>
// // //                                 </div>
// // //                             </>
// // //                         )}

// // //                         {activeTab === "security" && (
// // //                             <>
// // //                                 <h2 className="text-xl font-semibold mb-6 text-[#F47C7C]">Security Settings</h2>
// // //                                 <div className="space-y-6">
// // //                                     <div className="border border-gray-200 rounded-lg p-4">
// // //                                         <h3 className="font-medium mb-3">Change Password</h3>
// // //                                         {!showPasswordFields ? (
// // //                                             <button
// // //                                                 onClick={() => setShowPasswordFields(true)}
// // //                                                 className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition"
// // //                                             >
// // //                                                 Change Password
// // //                                             </button>
// // //                                         ) : (
// // //                                             <>
// // //                                                 <div className="space-y-3">
// // //                                                     <div>
// // //                                                         <label className="block text-sm text-gray-500 mb-1">Current Password</label>
// // //                                                         <input
// // //                                                             type="password"
// // //                                                             name="currentPassword"
// // //                                                             value={passwordData.currentPassword}
// // //                                                             onChange={handlePasswordChange}
// // //                                                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
// // //                                                             placeholder="Enter current password"
// // //                                                         />
// // //                                                     </div>
// // //                                                     <div>
// // //                                                         <label className="block text-sm text-gray-500 mb-1">New Password</label>
// // //                                                         <input
// // //                                                             type="password"
// // //                                                             name="newPassword"
// // //                                                             value={passwordData.newPassword}
// // //                                                             onChange={handlePasswordChange}
// // //                                                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
// // //                                                             placeholder="Enter new password"
// // //                                                         />
// // //                                                     </div>
// // //                                                     <div>
// // //                                                         <label className="block text-sm text-gray-500 mb-1">Confirm New Password</label>
// // //                                                         <input
// // //                                                             type="password"
// // //                                                             name="confirmPassword"
// // //                                                             value={passwordData.confirmPassword}
// // //                                                             onChange={handlePasswordChange}
// // //                                                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
// // //                                                             placeholder="Confirm new password"
// // //                                                         />
// // //                                                     </div>
// // //                                                 </div>
// // //                                                 <div className="flex space-x-2 mt-4">
// // //                                                     <button
// // //                                                         onClick={handlePasswordSave}
// // //                                                         disabled={loading}
// // //                                                         className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition disabled:opacity-50"
// // //                                                     >
// // //                                                         Update Password
// // //                                                     </button>
// // //                                                     <button
// // //                                                         onClick={() => {
// // //                                                             setShowPasswordFields(false);
// // //                                                             setPasswordData({
// // //                                                                 currentPassword: "",
// // //                                                                 newPassword: "",
// // //                                                                 confirmPassword: "",
// // //                                                             });
// // //                                                         }}
// // //                                                         className="bg-gray-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 transition"
// // //                                                     >
// // //                                                         Cancel
// // //                                                     </button>
// // //                                                 </div>
// // //                                             </>
// // //                                         )}
// // //                                     </div>

// // //                                     <div className="border border-[#FAD4D4] rounded-lg p-4 bg-[#FFF2F2]">
// // //                                         <h3 className="font-medium mb-3 text-[#F47C7C]">Delete Account</h3>
// // //                                         {!showDeleteConfirm ? (
// // //                                             <>
// // //                                                 <p className="text-sm text-[#F47C7C] mb-4">
// // //                                                     Once you delete your account, there is no going back. Please be certain.
// // //                                                 </p>
// // //                                                 <button
// // //                                                     onClick={() => setShowDeleteConfirm(true)}
// // //                                                     className="border border-[#F47C7C] text-[#F47C7C] rounded-md px-4 py-2 text-sm font-medium hover:bg-[#F47C7C] hover:text-white transition"
// // //                                                 >
// // //                                                     Delete Account
// // //                                                 </button>
// // //                                             </>
// // //                                         ) : (
// // //                                             <>
// // //                                                 <p className="text-sm text-[#F47C7C] mb-4">
// // //                                                     Please confirm by typing 'DELETE' to proceed with account deletion.
// // //                                                 </p>
// // //                                                 <input
// // //                                                     type="text"
// // //                                                     value={deleteConfirmText}
// // //                                                     onChange={(e) => setDeleteConfirmText(e.target.value)}
// // //                                                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C] mb-4"
// // //                                                     placeholder="Type DELETE to confirm"
// // //                                                 />
// // //                                                 <div className="flex space-x-2">
// // //                                                     <button
// // //                                                         onClick={handleDeleteAccount}
// // //                                                         disabled={loading}
// // //                                                         className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition disabled:opacity-50"
// // //                                                     >
// // //                                                         Confirm Delete
// // //                                                     </button>
// // //                                                     <button
// // //                                                         onClick={() => {
// // //                                                             setShowDeleteConfirm(false);
// // //                                                             setDeleteConfirmText("");
// // //                                                         }}
// // //                                                         className="bg-gray-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 transition"
// // //                                                     >
// // //                                                         Cancel
// // //                                                     </button>
// // //                                                 </div>
// // //                                             </>
// // //                                         )}
// // //                                     </div>
// // //                                 </div>
// // //                             </>
// // //                         )}
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         </>
// // //     );
// // // };

// // // export default Profile;

// // import React, { useState, useRef, useEffect } from "react";
// // import { toast, ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import { useNavigate } from "react-router-dom";
// // import { callApi } from "../../util/admin_api";

// // interface ProfileData {
// //     firstName: string;
// //     lastName: string;
// //     email: string;
// //     phone: string;
// // }

// // const Profile: React.FC = () => {
// //     const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");
// //     const [editMode, setEditMode] = useState<boolean>(false);
// //     const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
// //     const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
// //     const [loading, setLoading] = useState<boolean>(false);
// //     const [passwordData, setPasswordData] = useState({
// //         currentPassword: "",
// //         newPassword: "",
// //         confirmPassword: "",
// //     });
// //     const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
// //     const navigate = useNavigate();

// //     const [profileData, setProfileData] = useState<ProfileData>({
// //         firstName: "",
// //         lastName: "",
// //         email: "",
// //         phone: "",
// //     });

// //     useEffect(() => {
// //         fetchProfileData();
// //     }, []);

// //     // Fetch profile data from the server
// //     const fetchProfileData = async () => {
// //         try {
// //             setLoading(true);
// //             const userDataString = localStorage.getItem("superAdminUser");
// //             if (!userDataString) {
// //                 toast.error("No user data found. Please log in.");
// //                 navigate("/login");
// //                 return;
// //             }

// //             const userData = JSON.parse(userDataString);

// //             const response = await callApi({
// //                 endpoint: "/admin/profile",
// //                 method: "GET",
// //             });

// //             if (response.data) {
// //                 const adminData = response.data;
// //                 setProfileData({
// //                     firstName: adminData.firstName || "",
// //                     lastName: adminData.lastName || "",
// //                     email: adminData.email || "",
// //                     phone: adminData.phone || "",
// //                 });
// //             }
// //         } catch (error: any) {
// //             console.error("Error fetching profile data:", error);
// //             toast.error(error.response?.data?.message || "Failed to fetch profile data");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // Get initials for avatar
// //     const getInitials = () => {
// //         const first = profileData.firstName.charAt(0).toUpperCase();
// //         const last = profileData.lastName.charAt(0).toUpperCase();
// //         return first + last;
// //     };

// //     // Handle input changes for profile data
// //     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         const { name, value } = e.target;
// //         setProfileData((prev) => ({ ...prev, [name]: value }));
// //     };

// //     // Handle password input changes
// //     const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         const { name, value } = e.target;
// //         setPasswordData((prev) => ({ ...prev, [name]: value }));
// //     };

// //     // Handle profile save
// //     const handleSave = async () => {
// //         if (!profileData.firstName || !profileData.lastName || !profileData.email) {
// //             toast.error("Please fill all required fields");
// //             return;
// //         }

// //         try {
// //             setLoading(true);
// //             const userDataString = localStorage.getItem("superAdminUser");
// //             if (!userDataString) {
// //                 toast.error("No user data found. Please log in.");
// //                 navigate("/login");
// //                 return;
// //             }

// //             const userData = JSON.parse(userDataString);

// //             const response = await callApi({
// //                 endpoint: "/admin/update-profile",
// //                 method: "PATCH",
// //                 data: {
// //                     firstName: profileData.firstName,
// //                     lastName: profileData.lastName,
// //                     email: profileData.email,
// //                     phone: profileData.phone,
// //                 },
// //             });

// //             if (response.data) {
// //                 setProfileData(response.data.data);
// //                 toast.success("Profile updated successfully");
// //                 setEditMode(false);
// //             }
// //         } catch (error: any) {
// //             console.error("Error updating profile:", error);
// //             toast.error(error.response?.data?.message || "Failed to update profile");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // Handle password change
// //     const handlePasswordSave = async () => {
// //         if (passwordData.newPassword !== passwordData.confirmPassword) {
// //             toast.error("New passwords don't match!");
// //             return;
// //         }
// //         if (passwordData.newPassword.length < 8) {
// //             toast.error("New password must be at least 8 characters long.");
// //             return;
// //         }

// //         try {
// //             setLoading(true);
// //             const userDataString = localStorage.getItem("superAdminUser");
// //             if (!userDataString) {
// //                 toast.error("No user data found. Please log in.");
// //                 navigate("/login");
// //                 return;
// //             }

// //             const userData = JSON.parse(userDataString);

// //             const response = await callApi({
// //                 endpoint: "/admin/change-password",
// //                 method: "PATCH",
// //                 data: {
// //                     currentPassword: passwordData.currentPassword,
// //                     newPassword: passwordData.newPassword,
// //                 },
// //             });

// //             if (response.data) {
// //                 setShowPasswordFields(false);
// //                 setPasswordData({
// //                     currentPassword: "",
// //                     newPassword: "",
// //                     confirmPassword: "",
// //                 });
// //                 toast.success("Password changed successfully");
// //             }
// //         } catch (error: any) {
// //             console.error("Error changing password:", error);
// //             toast.error(error.response?.data?.message || "Failed to change password");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // Handle account deletion
// //     const handleDeleteAccount = async () => {
// //         if (deleteConfirmText !== "DELETE") {
// //             toast.error("Please type 'DELETE' to confirm");
// //             return;
// //         }

// //         try {
// //             setLoading(true);
// //             const userDataString = localStorage.getItem("superAdminUser");
// //             if (!userDataString) {
// //                 toast.error("No user data found. Please log in.");
// //                 navigate("/login");
// //                 return;
// //             }

// //             const userData = JSON.parse(userDataString);

// //             await callApi({
// //                 endpoint: "/admin/delete-account",
// //                 method: "DELETE",
// //             });

// //             setShowDeleteConfirm(false);
// //             setDeleteConfirmText("");
// //             toast.success("Account deleted successfully");
// //             setTimeout(() => {
// //                 localStorage.removeItem("superAdminUser");
// //                 navigate("/");
// //             }, 3000);
// //         } catch (error: any) {
// //             console.error("Error deleting account:", error);
// //             toast.error(error.response?.data?.message || "Failed to delete account");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     if (loading) {
// //         return (
// //             <div className="flex justify-center items-center h-64">
// //                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C7C]"></div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <>
// //             <ToastContainer position="top-right" autoClose={3000} />
// //             <div className="max-w-6xl mx-auto p-4">
// //                 {/* Profile Header */}
// //                 <div className="bg-white rounded-lg shadow p-6 mb-6">
// //                     <div className="flex flex-col md:flex-row items-center">
// //                         {/* Profile Avatar */}
// //                         <div className="relative mb-4 md:mb-0 md:mr-6">
// //                             <div className="w-32 h-32 rounded-full border-4 border-[#FFF2F2] bg-[#F47C7C] flex items-center justify-center text-white font-bold text-2xl">
// //                                 {getInitials()}
// //                             </div>
// //                         </div>

// //                         {/* Profile Info */}
// //                         <div className="flex-1 text-center md:text-left">
// //                             {editMode ? (
// //                                 <div className="space-y-2 flex flex-col">
// //                                     <input
// //                                         type="text"
// //                                         name="firstName"
// //                                         value={profileData.firstName}
// //                                         onChange={handleInputChange}
// //                                         className="text-2xl font-semibold border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none text-center md:text-left"
// //                                         placeholder="First Name"
// //                                     />
// //                                     <input
// //                                         type="email"
// //                                         name="email"
// //                                         value={profileData.email}
// //                                         onChange={handleInputChange}
// //                                         className="text-gray-500 border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none w-full text-center md:text-left"
// //                                         placeholder="Email"
// //                                     />
// //                                 </div>
// //                             ) : (
// //                                 <>
// //                                     <h1 className="text-2xl font-semibold">
// //                                         {profileData.firstName} {profileData.lastName}
// //                                     </h1>
// //                                     <p className="text-gray-500">{profileData.email}</p>
// //                                 </>
// //                             )}
// //                         </div>

// //                         {/* Edit Button */}
// //                         <div className="mt-4 md:mt-0">
// //                             {editMode ? (
// //                                 <div className="flex space-x-2">
// //                                     <button
// //                                         onClick={handleSave}
// //                                         disabled={loading}
// //                                         className="bg-[#F47C7C] text-white rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-[#EF9F9F] transition disabled:opacity-50"
// //                                     >
// //                                         Save Changes
// //                                     </button>
// //                                     <button
// //                                         onClick={() => {
// //                                             setEditMode(false);
// //                                             fetchProfileData(); // Reset to original data
// //                                         }}
// //                                         disabled={loading}
// //                                         className="bg-gray-200 rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-gray-300 transition disabled:opacity-50"
// //                                     >
// //                                         Cancel
// //                                     </button>
// //                                 </div>
// //                             ) : (
// //                                 <button
// //                                     onClick={() => setEditMode(true)}
// //                                     className="bg-[#F47C7C] text-white rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-[#EF9F9F] transition"
// //                                 >
// //                                     Edit Profile
// //                                 </button>
// //                             )}
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Main Content */}
// //                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// //                     {/* Left Column - Navigation */}
// //                     <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
// //                         <div className="space-y-1">
// //                             <button
// //                                 onClick={() => setActiveTab("personal")}
// //                                 className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "personal" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"
// //                                     }`}
// //                             >
// //                                 Personal Information
// //                             </button>
// //                             <button
// //                                 onClick={() => setActiveTab("security")}
// //                                 className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "security" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"
// //                                     }`}
// //                             >
// //                                 Security
// //                             </button>
// //                         </div>
// //                     </div>

// //                     {/* Right Column - Content */}
// //                     <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
// //                         {activeTab === "personal" && (
// //                             <>
// //                                 <h2 className="text-xl font-semibold mb-6 text-[#F47C7C]">Personal Information</h2>
// //                                 <div className="space-y-4">
// //                                     <div>
// //                                         <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
// //                                         {editMode ? (
// //                                             <input
// //                                                 type="text"
// //                                                 name="firstName"
// //                                                 value={profileData.firstName}
// //                                                 onChange={handleInputChange}
// //                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
// //                                                 placeholder="First Name"
// //                                             />
// //                                         ) : (
// //                                             <p className="text-gray-800">{profileData.firstName}</p>
// //                                         )}
// //                                     </div>
// //                                     <div>
// //                                         <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
// //                                         {editMode ? (
// //                                             <input
// //                                                 type="text"
// //                                                 name="lastName"
// //                                                 value={profileData.lastName}
// //                                                 onChange={handleInputChange}
// //                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
// //                                                 placeholder="Last Name"
// //                                             />
// //                                         ) : (
// //                                             <p className="text-gray-800">{profileData.lastName}</p>
// //                                         )}
// //                                     </div>
// //                                     <div>
// //                                         <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
// //                                         {editMode ? (
// //                                             <input
// //                                                 type="email"
// //                                                 name="email"
// //                                                 value={profileData.email}
// //                                                 onChange={handleInputChange}
// //                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
// //                                                 placeholder="Email"
// //                                             />
// //                                         ) : (
// //                                             <p className="text-gray-800">{profileData.email}</p>
// //                                         )}
// //                                     </div>
// //                                     <div>
// //                                         <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
// //                                         {editMode ? (
// //                                             <input
// //                                                 type="tel"
// //                                                 name="phone"
// //                                                 value={profileData.phone}
// //                                                 onChange={handleInputChange}
// //                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
// //                                                 placeholder="Phone Number"
// //                                             />
// //                                         ) : (
// //                                             <p className="text-gray-800">{profileData.phone || "Not provided"}</p>
// //                                         )}
// //                                     </div>
// //                                 </div>
// //                             </>
// //                         )}

// //                         {activeTab === "security" && (
// //                             <>
// //                                 <h2 className="text-xl font-semibold mb-6 text-[#F47C7C]">Security Settings</h2>
// //                                 <div className="space-y-6">
// //                                     <div className="border border-gray-200 rounded-lg p-4">
// //                                         <h3 className="font-medium mb-3">Change Password</h3>
// //                                         {!showPasswordFields ? (
// //                                             <button
// //                                                 onClick={() => setShowPasswordFields(true)}
// //                                                 className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition"
// //                                             >
// //                                                 Change Password
// //                                             </button>
// //                                         ) : (
// //                                             <>
// //                                                 <div className="space-y-3">
// //                                                     <div>
// //                                                         <label className="block text-sm text-gray-500 mb-1">Current Password</label>
// //                                                         <input
// //                                                             type="password"
// //                                                             name="currentPassword"
// //                                                             value={passwordData.currentPassword}
// //                                                             onChange={handlePasswordChange}
// //                                                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
// //                                                             placeholder="Enter current password"
// //                                                         />
// //                                                     </div>
// //                                                     <div>
// //                                                         <label className="block text-sm text-gray-500 mb-1">New Password</label>
// //                                                         <input
// //                                                             type="password"
// //                                                             name="newPassword"
// //                                                             value={passwordData.newPassword}
// //                                                             onChange={handlePasswordChange}
// //                                                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
// //                                                             placeholder="Enter new password"
// //                                                         />
// //                                                     </div>
// //                                                     <div>
// //                                                         <label className="block text-sm text-gray-500 mb-1">Confirm New Password</label>
// //                                                         <input
// //                                                             type="password"
// //                                                             name="confirmPassword"
// //                                                             value={passwordData.confirmPassword}
// //                                                             onChange={handlePasswordChange}
// //                                                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C]"
// //                                                             placeholder="Confirm new password"
// //                                                         />
// //                                                     </div>
// //                                                 </div>
// //                                                 <div className="flex space-x-2 mt-4">
// //                                                     <button
// //                                                         onClick={handlePasswordSave}
// //                                                         disabled={loading}
// //                                                         className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition disabled:opacity-50"
// //                                                     >
// //                                                         Update Password
// //                                                     </button>
// //                                                     <button
// //                                                         onClick={() => {
// //                                                             setShowPasswordFields(false);
// //                                                             setPasswordData({
// //                                                                 currentPassword: "",
// //                                                                 newPassword: "",
// //                                                                 confirmPassword: "",
// //                                                             });
// //                                                         }}
// //                                                         className="bg-gray-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 transition"
// //                                                     >
// //                                                         Cancel
// //                                                     </button>
// //                                                 </div>
// //                                             </>
// //                                         )}
// //                                     </div>

// //                                     <div className="border border-[#FAD4D4] rounded-lg p-4 bg-[#FFF2F2]">
// //                                         <h3 className="font-medium mb-3 text-[#F47C7C]">Delete Account</h3>
// //                                         {!showDeleteConfirm ? (
// //                                             <>
// //                                                 <p className="text-sm text-[#F47C7C] mb-4">
// //                                                     Once you delete your account, there is no going back. Please be certain.
// //                                                 </p>
// //                                                 <button
// //                                                     onClick={() => setShowDeleteConfirm(true)}
// //                                                     className="border border-[#F47C7C] text-[#F47C7C] rounded-md px-4 py-2 text-sm font-medium hover:bg-[#F47C7C] hover:text-white transition"
// //                                                 >
// //                                                     Delete Account
// //                                                 </button>
// //                                             </>
// //                                         ) : (
// //                                             <>
// //                                                 <p className="text-sm text-[#F47C7C] mb-4">
// //                                                     Please confirm by typing 'DELETE' to proceed with account deletion.
// //                                                 </p>
// //                                                 <input
// //                                                     type="text"
// //                                                     value={deleteConfirmText}
// //                                                     onChange={(e) => setDeleteConfirmText(e.target.value)}
// //                                                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F47C7C] mb-4"
// //                                                     placeholder="Type DELETE to confirm"
// //                                                 />
// //                                                 <div className="flex space-x-2">
// //                                                     <button
// //                                                         onClick={handleDeleteAccount}
// //                                                         disabled={loading}
// //                                                         className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition disabled:opacity-50"
// //                                                     >
// //                                                         Confirm Delete
// //                                                     </button>
// //                                                     <button
// //                                                         onClick={() => {
// //                                                             setShowDeleteConfirm(false);
// //                                                             setDeleteConfirmText("");
// //                                                         }}
// //                                                         className="bg-gray-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 transition"
// //                                                     >
// //                                                         Cancel
// //                                                     </button>
// //                                                 </div>
// //                                             </>
// //                                         )}
// //                                     </div>
// //                                 </div>
// //                             </>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>
// //         </>
// //     );
// // };

// // export default Profile;

// import React, { useState, useRef, useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { callApi } from "../../util/admin_api";

// interface ProfileData {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
// }

// const Profile: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");
//     const [editMode, setEditMode] = useState<boolean>(false);
//     const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [passwordData, setPasswordData] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });
//     const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
//     const navigate = useNavigate();

//     const [profileData, setProfileData] = useState<ProfileData | null>(null);

//     useEffect(() => {
//         fetchProfileData();
//     }, []);

//     // Fetch profile data from the server
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

//             const response = await callApi({
//                 endpoint: "/admin/profile",
//                 method: "GET",
//             });

//             if (response.data) {
//                 const adminData = response.data;
//                 setProfileData({
//                     firstName: adminData.firstName || "",
//                     lastName: adminData.lastName || "",
//                     email: adminData.email || "",
//                     phone: adminData.phone || "",
//                 });
//             }
//         } catch (error: any) {
//             console.error("Error fetching profile data:", error);
//             toast.error(error.response?.data?.message || "Failed to fetch profile data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Get initials for avatar
//     const getInitials = () => {
//         if (!profileData || !profileData.firstName || !profileData.lastName) {
//             return 'SA';
//         }
//         const first = profileData.firstName.charAt(0).toUpperCase();
//         const last = profileData.lastName.charAt(0).toUpperCase();
//         return first + last;
//     };

//     // Handle input changes for profile data
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setProfileData((prev) => prev ? ({ ...prev, [name]: value }) : prev);
//     };

//     // Handle password input changes
//     const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setPasswordData((prev) => ({ ...prev, [name]: value }));
//     };

//     // Handle profile save
//     const handleSave = async () => {
//         if (!profileData || !profileData.firstName || !profileData.lastName || !profileData.email) {
//             toast.error("Please fill all required fields");
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

//             const response = await callApi({
//                 endpoint: "/admin/update-profile",
//                 method: "PATCH",
//                 data: {
//                     firstName: profileData.firstName,
//                     lastName: profileData.lastName,
//                     email: profileData.email,
//                     phone: profileData.phone,
//                 },
//             });

//             if (response.data) {
//                 setProfileData(response.data.data);
//                 toast.success("Profile updated successfully");
//                 setEditMode(false);
//             }
//         } catch (error: any) {
//             console.error("Error updating profile:", error);
//             toast.error(error.response?.data?.message || "Failed to update profile");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle password change
//     const handlePasswordSave = async () => {
//         if (passwordData.newPassword !== passwordData.confirmPassword) {
//             toast.error("New passwords don't match!");
//             return;
//         }
//         if (passwordData.newPassword.length < 8) {
//             toast.error("New password must be at least 8 characters long.");
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

//             const response = await callApi({
//                 endpoint: "/admin/change-password",
//                 method: "PATCH",
//                 data: {
//                     currentPassword: passwordData.currentPassword,
//                     newPassword: passwordData.newPassword,
//                 },
//             });

//             if (response.data) {
//                 setShowPasswordFields(false);
//                 setPasswordData({
//                     currentPassword: "",
//                     newPassword: "",
//                     confirmPassword: "",
//                 });
//                 toast.success("Password changed successfully");
//             }
//         } catch (error: any) {
//             console.error("Error changing password:", error);
//             toast.error(error.response?.data?.message || "Failed to change password");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle account deletion
//     const handleDeleteAccount = async () => {
//         if (deleteConfirmText !== "DELETE") {
//             toast.error("Please type 'DELETE' to confirm");
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

//             await callApi({
//                 endpoint: "/admin/delete-account",
//                 method: "DELETE",
//             });

//             setShowDeleteConfirm(false);
//             setDeleteConfirmText("");
//             toast.success("Account deleted successfully");
//             setTimeout(() => {
//                 localStorage.removeItem("superAdminUser");
//                 navigate("/");
//             }, 3000);
//         } catch (error: any) {
//             console.error("Error deleting account:", error);
//             toast.error(error.response?.data?.message || "Failed to delete account");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading || !profileData) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C7C]"></div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <ToastContainer position="top-right" autoClose={3000} />
//             <div className="max-w-6xl mx-auto p-4">
//                 {/* Profile Header */}
//                 <div className="bg-white rounded-lg shadow p-6 mb-6">
//                     <div className="flex flex-col md:flex-row items-center">
//                         {/* Profile Avatar */}
//                         <div className="relative mb-4 md:mb-0 md:mr-6">
//                             <div className="w-32 h-32 rounded-full border-4 border-[#FFF2F2] bg-[#F47C7C] flex items-center justify-center text-white font-bold text-2xl">
//                                 {getInitials()}
//                             </div>
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
//                                         placeholder="First Name"
//                                     />
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={profileData.email}
//                                         onChange={handleInputChange}
//                                         className="text-gray-500 border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none w-full text-center md:text-left"
//                                         placeholder="Email"
//                                     />
//                                 </div>
//                             ) : (
//                                 <>
//                                     <h1 className="text-2xl font-semibold">
//                                         {profileData.firstName} {profileData.lastName}
//                                     </h1>
//                                     <p className="text-gray-500">{profileData.email}</p>
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
//                                         onClick={() => {
//                                             setEditMode(false);
//                                             fetchProfileData(); // Reset to original data
//                                         }}
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
//                                 className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "personal" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"
//                                     }`}
//                             >
//                                 Personal Information
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab("security")}
//                                 className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "security" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"
//                                     }`}
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
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
//                                         {editMode ? (
//                                             <input
//                                                 type="text"
//                                                 name="firstName"
//                                                 value={profileData.firstName}
//                                                 onChange={handleInputChange}
//                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
//                                                 placeholder="First Name"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-800">{profileData.firstName}</p>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
//                                         {editMode ? (
//                                             <input
//                                                 type="text"
//                                                 name="lastName"
//                                                 value={profileData.lastName}
//                                                 onChange={handleInputChange}
//                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
//                                                 placeholder="Last Name"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-800">{profileData.lastName}</p>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
//                                         {editMode ? (
//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={profileData.email}
//                                                 onChange={handleInputChange}
//                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
//                                                 placeholder="Email"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-800">{profileData.email}</p>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
//                                         {editMode ? (
//                                             <input
//                                                 type="tel"
//                                                 name="phone"
//                                                 value={profileData.phone}
//                                                 onChange={handleInputChange}
//                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
//                                                 placeholder="Phone Number"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-800">{profileData.phone || "Not provided"}</p>
//                                         )}
//                                     </div>
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
import { callApi } from "../../util/admin_api";

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

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
            }
        } catch (error: any) {
            console.error("Error fetching profile data:", error);
            toast.error(error.response?.data?.message || "Failed to fetch profile data");
        } finally {
            setLoading(false);
        }
    };

    // Get initials for avatar
    const getInitials = () => {
        if (!profileData || !profileData.firstName || !profileData.lastName) {
            return 'SA';
        }
        const first = profileData.firstName.charAt(0).toUpperCase();
        const last = profileData.lastName.charAt(0).toUpperCase();
        return first + last;
    };

    // Handle input changes for profile data
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData((prev) => prev ? ({ ...prev, [name]: value }) : prev);
    };

    // Handle password input changes
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle profile save
    const handleSave = async () => {
        if (!profileData || !profileData.firstName || !profileData.lastName || !profileData.email) {
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
            const response = await callApi({
                endpoint: "/admin/update-profile",
                method: "PATCH",
                data: {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    email: profileData.email,
                    phone: profileData.phone,
                },
            });
            if (response.data) {
                // Assuming response.data is the updated profile object
                setProfileData(response.data);
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
            const response = await callApi({
                endpoint: "/admin/change-password",
                method: "PATCH",
                data: {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
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
            await callApi({
                endpoint: "/admin/delete-account",
                method: "DELETE",
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

    if (loading || !profileData) {
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
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-600">
                                    {getInitials()}
                                </span>
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-2xl font-bold text-gray-900">
                                {profileData.firstName} {profileData.lastName}
                            </h4>
                            <p className="text-gray-600">{profileData.email}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab("personal")}
                                className={`${activeTab === "personal"
                                        ? "border-[#F47C7C] text-[#F47C7C]"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Personal Information
                            </button>
                            <button
                                onClick={() => setActiveTab("security")}
                                className={`${activeTab === "security"
                                        ? "border-[#F47C7C] text-[#F47C7C]"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Security
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === "personal" && (
                            <div>
                                {editMode ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={profileData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F47C7C] focus:border-[#F47C7C]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={profileData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F47C7C] focus:border-[#F47C7C]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F47C7C] focus:border-[#F47C7C]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F47C7C] focus:border-[#F47C7C]"
                                            />
                                        </div>
                                        <div className="flex space-x-3 pt-4">
                                            <button
                                                onClick={handleSave}
                                                disabled={loading}
                                                className="flex-1 bg-[#F47C7C] text-white py-2 px-4 rounded-md hover:bg-[#e56b6b] disabled:opacity-50"
                                            >
                                                {loading ? "Saving..." : "Save Changes"}
                                            </button>
                                            <button
                                                onClick={() => setEditMode(false)}
                                                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    First Name
                                                </label>
                                                <p className="text-gray-900">{profileData.firstName}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Last Name
                                                </label>
                                                <p className="text-gray-900">{profileData.lastName}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <p className="text-gray-900">{profileData.email}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone
                                                </label>
                                                <p className="text-gray-900">{profileData.phone || "Not provided"}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="bg-[#F47C7C] text-white py-2 px-4 rounded-md hover:bg-[#e56b6b]"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6">
                                {/* Password Change */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                                    {showPasswordFields ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F47C7C] focus:border-[#F47C7C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F47C7C] focus:border-[#F47C7C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F47C7C] focus:border-[#F47C7C]"
                                                />
                                            </div>
                                            <div className="flex space-x-3 pt-4">
                                                <button
                                                    onClick={handlePasswordSave}
                                                    disabled={loading}
                                                    className="flex-1 bg-[#F47C7C] text-white py-2 px-4 rounded-md hover:bg-[#e56b6b] disabled:opacity-50"
                                                >
                                                    {loading ? "Saving..." : "Change Password"}
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
                                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowPasswordFields(true)}
                                            className="bg-[#F47C7C] text-white py-2 px-4 rounded-md hover:bg-[#e56b6b]"
                                        >
                                            Change Password
                                        </button>
                                    )}
                                </div>

                                {/* Delete Account */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Permanently remove your account and all associated data. This action cannot be undone.
                                    </p>
                                    {showDeleteConfirm ? (
                                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                            <p className="text-sm text-red-800 mb-3">
                                                Are you sure you want to delete your account? This action cannot be undone.
                                            </p>
                                            <input
                                                type="text"
                                                placeholder="Type 'DELETE' to confirm"
                                                value={deleteConfirmText}
                                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                                className="w-full px-3 py-2 border border-red-300 rounded-md mb-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                            />
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={handleDeleteAccount}
                                                    disabled={loading || deleteConfirmText !== "DELETE"}
                                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    {loading ? "Deleting..." : "DELETE"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDeleteConfirm(false);
                                                        setDeleteConfirmText("");
                                                    }}
                                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                                        >
                                            Delete My Account
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
// import React, { useState, useRef } from "react";
// import profile from "../../assets/profile/priya.jpg";
// import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// interface ProfileData {
//     firstName: string;
//     lastName: string;
//     email: string;
//     location: string;
//     phone: string;
//     // address: string;
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
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const [profileData, setProfileData] = useState<ProfileData>({
//         firstName: "Admin",
//         lastName: "Admin",
//         email: "admin@pfm.com",
//         location: "Bengaluru, Karnataka, India",
//         phone: "+91 6370804472",
//         // address: "123 Main Street, Bengaluru, Karnataka, India",
//     });

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

//     const handleSave = () => {
//         // Basic validation
//         if (!profileData.firstName || !profileData.lastName || !profileData.email) {
//             // if (!profileData.firstName || !profileData.lastName || !profileData.email || !profileData.address) {
//             alert("Please fill in all required fields (First Name, Last Name, Email).");
//             // alert("Please fill in all required fields (First Name, Last Name, Email, Address).");
//             return;
//         }
//         setEditMode(false);
//         toast.success("Profile updated successfully", {
//             position: "top-right",
//             autoClose: 3000, // auto close in 3s
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,

//         });
//         console.log("Profile data saved:", profileData);
//     };

//     const handlePasswordSave = () => {
//         if (passwordData.newPassword !== passwordData.confirmPassword) {
//             alert("New passwords don't match!");
//             return;
//         }
//         if (passwordData.newPassword.length < 8) {
//             alert("New password must be at least 8 characters long.");
//             return;
//         }
//         console.log("Password change requested:", passwordData);
//         setShowPasswordFields(false);
//         setPasswordData({
//             currentPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//         });
//         toast.success("Password changed successfully", {
//             position: "top-right",
//             autoClose: 3000, // auto close in 3s
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,

//         });
//     };

//     const navigate = useNavigate();

//     const handleDeleteAccount = () => {
//         if (deleteConfirmText !== "DELETE") {
//             alert("Please type 'DELETE' to confirm");
//             return;
//         }
//         console.log("Account deletion requested");
//         setShowDeleteConfirm(false);
//         setDeleteConfirmText("");
//         toast.success("Admin deleted successfully", {
//             position: "top-right",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined
//         });


//         // Redirect after 3s
//         setTimeout(() => {
//             if (localStorage.getItem("superAdminUser")) {
//                 localStorage.removeItem("superAdminUser"); // only remove this key
//                 // OR clear all local storage:
//                 // localStorage.clear();
//                 console.log("superAdminUser removed from localStorage");
//             }
//             navigate("/");
//         }, 3000);

//     };

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             // Validate file type and size
//             if (!file.type.startsWith("image/")) {
//                 alert("Please upload a valid image file.");
//                 return;
//             }
//             if (file.size > 5 * 1024 * 1024) {
//                 // 5MB limit
//                 alert("Image size must be less than 5MB.");
//                 return;
//             }
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 if (event.target?.result) {
//                     setProfileImage(event.target.result as string);
//                 }
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const triggerFileInput = () => {
//         fileInputRef.current?.click();
//     };

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
//                                     {/* <input
//                                     type="text"
//                                     name="lastName"
//                                     value={profileData.lastName}
//                                     onChange={handleInputChange}
//                                     className="text-2xl font-semibold border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none w-full text-center md:text-left"
//                                 /> */}
//                                     <input
//                                         type="text"
//                                         name="location"
//                                         value={profileData.location}
//                                         onChange={handleInputChange}
//                                         className="text-gray-500 border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none w-full text-center md:text-left"
//                                     />
//                                     {/* <input
//                                     type="text"
//                                     name="address"
//                                     value={profileData.address}
//                                     onChange={handleInputChange}
//                                     className="text-gray-500 border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none w-full text-center md:text-left"
//                                 /> */}
//                                 </div>
//                             ) : (
//                                 <>
//                                     <h1 className="text-2xl font-semibold">
//                                         {profileData.firstName}
//                                         {/* {profileData.lastName} */}
//                                     </h1>
//                                     <p className="text-gray-500">{profileData.email}</p>
//                                     {/* <p className="text-gray-500">{profileData.address}</p> */}
//                                 </>
//                             )}
//                         </div>

//                         {/* Edit Button */}
//                         <div className="mt-4 md:mt-0">
//                             {editMode ? (
//                                 <div className="flex space-x-2">
//                                     <button
//                                         onClick={handleSave}
//                                         className="bg-[#F47C7C] text-white rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-[#EF9F9F] transition"
//                                     >
//                                         Save Changes
//                                     </button>
//                                     <button
//                                         onClick={() => setEditMode(false)}
//                                         className="bg-gray-200 rounded-lg px-4 py-2 text-sm font-medium shadow hover:bg-gray-300 transition"
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

//                                     {/* Address */}
//                                     {/* <div>
//                                         <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
//                                         {editMode ? (
//                                             <input
//                                                 type="text"
//                                                 name="address"
//                                                 value={profileData.address}
//                                                 onChange={handleInputChange}
//                                                 className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-800">{profileData.address}</p>
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
//                                                         className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition"
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
//                                                         className="bg-[#F47C7C] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#EF9F9F] transition"
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
import profile from "../../assets/profile/priya.jpg";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { callApi } from "../../util/admin_api";

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    // location: string;
    phone: string;
    img?: string;
}

interface AdminTokenPayload extends JwtPayload {
    userId: string; // Matches your JWT payload key
    role?: string;
    name?: string;
    loginTime?: string;
    iat?: number;
    exp?: number;
}

interface JwtPayload {
    userId: string; // Base structure for JWT payload
    [key: string]: any; // Allow additional fields
}

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string>(profile);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: "",
        lastName: "",
        email: "",
        // location: "",
        phone: "",
    });

    useEffect(() => {
        fetchProfileData();
    }, []);

    const getAdminIdFromToken = (token: string | null): string | null => {
        if (!token) return null;

        try {
            const decoded = jwtDecode<AdminTokenPayload>(token);
            return decoded.userId || null; // Extract userId from token
        } catch (err) {
            console.error("Invalid token:", err);
            return null;
        }
    };

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
            console.log("🚀 ~ fetchProfileData ~ response:", response)

            // Fix: Access response.data directly instead of response.data.data
            if (response.data) {
                const adminData = response.data;
                setProfileData({
                    firstName: adminData.firstName || "",
                    lastName: adminData.lastName || "",
                    email: adminData.email || "",
                    // location: adminData.location || "",
                    phone: adminData.phone || "",
                });

                if (adminData.img) {
                    setProfileImage(adminData.img);
                }
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
            toast.error("Failed to fetch profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!profileData.firstName || !profileData.lastName || !profileData.email) {
            alert("Please fill in all required fields (First Name, Last Name, Email).");
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
                endpoint: "/admin/update-profile",
                method: "PATCH",
                data: profileData,
                config: {
                    headers: {
                        "Admin-ID": adminId, // ✅ extra header
                    },
                },
            });
            if (response.data) {
                setEditMode(false);
                toast.success("Profile updated successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSave = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords don't match!");
            return;
        }
        if (passwordData.newPassword.length < 8) {
            alert("New password must be at least 8 characters long.");
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
                        "Admin-ID": adminId, // custom header still included
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
                toast.success("Password changed successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error: any) {
            console.error("Error changing password:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to change password");
            }
        } finally {
            setLoading(false);
            setShowPasswordFields(false)
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "DELETE") {
            alert("Please type 'DELETE' to confirm");
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
                        "Admin-ID": adminId, // custom header
                        // Authorization header is already added automatically by the interceptor
                    },
                },
            });

            setShowDeleteConfirm(false);
            setDeleteConfirmText("");

            toast.success("Admin deleted successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setTimeout(() => {
                localStorage.removeItem("superAdminUser"); // Clear superAdminUser
                navigate("/");
            }, 3000);
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Failed to delete account");
            setLoading(false);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.startsWith("image/")) {
                alert("Please upload a valid image file.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size must be less than 5MB.");
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
                formData.append("image", file);

                const response = await axios.put(
                    `${process.env.REACT_APP_API_URL}/admin/update-profile`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                            "Admin-ID": adminId,
                        },
                    }
                );

                if (response.data && response.data.data && response.data.data.img) {
                    setProfileImage(response.data.data.img);
                    toast.success("Profile image updated successfully");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Failed to update profile image");
            } finally {
                setLoading(false);
            }
        }
    };

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
            <ToastContainer />
            <div className="max-w-6xl mx-auto p-4">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center">
                        {/* Profile Image */}
                        <div className="relative mb-4 md:mb-0 md:mr-6">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-[#FFF2F2] object-cover"
                            />
                            {editMode && (
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
                                        accept="image/*"
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
                                    />
                                    <input
                                        type="text"
                                        name="location"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        className="text-gray-500 border-b border-gray-300 max-w-[15rem] focus:border-[#F47C7C] focus:outline-none w-full text-center md:text-left"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-semibold">
                                        {profileData.firstName} {profileData.lastName}
                                    </h1>
                                    {/* <p className="text-gray-500">ID: {getAdminIdFromToken(JSON.parse(localStorage.getItem("superAdminUser") || '{}').token) || "Not available"}</p> */}
                                    <p className="text-gray-500">{profileData.email}</p>
                                    {/* <p className="text-gray-500">{profileData.location}</p> */}
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
                                        onClick={() => setEditMode(false)}
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
                                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "personal" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"}`}
                            >
                                Personal Information
                            </button>
                            <button
                                onClick={() => setActiveTab("security")}
                                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "security" ? "bg-[#FFF2F2] text-[#F47C7C]" : "hover:bg-gray-100"}`}
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
                                    {/* Admin ID (Read-only) */}
                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Admin ID</label>
                                        <p className="text-gray-800">{getAdminIdFromToken(JSON.parse(localStorage.getItem("superAdminUser") || '{}').token) || "Not available"}</p>
                                    </div> */}

                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={profileData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profileData.firstName}</p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={profileData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profileData.lastName}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                        {editMode ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profileData.email}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                                        {editMode ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profileData.phone}</p>
                                        )}
                                    </div>

                                    {/* Location */}
                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="location"
                                                value={profileData.location}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 focus:border-[#F47C7C] focus:outline-none py-1"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profileData.location}</p>
                                        )}
                                    </div> */}
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
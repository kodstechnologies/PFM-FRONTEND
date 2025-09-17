// import type React from "react"
// import { useState } from "react"
// import { Trash2, Download, AlertTriangle, CheckCircle, Phone, Shield, ChevronRight, FileText, Clock, HelpCircle } from "lucide-react"

// function DeleteAccount() {
//     const [submitted, setSubmitted] = useState(false)
//     const [phoneNumber, setPhoneNumber] = useState("")
//     const [isConfirmed, setIsConfirmed] = useState(false)
//     const [activeTab, setActiveTab] = useState("delete") // For policy/details tabs

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         if (isConfirmed && phoneNumber) {
//             setSubmitted(true)
//         }
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center py-12 px-4">
//             <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
//                 {/* Header with gradient */}
//                 <div className="bg-gradient-to-r from-rose-600 to-rose-500 text-white p-8 text-center relative overflow-hidden">
//                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0VjIySDE4djEyaDE4em0yIDBIMzZWMjJoMnYxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
//                     <div className="relative z-10">
//                         <div className="flex justify-center mb-6">
//                             <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
//                                 <Trash2 className="w-10 h-10" />
//                             </div>
//                         </div>
//                         <h1 className="text-4xl font-bold mb-3 text-balance">Account Deletion</h1>
//                         <p className="text-white/90 text-lg">We're sorry to see you go</p>
//                     </div>
//                 </div>

//                 <div className="p-8">
//                     {!submitted ? (
//                         <>
//                             <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 shadow-sm">
//                                 <div className="flex items-start gap-4">
//                                     <div className="flex-shrink-0 mt-1">
//                                         <AlertTriangle className="text-amber-500 w-6 h-6" />
//                                     </div>
//                                     <div>
//                                         <p className="text-amber-800 font-semibold text-lg mb-2">Before you proceed</p>
//                                         <ul className="text-amber-700 leading-relaxed list-disc pl-5 space-y-1">
//                                             <li>Account deletion is permanent and cannot be undone</li>
//                                             <li>Download any data you wish to keep before proceeding</li>
//                                             <li>Cancel any active subscriptions before deletion</li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>

//                             <form onSubmit={handleSubmit} className="mb-10">
//                                 <div className="space-y-8">
//                                     <div>
//                                         <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
//                                             <Phone className="w-4 h-4" />
//                                             Phone Number Verification
//                                         </label>
//                                         <div className="relative">
//                                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                                 <Phone className="text-slate-400 w-5 h-5" />
//                                             </div>
//                                             <input
//                                                 id="phone"
//                                                 type="text"
//                                                 placeholder="Enter your registered phone number"
//                                                 className="pl-12 w-full p-4 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder:text-slate-400 shadow-sm"
//                                                 value={phoneNumber}
//                                                 onChange={(e) => setPhoneNumber(e.target.value)}
//                                                 required
//                                             />
//                                         </div>
//                                         <p className="text-slate-500 text-sm mt-2">We'll send a verification code to this number</p>
//                                     </div>

//                                     <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
//                                         <div className="flex items-center h-6 mt-1">
//                                             <input
//                                                 id="confirmation"
//                                                 type="checkbox"
//                                                 className="focus:ring-rose-500 h-5 w-5 text-rose-600 border-slate-300 rounded transition-colors"
//                                                 checked={isConfirmed}
//                                                 onChange={(e) => setIsConfirmed(e.target.checked)}
//                                                 required
//                                             />
//                                         </div>
//                                         <div className="text-sm">
//                                             <label htmlFor="confirmation" className="font-semibold text-slate-800 cursor-pointer">
//                                                 I understand that this action cannot be undone
//                                             </label>
//                                             <p className="text-slate-600 mt-2 leading-relaxed">
//                                                 I confirm that I want to permanently delete my account and all associated data from the platform.
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <button
//                                         type="submit"
//                                         disabled={!isConfirmed || !phoneNumber}
//                                         className="w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white p-4 rounded-xl font-semibold hover:from-rose-700 hover:to-rose-600 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
//                                     >
//                                         <Trash2 className="w-5 h-5" />
//                                         Delete My Account
//                                     </button>
//                                 </div>
//                             </form>
//                         </>
//                     ) : (
//                         <div className="text-center py-12">
//                             <div className="flex justify-center mb-6">
//                                 <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100">
//                                     <CheckCircle className="text-emerald-600 w-12 h-12" />
//                                 </div>
//                             </div>
//                             <h2 className="text-3xl font-bold text-emerald-700 mb-4">Request Submitted</h2>
//                             <p className="text-slate-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
//                                 Your account deletion request has been sent to our admin team. They will process it within 24-48 hours.
//                             </p>
//                             <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-left max-w-lg mx-auto">
//                                 <div className="flex items-start gap-4">
//                                     <Shield className="text-blue-600 w-6 h-6 flex-shrink-0 mt-1" />
//                                     <div>
//                                         <p className="text-blue-800 font-semibold text-lg mb-2">What happens next?</p>
//                                         <p className="text-slate-700 leading-relaxed">
//                                             You'll receive a confirmation SMS once your account has been deleted. Some data may be retained
//                                             for legal purposes as per our privacy policy.
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Tabbed section for policy and details */}
//                     <div className="border-t border-slate-200 pt-10 mt-10">
//                         <div className="flex border-b border-slate-200 mb-6">
//                             <button
//                                 className={`px-4 py-3 font-medium flex items-center gap-2 ${activeTab === 'delete' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
//                                 onClick={() => setActiveTab('delete')}
//                             >
//                                 <Trash2 className="w-4 h-4" />
//                                 Deletion Policy
//                             </button>
//                             <button
//                                 className={`px-4 py-3 font-medium flex items-center gap-2 ${activeTab === 'data' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
//                                 onClick={() => setActiveTab('data')}
//                             >
//                                 <FileText className="w-4 h-4" />
//                                 Data Handling
//                             </button>
//                             <button
//                                 className={`px-4 py-3 font-medium flex items-center gap-2 ${activeTab === 'timeline' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
//                                 onClick={() => setActiveTab('timeline')}
//                             >
//                                 <Clock className="w-4 h-4" />
//                                 Process Timeline
//                             </button>
//                         </div>

//                         {activeTab === 'delete' && (
//                             <div>
//                                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
//                                     <Shield className="text-rose-600 w-6 h-6" />
//                                     Account Deletion Policy
//                                 </h2>
//                                 <p className="text-slate-600 mb-6 text-lg leading-relaxed">
//                                     By deleting your account, the following data will be permanently removed:
//                                 </p>
//                                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                                     {[
//                                         "Personal information (phone number, name)",
//                                         "Order history",
//                                         "Payment details",
//                                         "Preferences and saved settings",
//                                         "Account activity logs",
//                                         "Saved addresses",
//                                         "Chat history with support",
//                                         "Wishlists and favorites",
//                                     ].map((item, index) => (
//                                         <li key={index} className="flex items-start gap-3">
//                                             <div className="bg-rose-100 p-1.5 rounded-full mt-0.5 flex-shrink-0">
//                                                 <CheckCircle className="w-4 h-4 text-rose-600" />
//                                             </div>
//                                             <span className="text-slate-700 leading-relaxed">{item}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}

//                         {activeTab === 'data' && (
//                             <div>
//                                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
//                                     <HelpCircle className="text-rose-600 w-6 h-6" />
//                                     Data Retention Policy
//                                 </h2>
//                                 <p className="text-slate-600 mb-6 text-lg leading-relaxed">
//                                     For legal and compliance reasons, we retain certain information even after account deletion:
//                                 </p>
//                                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
//                                     <p className="text-slate-700 leading-relaxed">
//                                         <strong className="text-rose-600">Note:</strong> Transaction records, billing information, and other data required by regulatory authorities may be retained for up to 30 days as required by law. This data is kept in secure archives and is not accessible through normal application functions.
//                                     </p>
//                                 </div>
//                             </div>
//                         )}

//                         {activeTab === 'timeline' && (
//                             <div>
//                                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
//                                     <Clock className="text-rose-600 w-6 h-6" />
//                                     Deletion Process Timeline
//                                 </h2>
//                                 <div className="space-y-6">
//                                     <div className="flex gap-4">
//                                         <div className="flex flex-col items-center">
//                                             <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
//                                                 <span className="text-rose-600 font-bold">1</span>
//                                             </div>
//                                             <div className="w-0.5 h-16 bg-rose-200 my-1"></div>
//                                         </div>
//                                         <div>
//                                             <h3 className="font-semibold text-slate-800">Request Submission</h3>
//                                             <p className="text-slate-600">Your deletion request is received and queued for processing</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-4">
//                                         <div className="flex flex-col items-center">
//                                             <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
//                                                 <span className="text-rose-600 font-bold">2</span>
//                                             </div>
//                                             <div className="w-0.5 h-16 bg-rose-200 my-1"></div>
//                                         </div>
//                                         <div>
//                                             <h3 className="font-semibold text-slate-800">Verification</h3>
//                                             <p className="text-slate-600">Our team verifies your identity and request (within 24 hours)</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-4">
//                                         <div className="flex flex-col items-center">
//                                             <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
//                                                 <span className="text-rose-600 font-bold">3</span>
//                                             </div>
//                                             <div className="w-0.5 h-16 bg-rose-200 my-1"></div>
//                                         </div>
//                                         <div>
//                                             <h3 className="font-semibold text-slate-800">Processing</h3>
//                                             <p className="text-slate-600">Your data is scheduled for deletion from all systems</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-4">
//                                         <div className="flex flex-col items-center">
//                                             <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
//                                                 <span className="text-rose-600 font-bold">4</span>
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <h3 className="font-semibold text-slate-800">Confirmation</h3>
//                                             <p className="text-slate-600">You receive SMS confirmation when deletion is complete</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <div className="border-t border-slate-200 pt-10 mt-10">
//                         <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-800">
//                             <Download className="text-rose-600 w-6 h-6" />
//                             Download Our Apps
//                         </h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                             {[
//                                 {
//                                     title: "User App",
//                                     description: "Order fresh meat with ease",
//                                     qrData: "https://example.com/user-app",
//                                     bgColor: "bg-rose-50",
//                                     iconColor: "text-rose-600",
//                                 },
//                                 {
//                                     title: "Delivery Partner App",
//                                     description: "Join our delivery network",
//                                     qrData: "https://example.com/delivery-partner-app",
//                                     bgColor: "bg-blue-50",
//                                     iconColor: "text-blue-600",
//                                 },
//                             ].map((app, index) => (
//                                 <div
//                                     key={index}
//                                     className={`${app.bgColor} p-8 rounded-2xl text-center border border-slate-200 hover:shadow-lg transition-shadow duration-200`}
//                                 >
//                                     <h3 className="text-xl font-semibold mb-3 text-slate-800">{app.title}</h3>
//                                     <p className="text-slate-600 mb-6 leading-relaxed">{app.description}</p>
//                                     <div className="bg-white p-4 rounded-xl inline-block border border-slate-200 shadow-sm">
//                                         <img
//                                             src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${app.qrData}`}
//                                             alt={`${app.title} QR Code`}
//                                             className="w-36 h-36 mx-auto"
//                                         />
//                                     </div>
//                                     <p className="text-slate-500 text-sm mt-4">Scan to download</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default DeleteAccount

import type React from "react";
import { useState } from "react";
import { Trash2, Download, AlertTriangle, CheckCircle, Phone, Shield, ChevronRight, FileText, Clock, HelpCircle, AlertCircle } from "lucide-react";

interface DeleteAccountState {
    submitted: boolean;
    phoneNumber: string;
    isConfirmed: boolean;
    phoneError: string | null;
    activeTab: string;
}

const DeleteAccount: React.FC = () => {
    const [state, setState] = useState<DeleteAccountState>({
        submitted: false,
        phoneNumber: "",
        isConfirmed: false,
        phoneError: null,
        activeTab: "delete",
    });

    const validatePhoneNumber = (phone: string): string | null => {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return "Phone number must be exactly 10 digits";
        }
        return null;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Allow only digits
        setState((prev) => ({
            ...prev,
            phoneNumber: value.slice(0, 10), // Limit to 10 digits
            phoneError: validatePhoneNumber(value),
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const phoneError = validatePhoneNumber(state.phoneNumber);
        if (state.isConfirmed && !phoneError) {
            setState((prev) => ({ ...prev, submitted: true }));
        } else {
            setState((prev) => ({ ...prev, phoneError }));
        }
    };

    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({ ...prev, isConfirmed: e.target.checked }));
    };

    const handleTabChange = (tab: string) => {
        setState((prev) => ({ ...prev, activeTab: tab }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center py-12 px-4">
            <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-3xl">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-rose-600 to-rose-500 text-white p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0VjIySDE4djEyaDE4em0yIDBIMzZWMjJoMnYxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 transform transition-transform hover:scale-110">
                                <Trash2 className="w-10 h-10" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-extrabold mb-3 text-balance tracking-tight">Account Deletion</h1>
                        <p className="text-white/90 text-lg">We're sorry to see you go</p>
                    </div>
                </div>

                <div className="p-10">
                    {!state.submitted ? (
                        <>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 shadow-sm transition-all duration-300 hover:bg-amber-100">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <AlertTriangle className="text-amber-500 w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-amber-800 font-semibold text-lg mb-2">Before you proceed</p>
                                        <ul className="text-amber-700 leading-relaxed list-disc pl-5 space-y-2">
                                            <li>Account deletion is permanent and cannot be undone</li>
                                            <li>Download any data you wish to keep before proceeding</li>
                                            <li>Cancel any active subscriptions before deletion</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="mb-10" aria-label="Account deletion form">
                                <div className="space-y-8">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Phone Number Verification
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="text-slate-400 w-5 h-5" />
                                            </div>
                                            <input
                                                id="phone"
                                                type="text"
                                                placeholder="Enter your registered phone number"
                                                className={`pl-12 w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all duration-200 text-slate-900 placeholder:text-slate-400 shadow-sm ${state.phoneError ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-rose-500"
                                                    }`}
                                                value={state.phoneNumber}
                                                onChange={handlePhoneChange}
                                                required
                                                aria-required="true"
                                                aria-invalid={!!state.phoneError}
                                                aria-describedby={state.phoneError ? "phone-error" : undefined}
                                                maxLength={10}
                                            />
                                        </div>
                                        {state.phoneError && (
                                            <p id="phone-error" className="text-red-600 text-sm mt-2 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                {state.phoneError}
                                            </p>
                                        )}
                                        <p className="text-slate-500 text-sm mt-2">We'll send a verification code to this number</p>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="flex items-center h-6 mt-1">
                                            <input
                                                id="confirmation"
                                                type="checkbox"
                                                className="focus:ring-rose-500 h-5 w-5 text-rose-600 border-slate-300 rounded transition-colors"
                                                checked={state.isConfirmed}
                                                onChange={handleConfirmChange}
                                                required
                                                aria-required="true"
                                            />
                                        </div>
                                        <div className="text-sm">
                                            <label htmlFor="confirmation" className="font-semibold text-slate-800 cursor-pointer">
                                                I understand that this action cannot be undone
                                            </label>
                                            <p className="text-slate-600 mt-2 leading-relaxed">
                                                I confirm that I want to permanently delete my account and all associated data from the platform.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!state.isConfirmed || !!state.phoneError || !state.phoneNumber}
                                        className="w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white p-4 rounded-xl font-semibold text-lg hover:from-rose-700 hover:to-rose-600 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
                                        aria-disabled={!state.isConfirmed || !!state.phoneError || !state.phoneNumber}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        Delete My Account
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 transform transition-transform hover:scale-110">
                                    <CheckCircle className="text-emerald-600 w-12 h-12" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-emerald-700 mb-4">Request Submitted</h2>
                            <p className="text-slate-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                                Your account deletion request has been sent to our admin team. They will process it within 24-48 hours.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-left max-w-lg mx-auto shadow-sm transition-all duration-300 hover:bg-blue-100">
                                <div className="flex items-start gap-4">
                                    <Shield className="text-blue-600 w-6 h-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-blue-800 font-semibold text-lg mb-2">What happens next?</p>
                                        <p className="text-slate-700 leading-relaxed">
                                            You'll receive a confirmation SMS once your account has been deleted. Some data may be retained for legal purposes as per our privacy policy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabbed section for policy and details */}
                    {/* <div className="border-t border-slate-200 pt-10 mt-10">
                        <div className="flex border-b border-slate-200 mb-6">
                            <button
                                className={`px-4 py-3 font-medium flex items-center gap-2 ${state.activeTab === "delete" ? "text-rose-600 border-b-2 border-rose-600" : "text-slate-500 hover:text-slate-700"
                                    } transition-colors duration-200`}
                                onClick={() => handleTabChange("delete")}
                                aria-selected={state.activeTab === "delete"}
                            >
                                <Trash2 className="w-4 h-4" />
                                Deletion Policy
                            </button>
                            <button
                                className={`px-4 py-3 font-medium flex items-center gap-2 ${state.activeTab === "data" ? "text-rose-600 border-b-2 border-rose-600" : "text-slate-500 hover:text-slate-700"
                                    } transition-colors duration-200`}
                                onClick={() => handleTabChange("data")}
                                aria-selected={state.activeTab === "data"}
                            >
                                <FileText className="w-4 h-4" />
                                Data Handling
                            </button>
                            <button
                                className={`px-4 py-3 font-medium flex items-center gap-2 ${state.activeTab === "timeline" ? "text-rose-600 border-b-2 border-rose-600" : "text-slate-500 hover:text-slate-700"
                                    } transition-colors duration-200`}
                                onClick={() => handleTabChange("timeline")}
                                aria-selected={state.activeTab === "timeline"}
                            >
                                <Clock className="w-4 h-4" />
                                Process Timeline
                            </button>
                        </div>

                        {state.activeTab === "delete" && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                                    <Shield className="text-rose-600 w-6 h-6" />
                                    Account Deletion Policy
                                </h2>
                                <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                                    By deleting your account, the following data will be permanently removed:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {[
                                        "Personal information (phone number, name)",
                                        "Order history",
                                        "Payment details",
                                        "Preferences and saved settings",
                                        "Account activity logs",
                                        "Saved addresses",
                                        "Chat history with support",
                                        "Wishlists and favorites",
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="bg-rose-100 p-1.5 rounded-full mt-0.5 flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-rose-600" />
                                            </div>
                                            <span className="text-slate-700 leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {state.activeTab === "data" && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                                    <HelpCircle className="text-rose-600 w-6 h-6" />
                                    Data Retention Policy
                                </h2>
                                <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                                    For legal and compliance reasons, we retain certain information even after account deletion:
                                </p>
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-sm">
                                    <p className="text-slate-700 leading-relaxed">
                                        <strong className="text-rose-600">Note:</strong> Transaction records, billing information, and other data required by regulatory authorities may be retained for up to 30 days as required by law. This data is kept in secure archives and is not accessible through normal application functions.
                                    </p>
                                </div>
                            </div>
                        )}

                        {state.activeTab === "timeline" && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                                    <Clock className="text-rose-600 w-6 h-6" />
                                    Deletion Process Timeline
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        {
                                            step: "Request Submission",
                                            description: "Your deletion request is received and queued for processing",
                                        },
                                        {
                                            step: "Verification",
                                            description: "Our team verifies your identity and request (within 24 hours)",
                                        },
                                        {
                                            step: "Processing",
                                            description: "Your data is scheduled for deletion from all systems",
                                        },
                                        {
                                            step: "Confirmation",
                                            description: "You receive SMS confirmation when deletion is complete",
                                        },
                                    ].map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                                                    <span className="text-rose-600 font-bold">{index + 1}</span>
                                                </div>
                                                {index < 3 && <div className="w-0.5 h-16 bg-rose-200 my-1"></div>}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800">{item.step}</h3>
                                                <p className="text-slate-600">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div> */}

                    {/* <div className="border-t border-slate-200 pt-10 mt-10">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-800">
                            <Download className="text-rose-600 w-6 h-6" />
                            Download Our Apps
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: "User App",
                                    description: "Order fresh meat with ease",
                                    qrData: "https://example.com/user-app",
                                    bgColor: "bg-rose-50",
                                    iconColor: "text-rose-600",
                                },
                                {
                                    title: "Delivery Partner App",
                                    description: "Join our delivery network",
                                    qrData: "https://example.com/delivery-partner-app",
                                    bgColor: "bg-blue-50",
                                    iconColor: "text-blue-600",
                                },
                            ].map((app, index) => (
                                <div
                                    key={index}
                                    className={`${app.bgColor} p-8 rounded-2xl text-center border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}
                                >
                                    <h3 className="text-xl font-semibold mb-3 text-slate-800">{app.title}</h3>
                                    <p className="text-slate-600 mb-6 leading-relaxed">{app.description}</p>
                                    <div className="bg-white p-4 rounded-xl inline-block border border-slate-200 shadow-sm transform transition-transform hover:scale-110">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${app.qrData}`}
                                            alt={`${app.title} QR Code`}
                                            className="w-36 h-36 mx-auto"
                                        />
                                    </div>
                                    <p className="text-slate-500 text-sm mt-4">Scan to download</p>
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default DeleteAccount;
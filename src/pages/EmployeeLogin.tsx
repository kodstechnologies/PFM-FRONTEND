// // // import { useState, useEffect, useRef } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import loginimg from "../assets/login-image/login.jpg";
// // // import { toast, ToastContainer } from "react-toastify";
// // // import LoginIcon from '@mui/icons-material/Login';
// // // import { API_CONFIG } from "../config/api.config";
// // // import Cookies from "js-cookie";

// // // interface LoginForm {
// // //     phone: string;
// // //     otp: string;
// // //     userId?: string;
// // // }

// // // const EmployeeLogin = () => {
// // //     const navigate = useNavigate();
// // //     const [formData, setFormData] = useState<LoginForm>({
// // //         phone: '',
// // //         otp: '',
// // //         userId: ''
// // //     });
// // //     const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
// // //     const [isLoading, setIsLoading] = useState(false);
// // //     const [error, setError] = useState('');
// // //     const [shake, setShake] = useState(false);
// // //     const [otpSent, setOtpSent] = useState(false);
// // //     const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

// // //     // Check if user is already logged in


// // //     const handleInputChange = (field: keyof LoginForm, value: string) => {
// // //         setFormData(prev => ({
// // //             ...prev,
// // //             [field]: value
// // //         }));
// // //         setError('');
// // //     };

// // //     // Handle OTP digit input
// // //     const handleOtpChange = (index: number, value: string) => {
// // //         if (!/^\d?$/.test(value)) return;

// // //         const newOtpDigits = [...otpDigits];
// // //         newOtpDigits[index] = value;
// // //         setOtpDigits(newOtpDigits);

// // //         // Update formData.otp with concatenated OTP
// // //         const newOtp = newOtpDigits.join('');
// // //         handleInputChange('otp', newOtp);

// // //         // Move focus to next input
// // //         if (value && index < 3) {
// // //             otpRefs.current[index + 1]?.focus();
// // //         }
// // //     };

// // //     // Handle backspace to move to previous input
// // //     const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
// // //         if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
// // //             otpRefs.current[index - 1]?.focus();
// // //         }
// // //     };

// // //     const triggerErrorAnimation = () => {
// // //         setShake(true);
// // //         setTimeout(() => setShake(false), 500);
// // //     };

// // //     const handleSendOtp = async () => {
// // //         if (!formData.phone || formData.phone.length < 10) {
// // //             setError('Please enter a valid phone number');
// // //             triggerErrorAnimation();
// // //             return;
// // //         }

// // //         setIsLoading(true);
// // //         setError('');

// // //         try {
// // //             const response = await fetch(`${API_CONFIG.BASE_URL}/employee/send-otp`, {
// // //                 method: 'POST',
// // //                 headers: { 'Content-Type': 'application/json' },
// // //                 body: JSON.stringify({ phone: formData.phone })
// // //             });
// // //             const data = await response.json();
// // //             if (!response.ok || !data.success) {
// // //                 throw new Error(data.message || 'Failed to send OTP');
// // //             }
// // //             const userId = data.data?.userId || '';
// // //             setFormData(prev => ({
// // //                 ...prev,
// // //                 userId: userId
// // //             }));
// // //             setOtpSent(true);
// // //             toast.success("OTP sent successfully!", {
// // //                 style: { width: window.innerWidth < 640 ? "250px" : "350px" }
// // //             });
// // //         } catch (error: any) {
// // //             console.error('OTP send error:', error);
// // //             setError(error.message || 'Failed to send OTP');
// // //             triggerErrorAnimation();
// // //         } finally {
// // //             setIsLoading(false);
// // //         }
// // //     };

// // //     const handleLogin = async (e: React.FormEvent) => {
// // //         e.preventDefault();

// // //         if (!formData.otp || !formData.userId || formData.otp.length !== 4) {
// // //             setError('Please enter a valid 4-digit OTP');
// // //             triggerErrorAnimation();
// // //             return;
// // //         }

// // //         setIsLoading(true);
// // //         setError('');

// // //         try {
// // //             const response = await fetch(`${API_CONFIG.BASE_URL}/employee/verify-login`, {
// // //                 method: 'POST',
// // //                 headers: { 'Content-Type': 'application/json' },
// // //                 body: JSON.stringify({
// // //                     phone: formData.phone,
// // //                     otp: formData.otp,
// // //                     userId: formData.userId
// // //                 })
// // //             });
// // //             const data = await response.json();
// // //             if (!response.ok || !data.success) {
// // //                 throw new Error(data.message || 'Login failed');
// // //             }

// // //             const responseData = data.data || data;
// // //             const userData = {
// // //                 role: responseData.user.role,
// // //                 phone: formData.phone,
// // //                 id: responseData.user.id,
// // //                 storeId: responseData.user.storeId || null,
// // //                 loginTime: new Date().toISOString()
// // //             };

// // //             // Save in localStorage
// // //             localStorage.setItem('employeeUser', JSON.stringify(userData));

// // //             // Save tokens in localStorage (optional)
// // //             localStorage.setItem('accessToken', responseData.accessToken);
// // //             localStorage.setItem('refreshToken', responseData.refreshToken);

// // //             // Save tokens in cookies
// // //             Cookies.set('employeeAccessToken', responseData.accessToken, { path: '/', secure: true, sameSite: 'Strict', expires: 1 }); // 1 day
// // //             Cookies.set('employeeRefreshToken', responseData.refreshToken, { path: '/', secure: true, sameSite: 'Strict', expires: 7 }); // 7 days

// // //             toast.success("Login Successful!", {
// // //                 style: { width: window.innerWidth < 640 ? "250px" : "350px" }
// // //             });

// // //             // Navigate based on role
// // //             const openScreen = responseData.openScreen || (userData.role === 'MANAGER' ? 'manager' : 'store');
// // //             setTimeout(() => {
// // //                 navigate(`/${openScreen}-dashboard`);
// // //             }, 2000);
// // //         } catch (error: any) {
// // //             console.error('Login error:', error);
// // //             setError(error.message || 'Login failed');
// // //             triggerErrorAnimation();
// // //         } finally {
// // //             setIsLoading(false);
// // //         }
// // //     };

// // //     return (
// // //         <>
// // //             <ToastContainer />
// // //             <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
// // //                 {/* Background Image */}
// // //                 <div
// // //                     className="absolute inset-0 bg-cover bg-center bg-no-repeat"
// // //                     style={{
// // //                         backgroundImage: `url(${loginimg})`,
// // //                         filter: 'brightness(0.6) contrast(1.1)'
// // //                     }}
// // //                 />

// // //                 {/* Overlay for better text readability */}
// // //                 <div className="absolute inset-0 bg-black bg-opacity-20" />

// // //                 {/* Content Container */}
// // //                 <div className={`bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden w-full max-w-md transition-all duration-300 ${shake ? 'animate-shake' : ''} relative z-10 border border-white/30`}>
// // //                     <div className="pt-8 px-8 text-center relative overflow-hidden">
// // //                         <div className="relative z-10">
// // //                             <h1 className="text-3xl font-bold tracking-tight text-white">Employee Login</h1>
// // //                         </div>
// // //                     </div>

// // //                     <div className="p-8">
// // //                         <form onSubmit={handleLogin} className="space-y-6">
// // //                             <div>
// // //                                 <label className="block text-sm font-semibold text-white mb-3">
// // //                                     Phone Number
// // //                                 </label>
// // //                                 <div className="relative group bg-white flex items-center px-3 rounded-xl">
// // //                                     <svg className="h-5 w-5 text-gray-600 group-focus-within:text-blue-800 transition-colors" fill="currentColor" viewBox="0 0 20 20">
// // //                                         <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
// // //                                     </svg>
// // //                                     <input
// // //                                         type="tel"
// // //                                         value={formData.phone}
// // //                                         onChange={(e) => handleInputChange('phone', e.target.value)}
// // //                                         className="w-full px-4 py-3.5 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-[#fff0] focus:border-[#fff0] transition-all duration-300 pr-10 bg-white backdrop-blur-sm group-hover:bg-white group-hover:border-white/50 outline-none"
// // //                                         placeholder="9876543210"
// // //                                         required
// // //                                         disabled={otpSent}
// // //                                         onKeyDown={(e) => {
// // //                                             if (e.key === "Enter") e.preventDefault();
// // //                                         }}
// // //                                     />
// // //                                 </div>
// // //                             </div>

// // //                             {!otpSent ? (
// // //                                 <button
// // //                                     type="button"
// // //                                     onClick={handleSendOtp}
// // //                                     disabled={isLoading}
// // //                                     className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
// // //                                         ? 'bg-blue-600 cursor-not-allowed'
// // //                                         : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
// // //                                         } flex items-center justify-center`}
// // //                                 >
// // //                                     {isLoading ? (
// // //                                         <>
// // //                                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// // //                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// // //                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// // //                                             </svg>
// // //                                             Sending OTP...
// // //                                         </>
// // //                                     ) : (
// // //                                         <>
// // //                                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// // //                                             </svg>
// // //                                             Send OTP
// // //                                         </>
// // //                                     )}
// // //                                 </button>
// // //                             ) : (
// // //                                 <>
// // //                                     <div>
// // //                                         <label className="block text-sm font-semibold text-white mb-3">
// // //                                             OTP
// // //                                         </label>
// // //                                         <div className="flex gap-12 justify-center">
// // //                                             {otpDigits.map((digit, index) => (
// // //                                                 <input
// // //                                                     key={index}
// // //                                                     type="text"
// // //                                                     value={digit}
// // //                                                     onChange={(e) => handleOtpChange(index, e.target.value)}
// // //                                                     onKeyDown={(e) => handleOtpKeyDown(index, e)}
// // //                                                     ref={(el) => (otpRefs.current[index] = el)}
// // //                                                     className="w-12 h-12 text-center text-lg font-semibold border-2 border-white/30 rounded-xl focus:ring-2 transition-all duration-300 bg-white backdrop-blur-sm outline-none"
// // //                                                     maxLength={1}
// // //                                                     required
// // //                                                 />
// // //                                             ))}
// // //                                         </div>
// // //                                     </div>

// // //                                     <button
// // //                                         type="submit"
// // //                                         disabled={isLoading}
// // //                                         className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
// // //                                             ? 'bg-blue-600 cursor-not-allowed'
// // //                                             : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
// // //                                             } flex items-center justify-center`}
// // //                                     >
// // //                                         {isLoading ? (
// // //                                             <>
// // //                                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// // //                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// // //                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// // //                                                 </svg>
// // //                                                 Verifying...
// // //                                             </>
// // //                                         ) : (
// // //                                             <span className="inline-flex items-center gap-2">
// // //                                                 Verify & Login
// // //                                                 <LoginIcon className="w-5 h-5" />
// // //                                             </span>
// // //                                         )}
// // //                                     </button>
// // //                                 </>
// // //                             )}

// // //                             {error && (
// // //                                 <div className="bg-red-500/20 border-l-4 border-red-500 text-red-800 p-4 rounded-xl text-sm flex items-start backdrop-blur-sm">
// // //                                     <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
// // //                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// // //                                     </svg>
// // //                                     <span className="font-medium">{error}</span>
// // //                                 </div>
// // //                             )}

// // //                             {otpSent && (
// // //                                 <div className="text-center">
// // //                                     <button
// // //                                         type="button"
// // //                                         onClick={() => {
// // //                                             setOtpSent(false);
// // //                                             setFormData({ phone: '', otp: '', userId: '' });
// // //                                             setOtpDigits(['', '', '', '']);
// // //                                         }}
// // //                                         className="text-sm text-white font-medium transition-colors no-underline hover:underline"
// // //                                     >
// // //                                         Change Phone Number
// // //                                     </button>
// // //                                 </div>
// // //                             )}
// // //                         </form>
// // //                     </div>
// // //                 </div>

// // //                 <style>{`
// // //                     @keyframes shake {
// // //                         0%, 100% { transform: translateX(0); }
// // //                         10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
// // //                         20%, 40%, 60%, 80% { transform: translateX(5px); }
// // //                     }
// // //                     .animate-shake {
// // //                         animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
// // //                     }
// // //                 `}</style>
// // //             </div>
// // //         </>
// // //     );
// // // };

// // // export default EmployeeLogin;

// // // import { useState, useEffect, useRef } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import loginimg from "../assets/login-image/login.jpg";
// // // import { toast, ToastContainer } from "react-toastify";
// // // import LoginIcon from '@mui/icons-material/Login';
// // // import { API_CONFIG } from "../config/api.config";
// // // import Cookies from "js-cookie";

// // // interface LoginForm {
// // //     phone: string;
// // //     otp: string;
// // //     userId?: string;
// // // }

// // // const EmployeeLogin = () => {
// // //     const navigate = useNavigate();
// // //     const [formData, setFormData] = useState<LoginForm>({
// // //         phone: '',
// // //         otp: '',
// // //         userId: ''
// // //     });
// // //     const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
// // //     const [isLoading, setIsLoading] = useState(false);
// // //     const [error, setError] = useState('');
// // //     const [shake, setShake] = useState(false);
// // //     const [otpSent, setOtpSent] = useState(false);
// // //     const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

// // //     // Check if user is already logged in
// // //     // useEffect(() => {
// // //     //     const user = JSON.parse(localStorage.getItem('employeeUser') || '{}');
// // //     //     if (user.role) {
// // //     //         const targetPath = user.role === 'MANAGER' ? '/manager-dashboard' : '/store';
// // //     //         navigate(targetPath);
// // //     //     }
// // //     // }, [navigate]);

// // //     const handleInputChange = (field: keyof LoginForm, value: string) => {
// // //         setFormData(prev => ({
// // //             ...prev,
// // //             [field]: value
// // //         }));
// // //         setError('');
// // //     };

// // //     // Handle OTP digit input
// // //     const handleOtpChange = (index: number, value: string) => {
// // //         if (!/^\d?$/.test(value)) return;

// // //         const newOtpDigits = [...otpDigits];
// // //         newOtpDigits[index] = value;
// // //         setOtpDigits(newOtpDigits);

// // //         // Update formData.otp with concatenated OTP
// // //         const newOtp = newOtpDigits.join('');
// // //         handleInputChange('otp', newOtp);

// // //         // Move focus to next input
// // //         if (value && index < 3) {
// // //             otpRefs.current[index + 1]?.focus();
// // //         }
// // //     };

// // //     // Handle backspace to move to previous input
// // //     const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
// // //         if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
// // //             otpRefs.current[index - 1]?.focus();
// // //         }
// // //     };

// // //     const triggerErrorAnimation = () => {
// // //         setShake(true);
// // //         setTimeout(() => setShake(false), 500);
// // //     };

// // //     const handleSendOtp = async () => {
// // //         if (!formData.phone || formData.phone.length < 10) {
// // //             setError('Please enter a valid phone number');
// // //             triggerErrorAnimation();
// // //             return;
// // //         }

// // //         setIsLoading(true);
// // //         setError('');

// // //         try {
// // //             const response = await fetch(`${API_CONFIG.BASE_URL}/employee/send-otp`, {
// // //                 method: 'POST',
// // //                 headers: { 'Content-Type': 'application/json' },
// // //                 body: JSON.stringify({ phone: formData.phone })
// // //             });
// // //             const data = await response.json();
// // //             if (!response.ok || !data.success) {
// // //                 throw new Error(data.message || 'Failed to send OTP');
// // //             }
// // //             const userId = data.data?.userId || '';
// // //             setFormData(prev => ({
// // //                 ...prev,
// // //                 userId: userId
// // //             }));
// // //             setOtpSent(true);
// // //             toast.success("OTP sent successfully!", {
// // //                 style: { width: window.innerWidth < 640 ? "250px" : "350px" }
// // //             });
// // //         } catch (error: any) {
// // //             console.error('OTP send error:', error);
// // //             setError(error.message || 'Failed to send OTP');
// // //             triggerErrorAnimation();
// // //         } finally {
// // //             setIsLoading(false);
// // //         }
// // //     };

// // //     const handleLogin = async (e: React.FormEvent) => {
// // //         e.preventDefault();

// // //         if (!formData.otp || !formData.userId || formData.otp.length !== 4) {
// // //             setError('Please enter a valid 4-digit OTP');
// // //             triggerErrorAnimation();
// // //             return;
// // //         }

// // //         setIsLoading(true);
// // //         setError('');

// // //         try {
// // //             const response = await fetch(`${API_CONFIG.BASE_URL}/employee/verify-login`, {
// // //                 method: 'POST',
// // //                 headers: { 'Content-Type': 'application/json' },
// // //                 body: JSON.stringify({
// // //                     phone: formData.phone,
// // //                     otp: formData.otp,
// // //                     userId: formData.userId
// // //                 })
// // //             });
// // //             const data = await response.json();
// // //             if (!response.ok || !data.success) {
// // //                 throw new Error(data.message || 'Login failed');
// // //             }

// // //             const responseData = data.data || data;
// // //             const userData = {
// // //                 role: responseData.user.role,
// // //                 phone: formData.phone,
// // //                 id: responseData.user.id,
// // //                 storeId: responseData.user.storeId || null,
// // //                 loginTime: new Date().toISOString()
// // //             };

// // //             // Save in localStorage
// // //             localStorage.setItem('employeeUser', JSON.stringify(userData));

// // //             // Save tokens in localStorage (optional)
// // //             localStorage.setItem('accessToken', responseData.accessToken);
// // //             localStorage.setItem('refreshToken', responseData.refreshToken);

// // //             // Save tokens in cookies
// // //             Cookies.set('employeeAccessToken', responseData.accessToken, { path: '/', secure: true, sameSite: 'Strict', expires: 1 }); // 1 day
// // //             Cookies.set('employeeRefreshToken', responseData.refreshToken, { path: '/', secure: true, sameSite: 'Strict', expires: 7 }); // 7 days

// // //             toast.success("Login Successful!", {
// // //                 style: { width: window.innerWidth < 640 ? "250px" : "350px" }
// // //             });

// // //             // Navigate based on role
// // //             const targetPath = responseData.openScreen || (userData.role === 'MANAGER' ? '/manager-dashboard' : '/store');
// // //             setTimeout(() => {
// // //                 navigate(targetPath);
// // //             }, 2000);
// // //         } catch (error: any) {
// // //             console.error('Login error:', error);
// // //             setError(error.message || 'Login failed');
// // //             triggerErrorAnimation();
// // //         } finally {
// // //             setIsLoading(false);
// // //         }
// // //     };

// // //     return (
// // //         <>
// // //             <ToastContainer />
// // //             <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
// // //                 {/* Background Image */}
// // //                 <div
// // //                     className="absolute inset-0 bg-cover bg-center bg-no-repeat"
// // //                     style={{
// // //                         backgroundImage: `url(${loginimg})`,
// // //                         filter: 'brightness(0.6) contrast(1.1)'
// // //                     }}
// // //                 />

// // //                 {/* Overlay for better text readability */}
// // //                 <div className="absolute inset-0 bg-black bg-opacity-20" />

// // //                 {/* Content Container */}
// // //                 <div className={`bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden w-full max-w-md transition-all duration-300 ${shake ? 'animate-shake' : ''} relative z-10 border border-white/30`}>
// // //                     <div className="pt-8 px-8 text-center relative overflow-hidden">
// // //                         <div className="relative z-10">
// // //                             <h1 className="text-3xl font-bold tracking-tight text-white">Employee Login</h1>
// // //                         </div>
// // //                     </div>

// // //                     <div className="p-8">
// // //                         <form onSubmit={handleLogin} className="space-y-6">
// // //                             <div>
// // //                                 <label className="block text-sm font-semibold text-white mb-3">
// // //                                     Phone Number
// // //                                 </label>
// // //                                 <div className="relative group bg-white flex items-center px-3 rounded-xl">
// // //                                     <svg className="h-5 w-5 text-gray-600 group-focus-within:text-blue-800 transition-colors" fill="currentColor" viewBox="0 0 20 20">
// // //                                         <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
// // //                                     </svg>
// // //                                     <input
// // //                                         type="tel"
// // //                                         value={formData.phone}
// // //                                         onChange={(e) => handleInputChange('phone', e.target.value)}
// // //                                         className="w-full px-4 py-3.5 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-[#fff0] focus:border-[#fff0] transition-all duration-300 pr-10 bg-white backdrop-blur-sm group-hover:bg-white group-hover:border-white/50 outline-none"
// // //                                         placeholder="9876543210"
// // //                                         required
// // //                                         disabled={otpSent}
// // //                                         onKeyDown={(e) => {
// // //                                             if (e.key === "Enter") e.preventDefault();
// // //                                         }}
// // //                                     />
// // //                                 </div>
// // //                             </div>

// // //                             {!otpSent ? (
// // //                                 <button
// // //                                     type="button"
// // //                                     onClick={handleSendOtp}
// // //                                     disabled={isLoading}
// // //                                     className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
// // //                                         ? 'bg-blue-600 cursor-not-allowed'
// // //                                         : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
// // //                                         } flex items-center justify-center`}
// // //                                 >
// // //                                     {isLoading ? (
// // //                                         <>
// // //                                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// // //                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// // //                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// // //                                             </svg>
// // //                                             Sending OTP...
// // //                                         </>
// // //                                     ) : (
// // //                                         <>
// // //                                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// // //                                             </svg>
// // //                                             Send OTP
// // //                                         </>
// // //                                     )}
// // //                                 </button>
// // //                             ) : (
// // //                                 <>
// // //                                     <div>
// // //                                         <label className="block text-sm font-semibold text-white mb-3">
// // //                                             OTP
// // //                                         </label>
// // //                                         <div className="flex gap-12 justify-center">
// // //                                             {otpDigits.map((digit, index) => (
// // //                                                 <input
// // //                                                     key={index}
// // //                                                     type="text"
// // //                                                     value={digit}
// // //                                                     onChange={(e) => handleOtpChange(index, e.target.value)}
// // //                                                     onKeyDown={(e) => handleOtpKeyDown(index, e)}
// // //                                                     ref={(el) => (otpRefs.current[index] = el)}
// // //                                                     className="w-12 h-12 text-center text-lg font-semibold border-2 border-white/30 rounded-xl focus:ring-2 transition-all duration-300 bg-white backdrop-blur-sm outline-none"
// // //                                                     maxLength={1}
// // //                                                     required
// // //                                                 />
// // //                                             ))}
// // //                                         </div>
// // //                                     </div>

// // //                                     <button
// // //                                         type="submit"
// // //                                         disabled={isLoading}
// // //                                         className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
// // //                                             ? 'bg-blue-600 cursor-not-allowed'
// // //                                             : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
// // //                                             } flex items-center justify-center`}
// // //                                     >
// // //                                         {isLoading ? (
// // //                                             <>
// // //                                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// // //                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// // //                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// // //                                                 </svg>
// // //                                                 Verifying...
// // //                                             </>
// // //                                         ) : (
// // //                                             <span className="inline-flex items-center gap-2">
// // //                                                 Verify & Login
// // //                                                 <LoginIcon className="w-5 h-5" />
// // //                                             </span>
// // //                                         )}
// // //                                     </button>
// // //                                 </>
// // //                             )}

// // //                             {error && (
// // //                                 <div className="bg-red-500/20 border-l-4 border-red-500 text-red-800 p-4 rounded-xl text-sm flex items-start backdrop-blur-sm">
// // //                                     <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
// // //                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// // //                                     </svg>
// // //                                     <span className="font-medium">{error}</span>
// // //                                 </div>
// // //                             )}

// // //                             {otpSent && (
// // //                                 <div className="text-center">
// // //                                     <button
// // //                                         type="button"
// // //                                         onClick={() => {
// // //                                             setOtpSent(false);
// // //                                             setFormData({ phone: '', otp: '', userId: '' });
// // //                                             setOtpDigits(['', '', '', '']);
// // //                                         }}
// // //                                         className="text-sm text-white font-medium transition-colors no-underline hover:underline"
// // //                                     >
// // //                                         Change Phone Number
// // //                                     </button>
// // //                                 </div>
// // //                             )}
// // //                         </form>
// // //                     </div>
// // //                 </div>

// // //                 <style>{`
// // //                     @keyframes shake {
// // //                         0%, 100% { transform: translateX(0); }
// // //                         10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
// // //                         20%, 40%, 60%, 80% { transform: translateX(5px); }
// // //                     }
// // //                     .animate-shake {
// // //                         animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
// // //                     }
// // //                 `}</style>
// // //             </div>
// // //         </>
// // //     );
// // // };

// // // export default EmployeeLogin;

// // import { useState, useEffect, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import loginimg from "../assets/login-image/login.jpg";
// // import { toast, ToastContainer } from "react-toastify";
// // import LoginIcon from '@mui/icons-material/Login';
// // import { API_CONFIG } from "../config/api.config";
// // import Cookies from "js-cookie";
// // interface LoginForm {
// //     phone: string;
// //     otp: string;
// //     userId?: string;
// // }
// // const EmployeeLogin = () => {
// //     const navigate = useNavigate();
// //     const [formData, setFormData] = useState<LoginForm>({
// //         phone: '',
// //         otp: '',
// //         userId: ''
// //     });
// //     const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [error, setError] = useState('');
// //     const [shake, setShake] = useState(false);
// //     const [otpSent, setOtpSent] = useState(false);
// //     const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
// //     // Check if user is already logged in
// //     // useEffect(() => {
// //     // const user = JSON.parse(localStorage.getItem('employeeUser') || '{}');
// //     // if (user.role) {
// //     // const targetPath = user.role === 'MANAGER' ? '/manager' : '/store';
// //     // navigate(targetPath);
// //     // }
// //     // }, [navigate]);
// //     const handleInputChange = (field: keyof LoginForm, value: string) => {
// //         setFormData(prev => ({
// //             ...prev,
// //             [field]: value
// //         }));
// //         setError('');
// //     };
// //     // Handle OTP digit input
// //     const handleOtpChange = (index: number, value: string) => {
// //         if (!/^\d?$/.test(value)) return;
// //         const newOtpDigits = [...otpDigits];
// //         newOtpDigits[index] = value;
// //         setOtpDigits(newOtpDigits);
// //         // Update formData.otp with concatenated OTP
// //         const newOtp = newOtpDigits.join('');
// //         handleInputChange('otp', newOtp);
// //         // Move focus to next input
// //         if (value && index < 3) {
// //             otpRefs.current[index + 1]?.focus();
// //         }
// //     };
// //     // Handle backspace to move to previous input
// //     const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
// //         if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
// //             otpRefs.current[index - 1]?.focus();
// //         }
// //     };
// //     const triggerErrorAnimation = () => {
// //         setShake(true);
// //         setTimeout(() => setShake(false), 500);
// //     };
// //     const handleSendOtp = async () => {
// //         if (!formData.phone || formData.phone.length < 10) {
// //             setError('Please enter a valid phone number');
// //             triggerErrorAnimation();
// //             return;
// //         }
// //         setIsLoading(true);
// //         setError('');
// //         try {
// //             const response = await fetch(`${API_CONFIG.BASE_URL}/employee/send-otp`, {
// //                 method: 'POST',
// //                 headers: { 'Content-Type': 'application/json' },
// //                 body: JSON.stringify({ phone: formData.phone })
// //             });
// //             const data = await response.json();
// //             if (!response.ok || !data.success) {
// //                 throw new Error(data.message || 'Failed to send OTP');
// //             }
// //             const userId = data.data?.userId || '';
// //             setFormData(prev => ({
// //                 ...prev,
// //                 userId: userId
// //             }));
// //             setOtpSent(true);
// //             toast.success("OTP sent successfully!", {
// //                 style: { width: window.innerWidth < 640 ? "250px" : "350px" }
// //             });
// //         } catch (error: any) {
// //             console.error('OTP send error:', error);
// //             setError(error.message || 'Failed to send OTP');
// //             triggerErrorAnimation();
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };
// //     const handleLogin = async (e: React.FormEvent) => {
// //         e.preventDefault();
// //         if (!formData.otp || !formData.userId || formData.otp.length !== 4) {
// //             setError('Please enter a valid 4-digit OTP');
// //             triggerErrorAnimation();
// //             return;
// //         }
// //         setIsLoading(true);
// //         setError('');
// //         try {
// //             const response = await fetch(`${API_CONFIG.BASE_URL}/employee/verify-login`, {
// //                 method: 'POST',
// //                 headers: { 'Content-Type': 'application/json' },
// //                 body: JSON.stringify({
// //                     phone: formData.phone,
// //                     otp: formData.otp,
// //                     userId: formData.userId
// //                 })
// //             });
// //             const data = await response.json();
// //             if (!response.ok || !data.success) {
// //                 throw new Error(data.message || 'Login failed');
// //             }
// //             const responseData = data.data || data;
// //             const userData = {
// //                 role: responseData.user.role,
// //                 phone: formData.phone,
// //                 id: responseData.user.id,
// //                 storeId: responseData.user.storeId || null,
// //                 loginTime: new Date().toISOString()
// //             };
// //             // Save in localStorage
// //             localStorage.setItem('employeeUser', JSON.stringify(userData));
// //             // Save tokens in localStorage (optional)
// //             localStorage.setItem('accessToken', responseData.accessToken);
// //             localStorage.setItem('refreshToken', responseData.refreshToken);
// //             // Save tokens in cookies
// //             Cookies.set('employeeAccessToken', responseData.accessToken, { path: '/', secure: true, sameSite: 'Strict', expires: 1 }); // 1 day
// //             Cookies.set('employeeRefreshToken', responseData.refreshToken, { path: '/', secure: true, sameSite: 'Strict', expires: 7 }); // 7 days
// //             toast.success("Login Successful!", {
// //                 style: { width: window.innerWidth < 640 ? "250px" : "350px" }
// //             });
// //             // Navigate based on role
// //             const targetPath = responseData.openScreen || (userData.role === 'MANAGER' ? '/manager' : '/store');
// //             setTimeout(() => {
// //                 navigate(targetPath);
// //             }, 2000);
// //         } catch (error: any) {
// //             console.error('Login error:', error);
// //             setError(error.message || 'Login failed');
// //             triggerErrorAnimation();
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };
// //     return (
// //         <>
// //             <ToastContainer />
// //             <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
// //                 {/* Background Image */}
// //                 <div
// //                     className="absolute inset-0 bg-cover bg-center bg-no-repeat"
// //                     style={{
// //                         backgroundImage: `url(${loginimg})`,
// //                         filter: 'brightness(0.6) contrast(1.1)'
// //                     }}
// //                 />
// //                 {/* Overlay for better text readability */}
// //                 <div className="absolute inset-0 bg-black bg-opacity-20" />
// //                 {/* Content Container */}
// //                 <div className={`bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden w-full max-w-md transition-all duration-300 ${shake ? 'animate-shake' : ''} relative z-10 border border-white/30`}>
// //                     <div className="pt-8 px-8 text-center relative overflow-hidden">
// //                         <div className="relative z-10">
// //                             <h1 className="text-3xl font-bold tracking-tight text-white">Employee Login</h1>
// //                         </div>
// //                     </div>
// //                     <div className="p-8">
// //                         <form onSubmit={handleLogin} className="space-y-6">
// //                             <div>
// //                                 <label className="block text-sm font-semibold text-white mb-3">
// //                                     Phone Number
// //                                 </label>
// //                                 <div className="relative group bg-white flex items-center px-3 rounded-xl">
// //                                     <svg className="h-5 w-5 text-gray-600 group-focus-within:text-blue-800 transition-colors" fill="currentColor" viewBox="0 0 20 20">
// //                                         <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
// //                                     </svg>
// //                                     <input
// //                                         type="tel"
// //                                         value={formData.phone}
// //                                         onChange={(e) => handleInputChange('phone', e.target.value)}
// //                                         className="w-full px-4 py-3.5 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-[#fff0] focus:border-[#fff0] transition-all duration-300 pr-10 bg-white backdrop-blur-sm group-hover:bg-white group-hover:border-white/50 outline-none"
// //                                         placeholder="9876543210"
// //                                         required
// //                                         disabled={otpSent}
// //                                         onKeyDown={(e) => {
// //                                             if (e.key === "Enter") e.preventDefault();
// //                                         }}
// //                                     />
// //                                 </div>
// //                             </div>
// //                             {!otpSent ? (
// //                                 <button
// //                                     type="button"
// //                                     onClick={handleSendOtp}
// //                                     disabled={isLoading}
// //                                     className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
// //                                         ? 'bg-blue-600 cursor-not-allowed'
// //                                         : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
// //                                         } flex items-center justify-center`}
// //                                 >
// //                                     {isLoading ? (
// //                                         <>
// //                                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                                             </svg>
// //                                             Sending OTP...
// //                                         </>
// //                                     ) : (
// //                                         <>
// //                                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// //                                             </svg>
// //                                             Send OTP
// //                                         </>
// //                                     )}
// //                                 </button>
// //                             ) : (
// //                                 <>
// //                                     <div>
// //                                         <label className="block text-sm font-semibold text-white mb-3">
// //                                             OTP
// //                                         </label>
// //                                         <div className="flex gap-12 justify-center">
// //                                             {otpDigits.map((digit, index) => (
// //                                                 <input
// //                                                     key={index}
// //                                                     type="text"
// //                                                     value={digit}
// //                                                     onChange={(e) => handleOtpChange(index, e.target.value)}
// //                                                     onKeyDown={(e) => handleOtpKeyDown(index, e)}
// //                                                     ref={(el) => (otpRefs.current[index] = el)}
// //                                                     className="w-12 h-12 text-center text-lg font-semibold border-2 border-white/30 rounded-xl focus:ring-2 transition-all duration-300 bg-white backdrop-blur-sm outline-none"
// //                                                     maxLength={1}
// //                                                     required
// //                                                 />
// //                                             ))}
// //                                         </div>
// //                                     </div>
// //                                     <button
// //                                         type="submit"
// //                                         disabled={isLoading}
// //                                         className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
// //                                             ? 'bg-blue-600 cursor-not-allowed'
// //                                             : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
// //                                             } flex items-center justify-center`}
// //                                     >
// //                                         {isLoading ? (
// //                                             <>
// //                                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                                                 </svg>
// //                                                 Verifying...
// //                                             </>
// //                                         ) : (
// //                                             <span className="inline-flex items-center gap-2">
// //                                                 Verify & Login
// //                                                 <LoginIcon className="w-5 h-5" />
// //                                             </span>
// //                                         )}
// //                                     </button>
// //                                 </>
// //                             )}
// //                             {error && (
// //                                 <div className="bg-red-500/20 border-l-4 border-red-500 text-red-800 p-4 rounded-xl text-sm flex items-start backdrop-blur-sm">
// //                                     <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
// //                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //                                     </svg>
// //                                     <span className="font-medium">{error}</span>
// //                                 </div>
// //                             )}
// //                             {otpSent && (
// //                                 <div className="text-center">
// //                                     <button
// //                                         type="button"
// //                                         onClick={() => {
// //                                             setOtpSent(false);
// //                                             setFormData({ phone: '', otp: '', userId: '' });
// //                                             setOtpDigits(['', '', '', '']);
// //                                         }}
// //                                         className="text-sm text-white font-medium transition-colors no-underline hover:underline"
// //                                     >
// //                                         Change Phone Number
// //                                     </button>
// //                                 </div>
// //                             )}
// //                         </form>
// //                     </div>
// //                 </div>
// //                 <style>{`
// //                     @keyframes shake {
// //                         0%, 100% { transform: translateX(0); }
// //                         10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
// //                         20%, 40%, 60%, 80% { transform: translateX(5px); }
// //                     }
// //                     .animate-shake {
// //                         animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
// //                     }
// //                 `}</style>
// //             </div>
// //         </>
// //     );
// // };
// // export default EmployeeLogin;


// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import loginimg from "../assets/login-image/login.jpg";
// import { toast, ToastContainer } from "react-toastify";
// import LoginIcon from '@mui/icons-material/Login';
// import { API_CONFIG } from "../config/api.config";
// import Cookies from "js-cookie";

// interface LoginForm {
//     phone: string;
//     otp: string;
//     userId?: string;
// }

// const EmployeeLogin = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState<LoginForm>({
//         phone: '',
//         otp: '',
//         userId: ''
//     });
//     const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [shake, setShake] = useState(false);
//     const [otpSent, setOtpSent] = useState(false);
//     const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

//     // Check if user is already logged in
//     useEffect(() => {
//         const managerUser = JSON.parse(localStorage.getItem('managerUser') || '{}');
//         const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');
//         if (managerUser.role === 'manager') {
//             navigate('/manager-dashboard', { replace: true });
//         } else if (storeUser.role === 'store') {
//             navigate('/store', { replace: true });
//         }
//     }, [navigate]);

//     const handleInputChange = (field: keyof LoginForm, value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//         setError('');
//     };

//     // Handle OTP digit input
//     const handleOtpChange = (index: number, value: string) => {
//         if (!/^\d?$/.test(value)) return;
//         const newOtpDigits = [...otpDigits];
//         newOtpDigits[index] = value;
//         setOtpDigits(newOtpDigits);
//         // Update formData.otp with concatenated OTP
//         const newOtp = newOtpDigits.join('');
//         handleInputChange('otp', newOtp);
//         // Move focus to next input
//         if (value && index < 3) {
//             otpRefs.current[index + 1]?.focus();
//         }
//     };

//     // Handle backspace to move to previous input
//     const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
//             otpRefs.current[index - 1]?.focus();
//         }
//     };

//     const triggerErrorAnimation = () => {
//         setShake(true);
//         setTimeout(() => setShake(false), 500);
//     };

//     const handleSendOtp = async () => {
//         if (!formData.phone || formData.phone.length < 10) {
//             setError('Please enter a valid phone number');
//             triggerErrorAnimation();
//             return;
//         }
//         setIsLoading(true);
//         setError('');
//         try {
//             const response = await fetch(`${API_CONFIG.BASE_URL}/employee/send-otp`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ phone: formData.phone })
//             });
//             const data = await response.json();
//             if (!response.ok || !data.success) {
//                 throw new Error(data.message || 'Failed to send OTP');
//             }
//             const userId = data.data?.userId || '';
//             setFormData(prev => ({
//                 ...prev,
//                 userId: userId
//             }));
//             setOtpSent(true);
//             toast.success("OTP sent successfully!", {
//                 style: { width: window.innerWidth < 640 ? "250px" : "350px" }
//             });
//         } catch (error: any) {
//             console.error('OTP send error:', error);
//             setError(error.message || 'Failed to send OTP');
//             triggerErrorAnimation();
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!formData.otp || !formData.userId || formData.otp.length !== 4) {
//             setError('Please enter a valid 4-digit OTP');
//             triggerErrorAnimation();
//             return;
//         }
//         setIsLoading(true);
//         setError('');
//         try {
//             const response = await fetch(`${API_CONFIG.BASE_URL}/employee/verify-login`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     phone: formData.phone,
//                     otp: formData.otp,
//                     userId: formData.userId
//                 })
//             });
//             const data = await response.json();
//             if (!response.ok || !data.success) {
//                 throw new Error(data.message || 'Login failed');
//             }
//             const responseData = data.data || data;

//             // Normalize role to lowercase for consistency
//             const apiRole = responseData.user.role.toLowerCase();

//             const userData = {
//                 role: apiRole,
//                 phone: formData.phone,
//                 id: responseData.user.id,
//                 storeId: responseData.user.storeId || null,
//                 loginTime: new Date().toISOString()
//             };

//             // Save to appropriate localStorage key based on role
//             const storageKey = apiRole === 'manager' ? 'managerUser' : 'storeUser';
//             localStorage.setItem(storageKey, JSON.stringify(userData));

//             // Save tokens in localStorage
//             localStorage.setItem('accessToken', responseData.accessToken);
//             localStorage.setItem('refreshToken', responseData.refreshToken);

//             // Save tokens in cookies
//             Cookies.set('employeeAccessToken', responseData.accessToken, {
//                 path: '/',
//                 secure: true,
//                 sameSite: 'Strict',
//                 expires: 1
//             });
//             Cookies.set('employeeRefreshToken', responseData.refreshToken, {
//                 path: '/',
//                 secure: true,
//                 sameSite: 'Strict',
//                 expires: 7
//             });

//             toast.success("Login Successful!", {
//                 style: { width: window.innerWidth < 640 ? "250px" : "350px" }
//             });

//             // Determine target path based on role
//             let targetPath = '/';
//             if (apiRole === 'manager') {
//                 targetPath = '/manager-dashboard';
//             } else if (apiRole === 'store') {
//                 targetPath = '/store';
//             }

//             // Use openScreen if provided, otherwise use role-based path
//             if (responseData.openScreen) {
//                 // Map openScreen values to actual routes
//                 if (responseData.openScreen === 'manager') {
//                     targetPath = '/manager-dashboard';
//                 } else if (responseData.openScreen === 'store') {
//                     targetPath = '/store';
//                 }
//             }

//             console.log('Navigating to:', targetPath, 'with role:', apiRole);

//             setTimeout(() => {
//                 navigate(targetPath, { replace: true });
//             }, 1500);
//         } catch (error: any) {
//             console.error('Login error:', error);
//             setError(error.message || 'Login failed');
//             triggerErrorAnimation();
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <>
//             <ToastContainer />
//             <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
//                 {/* Background Image */}
//                 <div
//                     className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//                     style={{
//                         backgroundImage: `url(${loginimg})`,
//                         filter: 'brightness(0.6) contrast(1.1)'
//                     }}
//                 />
//                 {/* Overlay for better text readability */}
//                 <div className="absolute inset-0 bg-black bg-opacity-20" />
//                 {/* Content Container */}
//                 <div className={`bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden w-full max-w-md transition-all duration-300 ${shake ? 'animate-shake' : ''} relative z-10 border border-white/30`}>
//                     <div className="pt-8 px-8 text-center relative overflow-hidden">
//                         <div className="relative z-10">
//                             <h1 className="text-3xl font-bold tracking-tight text-white">Employee Login</h1>
//                         </div>
//                     </div>
//                     <div className="p-8">
//                         <form onSubmit={handleLogin} className="space-y-6">
//                             <div>
//                                 <label className="block text-sm font-semibold text-white mb-3">
//                                     Phone Number
//                                 </label>
//                                 <div className="relative group bg-white flex items-center px-3 rounded-xl">
//                                     <svg className="h-5 w-5 text-gray-600 group-focus-within:text-blue-800 transition-colors" fill="currentColor" viewBox="0 0 20 20">
//                                         <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                                     </svg>
//                                     <input
//                                         type="tel"
//                                         value={formData.phone}
//                                         onChange={(e) => handleInputChange('phone', e.target.value)}
//                                         className="w-full px-4 py-3.5 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-[#fff0] focus:border-[#fff0] transition-all duration-300 pr-10 bg-white backdrop-blur-sm group-hover:bg-white group-hover:border-white/50 outline-none"
//                                         placeholder="9876543210"
//                                         required
//                                         disabled={otpSent}
//                                         onKeyDown={(e) => {
//                                             if (e.key === "Enter") e.preventDefault();
//                                         }}
//                                     />
//                                 </div>
//                             </div>
//                             {!otpSent ? (
//                                 <button
//                                     type="button"
//                                     onClick={handleSendOtp}
//                                     disabled={isLoading}
//                                     className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
//                                         ? 'bg-blue-600 cursor-not-allowed'
//                                         : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
//                                         } flex items-center justify-center`}
//                                 >
//                                     {isLoading ? (
//                                         <>
//                                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             Sending OTP...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                                             </svg>
//                                             Send OTP
//                                         </>
//                                     )}
//                                 </button>
//                             ) : (
//                                 <>
//                                     <div>
//                                         <label className="block text-sm font-semibold text-white mb-3">
//                                             OTP
//                                         </label>
//                                         <div className="flex gap-12 justify-center">
//                                             {otpDigits.map((digit, index) => (
//                                                 <input
//                                                     key={index}
//                                                     type="text"
//                                                     value={digit}
//                                                     onChange={(e) => handleOtpChange(index, e.target.value)}
//                                                     onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                                                     ref={(el) => (otpRefs.current[index] = el)}
//                                                     className="w-12 h-12 text-center text-lg font-semibold border-2 border-white/30 rounded-xl focus:ring-2 transition-all duration-300 bg-white backdrop-blur-sm outline-none"
//                                                     maxLength={1}
//                                                     required
//                                                 />
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <button
//                                         type="submit"
//                                         disabled={isLoading}
//                                         className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
//                                             ? 'bg-blue-600 cursor-not-allowed'
//                                             : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
//                                             } flex items-center justify-center`}
//                                     >
//                                         {isLoading ? (
//                                             <>
//                                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                 </svg>
//                                                 Verifying...
//                                             </>
//                                         ) : (
//                                             <span className="inline-flex items-center gap-2">
//                                                 Verify & Login
//                                                 <LoginIcon className="w-5 h-5" />
//                                             </span>
//                                         )}
//                                     </button>
//                                 </>
//                             )}
//                             {error && (
//                                 <div className="bg-red-500/20 border-l-4 border-red-500 text-red-800 p-4 rounded-xl text-sm flex items-start backdrop-blur-sm">
//                                     <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                     </svg>
//                                     <span className="font-medium">{error}</span>
//                                 </div>
//                             )}
//                             {otpSent && (
//                                 <div className="text-center">
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setOtpSent(false);
//                                             setFormData({ phone: '', otp: '', userId: '' });
//                                             setOtpDigits(['', '', '', '']);
//                                         }}
//                                         className="text-sm text-white font-medium transition-colors no-underline hover:underline"
//                                     >
//                                         Change Phone Number
//                                     </button>
//                                 </div>
//                             )}
//                         </form>
//                     </div>
//                 </div>
//                 <style>{`
//                     @keyframes shake {
//                         0%, 100% { transform: translateX(0); }
//                         10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//                         20%, 40%, 60%, 80% { transform: translateX(5px); }
//                     }
//                     .animate-shake {
//                         animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
//                     }
//                 `}</style>
//             </div>
//         </>
//     );
// };

// export default EmployeeLogin;

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import loginimg from "../assets/login-image/login.jpg";
import { toast, ToastContainer } from "react-toastify";
import LoginIcon from '@mui/icons-material/Login';
import { API_CONFIG } from "../config/api.config";
import Cookies from "js-cookie";

interface LoginForm {
    phone: string;
    otp: string;
    userId?: string;
}

const EmployeeLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginForm>({
        phone: '',
        otp: '',
        userId: ''
    });
    const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        localStorage.removeItem("superAdminUser");
    }, []);

    // Check if user is already logged in
    useEffect(() => {
        const managerUser = JSON.parse(localStorage.getItem('managerUser') || '{}');
        const storeUser = JSON.parse(localStorage.getItem('storeUser') || '{}');
        if (managerUser.role === 'manager') {
            navigate('/manager-dashboard', { replace: true });
        } else if (storeUser.role === 'store') {
            navigate('/store', { replace: true });
        } else if (storeUser.role === 'butcher') {
            navigate('/store', { replace: true });
        }
    }, [navigate]);

    const handleInputChange = (field: keyof LoginForm, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
    };

    // Handle OTP digit input
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);
        // Update formData.otp with concatenated OTP
        const newOtp = newOtpDigits.join('');
        handleInputChange('otp', newOtp);
        // Move focus to next input
        if (value && index < 3) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace to move to previous input
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const triggerErrorAnimation = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const handleSendOtp = async () => {
        if (!formData.phone || formData.phone.length < 10) {
            setError('Please enter a valid phone number');
            triggerErrorAnimation();
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/employee/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to send OTP');
            }
            const userId = data.data?.userId || '';
            setFormData(prev => ({
                ...prev,
                userId: userId
            }));
            setOtpSent(true);
            toast.success("OTP sent successfully!", {
                style: { width: window.innerWidth < 640 ? "250px" : "350px" }
            });
        } catch (error: any) {
            console.error('OTP send error:', error);
            setError(error.message || 'Failed to send OTP');
            triggerErrorAnimation();
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.otp || !formData.userId || formData.otp.length !== 4) {
            setError('Please enter a valid 4-digit OTP');
            triggerErrorAnimation();
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/employee/verify-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.phone,
                    otp: formData.otp,
                    userId: formData.userId
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Login failed');
            }
            const responseData = data.data || data;

            // Normalize role to lowercase for consistency
            const apiRole = responseData.user.role.toLowerCase();

            const userData = {
                role: apiRole,
                phone: formData.phone,
                id: responseData.user.id,
                storeId: responseData.user.storeId || null,
                loginTime: new Date().toISOString()
            };

            // Save to appropriate localStorage key based on role
            const storageKey = apiRole === 'manager' ? 'managerUser' : 'storeUser';
            localStorage.setItem(storageKey, JSON.stringify(userData));

            // Save tokens in localStorage
            localStorage.setItem('accessToken', responseData.accessToken);
            localStorage.setItem('refreshToken', responseData.refreshToken);

            toast.success("Login Successful!", {
                style: { width: window.innerWidth < 640 ? "250px" : "350px" }
            });

            // Determine target path based on role
            let targetPath = '/';

            console.log("🚀 ~ handleLogin ~ apiRole:", apiRole)
            if (apiRole === 'MANAGER') {
                targetPath = '/manager-dashboard';
            } else if (['ACCOUNTANT', 'BUTCHER', 'SALESMAN', 'CLEANER'].includes(apiRole)) {
                targetPath = '/store';
            }

            console.log("🚀 ~ handleLogin ~ targetPath:", targetPath)

            // Use openScreen if provided, otherwise use role-based path
            console.log("🚀 ~ handleLogin ~ responseData.openScreen:", responseData.openScreen)
            if (responseData.openScreen) {


                // Map openScreen values to actual routes
                if (responseData.openScreen === 'manager') {
                    targetPath = '/manager-dashboard';
                } else if (responseData.openScreen === 'store') {
                    targetPath = '/store';
                }
            }

            console.log('Navigating to:', targetPath, 'with role:', apiRole);

            setTimeout(() => {
                navigate(targetPath, { replace: true });
                console.log("🚀 ~ handleLogin ~ targetPath:", targetPath)
            }, 1500);
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error.message || 'Login failed';
            setError(errorMessage);
            triggerErrorAnimation();

            // Handle specific error: User not found or inactive - reset form to allow trying different phone
            if (errorMessage.includes('User not found') || errorMessage.includes('inactive')) {
                setOtpSent(false);
                setOtpDigits(['', '', '', '']);
                setFormData(prev => ({ ...prev, otp: '', userId: '' }));
                toast.error("User not found or inactive. Please try with a different phone number.", {
                    style: { width: window.innerWidth < 640 ? "250px" : "350px" }
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${loginimg})`,
                        filter: 'brightness(0.6) contrast(1.1)'
                    }}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                {/* Content Container */}
                <div className={`bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden w-full max-w-md transition-all duration-300 ${shake ? 'animate-shake' : ''} relative z-10 border border-white/30`}>
                    <div className="pt-8 px-8 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold tracking-tight text-white">Employee Login</h1>
                        </div>
                    </div>
                    <div className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-3">
                                    Phone Number
                                </label>
                                <div className="relative group bg-white flex items-center px-3 rounded-xl">
                                    <svg className="h-5 w-5 text-gray-600 group-focus-within:text-blue-800 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="w-full px-4 py-3.5 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-[#fff0] focus:border-[#fff0] transition-all duration-300 pr-10 bg-white backdrop-blur-sm group-hover:bg-white group-hover:border-white/50 outline-none"
                                        placeholder="9876543210"
                                        required
                                        disabled={otpSent}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") e.preventDefault();
                                        }}
                                    />
                                </div>
                            </div>
                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isLoading}
                                    className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
                                        ? 'bg-blue-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                        } flex items-center justify-center`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending OTP...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Send OTP
                                        </>
                                    )}
                                </button>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-3">
                                            OTP
                                        </label>
                                        <div className="flex gap-12 justify-center">
                                            {otpDigits.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    ref={(el) => (otpRefs.current[index] = el)}
                                                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-white/30 rounded-xl focus:ring-2 transition-all duration-300 bg-white backdrop-blur-sm outline-none"
                                                    maxLength={1}
                                                    required
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
                                            ? 'bg-blue-600 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                            } flex items-center justify-center`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Verifying...
                                            </>
                                        ) : (
                                            <span className="inline-flex items-center gap-2">
                                                Verify & Login
                                                <LoginIcon className="w-5 h-5" />
                                            </span>
                                        )}
                                    </button>
                                </>
                            )}
                            {error && (
                                <div className="bg-red-500/20 border-l-4 border-red-500 text-red-800 p-4 rounded-xl text-sm flex items-start backdrop-blur-sm">
                                    <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}
                            {otpSent && (
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOtpSent(false);
                                            setFormData({ phone: '', otp: '', userId: '' });
                                            setOtpDigits(['', '', '', '']);
                                        }}
                                        className="text-sm text-white font-medium transition-colors no-underline hover:underline"
                                    >
                                        Change Phone Number
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
                <style>{`
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                        20%, 40%, 60%, 80% { transform: translateX(5px); }
                    }
                    .animate-shake {
                        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                    }
                `}</style>
            </div>
        </>
    );
};

export default EmployeeLogin;
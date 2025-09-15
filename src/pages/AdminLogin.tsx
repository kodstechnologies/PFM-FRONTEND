import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminloginimg from "../assets/login-image/adminloginImg.jpg";
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import { toast, ToastContainer } from "react-toastify";
import { callApi } from "../util/admin_api";

const AdminLogin = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem('superAdminUser') || '{}');
  //   if (user.role === 'super-admin') {
  //     navigate('/super-admin');
  //   }
  // }, [navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [shake, setShake] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user types
  };

  const triggerErrorAnimation = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the API for admin login
      const response = await callApi({
        endpoint: "/admin/login",
        method: "POST",
        data: formData,
      });

      console.log("🚀 ~ handleLogin ~ response:", response)

      // Store user data in localStorage
      const userData = {
        role: 'super-admin',
        email: response.email,
        name: response.name || 'Super Admin',
        loginTime: new Date().toISOString(),
        token: response.data.accessToken // If your API returns a token
      };

      localStorage.setItem('superAdminUser', JSON.stringify(userData));
      toast.success("Login Successful", {
        style: { width: window.innerWidth < 640 ? "250px" : "350px" }
      });

      setTimeout(() => {
        navigate('/super-admin');
      }, 2000);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid admin credentials';
      setError(errorMessage);
      triggerErrorAnimation();
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
            backgroundImage: `url(${adminloginimg})`,
            filter: 'brightness(0.6) contrast(1.1)'
          }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20" />

        {/* Content Container */}
        <div className={`bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden w-full max-w-md transition-all duration-300 ${shake ? 'animate-shake' : ''} relative z-10 border border-white/30`}>
          {/* Header */}
          <div className="pt-8 px-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold tracking-tight text-white">Admin Login</h1>
            </div>
          </div>

          <div className="p-8">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Email
                </label>
                <div className="flex bg-white px-2 rounded-xl group">
                  <span className="flex items-center">
                    <EmailIcon sx={{ color: "gray" }} />
                  </span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-[#fff0] focus:border-white transition-all duration-300 pr-10 bg-white backdrop-blur-sm group-hover:bg-white group-hover:border-white/50 outline-none"
                    placeholder="admin@pfm.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Password
                </label>
                <div className="relative group bg-white flex px-2 rounded-xl">
                  <span className="flex items-center">
                    <HttpsIcon sx={{ color: "gray" }} />
                  </span>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-[#fff0] focus:border-[#fff0] transition-all duration-300 pr-10 bg-white backdrop-blur-sm group-hover:bg-white group-hover:border-white/50 outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {isPasswordVisible ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border-l-4 border-red-500 text-red-800 p-4 rounded-xl text-sm flex items-start backdrop-blur-sm">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  } flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-2">
                      Sign In
                      <LoginIcon className="w-5 h-5" />
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-2 mr-2 flex justify-end">
              <Link
                to=""
                className="text-sm text-[#fff] transition "
              >
                Forgotten password?
              </Link>
            </div>

          </div>
        </div>

        {/* Add custom animation to tailwind config */}
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

export default AdminLogin;
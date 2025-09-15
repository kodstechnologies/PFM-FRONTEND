import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import storeloginimg from "../assets/login-image/storeloginimg.jpg";
import { toast, ToastContainer } from "react-toastify";
import LoginIcon from '@mui/icons-material/Login';
import { API_CONFIG } from "../config/api.config";

interface LoginForm {
  phone: string;
  otp: string;
}

const StoreLogin = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('storeUser') || '{}');

    if (user.role === 'store') {
      navigate('/store/live-orders');
    }
  }, [navigate]);

  const [formData, setFormData] = useState<LoginForm>({
    phone: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [shake, setShake] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpUserId, setOtpUserId] = useState<string>('');

  const handleInputChange = (field: keyof LoginForm, value: string) => {
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

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      triggerErrorAnimation();
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/store/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      // Save the userId returned by backend – required for verify
      const userId = (data.data && (data.data.userId || data.data.id)) || '';
      setOtpUserId(userId);
      setOtpSent(true);
      setShowOtpField(true);
      toast.success('OTP sent successfully');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to send OTP';
      setError(message);
      triggerErrorAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpUserId) {
      setError('Please request OTP again. (Missing User ID)');
      triggerErrorAnimation();
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/store/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp: formData.otp, userId: otpUserId })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid phone number or OTP');
      }

      // API may wrap payload in data; support both flat and wrapped
      const payload = data.data || data;
      const accessToken = payload.accessToken || payload.tokens?.accessToken;
      const refreshToken = payload.refreshToken || payload.tokens?.refreshToken;
      const user = payload.user || payload;

      if (!accessToken) throw new Error('Access token missing in response');

      // Persist
      localStorage.setItem('storeUser', JSON.stringify({ ...user, role: 'store', accessToken }));
      if (refreshToken) localStorage.setItem('storeRefreshToken', refreshToken);
      localStorage.setItem('accessToken', accessToken);

      toast.success('Login Successful', { style: { width: window.innerWidth < 640 ? '250px' : '350px' } });
      setTimeout(() => navigate('/store/live-orders'), 800);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Login failed';
      setError(message);
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
          className="absolute inset-0 bg-cover bg-right bg-no-repeat"
          style={{
            backgroundImage: `url(${storeloginimg})`,
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20" />

        {/* Content Container */}
        <div className={`bg-white/30 backdrop-blur-xs rounded-2xl shadow-2xl overflow-hidden w-full max-w-md transition-all duration-300 ${shake ? 'animate-shake' : ''} relative z-10 border border-white/30`}>
          {/* Header */}
          <div className="pt-8 px-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold tracking-tight text-white">Store Login</h1>
              {/* <p className="text-sm text-white/90 mt-2 font-medium">Store Operations and Order Processing</p> */}
            </div>
          </div>

          <div className="p-8">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3 ">
                  Phone Number
                </label>
                <div className="relative group bg-white flex items-center px-3 rounded-xl">
                  {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"> */}
                  <svg className="h-5 w-5 text-gray-600 group-focus-within:text-green-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {/* </div> */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3.5 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-[#fff0] focus:border-[#fff0] transition-all duration-300 pr-10 bg-white backdrop-blur-sm group-hover:bg-white group-hover:border-white/50 overflow-hi outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                      }}
                    />
                    {/* <p className="text-xs text-gray-500 mt-1">
                    </p> */}
                  </div>

                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
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
                    <label className="block text-sm font-semibold text-white mb-3 ">
                      OTP
                    </label>
                    <div className="relative group">
                      <input
                        type={isOtpVisible ? "text" : "password"}
                        value={formData.otp}
                        onChange={(e) => handleInputChange('otp', e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-green-700 focus:border-green-700 transition-all duration-300 pr-10 bg-white backdrop-blur-sm group-hover:bg-white group-hover:border-white/50"
                        placeholder="****"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsOtpVisible(!isOtpVisible)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        {isOtpVisible ? (
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

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
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
                      <>
                        {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg> */}
                        <span className="flex gap-2">

                          Verify & Login
                          <LoginIcon />
                        </span>
                      </>
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
                      setShowOtpField(false);
                      setFormData({ phone: '', otp: '' });
                    }}
                    className="text-sm text-white hover:underline font-medium transition-colors"
                  >
                    Change Phone Number
                  </button>
                </div>
              )}
            </form>

            {/* Demo Credentials */}
            {/* <div className="mt-8 border-t border-white/30 pt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-800">Store Login Credentials</h4>
                <button className="text-xs text-green-600 hover:text-green-800 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm p-4 rounded-xl border border-green-300/30">
                <div className="text-xs text-gray-800 space-y-2">
                  <div className="flex items-start">
                    <span className="inline-block bg-green-500/30 text-green-900 text-xs px-2 py-1 rounded-lg mr-2 font-medium">Store</span>
                    <div>
                      <div className="font-medium">Phone: 9876543211</div>
                      <div className="text-gray-700">OTP: 654321</div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Add custom animation */}
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

export default StoreLogin;

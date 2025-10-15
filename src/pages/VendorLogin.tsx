import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import storeloginimg from "../assets/login-image/storeloginimg.jpg";
import { toast, ToastContainer } from "react-toastify";
import LoginIcon from '@mui/icons-material/Login';
import { API_CONFIG } from "../config/api.config";
import Cookies from "js-cookie";

interface LoginForm {
  phone: string;
  otp: string;
}

const StoreLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    phone: '',
    otp: ''
  });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpUserId, setOtpUserId] = useState<string>('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check if user is already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('storeUser') || '{}');
    if (user.role === 'store') {
      navigate('/store');
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/store/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      const userId = (data.data && (data.data.userId || data.data.id)) || '';
      setOtpUserId(userId);
      setOtpSent(true);
      setShowOtpField(true);
      toast.success('OTP sent successfully', {
        style: { width: window.innerWidth < 640 ? '250px' : '350px' }
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to send OTP';
      setError(message);
      triggerErrorAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!otpUserId) {
  //     setError('Please request OTP again. (Missing User ID)');
  //     triggerErrorAnimation();
  //     return;
  //   }
  //   if (!formData.otp || formData.otp.length !== 4) {
  //     setError('Please enter a valid 4-digit OTP');
  //     triggerErrorAnimation();
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError('');
  //   try {
  //     const response = await fetch(`${API_CONFIG.BASE_URL}/store/verify-login`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ phone: formData.phone, otp: formData.otp, userId: otpUserId })
  //     });
  //     const data = await response.json();
  //     if (!response.ok || !data.success) {
  //       throw new Error(data.message || 'Invalid phone number or OTP');
  //     }

  //     const payload = data.data || data;
  //     const accessToken = payload.accessToken || payload.tokens?.accessToken;
  //     const refreshToken = payload.refreshToken || payload.tokens?.refreshToken;
  //     const user = payload.user || payload;

  //     if (!accessToken) throw new Error('Access token missing in response');

  //     localStorage.setItem('storeUser', JSON.stringify({ ...user, role: 'store', accessToken }));
  //     if (refreshToken) localStorage.setItem('storeRefreshToken', refreshToken);
  //     localStorage.setItem('accessToken', accessToken);

  //     toast.success('Login Successful', { style: { width: window.innerWidth < 640 ? '250px' : '350px' } });
  //     setTimeout(() => navigate('/store/live-orders'), 800);
  //   } catch (e) {
  //     const message = e instanceof Error ? e.message : 'Login failed';
  //     setError(message);
  //     triggerErrorAnimation();
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!otpUserId) {
      setError('Please request OTP again. (Missing User ID)');
      triggerErrorAnimation();
      return;
    }
    if (!formData.otp || formData.otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      triggerErrorAnimation();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/store/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          otp: formData.otp,
          userId: otpUserId
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid phone number or OTP');
      }

      const payload = data.data || data;
      const accessToken = payload.accessToken || payload.tokens?.accessToken;
      const refreshToken = payload.refreshToken || payload.tokens?.refreshToken;
      const user = payload.user || payload;

      if (!accessToken) throw new Error('Access token missing in response');

      // Save user info in localStorage
      localStorage.setItem('storeUser', JSON.stringify({ ...user, role: 'store' }));

      // Save tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('storeRefreshToken', refreshToken);

      // Save tokens in cookies
      Cookies.set('storeAccessToken', accessToken, {
        path: '/',
        secure: true,
        sameSite: 'Strict',
        expires: 1, // 1 day
      });

      if (refreshToken) {
        Cookies.set('storeRefreshToken', refreshToken, {
          path: '/',
          secure: true,
          sameSite: 'Strict',
          expires: 7, // 7 days
        });
      }

      toast.success('Login Successful', {
        style: { width: window.innerWidth < 640 ? '250px' : '350px' },
      });

      setTimeout(() => navigate('/store'), 800);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
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
          <div className="pt-8 px-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold tracking-tight text-white">Store Login</h1>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Phone Number
                </label>
                <div className="relative group bg-white flex items-center px-3 rounded-xl">
                  <svg className="h-5 w-5 text-gray-600 group-focus-within:text-green-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-[#fff0] focus:border-[#fff0] transition-all duration-300 pr-10 bg-white backdrop-blur-sm group-hover:bg-white group-hover:border-white/50 outline-none"
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
                          className="w-12 h-12 text-center text-lg font-semibold border-2 border-white/30 rounded-xl focus:ring-2  transition-all duration-300 bg-white backdrop-blur-sm outline-none"
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
                      <span className="flex gap-2">
                        Verify & Login
                        <LoginIcon />
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
                      setShowOtpField(false);
                      setFormData({ phone: '', otp: '' });
                      setOtpDigits(['', '', '', '']);
                      setOtpUserId('');
                    }}
                    className="text-sm text-white hover:underline font-medium transition-colors"
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

export default StoreLogin;
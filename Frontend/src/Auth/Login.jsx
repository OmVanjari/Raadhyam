import React, { useState, useRef, useEffect } from 'react';
import NavBarPage from "../WelcomePages/NavBarpage"
import FooterPage from "../WelcomePages/FooterPage"
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const canvasRef = useRef(null);

  // Check if user is already authenticated
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      // Verify token with backend and get user role
      const response = await axios.get("/api/check-auth", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.authenticated) {
        // Redirect based on user role
        const userRole = response.data.user?.role;
        if (userRole === 'admin') {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard/home";
        }
        return;
      }
      // If backend says not authenticated
      localStorage.removeItem("authToken");
    } catch (error) {
      // Token invalid / expired / route incorrect
      console.log("Auth check failed:", error);
      localStorage.removeItem("authToken");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Check for Google authentication callback
  const checkGoogleAuth = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get('token');
    const userData = urlParams.get('user');
    const googleError = urlParams.get('error');
    
    if (googleToken && userData) {
      try {
        // ✅ FIX: Store Google auth token in localStorage
        localStorage.setItem('authToken', googleToken);
        
        // Parse user data to get role
        const user = JSON.parse(decodeURIComponent(userData));
        const userRole = user.role;
        
        // ✅ FIX: Store user data in localStorage for future use
        localStorage.setItem('userData', JSON.stringify(user));
        
        // ✅ FIX: Clean URL parameters after storing
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect based on role from Google auth
        if (userRole === 'admin') {
          window.location.href = '/dashboard/admin';
        } else {
          window.location.href = '/dashboard/home';
        }
        return;
      } catch (error) {
        console.error("Error parsing user data:", error);
        setErrors({ general: 'Failed to process authentication data' });
      }
    }
    
    if (googleError) {
      setErrors({ general: `Google authentication failed: ${googleError}` });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // Check for token in URL parameters (for regular login redirects)
  const checkUrlToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');
    
    if (token && userData) {
      try {
        // ✅ FIX: Store token from URL parameters
        localStorage.setItem('authToken', token);
        
        // Parse and store user data
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('userData', JSON.stringify(user));
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect based on role
        if (user.role === 'admin') {
          window.location.href = '/dashboard/admin';
        } else {
          window.location.href = '/dashboard/home';
        }
      } catch (error) {
        console.error("Error processing URL token:", error);
      }
    }
  };

  // Initialize auth checks and CAPTCHA
  useEffect(() => {
    checkAuthStatus();
    checkGoogleAuth();
    checkUrlToken(); // ✅ ADDED: Check for token in URL
    generateCaptcha();
  }, []);

  // Generate CAPTCHA
  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaText(result);
    setErrors(prev => ({ ...prev, captcha: '' }));
  };

  // Draw CAPTCHA on canvas
  useEffect(() => {
    if (canvasRef.current && captchaText) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Musical gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(1, '#06B6D4');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add musical note symbols as noise
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
        ctx.font = '12px Arial';
        ctx.fillText('♪', Math.random() * canvas.width, Math.random() * canvas.height);
      }
      
      // Draw text with musical theme
      ctx.font = 'bold 20px "Arial", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      for (let i = 0; i < captchaText.length; i++) {
        const x = 25 + i * 20;
        const y = 20 + Math.random() * 6;
        const rotation = Math.random() * 0.3 - 0.15;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Text shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        // Gradient text
        const textGradient = ctx.createLinearGradient(-10, -10, 10, 10);
        textGradient.addColorStop(0, '#FFFFFF');
        textGradient.addColorStop(1, '#E5E7EB');
        ctx.fillStyle = textGradient;
        ctx.fillText(captchaText[i], 0, 0);
        ctx.restore();
      }
    }
  }, [captchaText]);

  // Clear errors when user types
  useEffect(() => {
    setErrors({});
    setSuccessMessage('');
  }, [formData, userCaptcha]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    // CAPTCHA validation
    if (!userCaptcha) {
      newErrors.captcha = 'CAPTCHA is required';
    } else if (userCaptcha !== captchaText) {
      newErrors.captcha = 'CAPTCHA verification failed';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/login/user', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });
      
      if (response.data.success) {
        setSuccessMessage('Login successful! Redirecting...');
        
        // ✅ FIX: Ensure token is stored
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          console.log('Token stored in localStorage:', response.data.token);
        }

        // ✅ FIX: Store user data as well
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }

        // Determine redirect path based on user role
        let redirectPath = '/dashboard/home'; // Default for regular users
        
        if (response.data.user?.role === 'admin') {
          redirectPath = '/dashboard/admin';
        }

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      
      if (error.response?.status === 400) {
        if (errorMessage === "Invalid login") {
          setErrors({ 
            general: 'No account found with this email. Please sign up first.',
            email: ' ' // Space to maintain layout
          });
        } else if (errorMessage === "Wrong password") {
          setErrors({ 
            general: 'Invalid email or password. Please check your credentials.',
            password: ' ' // Space to maintain layout
          });
        } else if (errorMessage === "Use Google Sign-In for this account") {
          setErrors({ 
            general: 'This email is registered with Google. Please use Google Sign-In.',
            email: ' '
          });
        } else {
          setErrors({ general: errorMessage });
        }
      } else if (error.response?.status === 403) {
        // Account not verified or suspended
        setErrors({ general: errorMessage });
      } else if (error.response?.status >= 500) {
        // Server error
        setErrors({ general: 'Server error. Please try again later.' });
      } else {
        // General error
        setErrors({ general: errorMessage });
      }
      
      // Regenerate CAPTCHA on error
      generateCaptcha();
      setUserCaptcha('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // ✅ FIX: Add a redirect parameter to come back to login page for token capture
    const redirectUrl = `${window.location.origin}/login`;
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  // Error message component
  const ErrorMessage = ({ message }) => (
    <div className="flex items-center gap-2 mt-1 text-red-300 text-xs animate-fadeIn">
      <span>⚠️</span>
      <span>{message}</span>
    </div>
  );

  // Success message component
  const SuccessMessage = ({ message }) => (
    <div className="flex items-center gap-2 p-3 mb-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm animate-fadeIn">
      <span>✅</span>
      <span>{message}</span>
    </div>
  );

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating musical notes */}
        <div className="absolute top-1/4 left-1/4 animate-float text-yellow-300 text-2xl">♪</div>
        <div className="absolute top-1/3 right-1/4 animate-float-delayed text-pink-300 text-3xl">♫</div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-slow text-green-300 text-2xl">♬</div>
        <div className="absolute top-1/2 right-1/3 animate-float-delayed-slow text-blue-300 text-3xl">♪</div>
        
        {/* Instrument silhouettes */}
        <div className="absolute -bottom-20 -left-20 opacity-10">
          <div className="text-8xl">🎸</div>
        </div>
        <div className="absolute -top-20 -right-20 opacity-10">
          <div className="text-8xl">🎹</div>
        </div>
      </div>

      <NavBarPage />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center w-full px-4 py-8 mt-16">
        {/* Main Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-xl border border-white/20 relative z-10">
          {/* Header with Musical Theme */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                <img src="/Logo.png" alt="Raadhyam Logo" className="h-12 w-auto" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-2">
              Raadhyam Login
            </h1>
            <p className="text-gray-300">Find your Rhythm, join the Raadhyam</p>
          </div>

          {/* Success Message */}
          {successMessage && <SuccessMessage message={successMessage} />}

          {/* General Error Message */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm animate-fadeIn">
              <span>❌</span>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2 group-hover:text-white transition-colors">
                <span className="flex items-center gap-2">
                  <span className="text-purple-300">✉️</span>
                  Email Address
                </span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 ${
                  errors.email || errors.general ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <ErrorMessage message={errors.email} />}
            </div>

            {/* Password Field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2 group-hover:text-white transition-colors">
                <span className="flex items-center gap-2">
                  <span className="text-purple-300">🔒</span>
                  Password
                </span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 ${
                  errors.password || errors.general ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && <ErrorMessage message={errors.password} />}
            </div>

            {/* CAPTCHA Section */}
            <div className="space-y-3 group">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="text-purple-300">🎼</span>
                    CAPTCHA Verification
                  </span>
                </label>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition duration-200 font-medium flex items-center gap-1"
                >
                  <span>🔄</span>
                  Refresh
                </button>
              </div>
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <canvas
                  ref={canvasRef}
                  width="150"
                  height="40"
                  className={`border rounded-xl backdrop-blur-sm flex-shrink-0 ${
                    errors.captcha ? 'border-red-400' : 'border-white/20'
                  }`}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value)}
                    placeholder="Enter CAPTCHA"
                    className={`w-full px-4 py-2 bg-white/5 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 ${
                      errors.captcha ? 'border-red-400' : 'border-white/20'
                  }`}
                    required
                  />
                  {errors.captcha && <ErrorMessage message={errors.captcha} />}
                </div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a 
                href="/forgot-password" 
                className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors duration-200 hover:underline"
              >
                Forgot your password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 disabled:cursor-not-allowed transition duration-300 font-medium transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl group"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <span className="group-hover:animate-bounce">🎵</span>
                    Sign In to the Music
                    <span className="group-hover:animate-bounce">🎶</span>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-300">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <div className="mt-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 px-4 rounded-xl hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed transition duration-300 font-medium transform hover:scale-105 disabled:scale-100"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <a href="/register" className="text-purple-300 hover:text-purple-200 font-medium transition-colors duration-200 hover:underline">
              Join the Orchestra
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <FooterPage />
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
        @keyframes float-delayed-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(90deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-float-delayed-slow {
          animation: float-delayed-slow 12s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
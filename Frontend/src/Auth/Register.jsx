import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const canvasRef = useRef(null);

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

  // Initialize CAPTCHA
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Clear errors when user types
  useEffect(() => {
    setErrors({});
    setSuccessMessage('');
  }, [formData, userCaptcha]);

  // Draw CAPTCHA on canvas
  useEffect(() => {
    if (canvasRef.current && captchaText) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Musical gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(1, '#06B6D4');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add musical note symbols as noise
      for (let i = 0; i < 15; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
        ctx.font = '10px Arial';
        ctx.fillText('♪', Math.random() * canvas.width, Math.random() * canvas.height);
      }
      
      // Draw text with musical theme
      const isMobile = window.innerWidth < 768;
      ctx.font = isMobile ? 'bold 16px "Arial", sans-serif' : 'bold 20px "Arial", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      for (let i = 0; i < captchaText.length; i++) {
        const x = isMobile ? 20 + i * 15 : 25 + i * 20;
        const y = isMobile ? 18 : 20;
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await axios.post('/api/register/user', {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });
      
      if (response.data.success) {
        setSuccessMessage('Registration successful! Welcome to Raadhyam!');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      
      if (error.response?.data?.field) {
        // Field-specific error from server
        setErrors({ [error.response.data.field]: errorMessage });
      } else if (error.response?.status === 409) {
        // Email already exists
        setErrors({ email: 'This email is already registered. Please use a different email or login.' });
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

  const handleGoogleSignUp = () => {
    window.location.href = '/api/auth/google';
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements - Reduced for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating musical notes - Hidden on small mobile */}
        <div className="hidden sm:block absolute top-1/4 left-1/4 animate-float text-yellow-300 text-xl sm:text-2xl">♪</div>
        <div className="hidden sm:block absolute top-1/3 right-1/4 animate-float-delayed text-pink-300 text-2xl sm:text-3xl">♫</div>
        <div className="hidden sm:block absolute bottom-1/4 left-1/3 animate-float-slow text-green-300 text-xl sm:text-2xl">♬</div>
        <div className="hidden sm:block absolute top-1/2 right-1/3 animate-float-delayed-slow text-blue-300 text-2xl sm:text-3xl">♪</div>
        
        {/* Smaller floating notes for mobile */}
        <div className="sm:hidden absolute top-1/6 left-1/6 animate-float text-yellow-300 text-lg">♪</div>
        <div className="sm:hidden absolute bottom-1/6 right-1/6 animate-float-delayed text-pink-300 text-lg">♫</div>
        
        {/* Instrument silhouettes - Smaller on mobile */}
        <div className="absolute -bottom-16 -left-16 sm:-bottom-20 sm:-left-20 opacity-5 sm:opacity-10">
          <div className="text-6xl sm:text-8xl">🎸</div>
        </div>
        <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 opacity-5 sm:opacity-10">
          <div className="text-6xl sm:text-8xl">🎹</div>
        </div>
      </div>

      {/* Main Register Card - Responsive sizing */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl sm:max-w-sm md:max-w-md lg:max-w-2xl border border-white/20 relative z-10">
        
        {/* Header with Musical Theme */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 rounded-full">
              <img src="/Logo.png" alt="Raadhyam Logo" className="h-8 sm:h-10 md:h-12" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-2">
            Join Raadhyam
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">Start your musical journey with us</p>
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

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          
          {/* Name Field */}
          <div className="group">
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2 group-hover:text-white transition-colors">
              <span className="flex items-center gap-1 sm:gap-2">
                <span className="text-purple-300 text-sm">👤</span>
                Full Name
              </span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/5 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 ${
                errors.name ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <ErrorMessage message={errors.name} />}
          </div>

          {/* Email Field */}
          <div className="group">
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2 group-hover:text-white transition-colors">
              <span className="flex items-center gap-1 sm:gap-2">
                <span className="text-purple-300 text-sm">✉️</span>
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
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/5 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 ${
                errors.email ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <ErrorMessage message={errors.email} />}
          </div>

          {/* Password Field */}
          <div className="group">
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2 group-hover:text-white transition-colors">
              <span className="flex items-center gap-1 sm:gap-2">
                <span className="text-purple-300 text-sm">🔒</span>
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
              minLength="6"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/5 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 ${
                errors.password ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="Create a password (min. 6 characters)"
            />
            {errors.password && <ErrorMessage message={errors.password} />}
          </div>

          {/* Confirm Password Field */}
          <div className="group">
            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2 group-hover:text-white transition-colors">
              <span className="flex items-center gap-1 sm:gap-2">
                <span className="text-purple-300 text-sm">✅</span>
                Confirm Password
              </span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/5 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 ${
                errors.confirmPassword ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}
          </div>

          {/* CAPTCHA Section */}
          <div className="space-y-2 sm:space-y-3 group">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="text-purple-300 text-sm">🎼</span>
                  CAPTCHA Verification
                </span>
              </label>
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white px-2 sm:px-3 py-1 rounded-lg transition duration-200 font-medium flex items-center gap-1"
              >
                <span className="text-xs">🔄</span>
                Refresh
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <canvas
                ref={canvasRef}
                width="120"
                height="35"
                className={`border rounded-lg sm:rounded-xl backdrop-blur-sm self-center sm:self-auto ${
                  errors.captcha ? 'border-red-400' : 'border-white/20'
                }`}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  placeholder="Enter CAPTCHA"
                  className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-white/5 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 ${
                    errors.captcha ? 'border-red-400' : 'border-white/20'
                  }`}
                  required
                />
                {errors.captcha && <ErrorMessage message={errors.captcha} />}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 disabled:cursor-not-allowed transition duration-300 font-medium transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl group text-sm sm:text-base"
          >
            <span className="flex items-center justify-center gap-1 sm:gap-2">
              {isLoading ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="group-hover:animate-bounce text-sm">🎵</span>
                  Join the Rhythm
                  <span className="group-hover:animate-bounce text-sm">🎶</span>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="mt-4 sm:mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-transparent text-gray-300">Or sign up with</span>
            </div>
          </div>

          {/* Google Sign-Up Button */}
          <div className="mt-3 sm:mt-4">
            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed transition duration-300 font-medium transform hover:scale-105 disabled:scale-100 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="text-purple-300 hover:text-purple-200 font-medium transition-colors duration-200 hover:underline">
            Sign in here
          </a>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.05); }
        }
        @keyframes float-delayed-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(90deg); }
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
        
        /* Mobile-first responsive design */
        @media (max-width: 640px) {
          .animate-float,
          .animate-float-delayed,
          .animate-float-slow,
          .animate-float-delayed-slow {
            animation-duration: 8s;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
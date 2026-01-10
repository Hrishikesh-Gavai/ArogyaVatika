import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const LoginPage = ({ onSwitchToRegister, onClose }) => {
  const [credentials, setCredentials] = useState({ username: '', pass: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(credentials);
    if (success) {
      onClose(); // Close modal after successful login
    } else {
      alert('Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 bg-gradient-to-br from-emerald-50 to-teal-100 fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          aria-label="Close login form"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 mx-auto mb-3 sm:mb-4 lg:mb-6 bg-emerald-100 rounded-full flex items-center justify-center shadow-md lg:shadow-lg">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-emerald-800 mb-1 sm:mb-2">Welcome Back</h2>
          <p className="text-emerald-600 mt-1 lg:mt-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">Sign in to your natural products account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <label className="block text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-2 sm:mb-3 lg:mb-4 text-emerald-700 font-serif">Username</label>
            <div className="relative">
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 pl-10 sm:pl-12 md:pl-14 lg:pl-16 border border-emerald-200 sm:border-2 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-emerald-300 focus:border-emerald-400 transition-all duration-200 sm:duration-300 bg-white text-emerald-900 placeholder-emerald-400 text-sm sm:text-base md:text-lg shadow-sm hover:shadow-md touch-manipulation"
                placeholder="Enter your username"
                required
              />
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-emerald-500 absolute left-3 sm:left-4 md:left-5 lg:left-6 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="mb-6 sm:mb-7 lg:mb-8">
            <label className="block text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-2 sm:mb-3 lg:mb-4 text-emerald-700 font-serif">Password</label>
            <div className="relative">
              <input
                type="password"
                value={credentials.pass}
                onChange={(e) => setCredentials({...credentials, pass: e.target.value})}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 pl-10 sm:pl-12 md:pl-14 lg:pl-16 border border-emerald-200 sm:border-2 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-emerald-300 focus:border-emerald-400 transition-all duration-200 sm:duration-300 bg-white text-emerald-900 placeholder-emerald-400 text-sm sm:text-base md:text-lg shadow-sm hover:shadow-md touch-manipulation"
                placeholder="Enter your password"
                required
              />
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-emerald-500 absolute left-3 sm:left-4 md:left-5 lg:left-6 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-2 sm:py-3 md:py-4 lg:py-5 px-4 sm:px-6 rounded-lg sm:rounded-xl lg:rounded-2xl font-medium sm:font-semibold transition-all duration-200 sm:duration-300 transform hover:scale-[1.02] sm:hover:scale-105 active:scale-95 focus:ring-2 sm:focus:ring-4 focus:ring-emerald-300 focus:ring-offset-2 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100 text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg sm:shadow-lg sm:hover:shadow-xl touch-manipulation min-h-[44px] sm:min-h-[48px]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In to Nature'
            )}
          </button>
        </form>
        
        <div className="mt-6 sm:mt-7 lg:mt-10 pt-4 sm:pt-5 lg:pt-8 border-t border-emerald-100">
          <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg text-emerald-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-emerald-700 hover:text-emerald-800 font-medium sm:font-semibold underline decoration-emerald-300 decoration-2 underline-offset-2 transition-colors duration-200 hover:decoration-4 focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded"
            >
              Join our natural community
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
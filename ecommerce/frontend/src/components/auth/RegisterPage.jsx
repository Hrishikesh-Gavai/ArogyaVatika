import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const RegisterPage = ({ onSwitchToLogin, onClose }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    pass: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await register(userData);
    if (success) {
      alert('Registration successful! Please login.');
      onClose(); // Close modal after successful registration
    } else {
      alert('Registration failed. Please try again.');
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
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 bg-gradient-to-br from-amber-50 to-orange-100 fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl overflow-hidden border border-amber-100 bg-gradient-to-br from-white to-amber-50 my-8">
        
        {/* Close Button - Mobile Optimized */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center transition-all duration-200 z-10 touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-300"
          aria-label="Close registration form"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 mx-auto mb-3 sm:mb-4 lg:mb-6 bg-amber-100 rounded-full flex items-center justify-center shadow-md lg:shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-amber-800 mb-1 sm:mb-2">Join Our Community</h2>
            <p className="text-amber-600 mt-1 lg:mt-2 text-xs sm:text-sm md:text-base lg:text-lg">Create your account for natural products</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            <div className="mb-3 sm:mb-4 lg:mb-5">
              <label className="block text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-1 sm:mb-2 lg:mb-3 text-amber-700 font-serif">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({...userData, username: e.target.value})}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 pl-9 sm:pl-11 md:pl-13 lg:pl-15 border border-amber-200 sm:border-2 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-3 lg:focus:ring-4 focus:ring-amber-300 focus:border-amber-400 transition-all duration-200 sm:duration-300 bg-white text-amber-900 placeholder-amber-400 text-sm sm:text-base md:text-lg shadow-sm hover:shadow-md touch-manipulation"
                  placeholder="Choose a username"
                  required
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-amber-500 absolute left-2.5 sm:left-3 md:left-4 lg:left-5 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="mb-3 sm:mb-4 lg:mb-5">
              <label className="block text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-1 sm:mb-2 lg:mb-3 text-amber-700 font-serif">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 pl-9 sm:pl-11 md:pl-13 lg:pl-15 border border-amber-200 sm:border-2 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-3 lg:focus:ring-4 focus:ring-amber-300 focus:border-amber-400 transition-all duration-200 sm:duration-300 bg-white text-amber-900 placeholder-amber-400 text-sm sm:text-base md:text-lg shadow-sm hover:shadow-md touch-manipulation"
                  placeholder="your.email@example.com"
                  required
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-amber-500 absolute left-2.5 sm:left-3 md:left-4 lg:left-5 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
            
            <div className="mb-4 sm:mb-5 lg:mb-6">
              <label className="block text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-1 sm:mb-2 lg:mb-3 text-amber-700 font-serif">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={userData.pass}
                  onChange={(e) => setUserData({...userData, pass: e.target.value})}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 pl-9 sm:pl-11 md:pl-13 lg:pl-15 border border-amber-200 sm:border-2 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-3 lg:focus:ring-4 focus:ring-amber-300 focus:border-amber-400 transition-all duration-200 sm:duration-300 bg-white text-amber-900 placeholder-amber-400 text-sm sm:text-base md:text-lg shadow-sm hover:shadow-md touch-manipulation"
                  placeholder="Create a secure password"
                  required
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-amber-500 absolute left-2.5 sm:left-3 md:left-4 lg:left-5 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white py-3 sm:py-4 md:py-5 px-4 sm:px-6 rounded-lg sm:rounded-xl lg:rounded-2xl font-medium sm:font-semibold transition-all duration-200 sm:duration-300 transform active:scale-95 focus:ring-2 sm:focus:ring-3 lg:focus:ring-4 focus:ring-amber-300 focus:ring-offset-2 disabled:opacity-50 disabled:transform-none text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg sm:shadow-lg sm:hover:shadow-xl touch-manipulation min-h-[44px] sm:min-h-[48px]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Join Natural Community'
              )}
            </button>
          </form>
          
          <div className="mt-4 sm:mt-6 lg:mt-8 pt-3 sm:pt-4 lg:pt-6 border-t border-amber-100">
            <p className="text-center text-xs sm:text-sm md:text-base text-amber-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-amber-700 hover:text-amber-800 font-medium sm:font-semibold underline decoration-amber-300 decoration-2 underline-offset-2 transition-colors duration-200 hover:decoration-4 touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-300 rounded"
              >
                Sign in here
              </button>
            </p>
          </div>
          
          <div className="mt-3 sm:mt-4 lg:mt-6 p-3 sm:p-4 md:p-5 bg-amber-50 rounded-lg sm:rounded-xl border border-amber-200">
            <p className="text-xs sm:text-sm md:text-base text-amber-700 text-center leading-relaxed">
              By joining, you agree to our sustainable practices and natural product guidelines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
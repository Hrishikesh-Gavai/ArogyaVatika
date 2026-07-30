import { ShoppingCart, User, LogOut, Leaf, Trees, Sprout } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-emerald-100/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section with Nature Theme */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-2xl shadow-lg">
              <Trees className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Natural Marketplace
              </h1>
              <p className="text-xs text-emerald-500 font-medium">Eco-Friendly & Sustainable</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex items-center gap-3">
            {user ? (
              <>
                {/* Welcome Message */}
                <div className="flex items-center gap-2 bg-emerald-50/80 px-4 py-2 rounded-full border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-700">
                    Welcome, {user.username}!
                  </span>
                </div>

                {/* Cart Button */}
                <button 
                  onClick={() => handleNavigation('/cart')}
                  className="flex items-center gap-2 px-4 py-2 text-emerald-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 group"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="font-medium">Cart</span>
                </button>

                {/* Dashboard Button */}
                <button 
                  onClick={() => handleNavigation('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 text-emerald-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 group"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </button>

                {/* Admin Panel (Conditional) */}
                {hasRole('ADMIN') && (
                  <button 
                    onClick={() => handleNavigation('/admin')}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-xl transition-all duration-200 group"
                  >
                    <Sprout className="w-5 h-5" />
                    <span className="font-medium">Admin</span>
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all duration-200 group"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              /* Guest User Buttons */
              <div className="flex gap-3">
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="px-6 py-2 text-emerald-700 hover:text-emerald-600 font-medium rounded-xl border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-200"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleNavigation('/register')}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-200/50 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Join Natural Community
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Decorative Nature Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-20 h-20 bg-emerald-200/30 rounded-full -translate-y-1/2 blur-xl"></div>
        <div className="absolute top-0 right-1/4 w-16 h-16 bg-teal-200/30 rounded-full -translate-y-1/2 blur-xl"></div>
      </div>

      {/* Floating Leaves Decoration */}
      <div className="absolute top-2 left-10 opacity-20">
        <Leaf className="w-4 h-4 text-emerald-500 animate-float" />
      </div>
      <div className="absolute top-3 right-20 opacity-30">
        <Leaf className="w-3 h-3 text-teal-500 animate-float" style={{ animationDelay: '1s' }} />
      </div>
    </header>
  );
};

export default Header;
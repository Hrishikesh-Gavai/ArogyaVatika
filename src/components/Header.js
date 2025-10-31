import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, Menu, X, User, LogIn, Shield, Moon, Sun, 
  Leaf, BarChart3, Calculator, Search, Recycle, 
  Lightbulb, Users, ShoppingCart, LogOut, GitBranch, Truck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // Check for logged-in user on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // Listen for storage changes (for logout in other tabs)
    const handleStorageChange = () => {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const features = [
    {
      icon: <Leaf size={18} />,
      title: 'Herbal Garden',
      path: '/garden',
    },
    {
      icon: <BarChart3 size={18} />,
      title: 'AI Garden Planner',
      path: '/planner',
    },
    {
      icon: <Calculator size={18} />,
      title: 'Carbon Calculator',
      path: '/carbon',
    },
    {
      icon: <Search size={18} />,
      title: 'AI Herb Search',
      path: '/search',
    },
    {
      icon: <Recycle size={18} />,
      title: 'DIY Zone',
      path: '/diy',
    },
    {
      icon: <Lightbulb size={18} />,
      title: 'Microlearning',
      path: '/learn',
    },
    {
      icon: <Users size={18} />,
      title: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: <ShoppingCart size={18} />,
      title: 'Marketplace',
      external: true,
      path: 'https://arogya-ecommerce.vercel.app/',
    },
    {
      icon: <GitBranch size={18} />,
      title: 'AVL Plant Editor',
      path: '/avl',
    },
    {
      icon: <Truck size={18} />,
      title: 'Delivery Routes',
      path: '/delivery',
    }
  ];

  const handleLogin = () => {
    navigate('/login', { state: { isAdmin: false, isSignup: false } });
  };

  const handleSignup = () => {
    navigate('/login', { state: { isAdmin: false, isSignup: true } });
  };

  const handleAdminLogin = () => {
    navigate('/login', { state: { isAdmin: true, isSignup: false } });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
    window.dispatchEvent(new Event('storage')); // Notify other components
  };

  return (
    <header className="header">
      <div className="container">
        {/* Logo on the left */}
        <div className="header-section">
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            <Sprout className="logo-icon" />
            <span>आरोग्यवाटिका</span>
          </Link>
        </div>

        {/* Actions on the right */}
        <div className="header-section">
          <div className="header-actions">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {currentUser ? (
              // Show user info and logout when logged in
              <div className="auth-buttons">
                <button 
                  className="btn-auth btn-auth-primary"
                  disabled
                  style={{ cursor: 'default', opacity: 1 }}
                >
                  {currentUser.role === 'admin' ? (
                    <Shield size={16} />
                  ) : (
                    <User size={16} />
                  )}
                  <span>{currentUser.username}</span>
                </button>
                <button 
                  className="btn-auth btn-auth-primary"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // Show auth buttons when not logged in
              <div className="auth-buttons">
                <button 
                  className="btn-auth btn-auth-primary"
                  onClick={handleLogin}
                  aria-label="Login"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
                <button 
                  className="btn-auth btn-auth-primary"
                  onClick={handleSignup}
                  aria-label="Sign up"
                >
                  <User size={16} />
                  <span>Sign Up</span>
                </button>
                <button 
                  className="btn-auth btn-auth-primary"
                  onClick={handleAdminLogin}
                  aria-label="Admin login"
                >
                  <Shield size={16} />
                  <span>Admin Login</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-content">
              <div className="dropdown-section">
                <h4>Platform Features</h4>
                <div className="features-grid">
                  {features.map((feature, index) => (
                    feature.external ? (
                      <a
                        key={index}
                        href={feature.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dropdown-feature"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="feature-icon-small">
                          {feature.icon}
                        </div>
                        <span>{feature.title}</span>
                      </a>
                    ) : (
                      <Link
                        key={index}
                        to={feature.path}
                        className="dropdown-feature"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="feature-icon-small">
                          {feature.icon}
                        </div>
                        <span>{feature.title}</span>
                      </Link>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

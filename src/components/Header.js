import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, User, LogIn, Moon, Sun, Leaf, BarChart3, Calculator, Search, Recycle, Lightbulb, Users, ShoppingCart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

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
      path: 'https://www.amazon.in/',
    }
  ];

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
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="auth-buttons">
              <button className="btn-auth">
                <LogIn size={16} />
                <span>Login</span>
              </button>
              <button className="btn-auth btn-auth-primary">
                <User size={16} />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
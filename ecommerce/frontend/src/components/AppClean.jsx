import React, { useState } from 'react';
import { ShoppingCart, User as UserIcon, LogOut, Leaf, Trees, Sprout, Menu, X, Search } from 'lucide-react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthProvider from './auth/AuthProvider';
import useAuth from '../hooks/useAuth';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import HomePage from './HomePage';
import UserDashboard from './user/UserDashboard';
import BusinessDashboard from './business/BusinessDashboard';
import AdminDashboard from './admin/AdminDashboard';
import ProductDetail from './product/ProductDetail';
import BusinessPublicPage from './product/BusinessPublicPage';

function Header({ onLogin, onRegister }) {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100/50 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5 rounded-xl">
                <Trees className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-serif font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  ArogyaVatika
                </h1>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <Search className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-emerald-100 text-emerald-700"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md border-b border-emerald-100 shadow-lg">
            <div className="p-4 space-y-4">
              {user ? (
                <>
                  {/* User Welcome */}
                  <div className="flex items-center gap-3 bg-emerald-50/80 px-3 py-2 rounded-lg border border-emerald-100 mb-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-700">
                      Hi, {user.username}!
                    </span>
                  </div>

                  {/* Mobile Navigation Links */}
                  <button 
                    onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="font-medium">Shopping Cart</span>
                  </button>

                  <button 
                    onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                  </button>

                  {hasRole('ROLE_ADMIN') && (
                    <button 
                      onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-all duration-200"
                    >
                      <Sprout className="w-4 h-4" />
                      <span className="font-medium">Admin Panel</span>
                    </button>
                  )}

                  <div className="border-t border-emerald-100 pt-3 mt-2">
                    <button
                      onClick={() => { logout(); navigate('/'); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Guest User Mobile Buttons */
                <div className="space-y-3">
                  <button 
                    onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                    className="w-full px-4 py-2 text-emerald-700 font-medium rounded-lg border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-200"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { onRegister(); setIsMobileMenuOpen(false); }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 shadow-lg transition-all duration-200"
                  >
                    Join Community
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-white/90 backdrop-blur-md shadow-lg border-b border-emerald-100/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-200">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-2xl shadow-lg">
                  <Trees className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                    ArogyaVatika Marketplace
                  </h1>
                  <p className="text-xs text-emerald-500 font-medium">Eco-Friendly & Sustainable</p>
                </div>
              </Link>
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
                    onClick={() => navigate('/cart')}
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
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 px-4 py-2 text-emerald-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 group"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </button>

                  {/* Admin Panel (Conditional) */}
                  {hasRole('ROLE_ADMIN') && (
                    <button 
                      onClick={() => navigate('/admin')}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-xl transition-all duration-200 group"
                    >
                      <Sprout className="w-5 h-5" />
                      <span className="font-medium">Admin</span>
                    </button>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={() => { logout(); navigate('/'); }}
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
                    onClick={onLogin}
                    className="px-6 py-2 text-emerald-700 hover:text-emerald-600 font-medium rounded-xl border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-200"
                  >
                    Login
                  </button>
                  <button 
                    onClick={onRegister}
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
    </>
  );
}

function InnerApp() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user, hasRole, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <Leaf className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-emerald-700 font-medium">Loading Natural Marketplace...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-amber-50/20 to-teal-50/30">
      <Header 
        onLogin={() => { setAuthMode('login'); setShowAuth(true); }} 
        onRegister={() => { setAuthMode('register'); setShowAuth(true); }} 
      />

      <main className="relative">
        {/* Background Nature Elements - Hidden on mobile for performance */}
        <div className="hidden lg:block fixed top-1/4 left-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="hidden lg:block fixed bottom-1/4 right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="hidden lg:block fixed top-1/2 left-1/2 w-24 h-24 bg-amber-200/20 rounded-full blur-3xl -z-10"></div>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/business-public/:businessId" element={<BusinessPublicPage />} />
          <Route path="/dashboard" element={user ? <UserDashboard /> : <HomePage />} />
          <Route path="/business-dashboard/:businessId" element={user ? <BusinessDashboard /> : <HomePage />} />
          <Route path="/admin" element={user && hasRole('ROLE_ADMIN') ? <AdminDashboard /> : <HomePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {showAuth && (
  <div className="fixed inset-0 bg-emerald-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="relative w-full max-w-md">
      <button
        onClick={() => setShowAuth(false)}
        className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg border border-emerald-200 hover:bg-emerald-50 transition-colors z-10"
      >
        <span className="text-emerald-600 font-semibold">×</span>
      </button>
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-emerald-100 overflow-hidden">
        {authMode === 'login' ? (
          <LoginPage 
            onSwitchToRegister={() => setAuthMode('register')} 
            onClose={() => setShowAuth(false)} // Add this
          />
        ) : (
          <RegisterPage 
            onSwitchToLogin={() => setAuthMode('login')} 
            onClose={() => setShowAuth(false)} // Add this
          />
        )}
      </div>
    </div>
  </div>
)}

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-emerald-100 mt-8 lg:mt-12">
        <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-3 lg:mb-4">
              <Trees className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600" />
              <span className="text-base lg:text-lg font-serif font-semibold text-emerald-700">Natural Marketplace</span>
            </div>
            <p className="text-emerald-600 text-sm lg:text-base max-w-2xl mx-auto mb-3 lg:mb-4 px-2">
              Connecting eco-conscious consumers with sustainable products from nature-loving creators and nursery owners.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 lg:gap-6 text-xs lg:text-sm text-emerald-500">
              <span className="flex items-center justify-center gap-1">🌱 Plant-based</span>
              <span className="flex items-center justify-center gap-1">♻️ Sustainable</span>
              <span className="flex items-center justify-center gap-1">🌍 Eco-friendly</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-emerald-100 shadow-lg z-40">
          <div className="flex justify-around items-center p-2">
            <button 
              onClick={() => navigate('/')}
              className="flex flex-col items-center gap-1 text-emerald-600 p-2 rounded-lg"
            >
              <Leaf className="w-4 h-4" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="flex flex-col items-center gap-1 text-emerald-400 p-2 rounded-lg relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs">Cart</span>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                0
              </span>
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex flex-col items-center gap-1 text-emerald-400 p-2 rounded-lg"
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-xs">Profile</span>
            </button>
            {hasRole('ROLE_ADMIN') && (
              <button 
                onClick={() => navigate('/admin')}
                className="flex flex-col items-center gap-1 text-amber-500 p-2 rounded-lg"
              >
                <Sprout className="w-4 h-4" />
                <span className="text-xs">Admin</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add padding to bottom for mobile nav */}
      {user && <div className="lg:hidden pb-16"></div>}
    </div>
  );
}

export default function AppClean() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
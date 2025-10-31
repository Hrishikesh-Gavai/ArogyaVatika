import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Shield, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../services/supabase';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;
  const isSignup = location.state?.isSignup || false;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tableName = isAdmin ? 'admins' : 'users';
      
      if (isSignup && !isAdmin) {
        // Sign up - Insert new user (only for regular users, not admin)
        const { data, error } = await supabase
          .from(tableName)
          .insert([
            {
              username: formData.username,
              password: formData.password,
            }
          ])
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            setError('Username already exists');
          } else {
            setError('Failed to create account. Please try again.');
          }
          setLoading(false);
          return;
        }

        // Signup successful
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          username: data.username,
          role: 'user'
        }));

        // Dispatch storage event for Header to update
        window.dispatchEvent(new Event('storage'));
        
        // Redirect to homepage
        navigate('/');
      } else {
        // Login - Query existing user
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('username', formData.username)
          .eq('password', formData.password)
          .single();

        if (error || !data) {
          setError('Invalid username or password');
          setLoading(false);
          return;
        }

        // Login successful
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          username: data.username,
          role: isAdmin ? 'admin' : 'user'
        }));

        // Dispatch storage event for Header to update
        window.dispatchEvent(new Event('storage'));
        
        // Redirect to homepage
        navigate('/');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isSignup) return 'Sign Up';
    if (isAdmin) return 'Admin Login';
    return 'User Login';
  };

  const getDescription = () => {
    if (isSignup) return 'Create your account to get started';
    return 'Enter your credentials to continue';
  };

  const getUsernamePlaceholder = () => {
    if (isSignup) return 'Set a username';
    return 'Enter your username';
  };

  const getPasswordPlaceholder = () => {
    if (isSignup) return 'Set a password';
    return 'Enter your password';
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              {isAdmin ? <Shield size={40} /> : <User size={40} />}
            </div>
            <h1>{getTitle()}</h1>
            <p>{getDescription()}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={getUsernamePlaceholder()}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={getPasswordPlaceholder()}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
            >
              {loading ? (isSignup ? 'Creating Account...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Login')}
            </button>

            <div className="login-footer">
              <button
                type="button"
                className="link-button"
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
              {!isAdmin && !isSignup && (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate('/login', { state: { isAdmin: false, isSignup: true } })}
                >
                  Create Account
                </button>
              )}
              {!isAdmin && isSignup && (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate('/login', { state: { isAdmin: false, isSignup: false } })}
                >
                  Already have an account? Login
                </button>
              )}
              {!isSignup && (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate('/login', { state: { isAdmin: true, isSignup: false } })}
                >
                  Admin Login
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
